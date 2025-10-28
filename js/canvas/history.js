export function attachHistory(canvas) {
    const proto = Object.getPrototypeOf(canvas);
    const names = ['saveHistory','undo','redo','canUndo','canRedo'];
    names.forEach(n => {
        if (typeof proto[n] === 'function') canvas[n] = proto[n].bind(canvas);
    });
}
