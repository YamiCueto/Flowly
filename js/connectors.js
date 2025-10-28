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
            options: {
                stroke: '#2c3e50',
                strokeWidth: 2,
                pointerLength: 10,
                pointerWidth: 10,
                ...options
            }
        };

        // Calculate connection points
        const startPoint = this.getConnectionPoint(shape1, shape2);
        const endPoint = this.getConnectionPoint(shape2, shape1);

        // Create arrow
        const arrow = new Konva.Arrow({
            points: [
                startPoint.x,
                startPoint.y,
                endPoint.x,
                endPoint.y
            ],
            ...connector.options,
            fill: connector.options.stroke,
            draggable: false
        });

        connector.arrow = arrow;
        this.connectors.push(connector);

        // Add to canvas
        this.canvasManager.addShape(arrow);

        // Move to back
        arrow.moveToBottom();

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

            connector.arrow.points([
                startPoint.x,
                startPoint.y,
                endPoint.x,
                endPoint.y
            ]);

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
            connector.arrow.setAttrs(options);
            this.canvasManager.mainLayer.draw();
        }
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
}
