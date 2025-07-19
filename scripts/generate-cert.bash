# Script to generate a self-signed certificate and export it in PFX format
# Generate the private key and certificate
openssl req -x509 -sha256 -days 730 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt
# Export the certificate to PFX format
openssl pkcs12 -export -out certificate.pfx -inkey privateKey.key -in certificate.crt
# Encode the PFX file in base64
base64 -i certificate.pfx