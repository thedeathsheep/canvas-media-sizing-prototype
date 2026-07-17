import { useMemo, useState } from "react";
import { CanvasPane, Inspector, Toolbar } from "./components.jsx";
import { DEMO_NODES, INITIAL_CAMERA } from "./demoData.js";

export function App() {
  const [viewMode, setViewMode] = useState("compare");
  const [camera, setCamera] = useState(INITIAL_CAMERA);
  const [selectedId, setSelectedId] = useState("video-landscape");
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const selectedNode = useMemo(
    () => DEMO_NODES.find((node) => node.id === selectedId) ?? null,
    [selectedId],
  );

  const inactive = () => {};
  const paneProps = {
    camera,
    selectedId,
    onSelect: setSelectedId,
    onPointerDown: inactive,
    onPointerMove: inactive,
    onPointerUp: inactive,
    onWheel: inactive,
  };

  return (
    <div className="app-shell">
      <Toolbar
        viewMode={viewMode}
        zoom={Math.round(camera.scale * 100)}
        onViewModeChange={setViewMode}
        onZoomOut={inactive}
        onZoomIn={inactive}
        onReset={() => setCamera(INITIAL_CAMERA)}
      />
      <main className={`workspace workspace--${viewMode}`}>
        {(viewMode === "compare" || viewMode === "raw") && (
          <CanvasPane {...paneProps} mode="raw" />
        )}
        {(viewMode === "compare" || viewMode === "normalized") && (
          <CanvasPane {...paneProps} mode="normalized" />
        )}
      </main>
      <Inspector
        node={selectedNode}
        mode={viewMode === "raw" ? "raw" : "normalized"}
        collapsed={inspectorCollapsed}
        onToggle={() => setInspectorCollapsed((value) => !value)}
      />
      <div className="desktop-notice">建议使用 1280px 以上桌面视口</div>
    </div>
  );
}
