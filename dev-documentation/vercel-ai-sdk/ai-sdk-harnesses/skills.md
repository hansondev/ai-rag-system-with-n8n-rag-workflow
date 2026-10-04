---
title: "Harness Skills"
source_url: https://ai-sdk.dev/docs/ai-sdk-harnesses/skills
section: ai-sdk-harnesses
crawled: 2026-09-20
---

# Harness Skills

> Source: https://ai-sdk.dev/docs/ai-sdk-harnesses/skills

[AI SDK Harnesses](/docs/ai-sdk-harnesses)Skills


[Harness Skills](#harness-skills)
=================================

[Skills](https://agentskills.io/) are reusable instruction bundles that can
be useful for project conventions, workflow guidance, domain-specific procedures,
or any other instructions that should be discoverable by the underlying harness
runtime. You can configure skills for a `HarnessAgent` or replace them between
completed turns.

[Define Skills](#define-skills)
-------------------------------

Pass skills to `HarnessAgent` with the `skills` setting:

```
1

const agent = new HarnessAgent({



2

harness: claudeCode,



3

sandbox: createVercelSandbox({



4

runtime: 'node24',



5

ports: [4000],



6

}),



7

skills: [



8

{



9

name: 'careful-refactors',



10

description: 'Make small, low-risk code changes.',



11

content:



12

'Prefer minimal diffs. Preserve public APIs. Before editing, read references/checklist.md and follow it.',



13

files: [



14

{



15

path: 'references/checklist.md',



16

content:



17

'# Refactor checklist\n\n- Identify the smallest useful change.\n- Preserve public APIs.\n- Run the narrowest relevant test.',



18

},



19

],



20

},



21

],



22

});
```

Each skill has:

* `name`: stable identifier for the skill.
* `description`: short model-facing summary.
* `content`: full instruction content.
* `files`: optional additional text files bundled with the skill.

Additional files use skill-relative POSIX paths, for example
`reference.md`, `references/codes.md`, or `templates/config.json`. Reference
those paths from `content` when the agent should read them.

[When to Use Skills](#when-to-use-skills)
-----------------------------------------

Use skills for reusable instructions that should be available on demand, instead of
always being loaded into the agent's context like regular `instructions`.

Use `instructions` for broad agent behavior and current-session priorities.

Skills can be changed between completed turns using `callOptionsSchema` and
`prepareCall`. See [Change Settings Between Turns](/docs/ai-sdk-harnesses/harness-agent#change-settings-between-turns)
for details.

[Related](#related)
-------------------

* [HarnessAgent](/docs/ai-sdk-harnesses/harness-agent)
* [Harness tools](/docs/ai-sdk-harnesses/tools)
* [Harness adapters](/docs/ai-sdk-harnesses/harness-adapters)

[Previous

Tools](/docs/ai-sdk-harnesses/tools)[Next

Harness Adapters](/docs/ai-sdk-harnesses/harness-adapters)
