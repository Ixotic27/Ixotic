const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.join(__dirname, '../public/sequence_upscaled');
const OUTPUT_DIR = path.join(__dirname, '../public/sequence_optimized');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeSequence() {
    const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.webp'));
    console.log(`Optimizing ${files.length} frames for web...`);

    let totalSaved = 0;
    let oldTotal = 0;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const inputPath = path.join(INPUT_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file);

        const oldSize = fs.statSync(inputPath).size;
        oldTotal += oldSize;

        await sharp(inputPath)
            .resize({ width: 2560, withoutEnlargement: true }) // Downscale massive 4K to visually identical 2K (1440p)
            .webp({ quality: 80, effort: 6 }) // Premium high quality compression
            .toFile(outputPath);

        const newSize = fs.statSync(outputPath).size;
        totalSaved += (oldSize - newSize);
        
        process.stdout.write(`\rProgress: ${i + 1}/${files.length} frames optimized`);
    }

    console.log(`\n\n✅ Optimization Complete.`);
    console.log(`Saved ${(totalSaved / 1024 / 1024).toFixed(2)} MB in total payload size!`);
}

optimizeSequence().catch(console.error);
