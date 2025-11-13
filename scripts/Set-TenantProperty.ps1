# Set-TenantProperty.ps1
# PowerShell script to set the ESPC25:CustomerForm:Environment tenant property using PnP PowerShell

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("TEST", "PROD")]
    [string]$Environment,

    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,

    [Parameter(Mandatory = $true)]
    [string]$ClientId,

    [Parameter(Mandatory = $false)]
    [bool]$SetAtSiteLevel
)

# Function to write colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    switch ($Color) {
        "Green" { Write-Host $Message -ForegroundColor Green }
        "Yellow" { Write-Host $Message -ForegroundColor Yellow }
        "Red" { Write-Host $Message -ForegroundColor Red }
        "Cyan" { Write-Host $Message -ForegroundColor Cyan }
        default { Write-Host $Message }
    }
}

# Check if PnP PowerShell is installed
try {
    Import-Module PnP.PowerShell -ErrorAction Stop
    Write-ColorOutput "✅ PnP PowerShell module loaded successfully" "Green"
} catch {
    Write-ColorOutput "❌ PnP PowerShell module not found. Please install it using: Install-Module PnP.PowerShell -Scope CurrentUser" "Red"
    exit 1
}

# Determine connection URL
$ConnectionUrl = $SiteUrl

if ([string]::IsNullOrEmpty($ConnectionUrl)) {
    Write-ColorOutput "❌ Either SiteUrl or TenantUrl parameter must be provided" "Red"
    exit 1
}

# Property details
$PropertyKey = "ESPC25:CustomerForm:Environment"
$PropertyValue = $Environment

try {
    # Connect to SharePoint
    Write-ColorOutput "🔗 Connecting to SharePoint at: $ConnectionUrl" "Cyan"
    Connect-PnPOnline -Url $ConnectionUrl -ClientId $ClientId -Interactive
    Write-ColorOutput "✅ Connected successfully" "Green"
    
    # Set the tenant property
    Write-ColorOutput "⚙️  Setting tenant property..." "Cyan"
    Write-ColorOutput "   Property Key: $PropertyKey" "Yellow"
    Write-ColorOutput "   Property Value: $PropertyValue" "Yellow"
    
    if ($SetAtSiteLevel -eq $true) {
        Set-PnPSite -Identity $SiteUrl -NoScriptSite $false
        Set-PnPStorageEntity -Key $PropertyKey -Value $PropertyValue -Scope Site
    } else {
        Set-PnPStorageEntity -Key $PropertyKey -Value $PropertyValue
    }
    
    Write-ColorOutput "✅ Tenant property set successfully!" "Green"
    
    # Verify the property was set
    Write-ColorOutput "🔍 Verifying the property was set..." "Cyan"
    $VerifyProperty = Get-PnPStorageEntity -Key $PropertyKey
    
    if ($VerifyProperty -and $VerifyProperty.Value -eq $PropertyValue) {
        Write-ColorOutput "✅ Verification successful!" "Green"
        Write-ColorOutput "   Current Value: $($VerifyProperty.Value)" "Green"
        Write-ColorOutput "   Description: $($VerifyProperty.Description)" "Green"
    } else {
        Write-ColorOutput "⚠️  Verification failed - property may not have been set correctly" "Yellow"
    }
    
} catch {
    Write-ColorOutput "❌ Error occurred: $($_.Exception.Message)" "Red"
    Write-ColorOutput "❌ Error occurred: $($_.Exception.TargetSite)" "Red"
    Write-ColorOutput "❌ Error occurred: $($_.Exception.Source)" "Red"
    Write-ColorOutput "❌ Error occurred: $($_.Exception.StackTrace)" "Red"
    exit 1
} finally {
    # Disconnect
    try {
        Disconnect-PnPOnline
        Write-ColorOutput "🔌 Disconnected from SharePoint" "Cyan"
    } catch {
        # Ignore disconnect errors
    }
}

Write-ColorOutput "🎉 Script completed successfully!" "Green"

# Usage examples:
Write-ColorOutput "`n📋 Usage Examples:" "Cyan"
Write-ColorOutput "   Set to TEST environment:" "Yellow"
Write-ColorOutput "   .\Set-TenantProperty.ps1 -Environment TEST -TenantUrl 'https://yourtenant-admin.sharepoint.com' -ClientId '<App registration id>'" "White"
Write-ColorOutput "`n   Set to PROD environment:" "Yellow"
Write-ColorOutput "   .\Set-TenantProperty.ps1 -Environment PROD -SiteUrl 'https://yourtenant.sharepoint.com/sites/yoursite' -ClientId '<App registration id>'" "White"