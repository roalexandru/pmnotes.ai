'use strict';

// Allowed metadata values. Keep these in sync with the website's Zod schemas
// (pmnotes-website/src/schemas/prompt.ts): the site rejects values outside these lists.

const SURFACES = ['discovery', 'prototyping', 'execution'];
const COMPLEXITIES = ['Quick', 'Structured', 'Deep'];
const TEAM_SCALES = ['Startup / SMB', 'Scaleup', 'Enterprise'];
const COLLECTION_CATEGORIES = ['playbook', 'topic', 'foundation'];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const INPUT_KEY_PATTERN = /^[a-z][a-z0-9_]*$/;
const PLACEHOLDER_PATTERN = /\{\{\s*([^{}]+?)\s*\}\}/g;

module.exports = {
  SURFACES,
  COMPLEXITIES,
  TEAM_SCALES,
  COLLECTION_CATEGORIES,
  SLUG_PATTERN,
  INPUT_KEY_PATTERN,
  PLACEHOLDER_PATTERN,
};
