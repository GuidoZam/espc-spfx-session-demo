#!/bin/bash

# Quick script to update visual test snapshots by copying darwin to linux versions
echo "Updating visual test snapshots..."

cd "tests/basic.spec.ts-snapshots"

echo "Current directory: $(pwd)"
echo "Darwin snapshots found:"
ls -1 *-darwin.png | wc -l

# Copy all darwin snapshots to linux versions
for file in *-darwin.png; do
    if [ -f "$file" ]; then
        linux_file="${file/-darwin/-linux}"
        cp "$file" "$linux_file"
        echo "✓ Updated: $linux_file"
    fi
done

echo "Snapshot update complete!"
echo "Total snapshots after update:"
ls -1 *.png | wc -l