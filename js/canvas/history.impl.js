export function saveHistoryImpl(canvas) {
    // Remove any history after current step
    canvas.history = canvas.history.slice(0, canvas.historyStep + 1);

    // Add current state
    const state = canvas.toJSON();
    canvas.history.push(state);

    // Limit history size
    if (canvas.history.length > canvas.maxHistory) {
        canvas.history.shift();
    } else {
        canvas.historyStep++;
    }

    canvas.emit('historyChanged');
}

export function undoImpl(canvas) {
    if (!canUndoImpl(canvas)) return;

    canvas.historyStep--;
    canvas.loadFromJSON(canvas.history[canvas.historyStep], false);
    canvas.emit('historyChanged');
}

export function redoImpl(canvas) {
    if (!canRedoImpl(canvas)) return;

    canvas.historyStep++;
    canvas.loadFromJSON(canvas.history[canvas.historyStep], false);
    canvas.emit('historyChanged');
}

export function canUndoImpl(canvas) {
    return canvas.historyStep > 0;
}

export function canRedoImpl(canvas) {
    return canvas.historyStep < canvas.history.length - 1;
}
