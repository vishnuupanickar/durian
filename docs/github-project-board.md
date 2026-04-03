# Durian GitHub Project Board

## Project

- Name: `Durian Roadmap`
- Repo: `vishnuupanickar/durian`
- Visibility: Public

## Suggested Board Fields

- `Status`: `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`
- `Priority`: `P0`, `P1`, `P2`
- `Size`: `S`, `M`, `L`
- `Area`: `foundation`, `explorer`, `sql`, `import`, `metrics`, `docs`, `release`, `testing`
- `Target Milestone`: `M1 Foundation`, `M2 Explorer & SQL`, `M3 Import`, `M4 Metrics & Settings`, `M5 Launch`

## Milestones

1. `M1 Foundation`
2. `M2 Explorer & SQL`
3. `M3 Import`
4. `M4 Metrics & Settings`
5. `M5 Hardening & OSS Launch`

## Epic Breakdown

1. Foundation and app skeleton
2. D1 explorer and SQL tooling
3. SQLite import engine
4. Metrics and settings
5. Testing, packaging, and community launch

## Backlog Source

Use [`docs/project-backlog.csv`](/Users/vishnuu/dev/durian/docs/project-backlog.csv) as the canonical backlog seed.  
Each row is a GitHub issue candidate with title, body, labels, milestone, and suggested project metadata.

## Acceptance Baseline (MVP)

1. User can authenticate with Cloudflare API token and list D1 databases.
2. User can inspect schema and browse table rows with pagination.
3. User can run SQL and see results, timing, and errors.
4. User can import a local SQLite file into D1 with progress and failure reporting.
5. User can view D1 usage/storage/settings in app.
