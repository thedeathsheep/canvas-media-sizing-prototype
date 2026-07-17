export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 2;

export function clampZoom(scale) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
}

export function panCamera(camera, dx, dy) {
  return {
    ...camera,
    x: camera.x + dx,
    y: camera.y + dy,
  };
}

export function zoomCameraAt(camera, requestedScale, point) {
  const scale = clampZoom(requestedScale);
  const ratio = scale / camera.scale;

  return {
    x: point.x - (point.x - camera.x) * ratio,
    y: point.y - (point.y - camera.y) * ratio,
    scale,
  };
}
