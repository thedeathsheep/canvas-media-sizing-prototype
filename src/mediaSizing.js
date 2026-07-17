export const TARGET_SHORT_EDGE = 360;
export const MAX_LONG_EDGE = 1200;

function assertDimension(value) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new TypeError("Media dimensions must be positive finite numbers");
  }
}

export function getNormalizedMediaSize(width, height) {
  assertDimension(width);
  assertDimension(height);

  const short = Math.min(width, height);
  const long = Math.max(width, height);
  const scale = Math.min(TARGET_SHORT_EDGE / short, MAX_LONG_EDGE / long);

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    scale,
  };
}

export function getMediaDisplaySize(node, mode) {
  if (mode === "raw") {
    return {
      width: node.sourceWidth,
      height: node.sourceHeight,
      scale: 1,
    };
  }

  if (mode !== "normalized") {
    throw new TypeError(`Unknown media display mode: ${mode}`);
  }

  return getNormalizedMediaSize(node.sourceWidth, node.sourceHeight);
}

export function formatDimensions(width, height) {
  return `${width} × ${height}`;
}
