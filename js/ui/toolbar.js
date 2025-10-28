// Toolbar wiring extracted from app.js
export function setupToolbar(app) {
    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tool = e.currentTarget.dataset.tool;
            app.selectTool(tool);
        });
    });

    // Action buttons
    document.getElementById('undo-btn').addEventListener('click', () => { app.canvasManager.undo(); });
    document.getElementById('redo-btn').addEventListener('click', () => { app.canvasManager.redo(); });

    document.getElementById('zoom-in-btn').addEventListener('click', () => { app.canvasManager.zoomIn(); app.updateZoomDisplay(); });
    document.getElementById('zoom-out-btn').addEventListener('click', () => { app.canvasManager.zoomOut(); app.updateZoomDisplay(); });
    document.getElementById('zoom-fit-btn').addEventListener('click', () => { app.canvasManager.fitToScreen(); app.updateZoomDisplay(); });

    document.getElementById('new-btn').addEventListener('click', () => { app.newProject(); });
    document.getElementById('save-btn').addEventListener('click', () => { app.saveProject(); });
    document.getElementById('load-btn').addEventListener('click', () => { app.openLoadModal(); });
    document.getElementById('export-btn').addEventListener('click', () => { app.openExportModal(); });
}
