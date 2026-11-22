# Swachha Parisara — Project & Skill Rules

## SKILL RULES (always follow)
- At the start of every task, use `using-superpowers` and check which skills apply.
- Features or logic: follow `executing-plans`, `test-driven-development` and `architecture-patterns`. Keep the layers separate: pages render only, hooks hold logic, services are the data layer, utils hold pure helpers. Do NOT create `.md` plan files unless the user explicitly asks for `writing-plans` or a plan file.
- React code: follow `react-modernization`.
- Any bug or failure: `systematic-debugging` first. Find the root cause before fixing. No guess patches.
- Before saying a task is done: `verification-before-completion`. Run lint, build and tests, and show the evidence.
- After finishing: `requesting-code-review`, then `receiving-code-review` for feedback.
- Work directly on `main`. Do NOT create a separate branch, do NOT create `.md` files, and do NOT commit unless the user explicitly asks.
- Use `subagent-driven-development`, `dispatching-parallel-agents` and `using-git-worktrees` only when the tasks are truly independent. Tell the user why.
- Long sessions, reading many files, or large tool outputs: use `context-optimization`.

## UI RULES
- `baseline-ui`, `impeccable`, `unslop-ui`, `tailwind-design-system` and `illustration-*` (`illustration-framed-panel`, `illustration-grainy-gouache`, `illustration-halftone-line`, `illustration-ink-sketch`, `illustration-line-interior`, `illustration-one-line`) skills are used ONLY when the user says redesign, restyle, or names the skill.
- For any other request, make no visual changes: no layout, color, spacing, icon, copy or animation changes. If a functional change needs one, stop and ask the user.

## PROJECT RULES
- No new dependencies without asking the user.
- Mock data only until the user says we are connecting the database.
- All UI text goes through i18n keys (`en`, and `[KN]` placeholders in `kn`).
- No MLA, MP or politician references anywhere.
- Keep the existing palette: `#38761d`, `#000000`, `#ffffff`, `#fab328`, `#f25628` (sparingly), `#e9e0cb`.

## CONTEXT RULES
- Use `context-optimization` when the session gets long, when a task needs reading many files, or when tool outputs are large.
- Prefer targeted reads (specific files and line ranges, search) over reading whole folders or huge files.
- Do not paste large outputs back into the chat. Summarize them and keep only what is needed (never mask active error outputs while debugging).
- Before a long task, make a short plan. At natural checkpoints (after each task), write a brief summary of the decisions made and the current state, so the work can continue cleanly if the context is reset.
- Never let context optimization override the other rules: UI freeze, no new dependencies, and verification before saying done.


