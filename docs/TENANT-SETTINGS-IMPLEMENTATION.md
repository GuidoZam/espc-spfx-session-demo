# Tenant Settings Implementation

This implementation provides a way to configure environment-specific settings using SharePoint tenant properties and display them in the Customer Form WebPart.

## Components

### 1. PowerShell Scripts

#### `scripts/Set-TenantProperty.ps1`
PowerShell script using PnP PowerShell to set the tenant property for environment configuration.

**Usage:**
```powershell
# Set to TEST environment
.\Set-TenantProperty.ps1 -Environment TEST -TenantUrl 'https://yourtenant-admin.sharepoint.com'

# Set to PROD environment
.\Set-TenantProperty.ps1 -Environment PROD -SiteUrl 'https://yourtenant.sharepoint.com/sites/yoursite'
```

**Parameters:**
- `Environment` (Required): Either "TEST" or "PROD"
- `TenantUrl` (Optional): URL to the tenant admin center
- `SiteUrl` (Optional): URL to a SharePoint site

#### `scripts/Test-TenantProperty.ps1`
PowerShell script to test and verify the tenant property settings.

**Usage:**
```powershell
.\Test-TenantProperty.ps1 -SiteUrl 'https://yourtenant.sharepoint.com/sites/yoursite'
```

### 2. Service Implementation

#### `src/services/ITenantSettingsService.ts`
Interface defining the contract for the tenant settings service.

#### `src/services/TenantSettingsService.ts`
Service implementation that uses PnP/sp to retrieve tenant properties from SharePoint.

**Key Features:**
- Gets the `ESPC25:CustomerForm:Environment` tenant property
- Provides fallback to 'TEST' in development environments (localhost, workbench)
- Generic method to retrieve any tenant property by key
- Error handling with console logging

### 3. WebPart Integration

#### Updated `NewCustomerFormWebPart.ts`
The web part now:
- Creates an instance of `TenantSettingsService` 
- Loads the environment setting during `onInit()`
- Passes the environment to the React component

#### Updated `NewCustomerForm.tsx`
The React component now:
- Accepts an `environment` prop
- Displays an environment badge for non-production environments (TEST, STAGING, etc. in blue)
- Badge is hidden in PROD environment for clean production UI
- Badge is positioned below the welcome title

## Setup Instructions

### Prerequisites
- PnP PowerShell module: `Install-Module PnP.PowerShell -Scope CurrentUser`
- SharePoint tenant admin access or site collection admin access

### 1. Set Tenant Property

Run the PowerShell script to set the environment:

```powershell
# For TEST environment (typically used for development/staging)
.\scripts\Set-TenantProperty.ps1 -Environment TEST -TenantUrl 'https://yourtenant-admin.sharepoint.com'

# For PROD environment (for production deployment)
.\scripts\Set-TenantProperty.ps1 -Environment PROD -TenantUrl 'https://yourtenant-admin.sharepoint.com'
```

### 2. Verify Settings

Test the property was set correctly:

```powershell
.\scripts\Test-TenantProperty.ps1 -SiteUrl 'https://yourtenant.sharepoint.com/sites/yoursite'
```

### 3. Deploy WebPart

Build and deploy the updated web part:

```bash
npm run build
gulp bundle --ship
gulp package-solution --ship
```

Upload the `.sppkg` file to your SharePoint App Catalog and deploy.

### 4. Test the WebPart

Add the Customer Form web part to a page and verify:
- The environment badge appears below the welcome message for non-production environments
- TEST environment shows a blue badge
- PROD environment shows no badge (clean production UI)
- Other environments (STAGING, DEV, etc.) show blue badges
- In development (localhost), it defaults to TEST if no property is found

## Tenant Property Details

- **Key**: `ESPC25:CustomerForm:Environment`
- **Allowed Values**: `TEST` or `PROD`
- **Scope**: Tenant-wide (available across all site collections)
- **Description**: "Environment setting for ESPC Customer Form WebPart"

## Development Notes

### Service Injection
The implementation uses a simple service instantiation rather than the full SPFx service locator pattern for simplicity. The service is created directly in the web part's `onInit()` method.

### Error Handling
- If the tenant property cannot be read, the service logs an error
- In development environments (localhost, workbench), it defaults to 'TEST'
- Production environments without the property will show 'UNKNOWN'

### Permissions
The web part needs permission to read tenant properties. This is typically available to:
- Site collection administrators
- Tenant administrators
- Users with appropriate SharePoint API permissions

## Troubleshooting

### Common Issues

1. **Property not found**: Ensure the PowerShell script ran successfully and you have the correct permissions
2. **Permission denied**: You may need tenant admin or site collection admin rights
3. **PnP PowerShell not installed**: Run `Install-Module PnP.PowerShell -Scope CurrentUser`
4. **Service returns null**: Check browser console for error messages and verify connectivity to SharePoint

### Verification Steps

1. Run `Test-TenantProperty.ps1` to verify the property is set
2. Check browser developer console for service log messages
3. Verify the web part shows the environment badge
4. Test with both TEST and PROD values

## Future Enhancements

- Add support for additional environment-specific settings
- Implement caching to reduce API calls
- Add configuration UI in web part property pane
- Support for custom environment names beyond TEST/PROD