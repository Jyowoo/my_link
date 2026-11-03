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
- Publish the contents of firestore.rules in Firestore → Rules. These rules permit only request.auth.uid to read/write its users/{uid} profile and users/{uid}/links documents. Replace earlier public rules; permissive overlapping rules would still grant access.
- On Google login, identity fields (displayName generated from the email prefix before @, email, photoURL, updatedAt) are merged into users/{uid}. The screen subscribes to that document; an optional bio string is also displayed. Google identity is the display fallback if the profile is absent or cannot be read.
- Link creation, updates, deletion, and real-time reads use users/{uid}/links. Logged-out visitors receive a login explanation and cannot access link controls. Profile cards remain read-only; /links is the management screen.
- Legacy users/anonymous/links data is left untouched and is not automatically copied into an account.
- Saving waits for server confirmation. Failed operations keep the form/card available for retry. Account changes remount scoped data, stop old subscriptions, and reject actions captured from the previous account.
- node scripts/verify-auth.mjs checks login/logout, popup retry, and nonblocking profile writes. node scripts/verify-link-mutations.mjs checks mocked mutation contracts and logged-out/account-switch isolation without touching real Firebase data. The browser verification script now requires a signed-in test session; it is not an OAuth end-to-end test.

Firebase Console configuration and rules deployment are external setup steps; this repository change does not apply them to a live project.

References: [Google sign-in](https://firebase.google.com/docs/auth/web/google-signin), [Firestore owner rules](https://firebase.google.com/docs/firestore/security/rules-conditions).
