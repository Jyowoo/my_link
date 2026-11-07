This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

Copy `.env.example` to `.env.local` and fill in your Firebase web app configuration before starting. `.env.local` is excluded from Git. Set the same `NEXT_PUBLIC_FIREBASE_*` variables in your hosting environment before building for deployment. These browser settings are embedded in the client bundle at build time and are not server secrets.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google login and personal links

- Firebase Authentication uses Google popup sign-in. In Firebase Console → Authentication → Sign-in method, enable Google and select a support email.
- Add localhost and the deployment hostname to Authentication → Settings → Authorized domains. Use the same Firebase project in the NEXT_PUBLIC_FIREBASE_* variables. Restart the dev server after environment changes.
- Publish the contents of firestore.rules in Firestore → Rules. These rules keep users/{uid} private, permit only its owner to write links, and allow anyone to read links. Replace earlier public rules; permissive overlapping rules would still grant access.
- On authentication restoration/sign-in, users/{uid} and displayNames/{normalizedName} are prepared in a transaction. Email prefixes seed new names; customized names, bio, and photos survive later logins. Initial collisions receive a UID suffix. The screen subscribes to that document; an optional bio string is also displayed. Google identity is the display fallback if the profile is absent or cannot be read.
- Link creation, updates, deletion, and real-time reads use users/{uid}/links. Logged-out visitors receive a login explanation and cannot access link controls. Profile cards remain read-only; /links is the management screen.
- Legacy users/anonymous/links data is left untouched and is not automatically copied into an account.
- Saving waits for server confirmation. Failed operations keep the form/card available for retry. Account changes remount scoped data, stop old subscriptions, and reject actions captured from the previous account.
- node scripts/verify-auth.mjs checks login/logout, popup retry, and nonblocking profile writes. node scripts/verify-link-mutations.mjs checks mocked mutation contracts and logged-out/account-switch isolation without touching real Firebase data. The browser verification script now requires a signed-in test session; it is not an OAuth end-to-end test.

Firebase Console configuration and rules deployment are external setup steps; this repository change does not apply them to a live project.

References: [Google sign-in](https://firebase.google.com/docs/auth/web/google-signin), [Firestore owner rules](https://firebase.google.com/docs/firestore/security/rules-conditions).

## Profile editing and unique names

- Profile menu → 프로필 수정 opens /settings/profile. Edit display name and bio (up to 200 characters); email stays read-only and the existing Google profile photo is preserved.
- Display names use 2–30 Korean/Latin letters, numbers, or ._+-. Names are NFKC-normalized and case-insensitive. The availability button checks displayNames/{lowercaseName}; the final transaction checks again, reserves the new name, updates the profile, and releases the old reservation atomically.
- Publish the UPDATED firestore.rules before using this feature. Owner-only profile rules now require a matching reservation and the old reservation to be released on rename. Public name projections allow single-document reads without login, not collection listing.
- Existing accounts claim their names at their next authentication restoration/sign-in. A legacy name without a reservation is not a guaranteed unique name; if another account already claimed it, initialization assigns a suffix. No bulk migration of inactive accounts has been run.
- node scripts/verify-profile.mjs checks validation, normalization, name collisions, concurrent claims, rename/release, saved-name persistence, and stale-account rejection with an optimistic in-memory transaction model. Production rules deployment and emulator validation are separate steps.

## Public username pages

- /[username] resolves usernames/{username} to a user ID, then reads users/{uid}/links ordered by displayOrder. Unknown, invalid, or reserved names return the custom 404 page. Database errors propagate as server errors rather than pretending the user does not exist.
- Public usernames documents contain only uid, username, displayName, bio, and photoURL; email stays in the private users document. Profile transactions update both documents atomically.
- Header and profile menu include a personal-page link once the profile is prepared. Link copy now copies that public URL, using the independent username instead of the display name.
- Re-publish firestore.rules and sign in again or save the profile once to upgrade an existing UID-only name reservation into a public profile. Inactive legacy reservations without public fields return 404 until upgraded.
- links, preview, settings, api, _next, favicon.ico, robots.txt, sitemap.xml and dot paths are reserved. Renaming releases the old name, so its old URL stops identifying that user and may later be reused by another user.
- Public pages expose the user’s links to logged-out visitors but do not offer edit/delete controls. No draft/private-link option is implemented.
- node scripts/verify-public-profile.mjs checks missing names, lookup normalization, target-user links, omission of email, unsafe-link filtering and backend error propagation.

## Editable page address

- users/{uid}.username is the independent address ID. Profile settings provide its own availability check. It accepts 3–30 English letters, digits, underscores or hyphens, starts with a letter/digit, and is stored lowercase. Service paths are reserved.
- usernames/{username} stores the public profile projection and unique ownership. The final transaction claims the new address, updates both profile projections, and releases the old address atomically. Display-name uniqueness still uses displayNames independently.
- Changing displayName now leaves the URL unchanged. Address changes invalidate the old address and allow reuse by another user; automatic redirects are not implemented.
- Existing accounts receive an email-prefix based address on next authentication restoration/sign-in, with a UID suffix for collisions. Republish the updated firestore.rules and sign in again. Old display-name URLs are replaced by the new username URL.
- The header, profile dropdown and copy-link action use username. Link content stays at users/{uid}/links.

## Security rule paths

- users/{userId}/links/{linkId}: anyone may read; only a signed-in user with request.auth.uid == userId may create/update/delete.
- users/{userId}/profile/{profileId}: anyone may read; only the owner may write. Public profile fields are allowlisted and must match users/{userId} after the transaction, preserving existing name/address ownership checks. Email and arbitrary fields are not permitted in these public documents.
- The CURRENT profile editor writes users/{userId}, not the profile subcollection. Its private read and existing atomic uniqueness rules remain in place. These rules do not migrate or automatically create profile subcollection documents.
- If a future editor writes both the canonical profile and profile subdocument, write them in one transaction with matching public fields. The existing usernames registry remains the source for public-page lookup.
- Rules are not deployed automatically; publish the full firestore.rules file in Firebase Console. Emulator enforcement has not been validated in this change.
