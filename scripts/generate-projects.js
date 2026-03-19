const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '..', 'projects');
const OUTPUT_FILE = path.join(__dirname, '..', 'projects.json');

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
      let value = line.slice(colonIndex + 1).trim();
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
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

function generateProjects() {
  const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.md'));
  
  const projects = files.map(filename => {
    const content = fs.readFileSync(path.join(PROJECTS_DIR, filename), 'utf-8');
    const frontmatter = parseFrontmatter(content);
    const slug = filename.replace('.md', '');
    
    if (!frontmatter) {
      console.warn(`No frontmatter found in ${filename}, skipping`);
      return null;
    }
    
    return {
      slug,
      title: frontmatter.title || slug,
      description: frontmatter.description || getFirstParagraphs(content),
      tech: frontmatter.tech || [],
      repo: frontmatter.repo || null
    };
  }).filter(Boolean);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));
  console.log(`Generated ${projects.length} projects to projects.json`);
}

generateProjects();
