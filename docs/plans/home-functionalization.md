# Home Screen Functionalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every element on the logged-in Swachha Parisara Home screen work end-to-end with real state, real navigation, user-scoped mock persistence, notification preference filtering, and developer test controls while strictly freezing the current UI design (`0` visual changes).

**Architecture:** Clean layered frontend architecture (`pages -> hooks -> services -> utils`) backed by `storageAdapter` (`src/services/storageAdapter.js`). Every concern has a dedicated async service (`homeApi`, `pickupApi`, `notificationApi`, `rewardsApi`, `learnApi`) with user-scoped keys, realistic simulated latency, and an invisible developer harness (`window.__swachhaDev`) for resetting seed data, simulating network errors/delays, and advancing pickup lifecycles (`Requested -> Scheduled -> On the way -> Completed`).

**Tech Stack:** React 19, Vite 8, React Router v7, i18next (`en` + `kn`), Tailwind CSS v4 (frozen classes), Node.js built-in test runner (`node --test` — zero external dependencies required).

**Spec:** User prompt specification (`Make the Home Screen Fully Functional (Mock Services, No UI Change) — Swaccha Parisara`).

## Global Constraints

- **UI FREEZE:** Do not change layout, colors, spacing, classes, icons, illustrations, copy, or animations. Only wire props, click handlers, navigation, `aria-label`s, hooks, services, utils, and existing loading/empty/error states.
- **No New Dependencies:** Do not add any npm package without explicit user approval. Use Node.js built-in `node:test` and `node:assert/strict` for unit/integration tests of utils, selectors, and services.
- **No Political References:** Zero MLA, MP, or politician references anywhere in code, data, or tests.
- **i18n Compliance:** All UI strings go through i18n keys (`src/i18n/en/translation.json` with `[KN] ...` placeholders in `src/i18n/kn/translation.json`). Learn article bodies stay English only.
- **Branch Isolation:** All implementation commits happen on a dedicated feature branch (`feat/home-functional`), leaving other tabs untouched beyond the minimum shared service contract they need.

## Review Focus

1. **Multi-user session isolation (`sign out -> sign in as another user`):** Signing in as a new phone number (`9845099887`) after using the seeded `9876543210` account must show `0 kg`, `0 pickups`, `0 points`, and an empty notification inbox — never leaking the previous user's pickups, points, or read/deleted notifications.
2. **Timezone & clock boundaries (`Asia/Kolkata` IST vs device UTC offset):** `getGreetingKey(date)` and `isCurrentMonthIst(dateStr, now)` must evaluate hours and calendar year/month in India Standard Time (`UTC+05:30`) so a pickup completed on the 1st of the month in IST or late at night never falls into the wrong month or wrong time-of-day greeting.
3. **Past uncompleted pickups (`missed` filtering):** A pickup with status `Requested` or `Scheduled` whose scheduled date is strictly before today (`YYYY-MM-DD < todayIst`) must be treated as missed and excluded from `buildUpcomingPickups`.
4. **Notification target missing or deleted:** Tapping a notification whose referenced pickup or report ID no longer exists must mark the notification read, navigate to the target tab, and display a friendly toast message (`t('home_notif_target_missing')`) rather than crashing or hanging.
5. **Rapid double-tap idempotency & section-level fault isolation:** Double-tapping mark-read, delete, or a pickup card must not fire duplicate mutations or duplicate navigation; if `learnApi.getHighlights()` rejects, the rest of Home (Greeting, Rewards pill, Notifications, Contribution card, Scheduled pickups) still renders normally.

---

## Step 1 Audit Result: Current Home Screen Elements

| Element | Current Status | Current Data Source | What Is Missing for Full End-to-End Functionality |
|---|---|---|---|
| **Greeting (`Good morning/afternoon/evening, {firstName}`)** | Partly wired | `getGreetingKey()` in `src/utils/homeUtils.js` + `user?.name` in `useHome.js` | Uses local `date.getHours()` instead of explicit India time (`Asia/Kolkata`), does not refresh if the user returns after an hour, and falls back to empty string `""` instead of a graceful fallback (`t('home_default_resident')`) when `user.name` is missing. |
| **Avatar (initials / photo)** | Partly wired | `getInitials(user?.name)` in `useHome.js` rendered as a static `<span>` in `HomeGreetingRow.jsx` | Only renders initials (ignores `user.avatarUrl` uploaded in Profile) and is a non-interactive `<span>` — tapping it does **not** navigate to `/profile`. |
| **Rewards Pill (`1,240 pts`)** | Partly wired | `home.summary?.points` -> `pickupApi.getProfile().points` | Not using `rewardsApi` as the single source of truth; not derived from completed weighed pickups minus NGO donations; does not isolate per user account. |
| **Notification Bell & Unread Badge** | Partly wired | `home.unreadCount` from `homeApi.getOverview()` | Badge works (`9+` when `> 9`), but notifications come from a static array in `homeApi.js` instead of a dedicated `notificationApi` service; does not respect Profile notification toggles (`pickupUpdates`, `reportStatus`, `ngoNews`); does not clear/scope on sign-out. |
| **Notification Inbox (mark read, mark all read, delete, tap to navigate)** | Partly wired | `NotificationInbox.jsx` calls `onMarkRead(id)` and `onMarkAllRead()` | Tapping a notification only marks it read — it does **not** close the inbox or navigate to `/pickup`, `/rewards`, or `/map?report=<id>`, has **no delete action**, and does not handle missing/deleted target entities with a friendly message. |
| **Contribution Card (`kg contributed`, `Pickups completed`, `Reports made`, `kg this month`)** | Hardcoded / Partly wired | `buildContributionSummary` in `homeUtils.js` + `SAMPLE_KG_THIS_MONTH = 6.4` in `homeApi.js` | `totalKg` comes from a static `profile.totalKgDiverted = 52` field and `kgThisMonth` is hardcoded to `6.4`! Must be derived dynamically from completed, weighed pickups (`weightKg`) and user's reports in the real calendar month. `CountUp` re-runs on every re-render instead of once per visit. |
| **Scheduled Pickups Section & Cards (`Track` / open focused pickup)** | Partly wired | `buildUpcomingPickups` in `homeUtils.js` + `ScheduledPickupCard.jsx` | Seeded pickup dates in `mockPickups.js` are hardcoded to `2026-07-*` (past dates); past uncompleted pickups are not filtered out as missed; tapping a card navigates to `/pickup?tab=home` without focusing that exact pickup (`&pickupId=<id>`); no cancel/reschedule sync back to Home. |
| **Know Your Plastic Card & Resin Tags** | Working / Partly wired | `LearnCarousel.jsx` navigates to `/learn/plastic-types` | Navigating to `/learn/plastic-types` works, and resin codes 1–7 + filter chips work, but `PageTopBar` has no back button to return directly to `/home` when opened from Home. |
| **Quick Guides & Video Items (`LearnCarousel` + `VideoModal`)** | Partly wired | `LEARN_HIGHLIGHTS` in `mockHome.js` -> `homeApi.js` | Uses static array in `homeApi` instead of a dedicated `learnApi` service; if Learn fails, the whole Home screen fails instead of isolating the Learn section; tapping an article navigates to generic `/learn` instead of `/learn?guide=<id>`. |
| **Data Refresh, Cross-Tab Sync & Dev Controls** | Partly wired | `useHome.js` runs once on mount (`[attempt]`) | Does not re-fetch on window focus / visibility change / 1-hour staleness or cross-service events; no developer-only console/service controls (`resetSeed`, `simulateError`, `simulateSlow`, `advancePickupStatus`). |

---

### Task 1: Branch Setup & Pure Domain Utilities (`homeUtils.js` & `pickupStatusUtils.js`)

**Files:**
- Modify: `src/utils/homeUtils.js`
- Modify: `src/utils/pickupStatusUtils.js`
- Test: `tests/homeUtils.test.mjs`

**Interfaces:**
- Produces:
  - `getGreetingKey(date?: Date) -> 'home_greeting_morning' | 'home_greeting_afternoon' | 'home_greeting_evening'` (evaluated in `Asia/Kolkata` timezone)
  - `getFirstName(name?: string, fallback?: string) -> string`
  - `getInitials(name?: string) -> string`
  - `getTodayIst(now?: Date) -> string` (`YYYY-MM-DD` in `Asia/Kolkata`)
  - `isCurrentMonthIst(dateStr: string, now?: Date) -> boolean`
  - `buildContributionSummary({ pickups, reports, userId, now }) -> { totalKg, pickupsCompleted, reportsMade, kgThisMonth }`
  - `buildUpcomingPickups({ pickups, business, dropOffs, now }) -> Array<UpcomingItem>` (excludes completed, cancelled, and past/missed dates `< getTodayIst(now)`, sorted by date ascending then status priority)

- [ ] **Step 1: Create feature branch `feat/home-functional` and write failing unit tests in `tests/homeUtils.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGreetingKey,
  getFirstName,
  getInitials,
  getTodayIst,
  isCurrentMonthIst,
  buildContributionSummary,
  buildUpcomingPickups,
} from '../src/utils/homeUtils.js';
```

Test cases to include in `tests/homeUtils.test.mjs`:
- `getGreetingKey` converts UTC timestamps to `Asia/Kolkata` (`UTC+05:30`) and returns morning (`05:00–11:59 IST`), afternoon (`12:00–16:59 IST`), evening (`17:00–04:59 IST`).
- `getFirstName` handles empty/whitespace names with fallback, single names, multi-word names, and very long names.
- `buildContributionSummary` sums `weightKg` only from `status === 'Completed'` pickups with positive `weightKg`, ignores pending/unweighed/cancelled pickups, calculates `kgThisMonth` using `isCurrentMonthIst`, and counts only reports matching `userId` (or device reports).
- `buildUpcomingPickups` includes only `Requested`, `Scheduled`, and `On the way` pickups whose `date >= getTodayIst(now)`, excludes past uncompleted ("missed"), completed, and cancelled pickups, and sorts by soonest date first.

- [ ] **Step 2: Run `node --test tests/homeUtils.test.mjs` and verify it fails (RED)**

Run: `node --test tests/homeUtils.test.mjs`
Expected: FAIL (`getFirstName`, `getTodayIst`, `isCurrentMonthIst`, and dynamic `weightKg` / missed-pickup filtering not yet implemented).

- [ ] **Step 3: Implement IST-aware date/greeting helpers, dynamic `buildContributionSummary`, and missed-pickup filtering in `src/utils/homeUtils.js` and `src/utils/pickupStatusUtils.js`**

- [ ] **Step 4: Run `node --test tests/homeUtils.test.mjs` and verify all tests pass (GREEN)**

Run: `node --test tests/homeUtils.test.mjs`
Expected: PASS (all tests green).

---

### Task 2: User-Scoped Mock Services, Single-Source Rewards, Notifications, Learn & Developer Harness

**Files:**
- Create: `src/services/devControls.js`
- Create: `src/services/notificationApi.js`
- Create: `src/services/learnApi.js`
- Modify: `src/services/storageAdapter.js`
- Modify: `src/services/pickupApi.js`
- Modify: `src/services/rewardsApi.js`
- Modify: `src/services/reportApi.js`
- Modify: `src/services/homeApi.js`
- Modify: `src/services/index.js`
- Modify: `src/data/mockPickups.js`
- Test: `tests/services.test.mjs`

**Interfaces:**
- Produces:
  - `devControls` (`src/services/devControls.js`, also attached to `window.__swachhaDev` in browser):
    - `applySimulations(serviceName?: string) -> Promise<void>` (applies simulated delay or throws simulated failure if configured)
    - `setSimulation({ fail?: boolean | string, delayMs?: number })`
    - `resetAllData() -> Promise<void>`
    - `advancePickupStatus(pickupId: string) -> Promise<Pickup>` (`Requested -> Scheduled -> On the way -> Completed`, assigning weighed `weightKg` and `pointsEarned` on completion and emitting a notification)
  - `pickupApi`:
    - `getPickups(userKey?: string) -> Promise<Pickup[]>` (user-scoped; returning user `'9876543210'` gets relative-dated Dakshina Kannada seed pickups with `weightKg` on completed ones and future dates on upcoming ones; any other new user gets `[]`)
    - `savePickups(pickups: Pickup[], userKey?: string) -> Promise<Pickup[]>`
    - `cancelPickup(pickupId: string, userKey?: string) -> Promise<Pickup[]>`
    - `reschedulePickup(pickupId: string, updates: { date?: string, timeWindow?: string }, userKey?: string) -> Promise<Pickup[]>`
    - `advancePickupStatus(pickupId: string, userKey?: string) -> Promise<Pickup>`
  - `rewardsApi`:
    - `getBalance(userKey?: string) -> Promise<{ points: number, pendingPoints: number, totalEarned: number, totalDonated: number }>` (Single source of truth: sums `pointsEarned` from `Completed` pickups minus user's donations; never counts pending pickups)
    - `getRewardsData(userKey?: string) -> Promise<RewardsData>`
    - `saveDonation(donation: Donation, userKey?: string) -> Promise<Donation[]>`
  - `notificationApi`:
    - `list(userKey?: string) -> Promise<Notification[]>` (filters out deleted notifications and categories disabled in `preferencesApi.getPreferences()`)
    - `getUnreadCount(userKey?: string) -> Promise<number>`
    - `markRead(id: string, userKey?: string) -> Promise<Notification[]>`
    - `markAllRead(userKey?: string) -> Promise<Notification[]>`
    - `deleteNotification(id: string, userKey?: string) -> Promise<Notification[]>`
    - `createNotification(notif: Partial<Notification>, userKey?: string) -> Promise<Notification | null>` (skips creation if category toggle in `preferencesApi` is off)
  - `learnApi`:
    - `getHighlights() -> Promise<LearnItem[]>`
  - `homeApi`:
    - `getOverview(user?: User) -> Promise<HomeOverview>` (aggregates `pickupApi`, `rewardsApi`, `reportApi`, `businessApi`, `notificationApi`, and isolates `learnApi` so a Learn failure sets `learnError: true` without failing the rest of Home)

- [ ] **Step 1: Write failing service tests in `tests/services.test.mjs`**

Cover:
- Corrupted JSON in storage falls back cleanly to seed/empty without throwing.
- User isolation: user A (`9876543210`) has seeded completed pickups (`52 kg`, `1240 pts`) and upcoming pickups; signing in as user B (`9900112233`) returns `0 kg`, `0 pts`, `0 pickups`, `0 notifications`.
- Single source of truth for points: `rewardsApi.getBalance()` equals `(Home summary.points)` and updates immediately when a pickup advances to `Completed` or a donation is saved.
- `notificationApi` respects `preferencesApi` toggles (`pickupUpdates: false` hides/blocks pickup notifications; `reportStatus: false` hides/blocks report notifications; `ngoNews: false` hides/blocks NGO notifications), persists `markRead`, `markAllRead`, and `deleteNotification`, and prevents duplicate mutations on rapid double calls.
- `pickupApi.advancePickupStatus(id)` transitions `Requested -> Scheduled -> On the way -> Completed`, credits `weightKg` and `pointsEarned` only on `Completed`, and `cancelPickup(id)` marks status `'Cancelled'` so it disappears from upcoming pickups.
- Section fault isolation: simulating a failure on `learn` (`devControls.setSimulation({ fail: 'learn' })`) still resolves `homeApi.getOverview()` with `summary`, `upcoming`, and `notifications` intact and `learnError: true`.

- [ ] **Step 2: Run `node --test tests/services.test.mjs` and verify it fails (RED)**

Run: `node --test tests/services.test.mjs`
Expected: FAIL (missing `notificationApi`, `learnApi`, `devControls`, user-scoped `pickupApi`/`rewardsApi`).

- [ ] **Step 3: Implement `devControls.js`, `notificationApi.js`, `learnApi.js`, and user-scoped updates to `pickupApi.js`, `rewardsApi.js`, `reportApi.js`, `homeApi.js`, and `mockPickups.js`**

- [ ] **Step 4: Run `node --test tests/homeUtils.test.mjs tests/services.test.mjs` and verify all tests pass (GREEN)**

Run: `node --test tests/homeUtils.test.mjs tests/services.test.mjs`
Expected: PASS.

---

### Task 3: Hooks & Cross-Tab Reactivity (`useHome`, `usePickups`, `useRewards`, `useMotion`)

**Files:**
- Modify: `src/hooks/useHome.js`
- Modify: `src/hooks/usePickups.js`
- Modify: `src/hooks/useRewards.js`
- Modify: `src/hooks/useMotion.js`
- Modify: `src/components/ui/CountUp.jsx`

**Interfaces:**
- `useHome()` returns:
  - `loading`, `error`, `retry`, `refresh`
  - `firstName` (with graceful fallback), `initials`, `avatarUrl`, `greetingKey`
  - `summary`, `isNewUser`, `upcoming`, `learn`, `learnError`
  - `notifications`, `unreadCount`, `markAllRead`, `markRead`, `deleteNotification`
  - Auto-refreshes when:
    1. `user` identity or notification preferences change
    2. A domain mutation event (`swachha:data-changed`) fires from `pickupApi`, `rewardsApi`, `reportApi`, `notificationApi`, or `preferencesApi`
    3. The user returns to the tab (`visibilitychange` / `focus`) or more than 1 hour has elapsed (`getGreetingKey` & overview refresh)
- `useCountUp(value, duration, { oncePerVisit })`:
  - Runs the count-up animation once per Home mount (not re-animating from 0 on unrelated re-renders) and immediately returns `target` when `prefers-reduced-motion` is enabled.

- [ ] **Step 1: Update `useMotion.js`, `useHome.js`, `usePickups.js`, and `useRewards.js`**

Ensure `useRewards` uses `rewardsApi.getBalance()` so the Rewards tab and the Home Rewards pill always read the exact same number, and `usePickups` exposes `cancelPickup` and `reschedulePickup` wired to `pickupApi`.

- [ ] **Step 2: Run tests and lint to verify hook contracts**

Run: `node --test tests/homeUtils.test.mjs tests/services.test.mjs && npm run lint`
Expected: PASS (`0` errors).

---

### Task 4: Home Screen & Target Navigation Wiring (Strict UI Freeze)

**Files:**
- Modify: `src/components/home/HomeGreetingRow.jsx`
- Modify: `src/components/home/NotificationInbox.jsx`
- Modify: `src/components/home/ScheduledPickupCard.jsx`
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/pages/PickupPage.jsx`
- Modify: `src/pages/MapPage.jsx`
- Modify: `src/pages/LearnPage.jsx`
- Modify: `src/pages/PlasticTypesPage.jsx`
- Modify: `src/i18n/en/translation.json`
- Modify: `src/i18n/kn/translation.json`

**Wiring Details (Zero Visual Change):**
1. **Avatar in `HomeGreetingRow.jsx`:**
   - Wrap the existing `size-11 rounded-2xl ...` avatar element in a `<button type="button" onClick={() => navigate('/profile')} aria-label={t('profile')}>` with the exact same visual classes (`size-11 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-extrabold flex items-center justify-center shrink-0 shadow-xs cursor-pointer`). If `avatarUrl` is present on `user`, render `<img src={avatarUrl} alt="" className="size-full rounded-2xl object-cover" />` inside it; otherwise render `{initials}`.
2. **Notification Inbox (`NotificationInbox.jsx`):**
   - Tapping a notification row calls an in-flight guarded handler that marks it read, closes the inbox, checks if the target entity exists (pickup in `pickupApi`, report in `reportApi`), and navigates:
     - `type === 'pickup'` -> `/pickup?tab=home&pickupId=<targetId>`
     - `type === 'points'` -> `/rewards`
     - `type === 'report'` -> `/map?report=<targetId>`
     - If `targetId` is missing/deleted, shows a friendly toast (`showToast(t('home_notif_target_missing'), 'info')`) and opens the tab safely.
   - Add delete capability on notification items (`onDelete(n.id)`) with double-tap guard.
3. **Scheduled Pickup Card (`ScheduledPickupCard.jsx` & `PickupPage.jsx`):**
   - Tapping a scheduled pickup card navigates to `/pickup?tab=home&pickupId=${item.id}` (or `/pickup?tab=business` for business pickups) with a double-tap guard.
   - In `PickupPage.jsx`, reading `searchParams.get('pickupId')` focuses that pickup in `ActivePickupCard` and supports cancelling or rescheduling it so returning to `/home` immediately reflects the change.
4. **Know Your Plastic & Learn (`HomePage.jsx`, `PlasticTypesPage.jsx`, `LearnPage.jsx`):**
   - Tapping an article in `LearnCarousel` navigates to `/learn?guide=${item.id}` (and `LearnPage` scrolls to / highlights the matching section).
   - Tapping a video opens `VideoModal` (shows `<video>` when `videoUrl` is present and online, or the existing `"Video coming soon"` / offline state).
   - Ensure browser back / return navigation from `/learn/plastic-types` and `/learn` returns cleanly to `/home`.

- [ ] **Step 1: Wire `HomeGreetingRow.jsx`, `NotificationInbox.jsx`, `ScheduledPickupCard.jsx`, `HomePage.jsx`, and target query params in `PickupPage.jsx`, `MapPage.jsx`, `LearnPage.jsx`, plus new i18n keys**

- [ ] **Step 2: Run full test suite, ESLint, and production build**

Run: `node --test tests/homeUtils.test.mjs tests/services.test.mjs && npm run lint && npm run build`
Expected: PASS (`0` errors, `0` warnings).

---

### Task 5: End-to-End Verification, Before/After Screenshot Diff & Code Review

**Files:**
- Test: `tests/homeUtils.test.mjs`, `tests/services.test.mjs`
- Artifacts: `before` vs `after` screenshots at `360px`, `390px`, and `1440px` desktop for both `empty` (new user) and `filled` (returning user) states.

- [ ] **Step 1: Capture `after` screenshots at 360px, 390px, and desktop for both empty and filled states and compare against `before` baseline**
- [ ] **Step 2: Verify every interactive flow in headless Chromium (click-through of avatar, rewards pill, notification bell/inbox mark-read/delete/navigation, pickup creation/cancellation sync, offline/slow/error states)**
- [ ] **Step 3: Perform `requesting-code-review` / `receiving-code-review` pass on the branch diff and finish via `finishing-a-development-branch`**

