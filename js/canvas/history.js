import { saveHistoryImpl, undoImpl, redoImpl, canUndoImpl, canRedoImpl } from './history.impl.js';

export function attachHistory(canvas) {
    canvas.saveHistory = () => saveHistoryImpl(canvas);
    canvas.undo = () => undoImpl(canvas);
    canvas.redo = () => redoImpl(canvas);
    canvas.canUndo = () => canUndoImpl(canvas);
    canvas.canRedo = () => canRedoImpl(canvas);
}
