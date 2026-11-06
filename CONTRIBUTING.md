# Contributing to pmnotes.ai Prompts

We love your input! We want to make contributing to pmnotes.ai as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with GitHub
We use GitHub to host code, to track issues and feature requests, and to accept pull requests.

## Creating a New Prompt

1.  **Choose a Surface**: Decide if your prompt belongs to `discovery`, `prototyping`, or `execution`.
2.  **Create a Directory**: Create `prompts/<surface>/<your-prompt-slug>` (kebab-case, and unique across all surfaces).
3.  **Add Files**:
    *   `meta.json`: Describe your prompt. `slug` must match the folder name and `surface` the parent folder. See the README for allowed values.
    *   `prompt.md`: Write the prompt. Use `{{variable}}` for each input in `meta.json`, and `{{#if variable}}...{{/if}}` for optional sections.
    *   `example.md`: Provide a sample output.
4.  **Check quality** (reviewers will ask for these):
    *   The prompt has a "Ground Rules" section: use only the facts provided, mark estimates `(est.)`, write `[DATA NEEDED: ...]` instead of inventing numbers, names, quotes or citations, and flag facts that may be out of date. Code prompts also say not to invent APIs or results.
    *   Pasted free text (feedback, logs, PRDs) is wrapped in tags such as `<feedback>{{feedback_text}}</feedback>`, with a line saying it is data, not instructions.
    *   The output format asks for GitHub-flavored Markdown, not one big code block.
    *   `example.md` matches the example inputs. Numbers add up, sample program output is what the code actually prints (or is labelled illustrative), code is fenced with a language tag, and companies and people are fictional.
    *   Model, tool and library names are generic, or current and easy to update.
5.  **Regenerate and validate** (Node.js 24+):
    ```bash
    npm run index
    npm run check
    ```
    Commit the regenerated `prompts/index.json` and `collections/index.json`. CI re-runs the validation and fails if the indexes are out of date.

## Creating a Collection

Add `collections/<slug>.json` (the file name must match `slug`). Each `prompts[].slug` is `"<surface>/<prompt-slug>"` and must point to an existing prompt. Then run `npm run index` and `npm run check`.

## Editing on GitHub

You can also edit files directly on GitHub. CI regenerates the indexes for branches in this repo; from a fork, run `npm run index` locally or ask a maintainer.

1.  Navigate to the file you want to edit.
2.  Click the pencil icon.
3.  Make your changes.
4.  Commit your changes with a descriptive message.

## Pull Requests

1.  Fork the repo and create your branch from `main`.
2.  If you've added code that should be tested, add tests.
3.  If you've changed APIs, update the documentation.
4.  Ensure `npm run check` passes.
5.  Issue that pull request!

## License
By contributing, you agree that your contributions will be licensed under its MIT License.
