#!/bin/bash

# Script to update README with current visual testing status
# This script inserts the current snapshot overview into the README

README_FILE="README.md"
VISUAL_OVERVIEW_FILE="VISUAL_TESTING_OVERVIEW.md"
SNAPSHOT_REPORT="SNAPSHOT_REPORT.md"

echo "📖 Updating README with visual testing overview..."

# First, generate the snapshot report if it doesn't exist
if [ ! -f "$SNAPSHOT_REPORT" ]; then
    echo "🔍 Generating snapshot report first..."
    ./view-snapshots.sh
fi

# Check if snapshots exist
SNAPSHOTS_DIR="tests/basic.spec.ts-snapshots"
if [ ! -d "$SNAPSHOTS_DIR" ]; then
    echo "⚠️  No snapshots found. Run 'npm run test:e2e:update-snapshots' first"
    exit 1
fi

# Count snapshots
CHROMIUM_COUNT=$(ls "$SNAPSHOTS_DIR"/*Chromium*.png 2>/dev/null | wc -l)
FIREFOX_COUNT=$(ls "$SNAPSHOTS_DIR"/*Firefox*.png 2>/dev/null | wc -l)
WEBKIT_COUNT=$(ls "$SNAPSHOTS_DIR"/*WebKit*.png 2>/dev/null | wc -l)
TOTAL_SNAPSHOTS=$((CHROMIUM_COUNT + FIREFOX_COUNT + WEBKIT_COUNT))

# Categories
MAIN_WORKFLOW=$(ls "$SNAPSHOTS_DIR"/[0-9][0-9]-*.png 2>/dev/null | wc -l)
NDA_TESTS=$(ls "$SNAPSHOTS_DIR"/nda-*.png 2>/dev/null | wc -l)
GOV_TESTS=$(ls "$SNAPSHOTS_DIR"/gov-*.png 2>/dev/null | wc -l)

# Create the visual testing overview section for README
VISUAL_SECTION="
### Quick Snapshot Summary

The visual regression tests capture **${TOTAL_SNAPSHOTS}+ snapshots** across 3 browsers documenting:

| Category | Purpose | Key Changes |
|----------|---------|-------------|
| **🔄 Main Workflow** (01-06) | Complete form submission flow | CustomerSector dropdown integration, form reset behavior |
| **✅ NDA Visibility** (nda-) | Conditional checkbox logic | NDA checkbox shows/hides based on sector selection |
| **🏛️ Government Flow** (gov-) | End-to-end government customer | Real-world scenario with NDA requirement |

### Browser Coverage
- 🌐 **Chromium**: Modern web standards (${CHROMIUM_COUNT} snapshots)
- 🦊 **Firefox**: Gecko rendering engine (${FIREFOX_COUNT} snapshots)
- 🧭 **WebKit**: Safari/mobile compatibility (${WEBKIT_COUNT} snapshots)

### Generate Snapshot Report
\`\`\`bash
# Create markdown report of current snapshots
./view-snapshots.sh

# View generated report
cat SNAPSHOT_REPORT.md
\`\`\`

📊 **Latest Stats**: ${MAIN_WORKFLOW} main workflow, ${NDA_TESTS} NDA visibility, ${GOV_TESTS} government workflow snapshots
"

# Update the README file (replace content between markers)
if grep -q "<!-- BEGIN VISUAL_TESTING_OVERVIEW -->" "$README_FILE"; then
    # Create a temporary file with the new content
    TEMP_FILE=$(mktemp)
    
    # Write everything before the marker
    sed '/<!-- BEGIN VISUAL_TESTING_OVERVIEW -->/,$d' "$README_FILE" > "$TEMP_FILE"
    
    # Add the new visual testing section
    echo "<!-- BEGIN VISUAL_TESTING_OVERVIEW -->" >> "$TEMP_FILE"
    echo "[View complete visual testing overview](./VISUAL_TESTING_OVERVIEW.md)" >> "$TEMP_FILE"
    echo "" >> "$TEMP_FILE"
    echo "$VISUAL_SECTION" >> "$TEMP_FILE"
    echo "<!-- END VISUAL_TESTING_OVERVIEW -->" >> "$TEMP_FILE"
    
    # Add everything after the end marker
    sed -n '/<!-- END VISUAL_TESTING_OVERVIEW -->/,$p' "$README_FILE" | tail -n +2 >> "$TEMP_FILE"
    
    # Replace the original file
    mv "$TEMP_FILE" "$README_FILE"
    
    echo "✅ README updated with current visual testing stats"
    echo "📊 Total snapshots: $TOTAL_SNAPSHOTS"
    echo "🔄 Main workflow: $MAIN_WORKFLOW"
    echo "✅ NDA visibility: $NDA_TESTS" 
    echo "🏛️  Government workflow: $GOV_TESTS"
else
    echo "⚠️  Visual testing markers not found in README"
    echo "   Add <!-- BEGIN VISUAL_TESTING_OVERVIEW --> and <!-- END VISUAL_TESTING_OVERVIEW --> markers"
fi

echo "📖 README update complete!"