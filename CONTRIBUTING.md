# Contributing to pmnotes.ai Prompts

We love your input! We want to make contributing to pmnotes.ai as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github
We use github to host code, to track issues and feature requests, and to accept pull requests.

## Creating a New Prompt

1.  **Choose a Surface**: Decide if your prompt belongs to `discovery`, `prototyping`, or `execution`.
2.  **Create a Directory**: Create `prompts/<surface>/<your-prompt-slug>` (kebab-case, and unique across all surfaces).
3.  **Add Files**:
    *   `meta.json`: Describe your prompt. `slug` must match the folder name and `surface` the parent folder. See the README for allowed values.
    *   `prompt.md`: Write the prompt. Use `{{variable}}` for each input in `meta.json`, and `{{#if variable}}...{{/if}}` for optional sections.
    *   `example.md`: Provide a sample output.
4.  **Regenerate and validate** (Node.js 24+):
    ```bash
    npm run index
    npm run check
    ```
    Commit the regenerated `prompts/index.json` and `collections/index.json`. CI re-runs the validation and fails if the indexes are out of date.

## Creating a Collection

Add `collections/<slug>.json` (the file name must match `slug`). Each `prompts[].slug` is `"<surface>/<prompt-slug>"` and must point to an existing prompt. Then run `npm run index` and `npm run check`.

## Drag and Drop Updates

You can also edit files directly on GitHub.

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
