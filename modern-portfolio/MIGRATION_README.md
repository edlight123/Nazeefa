# One-click Migration (Firestore + Storage)

This project can migrate the repo’s default articles + photos into Firebase Firestore and upload photo binaries into Firebase Storage.

## Prereqs (Vercel)

Set these environment variables in Vercel:

- `FIREBASE_SERVICE_ACCOUNT_KEY`: service account JSON (or base64 JSON)
- `FIREBASE_STORAGE_BUCKET`: usually `nazeefa-ahmed.appspot.com`
- `MIGRATION_SECRET`: a long random string (keep private)

The admin system also requires:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `NODE_ENV=production`

## Run via Admin UI

1. Deploy with the env vars above.
2. Visit `/admin` and login.
3. Go to **Migration** tab.
4. Click **Run Migration** and paste `MIGRATION_SECRET`.

## Safety

- By default, migration will refuse to run if either Firestore collection `articles` or `photos` is non-empty.
- To re-run migration intentionally, update the API route to allow overwrite, or delete the collections manually.

## Verify

- Firestore should have collections: `articles`, `photos`
- Storage should have objects under: `photos/`
- `/api/debug` should show content counts and the photo URLs should be storage URLs.
