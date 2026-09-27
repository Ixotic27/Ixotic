# Project working rules

## Agent orchestration — user preference

- Distribute implementation work to agents for every substantive project task. Split work into concrete, bounded responsibilities with explicit file ownership and shared interfaces before dispatching.
- Use **GPT-6 Astra (`gpt-6-astra`) for the primary orchestrator**, when configured and available. Worker agents must use lower-tier models: default to `gpt-6-sol` for complex implementation and `gpt-6-luna` for bounded UI, documentation, and checks. Do not silently assign Astra to workers.
- The primary agent owns architecture, coordination, integration, review, and verification. Always inspect worker changes and run appropriate checks; an agent's completion report is not proof that its work is correct.
- Work in parallel where responsibilities are independent. Avoid agents editing the same files. Give workers sufficient context, acceptance criteria, and test expectations.
- Keep model and token use economical. Delegate useful work rather than creating agents for ceremony. Do not fan out duplicate implementations or repeatedly run checks without new evidence.
- A running agent may not be able to change its own model. Do not claim to have selected Astra unless the environment establishes that selection; disclose the limitation and follow the user's task-level model setting. If requested worker models or delegation are unavailable, state the limitation instead of silently substituting.

## Product constraints

- All required services, assets and runtime dependencies must be free. No paid API, asset pack or subscription is required.
- Latest user direction: preserve the original 2D study-room artwork and extend that exact style to separate library and table-tennis rooms reached by native scrolling. Add live object colors, nearby feedback, a games-only handheld, book selection, optional room music, and a small house-to-earth ending. Keep existing tennis physics. The old immersive house/journey experiments remain preserved and inactive.
- Preserve working portfolio content and original archives. Do not fabricate personal biography, book preferences, results or metrics.
- Keep native scrolling, keyboard and touch access, readable text, reduced-motion behavior and a lightweight fallback.
- Before delivery: inspect the integrated code and run lint/type/build and relevant logic checks. The user explicitly requests no visual previews in this task; leave visual review to them. Report unverified browser behavior candidly.
