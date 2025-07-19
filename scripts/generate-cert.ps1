# This is just an example of how to generate a self-signed certificate.
$cert = New-SelfSignedCertificate -Subject "CN=ESPC25SPFxDemo" -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature -KeyLength 2048 -NotAfter (Get-Date).AddYears(1)
$password = ConvertTo-SecureString -String "YourStrongPassword123!" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "m365.pfx" -Password $password
Export-Certificate -Cert $cert -FilePath "m365.cer"°