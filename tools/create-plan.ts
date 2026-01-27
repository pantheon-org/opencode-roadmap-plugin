/**
 * tools/create-plan.ts
 * Implements plan creation with validation and frontmatter formatting.
 * Returns guidance about global specs after writing the plan.
 */
import { tool } from "@opencode-ai/plugin"
import { ensureDirectory, formatPlan, getPlanPath, validateName } from "../utils"
import type { Ctx } from "../types"
import { listRepoSpecs } from "./shared"

export const createPlanTool = (ctx: Ctx) =>
  tool({
    description:
      "Create a plan. Name MUST be [A-Za-z0-9-], max 3 words. Idea REQUIRED and detailed. SHORT description REQUIRED (3-5 words) and MUST NOT overlap with the plan name. Steps REQUIRED (min 5), specific and actionable. You SHOULD ask clarifying questions before creating a plan. After creating: (1) you MUST use appendSpec for all REPO scope specs listed, (2) you MUST ask user if they want a FEATURE spec for this plan. Other agents MUST read the plan before major work.",
    args: {
      name: tool.schema.string().describe("Plan name MUST be [A-Za-z0-9-], max 3 words."),
      idea: tool.schema.string().describe("Plan idea (REQUIRED, detailed)"),
      description: tool.schema.string().describe("Plan SHORT description (REQUIRED, 3-5 words, NOT overlapping name)"),
      steps: tool.schema.array(tool.schema.string()).describe("Implementation steps (REQUIRED, min 5, specific)"),
    },
    async execute(args) {
      if (!args.name) return "Error: 'name' parameter is REQUIRED."
      if (!args.description) return "Error: 'description' parameter is REQUIRED."
      const words = args.description.trim().split(/\s+/).filter(Boolean).length
      if (words < 3 || words > 10) {
        return "Error: 'description' parameter must be between 3 and 10 words."
      }
      if (!args.steps || args.steps.length < 5) {
        return "Error: 'steps' parameter is REQUIRED and must include at least 5 steps."
      }
      const nameCheck = validateName(args.name)
      if (!nameCheck.ok) return `Error: Invalid plan name '${args.name}': ${nameCheck.reason}.`
      const path = getPlanPath(ctx.directory, args.name)
      if (await Bun.file(path).exists()) return `Error: Plan '${args.name}' already exists. Use a unique name.`

      await ensureDirectory(path, ctx.$)
      const content = formatPlan(args.idea || "", args.name, args.description, args.steps || [])
      const bytes = await Bun.write(path, content)

      if (bytes === 0 || !(await Bun.file(path).exists())) {
        return `Error: Failed to write plan '${args.name}' to disk. Please check permissions.`
      }

      const repoSpecs = await listRepoSpecs(ctx.directory)
      const featurePrompt = `You MUST ask the user if they want to create a FEATURE spec for plan '${args.name}'.`
      if (repoSpecs.length === 0) {
        return `Plan '${args.name}' created successfully. No global specs detected. ${featurePrompt}`
      }
      return `Plan '${args.name}' created successfully. REQUIRED: (1) Call appendSpec for each REPO spec: ${repoSpecs.join(", ")}. (2) ${featurePrompt}`
    },
  })
