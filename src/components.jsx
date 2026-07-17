import {
  Braces,
  ChevronDown,
  CirclePlay,
  Image as ImageIcon,
  LocateFixed,
  Maximize2,
  Minimize2,
  MousePointer2,
  Sparkles,
  TextCursorInput,
  Video,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { DEMO_NODES } from "./demoData.js";
import { formatDimensions, getMediaDisplaySize } from "./mediaSizing.js";
import { getCanvasLayout } from "./nodeLayout.js";

const VIEW_OPTIONS = [
  { id: "compare", label: "并排对比" },
  { id: "raw", label: "仅原始像素" },
  { id: "normalized", label: "仅舒适展示" },
];

export function Toolbar({ viewMode, zoom, onViewModeChange, onZoomOut, onZoomIn, onReset }) {
  return (
    <header className="toolbar">
      <div className="toolbar__identity">
        <div className="toolbar__mark"><Braces size={17} strokeWidth={1.8} /></div>
        <div>
          <strong>媒体节点展示尺寸</strong>
          <span>桌面画布 · 规则验证</span>
        </div>
      </div>

      <nav className="segmented" aria-label="视图模式">
        {VIEW_OPTIONS.map((option) => (
          <button
            type="button"
            key={option.id}
            className={viewMode === option.id ? "is-active" : ""}
            aria-pressed={viewMode === option.id}
            onClick={() => onViewModeChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </nav>

      <div className="toolbar__controls">
        <button type="button" className="icon-button" aria-label="缩小" onClick={onZoomOut}>
          <ZoomOut size={17} />
        </button>
        <button type="button" className="zoom-readout" aria-label={`当前缩放 ${zoom}%`}>
          {zoom}% <ChevronDown size={13} />
        </button>
        <button type="button" className="icon-button" aria-label="放大" onClick={onZoomIn}>
          <ZoomIn size={17} />
        </button>
        <span className="toolbar__divider" />
        <button type="button" className="reset-button" onClick={onReset}>
          <LocateFixed size={16} /> 重置视图
        </button>
        <span className="sync-status"><span />同步视口</span>
      </div>
    </header>
  );
}

export function MediaNode({ node, mode, size, style, selected, onSelect }) {
  const TypeIcon = node.mediaType === "video" ? Video : ImageIcon;
  const rootStyle = {
    ...style,
    height: "auto",
    "--media-height": `${size.height}px`,
  };

  return (
    <button
      type="button"
      className={`canvas-node media-node ${selected ? "is-selected" : ""}`}
      style={rootStyle}
      data-node-id={node.id}
      data-kind={node.kind}
      aria-selected={selected}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.(node.id);
      }}
    >
      <span className="media-node__title">
        <span><TypeIcon size={14} />{node.title}</span>
        <Maximize2 size={14} />
      </span>
      <span className="media-node__frame">
        <img src={node.src} alt="" draggable="false" />
        {node.mediaType === "video" && (
          <span className="media-node__play"><CirclePlay size={34} fill="rgba(13,15,17,.58)" /></span>
        )}
      </span>
      <span className="media-node__meta">
        <span>原始 {formatDimensions(node.sourceWidth, node.sourceHeight)}</span>
        <span>展示 {formatDimensions(size.width, size.height)}</span>
        <span className={`mode-dot mode-dot--${mode}`} />
      </span>
    </button>
  );
}

export function TextNode({ node, style, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`canvas-node fixed-node text-node ${selected ? "is-selected" : ""}`}
      style={style}
      data-node-id={node.id}
      data-kind={node.kind}
      aria-selected={selected}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.(node.id);
      }}
    >
      <span className="fixed-node__header">
        <span><TextCursorInput size={15} />{node.title}</span>
        <span className="fixed-node__badge">16px</span>
      </span>
      <span className="text-node__body">{node.body}</span>
      <span className="text-node__footer">固定尺寸 · 两侧一致</span>
    </button>
  );
}

export function ProcessNode({ node, style, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`canvas-node fixed-node process-node ${selected ? "is-selected" : ""}`}
      style={style}
      data-node-id={node.id}
      data-kind={node.kind}
      aria-selected={selected}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.(node.id);
      }}
    >
      <span className="port port--input" />
      <span className="port port--output" />
      <span className="fixed-node__header">
        <span><Sparkles size={15} />{node.title}</span>
        <span className="status-pill">可运行</span>
      </span>
      <span className="process-node__subtitle">{node.subtitle}</span>
      <span className="process-node__steps">
        <span><i className="step-dot step-dot--ready" /><b>步骤 1</b><em>已就绪</em></span>
        <span><i className="step-dot step-dot--waiting" /><b>步骤 2</b><em>待生成</em></span>
      </span>
      <span className="process-node__footer">固定 280 × 180</span>
    </button>
  );
}

export function CanvasPane({
  mode,
  camera,
  selectedId,
  onSelect,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWheel,
}) {
  const isRaw = mode === "raw";
  const layout = getCanvasLayout(DEMO_NODES, mode);
  const title = isRaw ? "原始像素放置" : "舒适展示规则";
  const description = isRaw
    ? "高分辨率媒体占据大量画布空间，固定节点的相对权重被压低。"
    : "短边设为 360、长边不超过 1200，文本与功能节点更容易浏览。";

  return (
    <section className={`canvas-pane canvas-pane--${mode}`} data-mode={mode}>
      <div className="pane-intro">
        <div>
          <span className={`pane-intro__eyebrow pane-intro__eyebrow--${mode}`}>
            {isRaw ? "比较基线" : "推荐默认"}
          </span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="pane-intro__formula">
          {isRaw ? "1 px = 1 画布单位" : "short = 360 · long ≤ 1200"}
        </span>
      </div>

      <div
        className="canvas-surface"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onClick={() => onSelect?.(null)}
      >
        <div className="axis axis--x" aria-hidden="true"><span>0</span><span>400</span><span>800</span><span>1200</span></div>
        <div className="axis axis--y" aria-hidden="true"><span>0</span><span>400</span><span>800</span></div>
        <div
          className="canvas-world"
          style={{ transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})` }}
        >
          {DEMO_NODES.map((node) => {
            const frame = layout[node.id];
            const size = {
              width: frame.width,
              height: frame.height,
              scale: frame.scale,
            };
            const style = {
              left: frame.x,
              top: frame.y,
              width: size.width,
              height: size.height,
            };
            const shared = {
              node,
              style,
              selected: selectedId === node.id,
              onSelect,
            };

            if (node.kind === "media") {
              return <MediaNode key={node.id} {...shared} mode={mode} size={size} />;
            }
            if (node.kind === "text") {
              return <TextNode key={node.id} {...shared} />;
            }
            return <ProcessNode key={node.id} {...shared} />;
          })}
        </div>
        <span className="canvas-hint"><MousePointer2 size={13} />拖动画布 · 滚轮缩放</span>
      </div>
    </section>
  );
}

export function Inspector({ node, mode, collapsed, onToggle }) {
  if (!node) return null;
  const isMedia = node.kind === "media";
  const size = isMedia ? getMediaDisplaySize(node, mode) : { width: node.width, height: node.height, scale: 1 };

  return (
    <aside className={`inspector ${collapsed ? "is-collapsed" : ""}`}>
      <button type="button" className="inspector__header" onClick={onToggle} aria-expanded={!collapsed}>
        <span><Minimize2 size={15} />节点信息</span>
        <ChevronDown size={16} />
      </button>
      {!collapsed && (
        <div className="inspector__body">
          <div className="inspector__title"><strong>{node.title}</strong><span>{node.kind === "media" ? "媒体" : "固定节点"}</span></div>
          <dl>
            {isMedia && <><dt>原始尺寸</dt><dd>{formatDimensions(node.sourceWidth, node.sourceHeight)}</dd></>}
            <dt>画布展示</dt><dd>{formatDimensions(size.width, size.height)}</dd>
            <dt>展示比例</dt><dd>{Math.round(size.scale * 100)}%</dd>
          </dl>
          <p>{isMedia ? "仅改变画布展示，不改变源文件" : "两侧视图保持相同尺寸"}</p>
        </div>
      )}
    </aside>
  );
}
