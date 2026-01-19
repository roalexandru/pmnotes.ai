const fs = require('fs');
const path = require('path');

const PROMPTS_ROOT = path.join(__dirname, '..', 'prompts');
const INDEX_PATH = path.join(PROMPTS_ROOT, 'index.json');
const REQUIRED_META_FIELDS = [
  'slug',
  'title',
  'shortDescription',
  'surface',
  'pmStage',
  'complexity'
];

function fail(errors) {
  if (errors.length) {
    const message = errors.map(error => `- ${error}`).join('\n');
    throw new Error(`Prompt validation failed:\n${message}`);
  }
}

function readJson(filePath, errors, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${label} is missing: ${path.relative(process.cwd(), filePath)}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    errors.push(`${label} is not valid JSON: ${path.relative(process.cwd(), filePath)}`);
    return null;
  }
}

function validateIndex(errors, promptDirs) {
  const index = readJson(INDEX_PATH, errors, 'index.json');
  if (!index) {
    return;
  }

  if (typeof index.generatedAt !== 'string' || !index.generatedAt) {
    errors.push('index.json must include generatedAt string');
  }

  if (!Array.isArray(index.items) || index.items.length === 0) {
    errors.push('index.json must include non-empty items array');
    return;
  }

  const seenIds = new Set();
  const pathsInIndex = new Set();
  for (const item of index.items) {
    if (!item || typeof item !== 'object') {
      errors.push('index item must be an object');
      continue;
    }
    if (!item.id || typeof item.id !== 'string') {
      errors.push('index item missing id');
    } else if (seenIds.has(item.id)) {
      errors.push(`duplicate id in index: ${item.id}`);
    } else {
      seenIds.add(item.id);
    }
    if (!item.path || typeof item.path !== 'string') {
      errors.push(`index item ${item.id || '<unknown>'} missing path`);
    } else {
      pathsInIndex.add(item.path);
    }
  }

  for (const promptPath of promptDirs) {
    if (!pathsInIndex.has(promptPath)) {
      errors.push(`index.json missing entry for ${promptPath}`);
    }
  }
}

function validatePrompts(errors) {
  if (!fs.existsSync(PROMPTS_ROOT)) {
    errors.push(`prompts directory missing: ${PROMPTS_ROOT}`);
    return [];
  }

  const categories = fs.readdirSync(PROMPTS_ROOT).filter(name => {
    return fs.statSync(path.join(PROMPTS_ROOT, name)).isDirectory();
  });

  const promptDirs = [];

  for (const category of categories) {
    const categoryPath = path.join(PROMPTS_ROOT, category);
    const slugs = fs.readdirSync(categoryPath).filter(name => {
      return fs.statSync(path.join(categoryPath, name)).isDirectory();
    });

    for (const slug of slugs) {
      const slugPath = path.join(categoryPath, slug);
      const relativeSlugPath = path.join(category, slug).replace(/\\/g, '/');
      promptDirs.push(relativeSlugPath);

      const promptPath = path.join(slugPath, 'prompt.md');
      if (!fs.existsSync(promptPath)) {
        errors.push(`prompt.md missing for ${relativeSlugPath}`);
      } else if (!fs.readFileSync(promptPath, 'utf8').trim()) {
        errors.push(`prompt.md is empty for ${relativeSlugPath}`);
      }

      const metaPath = path.join(slugPath, 'meta.json');
      const meta = readJson(metaPath, errors, `meta.json for ${relativeSlugPath}`);
      if (!meta) {
        continue;
      }

      for (const field of REQUIRED_META_FIELDS) {
        if (!meta[field]) {
          errors.push(`meta.json missing ${field} for ${relativeSlugPath}`);
        }
      }

      if (meta.slug && meta.slug !== slug) {
        errors.push(`meta.json slug mismatch for ${relativeSlugPath}: ${meta.slug}`);
      }

      if (meta.surface && meta.surface !== category) {
        errors.push(`meta.json surface mismatch for ${relativeSlugPath}: ${meta.surface}`);
      }
    }
  }

  if (promptDirs.length === 0) {
    errors.push('no prompt directories found under prompts/');
  }

  return promptDirs;
}

function main() {
  const errors = [];
  const promptDirs = validatePrompts(errors);
  validateIndex(errors, promptDirs);
  fail(errors);
  console.log('Prompt structure and index validation passed.');
}

main();
