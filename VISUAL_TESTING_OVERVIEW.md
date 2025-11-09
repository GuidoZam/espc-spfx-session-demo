# Visual Testing Snapshots Overview

This section provides a visual overview of the automated testing snapshots that verify the CustomerSector dropdown and conditional NDA checkbox functionality.

## 📸 Snapshot Categories

### 🔄 Main Customer Form Workflow

| Step | Snapshot | Key Changes Highlighted |
|------|----------|------------------------|
| **01** | `01-initial-form` | ✅ Clean form with CustomerSector dropdown visible<br/>✅ NDA checkbox correctly hidden (initial state) |
| **02** | `02-form-filled-basic-fields` | ✅ Basic customer info filled<br/>✅ CustomerSector still empty<br/>✅ NDA checkbox remains hidden |
| **03** | `03-form-private-sector-selected` | 🔍 **CustomerSector shows "Private" selected**<br/>✅ NDA checkbox remains hidden (correct for non-Government) |
| **04** | `04-form-completed-ready-to-submit` | ✅ Complete form with all fields<br/>✅ Private sector + hidden NDA = correct state |
| **05** | `05-form-success-notification` | ✅ Green success notification displayed<br/>✅ Customer information shown in message |
| **06** | `06-form-reset-after-submit` | ✅ All fields cleared and reset<br/>✅ CustomerSector back to empty<br/>✅ NDA checkbox hidden again |

### ✅ NDA Checkbox Visibility Tests

| Step | Snapshot | Key Changes Highlighted |
|------|----------|------------------------|
| **01** | `nda-01-initial-no-sector-nda-hidden` | ✅ Baseline: Empty sector, NDA hidden |
| **02** | `nda-02-government-sector-nda-visible` | 🔍 **Government sector selected**<br/>🔍 **NDA checkbox appears and is visible**<br/>✅ NDA checkbox unchecked (initial) |
| **03** | `nda-03-government-sector-nda-checked` | ✅ Government sector maintained<br/>🔍 **NDA checkbox now checked** (user interaction) |
| **04** | `nda-04-private-sector-nda-hidden` | 🔍 **Changed to Private sector**<br/>🔍 **NDA checkbox disappears** (hidden for non-Government) |
| **05** | `nda-05-government-sector-nda-reset-unchecked` | ✅ Back to Government sector<br/>✅ NDA checkbox reappears<br/>🔍 **NDA checkbox unchecked** (demonstrates reset) |
| **06** | `nda-06-nonprofit-sector-nda-hidden` | 🔍 **Non profit sector selected**<br/>✅ NDA checkbox hidden (correct for non-Government) |

### 🏛️ Government Customer Workflow

| Step | Snapshot | Key Changes Highlighted |
|------|----------|------------------------|
| **01** | `gov-01-form-filled-before-sector` | ✅ Government customer details filled<br/>✅ CustomerSector dropdown empty<br/>✅ NDA checkbox hidden |
| **02** | `gov-02-government-sector-nda-visible` | 🔍 **Government sector selected**<br/>🔍 **NDA checkbox becomes visible**<br/>✅ Real-world government scenario |
| **03** | `gov-03-complete-government-form-nda-checked` | ✅ Complete government customer form<br/>✅ Government sector selected<br/>🔍 **NDA checkbox checked** (business requirement)<br/>✅ Notes mention NDA requirement |

## 🔍 Cross-Browser Testing

Each snapshot is captured across three browsers to ensure consistent behavior:

- **🌐 Chromium** (`-Chromium-darwin.png`)
- **🦊 Firefox** (`-Firefox-darwin.png`) 
- **🧭 WebKit** (`-WebKit-darwin.png`)

## 🎯 What the Snapshots Verify

### ✨ New Features Tested:
- **CustomerSector Dropdown**: Proper integration and selection behavior
- **Conditional NDA Checkbox**: Shows/hides based on sector selection
- **Reset Logic**: NDA checkbox resets when sector changes
- **Business Rules**: NDA value only applies to Government customers

### 🛡️ Regression Protection:
- **Layout Integrity**: Ensures no unintended UI changes
- **Field Visibility**: Verifies conditional logic works correctly
- **Cross-Browser Consistency**: Same behavior across all browsers
- **Form Workflows**: Complete user journeys work as expected

## 🚀 Running Visual Tests

```bash
# Run visual regression tests
npm run test:e2e

# Update snapshots (after intentional changes)
npm run test:e2e:update-snapshots

# Analyze snapshots
./view-snapshots.sh
```

## 📊 Snapshot Statistics

- **Total Snapshots**: 42+ across all browsers
- **Test Scenarios**: 3 comprehensive workflows
- **Browsers Covered**: Chromium, Firefox, WebKit
- **Key Interactions**: 12+ critical UI state changes

## 🔧 Snapshot Configuration

Configured in `playwright.config.ts`:
- **Animations**: Disabled for consistent captures
- **Threshold**: 0.2 for reliable comparison
- **Scale**: CSS-based for consistent rendering

---

*These snapshots serve as both documentation and automated verification of the CustomerSector dropdown and conditional NDA checkbox functionality, ensuring reliable behavior across different browsers and user scenarios.*