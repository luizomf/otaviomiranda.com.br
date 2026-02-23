import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, '../src/content/posts');

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(dirent => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

async function fix() {
  const files = await getFiles(postsDir);
  const mdFiles = files.filter(f => f.toLowerCase().endsWith('.md'));

  for (const file of mdFiles) {
    let content = await fs.readFile(file, 'utf8');
    let original = content;

    // Add 2 blank lines around any markdown image to break out of HTML blocks completely
    content = content.replace(/^(!\[[^\]]*\]\([^)]+\))/gm, '\n\n$1\n\n');

    if (content !== original) {
      await fs.writeFile(file, content, 'utf8');
      console.log(
        `✅ Spaced markdown images in: ${path.basename(path.dirname(file))}/${path.basename(file)}`,
      );
    }
  }
}
fix().catch(console.error);
