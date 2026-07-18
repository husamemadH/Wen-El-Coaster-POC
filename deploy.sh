#!/usr/bin/env bash
# Build frontend, sync to S3, invalidate CloudFront.
# Requires: aws CLI configured with credentials for account 975804125027.
set -euo pipefail

BUCKET="coaster-archbyhusam-click"
DISTRIBUTION_ID="E3MIOOOB23GLE3"
DOMAIN="coaster.archbyhusam.click"

cd "$(dirname "$0")/frontend"

echo "→ building web bundle"
rm -rf dist
npx expo export --platform web

echo "→ syncing to s3://$BUCKET/"
# Hashed asset filenames are safe to cache aggressively; index.html must not be.
aws s3 sync dist/ "s3://$BUCKET/" \
  --delete \
  --exclude 'index.html' \
  --cache-control 'public,max-age=31536000,immutable'
aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --cache-control 'no-cache,no-store,must-revalidate' \
  --content-type 'text/html'

echo "→ invalidating CloudFront /*"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths '/*' \
  --query 'Invalidation.Id' --output text)
echo "  invalidation: $INVALIDATION_ID"

echo "✓ done — https://$DOMAIN"
