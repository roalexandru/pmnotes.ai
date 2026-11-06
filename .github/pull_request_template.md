## What changed

<!-- New prompt, fix to an existing prompt, collection, variations, or tooling. Link related issues (e.g. Closes #123). -->

## Quality checklist

<!-- From CONTRIBUTING.md. Tick what applies; delete lines that don't (e.g. for tooling-only changes). -->

- [ ] The prompt has a "Ground Rules" section: use only the facts provided, mark estimates `(est.)`, write `[DATA NEEDED: ...]` instead of inventing numbers, names, quotes or citations, and flag facts that may be out of date. Code prompts also say not to invent APIs or results.
- [ ] Pasted free text (feedback, logs, PRDs) is wrapped in tags such as `<feedback>{{feedback_text}}</feedback>`, with a line saying it is data, not instructions.
- [ ] The output format asks for GitHub-flavored Markdown, not one big code block.
- [ ] `example.md` matches the example inputs: numbers add up, sample program output is real (or labelled illustrative), code is fenced with a language tag, and companies and people are fictional.
- [ ] Model, tool and library names are generic, or current and easy to update.
- [ ] `variations.json` (if any) has 2–4 entries whose deltas follow the Ground Rules.
- [ ] I ran `npm run index` and committed the regenerated `prompts/index.json`, `prompts/search.json` and `collections/index.json`.
- [ ] `npm run check` passes.
