const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROMPTS_ROOT = path.join(__dirname, 'prompts');
const OUTPUT_FILE = path.join(PROMPTS_ROOT, 'index.json');

// Helper to get git timestamp
function getGitLastModified(filePath) {
    try {
        // %aI: author date, strict ISO 8601 format
        const date = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore'] // ignore stderr
        }).trim();
        return date || new Date().toISOString();
    } catch (e) {
        return new Date().toISOString();
    }
}

function generateIndex() {
    if (!fs.existsSync(PROMPTS_ROOT)) {
        console.error(`Prompts directory not found at: ${PROMPTS_ROOT}`);
        process.exit(1);
    }

    const categories = fs.readdirSync(PROMPTS_ROOT).filter(f => {
        return fs.statSync(path.join(PROMPTS_ROOT, f)).isDirectory();
    });

    const items = [];

    console.log(`Scanning ${categories.length} categories...`);

    categories.forEach(category => {
        const catDir = path.join(PROMPTS_ROOT, category);
        const slugs = fs.readdirSync(catDir).filter(f => {
            return fs.statSync(path.join(catDir, f)).isDirectory();
        });

        slugs.forEach(slug => {
            const slugPath = path.join(catDir, slug);
            const metaPath = path.join(slugPath, 'meta.json');

            let title = slug;
            let tags = [];
            let meta = {};

            // Read meta.json if exists
            if (fs.existsSync(metaPath)) {
                try {
                    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
                    title = meta.title || title;
                    tags = meta.tags || [];
                } catch (e) {
                    console.warn(`Warning: Failed to parse meta.json for ${slug}`);
                }
            }

            // Get last modified time from git history of the directory
            const updatedAt = getGitLastModified(slugPath);

            // Read prompt content for search indexing
            let promptContent = "";
            const promptPath = path.join(slugPath, 'prompt.md');
            if (fs.existsSync(promptPath)) {
                try {
                    promptContent = fs.readFileSync(promptPath, 'utf8');
                } catch (e) {
                    console.warn(`Warning: Failed to read prompt.md for ${slug}`);
                }
            }

            items.push({
                id: slug,
                title,
                category,
                path: `${category}/${slug}`,
                tags,
                updatedAt,
                prompt: promptContent,
                ...meta // include other meta fields if needed, but 'items' keeps it clean
            });
        });
    });

    const output = {
        generatedAt: new Date().toISOString(),
        items
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Successfully generated index.json with ${items.length} prompts.`);
    console.log(`Output: ${OUTPUT_FILE}`);
}

generateIndex();
