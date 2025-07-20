# espc-spfx-session-demo

[![Deploy SPFx Solution](https://github.com/GuidoZam/espc-spfx-session-demo/actions/workflows/deploy-spfx-solution.yml/badge.svg)](https://github.com/GuidoZam/espc-spfx-session-demo/actions/workflows/deploy-spfx-solution.yml)

[![Execute tests](https://github.com/GuidoZam/espc-spfx-session-demo/actions/workflows/execute%20tests.yml/badge.svg?branch=dev&event=push)](https://github.com/GuidoZam/espc-spfx-session-demo/actions/workflows/execute%20tests.yml)

## CI/CD Configuration

This project uses GitHub Actions for Continuous Integration and Continuous Deployment:

- **Deploy SPFx Solution** (`deploy-spfx-solution.yml`): Automatically builds, tests, and deploys the SPFx solution to SharePoint when code is pushed to the `main` branch
- **Execute Tests** (`execute tests.yml`): Runs unit tests when code is pushed to the `dev` branch

### Required Secrets and Variables

For the deployment workflow to work, the following GitHub secrets and variables must be configured:

**Secrets:**
- `M365_CERTIFICATE`: Base64-encoded certificate for Microsoft 365 authentication
- `M365_CERTIFICATE_PASSWORD`: Password for the certificate (if required)

**Variables:**
- `M365_CLIENT_ID`: App ID of the Entra application used for authentication  
- `M365_TENANT`: ID of the Microsoft 365 tenant

### Troubleshooting

If you encounter deployment issues, see the [CI/CD Troubleshooting Guide](docs/CI-CD-TROUBLESHOOTING.md) for common problems and solutions.

## Summary

Short summary on functionality and used technologies.

[picture of the solution in action, if possible]

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.21.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> Any special pre-requisites?

## Solution

| Solution    | Author(s)                                               |
| ----------- | ------------------------------------------------------- |
| folder name | Author details (name, company, twitter alias with link) |

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.1     | March 10, 2021   | Update comment  |
| 1.0     | January 29, 2021 | Initial release |

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

Description of the extension that expands upon high-level summary above.

This extension illustrates the following concepts:

- topic 1
- topic 2
- topic 3

> Notice that better pictures and documentation will increase the sample usage and the value you are providing for others. Thanks for your submissions advance.

> Share your web part with others through Microsoft 365 Patterns and Practices program to get visibility and exposure. More details on the community, open-source projects and other activities from http://aka.ms/m365pnp.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
