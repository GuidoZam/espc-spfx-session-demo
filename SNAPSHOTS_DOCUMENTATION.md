# Playwright Visual Testing Snapshots Documentation

This document explains the visual regression testing snapshots created for the Customer Form feature, specifically highlighting the **CustomerSector dropdown** and **conditional NDA checkbox** functionality.

## 📸 Snapshot Structure

All snapshots are located in: `tests/basic.spec.ts-snapshots/`

### Naming Convention
- **Browser Suffix**: Each snapshot has browser-specific versions (`-Chromium-darwin.png`, `-Firefox-darwin.png`, `-WebKit-darwin.png`)
- **Numbered Sequence**: Main workflow snapshots use numbered prefixes (`01-`, `02-`, etc.)
- **Feature Prefixes**: 
  - `nda-` for NDA checkbox visibility tests
  - `gov-` for Government customer workflow tests

## 🎯 Test Scenarios and Key Changes

### 1. **Main Customer Form Workflow** (`01-` to `06-` series)

#### **01-initial-form**
- **What it shows**: Clean form with all fields empty
- **Key highlights**: 
  - ✅ CustomerSector dropdown is visible (new field)
  - ✅ NDA checkbox is hidden (correct initial state)

#### **02-form-filled-basic-fields**
- **What it shows**: Form with Name, Email, Phone, Address, and Company filled
- **Key highlights**: 
  - ✅ CustomerSector dropdown still empty
  - ✅ NDA checkbox remains hidden until sector is selected

#### **03-form-private-sector-selected**
- **What it shows**: Form after selecting "Private" sector
- **Key highlights**: 
  - 🔍 **MAIN CHANGE**: CustomerSector dropdown shows "Private" selected
  - ✅ NDA checkbox remains hidden (correct for non-Government sectors)

#### **04-form-completed-ready-to-submit**
- **What it shows**: Complete form ready for submission
- **Key highlights**: 
  - ✅ All fields filled including Notes
  - ✅ Private sector selected, NDA checkbox correctly hidden

#### **05-form-success-notification**
- **What it shows**: Success notification after form submission
- **Key highlights**: 
  - ✅ Green success message displayed
  - ✅ Shows customer information in notification

#### **06-form-reset-after-submit**
- **What it shows**: Form state after successful submission
- **Key highlights**: 
  - ✅ All fields cleared and reset
  - ✅ CustomerSector back to empty selection
  - ✅ NDA checkbox hidden again

---

### 2. **NDA Checkbox Visibility Tests** (`nda-` series)

#### **nda-01-initial-no-sector-nda-hidden**
- **What it shows**: Form with no sector selected
- **Key highlights**: 
  - ✅ CustomerSector dropdown empty
  - ✅ NDA checkbox hidden (baseline state)

#### **nda-02-government-sector-nda-visible**
- **What it shows**: Form after selecting "Government" sector
- **Key highlights**: 
  - 🔍 **MAIN CHANGE**: CustomerSector shows "Government" selected
  - 🔍 **MAIN CHANGE**: NDA checkbox appears and is visible
  - ✅ NDA checkbox is unchecked (initial state)

#### **nda-03-government-sector-nda-checked**
- **What it shows**: Government sector with NDA checkbox checked
- **Key highlights**: 
  - ✅ CustomerSector still shows "Government"
  - 🔍 **MAIN CHANGE**: NDA checkbox is now checked (user interaction)

#### **nda-04-private-sector-nda-hidden**
- **What it shows**: Form after changing from Government to Private sector
- **Key highlights**: 
  - 🔍 **MAIN CHANGE**: CustomerSector shows "Private" selected
  - 🔍 **MAIN CHANGE**: NDA checkbox disappears (hidden for non-Government)

#### **nda-05-government-sector-nda-reset-unchecked**
- **What it shows**: Form after switching back to Government sector
- **Key highlights**: 
  - ✅ CustomerSector shows "Government" again
  - ✅ NDA checkbox reappears
  - 🔍 **MAIN CHANGE**: NDA checkbox is unchecked (demonstrates reset behavior)

#### **nda-06-nonprofit-sector-nda-hidden**
- **What it shows**: Form with "Non profit" sector selected
- **Key highlights**: 
  - 🔍 **MAIN CHANGE**: CustomerSector shows "Non profit" selected
  - ✅ NDA checkbox hidden (correct for non-Government sectors)

---

### 3. **Government Customer Workflow** (`gov-` series)

#### **gov-01-form-filled-before-sector**
- **What it shows**: Government customer details filled, before sector selection
- **Key highlights**: 
  - ✅ Government-specific customer data (official name, .gov email, etc.)
  - ✅ CustomerSector dropdown empty
  - ✅ NDA checkbox hidden

#### **gov-02-government-sector-nda-visible**
- **What it shows**: After selecting Government sector for government customer
- **Key highlights**: 
  - 🔍 **MAIN CHANGE**: CustomerSector shows "Government" selected
  - 🔍 **MAIN CHANGE**: NDA checkbox becomes visible
  - ✅ Real-world government customer scenario

#### **gov-03-complete-government-form-nda-checked**
- **What it shows**: Complete government customer form with NDA checked
- **Key highlights**: 
  - ✅ All government customer fields completed
  - ✅ Government sector selected
  - 🔍 **MAIN CHANGE**: NDA checkbox checked (business requirement satisfied)
  - ✅ Notes field mentions NDA requirement

---

## 🔍 Visual Regression Testing Benefits

### **What the Snapshots Detect**:
1. **Layout Changes**: Any unintended changes to form layout
2. **Field Visibility**: Ensures NDA checkbox shows/hides correctly
3. **Conditional Logic**: Verifies sector-based field visibility works
4. **Cross-Browser Consistency**: Same behavior across Chromium, Firefox, and WebKit
5. **Reset Behavior**: Confirms form properly resets after submission

### **Key Changes Highlighted**:
- ✨ **New CustomerSector dropdown field** integration
- ✨ **Conditional NDA checkbox** visibility logic
- ✨ **Reset behavior** when sector changes
- ✨ **Form submission and reset** cycle with new fields

## 🚀 Running Snapshot Tests

### Generate New Snapshots
```bash
npm run test:e2e -- --update-snapshots
```

### Run Visual Regression Tests
```bash
npm run test:e2e
```

### Compare Changes
When tests fail due to visual differences, Playwright generates diff images showing:
- **Expected**: The baseline snapshot
- **Actual**: Current test result
- **Diff**: Highlighted differences

## 📋 Snapshot Maintenance

- **Update snapshots** when intentional UI changes are made
- **Review diffs carefully** to ensure only expected changes are present
- **Cross-browser testing** ensures consistent behavior across all supported browsers
- **Automated regression detection** catches unintended visual changes

---

*These snapshots serve as a visual documentation of the CustomerSector and NDA checkbox functionality, ensuring the conditional logic works correctly and consistently across different browsers and scenarios.*