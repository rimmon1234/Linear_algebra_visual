# AI_SPEC.md

## 1. Purpose

Define the AI-powered Playground as a controlled orchestration system rather than an unrestricted chatbot.

## 2. Core Principle

> The model explains and interprets; deterministic mathematics verifies whenever practical.

## 3. Pipeline

```text
Student Question
      ↓
Input normalization
      ↓
Question classification
      ↓
Topic identification
      ↓
Problem-type identification
      ↓
Math computation / solver tools
      ↓
Verification
      ↓
Explanation generation
      ↓
Visualization planning
      ↓
Schema validation
      ↓
Final response
```

## 4. AI Responsibilities

AI may:

- classify natural-language questions,
- explain concepts,
- generate hints,
- generate step-by-step prose,
- map a problem to a known visualization type,
- translate verified results into student-friendly language.

AI should not be the sole authority for deterministic numerical results when a math engine can verify them.

## 5. Tool Access

AI should interact with explicit tools/functions such as:

```text
computeMatrixOperation
solveLinearSystem
computeEigenSystem
projectVector
computeGramSchmidt
computeQR
computeSVD
computePseudoInverse
buildVisualizationSpec
```

Tool contracts must be typed and validated.

## 6. Structured Output

AI output should use a schema similar to:

```ts
interface PlaygroundResponse {
  interpretation: string;
  topicId?: string;
  problemType?: string;
  answer: string;
  steps: Step[];
  conceptualExplanation?: string;
  verification?: VerificationResult;
  visualization?: VisualizationSpec;
  caveats?: string[];
}
```

## 7. Visualization Generation

The model may propose a visualization specification.

It must not generate executable renderer code.

Pipeline:

```text
AI proposal
   ↓
Zod validation
   ↓
semantic validation
   ↓
renderer
```

## 8. Unsupported Questions

If the system cannot reliably solve or visualize a question:

- state the limitation,
- provide whatever verified partial explanation is useful,
- do not fabricate a result,
- do not fabricate a geometric interpretation.

## 9. Prompt Design

Prompts should define:

- role,
- input schema,
- task,
- allowed tools,
- output schema,
- mathematical requirements,
- failure behavior.

Keep prompts versioned and separate from components.

## 10. AI and Math Verification

For a problem such as eigenvalues:

```text
LLM identifies task
       ↓
math engine computes result
       ↓
math result is authoritative
       ↓
LLM explains result
```

If model prose conflicts with verified results, regenerate/fix the prose rather than changing the verified mathematics.

## 11. Security

Never execute:

- model-generated JavaScript,
- model-generated React components,
- arbitrary shell commands,
- arbitrary SQL,
- untrusted code from the student.

AI provider credentials remain server-side.

## 12. Cost / Latency

Prefer deterministic local computation before invoking a model.

Cache stable/generated content when appropriate.

Stream long natural-language responses where useful, but do not stream partial structured visualization objects into the renderer until validated.

## 13. Evaluation

Maintain golden questions covering each module and major operation.

Evaluate:

- topic classification,
- numerical correctness,
- explanation correctness,
- visualization suitability,
- schema validity.

## 14. Educational Behavior

The AI should prefer teaching over answer dumping.

For practice questions, reveal hints progressively and explain mistakes.
