# Gotchas

## `server-only` breaks every out-of-Next runner

`src/db/index.ts`, `src/lib/auth.ts` and `src/lib/env.ts` import `server-only`, which throws outside the React Server Component environment. Consequences:

- `pnpm dlx auth@latest generate` fails until the import is removed from `auth.ts`, `db/index.ts` and `env.ts`, then must be restored by hand.
- `src/db/seed.ts` cannot import `@/db` or `@/lib/auth`. It imports `@/db/client` (no `server-only`) and hashes the demo password with `hashPassword` from `better-auth/crypto`.

If the seed or CLI fails with a module-resolution error, this is the cause.

## Vercel env vars: `--sensitive` writes an unreadable placeholder

`vercel env add NAME production` piped from stdin stores a secret whose value reads back as `[SENSITIVE]`, and builds that need the value fail with a Zod `Invalid URL`. Always add with:

```
vercel env add NAME production --value "$VALUE" --type config --force --yes
```

Also: `vercel link` rewrites `.env.local` and wraps existing values in quotes. Anything that pipes those values onward (CLI, scripts) must strip surrounding quotes first, or the quotes become part of the value.

## Login page must not read `searchParams` in a client component

`useSearchParams` in `Log-inForm` forced the whole form out of the server HTML — the page shipped only the Suspense fallback. `/login` now reads `next` server-side and passes it as a prop, with a `//` guard to block open redirects.

## Cache Components + mutable data

Every console read happens inside a route-level `<Suspense>`, and the session check lives in `ConsoleFrame` inside that boundary. Suspense fallbacks are layout-shaped skeletons, not text, because `revalidatePath` from a Server Action re-renders the boundary and a text fallback blanks the list.

## Replay is simulated

`replayCaptureAction` inserts a replay row with a computed duration (`max(180, wall * 0.16)`) and flips `captures.replayed`. No sandbox container executes. The UI labels it `sandbox result` for that reason.
