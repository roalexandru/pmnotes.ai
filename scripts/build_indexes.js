'use strict';

// Builds prompts/index.json and collections/index.json, the two files the
// pmnotes website reads at runtime. Run: npm run index

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

function gitLastModified(targetPath) {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%aI', '--', targetPath], {
      cwd: path.dirname(targetPath),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return date || null;
  } catch {
    return null;
  }
}

/**
 * @param {string} root repo root
 * @param {{ getUpdatedAt?: (dir: string) => string | null, now?: () => string }} [options]
 */
function buildPromptsIndex(root = REPO_ROOT, options = {}) {
  const getUpdatedAt = options.getUpdatedAt || gitLastModified;
  const now = options.now || (() => new Date().toISOString());
  const promptsRoot = path.join(root, 'prompts');
  const items = [];

  for (const category of listDirs(promptsRoot)) {
    for (const slug of listDirs(path.join(promptsRoot, category))) {
      const slugPath = path.join(promptsRoot, category, slug);
      const metaPath = path.join(slugPath, 'meta.json');
      const promptPath = path.join(slugPath, 'prompt.md');

      let meta = {};
      if (fs.existsSync(metaPath)) {
        try {
          meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        } catch {
          console.warn(`Warning: failed to parse ${path.relative(root, metaPath)}`);
        }
      }

      const prompt = fs.existsSync(promptPath) ? fs.readFileSync(promptPath, 'utf8') : '';

      items.push({
        id: slug,
        title: meta.title || slug,
        category,
        path: `${category}/${slug}`,
        tags: meta.tags || [],
        updatedAt: getUpdatedAt(slugPath) || now(),
        prompt,
        ...meta,
      });
    }
  }

  return { generatedAt: now(), items };
}

/**
 * @param {string} root repo root
 * @param {{ now?: () => string }} [options]
 */
function buildCollectionsIndex(root = REPO_ROOT, options = {}) {
  const now = options.now || (() => new Date().toISOString());
  const collectionsDir = path.join(root, 'collections');
  const files = fs.existsSync(collectionsDir)
    ? fs
        .readdirSync(collectionsDir)
        .filter(file => file.endsWith('.json') && file !== 'index.json')
        .sort()
    : [];

  const collections = [];
  for (const file of files) {
    try {
      collections.push(JSON.parse(fs.readFileSync(path.join(collectionsDir, file), 'utf8')));
    } catch (error) {
      console.warn(`Warning: failed to parse collections/${file}: ${error.message}`);
    }
  }

  collections.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  return { generatedAt: now(), collections };
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeIndexes(root = REPO_ROOT) {
  const prompts = buildPromptsIndex(root);
  writeJson(path.join(root, 'prompts', 'index.json'), prompts);
  console.log(`prompts/index.json: ${prompts.items.length} prompts`);

  const collections = buildCollectionsIndex(root);
  writeJson(path.join(root, 'collections', 'index.json'), collections);
  console.log(`collections/index.json: ${collections.collections.length} collections`);
}

module.exports = { buildPromptsIndex, buildCollectionsIndex, writeIndexes, REPO_ROOT };

if (require.main === module) {
  writeIndexes();
}
