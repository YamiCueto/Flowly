/**
 * Alignment Manager - Sprint 4
 * Handles automatic alignment and distribution of multiple shapes
 * Operates via keyboard shortcuts and context menu (no toolbar buttons)
 */

export class AlignmentManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.layer = canvasManager.mainLayer;
    }

    /**
     * Get all currently selected shapes
     * @returns {Array} Array of Konva shapes
     */
    getSelectedShapes() {
        const shapes = this.layer.find('.shape').filter(shape => shape.attrs.selected);
        return shapes.length > 1 ? shapes : [];
    }

    /**
     * Get bounding box of all selected shapes
     * @param {Array} shapes - Array of shapes
     * @returns {Object} {x, y, width, height, minX, maxX, minY, maxY}
     */
    getSelectionBounds(shapes) {
        if (shapes.length === 0) return null;

        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        shapes.forEach(shape => {
            const box = shape.getClientRect();
            minX = Math.min(minX, box.x);
            minY = Math.min(minY, box.y);
            maxX = Math.max(maxX, box.x + box.width);
            maxY = Math.max(maxY, box.y + box.height);
        });

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            minX, maxX, minY, maxY
        };
    }

    /**
     * Align shapes to the left edge
     */
    alignLeft() {
        const shapes = this.getSelectedShapes();
        if (shapes.length === 0) return;

        const bounds = this.getSelectionBounds(shapes);
        const targetX = bounds.minX;

        shapes.forEach(shape => {
            const box = shape.getClientRect();
            shape.x(shape.x() + (targetX - box.x));
        });

        this.canvasManager.saveHistory('Alineación izquierda');
        this.layer.batchDraw();
    }

    /**
     * Align shapes to the right edge
     */
    alignRight() {
        const shapes = this.getSelectedShapes();
        if (shapes.length === 0) return;

        const bounds = this.getSelectionBounds(shapes);
        const targetX = bounds.maxX;

        shapes.forEach(shape => {
            const box = shape.getClientRect();
            shape.x(shape.x() + (targetX - (box.x + box.width)));
        });

        this.canvasManager.saveHistory('Alineación derecha');
        this.layer.batchDraw();
    }

    /**
     * Align shapes to the top edge
     */
    alignTop() {
        const shapes = this.getSelectedShapes();
        if (shapes.length === 0) return;

        const bounds = this.getSelectionBounds(shapes);
        const targetY = bounds.minY;

        shapes.forEach(shape => {
            const box = shape.getClientRect();
            shape.y(shape.y() + (targetY - box.y));
        });

        this.canvasManager.saveHistory('Alineación superior');
        this.layer.batchDraw();
    }

    /**
     * Align shapes to the bottom edge
     */
    alignBottom() {
        const shapes = this.getSelectedShapes();
        if (shapes.length === 0) return;

        const bounds = this.getSelectionBounds(shapes);
        const targetY = bounds.maxY;

        shapes.forEach(shape => {
            const box = shape.getClientRect();
            shape.y(shape.y() + (targetY - (box.y + box.height)));
        });

        this.canvasManager.saveHistory('Alineación inferior');
        this.layer.batchDraw();
    }

    /**
     * Align shapes to horizontal center
     */
    alignCenterHorizontal() {
        const shapes = this.getSelectedShapes();
        if (shapes.length === 0) return;

        const bounds = this.getSelectionBounds(shapes);
        const centerX = bounds.x + bounds.width / 2;

        shapes.forEach(shape => {
            const box = shape.getClientRect();
            const shapeCenterX = box.x + box.width / 2;
            shape.x(shape.x() + (centerX - shapeCenterX));
        });

        this.canvasManager.saveHistory('Alineación centro horizontal');
        this.layer.batchDraw();
    }

    /**
     * Align shapes to vertical center
     */
    alignCenterVertical() {
        const shapes = this.getSelectedShapes();
        if (shapes.length === 0) return;

        const bounds = this.getSelectionBounds(shapes);
        const centerY = bounds.y + bounds.height / 2;

        shapes.forEach(shape => {
            const box = shape.getClientRect();
            const shapeCenterY = box.y + box.height / 2;
            shape.y(shape.y() + (centerY - shapeCenterY));
        });

        this.canvasManager.saveHistory('Alineación centro vertical');
        this.layer.batchDraw();
    }

    /**
     * Distribute shapes horizontally with equal spacing
     */
    distributeHorizontal() {
        const shapes = this.getSelectedShapes();
        if (shapes.length < 3) return; // Need at least 3 shapes to distribute

        // Sort shapes by X position
        const sortedShapes = shapes.sort((a, b) => {
            return a.getClientRect().x - b.getClientRect().x;
        });

        const bounds = this.getSelectionBounds(shapes);
        const firstBox = sortedShapes[0].getClientRect();
        const lastBox = sortedShapes[sortedShapes.length - 1].getClientRect();

        // Calculate total width of all shapes
        let totalShapeWidth = 0;
        sortedShapes.forEach(shape => {
            totalShapeWidth += shape.getClientRect().width;
        });

        // Calculate spacing
        const availableSpace = (lastBox.x + lastBox.width) - firstBox.x - totalShapeWidth;
        const spacing = availableSpace / (sortedShapes.length - 1);

        // Position shapes
        let currentX = firstBox.x;
        sortedShapes.forEach((shape, index) => {
            if (index === 0 || index === sortedShapes.length - 1) {
                return; // Keep first and last in place
            }
            const box = shape.getClientRect();
            currentX += sortedShapes[index - 1].getClientRect().width + spacing;
            shape.x(shape.x() + (currentX - box.x));
        });

        this.canvasManager.saveHistory('Distribución horizontal');
        this.layer.batchDraw();
    }

    /**
     * Distribute shapes vertically with equal spacing
     */
    distributeVertical() {
        const shapes = this.getSelectedShapes();
        if (shapes.length < 3) return; // Need at least 3 shapes to distribute

        // Sort shapes by Y position
        const sortedShapes = shapes.sort((a, b) => {
            return a.getClientRect().y - b.getClientRect().y;
        });

        const bounds = this.getSelectionBounds(shapes);
        const firstBox = sortedShapes[0].getClientRect();
        const lastBox = sortedShapes[sortedShapes.length - 1].getClientRect();

        // Calculate total height of all shapes
        let totalShapeHeight = 0;
        sortedShapes.forEach(shape => {
            totalShapeHeight += shape.getClientRect().height;
        });

        // Calculate spacing
        const availableSpace = (lastBox.y + lastBox.height) - firstBox.y - totalShapeHeight;
        const spacing = availableSpace / (sortedShapes.length - 1);

        // Position shapes
        let currentY = firstBox.y;
        sortedShapes.forEach((shape, index) => {
            if (index === 0 || index === sortedShapes.length - 1) {
                return; // Keep first and last in place
            }
            const box = shape.getClientRect();
            currentY += sortedShapes[index - 1].getClientRect().height + spacing;
            shape.y(shape.y() + (currentY - box.y));
        });

        this.canvasManager.saveHistory('Distribución vertical');
        this.layer.batchDraw();
    }

    /**
     * Match width of all shapes to the largest width
     */
    matchWidth() {
        const shapes = this.getSelectedShapes();
        if (shapes.length === 0) return;

        // Find largest width
        let maxWidth = 0;
        shapes.forEach(shape => {
            const box = shape.getClientRect();
            maxWidth = Math.max(maxWidth, box.width);
        });

        // Apply to all shapes
        shapes.forEach(shape => {
            const scaleX = maxWidth / shape.width();
            shape.scaleX(scaleX);
        });

        this.canvasManager.saveHistory('Igualar ancho');
        this.layer.batchDraw();
    }

    /**
     * Match height of all shapes to the largest height
     */
    matchHeight() {
        const shapes = this.getSelectedShapes();
        if (shapes.length === 0) return;

        // Find largest height
        let maxHeight = 0;
        shapes.forEach(shape => {
            const box = shape.getClientRect();
            maxHeight = Math.max(maxHeight, box.height);
        });

        // Apply to all shapes
        shapes.forEach(shape => {
            const scaleY = maxHeight / shape.height();
            shape.scaleY(scaleY);
        });

        this.canvasManager.saveHistory('Igualar alto');
        this.layer.batchDraw();
    }

    /**
     * Match both width and height to the largest dimensions
     */
    matchSize() {
        const shapes = this.getSelectedShapes();
        if (shapes.length === 0) return;

        // Find largest dimensions
        let maxWidth = 0;
        let maxHeight = 0;
        shapes.forEach(shape => {
            const box = shape.getClientRect();
            maxWidth = Math.max(maxWidth, box.width);
            maxHeight = Math.max(maxHeight, box.height);
        });

        // Apply to all shapes
        shapes.forEach(shape => {
            const scaleX = maxWidth / shape.width();
            const scaleY = maxHeight / shape.height();
            shape.scaleX(scaleX);
            shape.scaleY(scaleY);
        });

        this.canvasManager.saveHistory('Igualar tamaño');
        this.layer.batchDraw();
    }
}
