import { createAnchorsForShapeImpl, startConnectionFromAnchorImpl } from './anchors.impl.js';

export function attachAnchors(canvas) {
    canvas.createAnchorsForShape = (...args) => createAnchorsForShapeImpl(canvas, ...args);
    canvas.startConnectionFromAnchor = (...args) => startConnectionFromAnchorImpl(canvas, ...args);
}
