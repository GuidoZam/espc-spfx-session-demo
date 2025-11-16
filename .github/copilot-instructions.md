# Copilot Instructions for ESPC SPFx Session Demo

## Project Architecture

This is a **SharePoint Framework (SPFx) 1.22.0-beta.5** project featuring a React-based Customer Form web part with comprehensive CI/CD and testing infrastructure.

### Core Components
- **`NewCustomerFormWebPart.ts`**: Main SPFx web part entry point with Graph API integration and service initialization
- **`NewCustomerForm.tsx`**: Primary React component with conditional business logic (NDA checkbox for Government sector only)
- **`TenantSettingsService.ts`**: Service for retrieving SharePoint tenant properties with environment detection fallbacks
- **Service Pattern**: Dependency injection via constructor, initialized in `onInit()` lifecycle

### Key Business Logic
- **Conditional NDA Field**: Only visible/required for "Government" customers (`customerSector === 'Government'`)
- **Smart Reset**: NDA checkbox resets when sector changes away from Government
- **Environment Detection**: Uses tenant property `ESPC25:CustomerForm:Environment` with localhost fallback to 'TEST'

## Development Workflow

### Build System (Heft-based)
```bash
npm run start          # Local development with clean build
npm run build          # Production build
npm run test           # Jest unit tests
npm run test:e2e       # Playwright E2E tests with visual snapshots
```

### Visual Regression Testing
- **Snapshot Categories**: Main workflow (01-06), NDA visibility (nda-*), Government workflow (gov-*)
- **Update Snapshots**: `npm run test:e2e:update-snapshots` (auto-generates documentation)
- **Browser Coverage**: Configured for Chromium, Firefox, WebKit (currently Chromium active)
- **Authentication**: Uses persistent storage state via `tests/login.setup.ts`

### Deployment Pipeline
- **Branches**: `dev` → unit tests, `test` → deploy to TEST, `prod` → deploy to PROD
- **Package Commands**: `package-solution:test` vs `package-solution:prod` for environment-specific builds
- **Required Secrets**: `M365_CERTIFICATE`, `M365_CERTIFICATE_PASSWORD`, `M365_CLIENT_ID`, `M365_TENANT`

## Project-Specific Conventions

### Service Architecture
- Services in `src/services/` follow interface-implementation pattern
- Initialize services in web part `onInit()`: `this.tenantSettingsService = new TenantSettingsService(this.context)`
- Use PnP/sp for SharePoint operations: `spfi().using(SPFx(this.context))`

### Testing Patterns
- **Unit Tests**: React Testing Library with `jest.setup.ts` configuration
- **E2E Tests**: Playwright with `checkCustomerFormExists()` helper for SPFx web part detection
- **Test Data**: Use `data-testid` attributes for reliable element selection
- **Snapshots**: Capture at key interaction points (form states, sector changes, submissions)
- Avoid, whenever possible, the use of mocked services in favor of real SharePoint context for integration fidelity
- Whenever a mocking is necessary, ask the user if they want to proceed before suggesting code.

### Configuration Management
- **Environment Config**: Tenant properties via `TenantSettingsService.getEnvironment()`
- **Version Tracking**: Auto-reads from `config/package-solution.json` in web part initialization
- **Development Overrides**: Service provides 'TEST' fallback for localhost/workbench scenarios

### React Component Patterns
- State management with `useState` for form fields and UI state
- Separate handlers for each input type with validation tracking
- Conditional rendering based on business rules (sector-specific fields)
- Error boundaries with user-friendly messaging

### File Structure Logic
- `src/webparts/[webPartName]/` contains web part-specific code
- `src/services/` for shared business logic and SharePoint integrations  
- `config/` for SPFx configuration (package-solution.json, deployment settings)
- `tests/` for Playwright E2E tests with authentication setup
- `docs/` for implementation guides and automated snapshot reports

When modifying this codebase:
1. **Business Logic Changes**: Update both React component AND corresponding unit tests
2. **UI Changes**: Run visual tests to update snapshots: `npm run test:e2e:update-snapshots`
3. **Service Changes**: Ensure interface compatibility and update dependency injection in web parts
4. **Environment Config**: Use PowerShell scripts in `scripts/` for tenant property management
5. **New Components**: Follow the established service injection pattern and add appropriate test coverage