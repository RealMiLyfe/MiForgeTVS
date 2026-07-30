# MiForgeTVS — Full Repository Audit ("DOA / Amax Dept Audit")

**Date:** 2026-07-30 · **Branch:** `arena/019fb2cc-miforgetvs` · **Base commit:** `16410a2`
**Scope:** every tracked file in the repo (211 files, ~15,500 LOC excluding `package-lock.json`).

---

## 0. TL;DR — Verdict per department

| Department | Files | Verdict | Confidence |
|---|---|---|---|
| **MiForge web app (Next.js)** | 163 | **Alive, but 100% mock-data** — typechecks clean, lints clean, no real backend wired | High |
| **Titan agent runtime (Python)** | 5 | **DOA outside the Titan machine** — hardcoded absolute paths, imports a file not in this repo | High |
| **Bridge API** | 2 copies, **contradictory** | **One is DOA** (`apps/titan` version imports functions that don't exist in its sibling runtime… actually it's the *root* copy that is the fixed one) | High |
| **`packages/*` (bridge + agent-mapping)** | 3 | **Dead code** — nothing imports them, no `package.json`, mapping keys don't match the catalog | High |
| **Docs** | 9 | **Aspirational, ahead of the code** — describe infra (`/infrastructure`, `/supabase`) that isn't in the repo | High |
| **Scripts** | 3 | 1 empty file, 2 overlapping starters with wrong hardcoded paths | High |
| **`TVS.zip`** | 1 | **Git-LFS pointer, 597 MB payload not fetched** — repo is unusable as a full Titan restore | High |

**Bottom line:** this is a *presentation-layer product that builds and runs standalone in placeholder mode*, bolted to a *Titan integration layer that cannot run anywhere except one specific Ubuntu box* (`/home/milyfe/Desktop/TVS`, `/opt/milyfe/...`). Nothing in the Next.js app actually calls the Bridge except two thin `/api/titan/*` probe routes.

---

## 1. Repository map

```
MiForgeTVS/
├── README.md, vercel.json, .gitignore, .gitattributes
├── TVS.zip                     ← LFS pointer, 625,948,974 bytes, NOT fetched
├── agents/                     ← "live" Titan runtime (root copy, 1,306 LOC)
│   ├── api/agent_api.py            535 LOC — Bridge API (FastAPI, port 8099)
│   ├── runtime/agent_runtime.py    629 LOC — 11 agents, scheduler, file watcher
│   └── memory/memory_manager.py    142 LOC — ChromaDB + nomic-embed memory
├── apps/
│   ├── miforge/                ← Next.js 14 app (163 files)
│   └── titan/                  ← SECOND, DIFFERENT copy of the Titan runtime
│       ├── agents/api/agent_api.py      383 LOC
│       ├── agents/runtime/agent_runtime.py 335 LOC
│       ├── agents/api/requirements.txt
│       └── scripts/start-milyfe.sh      107 LOC
├── packages/
│   ├── bridge/src/titan-client.ts       178 LOC — DEAD
│   └── agent-mapping/{resolver.ts,mapping.yaml} — DEAD
├── docs/                       9 markdown files (1 empty)
└── scripts/
    ├── start-milyfe.sh         ← 0 bytes
    └── unified-start.sh        90 LOC
```

The README advertises `/infrastructure` (Supabase migrations + Docker) and `docs/` references `supabase/migrations/0001..0008`, `supabase/policies/rls_policies.sql`, `supabase/seed.sql`. **None of those directories or files exist in the repo.**

---

## 2. `apps/miforge` — the Next.js presentation layer

**Stack:** Next.js 14.2.35 (App Router) · React 18 · TypeScript strict · Tailwind + shadcn/ui · framer-motion · Supabase JS/SSR · Resend.

**Counts:** 45 pages · 27 API routes · 4 layouts · 56 components · 35 lib modules.

### 2.1 Health checks I ran

| Check | Result |
|---|---|
| `npm install` | ✅ clean |
| `npx tsc --noEmit` | ✅ **zero errors** |
| `npx next lint` | ✅ 8 warnings only (unused imports, 1 `exhaustive-deps`) |
| `npm run build` | ❌ **fails in this sandbox only** — `next/font/google` can't reach `fonts.googleapis.com` (Fraunces, Inter, JetBrains Mono). Network-egress artifact, not a code bug. Will build on Vercel. |

### 2.2 File-by-file

**App shell**
- `src/app/layout.tsx` — 3 Google fonts, `AuthProvider` → `GlobalNav` → children → `ConciergeWidget` → `Toaster`.
- `src/middleware.ts` — public/operator path lists, reads a `milyfe_mock_auth` cookie. **Effectively a no-op**: when the cookie is absent it calls `NextResponse.next()` and defers to client-side `localStorage`. Operator routes are only guarded if the cookie happens to exist. **This is an open-door auth model.**
- `src/app/globals.css`, `tailwind.config.ts` — custom `milyfe-*` design tokens (bg/surface/border/text/emerald/gradient).
- `robots.ts`, `sitemap.ts` (13 factory slugs hardcoded), `not-found.tsx`, `favicon.ico`.

**Public marketing** — `page.tsx` (home: ConciergeHero → LiveAssemblyCinematic → SocialProof → ProductsShowcase → ManifestoExcerpt → ClosingCTA), `/miforge` + `/miforge/{catalog,pricing,how-it-works,bespoke}`, `/manifesto`, `/factories`, `/discover`, `/contact`, `/status`, `/unsubscribe`, legal (`/terms`, `/privacy`, `/refunds` via `LegalPageLayout`).

**Factory experience** — `/factory/[slug]/page.tsx` (158 LOC: cinematic → AgentCanvas → chat drawer → LiveActivityFeed), `loading.tsx`, `not-found.tsx`, and `/factory/[slug]/unlock/page.tsx` (180 LOC, 5-step checkout: payment → contract → ignition; **`handlePay()` is a `console.log` + `setTimeout`**).

**Client dashboard** (`/dashboard/*`, 11 pages) and **operator console** (`/operator/*`, 13 pages incl. `/operator/titan`). Both are complete UIs.

**API routes (27)** — grouped by honesty:
- *Real logic:* `agents/[factory_slug]/[agent_slug]/chat` (rate limit + provider routing + mock fallback), `concierge/chat` (SSE char-by-char streaming), `concierge/extract-intent`, `concierge/generate-preview`, `factory/[slug]/next-event`.
- *Thin Titan proxies:* `titan/check/[slug]`, `titan/activity/[slug]` — the **only** places the app touches the Bridge.
- *Stubs that always return `{success:true}`:* all 4 `auth/*`, both `activations/*`, `bespoke/*`, `contact`, `factory/[slug]/track`, `factory/[slug]/generate-events`, both `cron/*` (just `console.log`), and **all 4 webhooks** (`paddle`, `gocardless`, `docuseal`, `resend`) which **do not verify signatures** — they log and 200.

**`src/lib` (35 modules)** — `env.ts` (`isPlaceholderMode()` gate used everywhere), `ai/{client,routing,rate-limit,cost-tracker,mock-responses,types}`, `agents/concierge/{system-prompt,intent-extraction,factory-generation,mock-conversation}`, `supabase/{client,server,admin,mocks,types}`, `auth/{mock-auth,roles,session}`, `factory/{connections,event-bus,grid-layout,personalize}`, `titan/{client,hooks}`, plus `email`, `analytics`, `chat`, `concierge`, `sound`, `motion`, `toast`, `utils`.

**`lib/supabase/mocks.ts` (354 LOC) is the real database.** It holds 13 factories, 32 catalog agents, pricing tiers, bespoke requests, activity events, and a `mockQuery()` shim. 15 of 45 pages import it directly; the other 28 pages have their data **hardcoded inline in the component** (e.g. `operator/titan/page.tsx` hardcodes a 14-service "all operational" list, `operator/analytics` hardcodes the funnel, `status/page.tsx` hardcodes uptime percentages).

### 2.3 Dead / unwired code in the app

Unreferenced modules (nothing imports them):
```
components/home/Hero.tsx          (superseded by ConciergeHero)
components/ui/{avatar,badge,card,dialog,drawer,scroll-area,select,tooltip}.tsx
lib/agents/concierge/system-prompt.ts   ← the real prompt is unused; mock-conversation is used
lib/analytics/events.ts                 ← no event is ever tracked
lib/auth/session.ts                     ← server-side session helper never called
lib/sound/index.ts
lib/supabase/admin.ts                   ← only referenced inside a comment in cost-tracker
lib/titan/hooks.ts                      ← useTitanStatus/useTitanActivity never mounted
lib/titan/client.ts                     ← getTitanClient() never called anywhere
lib/email/client.ts                     ← sendEmail() never called anywhere
```
Unused dependencies in `package.json`: `@radix-ui/react-slot`, `next-themes`, `resend`, **`shadcn`** (the CLI, shipped as a runtime dep).

### 2.4 Data-model drift inside the app

- `lib/ai/routing.ts` defines routing for **11** agent slugs; the catalog has **32**. The other 25 silently fall through to the default.
- `lib/ai/mock-responses.ts` has **7** keyed responses for 32 agents.
- Catalog slugs use one naming scheme (`invoice_processor`, `blog_writer`, `lead_qualifier`) while `packages/agent-mapping` uses a completely different one (`invoice_followup`, `blog_content`, `lead_qualification`). See §4.

---

## 3. Titan / Python — two runtimes, both unrunnable here

There are **two divergent copies** of the same subsystem.

### 3.1 `agents/` (root copy — the "live" one, 1,306 LOC)

`agents/runtime/agent_runtime.py` (629 LOC)
- 11 agents in an `AGENTS` dict (Forge, Calvin, Frank, Serena, Dex, Paula, Lia, Ian, Sam, Iris, Leo) with name/model/channel/role/emoji.
- Functions: `load_secrets`, `get_client_for_file`, `record_to_hledger`, `post_to_mattermost`, 5× Akaunting helpers, `ask_ollama`, `log_to_dashboard`, `daily_standup`, `watch_incoming_files`, `weekly_retrospective`, `daily_invoice_report`, `announce_all_agents`, `main`.
- **DOA hazards:**
  - Lines 17–20 `exec_module` a file at `/home/milyfe/Desktop/TVS/agents/payments/gocardless_handler.py` — **not in this repo**. Import crashes immediately anywhere else.
  - `load_dotenv('/home/milyfe/Desktop/TVS/.env')` — absolute.
  - `TOKENS, CHANNELS = load_secrets()` executes **at import time**, reading `/opt/milyfe/secrets/*.json`. Any importer (including the Bridge API) dies without those files.
  - `get_client_for_file()` hardcodes exactly two clients by substring: `teresa` and `ohio`.
  - Duplicate imports at line 329 (`Path`, `subprocess`) mid-file.
  - Requires `schedule`, `python-dotenv`, `requests` — **none of which appear in any `requirements.txt` in the repo**.

`agents/api/agent_api.py` (535 LOC) — this is the file the HEAD commit fixed. It imports **only** functions that genuinely exist in the root runtime and synthesises the rest via `ask_ollama()`. 23 endpoints: `/health`, `/health/models`, `/agents/status`, `/agents/{standup,retrospective,invoice-report,announce}`, `/agents/serena/{research,monitor}`, `/agents/frank/{summary,all-clients}`, `/agents/leo/{errors,retrospective}`, `/agents/ian/recurring`, `/agents/sam/status`, `/agents/dex/{draft-email,check-overdue}`, `/ollama/generate`, `/clients`, `/clients/{slug}`, `/clients/onboard`, `/clients/{slug}/ledger/{summary,transactions}`.

`agents/memory/memory_manager.py` (142 LOC) — ChromaDB v2 API + `nomic-embed-text`. **Completely orphaned: nothing imports `MemoryManager` anywhere in the repo.**

### 3.2 `apps/titan/` (second copy — 825 LOC)

- `agents/runtime/agent_runtime.py` (335 LOC) — a *cleaner, different* runtime: `SENIOR_AGENTS` list, `_ollama_generate`, `_post_to_mattermost`, and the per-agent functions the docs describe (`serena_research_company`, `serena_monitor_vendors`, `frank_client_summary`, `frank_all_clients_summary`, `leo_weekly_error_report`, `ian_check_recurring_vendors`, `sam_daily_status`, `dex_draft_vendor_email`, `dex_check_overdue_vendors`).
- `agents/api/agent_api.py` (383 LOC) — imports all of those directly, uses `Depends(verify_token)` (cleaner auth than the root copy's manual `authenticate(request)`), and **adds an endpoint the root copy lacks**: `GET /clients/{slug}/mattermost/messages`.
- `agents/api/requirements.txt` — fastapi/uvicorn/pydantic/requests. **Missing `schedule` and `python-dotenv`** needed by the root runtime.
- `scripts/start-milyfe.sh` (107 LOC) — 6-step boot, `TITAN_ROOT=/opt/milyfe`.

### 3.3 The fork is the single biggest liability

| Aspect | `agents/` (root) | `apps/titan/agents/` |
|---|---|---|
| LOC | 1,306 | 825 |
| Per-agent functions | ❌ synthesised via `ask_ollama` | ✅ real functions |
| Scheduler / file watcher | ✅ | ❌ |
| GoCardless / Akaunting / hledger writes | ✅ | ❌ |
| Mattermost message endpoint | ❌ | ✅ |
| Auth style | manual `authenticate()` | `Depends(verify_token)` |
| Ledger journal path | `{slug}/ledger/{slug}.journal` | `{slug}/ledger/main.journal` ⚠️ **conflicting** |
| Import-time crash risk | ✅ high | low |

Both compile (`py_compile` passes on all 5 Python files). Both auth layers **fail open**: if no token file and no `TITAN_BRIDGE_TOKEN` env var, the API serves *everything* unauthenticated.

`scripts/unified-start.sh` boots `$TITAN_DIR = apps/titan`, so **the `apps/titan` copy is what actually runs**, while the root `agents/` copy is what the last commit was fixing. That contradiction is unresolved in the tree.

---

## 4. `packages/` — dead integration layer

- `packages/bridge/src/titan-client.ts` (178 LOC) — the *fuller* TitanClient: adds `LedgerTransaction`, `AgentActivity`, `MattermostMessage`, availability caching, `getLedgerTransactions`, `getAgentActivity`, `executeAgent`, `chatWithAgent`.
- `apps/miforge/src/lib/titan/client.ts` (78 LOC) — a **stripped-down duplicate** of the same class. Neither is imported anywhere.
- `packages/agent-mapping/{resolver.ts, mapping.yaml}` — resolver and YAML agree with each other (0 diff) but **disagree completely with the product catalog**: of 32 catalog slugs, **26 have no mapping**, and 25 mapped slugs don't exist in the catalog. So the "32 catalog agents → 11 seniors" claim in the README/docs is not actually satisfied by the data.
- No `package.json`, no `tsconfig`, no workspaces root. `packages/` is not resolvable by any build.

**Client-method vs Bridge-endpoint mismatches:** `triggerAudit()` calls `POST /clients/{slug}/audit` and `executeAgent()` calls `POST /agents/{senior}/execute` — **neither endpoint exists in either Python API**. `getAgentActivity()` calls `/clients/{slug}/agents/activity` — also missing. `docs/INTEGRATION.md` documents all three as if they exist.

---

## 5. Docs — 9 files, well-written, ahead of reality

| File | LOC | Note |
|---|---|---|
| `ARCHITECTURE.md` | 77 | Two-layer model, sovereignty diagram. Accurate as intent. |
| `INTEGRATION.md` | 68 | Bridge endpoint table — **3 of 11 endpoints don't exist**. |
| `MODEL_ARCHITECTURE.md` | 65 | Tiered Ollama routing. Nothing in code reads this routing table. |
| `SOVEREIGN_POSITIONING.md` | 59 | Marketing/compliance framing. |
| `DEPLOYMENT.md` | 65 | References `supabase/migrations/0001-0008`, `rls_policies.sql`, `seed.sql` — **all absent**. |
| `LAUNCH_CHECKLIST.md` | 67 | ~60 boxes, **0 ticked**. Honest reflection of state. |
| `AIDER_MASTER_PROMPT.md` | 507 | Full build-out brief; documents machine state, secrets, ports. |
| `AIDER_EXECUTION_PLAN.md` | 300 | Phases A–D. Phase A lists 6 known runtime bugs + an `AGENT_MODEL_ROUTING` dict — **none of which are present in either runtime file**, so Phase A was never applied. |
| `BRIDGE_API_TESTING.md` | **0** | Empty file. |

Docs also leak operational detail into a public-ish repo: machine spec, all 14 service ports, secrets filenames, client slugs (`teresa-grooming`, `ohio-landscaping`).

---

## 6. Scripts & config

- `scripts/start-milyfe.sh` — **0 bytes.** Duplicate name of `apps/titan/scripts/start-milyfe.sh` (107 LOC, real).
- `scripts/unified-start.sh` (90 LOC) — defaults `TITAN_DIR`/`MIFORGE_DIR` to `/projects/sandbox/MiForgeTVS/...`, a **third** path convention (vs `/home/milyfe/Desktop/TVS` in the runtime and `/opt/milyfe` in the Titan starter). Both bash scripts pass `bash -n`.
- `vercel.json` (root) → `rootDirectory: apps/miforge`. `apps/miforge/vercel.json` adds region `iad1` + 2 crons. Two config files, one of which Vercel will ignore depending on project settings.
- `next.config.mjs` — good security headers (HSTS, X-Frame-Options DENY, nosniff, Permissions-Policy) and 3 redirects. **No CSP.**
- `.env.example` — 27 vars, all `PLACEHOLDER`. Complete and matches `lib/env.ts`, except `lib/env.ts`'s `EnvKey` union **omits** `TITAN_BRIDGE_URL`, `TITAN_BRIDGE_TOKEN`, `CRON_SECRET`, `NEXT_PUBLIC_POSTHOG_*` — so those are read via raw `process.env` and bypass the placeholder guard.
- `TVS.zip` — LFS pointer to a **597 MB** object. `git lfs` is not installed in this environment, so the payload is unavailable. Shipping a 600 MB binary through the repo is an anti-pattern regardless.

---

## 7. Risk register (ranked)

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | 🔴 Critical | **Webhooks accept anything.** Paddle/GoCardless/DocuSeal/Resend handlers do no signature verification and return 200. | `api/webhooks/*` |
| 2 | 🔴 Critical | **Auth is theatre.** Middleware falls through when the cookie is missing; `/api/auth/signin` returns success for any credentials and grants `admin` to a hardcoded email. Operator console is reachable. | `middleware.ts`, `api/auth/*` |
| 3 | 🔴 Critical | **Bridge API fails open.** No token file + no env var ⇒ all endpoints unauthenticated, including `POST /clients/onboard` which shells out to `onboard-client.sh` and `/ollama/generate`. | both `agent_api.py` |
| 4 | 🔴 High | **Runtime is un-importable off the Titan box** (absolute `exec_module` of a file not in the repo; secrets loaded at import time). | `agents/runtime/agent_runtime.py:17-22,42` |
| 5 | 🟠 High | **Two divergent Python runtimes + two divergent TitanClients.** No single source of truth; ledger paths conflict (`{slug}.journal` vs `main.journal`). | `agents/` vs `apps/titan/` |
| 6 | 🟠 High | **`packages/` is unreachable dead code** — no `package.json`, no workspaces, zero importers. | `packages/*` |
| 7 | 🟠 High | **Agent-mapping doesn't map the catalog** — 26/32 catalog slugs unmapped; 25 mapped slugs are fictional. The core "32→11" promise is unimplemented. | `mapping.yaml`, `mocks.ts` |
| 8 | 🟠 Medium | **Documented endpoints don't exist**: `/clients/{slug}/audit`, `/agents/{senior}/execute`, `/clients/{slug}/agents/activity`. | `INTEGRATION.md` vs API |
| 9 | 🟠 Medium | **Missing Python deps**: `schedule`, `python-dotenv` absent from the only `requirements.txt`. | `apps/titan/agents/api/requirements.txt` |
| 10 | 🟡 Medium | **Rate limiter is per-process in-memory** — useless on Vercel serverless (each lambda has its own `Map`). | `lib/ai/rate-limit.ts` |
| 11 | 🟡 Medium | **Referenced infra absent**: `/infrastructure`, `supabase/migrations/*`, `rls_policies.sql`, `seed.sql`, `docker-compose.yml`, `onboard-client.sh`, `refresh-mm-token.sh`. | README, `DEPLOYMENT.md`, scripts |
| 12 | 🟡 Medium | **Phase A bug-fix plan never applied** — the 6 documented runtime bugs and `AGENT_MODEL_ROUTING` are still absent. | `AIDER_EXECUTION_PLAN.md` |
| 13 | 🟡 Low | **597 MB LFS zip** in-repo; unfetchable here. | `TVS.zip` |
| 14 | 🟡 Low | **`shadcn` CLI as a runtime dependency**; 4 more unused deps. | `package.json` |
| 15 | 🟡 Low | **~10 dead modules + 8 unused UI primitives** in the app. | `src/lib`, `src/components/ui` |
| 16 | 🟡 Low | **3 conflicting path conventions** across the 3 shell scripts; one script is 0 bytes. | `scripts/`, `apps/titan/scripts/` |
| 17 | ⚪ Info | 28/45 pages hardcode their data inline rather than going through `mocks.ts`. | `src/app/**` |
| 18 | ⚪ Info | No tests of any kind. No CI workflow. No `.github/`. | repo-wide |
| 19 | ⚪ Info | No CSP header; `next/font` requires build-time egress to Google Fonts. | `next.config.mjs`, `layout.tsx` |
| 20 | ⚪ Info | Operational secrets layout, ports, hardware spec and real client slugs documented in-repo. | `docs/AIDER_MASTER_PROMPT.md` |

---

## 8. What actually works today

- ✅ The Next.js app **typechecks and lints clean** and is a genuinely complete, polished 45-page product surface.
- ✅ Placeholder mode is well-engineered: `isPlaceholderMode()` gates Supabase, AI, payments, email and analytics consistently, so the whole UX is demoable with zero credentials.
- ✅ The Concierge SSE streaming, factory cinematic, agent canvas and 5-step unlock flow are all implemented end-to-end (against mocks).
- ✅ All 5 Python files compile; both shell scripts parse.
- ✅ Security headers, redirects, sitemap/robots and Vercel cron wiring are production-shaped.

## 9. Recommended order of work

1. **Pick one Python runtime.** Merge `apps/titan`'s per-agent functions + `verify_token` + Mattermost endpoint into the root `agents/`, delete the loser, settle on one ledger journal filename.
2. **De-fang the import-time crashes** — lazy-load secrets, make the GoCardless import optional, move all absolute paths to env vars with sane defaults.
3. **Close the three fail-open security holes** — webhook signature verification, real session validation in middleware/`api/auth`, and make the Bridge *refuse to start* without a token.
4. **Decide `packages/`' fate** — either add a root `package.json` with workspaces and make `apps/miforge` import `@milyfe/bridge` + `@milyfe/agent-mapping` (deleting the duplicated `lib/titan/client.ts`), or delete `packages/` entirely.
5. **Reconcile the agent mapping** with the 32 real catalog slugs, then add a test that asserts every catalog slug resolves to a senior.
6. **Implement or delete the three phantom endpoints**, then rewrite `INTEGRATION.md` from the code.
7. **Add the missing infra** (`supabase/`, `infrastructure/`) or strip the references from README/`DEPLOYMENT.md`.
8. **Housekeeping** — pin missing Python deps, delete the 0-byte script, fill or delete `BRIDGE_API_TESTING.md`, prune ~15 dead modules and 5 unused npm deps, move `TVS.zip` out of Git.
9. **Add a CI workflow** running `tsc --noEmit`, `next lint`, `py_compile` and `bash -n` — every one of those passes today, so it would lock in the current floor.
