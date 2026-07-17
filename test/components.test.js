import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "vitest";
import { App } from "../src/App.jsx";
import { MediaNode, ProcessNode, TextNode } from "../src/components.jsx";

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
