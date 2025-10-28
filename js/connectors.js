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
        const connector = {
            id: Date.now().toString(),
            startShape: shape1,
            endShape: shape2,
            arrow: null,
            type: options.type || 'arrow', // 'arrow' | 'line' | 'bezier'
            options: {
                stroke: '#2c3e50',
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
            // line or bezier (use Konva.Line with tension for bezier-like curve)
            node = new Konva.Line({
                points: [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
                stroke: connector.options.stroke,
                strokeWidth: connector.options.strokeWidth,
                dash: connector.options.dash || [],
                tension: connector.type === 'bezier' ? connector.options.curvature || 0.5 : 0,
                lineCap: 'round',
                lineJoin: 'round',
                listening: true
            });
            // For lines, we may optionally add arrowhead later; omitted for simplicity
        }

        connector.arrow = node;
        this.connectors.push(connector);

        // Add to canvas
        this.canvasManager.addShape(node);

        // Move to bottom (under shapes)
        node.moveToBottom();

        // Setup update listeners
        this.setupConnectorListeners(connector);

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

            if (connector.arrow && typeof connector.arrow.points === 'function') {
                connector.arrow.points([
                    startPoint.x,
                    startPoint.y,
                    endPoint.x,
                    endPoint.y
                ]);
            }

            this.canvasManager.mainLayer.draw();
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
            connector.arrow.destroy();
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
                    newNode = new Konva.Line({
                        points: [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
                        stroke: connector.options.stroke,
                        strokeWidth: connector.options.strokeWidth,
                        dash: connector.options.dash || [],
                        tension: newType === 'bezier' ? connector.options.curvature || 0.5 : 0,
                        lineCap: 'round',
                        lineJoin: 'round',
                        listening: true
                    });
                }

                // Replace node on canvas
                try { oldNode.destroy(); } catch (e) {}
                connector.arrow = newNode;
                this.canvasManager.addShape(newNode);
                newNode.moveToBottom();
                // Rewire listeners by calling setupConnectorListeners again
                this.setupConnectorListeners(connector);
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
                        } catch (e) {}
                    }
                    // Bezier curvature
                    if (connector.type === 'bezier' || connector.type === 'line') {
                        try {
                            if (typeof connector.arrow.tension === 'function') {
                                connector.arrow.tension(connector.options.curvature || 0);
                            } else if ('tension' in connector.arrow.attrs) {
                                connector.arrow.setAttrs({ tension: connector.options.curvature || 0 });
                            }
                        } catch (e) {}
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
     * Export connectors data
     */
    toJSON() {
        return this.connectors.map(connector => ({
            id: connector.id,
            startShapeId: connector.startShape.id(),
            endShapeId: connector.endShape.id(),
            options: connector.options
        }));
    }

    /**
     * Load connectors from data
     */
    fromJSON(data, shapes) {
        // Clear existing connectors
        this.connectors.forEach(c => c.arrow.destroy());
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
            try { c.arrow.destroy(); } catch (e) { /* ignore */ }
        });
        this.connectors = [];
        if (this.canvasManager && this.canvasManager.mainLayer) {
            this.canvasManager.mainLayer.draw();
        }
    }
}
