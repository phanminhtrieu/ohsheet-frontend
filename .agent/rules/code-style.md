---
trigger: always_on
---

🔹 SYSTEM PROMPT – FRONTEND

(Angular + TailwindCSS + PrimeNG – Project-Specific)

You are an AI coding agent working on a production Angular frontend that serves both:
- Public Frontend (end-user)
- Backoffice (admin)

The project uses:
- Angular (standalone components where already applied)
- TailwindCSS for layout and spacing
- PrimeNG (NgPrime) for UI components and dialogs

You MUST strictly follow the existing codebase patterns.

━━━━━━━━━━━━━━━━━━━━━━
ARCHITECTURE & STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━

- Follow the existing folder structure exactly.
- Do NOT introduce new architectural layers or abstractions.
- Prefer consistency over theoretical best practices.

Common structure assumptions:
- feature-based modules or folders
- shared components for reusable UI
- core folder for guards, interceptors, constants
- services handle API communication only

When uncertain, locate an existing component or service and mirror it.

━━━━━━━━━━━━━━━━━━━━━━
COMPONENT RULES
━━━━━━━━━━━━━━━━━━━━━━

- Components are presentation-first.
- Components may:
  - Handle UI state (loading, selected item, dialog visible)
  - Transform data for display
- Components must NOT:
  - Contain business rules
  - Perform API orchestration logic
  - Manipulate raw HTTP responses beyond mapping

- Prefer:
  - @Input / @Output for composition
  - Smart parent – dumb child pattern if already present
- Do NOT refactor to signals, stores, or state libraries unless they already exist.

━━━━━━━━━━━━━━━━━━━━━━
SERVICE RULES
━━━━━━━━━━━━━━━━━━━━━━

- Services:
  - Are thin wrappers around HttpClient
  - Contain NO UI logic
  - Return typed Observables

- Services must NOT:
  - Manage component state
  - Cache data unless existing code already does so

- API endpoints and DTOs must match backend contracts exactly.

━━━━━━━━━━━━━━━━━━━━━━
STATE & DATA FLOW
━━━━━━━━━━━━━━━━━━━━━━

- State is managed locally in components unless an existing shared pattern exists.
- Do NOT introduce:
  - NgRx
  - Signals
  - Global stores
  - Custom state managers

- Use RxJS operators consistent with the codebase.
- Avoid over-engineering streams.

━━━━━━━━━━━━━━━━━━━━━━
UI RULES (TAILWIND + PRIMENG)
━━━━━━━━━━━━━━━━━━━━━━

- TailwindCSS:
  - Used for layout, spacing, sizing, responsiveness
  - Do NOT embed complex logic in class bindings
  - Prefer readable utility combinations

- PrimeNG:
  - Used for dialogs, tables, forms, inputs, toast, confirmation
  - Do NOT wrap PrimeNG components unless a shared wrapper already exists

- Styling rules:
  - Do NOT add inline styles unless unavoidable
  - Do NOT override PrimeNG CSS unless existing patterns do so

━━━━━━━━━━━━━━━━━━━━━━
FORMS & VALIDATION
━━━━━━━━━━━━━━━━━━━━━━

- Follow existing form approach:
  - Reactive Forms OR Template-driven (do NOT mix)
- Frontend validation is UX-only.
- Backend remains the source of truth.

- Do NOT duplicate domain validation logic in frontend.
- Display backend UserFriendlyException messages as-is.

━━━━━━━━━━━━━━━━━━━━━━
ERROR HANDLING
━━━━━━━━━━━━━━━━━━━━━━

- Errors are handled at:
  - Component level OR
  - Existing global interceptor (if present)

- Display user-friendly messages from backend directly.
- Do NOT translate or reinterpret backend error messages unless existing code does so.

━━━━━━━━━━━━━━━━━━━━━━
SVG / CANVAS / RENDERING RULES
━━━━━━━━━━━━━━━━━━━━━━

- Rendering logic (SVG, Canvas, VexFlow, Sheet music):
  - Lives inside dedicated components
  - Must NOT leak DOM manipulation outside the component

- Direct DOM access:
  - Allowed via ViewChild / ElementRef
  - Must be isolated and well-contained

━━━━━━━━━━━━━━━━━━━━━━
CHANGE DISCIPLINE
━━━━━━━━━━━━━━━━━━━━━━

- Follow existing naming conventions exactly.
- Do NOT reformat unrelated files.
- Do NOT refactor unrelated logic.
- Do NOT introduce new dependencies.

- When unsure:
  1. Find a similar component
  2. Copy its structure
  3. Adapt only what is necessary

━━━━━━━━━━━━━━━━━━━━━━
OUTPUT EXPECTATION
━━━━━━━━━━━━━━━━━━━━━━

When implementing a feature:
- Produce only necessary files
- Clearly state where files belong
- Avoid speculative improvements
- Focus on making the feature work within the current system

This codebase values predictability, consistency, and maintainability over novelty.
