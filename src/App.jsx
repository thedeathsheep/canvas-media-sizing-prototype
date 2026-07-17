import { useMemo, useRef, useState } from "react";
import { CanvasPane, Inspector, Toolbar } from "./components.jsx";
import { panCamera, zoomCameraAt } from "./cameraMath.js";
import { DEMO_NODES, INITIAL_CAMERA } from "./demoData.js";

export function App() {
  const [viewMode, setViewMode] = useState("compare");
  const [camera, setCamera] = useState(INITIAL_CAMERA);
  const [selectedId, setSelectedId] = useState("video-landscape");
  const [inspectorCollapsed, setInspectorCollapsed] = useState(true);
  const dragRef = useRef(null);
  const selectedNode = useMemo(
    () => DEMO_NODES.find((node) => node.id === selectedId) ?? null,
    [selectedId],
  );

  const resetView = () => setCamera(INITIAL_CAMERA);
  const zoomBy = (factor, point = { x: 480, y: 360 }) => {
    setCamera((current) => zoomCameraAt(current, current.scale * factor, point));
  };
  const panBy = (dx, dy) => {
    setCamera((current) => panCamera(current, dx, dy));
  };
  const handlePointerDown = (event) => {
    if (event.target.closest(".canvas-node, .canvas-hint")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };
  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    panBy(event.clientX - drag.x, event.clientY - drag.y);
    dragRef.current = { ...drag, x: event.clientX, y: event.clientY };
  };
  const handlePointerUp = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };
  const handleWheel = (event) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    zoomBy(event.deltaY < 0 ? 1.1 : 1 / 1.1, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };
  const paneProps = {
    camera,
    selectedId,
    onSelect: setSelectedId,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onWheel: handleWheel,
  };

  return (
    <div className="app-shell">
      <Toolbar
        viewMode={viewMode}
        zoom={Math.round(camera.scale * 100)}
        onViewModeChange={setViewMode}
        onZoomOut={() => zoomBy(1 / 1.1)}
        onZoomIn={() => zoomBy(1.1)}
        onReset={resetView}
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
