export function createAnchorsForShapeImpl(canvas, shape) {
    try {
        if (!canvas.transformLayer) return;

        // Avoid recreating anchors
        if (shape._anchors && shape._anchors.length > 0) return;

        const anchors = [];

        const addAnchor = (x, y, idx) => {
            const anchor = new Konva.Circle({
                x,
                y,
                radius: canvas.anchorSize / 2,
                fill: canvas.anchorFill,
                stroke: canvas.anchorStroke,
                strokeWidth: 1,
                visible: false,
                listening: true,
                name: 'anchor',
                draggable: false
            });

            anchor.on('mousedown touchstart', (e) => {
                e.cancelBubble = true;
                startConnectionFromAnchorImpl(canvas, anchor, shape);
            });

            anchor.on('mouseenter', () => { document.body.style.cursor = 'crosshair'; });
            anchor.on('mouseleave', () => { document.body.style.cursor = 'default'; });

            canvas.transformLayer.add(anchor);
            anchors.push(anchor);
        };

        const rect = shape.getClientRect({ relativeTo: canvas.stage });
        const left = rect.x;
        const right = rect.x + rect.width;
        const top = rect.y;
        const bottom = rect.y + rect.height;
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;

        addAnchor(left, top, 'top-left');
        addAnchor(cx, top, 'top-center');
        addAnchor(right, top, 'top-right');
        addAnchor(left, cy, 'middle-left');
        addAnchor(right, cy, 'middle-right');
        addAnchor(left, bottom, 'bottom-left');
        addAnchor(cx, bottom, 'bottom-center');
        addAnchor(right, bottom, 'bottom-right');

        shape._anchors = anchors;

        const updateAnchors = () => {
            const r = shape.getClientRect({ relativeTo: canvas.stage });
            const l = r.x;
            const rr = r.x + r.width;
            const t = r.y;
            const b = r.y + r.height;
            const mxc = r.x + r.width / 2;
            const myc = r.y + r.height / 2;

            const positions = [
                [l, t],
                [mxc, t],
                [rr, t],
                [l, myc],
                [rr, myc],
                [l, b],
                [mxc, b],
                [rr, b]
            ];

            shape._anchors.forEach((a, i) => {
                const pos = positions[i];
                a.position({ x: pos[0], y: pos[1] });
            });
            canvas.transformLayer.batchDraw();
        };

        shape.on('dragmove transform move resize change', updateAnchors);
        shape.on('mouseenter', () => { shape._anchors.forEach(a => a.visible(true)); canvas.transformLayer.batchDraw(); });
        shape.on('mouseleave', () => {
            if (canvas._connecting) return;
            shape._anchors.forEach(a => a.visible(false));
            canvas.transformLayer.batchDraw();
        });
    } catch (e) {
        console.warn('Failed to create anchors for shape', e);
    }
}

export function startConnectionFromAnchorImpl(canvas, anchor, shape) {
    if (canvas._connecting) return;

    const startPos = anchor.getAbsolutePosition();
    canvas._connecting = { startShape: shape, startAnchor: anchor, tempLine: null, highlightedAnchor: null };

    const line = new Konva.Line({ points: [startPos.x, startPos.y, startPos.x, startPos.y], stroke: '#2c3e50', strokeWidth: 2, dash: [], listening: false });
    canvas._connecting.tempLine = line;
    canvas.transformLayer.add(line);
    canvas.transformLayer.batchDraw();

    const onMove = (evt) => {
        const pos = canvas.stage.getPointerPosition();
        if (!pos) return;
        line.points([startPos.x, startPos.y, pos.x, pos.y]);

        let nearest = null;
        let minDist = Infinity;
        const threshold = canvas.anchorSize * 4;

        canvas.mainLayer.getChildren().forEach(node => {
            const s = node;
            if (!s._anchors) return;
            s._anchors.forEach(a => {
                if (a === anchor) return;
                const ap = a.getAbsolutePosition();
                const dx = ap.x - pos.x;
                const dy = ap.y - pos.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < minDist) { minDist = d; nearest = { anchor: a, shape: s, dist: d }; }
            });
        });

        if (canvas._connecting.highlightedAnchor && (!nearest || nearest.dist > threshold)) {
            canvas._connecting.highlightedAnchor.strokeWidth(1);
            canvas._connecting.highlightedAnchor.radius(canvas.anchorSize / 2);
            canvas._connecting.highlightedAnchor = null;
        }

        if (nearest && nearest.dist <= threshold) {
            if (canvas._connecting.highlightedAnchor !== nearest.anchor) {
                if (canvas._connecting.highlightedAnchor) { canvas._connecting.highlightedAnchor.strokeWidth(1); canvas._connecting.highlightedAnchor.radius(canvas.anchorSize / 2); }
                nearest.anchor.strokeWidth(2);
                nearest.anchor.radius(canvas.anchorHoverSize / 2);
                canvas._connecting.highlightedAnchor = nearest.anchor;
            }
        }

        canvas.transformLayer.batchDraw();
    };

    const onUp = (evt) => {
        const pos = canvas.stage.getPointerPosition();
        if (!pos) return cleanup();

        let nearest = null; let minDist = Infinity;
        canvas.mainLayer.getChildren().forEach(node => {
            const s = node; if (!s._anchors) return; s._anchors.forEach(a => { if (a === anchor) return; const ap = a.getAbsolutePosition(); const dx = ap.x - pos.x; const dy = ap.y - pos.y; const d = Math.sqrt(dx*dx+dy*dy); if (d < minDist) { minDist = d; nearest = { anchor: a, shape: s, dist: d }; } });
        });

        const threshold = canvas.anchorSize * 4;
        if (nearest && nearest.dist <= threshold && nearest.shape !== shape) {
            if (canvas.connectorsManager) {
                canvas.connectorsManager.createConnector(shape, nearest.shape, { type: 'elbow' });
            } else { console.warn('ConnectorsManager not available on canvasManager'); }
        }

        cleanup();
    };

    const cleanup = () => {
        try { if (canvas._connecting) { if (canvas._connecting.tempLine) canvas._connecting.tempLine.destroy(); if (canvas._connecting.highlightedAnchor) { canvas._connecting.highlightedAnchor.strokeWidth(1); canvas._connecting.highlightedAnchor.radius(canvas.anchorSize/2); } } } catch (e) { }
        canvas._connecting = null;
        canvas.stage.off('mousemove touchmove', onMove);
        canvas.stage.off('mouseup touchend', onUp);
        canvas.transformLayer.batchDraw();
    };

    canvas.stage.on('mousemove touchmove', onMove);
    canvas.stage.on('mouseup touchend', onUp);
}
