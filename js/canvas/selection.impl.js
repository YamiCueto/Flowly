export function makeShapeSelectableImpl(canvas, shape) {
    shape.on('click tap', (e) => {
        e.cancelBubble = true;
        if (e.evt.shiftKey) { canvas.addToSelection(shape); } else { canvas.selectShape(shape); }
    });

    shape.on('dragstart', () => { if (!canvas.selectedShapes.includes(shape)) canvas.selectShape(shape); });
    shape.on('dragmove', () => { if (canvas.snapToGrid) canvas.snapShapeToGrid(shape); });
    shape.on('dragend', () => { canvas.saveHistory(); });
    shape.on('transformend', () => { canvas.saveHistory(); });

    // Create anchors for connection UX
    canvas.createAnchorsForShape(shape);
}

export function selectShapeImpl(canvas, shape) {
    canvas.clearSelection();
    canvas.selectedShapes = [shape];
    canvas.transformer.nodes([shape]);
    canvas.transformLayer.draw();
    canvas.emit('selectionChanged', canvas.selectedShapes);
}

export function addToSelectionImpl(canvas, shape) {
    if (!canvas.selectedShapes.includes(shape)) {
        canvas.selectedShapes.push(shape);
        canvas.transformer.nodes(canvas.selectedShapes);
        canvas.transformLayer.draw();
        canvas.emit('selectionChanged', canvas.selectedShapes);
    }
}

export function clearSelectionImpl(canvas) {
    canvas.selectedShapes = [];
    canvas.transformer.nodes([]);
    canvas.transformLayer.draw();
    canvas.emit('selectionChanged', canvas.selectedShapes);
}

export function deleteSelectedImpl(canvas) {
    if (canvas.selectedShapes.length === 0) return;
    canvas.selectedShapes.forEach(shape => shape.destroy());
    clearSelectionImpl(canvas);
    canvas.mainLayer.draw();
    canvas.saveHistory();
}

export function bringToFrontImpl(canvas) {
    if (canvas.selectedShapes.length === 0) return;
    canvas.selectedShapes.forEach(shape => shape.moveToTop());
    canvas.mainLayer.draw();
    canvas.saveHistory();
}

export function sendToBackImpl(canvas) {
    if (canvas.selectedShapes.length === 0) return;
    canvas.selectedShapes.forEach(shape => shape.moveToBottom());
    canvas.mainLayer.draw();
    canvas.saveHistory();
}

export function updateSelectedPropertyImpl(canvas, property, value) {
    if (canvas.selectedShapes.length === 0) return;
    canvas.selectedShapes.forEach(shape => { shape.setAttr(property, value); });
    canvas.mainLayer.draw();
    canvas.saveHistory();
}

export function updateSelectedPositionImpl(canvas, property, value) {
    if (canvas.selectedShapes.length === 0) return;
    const shape = canvas.selectedShapes[0];
    switch(property) {
        case 'x': shape.x(value); break;
        case 'y': shape.y(value); break;
        case 'width': const newScaleX = value / shape.width(); shape.scaleX(newScaleX); break;
        case 'height': const newScaleY = value / shape.height(); shape.scaleY(newScaleY); break;
    }
    canvas.mainLayer.draw();
    canvas.transformer.forceUpdate();
    canvas.saveHistory();
}
