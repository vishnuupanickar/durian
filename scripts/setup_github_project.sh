#!/usr/bin/env bash
set -euo pipefail

# Bootstraps GitHub labels, milestones, and a Project board.
# Requirements:
#   - gh CLI installed and authenticated
#   - jq installed
# Usage:
#   ./scripts/setup_github_project.sh vishnuupanickar/durian "Durian Roadmap"

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <owner/repo> <project-title>"
  exit 1
fi

REPO_FULL="$1"
PROJECT_TITLE="$2"
CSV_PATH="docs/project-backlog.csv"

if [[ ! -f "$CSV_PATH" ]]; then
  echo "Backlog CSV not found at $CSV_PATH"
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required"
  exit 1
fi

OWNER="${REPO_FULL%%/*}"

labels=(
  "epic|6f42c1"
  "feature|0e8a16"
  "chore|5319e7"
  "test|fbca04"
  "priority:P0|b60205"
  "priority:P1|d93f0b"
  "priority:P2|fbca04"
  "size:S|0e8a16"
  "size:M|1d76db"
  "size:L|bfd4f2"
  "area:foundation|0052cc"
  "area:explorer|1f6feb"
  "area:sql|5319e7"
  "area:import|5319e7"
  "area:metrics|0e8a16"
  "area:docs|c5def5"
  "area:release|f9d0c4"
  "area:testing|fbca04"
)

milestones=(
  "M1 Foundation"
  "M2 Explorer & SQL"
  "M3 Import"
  "M4 Metrics & Settings"
  "M5 Hardening & OSS Launch"
)

echo "Creating labels (idempotent)..."
for label_spec in "${labels[@]}"; do
  name="${label_spec%%|*}"
  color="${label_spec##*|}"
  gh label create "$name" --repo "$REPO_FULL" --color "$color" --force >/dev/null
done

echo "Creating milestones (idempotent)..."
for m in "${milestones[@]}"; do
  if ! gh api "repos/$REPO_FULL/milestones" --paginate | jq -e --arg t "$m" '.[] | select(.title == $t)' >/dev/null; then
    gh api "repos/$REPO_FULL/milestones" -f title="$m" >/dev/null
  fi
done

echo "Creating project..."
if gh project list --owner "$OWNER" --format json | jq -e --arg t "$PROJECT_TITLE" '.projects[] | select(.title == $t)' >/dev/null; then
  PROJECT_ID="$(gh project list --owner "$OWNER" --format json | jq -r --arg t "$PROJECT_TITLE" '.projects[] | select(.title == $t) | .id' | head -n1)"
else
  PROJECT_ID="$(gh project create --owner "$OWNER" --title "$PROJECT_TITLE" --format json | jq -r '.id')"
fi

cat <<EOF
Done. Project created or reused: $PROJECT_TITLE
Project ID: $PROJECT_ID

Next:
1) Import backlog data from $CSV_PATH (Title/Body/Labels/Milestone) into issues.
2) Add created issues to this project.
3) Map status and custom fields using docs/github-project-board.md.
EOF
