# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Confirmed prototype decisions

- Use the selected direction 2: a neutral desktop split comparison with synchronized camera and selection.
- The prototype must include a real 16px text node and a fixed-size generation/process node; showing their relative visual weight is the reason media is normalized.
- Only image and video nodes change display geometry. Text and functional nodes keep identical dimensions in both panes.
- Media display size uses `scale = min(360 / min(W, H), 1200 / max(W, H))` and preserves aspect ratio.
- Source resolution, original file semantics, downloads, and downstream generation references do not change.
- Do not expose per-node resize handles or manual single-node scaling.
