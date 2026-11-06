'use strict';

// Validates prompt folders (including optional variations.json), collections, and
// that the generated indexes are up to date. Run: npm run validate

const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const {
  SURFACES,
  COMPLEXITIES,
  TEAM_SCALES,
  COLLECTION_CATEGORIES,
  PM_STAGES,
  RESERVED_META_KEYS,
  SLUG_PATTERN,
  INPUT_KEY_PATTERN,
  PLACEHOLDER_PATTERN,
} = require('./taxonomy');
const { buildPromptsIndex, buildSearchIndex, buildCollectionsIndex, REPO_ROOT } = require('./build_indexes');

const REQUIRED_META_STRINGS = ['slug', 'title', 'shortDescription', 'surface', 'pmStage', 'complexity', 'outputType'];
const VARIATION_FIELDS = ['name', 'description', 'promptDelta'];
const MIN_VARIATIONS = 2;
const MAX_VARIATIONS = 4;
const REQUIRED_COLLECTION_STRINGS = ['slug', 'title', 'shortDescription', 'description', 'category', 'difficulty'];

const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0;
const isStringArray = value => Array.isArray(value) && value.every(isNonEmptyString);

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

function readJson(filePath, errors, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${label} is missing`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    errors.push(`${label} is not valid JSON (${error.message})`);
    return null;
  }
}

function checkEnum(errors, label, field, value, allowed) {
  if (value !== undefined && !allowed.includes(value)) {
    errors.push(`${label}: ${field} "${value}" must be one of: ${allowed.join(', ')}`);
  }
}

/**
 * Returns template variable names, handling {{key}}, {{#if key}} and {{/if}}
 * (blocks may nest), plus `guarded`: for each key, whether every {{key}} occurrence
 * sits inside an {{#if key}} block.
 */
function parseTemplate(template) {
  const variables = new Set();
  const unguarded = new Set();
  const problems = [];
  const openIfs = [];

  for (const match of template.matchAll(PLACEHOLDER_PATTERN)) {
    const expr = match[1];
    const ifMatch = expr.match(/^#if\s+([^\s]+)$/);
    if (ifMatch) {
      variables.add(ifMatch[1]);
      openIfs.push(ifMatch[1]);
    } else if (expr === '/if') {
      if (openIfs.length === 0) problems.push('{{/if}} without a matching {{#if}}');
      else openIfs.pop();
    } else if (/^[A-Za-z_][\w-]*$/.test(expr)) {
      variables.add(expr);
      if (!openIfs.includes(expr)) unguarded.add(expr);
    } else {
      problems.push(`unsupported template expression {{${expr}}}`);
    }
  }
  if (openIfs.length > 0) problems.push(`${openIfs.length} {{#if}} block(s) not closed with {{/if}}`);
  return { variables, unguarded, problems };
}

function validatePromptMeta(meta, { label, slug, surface }, errors) {
  for (const field of REQUIRED_META_STRINGS) {
    if (!isNonEmptyString(meta[field])) errors.push(`${label}: meta.json missing ${field}`);
  }
  if (meta.slug && meta.slug !== slug) errors.push(`${label}: meta.json slug "${meta.slug}" must equal folder name`);
  if (meta.surface && meta.surface !== surface) {
    errors.push(`${label}: meta.json surface "${meta.surface}" must equal parent folder "${surface}"`);
  }
  checkEnum(errors, label, 'complexity', meta.complexity, COMPLEXITIES);
  checkEnum(errors, label, 'pmStage', meta.pmStage, PM_STAGES);
  for (const key of RESERVED_META_KEYS) {
    if (key in meta) errors.push(`${label}: meta.json must not set "${key}" (computed by the index builder)`);
  }
  checkEnum(errors, label, 'teamScale', meta.teamScale, TEAM_SCALES);
  if (meta.featured !== undefined && typeof meta.featured !== 'boolean') {
    errors.push(`${label}: featured must be a boolean`);
  }
  if (!isStringArray(meta.tags)) errors.push(`${label}: tags must be an array of strings`);
  if (!isStringArray(meta.jobsToBeDone)) errors.push(`${label}: jobsToBeDone must be an array of strings`);

  const keys = new Set();
  const optionalKeys = new Set();
  if (!Array.isArray(meta.inputs)) {
    errors.push(`${label}: inputs must be an array`);
    return { keys, optionalKeys };
  }
  meta.inputs.forEach((input, i) => {
    if (!input || typeof input !== 'object') {
      errors.push(`${label}: inputs[${i}] must be an object`);
      return;
    }
    if (!isNonEmptyString(input.key) || !INPUT_KEY_PATTERN.test(input.key)) {
      errors.push(`${label}: inputs[${i}].key "${input.key}" must be snake_case`);
    } else if (keys.has(input.key)) {
      errors.push(`${label}: duplicate input key "${input.key}"`);
    } else {
      keys.add(input.key);
    }
    if (!isNonEmptyString(input.label)) errors.push(`${label}: inputs[${i}].label is required`);
    if (input.example !== undefined && typeof input.example !== 'string') {
      errors.push(`${label}: inputs[${i}].example must be a string`);
    }
    if (input.optional !== undefined && typeof input.optional !== 'boolean') {
      errors.push(`${label}: inputs[${i}].optional must be a boolean`);
    }
    if (input.optional === true && isNonEmptyString(input.key)) optionalKeys.add(input.key);
    if (isNonEmptyString(input.label) && /\(optional\)/i.test(input.label)) {
      errors.push(`${label}: inputs[${i}].label says "(optional)"; set "optional": true instead`);
    }
    if (input.options !== undefined && !isStringArray(input.options)) {
      errors.push(`${label}: inputs[${i}].options must be an array of strings`);
    }
  });
  return { keys, optionalKeys };
}

/**
 * variations.json: an array of 2-4 `{ name, description, promptDelta }` objects.
 * The website appends promptDelta verbatim to the user's filled-in draft ("Copy with
 * variation"), so it is not run through the template engine: {{#if}} blocks would
 * show up as literal text, and a {{key}} must at least name a real input.
 */
function validateVariations(variations, { label, inputKeys }, errors) {
  const where = `${label}/variations.json`;
  if (!Array.isArray(variations)) {
    errors.push(`${where} must be an array`);
    return;
  }
  if (variations.length < MIN_VARIATIONS || variations.length > MAX_VARIATIONS) {
    errors.push(`${where} must have ${MIN_VARIATIONS}-${MAX_VARIATIONS} entries (has ${variations.length})`);
  }
  const names = new Set();
  variations.forEach((variation, i) => {
    const item = `${where}: [${i}]`;
    if (!variation || typeof variation !== 'object' || Array.isArray(variation)) {
      errors.push(`${item} must be an object`);
      return;
    }
    for (const field of VARIATION_FIELDS) {
      if (!isNonEmptyString(variation[field])) errors.push(`${item} ${field} must be a non-empty string`);
    }
    for (const key of Object.keys(variation)) {
      if (!VARIATION_FIELDS.includes(key)) errors.push(`${item} unknown field "${key}"`);
    }
    if (isNonEmptyString(variation.name)) {
      const name = variation.name.trim().toLowerCase();
      if (names.has(name)) errors.push(`${item} duplicate name "${variation.name}"`);
      names.add(name);
    }
    if (typeof variation.promptDelta !== 'string') return;
    for (const match of variation.promptDelta.matchAll(PLACEHOLDER_PATTERN)) {
      const expr = match[1];
      if (/^[#/]/.test(expr)) {
        errors.push(`${item} promptDelta uses {{${expr}}}, but deltas are appended verbatim; template blocks are not supported`);
      } else if (!inputKeys.has(expr)) {
        errors.push(`${item} promptDelta uses {{${expr}}} but meta.json has no input with that key`);
      }
    }
  });
}

function validatePrompts(root, errors) {
  const promptsRoot = path.join(root, 'prompts');
  const promptPaths = new Set();
  const seenSlugs = new Map();

  if (!fs.existsSync(promptsRoot)) {
    errors.push('prompts/ directory is missing');
    return promptPaths;
  }

  for (const surface of listDirs(promptsRoot)) {
    if (!SURFACES.includes(surface)) {
      errors.push(`prompts/${surface}: unknown surface folder (allowed: ${SURFACES.join(', ')})`);
      continue;
    }
    for (const slug of listDirs(path.join(promptsRoot, surface))) {
      const label = `prompts/${surface}/${slug}`;
      const dir = path.join(promptsRoot, surface, slug);
      promptPaths.add(`${surface}/${slug}`);

      if (!SLUG_PATTERN.test(slug)) errors.push(`${label}: folder name must be kebab-case`);
      // The website routes prompts as /p/<slug>, so slugs must be unique across surfaces.
      if (seenSlugs.has(slug)) errors.push(`${label}: slug also used by prompts/${seenSlugs.get(slug)}/${slug}`);
      else seenSlugs.set(slug, surface);

      const promptFile = path.join(dir, 'prompt.md');
      const template = fs.existsSync(promptFile) ? fs.readFileSync(promptFile, 'utf8') : null;
      if (template === null) errors.push(`${label}: prompt.md is missing`);
      else if (!template.trim()) errors.push(`${label}: prompt.md is empty`);

      const exampleFile = path.join(dir, 'example.md');
      if (!fs.existsSync(exampleFile) || !fs.readFileSync(exampleFile, 'utf8').trim()) {
        errors.push(`${label}: example.md is missing or empty`);
      }

      const meta = readJson(path.join(dir, 'meta.json'), errors, `${label}/meta.json`);
      if (!meta) continue;
      const { keys: inputKeys, optionalKeys } = validatePromptMeta(meta, { label, slug, surface }, errors);

      if (template) {
        const { variables, unguarded, problems } = parseTemplate(template);
        for (const key of optionalKeys) {
          if (unguarded.has(key)) {
            errors.push(`${label}: optional input {{${key}}} is used outside {{#if ${key}}}...{{/if}}, so it would stay as literal text when left empty`);
          }
        }
        problems.forEach(problem => errors.push(`${label}: prompt.md ${problem}`));
        for (const variable of variables) {
          if (!inputKeys.has(variable)) errors.push(`${label}: prompt.md uses {{${variable}}} but meta.json has no input with that key`);
        }
        for (const key of inputKeys) {
          if (!variables.has(key)) errors.push(`${label}: input "${key}" is never used in prompt.md`);
        }
      }

      const variationsFile = path.join(dir, 'variations.json');
      if (fs.existsSync(variationsFile)) {
        const variations = readJson(variationsFile, errors, `${label}/variations.json`);
        if (variations !== null) validateVariations(variations, { label, inputKeys }, errors);
      }
    }
  }

  if (promptPaths.size === 0) errors.push('no prompt folders found under prompts/');
  return promptPaths;
}

function validateCollections(root, promptPaths, errors) {
  const dir = path.join(root, 'collections');
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'index.json').sort();
  const seen = new Set();

  for (const file of files) {
    const label = `collections/${file}`;
    const collection = readJson(path.join(dir, file), errors, label);
    if (!collection) continue;

    for (const field of REQUIRED_COLLECTION_STRINGS) {
      if (!isNonEmptyString(collection[field])) errors.push(`${label}: missing ${field}`);
    }
    if (collection.slug) {
      if (`${collection.slug}.json` !== file) errors.push(`${label}: slug "${collection.slug}" must match file name`);
      if (seen.has(collection.slug)) errors.push(`${label}: duplicate collection slug "${collection.slug}"`);
      seen.add(collection.slug);
    }
    checkEnum(errors, label, 'category', collection.category, COLLECTION_CATEGORIES);
    checkEnum(errors, label, 'difficulty', collection.difficulty, COMPLEXITIES);
    checkEnum(errors, label, 'teamScale', collection.teamScale, TEAM_SCALES);
    if (!isStringArray(collection.tags)) errors.push(`${label}: tags must be an array of strings`);
    for (const field of ['prerequisites', 'outcomes']) {
      if (collection[field] !== undefined && !isStringArray(collection[field])) {
        errors.push(`${label}: ${field} must be an array of strings`);
      }
    }

    if (!Array.isArray(collection.prompts) || collection.prompts.length === 0) {
      errors.push(`${label}: prompts must be a non-empty array`);
      continue;
    }
    const orders = new Set();
    collection.prompts.forEach((entry, i) => {
      const where = `${label}: prompts[${i}]`;
      if (!entry || !isNonEmptyString(entry.slug)) {
        errors.push(`${where} missing slug`);
        return;
      }
      if (!promptPaths.has(entry.slug)) errors.push(`${where} "${entry.slug}" does not match any prompts/<surface>/<slug> folder`);
      if (typeof entry.order !== 'number') errors.push(`${where} order must be a number`);
      else if (orders.has(entry.order)) errors.push(`${where} duplicate order ${entry.order}`);
      else orders.add(entry.order);
      if (entry.note !== undefined && typeof entry.note !== 'string') errors.push(`${where} note must be a string`);
      if (entry.optional !== undefined && typeof entry.optional !== 'boolean') errors.push(`${where} optional must be a boolean`);
    });
  }
}

function validateIndexes(root, errors) {
  // Both files are pure functions of the content, so freshness is a plain comparison.
  const generated = [
    ['prompts/index.json', buildPromptsIndex],
    ['prompts/search.json', buildSearchIndex],
  ];
  for (const [file, build] of generated) {
    const actual = readJson(path.join(root, file), errors, file);
    if (actual && !isDeepStrictEqual(actual, build(root))) {
      errors.push(`${file} is out of date: run \`npm run index\` and commit the result`);
    }
  }

  const collectionsIndex = readJson(path.join(root, 'collections', 'index.json'), errors, 'collections/index.json');
  if (collectionsIndex) {
    const expected = buildCollectionsIndex(root);
    if (!isDeepStrictEqual(collectionsIndex.collections, expected.collections)) {
      errors.push('collections/index.json is out of date: run `npm run index` and commit the result');
    }
  }
}

/** @returns {string[]} list of validation errors (empty when valid) */
function validate(root = REPO_ROOT, { checkIndexes = true } = {}) {
  const errors = [];
  const promptPaths = validatePrompts(root, errors);
  validateCollections(root, promptPaths, errors);
  if (checkIndexes) validateIndexes(root, errors);
  return errors;
}

module.exports = { validate, parseTemplate, validateVariations };

if (require.main === module) {
  const errors = validate();
  if (errors.length) {
    console.error(`Validation failed with ${errors.length} error(s):\n${errors.map(e => `- ${e}`).join('\n')}`);
    process.exit(1);
  }
  console.log('Prompts, collections, and indexes are valid.');
}
