#!/usr/bin/env node
/**
 * Changelog Markdown → JSON Converter
 * Converts changelog.md to changelog.json
 *
 * Usage: node build-changelog.js
 * Or: npm run build
 */

const fs = require('fs');
const path = require('path');

const CHANGELOG_MD = path.join(__dirname, 'changelog.md');
const CHANGELOG_JSON = path.join(__dirname, 'changelog.json');

function parseMarkdown(markdown) {
  const lines = markdown.split('\n');
  const entries = [];
  let todos = [];

  let currentEntry = null;
  let currentCategory = null;
  let inComingSoon = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and header
    if (!line || line.startsWith('#') && line.includes('POKPOK Changelog')) continue;
    if (line.startsWith('>') && !line.includes('**Note:**')) continue;
    if (line === '---') continue;

    // Date header (## 2026-02-02)
    if (line.match(/^##\s+(\d{4}-\d{2}-\d{2})$/)) {
      const date = line.replace(/^##\s+/, '');

      // Save previous entry
      if (currentEntry) {
        entries.push(currentEntry);
      }

      currentEntry = {
        date,
        changes: {
          fixed: [],
          added: [],
          changed: [],
          documentation: []
        }
      };
      currentCategory = null;
      inComingSoon = false;
      continue;
    }

    // Coming Soon header
    if (line.match(/^##\s+Coming Soon$/)) {
      // Save previous entry
      if (currentEntry) {
        entries.push(currentEntry);
        currentEntry = null;
      }
      inComingSoon = true;
      continue;
    }

    // Category header (### FIXED)
    if (line.match(/^###\s+([A-Z\s]+)$/)) {
      const category = line.replace(/^###\s+/, '').toLowerCase().replace(/\s+/g, '_');

      if (inComingSoon) {
        currentCategory = 'todo';
      } else {
        currentCategory = category === 'to_be_fixed' ? null : category;
      }
      continue;
    }

    // List item (- Item text)
    if (line.startsWith('-')) {
      const text = line.replace(/^-\s+/, '');

      if (inComingSoon) {
        todos.push(text);
      } else if (currentEntry && currentCategory) {
        currentEntry.changes[currentCategory].push(text);
      }
      continue;
    }

    // Note (> **Note:** text)
    if (line.startsWith('>') && line.includes('**Note:**')) {
      const note = line.replace(/^>\s*/, '').replace(/\*\*Note:\*\*\s*/, '');
      if (currentEntry) {
        currentEntry.changes.note = note;
      }
      continue;
    }
  }

  // Save last entry
  if (currentEntry) {
    entries.push(currentEntry);
  }

  return { entries, todo: todos };
}

function main() {
  console.log('🔨 Building changelog.json from changelog.md...');

  // Read markdown
  if (!fs.existsSync(CHANGELOG_MD)) {
    console.error('❌ changelog.md not found!');
    process.exit(1);
  }

  const markdown = fs.readFileSync(CHANGELOG_MD, 'utf-8');

  // Parse to JSON structure
  const data = parseMarkdown(markdown);

  // Write JSON
  fs.writeFileSync(CHANGELOG_JSON, JSON.stringify(data, null, 2));

  console.log('✅ Generated changelog.json');
  console.log(`   ${data.entries.length} entries`);
  console.log(`   ${data.todo.length} todo items`);
}

main();
