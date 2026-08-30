# UX_SPEC.md

## 1. UX Goal

The product should feel like an interactive mathematics laboratory rather than a static notes website.

## 2. Core Layout

Desktop topic page:

```text
┌──────────────────────────────────────────────────────────┐
│ Header                                                     │
├───────────────┬───────────────────────────────────────────┤
│ Curriculum    │ Topic Content                             │
│ Navigation    │                                            │
│               │ Explanation                                │
│ Module I      │ Formula                                    │
│  Topic 1      │ Example                                    │
│  Topic 2      │                                            │
│  Topic 3      ├───────────────────────────────────────────┤
│               │ Interactive Visualizer                     │
│ Module II     │                                            │
│ ...           │ Controls                                   │
└───────────────┴───────────────────────────────────────────┘
```

Exact visual style is implementation-defined, but hierarchy must remain obvious.

## 3. Visualizer UI

The visualizer should make these actions discoverable:

- rotate/orbit,
- zoom,
- reset camera,
- play/pause animation,
- reset experiment,
- change relevant matrix/vector values.

Do not expose irrelevant controls.

## 4. Learning Interaction

A recommended concept flow:

```text
Explain
 ↓
Show
 ↓
Interact
 ↓
Ask student to predict
 ↓
Reveal/check
 ↓
Practice
```

## 5. Controls

Inputs should display units/meaning where relevant.

Matrix inputs should clearly indicate row/column position.

Vector inputs should clearly indicate coordinates.

Invalid states should be explained inline.

## 6. Motion

Animations should be purposeful and reasonably short.

Provide play/pause/reset controls.

Do not make important information depend solely on animation timing.

## 7. Responsive Behavior

On mobile:

```text
navigation → collapsible
content → single column
visualizer → large dedicated panel
controls → bottom sheet/stacked panel where appropriate
```

Touch interactions must not be overly fragile.

## 8. Visual Hierarchy

Prioritize:

1. Concept being learned.
2. Mathematical relationship.
3. Visualization.
4. Interactive controls.
5. Optional details.

Avoid excessive decorative UI.

## 9. Accessibility

- Visible labels for controls.
- Keyboard-accessible UI controls.
- Strong focus indication.
- Semantic headings.
- Formula text accompanied by contextual explanation.
- Important numeric values available outside the canvas.

## 10. Empty / Error States

Do not leave large blank panels.

Use clear messages such as:

```text
This visualization is not available for this problem yet.
```

rather than internal technical errors.

## 11. Playground UX

Recommended layout:

```text
Question input
      ↓
Solve
      ↓
Solution + steps
      │
      ├── Explanation
      ├── Verification
      └── Visualization
```

Allow the learner to resize or switch focus between text and visualization on larger screens.

## 12. Practice UX

Answer → feedback → explanation → visual proof where applicable.

Hints should progressively reveal information.
