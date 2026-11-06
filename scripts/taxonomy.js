'use strict';

// Allowed metadata values. Keep these in sync with the website's Zod schemas
// (pmnotes-website/src/schemas/prompt.ts): the site rejects values outside these lists.

const SURFACES = ['discovery', 'prototyping', 'execution'];
const COMPLEXITIES = ['Quick', 'Structured', 'Deep'];
const TEAM_SCALES = ['Startup / SMB', 'Scaleup', 'Enterprise'];
const COLLECTION_CATEGORIES = ['playbook', 'topic', 'foundation'];
// The kind of artifact a prompt produces (meta.json pmStage). The site groups and
// filters on these labels, so keep the list short and the spelling exact.
const PM_STAGES = [
  'Strategy & Decision Artifacts',
  'Research & Insight Reports',
  'Risk, Quality & Validation',
  'Requirements & Specifications',
  'Plans & Playbooks',
  'Product & UX Prototypes',
  'Code Templates & Schemas',
  'Automation & Scripts',
  'Data Analysis & Visualizations',
  'Messaging & Content',
];
// Fields the index builder computes; meta.json must not set them.
const RESERVED_META_KEYS = ['id', 'category', 'path', 'prompt', 'updatedAt'];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const INPUT_KEY_PATTERN = /^[a-z][a-z0-9_]*$/;
const PLACEHOLDER_PATTERN = /\{\{\s*([^{}]+?)\s*\}\}/g;

module.exports = {
  SURFACES,
  COMPLEXITIES,
  TEAM_SCALES,
  COLLECTION_CATEGORIES,
  PM_STAGES,
  RESERVED_META_KEYS,
  SLUG_PATTERN,
  INPUT_KEY_PATTERN,
  PLACEHOLDER_PATTERN,
};
