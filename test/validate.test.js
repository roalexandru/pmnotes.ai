'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { validate, parseTemplate } = require('../scripts/validate_prompts');
const {
  buildPromptsIndex,
  buildSearchIndex,
  buildCollectionsIndex,
  writeIndexes,
  contentHash,
} = require('../scripts/build_indexes');

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

test('parseTemplate tracks which variables are guarded by their own {{#if}}, including nested blocks', () => {
  const { unguarded, problems } = parseTemplate('{{a}} {{#if b}}{{b}} {{#if c}}{{c}} {{b}}{{/if}}{{/if}} {{#if a}}{{d}}{{/if}}');
  assert.deepEqual([...unguarded].sort(), ['a', 'd']);
  assert.deepEqual(problems, []);
});

test('rejects optional inputs used outside their {{#if}} block', () => {
  const meta = validMeta({
    inputs: [
      { key: 'team_name', label: 'Team' },
      { key: 'context', label: 'Context', optional: true },
    ],
  });
  assert.deepEqual(errorsFor({ meta }), []);
  const errors = errorsFor({ meta, prompt: 'For {{team_name}}. Context: {{context}}' }).join('\n');
  assert.match(errors, /optional input \{\{context\}\} is used outside/);
});

test('rejects "(optional)" in labels, unknown pmStage values and reserved meta keys', () => {
  const errors = errorsFor({
    meta: validMeta({
      pmStage: 'Whatever',
      id: 'other-slug',
      inputs: [
        { key: 'team_name', label: 'Team' },
        { key: 'context', label: 'Context (optional)' },
      ],
    }),
  }).join('\n');
  assert.match(errors, /label says "\(optional\)"/);
  assert.match(errors, /pmStage "Whatever" must be one of/);
  assert.match(errors, /must not set "id"/);
});

test('index builders are deterministic and carry metadata', () => {
  const root = makeRepo();
  const index = buildPromptsIndex(root);
  assert.deepEqual(Object.keys(index), ['items']);
  assert.deepEqual(Object.keys(buildCollectionsIndex(root)), ['collections']);
  assert.equal(index.items[0].id, 'okr-draft');
  assert.equal(index.items[0].path, 'discovery/okr-draft');
  assert.equal(index.items[0].teamScale, 'Scaleup');
  assert.equal(index.items[0].updatedAt, undefined);
  assert.equal(buildCollectionsIndex(root).collections[0].slug, 'starter');
});

test('rebuilding is a pure function of the files', () => {
  const root = makeRepo();
  writeIndexes(root);
  const files = ['prompts/index.json', 'prompts/search.json', 'collections/index.json'];
  const first = files.map(file => fs.readFileSync(path.join(root, file), 'utf8'));
  writeIndexes(root);
  assert.deepEqual(files.map(file => fs.readFileSync(path.join(root, file), 'utf8')), first);

  // An identical copy elsewhere (different path, mtime, no git) builds identical indexes.
  const copy = fs.mkdtempSync(path.join(os.tmpdir(), 'pmnotes-test-'));
  tempRoots.push(copy);
  fs.cpSync(root, copy, { recursive: true });
  assert.deepEqual(buildPromptsIndex(copy), buildPromptsIndex(root));
  assert.deepEqual(buildSearchIndex(copy), buildSearchIndex(root));
});

test('contentHash is sha256(meta.json + "\\n" + prompt.md), first 12 hex chars', () => {
  const root = makeRepo();
  const dir = path.join(root, 'prompts', 'discovery', 'okr-draft');
  const meta = fs.readFileSync(path.join(dir, 'meta.json'));
  const prompt = fs.readFileSync(path.join(dir, 'prompt.md'));
  const expected = require('crypto')
    .createHash('sha256')
    .update(Buffer.concat([meta, Buffer.from('\n'), prompt]))
    .digest('hex')
    .slice(0, 12);
  const { contentHash: hash } = buildPromptsIndex(root).items[0];
  assert.match(hash, /^[0-9a-f]{12}$/);
  assert.equal(hash, expected);
  assert.equal(contentHash(meta, prompt), expected);

  fs.appendFileSync(path.join(dir, 'prompt.md'), 'One more line.\n');
  const afterPrompt = buildPromptsIndex(root).items[0].contentHash;
  assert.notEqual(afterPrompt, hash);

  writeJson(path.join(dir, 'meta.json'), validMeta({ title: 'Renamed' }));
  assert.notEqual(buildPromptsIndex(root).items[0].contentHash, afterPrompt);

  // example.md and variations.json don't affect it.
  const before = buildPromptsIndex(root).items[0].contentHash;
  fs.writeFileSync(path.join(dir, 'example.md'), '# Different example\n');
  assert.equal(buildPromptsIndex(root).items[0].contentHash, before);
});

test('prompts/index.json has no bodies; search.json has them without Ground Rules', () => {
  const prompt = [
    '# Task',
    'Write OKRs for {{team_name}}.',
    '{{#if context}}Context: {{context}}{{/if}}',
    '',
    '# Ground Rules',
    '',
    '- Do not invent metrics.',
    '',
    '# Output Format',
    'A table.',
    '',
  ].join('\n');
  const root = makeRepo({ prompt });
  const index = buildPromptsIndex(root);
  assert.equal('prompt' in index.items[0], false);

  const search = buildSearchIndex(root);
  assert.deepEqual(Object.keys(search), ['items']);
  assert.deepEqual(search.items.map(item => item.id), index.items.map(item => item.id));
  assert.deepEqual(Object.keys(search.items[0]), ['id', 'prompt']);
  const body = search.items[0].prompt;
  assert.match(body, /Write OKRs for \{\{team_name\}\}/);
  assert.match(body, /# Output Format\nA table\./);
  assert.doesNotMatch(body, /Ground Rules|invent metrics/);

  // Ground Rules as the last section is stripped to the end of the file.
  const tail = makeRepo({ prompt: 'Hi {{team_name}} {{#if context}}{{context}}{{/if}}\n## Ground Rules\n- rule\n' });
  assert.equal(buildSearchIndex(tail).items[0].prompt, 'Hi {{team_name}} {{#if context}}{{context}}{{/if}}\n');
});

test('detects a stale search.json', () => {
  const root = makeRepo();
  writeIndexes(root);
  fs.rmSync(path.join(root, 'prompts', 'search.json'));
  assert.match(validate(root).join('\n'), /prompts\/search.json is missing/);
  writeIndexes(root);
  fs.appendFileSync(path.join(root, 'prompts', 'discovery', 'okr-draft', 'prompt.md'), 'Extra.\n');
  const errors = validate(root).join('\n');
  assert.match(errors, /prompts\/search.json is out of date/);
  assert.match(errors, /prompts\/index.json is out of date/); // contentHash changed too
});

test('rejects contentHash in meta.json', () => {
  assert.match(errorsFor({ meta: validMeta({ contentHash: 'abc' }) }).join('\n'), /must not set "contentHash"/);
});

function variationsErrors(variations) {
  const root = makeRepo();
  const file = path.join(root, 'prompts', 'discovery', 'okr-draft', 'variations.json');
  if (typeof variations === 'string') fs.writeFileSync(file, variations);
  else writeJson(file, variations);
  return validate(root, { checkIndexes: false }).join('\n');
}

const variation = (name, promptDelta = 'Use a quarterly cadence.') => ({ name, description: `${name} style.`, promptDelta });

test('accepts valid variations.json', () => {
  assert.equal(variationsErrors([variation('Lean'), variation('Enterprise', 'Mention {{team_name}} by name.')]), '');
});

test('rejects malformed variations.json', () => {
  assert.match(variationsErrors('[{'), /variations.json is not valid JSON/);
  assert.match(variationsErrors({ name: 'x' }), /variations.json must be an array/);
  assert.match(variationsErrors([variation('Only one')]), /must have 2-4 entries \(has 1\)/);
  assert.match(variationsErrors(['A', 'B', 'C', 'D', 'E'].map(n => variation(n))), /must have 2-4 entries \(has 5\)/);
  const errors = variationsErrors([
    { name: 'Lean', description: '', promptDelta: 'x', extra: 1 },
    variation('lean'),
    'not an object',
  ]);
  assert.match(errors, /\[0\] description must be a non-empty string/);
  assert.match(errors, /\[0\] unknown field "extra"/);
  assert.match(errors, /\[1\] duplicate name "lean"/);
  assert.match(errors, /\[2\] must be an object/);
});

test('rejects unknown placeholders and template blocks in promptDelta', () => {
  const errors = variationsErrors([
    variation('A', 'Focus on {{unknown_key}}.'),
    variation('B', '{{#if context}}Use {{context}}.{{/if}}'),
  ]);
  assert.match(errors, /\[0\] promptDelta uses \{\{unknown_key\}\} but meta.json has no input/);
  assert.match(errors, /\[1\] promptDelta uses \{\{#if context\}\}.*not supported/);
  assert.match(errors, /\[1\] promptDelta uses \{\{\/if\}\}/);
});
