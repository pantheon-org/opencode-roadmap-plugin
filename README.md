# OpenCode Planning Toolkit

A powerful planning and roadmap management plugin for OpenCode. This toolkit helps you define project specifications, create actionable study plans, and track progress directly within your coding environment.

## Features

- **Specification Management**: Create and iterate on project specs (`spec.md`).
- **Actionable Study Plans**: Generate structured study plans from your goals.
- **Progress Tracking**: Mark tasks as done and update your roadmap automatically.
- **LLM Integration**: Custom tools for the agent to read and modify your planning documents.

## Installation

Add the plugin to your `opencode.json`:

```json
{
  "plugins": [
    "@howaboua/opencode-planning-toolkit"
  ]
}
```

Or for local development:

```json
{
  "plugins": [
    "file:///path/to/opencode-planning-toolkit/index.ts"
  ]
}
```

## Tools

- `create_spec`: Initialize or update `spec.md`.
- `append_spec`: Add requirements to an existing spec.
- `create_plan`: Generate `plan.md` from a spec or goal.
- `read_plan`: Get the current state of your planning documents.
- `mark_plan_done`: Update task status in `plan.md`.

## License

MIT
