---
title: "Workflow Patterns"
source_url: https://ai-sdk.dev/docs/agents/workflows
section: agents
crawled: 2026-09-20
---

# Workflow Patterns

> Source: https://ai-sdk.dev/docs/agents/workflows

[Agents](/docs/agents)Workflow Patterns


[Workflow Patterns](#workflow-patterns)
=======================================

Combine the building blocks from the [overview](/docs/agents/overview) with these patterns to add structure and reliability to your agents:

* [Sequential Processing](#sequential-processing-chains) - Steps executed in order
* [Parallel Processing](#parallel-processing) - Independent tasks run simultaneously
* [Evaluation/Feedback Loops](#evaluator-optimizer) - Results checked and improved iteratively
* [Orchestration](#orchestrator-worker) - Coordinating multiple components
* [Routing](#routing) - Directing work based on context

[Choose Your Approach](#choose-your-approach)
---------------------------------------------

Consider these key factors:

* **Flexibility vs Control** - How much freedom does the LLM need vs how tightly you must constrain its actions?
* **Error Tolerance** - What are the consequences of mistakes in your use case?
* **Cost Considerations** - More complex systems typically mean more LLM calls and higher costs
* **Maintenance** - Simpler architectures are easier to debug and modify

**Start with the simplest approach that meets your needs**. Add complexity only when required by:

1. Breaking down tasks into clear steps
2. Adding tools for specific capabilities
3. Implementing feedback loops for quality control
4. Introducing multiple agents for complex workflows

Let's look at examples of these patterns in action.

[Patterns with Examples](#patterns-with-examples)
-------------------------------------------------

These patterns, adapted from [Anthropic's guide on building effective agents](https://www.anthropic.com/research/building-effective-agents), serve as building blocks you can combine to create comprehensive workflows. Each pattern addresses specific aspects of task execution. Combine them thoughtfully to build reliable solutions for complex problems.

[Sequential Processing (Chains)](#sequential-processing-chains)
---------------------------------------------------------------

The simplest workflow pattern executes steps in a predefined order. Each step's output becomes input for the next step, creating a clear chain of operations. Use this pattern for tasks with well-defined sequences, like content generation pipelines or data transformation processes.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

async function generateMarketingCopy(input: string) {



5

const model = "xai/grok-4.6";



6



7

// First step: Generate marketing copy



8

const { text: copy } = await generateText({



9

model,



10

prompt: `Write persuasive marketing copy for: ${input}. Focus on benefits and emotional appeal.`,



11

});



12



13

// Perform quality check on copy



14

const { output: qualityMetrics } = await generateText({



15

model,



16

output: Output.object({



17

schema: z.object({



18

hasCallToAction: z.boolean(),



19

emotionalAppeal: z.number().min(1).max(10),



20

clarity: z.number().min(1).max(10),



21

}),



22

}),



23

prompt: `Evaluate this marketing copy for:



24

1. Presence of call to action (true/false)



25

2. Emotional appeal (1-10)



26

3. Clarity (1-10)



27



28

Copy to evaluate: ${copy}`,



29

});



30



31

// If quality check fails, regenerate with more specific instructions



32

if (



33

!qualityMetrics.hasCallToAction ||



34

qualityMetrics.emotionalAppeal < 7 ||



35

qualityMetrics.clarity < 7



36

) {



37

const { text: improvedCopy } = await generateText({



38

model,



39

prompt: `Rewrite this marketing copy with:



40

${!qualityMetrics.hasCallToAction ? '- A clear call to action' : ''}



41

${qualityMetrics.emotionalAppeal < 7 ? '- Stronger emotional appeal' : ''}



42

${qualityMetrics.clarity < 7 ? '- Improved clarity and directness' : ''}



43



44

Original copy: ${copy}`,



45

});



46

return { copy: improvedCopy, qualityMetrics };



47

}



48



49

return { copy, qualityMetrics };



50

}
```

[Routing](#routing)
-------------------

This pattern lets the model decide which path to take through a workflow based on context and intermediate results. The model acts as an intelligent router, directing the flow of execution between different branches of your workflow. Use this when handling varied inputs that require different processing approaches. In the example below, the first LLM call's results determine the second call's model size and system prompt.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

async function handleCustomerQuery(query: string) {



5

const model = "xai/grok-4.6";



6



7

// First step: Classify the query type



8

const { output: classification } = await generateText({



9

model,



10

output: Output.object({



11

schema: z.object({



12

reasoning: z.string(),



13

type: z.enum(['general', 'refund', 'technical']),



14

complexity: z.enum(['simple', 'complex']),



15

}),



16

}),



17

prompt: `Classify this customer query:



18

${query}



19



20

Determine:



21

1. Query type (general, refund, or technical)



22

2. Complexity (simple or complex)



23

3. Brief reasoning for classification`,



24

});



25



26

// Route based on classification



27

// Set model and system prompt based on query type and complexity



28

const { text: response } = await generateText({



29

model:



30

classification.complexity === 'simple'



31

? 'openai/gpt-4o-mini'



32

: 'openai/o4-mini',



33

instructions: {



34

general:



35

'You are an expert customer service agent handling general inquiries.',



36

refund:



37

'You are a customer service agent specializing in refund requests. Follow company policy and collect necessary information.',



38

technical:



39

'You are a technical support specialist with deep product knowledge. Focus on clear step-by-step troubleshooting.',



40

}[classification.type],



41

prompt: query,



42

});



43



44

return { response, classification };



45

}
```

[Parallel Processing](#parallel-processing)
-------------------------------------------

Break down tasks into independent subtasks that execute simultaneously. This pattern uses parallel execution to improve efficiency while maintaining the benefits of structured workflows. For example, analyze multiple documents or process different aspects of a single input concurrently (like code review).

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

// Example: Parallel code review with multiple specialized reviewers



5

async function parallelCodeReview(code: string) {



6

const model = "xai/grok-4.6";



7



8

// Run parallel reviews



9

const [securityReview, performanceReview, maintainabilityReview] =



10

await Promise.all([



11

generateText({



12

model,



13

instructions:



14

'You are an expert in code security. Focus on identifying security vulnerabilities, injection risks, and authentication issues.',



15

output: Output.object({



16

schema: z.object({



17

vulnerabilities: z.array(z.string()),



18

riskLevel: z.enum(['low', 'medium', 'high']),



19

suggestions: z.array(z.string()),



20

}),



21

}),



22

prompt: `Review this code:



23

${code}`,



24

}),



25



26

generateText({



27

model,



28

instructions:



29

'You are an expert in code performance. Focus on identifying performance bottlenecks, memory leaks, and optimization opportunities.',



30

output: Output.object({



31

schema: z.object({



32

issues: z.array(z.string()),



33

impact: z.enum(['low', 'medium', 'high']),



34

optimizations: z.array(z.string()),



35

}),



36

}),



37

prompt: `Review this code:



38

${code}`,



39

}),



40



41

generateText({



42

model,



43

instructions:



44

'You are an expert in code quality. Focus on code structure, readability, and adherence to best practices.',



45

output: Output.object({



46

schema: z.object({



47

concerns: z.array(z.string()),



48

qualityScore: z.number().min(1).max(10),



49

recommendations: z.array(z.string()),



50

}),



51

}),



52

prompt: `Review this code:



53

${code}`,



54

}),



55

]);



56



57

const reviews = [



58

{ ...securityReview.output, type: 'security' },



59

{ ...performanceReview.output, type: 'performance' },



60

{ ...maintainabilityReview.output, type: 'maintainability' },



61

];



62



63

// Aggregate results using another model instance



64

const { text: summary } = await generateText({



65

model,



66

instructions: 'You are a technical lead summarizing multiple code reviews.',



67

prompt: `Synthesize these code review results into a concise summary with key actions:



68

${JSON.stringify(reviews, null, 2)}`,



69

});



70



71

return { reviews, summary };



72

}
```

[Orchestrator-Worker](#orchestrator-worker)
-------------------------------------------

A primary model (orchestrator) coordinates the execution of specialized workers. Each worker optimizes for a specific subtask, while the orchestrator maintains overall context and ensures coherent results. This pattern excels at complex tasks requiring different types of expertise or processing.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

async function implementFeature(featureRequest: string) {



5

// Orchestrator: Plan the implementation



6

const { output: implementationPlan } = await generateText({



7

model: "xai/grok-4.6",



8

output: Output.object({



9

schema: z.object({



10

files: z.array(



11

z.object({



12

purpose: z.string(),



13

filePath: z.string(),



14

changeType: z.enum(['create', 'modify', 'delete']),



15

}),



16

),



17

estimatedComplexity: z.enum(['low', 'medium', 'high']),



18

}),



19

}),



20

instructions:



21

'You are a senior software architect planning feature implementations.',



22

prompt: `Analyze this feature request and create an implementation plan:



23

${featureRequest}`,



24

});



25



26

// Workers: Execute the planned changes



27

const fileChanges = await Promise.all(



28

implementationPlan.files.map(async file => {



29

// Each worker is specialized for the type of change



30

const workerSystemPrompt = {



31

create:



32

'You are an expert at implementing new files following best practices and project patterns.',



33

modify:



34

'You are an expert at modifying existing code while maintaining consistency and avoiding regressions.',



35

delete:



36

'You are an expert at safely removing code while ensuring no breaking changes.',



37

}[file.changeType];



38



39

const { output: change } = await generateText({



40

model: "xai/grok-4.6",



41

output: Output.object({



42

schema: z.object({



43

explanation: z.string(),



44

code: z.string(),



45

}),



46

}),



47

instructions: workerSystemPrompt,



48

prompt: `Implement the changes for ${file.filePath} to support:



49

${file.purpose}



50



51

Consider the overall feature context:



52

${featureRequest}`,



53

});



54



55

return {



56

file,



57

implementation: change,



58

};



59

}),



60

);



61



62

return {



63

plan: implementationPlan,



64

changes: fileChanges,



65

};



66

}
```

[Evaluator-Optimizer](#evaluator-optimizer)
-------------------------------------------

Add quality control to workflows with dedicated evaluation steps that assess intermediate results. Based on the evaluation, the workflow proceeds, retries with adjusted parameters, or takes corrective action. This creates robust workflows capable of self-improvement and error recovery.

GatewayProviderCustom

![](/icons/xai-black.svg)Grok 4.6

```
1

import { generateText, Output } from 'ai';



2

import { z } from 'zod';



3



4

async function translateWithFeedback(text: string, targetLanguage: string) {



5

let currentTranslation = '';



6

let iterations = 0;



7

const MAX_ITERATIONS = 3;



8



9

// Initial translation



10

const { text: translation } = await generateText({



11

model: "xai/grok-4.6",



12

instructions: 'You are an expert literary translator.',



13

prompt: `Translate this text to ${targetLanguage}, preserving tone and cultural nuances:



14

${text}`,



15

});



16



17

currentTranslation = translation;



18



19

// Evaluation-optimization loop



20

while (iterations < MAX_ITERATIONS) {



21

// Evaluate current translation



22

const { output: evaluation } = await generateText({



23

model: "xai/grok-4.6",



24

output: Output.object({



25

schema: z.object({



26

qualityScore: z.number().min(1).max(10),



27

preservesTone: z.boolean(),



28

preservesNuance: z.boolean(),



29

culturallyAccurate: z.boolean(),



30

specificIssues: z.array(z.string()),



31

improvementSuggestions: z.array(z.string()),



32

}),



33

}),



34

instructions: 'You are an expert in evaluating literary translations.',



35

prompt: `Evaluate this translation:



36



37

Original: ${text}



38

Translation: ${currentTranslation}



39



40

Consider:



41

1. Overall quality



42

2. Preservation of tone



43

3. Preservation of nuance



44

4. Cultural accuracy`,



45

});



46



47

// Check if quality meets threshold



48

if (



49

evaluation.qualityScore >= 8 &&



50

evaluation.preservesTone &&



51

evaluation.preservesNuance &&



52

evaluation.culturallyAccurate



53

) {



54

break;



55

}



56



57

// Generate improved translation based on feedback



58

const { text: improvedTranslation } = await generateText({



59

model: "xai/grok-4.6",



60

instructions: 'You are an expert literary translator.',



61

prompt: `Improve this translation based on the following feedback:



62

${evaluation.specificIssues.join('\n')}



63

${evaluation.improvementSuggestions.join('\n')}



64



65

Original: ${text}



66

Current Translation: ${currentTranslation}`,



67

});



68



69

currentTranslation = improvedTranslation;



70

iterations++;



71

}



72



73

return {



74

finalTranslation: currentTranslation,



75

iterationsRequired: iterations,



76

};



77

}
```

[Previous

Building Agents](/docs/agents/building-agents)[Next

Loop Control](/docs/agents/loop-control)
