# espc-spfx-session-demo

[![Deploy SPFx Solution PROD](https://github.com/GuidoZam/espc-spfx-session-demo/actions/workflows/deploy-spfx-solution_PROD.yml/badge.svg)](https://github.com/GuidoZam/espc-spfx-session-demo/actions/workflows/deploy-spfx-solution_PROD.yml)

[![Deploy SPFx Solution TEST](https://github.com/GuidoZam/espc-spfx-session-demo/actions/workflows/deploy-spfx-solution_TEST.yml/badge.svg?branch=test)](https://github.com/GuidoZam/espc-spfx-session-demo/actions/workflows/deploy-spfx-solution_TEST.yml)

[![Execute unit tests](https://github.com/GuidoZam/espc-spfx-session-demo/actions/workflows/execute-unit-tests.yml/badge.svg?branch=dev)](https://github.com/GuidoZam/espc-spfx-session-demo/actions/workflows/execute-unit-tests.yml)


## Solution Overview

This project demonstrates a SharePoint Framework (SPFx) web part solution integrated with modern CI/CD and automated testing practices. It features:

- **NewCustomerForm Web Part**: A sample SPFx web part showcasing basic React integration, localization, and asset management.
- **Automated Testing**: End-to-end tests using Playwright, including authentication flows for Microsoft 365 and SharePoint Online.
- **CI/CD Integration**: GitHub Actions workflows for building, testing, and deploying the solution.
- **Azure Storage Deployment**: Example configuration for deploying assets to Azure Storage.

### Key Technologies
- SharePoint Framework (SPFx)
- React
- TypeScript
- Jest (unit testing)
- Playwright (E2E testing)
- GitHub Actions (CI/CD)

## CI/CD Configuration

This project uses GitHub Actions for Continuous Integration and Continuous Deployment:

- **Execute Tests** (`execute tests.yml`): Runs unit tests using Jest when code is pushed to the `dev` branch
- **Deploy SPFx Solution TEST** (`deploy-spfx-solution_TEST.yml`): Automatically builds, tests, and deploys the SPFx solution to SharePoint when code is pushed to the `test` branch
- **Deploy SPFx Solution PROD** (`deploy-spfx-solution_PROD.yml`): Automatically builds, tests, and deploys the SPFx solution to SharePoint when code is pushed to the `main` branch

### Required Secrets and Variables

For the deployment workflow to work, the following GitHub secrets and variables must be configured:

**Secrets:**
- `M365_CERTIFICATE`: Base64-encoded certificate for Microsoft 365 authentication
- `M365_CERTIFICATE_PASSWORD`: Password for the certificate (if required)

**Variables:**
- `M365_CLIENT_ID`: App ID of the Entra application used for authentication  
- `M365_TENANT`: ID of the Microsoft 365 tenant
- `TEST_SHAREPOINT_SITE_URL`: URL of the target SharePoint site for deployment and testing
- `TEST_USERNAME`, `TEST_PASSWORD`: Credentials for Playwright authentication (test environment)

### Troubleshooting

If you encounter deployment issues, see the [CI/CD Troubleshooting Guide](docs/CI-CD-TROUBLESHOOTING.md) for common problems and solutions.

## Summary

This solution provides a reference implementation for:
- Building SPFx web parts with React and TypeScript
- Automating deployment and testing using GitHub Actions
- Implementing unit tests with Jest
- Integrating Playwright for robust E2E testing of SharePoint authentication and UI flows
- Managing assets and configuration for enterprise scenarios

![SPFx Solution Screenshot](release/assets/welcome-light_a2dcb0d64c8d6e80cf49.png)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.21.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

- Node.js LTS
- SPFx development environment
- Microsoft 365 developer tenant

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| espc-spfx-session-demo | Guido Zambarda ([@GuidoZam](https://twitter.com/GuidoZam)) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.0     | July 20, 2025 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

> Include any additional steps as needed.

## Features

This extension illustrates the following concepts:

- SPFx web part development with React
- Localization and asset management
- Unit testing with Jest
- Automated E2E testing with Playwright
- CI/CD with GitHub Actions

> Notice that better pictures and documentation will increase the sample usage and the value you are providing for others. Thanks for your submissions advance.

> Share your web part with others through Microsoft 365 Patterns and Practices program to get visibility and exposure. More details on the community, open-source projects and other activities from http://aka.ms/m365pnp.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

## Project Structure & Implementation Details

The repository is organized as follows:

- `src/` – Source code for the SPFx web part, including:
  - `webparts/newCustomerForm/NewCustomerFormWebPart.ts` – Main web part implementation (TypeScript, React)
  - `webparts/newCustomerForm/components/NewCustomerForm.tsx` – Main React component for the web part UI
  - `webparts/newCustomerForm/components/NewCustomerForm.module.scss` – Styles for the web part
  - `webparts/newCustomerForm/components/NewCustomerForm.test.tsx` – Unit tests for the React component (Jest)
  - `webparts/newCustomerForm/components/INewCustomerFormProps.ts` – Props interface for the React component
  - `webparts/newCustomerForm/assets/` – Images and static assets
  - `webparts/newCustomerForm/loc/` – Localization files
- `lib/` – Transpiled output from TypeScript build
- `config/` – Configuration files for SPFx, deployment, and manifests
- `cert/` – Certificates for local development and deployment
- `tests/` – Playwright E2E tests and Jest unit test setup
- `gulpfile.js` – Gulp tasks for building, serving, and packaging the solution
- `package.json` – Project dependencies and scripts
- `jest.setup.ts` – Jest configuration for unit tests
- `playwright.config.ts` – Playwright configuration for E2E tests
- `sharepoint/solution/` – Packaged SharePoint solution files (`.sppkg`)

### Main Implementation Files
- **NewCustomerFormWebPart.ts**: Implements the SPFx web part, rendering the React component and handling properties.
- **NewCustomerForm.tsx**: Main React component for the web part UI.
- **NewCustomerForm.module.scss**: Styles for the web part.
- **NewCustomerForm.test.tsx**: Unit tests for the React component (Jest).
- **INewCustomerFormProps.ts**: Props interface for the React component.
- **basic.spec.ts**: Playwright E2E test for authentication and UI flows.

### Running Locally & Testing

- To run the web part locally:
  ```sh
  npm install
  gulp serve
  ```
- To run unit tests:
  ```sh
  npm test
  ```
- To run Playwright E2E tests:
  ```sh
  npm run test:e2e
  ```

### Deployment

- Build and package the solution:
  ```sh
  gulp bundle --ship
  gulp package-solution --ship
  ```
- Deploy the `.sppkg` file from `sharepoint/solution/` to your SharePoint App Catalog.
