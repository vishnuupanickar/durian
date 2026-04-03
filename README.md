# Durian

Durian is an open source desktop database studio for Cloudflare D1.

This repository now includes the first application scaffold for the recommended stack:

- Electron
- React
- Vite
- TypeScript
- Secure preload bridge with typed IPC contracts

## Current Scope

The first vertical slice is intentionally narrow:

1. Launch a locked-down Electron desktop shell.
2. Store a Cloudflare credential securely through the Electron main process.
3. List D1 databases through a typed IPC boundary.

For this initial scaffold, the credential format is:

`<account_id>:<api_token>`

That keeps account resolution simple while we stand up the secure architecture. A proper account picker can replace this next.

## Workspace Layout

- `apps/desktop`
  Electron app with `main`, `preload`, and `renderer`.
- `packages/shared`
  Shared Zod schemas, IPC channel names, and TypeScript types.
- `docs`
  Product backlog and GitHub project planning docs.

## Security Defaults

Durian starts from a locked-down Electron baseline:

1. `contextIsolation: true`
2. `sandbox: true`
3. `nodeIntegration: false`
4. No direct Node access in the renderer
5. Minimal `contextBridge` surface exposed as `window.durian`
6. IPC payload validation with Zod
7. External navigation denied from the renderer
8. Token handling kept in the main process only

## Getting Started

This environment did not have `node` or `npm` installed, so the scaffold was created but not executed here. Once Node.js is available, the intended flow is:

```bash
npm install
npm run dev
```

Recommended Node version: `20.11+`

## Next Steps

1. Add account discovery so users can paste a normal API token without bundling the account ID.
2. Build the database explorer view for tables, columns, and row browsing.
3. Add the SQL workbench with query execution and safe destructive-action guards.
4. Add SQLite import as a background job with progress events.
