import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "vitest";
import { App } from "../src/App.jsx";
import { CanvasPane, MediaNode, ProcessNode, TextNode } from "../src/components.jsx";

function extractNodeRectangles(html) {
  return [...html.matchAll(/<button[^>]*style="([^"]+)"[^>]*data-node-id="([^"]+)"/g)].map((match) => {
    const values = Object.fromEntries(
      [...match[1].matchAll(/(left|top|width|height):([\d.]+)(?:px)?/g)].map((entry) => [entry[1], Number(entry[2])]),
    );
    return {
      id: match[2],
      x: values.left,
      y: values.top,
      width: values.width,
      height: values.height,
    };
  });
}

function rectanglesOverlap(a, b) {
  return a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y;
}

test("media node exposes source and display dimensions without resize affordances", () => {
  const node = {
    id: "video-landscape",
    kind: "media",
    mediaType: "video",
    title: "城市氛围参考",
    src: "assets/city-landscape.webp",
    sourceWidth: 1920,
    sourceHeight: 1080,
  };
  const html = renderToStaticMarkup(createElement(MediaNode, {
    node,
    mode: "normalized",
    size: { width: 640, height: 360, scale: 1 / 3 },
    style: { left: 0, top: 0, width: 640, height: 360 },
    selected: true,
    onSelect: () => {},
  }));

  assert.match(html, /data-node-id="video-landscape"/);
  assert.match(html, /原始 1920 × 1080/);
  assert.match(html, /展示 640 × 360/);
  assert.doesNotMatch(html, /resize|缩放手柄/);
});

test("text and process nodes keep fixed semantic surfaces", () => {
  const textHtml = renderToStaticMarkup(createElement(TextNode, {
    node: { id: "text", kind: "text", title: "镜头意图", body: "正文", width: 320, height: 248 },
    style: { width: 320, height: 248 },
    selected: false,
    onSelect: () => {},
  }));
  const processHtml = renderToStaticMarkup(createElement(ProcessNode, {
    node: { id: "process", kind: "process", title: "生成画面", subtitle: "参考素材 + 镜头意图", width: 280, height: 180 },
    style: { width: 280, height: 180 },
    selected: false,
    onSelect: () => {},
  }));

  assert.match(textHtml, /text-node__body/);
  assert.match(processHtml, /步骤 1/);
  assert.match(processHtml, /已就绪/);
  assert.match(processHtml, /步骤 2/);
  assert.match(processHtml, /待生成/);
  assert.match(processHtml, /参考素材 \+ 镜头意图/);
});

test("app renders raw and normalized panes from one comparison state", () => {
  const html = renderToStaticMarkup(createElement(App));

  assert.match(html, /原始像素放置/);
  assert.match(html, /舒适展示规则/);
  assert.match(html, /同步视口/);
  assert.equal((html.match(/data-node-id="text-brief"/g) ?? []).length, 2);
  assert.equal((html.match(/data-node-id="process-generate"/g) ?? []).length, 2);
});

test("raw canvas starts with a collision-free node layout", () => {
  const html = renderToStaticMarkup(createElement(CanvasPane, {
    mode: "raw",
    camera: { x: 28, y: 30, scale: 1 },
    selectedId: "video-landscape",
    onSelect: () => {},
    onPointerDown: () => {},
    onPointerMove: () => {},
    onPointerUp: () => {},
    onWheel: () => {},
  }));
  const rectangles = extractNodeRectangles(html);

  assert.equal(rectangles.length, 6);
  for (let index = 0; index < rectangles.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < rectangles.length; otherIndex += 1) {
      assert.equal(
        rectanglesOverlap(rectangles[index], rectangles[otherIndex]),
        false,
        `${rectangles[index].id} overlaps ${rectangles[otherIndex].id}`,
      );
    }
  }
});
