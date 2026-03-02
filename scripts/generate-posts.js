const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'posts');
const OUTPUT_FILE = path.join(__dirname, '..', 'posts.json');

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }
  
  return frontmatter;
}

function getFirstParagraphs(content, maxLines = 5) {
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/, '');
  const lines = withoutFrontmatter.split('\n').filter(line => line.trim());
  return lines.slice(0, maxLines).join(' ');
}

function generatePosts() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  
  const posts = files.map(filename => {
    const content = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
    const frontmatter = parseFrontmatter(content);
    const slug = filename.replace('.md', '');
    
    if (!frontmatter) {
      console.warn(`No frontmatter found in ${filename}, skipping`);
      return null;
    }
    
    return {
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || '',
      excerpt: getFirstParagraphs(content)
    };
  }).filter(Boolean);
  
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`Generated ${posts.length} posts to posts.json`);
}

generatePosts();
