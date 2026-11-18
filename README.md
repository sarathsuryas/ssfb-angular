# Frontend

## Architecture

The app uses a feature-based layout under `src/app`:

```
src/app/
├── core/       # app-wide singletons: API client, config tokens, guards, interceptors
├── shared/     # reusable, feature-agnostic components, directives, pipes, utils
├── layout/     # route layouts / app shell (header, footer, router outlet)
├── features/   # business domains, each lazy-loaded through its own *.routes.ts
└── app.*       # root component, config and route table
```

The `home`, `auth`, `admin`, `staff` and `customer` features are working examples of the pattern.

### Styling

Tailwind CSS v4 is enabled through `.postcssrc.json` (`@tailwindcss/postcss`) and
`@import 'tailwindcss';` in `src/styles.css`. Style components with utility classes directly in
their templates; customize the theme with `@theme { ... }` in `src/styles.css`. Component schematic
defaults skip stylesheet generation because styling lives in templates.

### API base URL

`API_BASE_URL` reads `apiBaseUrl` from `src/environments/environment.ts`. Production builds swap in
`src/environments/environment.production.ts` via `fileReplacements` in `angular.json`. Development
points directly at `http://localhost:3000/api`; production stays on `/api` for same-origin hosting.
A cross-origin base URL requires backend CORS with credentials (`Access-Control-Allow-Origin` set to
the frontend origin and `Access-Control-Allow-Credentials: true`).

### Authentication

The frontend uses the backend's cookie-based sessions; no tokens are stored in browser JavaScript.

- `POST /api/auth/login`, `/refresh`, `/logout`, `GET /me`, `POST /change-password`
- All success responses are wrapped as `{ data: ... }`; `ApiService` unwraps this automatically.
- `access_token` and `refresh_token` are httpOnly cookies. `csrf_token` is readable and is echoed
  in the `X-CSRF-Token` header on every state-changing request by `authInterceptor`.
- `AuthService` holds the current user in signals and restores the session at bootstrap via
  `GET /me` (with one refresh attempt). A 401 on any other API call triggers a single-flight
  refresh and one retry.
- `provideAppInitializer` makes this happen before the first route renders; failures resolve to an
  anonymous session so the app still boots when the API is unavailable.

Role routing (frontend guards are UX only — the backend enforces access):

| Role | Area | Backend rights |
| --- | --- | --- |
| `ADMIN` | `/admin` (also `/staff`) | Create staff and customers, list users |
| `STAFF` | `/staff` | Create customers, list users |
| `CUSTOMER` | `/customer` | Customer self-service |

`npm start` runs `ng serve --proxy-config proxy.conf.json`. The development environment currently
calls `http://localhost:3000/api` directly, so the proxy is unused unless `apiBaseUrl` is changed
back to `/api`. Since that is cross-origin, the backend must allow the frontend origin with
credentials. Production uses `/api` and should be hosted on the same origin as the API.

### User provisioning

- The `admin` feature (`/admin`, ADMIN only) wraps `GET /api/users`, `POST /api/admin/staff` and
  `POST /api/staff/customers` through a route-scoped `AdminUsersService`.
- The `staff` feature (`/staff`, ADMIN/STAFF) wraps `POST /api/staff/customers` at
  `/staff/customers/new` through `StaffCustomersService`.

All calls go through `ApiService`, so cookie credentials and the CSRF header are applied centrally.
Both create flows reuse `shared/components/create-user-form`; the admin page picks its target role
from route data.

### Dependency rules

- `features/*` may import from `core` and `shared`, but never from another feature.
- `core` and `shared` never import from `features`.
- App-wide singletons belong in `core` with `providedIn: 'root'`; feature state belongs in the
  feature's `services/` folder and is provided on the feature route so it lives only while the
  feature is active.

### Adding a feature

1. Create `src/app/features/<name>/<name>.routes.ts` exporting a `Routes` array (e.g. `NAME_ROUTES`).
2. Add the page under `<name>/<name>-page/` and load it with `loadComponent` from those routes.
3. Register the feature in `app.routes.ts` with
   `loadChildren: () => import('./features/<name>/<name>.routes').then((m) => m.NAME_ROUTES)`.
4. Put feature models in `models/`, feature services in `services/`, and provide them on the route.

### Conventions

- Standalone components, `OnPush` change detection and `inject()` for dependencies (CLI schematic
  defaults are set in `angular.json`).
- Signals (`signal`, `computed`) for state; no external state-management library.
- File naming: `thing.ts` / `thing.html` / `thing.css`, `thing.routes.ts`, `thing.service.ts`,
  `thing.model.ts`.
- TypeScript path aliases: `@app/*`, `@core/*`, `@shared/*`, `@layout/*`, `@features/*`.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.39.

## Development server

To start the local development server (backend on port 3000), run:

```bash
npm start
```

The backend must be running on port 3000 for login and API calls to work.

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
