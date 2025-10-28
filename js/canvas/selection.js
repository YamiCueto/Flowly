import {
    makeShapeSelectableImpl,
    selectShapeImpl,
    addToSelectionImpl,
    clearSelectionImpl,
    deleteSelectedImpl,
    bringToFrontImpl,
    sendToBackImpl,
    updateSelectedPropertyImpl,
    updateSelectedPositionImpl
} from './selection.impl.js';

export function attachSelection(canvas) {
    canvas.makeShapeSelectable = (shape) => makeShapeSelectableImpl(canvas, shape);
    canvas.selectShape = (shape) => selectShapeImpl(canvas, shape);
    canvas.addToSelection = (shape) => addToSelectionImpl(canvas, shape);
    canvas.clearSelection = () => clearSelectionImpl(canvas);
    canvas.deleteSelected = () => deleteSelectedImpl(canvas);
    canvas.bringToFront = () => bringToFrontImpl(canvas);
    canvas.sendToBack = () => sendToBackImpl(canvas);
    canvas.updateSelectedProperty = (p,v) => updateSelectedPropertyImpl(canvas, p, v);
    canvas.updateSelectedPosition = (p,v) => updateSelectedPositionImpl(canvas, p, v);
}
