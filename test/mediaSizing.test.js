import test from "node:test";
import assert from "node:assert/strict";
import {
  formatDimensions,
  getMediaDisplaySize,
  getNormalizedMediaSize,
} from "../src/mediaSizing.js";

test("normalizes landscape media to a 360 short edge", () => {
  assert.deepEqual(getNormalizedMediaSize(1920, 1080), {
    width: 640,
    height: 360,
    scale: 1 / 3,
  });
});

test("normalizes portrait media to a 360 short edge", () => {
  assert.deepEqual(getNormalizedMediaSize(1080, 1920), {
    width: 360,
    height: 640,
    scale: 1 / 3,
  });
});

test("normalizes square media", () => {
  assert.deepEqual(getNormalizedMediaSize(2048, 2048), {
    width: 360,
    height: 360,
    scale: 360 / 2048,
  });
});

test("caps panorama media at a 1200 long edge", () => {
  assert.deepEqual(getNormalizedMediaSize(4096, 1024), {
    width: 1200,
    height: 300,
    scale: 1200 / 4096,
  });
});

test("raw mode preserves source dimensions and metadata", () => {
  const node = { sourceWidth: 1920, sourceHeight: 1080 };
  assert.deepEqual(getMediaDisplaySize(node, "raw"), {
    width: 1920,
    height: 1080,
    scale: 1,
  });
  assert.equal(node.sourceWidth, 1920);
  assert.equal(node.sourceHeight, 1080);
  assert.equal(formatDimensions(1920, 1080), "1920 × 1080");
});

test("rejects an unknown display mode", () => {
  assert.throws(
    () => getMediaDisplaySize({ sourceWidth: 1920, sourceHeight: 1080 }, "other"),
    /Unknown media display mode/,
  );
});

test("rejects non-positive and non-finite dimensions", () => {
  for (const pair of [[0, 1080], [-1, 1080], [NaN, 1080], [1920, Infinity]]) {
    assert.throws(() => getNormalizedMediaSize(...pair), /positive finite/);
  }
});

test("only media nodes receive alternate display dimensions", async () => {
  const { DEMO_NODES } = await import("../src/demoData.js");
  const media = DEMO_NODES.filter((node) => node.kind === "media");
  const fixed = DEMO_NODES.filter((node) => node.kind !== "media");

  assert.equal(media.length, 4);
  assert.deepEqual(fixed.map(({ width, height }) => [width, height]), [
    [320, 248],
    [280, 180],
  ]);
});
