---
description: "Prompt generator for feature implementation documents following layered architecture and task tracking."
---

# Feature Implementation Prompt Generator

## Purpose
Generate a structured implementation document for a given feature in the Oliva App project, following Clean Architecture principles with prompts organized by architectural layers (domain, database, hooks, UI, app). Each layer prompt includes a task checklist for tracking implementation progress.

## Input Requirements
- **Feature Description**: Clear, concise description of the functionality to implement
- **Current Date**: Automatically use today's date in YYYYMMDDHHMM format
- **Project Context**: Oliva App (React Native + Expo healthcare app for pediatric care)

## Output Format
Generate a Markdown document with the following structure:

### Document Title
`{YYYYMMDDHHMM}.{feature-slug}.prompt.md`

Where:
- `YYYYMMDDHHMM`: Current date (e.g., 202512041452)
- `feature-slug`: Kebab-case version of feature name (e.g., "user-authentication")

### Document Content Structure

```markdown
# {Feature Name} Implementation Guide

## Overview
Brief description of the feature and its purpose in the Oliva App context.

## Implementation Strategy
High-level approach following Clean Architecture:
- Domain layer: Business logic and rules
- Database layer: Data persistence and access
- Hooks layer: UI state management and orchestration
- UI layer: Presentation components following Atomic Design
- App layer: Screen composition and navigation

## Layer-Specific Prompts

### 1. Domain Layer Implementation
**Prompt:**
```
[Specific prompt for domain layer implementation]
```

**Tasks:**
- ⏳ Task 1 description
- ⏳ Task 2 description
- ⏳ Task 3 description

**Status:** ⏳ Pending | ✅ In Progress | ✅ Completed

### 2. Database Layer Implementation
**Prompt:**
```
[Specific prompt for database layer implementation]
```

**Tasks:**
- ⏳ Task 1 description
- ⏳ Task 2 description

**Status:** ⏳ Pending | ✅ In Progress | ✅ Completed

### 3. Hooks Layer Implementation
**Prompt:**
```
[Specific prompt for hooks layer implementation]
```

**Tasks:**
- ⏳ Task 1 description

**Status:** ⏳ Pending | ✅ In Progress | ✅ Completed

### 4. UI Layer Implementation
**Prompt:**
```
[Specific prompt for UI layer implementation]
```

**Tasks:**
- ⏳ Task 1 description
- ⏳ Task 2 description
- ⏳ Task 3 description

**Status:** ⏳ Pending | ✅ In Progress | ✅ Completed

### 5. App Layer Integration
**Prompt:**
```
[Specific prompt for app layer integration]
```

**Tasks:**
- ⏳ Task 1 description

**Status:** ⏳ Pending | 🔥 In Progress | ✅ Completed

## Quality Gates
- ⏳ Domain layer tests passing (unit tests)
- ⏳ Database layer integration tests passing
- ⏳ UI components accessibility compliant
- ⏳ End-to-end feature testing completed
- ⏳ Code review completed
- ⏳ Documentation updated

## Notes
Any additional implementation notes or considerations.
```

## Layer-Specific Prompt Guidelines

### Domain Layer Prompt Structure
- Define entities, ports, DTOs, use cases
- Include Zod schemas and validation
- Specify error handling patterns
- Follow SOLID principles

### Database Layer Prompt Structure
- Define Drizzle schemas
- Implement adapters following Port/Adapter pattern
- Include migration generation
- Specify database constraints and relationships

### Hooks Layer Prompt Structure
- Create hooks that orchestrate use cases and adapters
- Handle React state management
- Include error boundaries and loading states
- Follow hook naming conventions (use-{feature})

### UI Layer Prompt Structure
- Implement components following Atomic Design
- Use HeroUI components and Typography atoms
- Ensure accessibility (WCAG compliance)
- Include i18n support with type-safe keys

### App Layer Prompt Structure
- Integrate screens using Expo Router
- Compose UI components
- Handle navigation and routing
- Include form validation and user feedback

## Task Tracking Mechanism
- Use checkbox format: - ⏳ for pending, - [x] for completed
- Update status emojis: ⏳ Pending, 🔄 In Progress, ✅ Completed
- Mark tasks as completed when implementation is verified

## Safety Considerations
- Ensure all prompts follow AI safety best practices
- Avoid generating harmful or biased content
- Include security considerations in database and authentication features
- Maintain data privacy and compliance standards

## Example Usage
**Input Feature:** "User Authentication System"

**Generated Document:** `YYYYMMDDHHMM.{feature-slug}.prompt.md`

## Quality Assurance
- Validate generated prompts against project conventions
- Ensure all layers are covered for complete features
- Include testing requirements in each layer
- Follow the established instruction files for each layer

---

<!-- End of Feature Implementation Prompt Generator -->
