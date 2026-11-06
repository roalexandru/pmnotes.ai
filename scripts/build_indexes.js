'use strict';

// Builds the files the pmnotes website reads at runtime. Run: npm run index
//   prompts/index.json      prompt metadata (no bodies), loaded on every page
//   prompts/search.json     prompt bodies for full-text search, loaded lazily
//   collections/index.json  all collections
// Every output is a pure function of the files on disk (no git, no clock), so
// rebuilding unchanged content is a no-op and parallel PRs don't conflict.

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');

// The "# Ground Rules" section, from its heading to the next heading or the end of
// the file. It is the same boilerplate in every prompt, so it only adds noise to
// search. Same pattern as BOILERPLATE_SECTION in the website's src/lib/search.ts.
const BOILERPLATE_SECTION = /^#{1,6}[ \t]*Ground Rules[ \t]*$[\s\S]*?(?=^#{1,6}[ \t]|(?![\s\S]))/gim;

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

/** Prompt body as indexed for search: the Ground Rules boilerplate removed. */
function searchableBody(prompt) {
  return prompt.replace(BOILERPLATE_SECTION, '');
}

/**
 * First 12 hex chars of sha256(meta.json + "\n" + prompt.md), over the raw bytes.
 * Changes whenever either file changes; the website uses it to tell that a saved
 * draft was made from an older version of the template.
 * @param {Buffer} metaBytes
 * @param {Buffer} promptBytes
 */
function contentHash(metaBytes, promptBytes) {
  return crypto
    .createHash('sha256')
    .update(metaBytes)
    .update('\n')
    .update(promptBytes)
    .digest('hex')
    .slice(0, 12);
}

function readBytes(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath) : Buffer.alloc(0);
}

/**
 * Reads every prompt folder. Items carry the full `prompt` body; callers split it out.
 * @param {string} root repo root
 */
function readPrompts(root) {
  const promptsRoot = path.join(root, 'prompts');
  const items = [];

  for (const category of listDirs(promptsRoot)) {
    for (const slug of listDirs(path.join(promptsRoot, category))) {
      const slugPath = path.join(promptsRoot, category, slug);
      const metaPath = path.join(slugPath, 'meta.json');
      const metaBytes = readBytes(metaPath);
      const promptBytes = readBytes(path.join(slugPath, 'prompt.md'));

      let meta = {};
      if (metaBytes.length > 0) {
        try {
          meta = JSON.parse(metaBytes.toString('utf8'));
        } catch {
          console.warn(`Warning: failed to parse ${path.relative(root, metaPath)}`);
        }
      }

      // Computed fields go last so meta.json can't override them (the validator also rejects that).
      items.push({
        ...meta,
        id: slug,
        title: meta.title || slug,
        category,
        path: `${category}/${slug}`,
        tags: meta.tags || [],
        contentHash: contentHash(metaBytes, promptBytes),
        prompt: promptBytes.toString('utf8'),
      });
    }
  }
  return items;
}

/**
 * prompts/index.json: metadata for every prompt, without the `prompt` body.
 * @param {string} root repo root
 */
function buildPromptsIndex(root = REPO_ROOT) {
  return {
    items: readPrompts(root).map(item => {
      const rest = { ...item };
      delete rest.prompt;
      return rest;
    }),
  };
}

/**
 * prompts/search.json: `{ items: [{ id, prompt }] }` in index order, with the
 * Ground Rules section stripped from each body.
 * @param {string} root repo root
 */
function buildSearchIndex(root = REPO_ROOT) {
  return { items: readPrompts(root).map(item => ({ id: item.id, prompt: searchableBody(item.prompt) })) };
}

/**
 * @param {string} root repo root
 */
function buildCollectionsIndex(root = REPO_ROOT) {
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

  // Fixed locale so every machine and CI sorts the same way.
  collections.sort((a, b) => String(a.title).localeCompare(String(b.title), 'en'));
  return { collections };
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function writeIndexes(root = REPO_ROOT) {
  const prompts = buildPromptsIndex(root);
  writeJson(path.join(root, 'prompts', 'index.json'), prompts);
  console.log(`prompts/index.json: ${prompts.items.length} prompts`);

  const search = buildSearchIndex(root);
  writeJson(path.join(root, 'prompts', 'search.json'), search);
  console.log(`prompts/search.json: ${search.items.length} prompt bodies`);

  const collections = buildCollectionsIndex(root);
  writeJson(path.join(root, 'collections', 'index.json'), collections);
  console.log(`collections/index.json: ${collections.collections.length} collections`);
}

module.exports = {
  buildPromptsIndex,
  buildSearchIndex,
  buildCollectionsIndex,
  writeIndexes,
  contentHash,
  searchableBody,
  REPO_ROOT,
};

if (require.main === module) {
  writeIndexes();
}
