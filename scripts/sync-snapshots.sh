#!/bin/bash
# Script to synchronize snapshots between macOS (darwin) and Linux platforms
# This ensures cross-platform compatibility for GitHub Actions

SNAPSHOT_DIR="tests/basic.spec.ts-snapshots"

if [ ! -d "$SNAPSHOT_DIR" ]; then
    echo "Snapshot directory not found: $SNAPSHOT_DIR"
    exit 1
fi

cd "$SNAPSHOT_DIR"

echo "Synchronizing snapshots for cross-platform compatibility..."

# Copy Darwin snapshots to Linux equivalents
darwin_count=0
linux_count=0

for file in *-Chromium-darwin.png; do
    if [ -f "$file" ]; then
        linux_file="${file/-darwin/-linux}"
        cp "$file" "$linux_file"
        echo "✓ Created: $linux_file"
        ((darwin_count++))
    fi
done

# Copy Linux snapshots to Darwin equivalents (if any exist)
for file in *-Chromium-linux.png; do
    if [ -f "$file" ]; then
        darwin_file="${file/-linux/-darwin}"
        if [ ! -f "$darwin_file" ]; then
            cp "$file" "$darwin_file"
            echo "✓ Created: $darwin_file"
            ((linux_count++))
        fi
    fi
done

echo ""
echo "Snapshot synchronization complete:"
echo "- Darwin → Linux: $darwin_count files"
echo "- Linux → Darwin: $linux_count files"
echo ""
echo "Current snapshots:"
ls -1 *.png | wc -l | xargs echo "Total files:"