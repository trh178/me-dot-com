const fs = require('fs');
const path = require('path');

const IDEAS_DIR = path.join(__dirname, '..', 'ideas');
const OUTPUT_FILE = path.join(__dirname, '..', 'ideas.json');

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

function generateIdeas() {
  const files = fs.readdirSync(IDEAS_DIR).filter(f => f.endsWith('.md'));
  
  const ideas = files.map(filename => {
    const content = fs.readFileSync(path.join(IDEAS_DIR, filename), 'utf-8');
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
      description: frontmatter.description || getFirstParagraphs(content)
    };
  }).filter(Boolean);

  ideas.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(ideas, null, 2));
  console.log(`Generated ${ideas.length} ideas to ideas.json`);
}

generateIdeas();
