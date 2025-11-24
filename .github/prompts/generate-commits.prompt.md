---
agent: agent
---

# Git Commit Organization Agent

## Task Definition
Analyze current git changes and organize them into logical, focused "baby commits" following conventional commit standards and best practices for maintainable version control history.

## Requirements

### Core Functionality
- **Analyze git diff** to understand all pending changes
- **Group related changes** into logical, cohesive commits
- **Create focused commits** that each address a single concern or feature
- **Follow conventional commit format** with proper prefixes and descriptions
- **Maintain chronological dependency order** when commits depend on each other

### Commit Organization Strategy
1. **Configuration & Environment** - Build tools, linting, dependencies, environment setup
2. **Core Architecture** - Main application structure, routing, providers
3. **Infrastructure Layer** - Adapters, external service integrations, ports
4. **Domain Layer** - Business logic, entities, DTOs, domain services
5. **Component Architecture** - UI components, atomic design, component refactoring
6. **Feature Implementation** - Specific features like auth, dashboard, pages
7. **Styling & Theming** - CSS, theme configuration, visual updates
8. **Testing & Quality** - Test setup, configuration, test utilities

### Conventional Commit Format
```
<type>(<scope>): <description>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `style`: Changes that do not affect the meaning of the code
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to build process or auxiliary tools
- `docs`: Documentation changes

### Commit Message Guidelines
- **Use imperative mood** ("add" not "added" or "adds")
- **Keep first line under 72 characters**
- **Be descriptive but concise**
- **Include scope when relevant** (component, feature, module)
- **Add body for complex changes** explaining what and why

## Constraints

### Technical Constraints
- Must preserve all changes (no data loss)
- Must maintain git history integrity
- Must respect existing branch structure
- Must handle merge conflicts if they arise

### Quality Constraints
- Each commit must be **atomic** (single logical change)
- Each commit must be **self-contained** (doesn't break build)
- Commits must be **reviewable** (reasonable size and scope)
- Must follow **team conventions** (commitizen, commitlint if configured)

### Dependency Constraints
- **Infrastructure before domain** (adapters before business logic)
- **Core before features** (app structure before specific pages)
- **Dependencies before dependents** (shared components before pages using them)

## Success Criteria

### Commit Quality
- ✅ Each commit addresses exactly one concern
- ✅ Commit messages are clear and descriptive
- ✅ No commit breaks the build or tests
- ✅ Related files are grouped logically
- ✅ Commits follow conventional format

### Repository Health
- ✅ Clean, readable git history
- ✅ Easy to review individual changes
- ✅ Ability to cherry-pick or revert specific features
- ✅ Clear progression of development

### Developer Experience
- ✅ Easy to understand what each commit does
- ✅ Simple to bisect issues when they arise
- ✅ Clear separation of concerns
- ✅ Facilitates code review process

## Process Workflow

### Analysis Phase
1. **Check git status** to identify all modified, added, deleted files
2. **Review git diff** to understand the nature of changes
3. **Identify logical groupings** based on functionality and dependencies
4. **Plan commit sequence** respecting dependencies

### Organization Phase
1. **Create todo list** with planned commits
2. **Stage files by logical groups** using `git add <specific-files>`
3. **Commit each group** with appropriate conventional commit message
4. **Verify each commit** doesn't break build/tests
5. **Update progress** and move to next group

### Validation Phase
1. **Review commit history** with `git log --oneline`
2. **Verify all changes committed** with `git status`
3. **Ensure commit messages follow conventions**
4. **Confirm logical progression** of changes

## Example Output

```bash
# Example of well-organized commits:
feat(config): update development environment setup
feat(domain/core): restructure application architecture
feat(domain/auth): implement user management domain layer
feat(app-web/hooks): add authentication system
feat(app-web/components): implement responsive dashboard layout
feat(app-web/i18n): add internationalization support
style(app-web/theme): update color palette and theming
test(app-tps/setup): configure Jest and testing utilities
```

## Usage Instructions

**Invoke this agent when:**
- Large number of uncommitted changes need organization
- Working on a feature branch with multiple concerns
- Need to prepare changes for code review
- Want to improve commit history quality
- Preparing for merge/pull request

**Expected Input:**
- Working git repository with uncommitted changes
- Optional: Specific grouping preferences or constraints
- Optional: Team conventions or commit message templates

**Expected Output:**
- Series of focused, logical commits
- Clean git history
- Conventional commit messages
- Organized todo list tracking progress
