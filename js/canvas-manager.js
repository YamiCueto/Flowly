/**
 * FLOWLY - Canvas Manager
 * Manages the Konva stage, layers, and shape operations
 */

export class CanvasManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.stage = null;
        this.gridLayer = null;
        this.mainLayer = null;
        this.transformLayer = null;
        
        // Settings
        this.gridSize = 20;
        this.gridVisible = true;
        this.snapToGrid = true;
        this.zoom = 1;
        
        // State
        this.selectedShapes = [];
        this.transformer = null;
        this.clipboard = null;
        
        // History
        this.history = [];
        this.historyStep = -1;
        this.maxHistory = 50;
        
        // Event emitter
        this.events = {};
        
        this.init();
    }

    /**
     * Initialize the Konva stage
     */
    init() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        // Create stage
        this.stage = new Konva.Stage({
            container: this.container.id,
            width: width,
            height: height,
            draggable: false
        });
        
        // Create layers
        this.gridLayer = new Konva.Layer();
        this.mainLayer = new Konva.Layer();
        this.transformLayer = new Konva.Layer();
        
        this.stage.add(this.gridLayer);
        this.stage.add(this.mainLayer);
        this.stage.add(this.transformLayer);
        
        // Draw grid
        this.drawGrid();
        
        // Create transformer for selection
        this.transformer = new Konva.Transformer({
            borderStroke: '#3498db',
            borderStrokeWidth: 2,
            anchorStroke: '#3498db',
            anchorFill: '#ffffff',
            anchorSize: 8,
            keepRatio: false,
            enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            rotateEnabled: true,
            rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315]
        });
        this.transformLayer.add(this.transformer);
        
        // Setup events
        this.setupStageEvents();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Save initial state
        this.saveHistory();
    }

    /**
     * Draw grid
     */
    drawGrid() {
        this.gridLayer.destroyChildren();
        
        if (!this.gridVisible) {
            this.gridLayer.draw();
            return;
        }
        
        const width = this.stage.width();
        const height = this.stage.height();
        const gridSize = this.gridSize;
        
        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            this.gridLayer.add(new Konva.Line({
                points: [x, 0, x, height],
                stroke: '#ddd',
                strokeWidth: 1,
                listening: false
            }));
        }
        
        // Horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            this.gridLayer.add(new Konva.Line({
                points: [0, y, width, y],
                stroke: '#ddd',
                strokeWidth: 1,
                listening: false
            }));
        }
        
        this.gridLayer.draw();
    }

    /**
     * Setup stage event handlers
     */
    setupStageEvents() {
        // Click on empty area - deselect
        this.stage.on('click tap', (e) => {
            if (e.target === this.stage) {
                this.clearSelection();
            }
        });
        
        // Mouse down on empty area - prepare for multi-select
        this.stage.on('mousedown touchstart', (e) => {
            if (e.target !== this.stage) {
                return;
            }
            
            // Clear selection if not holding shift
            if (!e.evt.shiftKey) {
                this.clearSelection();
            }
        });
    }

    /**
     * Add a shape to the canvas
     */
    addShape(shape, saveToHistory = true) {
        this.mainLayer.add(shape);
        
        // Make shape selectable
        this.makeShapeSelectable(shape);
        
        // Apply snap to grid if enabled
        if (this.snapToGrid) {
            this.snapShapeToGrid(shape);
        }
        
        this.mainLayer.draw();
        
        if (saveToHistory) {
            this.saveHistory();
        }
        
        return shape;
    }

    /**
     * Make a shape selectable
     */
    makeShapeSelectable(shape) {
        shape.on('click tap', (e) => {
            e.cancelBubble = true;
            
            if (e.evt.shiftKey) {
                // Add to selection
                this.addToSelection(shape);
            } else {
                // Select only this shape
                this.selectShape(shape);
            }
        });
        
        // Drag events
        shape.on('dragstart', () => {
            if (!this.selectedShapes.includes(shape)) {
                this.selectShape(shape);
            }
        });
        
        shape.on('dragmove', () => {
            if (this.snapToGrid) {
                this.snapShapeToGrid(shape);
            }
        });
        
        shape.on('dragend', () => {
            this.saveHistory();
        });
        
        // Transform events
        shape.on('transformend', () => {
            this.saveHistory();
        });
    }

    /**
     * Select a shape
     */
    selectShape(shape) {
        this.clearSelection();
        this.selectedShapes = [shape];
        this.transformer.nodes([shape]);
        this.transformLayer.draw();
        this.emit('selectionChanged', this.selectedShapes);
    }

    /**
     * Add shape to selection
     */
    addToSelection(shape) {
        if (!this.selectedShapes.includes(shape)) {
            this.selectedShapes.push(shape);
            this.transformer.nodes(this.selectedShapes);
            this.transformLayer.draw();
            this.emit('selectionChanged', this.selectedShapes);
        }
    }

    /**
     * Clear selection
     */
    clearSelection() {
        this.selectedShapes = [];
        this.transformer.nodes([]);
        this.transformLayer.draw();
        this.emit('selectionChanged', this.selectedShapes);
    }

    /**
     * Delete selected shapes
     */
    deleteSelected() {
        if (this.selectedShapes.length === 0) return;
        
        this.selectedShapes.forEach(shape => shape.destroy());
        this.clearSelection();
        this.mainLayer.draw();
        this.saveHistory();
    }

    /**
     * Snap shape to grid
     */
    snapShapeToGrid(shape) {
        shape.x(Math.round(shape.x() / this.gridSize) * this.gridSize);
        shape.y(Math.round(shape.y() / this.gridSize) * this.gridSize);
    }

    /**
     * Update selected shape property
     */
    updateSelectedProperty(property, value) {
        if (this.selectedShapes.length === 0) return;
        
        this.selectedShapes.forEach(shape => {
            shape.setAttr(property, value);
        });
        
        this.mainLayer.draw();
        this.saveHistory();
    }

    /**
     * Update selected shape position/size
     */
    updateSelectedPosition(property, value) {
        if (this.selectedShapes.length === 0) return;
        
        const shape = this.selectedShapes[0];
        
        switch(property) {
            case 'x':
                shape.x(value);
                break;
            case 'y':
                shape.y(value);
                break;
            case 'width':
                const newScaleX = value / shape.width();
                shape.scaleX(newScaleX);
                break;
            case 'height':
                const newScaleY = value / shape.height();
                shape.scaleY(newScaleY);
                break;
        }
        
        this.mainLayer.draw();
        this.transformer.forceUpdate();
        this.saveHistory();
    }

    /**
     * Bring selected to front
     */
    bringToFront() {
        if (this.selectedShapes.length === 0) return;
        
        this.selectedShapes.forEach(shape => {
            shape.moveToTop();
        });
        
        this.mainLayer.draw();
        this.saveHistory();
    }

    /**
     * Send selected to back
     */
    sendToBack() {
        if (this.selectedShapes.length === 0) return;
        
        this.selectedShapes.forEach(shape => {
            shape.moveToBottom();
        });
        
        this.mainLayer.draw();
        this.saveHistory();
    }

    /**
     * Copy selected shapes
     */
    copy() {
        if (this.selectedShapes.length === 0) return;
        
        this.clipboard = this.selectedShapes.map(shape => {
            return shape.toObject();
        });
    }

    /**
     * Paste from clipboard
     */
    paste() {
        if (!this.clipboard || this.clipboard.length === 0) return;
        
        this.clearSelection();
        
        this.clipboard.forEach(shapeData => {
            const shape = this.createShapeFromData(shapeData);
            if (shape) {
                // Offset the pasted shape
                shape.x(shape.x() + 20);
                shape.y(shape.y() + 20);
                this.addShape(shape, false);
                this.addToSelection(shape);
            }
        });
        
        this.saveHistory();
    }

    /**
     * Create shape from data
     */
    createShapeFromData(data) {
        const className = data.className;
        delete data.className;
        
        let shape;
        switch(className) {
            case 'Rect':
                shape = new Konva.Rect(data);
                break;
            case 'Circle':
                shape = new Konva.Circle(data);
                break;
            case 'Ellipse':
                shape = new Konva.Ellipse(data);
                break;
            case 'RegularPolygon':
                shape = new Konva.RegularPolygon(data);
                break;
            case 'Line':
                shape = new Konva.Line(data);
                break;
            case 'Arrow':
                shape = new Konva.Arrow(data);
                break;
            case 'Text':
                shape = new Konva.Text(data);
                break;
            default:
                console.warn('Unknown shape type:', className);
                return null;
        }
        
        shape.draggable(true);
        return shape;
    }

    /**
     * Zoom controls
     */
    zoomIn() {
        this.setZoom(this.zoom * 1.2);
    }

    zoomOut() {
        this.setZoom(this.zoom / 1.2);
    }

    setZoom(newZoom) {
        this.zoom = Math.max(0.1, Math.min(5, newZoom));
        this.stage.scale({ x: this.zoom, y: this.zoom });
        this.stage.draw();
    }

    getZoom() {
        return this.zoom;
    }

    fitToScreen() {
        this.setZoom(1);
        this.stage.position({ x: 0, y: 0 });
    }

    /**
     * Grid controls
     */
    setGridVisible(visible) {
        this.gridVisible = visible;
        this.drawGrid();
    }

    setSnapToGrid(snap) {
        this.snapToGrid = snap;
    }

    /**
     * History management
     */
    saveHistory() {
        // Remove any history after current step
        this.history = this.history.slice(0, this.historyStep + 1);
        
        // Add current state
        const state = this.toJSON();
        this.history.push(state);
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.historyStep++;
        }
        
        this.emit('historyChanged');
    }

    undo() {
        if (!this.canUndo()) return;
        
        this.historyStep--;
        this.loadFromJSON(this.history[this.historyStep], false);
        this.emit('historyChanged');
    }

    redo() {
        if (!this.canRedo()) return;
        
        this.historyStep++;
        this.loadFromJSON(this.history[this.historyStep], false);
        this.emit('historyChanged');
    }

    canUndo() {
        return this.historyStep > 0;
    }

    canRedo() {
        return this.historyStep < this.history.length - 1;
    }

    /**
     * Clear canvas
     */
    clear() {
        this.mainLayer.destroyChildren();
        this.clearSelection();
        this.mainLayer.draw();
        this.history = [];
        this.historyStep = -1;
        this.saveHistory();
    }

    /**
     * Export to JSON
     */
    toJSON() {
        return {
            version: '1.0',
            zoom: this.zoom,
            shapes: this.mainLayer.children.map(shape => shape.toObject())
        };
    }

    /**
     * Load from JSON
     */
    loadFromJSON(data, saveToHistory = true) {
        this.mainLayer.destroyChildren();
        this.clearSelection();
        
        if (data.shapes) {
            data.shapes.forEach(shapeData => {
                const shape = this.createShapeFromData(shapeData);
                if (shape) {
                    this.addShape(shape, false);
                }
            });
        }
        
        if (data.zoom) {
            this.setZoom(data.zoom);
        }
        
        if (saveToHistory) {
            this.saveHistory();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.stage.width(width);
        this.stage.height(height);
        this.drawGrid();
        this.stage.draw();
    }

    /**
     * Get stage for export
     */
    getStage() {
        return this.stage;
    }

    /**
     * Event emitter methods
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(...args));
        }
    }
}
