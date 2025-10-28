// Keyboard shortcuts wiring
export function setupKeyboardShortcuts(app) {
    document.addEventListener('keydown', (e) => {
        // Ignore if typing in input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Tool shortcuts
        if (!e.ctrlKey && !e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'v': app.selectTool('select'); break;
                case 'r': app.selectTool('rectangle'); break;
                case 'c': app.selectTool('circle'); break;
                case 'l': app.selectTool('line'); break;
                case 'a': app.selectTool('arrow'); break;
                case 't': app.selectTool('text'); break;
                case 'h': app.selectTool('pan'); break;
                case 'delete':
                case 'backspace':
                    app.canvasManager.deleteSelected();
                    e.preventDefault();
                    break;
            }
        }

        // Ctrl/Cmd shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    if (e.shiftKey) app.canvasManager.redo(); else app.canvasManager.undo();
                    e.preventDefault();
                    break;
                case 'y': app.canvasManager.redo(); e.preventDefault(); break;
                case 'c': app.canvasManager.copy(); e.preventDefault(); break;
                case 'v': app.canvasManager.paste(); e.preventDefault(); break;
                case 's': app.saveProject(); e.preventDefault(); break;
                case 'o': app.openLoadModal(); e.preventDefault(); break;
                case 'n': app.newProject(); e.preventDefault(); break;
            }
        }

        // Zoom shortcuts
        if (e.key === '+' || e.key === '=') { app.canvasManager.zoomIn(); app.updateZoomDisplay(); e.preventDefault(); }
        else if (e.key === '-') { app.canvasManager.zoomOut(); app.updateZoomDisplay(); e.preventDefault(); }
    });
}
