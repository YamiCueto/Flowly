export function attachInit(canvas) {
    const proto = Object.getPrototypeOf(canvas);
    // Bind core lifecycle methods to the instance so they're provided by this module
    if (typeof proto.init === 'function') canvas.init = proto.init.bind(canvas);
    if (typeof proto.drawGrid === 'function') canvas.drawGrid = proto.drawGrid.bind(canvas);
    if (typeof proto.setupStageEvents === 'function') canvas.setupStageEvents = proto.setupStageEvents.bind(canvas);
    if (typeof proto.handleResize === 'function') canvas.handleResize = proto.handleResize.bind(canvas);
}
