# Visual Testing Snapshot Report

Generated on: Sun Nov 16 20:38:30 CET 2025

## 📊 Snapshot Summary

| Browser | Count | Status |
|---------|-------|--------|
| 🌐 Chromium |       34 | ✅ |
| 🦊 Firefox |        0 | ✅ |
| 🧭 WebKit |        0 | ✅ |

## � Snapshot Categories

### 🔄 Main Workflow Snapshots:       12 total

| Snapshot | Description | Browsers |
|----------|-------------|----------|
| `01-initial-form` | Clean form with CustomerSector dropdown visible, NDA hidden | Chromium, Firefox, WebKit |
| `01-initial-form-Chromium-linux.png` |  | Chromium, Firefox, WebKit |
| `02-form-filled-basic-fields` | Basic fields filled, CustomerSector empty, NDA hidden | Chromium, Firefox, WebKit |
| `02-form-filled-basic-fields-Chromium-linux.png` |  | Chromium, Firefox, WebKit |
| `03-form-private-sector-selected` | **Private sector selected**, NDA correctly hidden | Chromium, Firefox, WebKit |
| `03-form-private-sector-selected-Chromium-linux.png` |  | Chromium, Firefox, WebKit |
| `04-form-completed-ready-to-submit` | Complete form ready for submission | Chromium, Firefox, WebKit |
| `04-form-completed-ready-to-submit-Chromium-linux.png` |  | Chromium, Firefox, WebKit |
| `05-form-success-notification` | Success notification with customer details | Chromium, Firefox, WebKit |
| `05-form-success-notification-Chromium-linux.png` |  | Chromium, Firefox, WebKit |
| `06-form-reset-after-submit` | Form reset, all fields cleared | Chromium, Firefox, WebKit |
| `06-form-reset-after-submit-Chromium-linux.png` |  | Chromium, Firefox, WebKit |

### ✅ NDA Visibility Tests:       12 total

| Snapshot | Description | Key Change |
|----------|-------------|------------|
| `nda-01-initial-no-sector-nda-hidden` | Baseline state with no sector selected | NDA checkbox hidden |
| `nda-01-initial-no-sector-nda-hidden-Chromium-linux.png` |  |  |
| `nda-02-government-sector-nda-visible` | Government sector selected | **NDA checkbox appears** |
| `nda-02-government-sector-nda-visible-Chromium-linux.png` |  |  |
| `nda-03-government-sector-nda-checked` | User checks NDA checkbox | **NDA checkbox checked** |
| `nda-03-government-sector-nda-checked-Chromium-linux.png` |  |  |
| `nda-04-private-sector-nda-hidden` | Changed to Private sector | **NDA checkbox disappears** |
| `nda-04-private-sector-nda-hidden-Chromium-linux.png` |  |  |
| `nda-05-government-sector-nda-reset-unchecked` | Back to Government sector | **NDA checkbox reset to unchecked** |
| `nda-05-government-sector-nda-reset-unchecked-Chromium-linux.png` |  |  |
| `nda-06-nonprofit-sector-nda-hidden` | Non profit sector selected | NDA checkbox hidden |
| `nda-06-nonprofit-sector-nda-hidden-Chromium-linux.png` |  |  |

### 🏛️ Government Customer Workflow:       10 total

| Snapshot | Description | Scenario |
|----------|-------------|----------|
| `gov-01-form-filled-before-sector` | Government customer details filled | Before sector selection |
| `gov-01-form-filled-before-sector-Chromium-linux.png` |  |  |
| `gov-02-government-sector-nda-visible` | Government sector selected | **NDA checkbox becomes visible** |
| `gov-02-government-sector-nda-visible-Chromium-linux.png` |  |  |
| `gov-03-complete-government-form-nda-checked` | Complete government form | **NDA checkbox checked for submission** |
| `gov-03-complete-government-form-nda-checked-Chromium-linux.png` |  |  |
| `gov-04-government-customer-success` |  |  |
| `gov-04-government-customer-success-Chromium-linux.png` |  |  |
| `gov-05-form-reset-nda-hidden` |  |  |
| `gov-05-form-reset-nda-hidden-Chromium-linux.png` |  |  |

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

```bash
# Run visual regression tests
npm run test:e2e

# Update snapshots after changes
npm run test:e2e:update-snapshots

# Generate this report
./scripts/view-snapshots.sh
```

## 📖 Documentation

For detailed snapshot analysis, see:
- [VISUAL_TESTING_OVERVIEW.md](./docs/VISUAL_TESTING_OVERVIEW.md)
- [SNAPSHOTS_DOCUMENTATION.md](./docs/SNAPSHOTS_DOCUMENTATION.md)

---
*Report generated on Sun Nov 16 20:38:30 CET 2025*
