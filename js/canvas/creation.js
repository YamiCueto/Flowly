import { copyImpl, pasteImpl, createShapeFromDataImpl } from './creation.impl.js';

export function attachCreation(canvas) {
    // Prefer implementation functions; fall back to prototype when not available
    canvas.copy = () => copyImpl(canvas);
    canvas.paste = () => pasteImpl(canvas);
    canvas.createShapeFromData = (data) => createShapeFromDataImpl(canvas, data);
}
