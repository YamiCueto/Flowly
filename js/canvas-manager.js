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

    // Anchor / connector interaction settings
    this.anchorSize = 8;
    this.anchorStroke = '#3498db';
    this.anchorFill = '#ffffff';
    this.anchorHoverSize = 10;
    this._connecting = null; // temp state when dragging from an anchor
        
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
        
        // Create anchors for connection UX
        this.createAnchorsForShape(shape);
    }


    /**
     * Create anchor points for a shape (8 by default)
     */
    createAnchorsForShape(shape) {
        try {
            if (!this.transformLayer) return;

            // Avoid recreating anchors
            if (shape._anchors && shape._anchors.length > 0) return;

            const anchors = [];

            const addAnchor = (x, y, idx) => {
                const anchor = new Konva.Circle({
                    x,
                    y,
                    radius: this.anchorSize / 2,
                    fill: this.anchorFill,
                    stroke: this.anchorStroke,
                    strokeWidth: 1,
                    visible: false,
                    listening: true,
                    name: 'anchor',
                    draggable: false
                });

                // Interaction: start a connection when user presses an anchor
                anchor.on('mousedown touchstart', (e) => {
                    e.cancelBubble = true;
                    this.startConnectionFromAnchor(anchor, shape);
                });

                // Small hover cue
                anchor.on('mouseenter', () => {
                    document.body.style.cursor = 'crosshair';
                });
                anchor.on('mouseleave', () => {
                    document.body.style.cursor = 'default';
                });

                this.transformLayer.add(anchor);
                anchors.push(anchor);
            };

            // compute client rect and create anchors at 8 key points
            const rect = shape.getClientRect({ relativeTo: this.stage });
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

            // Update anchors when the shape moves/transforms
            const updateAnchors = () => {
                const r = shape.getClientRect({ relativeTo: this.stage });
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
                this.transformLayer.batchDraw();
            };

            shape.on('dragmove transform move resize change', updateAnchors);
            // Show anchors on hover
            shape.on('mouseenter', () => {
                shape._anchors.forEach(a => a.visible(true));
                this.transformLayer.batchDraw();
            });
            shape.on('mouseleave', () => {
                // If we're currently connecting, keep anchors visible
                if (this._connecting) return;
                shape._anchors.forEach(a => a.visible(false));
                this.transformLayer.batchDraw();
            });
        } catch (e) {
            // Defensive: some shapes may not support getClientRect at creation time
            // We'll silently ignore anchor creation failures
            console.warn('Failed to create anchors for shape', e);
        }
    }

    startConnectionFromAnchor(anchor, shape) {
        // Prevent multiple concurrent connections
        if (this._connecting) return;

        const startPos = anchor.getAbsolutePosition();
        this._connecting = {
            startShape: shape,
            startAnchor: anchor,
            tempLine: null,
            highlightedAnchor: null
        };

        // Create provisional line
        const line = new Konva.Line({
            points: [startPos.x, startPos.y, startPos.x, startPos.y],
            stroke: '#2c3e50',
            strokeWidth: 2,
            dash: [],
            listening: false
        });

        this._connecting.tempLine = line;
        this.transformLayer.add(line);
        this.transformLayer.batchDraw();

        // Handlers
        const onMove = (evt) => {
            const pos = this.stage.getPointerPosition();
            if (!pos) return;
            line.points([startPos.x, startPos.y, pos.x, pos.y]);

            // Find nearest anchor (excluding anchors of the start shape)
            let nearest = null;
            let minDist = Infinity;
            const threshold = this.anchorSize * 2;

            // Iterate over all shapes' anchors
            this.mainLayer.getChildren().forEach(node => {
                const s = node;
                if (!s._anchors) return;
                s._anchors.forEach(a => {
                    if (a === anchor) return;
                    const ap = a.getAbsolutePosition();
                    const dx = ap.x - pos.x;
                    const dy = ap.y - pos.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < minDist) {
                        minDist = d;
                        nearest = { anchor: a, shape: s, dist: d };
                    }
                });
            });

            // Highlight if within threshold
            if (this._connecting.highlightedAnchor && (!nearest || nearest.dist > threshold)) {
                // remove highlight
                this._connecting.highlightedAnchor.strokeWidth(1);
                this._connecting.highlightedAnchor.radius(this.anchorSize / 2);
                this._connecting.highlightedAnchor = null;
            }

            if (nearest && nearest.dist <= threshold) {
                if (this._connecting.highlightedAnchor !== nearest.anchor) {
                    if (this._connecting.highlightedAnchor) {
                        this._connecting.highlightedAnchor.strokeWidth(1);
                        this._connecting.highlightedAnchor.radius(this.anchorSize / 2);
                    }
                    nearest.anchor.strokeWidth(2);
                    nearest.anchor.radius(this.anchorHoverSize / 2);
                    this._connecting.highlightedAnchor = nearest.anchor;
                }
            }

            this.transformLayer.batchDraw();
        };

        const onUp = (evt) => {
            const pos = this.stage.getPointerPosition();
            if (!pos) return cleanup();

            // Find nearest anchor again
            let nearest = null;
            let minDist = Infinity;
            this.mainLayer.getChildren().forEach(node => {
                const s = node;
                if (!s._anchors) return;
                s._anchors.forEach(a => {
                    if (a === anchor) return;
                    const ap = a.getAbsolutePosition();
                    const dx = ap.x - pos.x;
                    const dy = ap.y - pos.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < minDist) {
                        minDist = d;
                        nearest = { anchor: a, shape: s, dist: d };
                    }
                });
            });

            const threshold = this.anchorSize * 2;
            if (nearest && nearest.dist <= threshold && nearest.shape !== shape) {
                // Create connector between shapes
                if (this.connectorsManager) {
                    this.connectorsManager.createConnector(shape, nearest.shape);
                } else {
                    console.warn('ConnectorsManager not available on canvasManager');
                }
            }

            cleanup();
        };

        const cleanup = () => {
            try {
                if (this._connecting) {
                    if (this._connecting.tempLine) this._connecting.tempLine.destroy();
                    if (this._connecting.highlightedAnchor) {
                        this._connecting.highlightedAnchor.strokeWidth(1);
                        this._connecting.highlightedAnchor.radius(this.anchorSize / 2);
                    }
                }
            } catch (e) {
                // ignore
            }

            this._connecting = null;
            this.stage.off('mousemove touchmove', onMove);
            this.stage.off('mouseup touchend', onUp);
            this.transformLayer.batchDraw();
        };

        // Attach stage handlers
        this.stage.on('mousemove touchmove', onMove);
        this.stage.on('mouseup touchend', onUp);
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
        // Clear connectors first (if any), then remove shapes
        if (this.connectorsManager && typeof this.connectorsManager.clearAll === 'function') {
            this.connectorsManager.clearAll();
        }
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
            shapes: this.mainLayer.children.map(shape => shape.toObject()),
            connectors: this.connectorsManager ? this.connectorsManager.toJSON() : []
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

        // Restore connectors after shapes are recreated
        if (data.connectors && this.connectorsManager) {
            // Build shapes array from current mainLayer children
            const shapes = (this.mainLayer.getChildren ? Array.from(this.mainLayer.getChildren()) : (this.mainLayer.children || [])).filter(s => typeof s.id === 'function');
            this.connectorsManager.fromJSON(data.connectors, shapes);
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
