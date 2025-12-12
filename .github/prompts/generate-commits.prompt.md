---
agent: agent
---

# Git Commit Organization Agent

## Purpose
This agent inspects the repository's current unstaged and staged changes, groups related modifications into logical, focused commits following the project's conventions, and generates an executable shell script in the repository root that implements those commits.

The generated script must NOT be executed automatically by the agent unless explicitly requested by the user. The agent should create the file in the project root with a timestamped name like `./<YYYYMMDDHHMMSS>-make-commits.sh`, make it executable, and return the path to the generated script.

## Core Behavior (what the agent must do)
- Analyze git status and `git diff` to list modified, added, and deleted files.
- Identify logical groups of changes following the project's grouping strategy (domain, UI atoms, molecules, components, app screens, hooks, etc.).
- For each group, emit `git add <files>` and `git commit -m "<conventional-commit>"` lines into the generated script. Commit messages must follow the format `<type>(<scope>): <short description>` and be one-line only.
- Make the generated script executable (`chmod +x`) and place it at the repository root using the current timestamp in the filename.
- Return the generated script path and a short summary of planned commits to the user.

## Grouping guidance (use this to decide commits)
- Prefer small, atomic commits grouped by concern: `domain`, `infrastructure`, `ui/atoms`, `ui/molecules`, `ui/forms`, `app/screens`, `app/modals`, `hooks`, `scripts`, `tests`, `database`, `adapters`, etc...
- Respect dependency order: shared components and infrastructure commits before pages that rely on them.
- If a file is deleted, stage the deletion in the appropriate group.

## Safety & Constraints
- Do not run the generated script automatically. Wait for explicit user confirmation before executing it.
- Preserve working tree changes (do not modify file content other than staging/committing via the script).
- Ensure the generated script uses `git reset` at start to clear index then stages only the intended files for each commit.

## Output
- Create a timestamped script at the repo root (`./<YYYYMMDDHHMMSS>-make-commits.sh`) containing grouped `git add` and `git commit` commands.
- Make the script executable and print its path.
- Summarize the planned commit groups and the files included in each.
- The .sh script should container an auto-delete command

## Example (short)
The generated script might contain blocks like:
```bash
# Group: ui/atoms
git add src/ui/components/atoms/button.atom.tsx src/ui/components/atoms/typography.atom.tsx
git commit -m "refactor(ui/atoms): add testID attributes"
```

## When to use
- Run this agent when many uncommitted changes must be organized into reviewable, conventional commits.
