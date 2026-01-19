# pmnotes.ai Prompts

Open-source collection of Product Management prompts for [pmnotes.ai](https://pmnotes.ai). This repository houses the prompt library used to power the pmnotes application, designed to assist Product Managers in various stages of their workflow.

## Repository Structure

The repository is organized to separate prompt metadata, templates, and example outputs.

```
prompts/
├── <surface>/              # e.g., thinking, builder, executor
│   ├── <prompt-slug>/      # Unique identifier for the prompt
│   │   ├── meta.json       # Metadata (title, inputs, tags, etc.)
│   │   ├── prompt.md       # The actual prompt template
│   │   └── example.md      # Example output for the prompt
│   └── ...
collections/                # (Optional) Curated lists of prompts
    └── ...
```

### Surfaces
Prompts are categorized into three core workflows:
- **Discovery** (folder: `thinking`): Strategy, user research, and problem definition (e.g., Drafting PRDs, analyzing feedback).
- **Prototyping** (folder: `builder`): Building functional prototypes and data models (e.g., Generating schema, frontend components).
- **Execution** (folder: `executor`): Automating technical tasks and migrations (e.g., Data analysis, repo-wide refactors).

## Prompt Structure

Each prompt is a directory containing three essential files:

### 1. `meta.json`
Defines the structure and properties of the prompt.
```json
{
    "slug": "feature-prioritization",
    "title": "Feature Prioritization",
    "shortDescription": "Prioritize features using a framework like RICE or MoSCoW.",
    "surface": "thinking",
    "pmStage": "Product Planning",
    "complexity": "Intermediate",
    "outputType": "Prioritized List",
    "tags": ["prioritization", "roadmap"],
    "jobsToBeDone": ["Rank feature backlog"],
    "inputs": [
        {
            "key": "feature_list",
            "label": "Feature List",
            "example": "Dark mode, Offline support..."
        }
    ]
}
```

### 2. `prompt.md`
The prompt template itself. It uses Handlebars-style syntax `{{variable_name}}` for dynamic inputs defined in `meta.json`.

```markdown
# Role
You are a Senior Product Manager...

# Task
Prioritize the following features: {{feature_list}}
...
```

### 3. `example.md`
A static example of what the Large Language Model (LLM) should generate, used for preview and validation.

## Contributing

We welcome contributions from the community! Whether you have a new prompt idea or want to improve an existing one, please check out our [Contribution Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
