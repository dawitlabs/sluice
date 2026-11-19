# Decisions

## Design direction: paper + signal orange

Warm paper `oklch(97.4% 0.005 85)` ground, near-black warm ink, hairlines instead of cards, Instrument Serif display against Geist and Geist Mono, one vermilion `oklch(61% 0.185 38)` reserved for latency heat and failure. The accent is semantic — bottleneck span, 5xx, replay delta — not decorative.

## URL-driven console state

`/console?filter=&window=&q=` rather than client state, so filters are shareable, the back button works, and the search form still functions without JavaScript. Capture detail is a route (`/console/[id]`), not a dialog, so a capture can be pasted into an incident channel.

## One project per account

`ensureProject(ownerId)` creates `acme-api` on first console visit. Ownership is enforced by scoping every query with `projectId`, never by trusting a client-sent id.

## In-memory-free: all state in Postgres

Captures, spans, replays, alert rules and redaction rules are tables. `revalidatePath` after each mutation keeps the server-rendered views honest, and the replay result reads from the database rather than from action state so it survives a refresh.

## PPR everywhere data is request-scoped

Console routes are partial prerender: the static shell streams immediately and the session check plus queries fill in. `/docs/[slug]` pages are static via `generateStaticParams`.
