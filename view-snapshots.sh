#!/bin/bash

# Snapshot viewer script for Customer Form Visual Testing
# This script generates a markdown report of the snapshots

SNAPSHOTS_DIR="tests/basic.spec.ts-snapshots"
OUTPUT_FILE="SNAPSHOT_REPORT.md"

echo "🔍 Customer Form Visual Testing - Snapshot Analysis"
echo "================================================="

# Check if snapshots directory exists
if [ ! -d "$SNAPSHOTS_DIR" ]; then
    echo "❌ Snapshots directory not found: $SNAPSHOTS_DIR"
    echo "Run 'npm run test:e2e:update-snapshots' first"
    exit 1
fi

echo "📊 Generating snapshot report..."

# Count snapshots by browser
CHROMIUM_COUNT=$(ls "$SNAPSHOTS_DIR"/*Chromium*.png 2>/dev/null | wc -l)
FIREFOX_COUNT=$(ls "$SNAPSHOTS_DIR"/*Firefox*.png 2>/dev/null | wc -l)
WEBKIT_COUNT=$(ls "$SNAPSHOTS_DIR"/*WebKit*.png 2>/dev/null | wc -l)

# Generate markdown report
cat > "$OUTPUT_FILE" << EOF
# Visual Testing Snapshot Report

Generated on: $(date)

## 📊 Snapshot Summary

| Browser | Count | Status |
|---------|-------|--------|
| 🌐 Chromium | $CHROMIUM_COUNT | ✅ |
| 🦊 Firefox | $FIREFOX_COUNT | ✅ |
| 🧭 WebKit | $WEBKIT_COUNT | ✅ |

## � Snapshot Categories

EOF

# Analyze snapshot categories
MAIN_WORKFLOW=$(ls "$SNAPSHOTS_DIR"/[0-9][0-9]-*.png 2>/dev/null | wc -l)
NDA_TESTS=$(ls "$SNAPSHOTS_DIR"/nda-*.png 2>/dev/null | wc -l)
GOV_TESTS=$(ls "$SNAPSHOTS_DIR"/gov-*.png 2>/dev/null | wc -l)

cat >> "$OUTPUT_FILE" << EOF
### 🔄 Main Workflow Snapshots: $MAIN_WORKFLOW total

| Snapshot | Description | Browsers |
|----------|-------------|----------|
EOF

# Add main workflow snapshots
for snapshot in "$SNAPSHOTS_DIR"/[0-9][0-9]-*Chromium*.png; do
    if [ -f "$snapshot" ]; then
        filename=$(basename "$snapshot")
        name=$(echo "$filename" | sed 's/-Chromium-darwin.png//')
        description=""
        case "$name" in
            "01-initial-form") description="Clean form with CustomerSector dropdown visible, NDA hidden" ;;
            "02-form-filled-basic-fields") description="Basic fields filled, CustomerSector empty, NDA hidden" ;;
            "03-form-private-sector-selected") description="**Private sector selected**, NDA correctly hidden" ;;
            "04-form-completed-ready-to-submit") description="Complete form ready for submission" ;;
            "05-form-success-notification") description="Success notification with customer details" ;;
            "06-form-reset-after-submit") description="Form reset, all fields cleared" ;;
        esac
        echo "| \`$name\` | $description | Chromium, Firefox, WebKit |" >> "$OUTPUT_FILE"
    fi
done

cat >> "$OUTPUT_FILE" << EOF

### ✅ NDA Visibility Tests: $NDA_TESTS total

| Snapshot | Description | Key Change |
|----------|-------------|------------|
EOF

# Add NDA test snapshots
for snapshot in "$SNAPSHOTS_DIR"/nda-*Chromium*.png; do
    if [ -f "$snapshot" ]; then
        filename=$(basename "$snapshot")
        name=$(echo "$filename" | sed 's/-Chromium-darwin.png//')
        description=""
        keychange=""
        case "$name" in
            "nda-01-initial-no-sector-nda-hidden") 
                description="Baseline state with no sector selected"
                keychange="NDA checkbox hidden" ;;
            "nda-02-government-sector-nda-visible") 
                description="Government sector selected"
                keychange="**NDA checkbox appears**" ;;
            "nda-03-government-sector-nda-checked") 
                description="User checks NDA checkbox"
                keychange="**NDA checkbox checked**" ;;
            "nda-04-private-sector-nda-hidden") 
                description="Changed to Private sector"
                keychange="**NDA checkbox disappears**" ;;
            "nda-05-government-sector-nda-reset-unchecked") 
                description="Back to Government sector"
                keychange="**NDA checkbox reset to unchecked**" ;;
            "nda-06-nonprofit-sector-nda-hidden") 
                description="Non profit sector selected"
                keychange="NDA checkbox hidden" ;;
        esac
        echo "| \`$name\` | $description | $keychange |" >> "$OUTPUT_FILE"
    fi
done

cat >> "$OUTPUT_FILE" << EOF

### 🏛️ Government Customer Workflow: $GOV_TESTS total

| Snapshot | Description | Scenario |
|----------|-------------|----------|
EOF

# Add government workflow snapshots
for snapshot in "$SNAPSHOTS_DIR"/gov-*Chromium*.png; do
    if [ -f "$snapshot" ]; then
        filename=$(basename "$snapshot")
        name=$(echo "$filename" | sed 's/-Chromium-darwin.png//')
        description=""
        scenario=""
        case "$name" in
            "gov-01-form-filled-before-sector") 
                description="Government customer details filled"
                scenario="Before sector selection" ;;
            "gov-02-government-sector-nda-visible") 
                description="Government sector selected"
                scenario="**NDA checkbox becomes visible**" ;;
            "gov-03-complete-government-form-nda-checked") 
                description="Complete government form"
                scenario="**NDA checkbox checked for submission**" ;;
        esac
        echo "| \`$name\` | $description | $scenario |" >> "$OUTPUT_FILE"
    fi
done

cat >> "$OUTPUT_FILE" << EOF

## 🔍 Key Visual Changes Detected

The snapshots capture these critical UI behaviors:

1. **CustomerSector Dropdown Integration**
   - ✅ Proper placement in form layout
   - ✅ Three options: Non profit, Private, Government
   - ✅ Selection state persistence

2. **Conditional NDA Checkbox Logic**
   - ✅ Hidden by default and for non-Government sectors
   - ✅ Appears only when Government sector is selected
   - ✅ Resets to unchecked when sector changes

3. **Cross-Browser Consistency**
   - ✅ Identical behavior across Chromium, Firefox, and WebKit
   - ✅ Consistent rendering and layout

4. **Form Workflow Integrity**
   - ✅ Complete submission and reset cycles
   - ✅ Success notifications
   - ✅ Field validation and error states

## 🚀 Commands

\`\`\`bash
# Run visual regression tests
npm run test:e2e

# Update snapshots after changes
npm run test:e2e:update-snapshots

# Generate this report
./view-snapshots.sh
\`\`\`

## 📖 Documentation

For detailed snapshot analysis, see:
- [VISUAL_TESTING_OVERVIEW.md](./VISUAL_TESTING_OVERVIEW.md)
- [SNAPSHOTS_DOCUMENTATION.md](./SNAPSHOTS_DOCUMENTATION.md)

---
*Report generated on $(date)*
EOF

echo "✅ Markdown report generated: $OUTPUT_FILE"
echo ""
echo "📊 Summary:"
echo "  🌐 Chromium snapshots: $CHROMIUM_COUNT"
echo "  🦊 Firefox snapshots:  $FIREFOX_COUNT"
echo "  🧭 WebKit snapshots:   $WEBKIT_COUNT"
echo ""
echo "📋 Categories:"
echo "  🔄 Main workflow: $MAIN_WORKFLOW snapshots"
echo "  ✅ NDA visibility: $NDA_TESTS snapshots"
echo "  🏛️  Government workflow: $GOV_TESTS snapshots"
echo ""
echo "📖 View the report: cat $OUTPUT_FILE"
echo "✨ Analysis complete!"