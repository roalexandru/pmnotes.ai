const fs = require('fs');
const path = require('path');

const COLLECTIONS_DIR = __dirname;
const OUTPUT_FILE = path.join(COLLECTIONS_DIR, 'index.json');

function generateCollectionsIndex() {
    const files = fs.readdirSync(COLLECTIONS_DIR).filter(f => {
        return f.endsWith('.json') && f !== 'index.json';
    });

    const collections = [];

    files.forEach(file => {
        const filePath = path.join(COLLECTIONS_DIR, file);
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            collections.push(content);
        } catch (e) {
            console.warn(`Warning: Failed to parse ${file}: ${e.message}`);
        }
    });

    // Sort by title
    collections.sort((a, b) => a.title.localeCompare(b.title));

    const output = {
        generatedAt: new Date().toISOString(),
        collections
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Successfully generated collections index with ${collections.length} collections.`);
    console.log(`Output: ${OUTPUT_FILE}`);
}

generateCollectionsIndex();
