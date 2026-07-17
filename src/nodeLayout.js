import { getMediaDisplaySize } from "./mediaSizing.js";

export const RAW_LAYOUT_GAP = 80;
export const RAW_MEDIA_ROW_WIDTH = 3600;

function getNodeSize(node, mode) {
  if (node.kind === "media") {
    return getMediaDisplaySize(node, mode);
  }

  return { width: node.width, height: node.height, scale: 1 };
}

function createFrame(node, mode, x, y) {
  return { id: node.id, x, y, ...getNodeSize(node, mode) };
}

export function getCanvasLayout(nodes, mode) {
  if (mode === "normalized") {
    return Object.fromEntries(
      nodes.map((node) => [node.id, createFrame(node, mode, node.x, node.y)]),
    );
  }

  if (mode !== "raw") {
    throw new TypeError(`Unknown canvas layout mode: ${mode}`);
  }

  const primaryMedia = nodes.find((node) => node.kind === "media");
  const fixedNodes = nodes.filter((node) => node.kind !== "media");
  const remainingMedia = nodes.filter(
    (node) => node.kind === "media" && node.id !== primaryMedia?.id,
  );
  const frames = {};
  let nextY = 0;

  if (primaryMedia) {
    const primaryFrame = createFrame(primaryMedia, mode, 0, 0);
    frames[primaryMedia.id] = primaryFrame;
    nextY = primaryFrame.height + RAW_LAYOUT_GAP;
  }

  let fixedX = 0;
  let fixedRowHeight = 0;
  for (const node of fixedNodes) {
    const frame = createFrame(node, mode, fixedX, nextY);
    frames[node.id] = frame;
    fixedX += frame.width + RAW_LAYOUT_GAP;
    fixedRowHeight = Math.max(fixedRowHeight, frame.height);
  }
  if (fixedNodes.length > 0) {
    nextY += fixedRowHeight + RAW_LAYOUT_GAP;
  }

  let rowX = 0;
  let rowHeight = 0;
  for (const node of remainingMedia) {
    const size = getNodeSize(node, mode);
    if (rowX > 0 && rowX + size.width > RAW_MEDIA_ROW_WIDTH) {
      nextY += rowHeight + RAW_LAYOUT_GAP;
      rowX = 0;
      rowHeight = 0;
    }

    frames[node.id] = { id: node.id, x: rowX, y: nextY, ...size };
    rowX += size.width + RAW_LAYOUT_GAP;
    rowHeight = Math.max(rowHeight, size.height);
  }

  return frames;
}
