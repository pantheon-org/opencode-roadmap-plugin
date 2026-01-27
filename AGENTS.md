## Repository Overview

OpenCode plugin for project planning and roadmap management. Provides tools for creating specifications (`spec.md`), generating study plans (`plan.md`), and tracking progress. Built with TypeScript and the OpenCode Plugin SDK.

<instructions>

## Build & Type Check

- **Type check**: `npm run lint` - Runs `tsc --noEmit` to verify types without emitting files (STRONGLY PREFERRED)
- **Build**: `npm run build` - Compiles TypeScript to JavaScript
- **Clean**: `npm run clean` - Removes generated `.js` and `.d.ts` files from source tree

## Plugin Architecture

- **Entry point**: `index.ts` - Registers tools and system hooks via `PlanPlugin`
- **Tool Implementation**: `tools/` - Contains logic for plan and spec management tools
- **System Hooks**: `hooks/` - Core plugin event handlers
- **Security Utilities**: `utils.ts` - Mandatory helpers for path validation and file formatting

</instructions>

<rules>

## Process Constraints

- MUST NOT run long-running/blocking processes (e.g., `npm run watch`)
- MUST use one-shot commands only (`npm run build`, `npm run lint`)
- Dev servers and watch modes are the USER's responsibility

## Coding Conventions

- **TypeScript strict mode**: All code MUST pass `tsc --noEmit` with strict type checking
- **Path security**: MUST use `getSecurePath`, `getPlanPath`, or `getSpecPath` from `utils.ts` for all file operations
- **Name validation**: MUST use `validateName` for user-provided names (alphanumeric + hyphens, max 3 words)
- **File formats**: 
  - Plans: MUST use frontmatter with `plan name`, `plan description`, `plan status`
  - Specs: MUST use `# Spec: {name}` header and `Scope:` field
- **Utility imports**: Import shell and context types from `@opencode-ai/plugin`

</rules>

<routing>

## Task Navigation

| Task | Entry Point | Key Files |
|------|-------------|-----------|
| Add/Modify tool | `tools/` | Tool implementation modules |
| Change hooks | `hooks/` | Plugin hook definitions |
| File formatting | `utils.ts` | `formatPlan` and `formatSpec` functions |
| Path security | `utils.ts` | `getSecurePath` logic |

</routing>

<context_hints>

- **Restricted**: `dist/` and `node_modules/` MUST be ignored by agents
- **Critical**: `utils.ts` contains security-critical path validation that MUST NOT be bypassed

</context_hints>
