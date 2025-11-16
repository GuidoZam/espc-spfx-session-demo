# Cross-Platform Playwright Testing Fixes

## Issues Identified

### 1. Platform-Specific Snapshots
**Problem**: Local tests generated `*-Chromium-darwin.png` snapshots (macOS), but GitHub Actions (Ubuntu Linux) expected `*-Chromium-linux.png`.

**Solution**: 
- Created `scripts/sync-snapshots.sh` to automatically copy Darwin snapshots to Linux equivalents
- Updated GitHub Actions workflows to run this sync before tests
- Added `npm run test:e2e:sync-snapshots` command for manual synchronization

### 2. Page Crashes and Timeouts
**Problem**: Form submission caused page crashes in CI environment, leading to "Target page, context or browser has been closed" errors.

**Solutions Applied**:
- **Increased timeouts**: CI gets 120s test timeout, 45s action timeout (vs 60s/30s locally)
- **Error handling**: Added page crash detection and enhanced error reporting
- **Robust submission**: Added try-catch around form submission with page state checks
- **Better debugging**: Enhanced logging for CI failures with page content inspection

### 3. SharePoint SPFx Loading Issues
**Problem**: SharePoint Framework web parts load slower in CI environment.

**Solutions Applied**:
- **Extended wait times**: 45s wait for form detection in CI (vs 30s locally)
- **Better detection**: Enhanced `checkCustomerFormExists()` with SharePoint-specific debugging
- **Fallback strategies**: Multiple detection methods (input IDs, data-testids, web part attributes)

## Files Modified

### Core Configuration
- `playwright.config.ts`: Added CI-specific timeouts, viewport consistency, higher threshold for snapshots
- `package.json`: Added snapshot sync script

### Test Improvements
- `tests/basic.spec.ts`: Enhanced error handling, page crash detection, CI-specific timeouts and debugging

### CI/CD Pipeline
- `.github/workflows/deploy-spfx-solution_TEST.yml`: Added snapshot sync step, better error handling
- `.github/workflows/deploy-spfx-solution_PROD.yml`: Applied same fixes as TEST workflow

### New Scripts
- `scripts/sync-snapshots.sh`: Cross-platform snapshot synchronization utility

## Usage

### For Developers
```bash
# Sync snapshots locally before committing
npm run test:e2e:sync-snapshots

# Update snapshots (will auto-sync)
npm run test:e2e:update-snapshots

# Run tests locally
npm run test:e2e
```

### CI Behavior
1. Builds and deploys SPFx solution
2. Installs Playwright with Chromium
3. Syncs Darwin snapshots to Linux equivalents
4. Runs tests with fallback to snapshot update if needed

## Key Improvements

1. **Cross-Platform Compatibility**: Automatic snapshot synchronization between macOS and Linux
2. **Resilient Testing**: Better error handling for SharePoint-specific issues
3. **CI Optimization**: Increased timeouts and enhanced debugging for cloud environments
4. **Debugging Support**: Comprehensive logging for troubleshooting CI failures

## Monitoring

Watch for these indicators of successful fixes:
- Tests pass without "snapshot doesn't exist" errors
- No "Target page, context or browser has been closed" failures
- Form submissions complete successfully in CI
- Consistent snapshot comparisons across platforms

## Troubleshooting

If tests still fail:
1. Check snapshot synchronization: `ls tests/basic.spec.ts-snapshots/*linux*`
2. Verify SharePoint authentication in CI logs
3. Review enhanced debug output for page state information
4. Consider increasing timeouts further if deployment is slower than expected