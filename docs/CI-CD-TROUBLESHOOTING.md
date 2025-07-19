# CI/CD Troubleshooting Guide

## Common Issues and Solutions

### ID3035 Authentication Error

**Error Message:**
```json
{"error":{"error_description":"ID3035: The request was not valid or is malformed."}}
```

**Root Causes & Solutions:**

#### 1. Incorrect Parameter Names in PnP Actions
- **Issue**: Using `TENANT` instead of `TENANT_ID` in `pnp/action-cli-login@v3`
- **Solution**: Use `TENANT_ID: ${{ vars.M365_TENANT }}` instead of `TENANT: ${{ vars.M365_TENANT }}`

#### 2. Missing Deployment Scope
- **Issue**: `pnp/action-cli-deploy@v5` requires explicit scope for tenant-wide deployment
- **Solution**: Add `SCOPE: tenant` parameter to the deploy action

#### 3. Certificate Format Issues
- **Format Required**: Base64-encoded PFX certificate without line breaks
- **Storage**: Store in GitHub secrets as `M365_CERTIFICATE`
- **Password**: Store certificate password in `M365_CERTIFICATE_PASSWORD`

#### 4. Required App Registration Permissions
The Azure AD app registration needs these Microsoft Graph API permissions:
- `Sites.FullControl.All` (Application permission)
- `Sites.Read.All` (Application permission) 
- `User.Read.All` (Application permission)

### Required GitHub Secrets and Variables

#### Secrets (Repository → Settings → Secrets and variables → Actions → Secrets):
- `M365_CERTIFICATE` - Base64 encoded PFX certificate
- `M365_CERTIFICATE_PASSWORD` - Certificate password

#### Variables (Repository → Settings → Secrets and variables → Actions → Variables):
- `M365_CLIENT_ID` - Azure AD App Registration Client ID
- `M365_TENANT` - Azure AD Tenant ID (GUID format)

### Working Configuration Example

```yaml
- name: CLI for Microsoft 365 Login
  uses: pnp/action-cli-login@v3
  with:
    CERTIFICATE_ENCODED: ${{ secrets.M365_CERTIFICATE }}
    CERTIFICATE_PASSWORD: ${{ secrets.M365_CERTIFICATE_PASSWORD }}
    APP_ID: ${{ vars.M365_CLIENT_ID }}
    TENANT_ID: ${{ vars.M365_TENANT }}

- name: CLI for Microsoft 365 Deploy App
  uses: pnp/action-cli-deploy@v5
  with:
    APP_FILE_PATH: sharepoint/solution/espc-spfx-session-demo.sppkg
    SCOPE: tenant
    SKIP_FEATURE_DEPLOYMENT: false
    OVERWRITE: true
    DEBUG: true
    VERBOSE: true
```

### Certificate Generation Guide

To create a certificate for the Azure AD app registration:

```bash
# Create a self-signed certificate
openssl req -x509 -newkey rsa:2048 -keyout private.key -out certificate.crt -days 365 -nodes

# Convert to PFX format
openssl pkcs12 -export -out certificate.pfx -inkey private.key -in certificate.crt

# Base64 encode for GitHub secret
base64 -i certificate.pfx -o certificate.base64
```

Then:
1. Upload `certificate.crt` to your Azure AD app registration
2. Store the content of `certificate.base64` as the `M365_CERTIFICATE` secret
3. Store the password used during PFX creation as `M365_CERTIFICATE_PASSWORD`

### Debugging Tips

1. **Enable Debug Logging**: Set `DEBUG: true` and `VERBOSE: true` in the deploy action
2. **Check Certificate Expiry**: Ensure the certificate hasn't expired
3. **Verify Permissions**: Confirm the app registration has the required API permissions granted by an admin
4. **Validate Tenant ID**: Ensure the tenant ID is in GUID format, not the domain name

### Version Compatibility

- `pnp/action-cli-login@v3` - Current stable version with `TENANT_ID` parameter
- `pnp/action-cli-deploy@v5` - Current stable version with `SCOPE` parameter support
- Node.js 22.14.0 - Required for SPFx 1.21.1

Last Updated: July 2025