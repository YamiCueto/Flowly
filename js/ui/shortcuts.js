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
                case '0': app.canvasManager.fitToScreen(); app.updateZoomDisplay(); e.preventDefault(); break;

                // Sprint 2: New shortcuts
                case 'g':
                    // Agrupar formas seleccionadas
                    if (app.canvasManager.selectedShapes.length >= 2) {
                        groupSelectedShapes(app);
                    }
                    e.preventDefault();
                    break;
                case 'l':
                    // Bloquear/Desbloquear formas
                    toggleLockSelected(app);
                    e.preventDefault();
                    break;
                case ']':
                    // Traer al frente
                    app.canvasManager.bringToFront();
                    e.preventDefault();
                    break;
                case '[':
                    // Enviar atrás
                    app.canvasManager.sendToBack();
                    e.preventDefault();
                    break;
            }
        }

        // Sprint 4: Alignment shortcuts (Ctrl+Shift+Key)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && app.alignmentManager) {
            switch (e.key.toLowerCase()) {
                case 'l': app.alignmentManager.alignLeft(); e.preventDefault(); break;
                case 'r': app.alignmentManager.alignRight(); e.preventDefault(); break;
                case 't': app.alignmentManager.alignTop(); e.preventDefault(); break;
                case 'b': app.alignmentManager.alignBottom(); e.preventDefault(); break;
                case 'h': app.alignmentManager.alignCenterHorizontal(); e.preventDefault(); break;
                case 'v': app.alignmentManager.alignCenterVertical(); e.preventDefault(); break;
                case 'd': app.alignmentManager.distributeHorizontal(); e.preventDefault(); break;
                case 'e': app.alignmentManager.distributeVertical(); e.preventDefault(); break;
                case 'f': app.canvasManager.fitToScreen(); app.updateZoomDisplay(); e.preventDefault(); break;
            }
        }

        // Zoom shortcuts
        if (e.key === '+' || e.key === '=') { app.canvasManager.zoomIn(); app.updateZoomDisplay(); e.preventDefault(); }
        else if (e.key === '-') { app.canvasManager.zoomOut(); app.updateZoomDisplay(); e.preventDefault(); }
    });
}

/**
 * Helper: Agrupar formas seleccionadas
 */
function groupSelectedShapes(app) {
    const selected = app.canvasManager.selectedShapes;
    if (selected.length < 2) return;

    const group = new Konva.Group({
        draggable: true
    });

    selected.forEach(shape => {
        const pos = shape.absolutePosition();
        shape.moveTo(group);
        shape.absolutePosition(pos);
    });

    app.canvasManager.mainLayer.add(group);
    app.canvasManager.clearSelection();
    app.canvasManager.selectShape(group);
    app.canvasManager.saveHistory();
}

/**
 * Helper: Bloquear/Desbloquear formas seleccionadas (con feedback visual)
 */
function toggleLockSelected(app) {
    const selected = app.canvasManager.selectedShapes;
    if (selected.length === 0) return;

    selected.forEach(shape => {
        const isLocked = shape.getAttr('locked') || false;
        const willBeLocked = !isLocked;
        shape.setAttr('locked', willBeLocked);
        shape.draggable(!willBeLocked);
        shape.opacity(willBeLocked ? 0.7 : 1);

        // Visual lock icon management
        if (willBeLocked) {
            if (!shape._lockIcon) {
                const box = shape.getClientRect({ relativeTo: app.canvasManager.mainLayer });
                const lockIcon = new Konva.Text({
                    text: '🔒',
                    fontSize: 16,
                    x: box.x + box.width / 2 - 8,
                    y: box.y - 24,
                    listening: false,
                    name: 'lock-icon'
                });
                app.canvasManager.mainLayer.add(lockIcon);
                shape._lockIcon = lockIcon;

                // Keep lock icon synced on drag/transform
                shape.on('dragmove.lock transform.lock', () => {
                    const b = shape.getClientRect({ relativeTo: app.canvasManager.mainLayer });
                    lockIcon.x(b.x + b.width / 2 - 8);
                    lockIcon.y(b.y - 24);
                    app.canvasManager.mainLayer.batchDraw();
                });
            }
        } else {
            // Remove lock icon
            if (shape._lockIcon) {
                try { shape._lockIcon.destroy(); } catch (e) { }
                shape._lockIcon = null;
                shape.off('dragmove.lock transform.lock');
            }
        }
    });

    app.canvasManager.mainLayer.draw();
    app.canvasManager.saveHistory();
}
