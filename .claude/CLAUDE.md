# Design: enchase

All UI in this project is built with **enchase** (`enchase` on npm), an accessible React component library. Do not add another UI kit, Tailwind, CSS framework or styled-components.

Reference docs ship with the package. Read them before using a component you haven't used yet:
- `node_modules/enchase/API.md`: props, types, hooks and CSS hooks of every component
- `node_modules/enchase/README.pt-BR.md`: the full guide (theme, styles, routing, density, customization)
- `node_modules/enchase/HEADLESS.md`, `EJECT.md`, `MIGRATION.md`
- Storybook: https://enchase.othiagosilva.com.br/docs/

## How it is wired here

- `src/index.tsx` imports `@fontsource-variable/figtree` (the default font) and `enchase/styles.css`, once. Never also import `enchase/styles.layer.css` or `enchase/css/*.css`.
- `src/providers/index.tsx` wraps the app: `ColorModeProvider` (theme + light/dark) > `GlobalStyles` > `UIProvider` > `ToastProvider`.
  - `UIProvider` gets `locale={ptBR}` (from `enchase/locales`), plus `navigate` and `currentHref` from React Router. That means `Link`, `ButtonLink`, `CardLink` and the `Navbar`, `Sidebar` and `Breadcrumbs` items with an app route (`/...`) navigate on the client. Use enchase links with `href`. Don't use React Router's `<Link>`.
  - Providers sit inside `<BrowserRouter>` (`src/routes/index.tsx`) because they use `useNavigate`/`useLocation`.
- `src/styles/theme.ts` holds the `ThemeInput` (`style`, `brand`, `shape`, `radius`, `fonts`, `motion`, `light`, `dark`). Change the look there, not with ad-hoc CSS.
- `index.html` has an inline script that sets `data-theme` and `color-scheme` on `<html>` before the first paint. It reads the same storage key (`enchase-color-mode`) as `ColorModeProvider`. Keep the two in sync.

## Rules

- Color mode: use `useColorMode()` (`mode`, `resolvedMode`, `setMode`, `toggleMode`) or `<ThemeToggle />`. Never toggle classes on `<html>` by hand.
- Toasts: `useToast()` (`success`, `error`, `warning`, `info`, `promise`, `update`, `removeToast`).
- Layout: prefer `Container`, `Flex`, `Grid`, `Layout`, `Navbar`, `Sidebar`, `Footer` over custom wrappers.
- Customization, from weakest to strongest:
  1. `theme` in `src/styles/theme.ts`, e.g. `brand: '#0F766E'`, `shape: 'pill' | 'soft' | 'square'`, `style` from `enchase/styles/shadcn | workbench | enchase`
  2. CSS variables `--enchase-<slot>-<property>` (listed under "CSS hooks" in API.md). Every part has a `data-slot`.
  3. `className` (yours always wins)
  4. `npx enchase eject <Component>`, only as a last resort
- Colors: always use theme variables (`var(--enchase-color-...)`), never hard-coded hex. Use hex or `rgb()` brand colors only, since `hsl()` and `oklch()` aren't contrast-checked. Watch the console for the contrast warnings the provider prints in dev.
- Icons: `enchase/icons` only has 20 icons (Check, Close, Menu, Sun, Moon, Chevron*, Eye*, Plus, Minus, Info, AlertTriangle, Calendar, ExternalLink, LogOut, MenuOpen). For anything else, add an icon library (e.g. `lucide-react`) and pass the nodes as children or `icon`. Use `Icon` from `enchase` to draw custom SVG paths.
- Forms: fields work with react-hook-form + Zod with no adapter. Put validation messages in the `error` prop.
- Overlays (`Modal`, `Drawer`, `Popover`, `Menu`, `Tooltip`, toasts) render in a portal on `<body>`. Use `container` if they need local CSS overrides.
- Compact density: `data-density="compact"` on `<html>` only.
- Accessibility: give icon-only buttons and links an `aria-label`. Don't remove focus rings.
- The lib is `0.x`, so minor versions can break things. Read `node_modules/enchase/MIGRATION.md` before upgrading.
