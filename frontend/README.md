# SignAI — Frontend

React + Vite client for SignAI, a sign-language recognition workspace with live
camera detection, image detection, video transcription, a two-way conversation
view and an A–Z sign dictionary.

## Stack

- **React 19** with React Router 7
- **Vite 8** (route-level code splitting, Tailwind 4 available)
- **Framer Motion** for page and micro-interactions
- **Recharts** for analytics
- **Lucide** icons
- Hand-rolled design system in `src/design-system.css` (light + dark tokens)

## Scripts

```bash
npm install
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
npm run lint     # ESLint (zero warnings expected)
```

## Environment

Copy `.env.example`-style values into `.env.local`:

```bash
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

`VITE_API_URL` is consumed by `src/services/api.js`, a small fetch wrapper that
adds JSON encoding, auth headers, request timeouts and friendly errors.

## Structure

```
src/
  components/
    dashboard/   app shell: sidebar, topbar, layout
    ui/          command palette, toasts, error boundary, skeletons
    recognition/ live/image/video recognition building blocks
  context/       auth and theme providers
  data/          navigation model + sign dictionary seed data
  hooks/         shared hooks (online status)
  pages/         route-level screens
  services/      API client
```

## Notable UX features

- **Command palette** — `Ctrl/⌘ + K` or the sidebar/topbar search to jump to any
  page; supports arrow keys, Enter and Escape.
- **Route code splitting** — each page is lazily loaded with a skeleton fallback,
  keeping the initial bundle small.
- **Responsive shell** — collapsible sidebar, mobile bottom navigation and a
  responsive topbar; all pages are checked for horizontal overflow at 390 px.
- **Accessibility** — skip link, visible focus rings, `aria-current` navigation,
  focus management on route change, dialog focus traps and reduced-motion support.
- **Theme system** — persisted light/dark preference, applied before first paint
  to avoid flashes, with an inline bootstrap script in `index.html`.
- **Resilience** — top-level error boundary, custom 404 page, offline indicator
  and friendly backend error states.
