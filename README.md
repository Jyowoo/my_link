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

## Firestore link storage

Links are loaded in real time from `users/anonymous/links`. New links are auto-ID documents with the link fields, `displayOrder`, and a server-generated `createdAt` timestamp. The profile and link list share this collection. Demo JSON is no longer loaded or automatically uploaded.

Enable Cloud Firestore in the Firebase project configured by `.env.local`. Deployed security rules must allow the intended clients to read this collection and create link documents. The literal `anonymous` document is shared by all visitors; it is not a Firebase Authentication user ID. This change does not deploy security rules or enable authentication.

Saving waits for server confirmation. On failure, the dialog preserves entered values for retry. Offline saves remain pending until the connection returns.

The browser verification script requires a running app and a writable test Firebase project. It creates two persistent test links; run it against test data without concurrent writes.
