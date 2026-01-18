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

1.  **Choose a Surface**: Decide if your prompt belongs to `thinking`, `builder`, or `executor`.
2.  **Create a Directory**: Create a new folder in `prompts/<surface>/<your-prompt-slug>`.
3.  **Add Files**:
    *   `meta.json`: Describe your prompt. Ensure the `slug` matches your directory name.
    *   `prompt.md`: Write the prompt. Use `{{variable}}` for dynamic inputs.
    *   `example.md`: Provide a sample output.
4.  **Test**: Verify your JSON is valid and your markdown renders correctly.

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
4.  Ensure the test suite passes.
5.  Issue that pull request!

## License
By contributing, you agree that your contributions will be licensed under its MIT License.
