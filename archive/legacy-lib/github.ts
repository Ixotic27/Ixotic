export async function getRepoLastPushed(owner: string, repo: string): Promise<string> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    
    if (!res.ok) return new Date().getFullYear().toString();
    
    const data = await res.json();
    return new Date(data.pushed_at).getFullYear().toString();
  } catch (error) {
    return new Date().getFullYear().toString();
  }
}

export async function getAllRepos(owner: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${owner}/repos?sort=pushed&per_page=20`, {
      headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
      next: { revalidate: 86400 }
    });
    
    if (!res.ok) return [];
    
    return res.json();
  } catch (error) {
    console.error("Failed to fetch repos", error);
    return [];
  }
}
