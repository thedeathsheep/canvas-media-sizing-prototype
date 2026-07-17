# 媒体节点展示尺寸原型

这是一个桌面无限画布交互原型，用来验证：图片和视频只改变画布展示尺寸，源文件、源像素、下载和生成参考语义保持不变，从而让 16px 文本与固定功能节点在同一视口中更容易浏览。

## 运行

```bash
npm install
npm run dev
```

测试和构建：

```bash
npm test
npm run build
```

## 展示尺寸规则

只对图片、视频节点计算展示尺寸：

```text
scale = min(360 / min(sourceWidth, sourceHeight),
            1200 / max(sourceWidth, sourceHeight))

displayWidth  = round(sourceWidth  * scale)
displayHeight = round(sourceHeight * scale)
```

- 短边目标值为 360px。
- 长边上限为 1200px，避免超宽或超长素材占据过多画布。
- 始终保持原始宽高比。
- 文本、流程等非媒体节点保持固定尺寸。
- 不提供单节点手动缩放；相机缩放和平移对所有节点统一生效。
- 源像素和展示像素同时可见，避免用户误解素材被压缩。

## 原型包含

- 原始像素、舒适展示、并排对比三种查看方式。
- 两侧共享相机和平移/缩放状态。
- 节点选择与信息面板同步。
- 图片与视频示例、16px 文本节点、固定尺寸流程节点。
- 真实素材预览，不改变下载与生成参考信息。

