/**
 * iLoveAPI Bulk Image Upscaler
 * 
 * This script formally uses the iLoveAPI to batch upscale all images in a directory.
 * Because we are doing this officially via the API, there is no need for incognito tricks 
 * and no risk of getting blocked.
 * 
 * Prerequisites:
 * 1. npm install jsonwebtoken axios form-data
 * 2. Get your Public Key and Secret Key from https://www.iloveapi.com/user/projects
 * 
 * Usage:
 * node scripts/upscale-sequence.js
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp'); // Added for WebP -> PNG fallback

// 🔴 ENTER YOUR API CREDENTIALS HERE
const PUBLIC_KEY = process.env.ILOVEPDF_PUBLIC_KEY ?? "";

const INPUT_DIR = path.join(__dirname, '../public/sequence');
const OUTPUT_DIR = path.join(__dirname, '../public/sequence_upscaled');

let activeToken = null;

// Helper to get token from iLoveAPI Auth Server
async function getToken(forceRefresh = false) {
    if (activeToken && !forceRefresh) return activeToken;
    try {
        const res = await axios.post('https://api.ilovepdf.com/v1/auth', { public_key: PUBLIC_KEY });
        activeToken = res.data.token;
        return activeToken;
    } catch (e) {
        console.error("Auth Error:", e.response?.data || e.message);
        throw new Error("Failed to authenticate with iLoveAPI.");
    }
}

async function apiRequest(method, endpoint, data = null, headers = {}) {
    const token = await getToken();
    try {
        const response = await axios({
            method: method,
            url: `https://api.ilovepdf.com/v1${endpoint}`,
            data: data,
            headers: {
                ...headers,
                'Authorization': `Bearer ${token}`
            },
            responseType: endpoint.includes('download') ? 'arraybuffer' : 'json'
        });
        return response.data;
    } catch (error) {
        // If the token expired mid-batch, clear it so the next request grabs a fresh one
        if (error.response?.status === 401) {
            activeToken = null;
        }
        console.error(`API Error on ${endpoint}:`, error.response?.data || error.message);
        throw error;
    }
}

async function upscaleImage(filePath, outputFilePath) {
    console.log(`\n⏳ Processing: ${path.basename(filePath)}`);

    // 0. iLoveAPI upscaleimage crashes on WebP, so we convert to PNG in-memory first
    const pngBuffer = await sharp(filePath).png().toBuffer();
    const tempFilename = path.basename(filePath).replace('.webp', '.png');

    // 1. Start a highly-specific Image Upscale Task
    const startRes = await apiRequest('GET', '/start/upscaleimage');
    const serverUrl = `https://${startRes.server}/v1`;
    const taskId = startRes.task;
    console.log(`   ✓ Task started [ID: ${taskId}]`);

    // 2. Upload the file (PNG Buffer)
    const form = new FormData();
    form.append('task', taskId);
    form.append('file', pngBuffer, { filename: tempFilename, contentType: 'image/png' });

    const uploadRes = await axios.post(`${serverUrl}/upload`, form, {
        headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${await getToken()}`
        }
    });
    const serverFilename = uploadRes.data.server_filename;
    console.log(`   ✓ File uploaded (${tempFilename})`);

    // 3. Process the file (4x Upscale via AI)
    await axios.post(`${serverUrl}/process`, {
        task: taskId,
        tool: 'upscaleimage',
        files: [{
            server_filename: serverFilename,
            filename: tempFilename
        }],
        multiplier: 4 // upscale factor
    }, {
        headers: { 'Authorization': `Bearer ${await getToken()}` }
    });
    console.log(`   ✓ AI Processing complete`);

    // 4. Download the upscaled PNG result
    const downloadRes = await axios.get(`${serverUrl}/download/${taskId}`, {
        headers: { 'Authorization': `Bearer ${await getToken()}` },
        responseType: 'arraybuffer'
    });
    
    // 5. Convert the massive 4K PNG back into a compressed WebP for layout performance
    await sharp(Buffer.from(downloadRes.data))
        .webp({ quality: 85 })
        .toFile(outputFilePath);

    console.log(`   ✅ Saved upscaled webp to: ${outputFilePath}`);
}

async function run() {
    if (PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        console.log("❌ Please insert your PUBLIC_KEY and SECRET_KEY at the top of the script.");
        return;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = fs.readdirSync(INPUT_DIR)
        .filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'))
        .sort(); // Process in order

    console.log(`🚀 Starting batch upscale for ${files.length} images...`);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const inputPath = path.join(INPUT_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file);

        console.log(`\n--- File ${i + 1} of ${files.length} ---`);

        // Skip files that have already been upscaled perfectly
        if (fs.existsSync(outputPath)) {
            console.log(`⏩ Skipping ${file} (Already processed)`);
            continue;
        }

        try {
            await upscaleImage(inputPath, outputPath);
        } catch (err) {
            console.error(`❌ Failed on ${file}, skipping to next...`);
        }

        // Minor delay to prevent aggressive rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("\n🎉 All upscaling complete. Check the /public/sequence_upscaled/ folder.");
}

run();
