'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { validate, parseTemplate } = require('../scripts/validate_prompts');
const { buildPromptsIndex, buildCollectionsIndex, writeIndexes } = require('../scripts/build_indexes');

const tempRoots = [];
test.after(() => {
  for (const root of tempRoots) fs.rmSync(root, { recursive: true, force: true });
});

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function validMeta(overrides = {}) {
  return {
    slug: 'okr-draft',
    title: 'OKR Draft',
    shortDescription: 'Draft OKRs.',
    surface: 'discovery',
    pmStage: 'Plans & Playbooks',
    complexity: 'Quick',
    outputType: 'OKR Framework',
    teamScale: 'Scaleup',
    tags: ['okr'],
    jobsToBeDone: ['Set goals'],
    inputs: [
      { key: 'team_name', label: 'Team', example: 'Payments' },
      { key: 'context', label: 'Context' },
    ],
    ...overrides,
  };
}

/** Creates a minimal valid content repo and returns its root. */
function makeRepo({ meta = validMeta(), prompt, collection } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pmnotes-test-'));
  tempRoots.push(root);
  const dir = path.join(root, 'prompts', meta.surface || 'discovery', meta.slug || 'okr-draft');
  writeJson(path.join(dir, 'meta.json'), meta);
  fs.writeFileSync(
    path.join(dir, 'prompt.md'),
    prompt ?? '# Task\nWrite OKRs for {{team_name}}.\n{{#if context}}Context: {{context}}{{/if}}\n',
  );
  fs.writeFileSync(path.join(dir, 'example.md'), '# Example\n');
  writeJson(
    path.join(root, 'collections', 'starter.json'),
    collection ?? {
      slug: 'starter',
      title: 'Starter',
      shortDescription: 'Start here.',
      description: 'A starter playbook.',
      category: 'playbook',
      difficulty: 'Quick',
      teamScale: 'Startup / SMB',
      tags: ['start'],
      prompts: [{ slug: 'discovery/okr-draft', order: 1, note: 'Begin.' }],
    },
  );
  return root;
}

function errorsFor(options) {
  return validate(makeRepo(options), { checkIndexes: false });
}

test('the real repository content is valid and indexes are current', () => {
  assert.deepEqual(validate(), []);
});

test('a minimal valid repo passes', () => {
  assert.deepEqual(errorsFor(), []);
});

test('rejects teamScale values the website does not accept', () => {
  const errors = errorsFor({ meta: validMeta({ teamScale: 'Startup' }) });
  assert.match(errors.join('\n'), /teamScale "Startup" must be one of/);
});

test('rejects unknown complexity', () => {
  const errors = errorsFor({ meta: validMeta({ complexity: 'Advanced' }) });
  assert.match(errors.join('\n'), /complexity "Advanced"/);
});

test('rejects slug and surface mismatches', () => {
  const root = makeRepo();
  const metaPath = path.join(root, 'prompts', 'discovery', 'okr-draft', 'meta.json');
  writeJson(metaPath, validMeta({ slug: 'other', surface: 'execution' }));
  const errors = validate(root, { checkIndexes: false }).join('\n');
  assert.match(errors, /slug "other" must equal folder name/);
  assert.match(errors, /surface "execution" must equal parent folder/);
});

test('rejects missing required fields and malformed arrays', () => {
  const meta = validMeta({ tags: 'okr', inputs: [{ key: 'Bad Key' }] });
  delete meta.outputType;
  const errors = errorsFor({ meta, prompt: 'No variables.' }).join('\n');
  assert.match(errors, /missing outputType/);
  assert.match(errors, /tags must be an array of strings/);
  assert.match(errors, /must be snake_case/);
  assert.match(errors, /label is required/);
});

test('validates optional and options on inputs', () => {
  const meta = validMeta({
    inputs: [
      { key: 'team_name', label: 'Team', optional: 'yes' },
      { key: 'context', label: 'Context', options: 'a,b' },
    ],
  });
  const errors = errorsFor({ meta }).join('\n');
  assert.match(errors, /optional must be a boolean/);
  assert.match(errors, /options must be an array of strings/);
});

test('flags placeholders without inputs and inputs never used', () => {
  const errors = errorsFor({ prompt: 'Hello {{team_name}} and {{unknown_var}}' }).join('\n');
  assert.match(errors, /uses \{\{unknown_var\}\} but meta.json has no input/);
  assert.match(errors, /input "context" is never used/);
});

test('flags unbalanced {{#if}} blocks', () => {
  const errors = errorsFor({ prompt: '{{team_name}} {{#if context}}{{context}}' }).join('\n');
  assert.match(errors, /not closed/);
});

test('flags collection links to prompts that do not exist', () => {
  const errors = errorsFor({
    collection: {
      slug: 'starter',
      title: 'Starter',
      shortDescription: 's',
      description: 'd',
      category: 'playbook',
      difficulty: 'Quick',
      tags: [],
      prompts: [
        { slug: 'prototyping/okr-draft', order: 1 },
        { slug: 'discovery/okr-draft', order: 1 },
      ],
    },
  }).join('\n');
  assert.match(errors, /"prototyping\/okr-draft" does not match any/);
  assert.match(errors, /duplicate order 1/);
});

test('flags unknown surface folders and duplicate slugs across surfaces', () => {
  const root = makeRepo();
  const dup = path.join(root, 'prompts', 'execution', 'okr-draft');
  writeJson(path.join(dup, 'meta.json'), validMeta({ surface: 'execution' }));
  fs.copyFileSync(path.join(root, 'prompts/discovery/okr-draft/prompt.md'), path.join(dup, 'prompt.md'));
  fs.writeFileSync(path.join(dup, 'example.md'), 'x');
  fs.mkdirSync(path.join(root, 'prompts', 'thinking'));
  const errors = validate(root, { checkIndexes: false }).join('\n');
  assert.match(errors, /slug also used by prompts\/discovery\/okr-draft/);
  assert.match(errors, /prompts\/thinking: unknown surface folder/);
});

test('detects stale indexes and passes once regenerated', () => {
  const root = makeRepo();
  assert.match(validate(root).join('\n'), /prompts\/index.json is missing/);
  writeIndexes(root);
  assert.deepEqual(validate(root), []);

  const metaPath = path.join(root, 'prompts', 'discovery', 'okr-draft', 'meta.json');
  writeJson(metaPath, validMeta({ title: 'Renamed' }));
  assert.match(validate(root).join('\n'), /prompts\/index.json is out of date/);

  const collectionPath = path.join(root, 'collections', 'starter.json');
  const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
  writeJson(collectionPath, { ...collection, title: 'Changed' });
  assert.match(validate(root).join('\n'), /collections\/index.json is out of date/);
});

test('parseTemplate handles plain and conditional variables', () => {
  const { variables, problems } = parseTemplate('{{a}} {{ b }} {{#if c}}{{d}}{{/if}} {{/if}}');
  assert.deepEqual([...variables].sort(), ['a', 'b', 'c', 'd']);
  assert.deepEqual(problems, ['{{/if}} without a matching {{#if}}']);
});

test('index builders are deterministic and carry metadata', () => {
  const root = makeRepo();
  const opts = { getUpdatedAt: () => '2026-01-01T00:00:00Z', now: () => 'NOW' };
  const index = buildPromptsIndex(root, opts);
  assert.deepEqual(index, buildPromptsIndex(root, opts));
  assert.equal(index.items[0].id, 'okr-draft');
  assert.equal(index.items[0].path, 'discovery/okr-draft');
  assert.equal(index.items[0].teamScale, 'Scaleup');
  assert.match(index.items[0].prompt, /\{\{team_name\}\}/);
  assert.equal(buildCollectionsIndex(root, opts).collections[0].slug, 'starter');
});
