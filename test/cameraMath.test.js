import test from "node:test";
import assert from "node:assert/strict";
import { clampZoom, panCamera, zoomCameraAt } from "../src/cameraMath.js";

test("clamps zoom to the prototype range", () => {
  assert.equal(clampZoom(0.1), 0.25);
  assert.equal(clampZoom(1), 1);
  assert.equal(clampZoom(4), 2);
});

test("pans one shared camera without changing scale", () => {
  assert.deepEqual(panCamera({ x: 28, y: 92, scale: 1 }, 10, -12), {
    x: 38,
    y: 80,
    scale: 1,
  });
});

test("keeps the pointer world position fixed while zooming", () => {
  assert.deepEqual(
    zoomCameraAt({ x: 0, y: 0, scale: 1 }, 2, { x: 100, y: 80 }),
    { x: -100, y: -80, scale: 2 },
  );
});
