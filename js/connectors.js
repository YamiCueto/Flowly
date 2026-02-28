/**
 * FLOWLY - Connectors Manager
 * Handles connections between shapes (Planned for Phase 2)
 * This is a placeholder for future connector functionality
 */

export class ConnectorsManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.connectors = [];
        this.connectionMode = false;
        this.startShape = null;
    }

    /**
     * Enable connection mode
     */
    enableConnectionMode() {
        this.connectionMode = true;
        this.startShape = null;
    }

    /**
     * Disable connection mode
     */
    disableConnectionMode() {
        this.connectionMode = false;
        this.startShape = null;
    }

    /**
     * Create a connector between two shapes
     */
    createConnector(shape1, shape2, options = {}) {
        // Detect theme for connector color
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const defaultStroke = isDarkMode ? '#60A5FA' : '#2c3e50';

        const connector = {
            id: Date.now().toString(),
            startShape: shape1,
            endShape: shape2,
            arrow: null,
            type: options.type || 'arrow', // 'arrow' | 'line' | 'bezier'
            options: {
                stroke: defaultStroke,
                strokeWidth: 2,
                pointerLength: 10,
                pointerWidth: 10,
                dash: [],
                curvature: 0.5,
                ...options
            }
        };

        // Calculate connection points
        const startPoint = this.getConnectionPoint(shape1, shape2);
        const endPoint = this.getConnectionPoint(shape2, shape1);

        // Create the visual node according to type
        let node;
        if (connector.type === 'arrow') {
            node = new Konva.Arrow({
                points: [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
                stroke: connector.options.stroke,
                strokeWidth: connector.options.strokeWidth,
                pointerLength: connector.options.pointerLength,
                pointerWidth: connector.options.pointerWidth,
                fill: connector.options.stroke,
                dash: connector.options.dash || [],
                listening: true
            });
        } else {
            if (connector.type === 'line' || connector.type === 'elbow') {
                const points = (connector.type === 'elbow') ? this.computeElbowPoints(startPoint, endPoint) : [startPoint.x, startPoint.y, endPoint.x, endPoint.y];
                node = new Konva.Line({
                    points: points,
                    stroke: connector.options.stroke,
                    strokeWidth: connector.options.strokeWidth,
                    dash: connector.options.dash || [],
                    tension: connector.type === 'line' ? 0 : 0,
                    lineCap: 'round',
                    lineJoin: 'round',
                    listening: true
                });
            } else {
                // Bezier: use Konva.Shape with custom sceneFunc to draw cubic bezier
                // Determine control points (absolute coords) - allow provided controlPoints
                const start = startPoint;
                const end = endPoint;
                let cp1 = connector.options.controlPoints && connector.options.controlPoints[0];
                let cp2 = connector.options.controlPoints && connector.options.controlPoints[1];
                if (!cp1 || !cp2) {
                    // default control points: quarter and three-quarters points offset perpendicular
                    const mx = (start.x + end.x) / 2;
                    const my = (start.y + end.y) / 2;
                    const dx = end.x - start.x;
                    const dy = end.y - start.y;
                    const nx = -dy;
                    const ny = dx;
                    const len = Math.sqrt(nx * nx + ny * ny) || 1;
                    const ux = nx / len;
                    const uy = ny / len;
                    const offset = Math.min(100, Math.max(30, Math.sqrt(dx * dx + dy * dy) / 4));
                    cp1 = { x: start.x + dx * 0.25 + ux * offset, y: start.y + dy * 0.25 + uy * offset };
                    cp2 = { x: start.x + dx * 0.75 + ux * offset, y: start.y + dy * 0.75 + uy * offset };
                    connector.options.controlPoints = [cp1, cp2];
                }

                node = new Konva.Shape({
                    sceneFunc: function (ctx, shape) {
                        const b = shape._bezier || {};
                        const s = b.startPoint || { x: 0, y: 0 };
                        const e = b.endPoint || { x: 0, y: 0 };
                        const c1 = b.cp1 || s;
                        const c2 = b.cp2 || e;
                        ctx.beginPath();
                        ctx.moveTo(s.x, s.y);
                        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, e.x, e.y);
                        ctx.strokeShape(shape);
                    },
                    stroke: connector.options.stroke,
                    strokeWidth: connector.options.strokeWidth,
                    dash: connector.options.dash || [],
                    listening: true
                });
                // store refs to control points data so update function can use them
                node._bezier = { startPoint: start, endPoint: end, cp1: cp1, cp2: cp2 };
            }
        }

        connector.arrow = node;
        this.connectors.push(connector);

        // Add visual node directly to mainLayer (don't route through addShape which makes
        // the node selectable/draggable and creates anchors for it). Connectors should
        // be non-draggable visual elements managed by ConnectorsManager.
        try {
            if (this.canvasManager && this.canvasManager.mainLayer) {
                this.canvasManager.mainLayer.add(node);
                node.moveToBottom();
                this.canvasManager.mainLayer.draw();
            }
        } catch (e) {
            console.warn('Failed to add connector node to mainLayer', e);
        }

        // Setup update listeners
        this.setupConnectorListeners(connector);

        // If bezier, create draggable control handles
        if (connector.type === 'bezier') {
            this._createBezierHandles(connector);
        }

        return connector;
    }

    /**
     * Get optimal connection point between two shapes
     */
    getConnectionPoint(fromShape, toShape) {
        const fromBox = fromShape.getClientRect();
        const toBox = toShape.getClientRect();

        const fromCenter = {
            x: fromBox.x + fromBox.width / 2,
            y: fromBox.y + fromBox.height / 2
        };

        const toCenter = {
            x: toBox.x + toBox.width / 2,
            y: toBox.y + toBox.height / 2
        };

        // Calculate angle
        const angle = Math.atan2(
            toCenter.y - fromCenter.y,
            toCenter.x - fromCenter.x
        );

        // Determine which edge to connect to
        const absAngle = Math.abs(angle);
        let point = { ...fromCenter };

        if (absAngle < Math.PI / 4) {
            // Right edge
            point.x = fromBox.x + fromBox.width;
        } else if (absAngle > (3 * Math.PI) / 4) {
            // Left edge
            point.x = fromBox.x;
        } else if (angle > 0) {
            // Bottom edge
            point.y = fromBox.y + fromBox.height;
        } else {
            // Top edge
            point.y = fromBox.y;
        }

        return point;
    }

    /**
     * Compute orthogonal elbow points between two points.
     * Returns a flat array of points for Konva.Line: [x1,y1,x2,y2,...]
     */
    computeElbowPoints(startPoint, endPoint) {
        // Simple two-bend elbow: horizontal then vertical via middle X
        const sx = startPoint.x;
        const sy = startPoint.y;
        const ex = endPoint.x;
        const ey = endPoint.y;

        // If points are nearly aligned, fallback to straight line
        if (Math.abs(sx - ex) < 2 || Math.abs(sy - ey) < 2) {
            return [sx, sy, ex, ey];
        }

        const midX = Math.round((sx + ex) / 2);
        // Path: start -> (midX, start.y) -> (midX, end.y) -> end
        return [sx, sy, midX, sy, midX, ey, ex, ey];
    }

    /**
     * Setup listeners to update connector when shapes move
     */
    setupConnectorListeners(connector) {
        const updateConnector = () => {
            const startPoint = this.getConnectionPoint(
                connector.startShape,
                connector.endShape
            );
            const endPoint = this.getConnectionPoint(
                connector.endShape,
                connector.startShape
            );

            if (connector.type === 'bezier' && connector.arrow && connector.arrow._bezier) {
                // Update bezier endpoints
                connector.arrow._bezier.startPoint = startPoint;
                connector.arrow._bezier.endPoint = endPoint;
                // If control points stored in options, keep them; otherwise keep existing
                if (connector.options.controlPoints && connector.options.controlPoints.length === 2) {
                    connector.arrow._bezier.cp1 = connector.options.controlPoints[0];
                    connector.arrow._bezier.cp2 = connector.options.controlPoints[1];
                }

                // Update handles positions if present
                if (connector._handles && connector._handles.length === 2) {
                    try {
                        connector._handles[0].position(connector.arrow._bezier.cp1);
                        connector._handles[1].position(connector.arrow._bezier.cp2);
                    } catch (e) { }
                }
            } else if (connector.arrow && typeof connector.arrow.points === 'function') {
                if (connector.type === 'elbow') {
                    try {
                        const pts = this.computeElbowPoints(startPoint, endPoint);
                        connector.arrow.points(pts);
                    } catch (e) {
                        connector.arrow.points([
                            startPoint.x,
                            startPoint.y,
                            endPoint.x,
                            endPoint.y
                        ]);
                    }
                } else {
                    connector.arrow.points([
                        startPoint.x,
                        startPoint.y,
                        endPoint.x,
                        endPoint.y
                    ]);
                }
            }

            this.canvasManager.mainLayer.draw();
            try { this.canvasManager.transformLayer && this.canvasManager.transformLayer.batchDraw(); } catch (e) { }
        };

        connector.startShape.on('dragmove', updateConnector);
        connector.endShape.on('dragmove', updateConnector);
        connector.startShape.on('transform', updateConnector);
        connector.endShape.on('transform', updateConnector);
    }

    /**
     * Remove a connector
     */
    removeConnector(connectorId) {
        const index = this.connectors.findIndex(c => c.id === connectorId);
        if (index !== -1) {
            const connector = this.connectors[index];
            // destroy bezier handles if any
            try { this._destroyBezierHandles(connector); } catch (e) { }
            try { connector.arrow.destroy(); } catch (e) { }
            this.connectors.splice(index, 1);
            this.canvasManager.mainLayer.draw();
        }
    }

    /**
     * Remove all connectors attached to a shape
     */
    removeConnectorsForShape(shape) {
        const toRemove = this.connectors.filter(
            c => c.startShape === shape || c.endShape === shape
        );

        toRemove.forEach(connector => {
            this.removeConnector(connector.id);
        });
    }

    /**
     * Get all connectors
     */
    getConnectors() {
        return this.connectors;
    }

    /**
     * Update connector style
     */
    updateConnectorStyle(connectorId, options) {
        const connector = this.connectors.find(c => c.id === connectorId);
        if (connector) {
            // Merge stored options
            connector.options = { ...connector.options, ...options };

            // If type changed, recreate visual node
            if (options.type && options.type !== connector.type) {
                const oldNode = connector.arrow;
                // destroy any existing bezier handles before replacing visual
                try { this._destroyBezierHandles(connector); } catch (e) { }
                const newType = options.type;
                connector.type = newType;

                // create new node similar to createConnector's logic
                const startPoint = this.getConnectionPoint(connector.startShape, connector.endShape);
                const endPoint = this.getConnectionPoint(connector.endShape, connector.startShape);
                let newNode;
                if (newType === 'arrow') {
                    newNode = new Konva.Arrow({
                        points: [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
                        stroke: connector.options.stroke,
                        strokeWidth: connector.options.strokeWidth,
                        pointerLength: connector.options.pointerLength,
                        pointerWidth: connector.options.pointerWidth,
                        fill: connector.options.stroke,
                        dash: connector.options.dash || [],
                        listening: true
                    });
                } else {
                    // Calculate points based on type
                    let points;
                    if (newType === 'elbow') {
                        points = this.computeElbowPoints(startPoint, endPoint);
                    } else {
                        points = [startPoint.x, startPoint.y, endPoint.x, endPoint.y];
                    }

                    newNode = new Konva.Line({
                        points: points,
                        stroke: connector.options.stroke,
                        strokeWidth: connector.options.strokeWidth,
                        dash: connector.options.dash || [],
                        tension: newType === 'bezier' ? connector.options.curvature || 0.5 : 0,
                        lineCap: 'round',
                        lineJoin: 'round',
                        listening: true
                    });
                }

                // Replace node on canvas (add directly to mainLayer so it doesn't become selectable)
                try { oldNode.destroy(); } catch (e) { }
                connector.arrow = newNode;
                try {
                    if (this.canvasManager && this.canvasManager.mainLayer) {
                        this.canvasManager.mainLayer.add(newNode);
                        newNode.moveToBottom();
                        this.canvasManager.mainLayer.draw();
                    }
                } catch (e) {
                    console.warn('Failed to add replacement connector node to mainLayer', e);
                }
                // Rewire listeners by calling setupConnectorListeners again
                this.setupConnectorListeners(connector);
                // If new type is bezier, create handles
                if (connector.type === 'bezier') {
                    try { this._createBezierHandles(connector); } catch (e) { }
                }
            } else {
                // Simple attribute update
                if (connector.arrow && typeof connector.arrow.setAttrs === 'function') {
                    connector.arrow.setAttrs({
                        stroke: connector.options.stroke,
                        strokeWidth: connector.options.strokeWidth,
                        dash: connector.options.dash || []
                    });
                    // Arrow-specific
                    if (connector.type === 'arrow') {
                        try {
                            connector.arrow.pointerLength(connector.options.pointerLength || 10);
                            connector.arrow.pointerWidth(connector.options.pointerWidth || 10);
                            connector.arrow.fill(connector.options.stroke);
                        } catch (e) { }
                    }
                    // Bezier curvature or update bezier control points
                    if (connector.type === 'bezier') {
                        // ensure node._bezier reflects stored controlPoints
                        try {
                            if (connector.arrow && connector.arrow._bezier) {
                                if (connector.options.controlPoints && connector.options.controlPoints.length === 2) {
                                    connector.arrow._bezier.cp1 = connector.options.controlPoints[0];
                                    connector.arrow._bezier.cp2 = connector.options.controlPoints[1];
                                }
                            }
                        } catch (e) { }
                    }
                    if (connector.type === 'bezier' || connector.type === 'line' || connector.type === 'elbow') {
                        // If elbow type, recompute points
                        if (connector.type === 'elbow') {
                            try {
                                const startPoint = this.getConnectionPoint(connector.startShape, connector.endShape);
                                const endPoint = this.getConnectionPoint(connector.endShape, connector.startShape);
                                const pts = this.computeElbowPoints(startPoint, endPoint);
                                if (connector.arrow && typeof connector.arrow.points === 'function') {
                                    connector.arrow.points(pts);
                                }
                            } catch (e) { }
                        }
                        try {
                            if (typeof connector.arrow.tension === 'function') {
                                connector.arrow.tension(connector.options.curvature || 0);
                            } else if ('tension' in connector.arrow.attrs) {
                                connector.arrow.setAttrs({ tension: connector.options.curvature || 0 });
                            }
                        } catch (e) { }
                    }
                }
            }

            this.canvasManager.mainLayer.draw();
        }
    }

    /**
     * Find a connector by its visual node (arrow/line)
     */
    findConnectorByArrow(node) {
        return this.connectors.find(c => c.arrow === node) || null;
    }

    /**
     * Create draggable bezier control handles for a connector
     */
    _createBezierHandles(connector) {
        try {
            if (!this.canvasManager) return;
            const layer = this.canvasManager.transformLayer || this.canvasManager.mainLayer;
            if (!layer) return;
            // destroy existing
            this._destroyBezierHandles(connector);

            const node = connector.arrow;
            const cp = connector.options.controlPoints || (node && node._bezier && [node._bezier.cp1, node._bezier.cp2]) || [{ x: 0, y: 0 }, { x: 0, y: 0 }];

            const makeHandle = (pt, idx) => {
                const h = new Konva.Circle({
                    x: pt.x,
                    y: pt.y,
                    radius: 6,
                    fill: '#ffffff',
                    stroke: this.canvasManager.anchorStroke || '#3498db',
                    strokeWidth: 2,
                    draggable: true,
                    name: 'bezier-handle',
                    listening: true
                });

                h.on('dragmove', () => {
                    const p = h.position();
                    // update connector options and node
                    connector.options.controlPoints = connector.options.controlPoints || [{}, {}];
                    connector.options.controlPoints[idx] = { x: p.x, y: p.y };
                    if (node && node._bezier) {
                        if (idx === 0) node._bezier.cp1 = connector.options.controlPoints[0];
                        else node._bezier.cp2 = connector.options.controlPoints[1];
                    }
                    try { this.canvasManager.mainLayer.draw(); } catch (e) { }
                });

                layer.add(h);
                return h;
            };

            const h1 = makeHandle(cp[0], 0);
            const h2 = makeHandle(cp[1], 1);

            connector._handles = [h1, h2];
            try { layer.batchDraw(); } catch (e) { }
        } catch (e) {
            console.warn('Failed to create bezier handles', e);
        }
    }

    /**
     * Destroy bezier handles for a connector
     */
    _destroyBezierHandles(connector) {
        if (!connector || !connector._handles) return;
        try {
            connector._handles.forEach(h => {
                try { h.destroy(); } catch (e) { }
            });
        } catch (e) { }
        connector._handles = null;
        try { this.canvasManager.transformLayer && this.canvasManager.transformLayer.batchDraw(); } catch (e) { }
    }

    /**
     * Export connectors data
     */
    toJSON() {
        return this.connectors.map(connector => ({
            id: connector.id,
            startShapeId: connector.startShape.id(),
            endShapeId: connector.endShape.id(),
            type: connector.type,
            options: { ...connector.options } // label is inside options
        }));
    }

    /**
     * Load connectors from data
     */
    fromJSON(data, shapes) {
        // Clear existing connectors (destroy arrows and any bezier handles)
        this.connectors.forEach(c => {
            try { this._destroyBezierHandles(c); } catch (e) { }
            try { c.arrow && c.arrow.destroy(); } catch (e) { }
        });
        this.connectors = [];

        // Recreate connectors
        data.forEach(connectorData => {
            const startShape = shapes.find(s => s.id() === connectorData.startShapeId);
            const endShape = shapes.find(s => s.id() === connectorData.endShapeId);

            if (startShape && endShape) {
                this.createConnector(startShape, endShape, connectorData.options);
            }
        });
    }

    /**
     * Clear all connectors
     */
    clearAll() {
        this.connectors.forEach(c => {
            try { this._destroyBezierHandles(c); } catch (e) { }
            try { c.arrow.destroy(); } catch (e) { /* ignore */ }
        });
        this.connectors = [];
        if (this.canvasManager && this.canvasManager.mainLayer) {
            this.canvasManager.mainLayer.draw();
        }
    }
}
