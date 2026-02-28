/**
 * Flowly  - Tool Manager
 * Manages drawing tools and shape creation
 */

import { ShapeFactory } from './shapes.js';
import { LassoSelection } from './canvas/lasso-selection.js';
import { SmartGuides } from './canvas/smart-guides.js';

export class ToolManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.activeTool = 'select';
        this.isDrawing = false;
        this.startPos = null;
        this.currentShape = null;
        this.isDuplicating = false; // Track if we're duplicating with Alt+Drag
        this.altKeyPressed = false; // Track Alt key state

        // Lasso selection system
        this.lassoSelection = new LassoSelection(canvasManager);

        // Smart guides system
        this.smartGuides = new SmartGuides(canvasManager);

        this.setupDrawingEvents();
        this.setupDoubleClickEdit();
    }

    /**
     * Set active tool
     */
    setActiveTool(tool) {
        this.activeTool = tool;
        this.updateCursor();
    }

    /**
     * Update cursor based on active tool
     */
    updateCursor() {
        const stage = this.canvasManager.getStage();

        switch (this.activeTool) {
            case 'select':
                stage.container().style.cursor = 'default';
                break;
            case 'pan':
                stage.container().style.cursor = 'grab';
                break;
            case 'text':
                stage.container().style.cursor = 'text';
                break;
            default:
                stage.container().style.cursor = 'crosshair';
        }
    }

    /**
     * Setup drawing event handlers
     */
    setupDrawingEvents() {
        const stage = this.canvasManager.stage;

        // Track Alt key state globally
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Alt' || e.altKey) {
                this.altKeyPressed = true;
                // Update cursor if hovering over a shape
                const canvasWrapper = document.getElementById('canvas-wrapper');
                if (this.activeTool === 'select' && canvasWrapper) {
                    canvasWrapper.style.cursor = 'copy';
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'Alt' || !e.altKey) {
                this.altKeyPressed = false;
                this.isDuplicating = false;
                // Reset cursor
                const canvasWrapper = document.getElementById('canvas-wrapper');
                if (canvasWrapper && this.activeTool === 'select') {
                    canvasWrapper.style.cursor = 'default';
                }
            }
        });

        stage.on('mousedown touchstart', (e) => {
            // Ignore if clicking on transformer
            if (e.target === this.canvasManager.transformer) return;

            const pos = stage.getPointerPosition();
            this.startPos = pos; // Keep startPos for drawing new shapes

            // Check if Alt is pressed and we're in select mode with a shape selected
            if (this.altKeyPressed && this.activeTool === 'select' && e.target !== stage) {
                // Duplicate the clicked shape
                this.duplicateShape(e.target);
                this.isDuplicating = true;
                return;
            }

            if (this.activeTool === 'select') {
                // Check if clicking on empty space (start lasso selection)
                if (e.target === stage) {
                    this.lassoSelection.start(pos);
                }
                // Selection handled by canvas manager
                return;
            }

            if (this.activeTool === 'text') {
                this.createTextElement(pos);
                return;
            }

            if (this.activeTool === 'pan') {
                // Pan mode handled by canvas manager
                stage.draggable(true); // Re-enable draggable for pan
                stage.container().style.cursor = 'grabbing';
                return;
            }

            // Start drawing shape
            this.isDrawing = true; // Set isDrawing to true for new shapes
            this.createShapeStart(pos);
        });

        stage.on('mousemove touchmove', (e) => {
            // Update lasso selection if active
            if (this.lassoSelection.isActive()) {
                const pos = stage.getPointerPosition();
                this.lassoSelection.update(pos);
                return;
            }

            if (!this.isDrawing) return;

            const pos = stage.getPointerPosition();
            this.updateShapeSize(pos);
        });

        stage.on('mouseup touchend', (e) => {
            // Finish lasso selection if active
            if (this.lassoSelection.isActive()) {
                const shiftKey = e.evt ? e.evt.shiftKey : false;
                this.lassoSelection.finish(shiftKey);
                return;
            }

            if (this.activeTool === 'pan') {
                stage.draggable(false);
                stage.container().style.cursor = 'grab';
            }

            if (this.isDrawing) {
                this.finishDrawing();
            }
        });
    }

    /**
     * Start creating a shape
     */
    createShapeStart(pos) {
        const shapeType = this.activeTool;

        // Create initial shape
        this.currentShape = ShapeFactory.create(shapeType, {
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0
        });

        if (this.currentShape) {
            this.canvasManager.addShape(this.currentShape, false);
        }
    }

    /**
     * Update shape size while dragging
     */
    updateShapeSize(pos) {
        if (!this.currentShape || !this.startPos) {
            return;
        }

        const width = pos.x - this.startPos.x;
        const height = pos.y - this.startPos.y;

        const shapeType = this.activeTool;

        switch (shapeType) {
            case 'rectangle':
            case 'rounded-rectangle':
                this.currentShape.width(Math.abs(width));
                this.currentShape.height(Math.abs(height));
                if (width < 0) this.currentShape.x(pos.x);
                if (height < 0) this.currentShape.y(pos.y);
                break;

            case 'circle':
                const radius = Math.sqrt(width * width + height * height) / 2;
                this.currentShape.radius(radius);
                this.currentShape.x(this.startPos.x + width / 2);
                this.currentShape.y(this.startPos.y + height / 2);
                break;

            case 'ellipse':
                this.currentShape.radiusX(Math.abs(width) / 2);
                this.currentShape.radiusY(Math.abs(height) / 2);
                this.currentShape.x(this.startPos.x + width / 2);
                this.currentShape.y(this.startPos.y + height / 2);
                break;

            case 'triangle':
            case 'pentagon':
            case 'hexagon':
                const size = Math.max(Math.abs(width), Math.abs(height));
                this.currentShape.radius(size / 2);
                this.currentShape.x(this.startPos.x + width / 2);
                this.currentShape.y(this.startPos.y + height / 2);
                break;

            case 'line':
            case 'arrow':
                this.currentShape.points([0, 0, width, height]);
                break;
        }

        this.canvasManager.mainLayer.draw();
    }

    /**
     * Finish drawing
     */
    finishDrawing() {
        if (!this.currentShape) {
            return;
        }

        // Check if shape is too small
        const minSize = 5;
        let isValid = true;

        const shapeType = this.activeTool;

        switch (shapeType) {
            case 'rectangle':
            case 'rounded-rectangle':
                if (this.currentShape.width() < minSize || this.currentShape.height() < minSize) {
                    isValid = false;
                }
                break;
            case 'circle':
                if (this.currentShape.radius() < minSize) {
                    isValid = false;
                }
                break;
            case 'ellipse':
                if (this.currentShape.radiusX() < minSize || this.currentShape.radiusY() < minSize) {
                    isValid = false;
                }
                break;
            case 'triangle':
            case 'pentagon':
            case 'hexagon':
                if (this.currentShape.radius() < minSize) {
                    isValid = false;
                }
                break;
            case 'line':
            case 'arrow':
                const points = this.currentShape.points();
                const length = Math.sqrt(points[2] * points[2] + points[3] * points[3]);
                if (length < minSize) {
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.currentShape.destroy();
            this.canvasManager.mainLayer.draw();
        } else {
            // Apply snap to grid
            if (this.canvasManager.snapToGrid) {
                this.canvasManager.snapShapeToGrid(this.currentShape);
            }

            // Save to history
            this.canvasManager.saveHistory();

            // Select the new shape
            this.canvasManager.selectShape(this.currentShape);
        }

        this.currentShape = null;
        this.startPos = null;
    }

    /**
     * Create text element
     */
    createTextElement(pos) {
        const textNode = ShapeFactory.create('text', {
            x: pos.x,
            y: pos.y,
            text: 'Doble-click para editar',
            fontSize: 16,
            fill: '#000000',
            width: 200
        });

        this.canvasManager.addShape(textNode);

        // Enable text editing on double click
        textNode.on('dblclick dbltap', () => {
            this.editText(textNode);
        });

        // Select the text
        this.canvasManager.selectShape(textNode);
    }

    /**
     * Edit text inline — works for dedicated Text nodes AND for any other shape
     * (stores the label in a `_label` attribute and renders it as an overlay)
     */
    editText(textNode) {
        // Hide transformer while editing
        this.canvasManager.transformer.hide();

        // Create textarea overlay
        const textPosition = textNode.absolutePosition();
        const stage = this.canvasManager.getStage();
        const stageBox = stage.container().getBoundingClientRect();
        const scale = stage.scaleX();

        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        // For real Text nodes use text(), for shapes use stored _label attr
        const isTextNode = textNode.getClassName() === 'Text';
        textarea.value = isTextNode ? textNode.text() : (textNode.getAttr('_label') || '');

        const nodeWidth = isTextNode ? textNode.width() * scale : Math.max(textNode.width() * scale, 100);

        textarea.style.position = 'absolute';
        textarea.style.top = stageBox.top + textPosition.y + 'px';
        textarea.style.left = stageBox.left + textPosition.x + 'px';
        textarea.style.width = nodeWidth + 'px';
        textarea.style.minWidth = '80px';
        textarea.style.fontSize = (isTextNode ? textNode.fontSize() : 13) * scale + 'px';
        textarea.style.border = '2px solid #6750A4';
        textarea.style.borderRadius = '6px';
        textarea.style.padding = '4px 6px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'var(--md-surface-container-lowest, #fff)';
        textarea.style.color = 'var(--md-on-surface, #1D1B20)';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.fontFamily = isTextNode ? textNode.fontFamily() : 'Inter, sans-serif';
        textarea.style.textAlign = isTextNode ? textNode.align() : 'center';
        textarea.style.zIndex = '1000';
        textarea.style.boxShadow = '0 4px 16px rgba(103,80,164,0.2)';

        textarea.focus();
        textarea.select();

        const removeTextarea = () => {
            if (!textarea.parentNode) return;
            textarea.parentNode.removeChild(textarea);
            const value = textarea.value;
            if (isTextNode) {
                textNode.text(value);
            } else {
                // Store label as custom attribute
                textNode.setAttr('_label', value);
                this._renderShapeLabel(textNode, value);
            }
            this.canvasManager.mainLayer.draw();
            this.canvasManager.transformer.show();
            this.canvasManager.transformer.forceUpdate();
            this.canvasManager.saveHistory();
        };

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { removeTextarea(); }
            if (e.key === 'Enter' && e.ctrlKey) { removeTextarea(); }
        });

        textarea.addEventListener('blur', removeTextarea);
    }

    /**
     * Render label text over a non-text shape using a sibling Konva.Text node
     */
    _renderShapeLabel(shape, text) {
        // Remove old label if any
        if (shape._labelNode) {
            try { shape._labelNode.destroy(); } catch (e) { }
            shape._labelNode = null;
        }
        if (!text) return;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const box = shape.getClientRect({ relativeTo: this.canvasManager.mainLayer });
        const label = new Konva.Text({
            x: box.x,
            y: box.y + box.height / 2 - 8,
            width: box.width,
            text,
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            fill: isDark ? '#E6E0E9' : '#1D1B20',
            align: 'center',
            listening: false,
            name: 'shape-label'
        });
        this.canvasManager.mainLayer.add(label);
        shape._labelNode = label;

        // Keep label synced on drag
        shape.off('dragmove.label');
        shape.on('dragmove.label transform.label', () => {
            const b = shape.getClientRect({ relativeTo: this.canvasManager.mainLayer });
            label.x(b.x);
            label.y(b.y + b.height / 2 - 8);
            label.width(b.width);
            this.canvasManager.mainLayer.batchDraw();
        });
    }

    /**
     * Setup double-click editing on any shape (non-text shapes trigger inline label editor)
     */
    setupDoubleClickEdit() {
        const stage = this.canvasManager.stage;
        stage.on('dblclick dbltap', (e) => {
            if (e.target === stage) return;
            if (this.activeTool !== 'select') return;

            const target = e.target;
            // For Text nodes we already have dblclick handlers on individual nodes;
            // here we handle non-text shapes
            const cls = target.getClassName ? target.getClassName() : '';
            if (cls === 'Text') {
                this.editText(target);
            } else if (cls !== 'Transformer' && target.draggable && target.draggable()) {
                this.editText(target);
            }
        });
    }

    /**
     * Add shape to center of canvas
     */
    addShapeToCenter(shapeType) {
        const stage = this.canvasManager.getStage();
        const cx = stage.width() / 2;
        const cy = stage.height() / 2;

        const defaults = {
            rectangle: { x: cx - 50, y: cy - 40, width: 100, height: 80 },
            'rounded-rectangle': { x: cx - 50, y: cy - 40, width: 100, height: 80 },
            ellipse: { x: cx, y: cy, radiusX: 70, radiusY: 40 },
            circle: { x: cx, y: cy, radius: 50 },
            triangle: { x: cx, y: cy, radius: 50 },
            pentagon: { x: cx, y: cy, radius: 50 },
            hexagon: { x: cx, y: cy, radius: 50 },
            line: { x: cx - 60, y: cy, points: [0, 0, 120, 0] },
            arrow: { x: cx - 60, y: cy, points: [0, 0, 120, 0] },
            text: { x: cx - 100, y: cy - 8, text: 'Doble-click para editar', fontSize: 16, fill: '#000000', width: 200 }
        };

        const attrs = defaults[shapeType];
        if (!attrs) return;

        const shape = ShapeFactory.create(shapeType, attrs);
        if (!shape) return;

        if (shapeType === 'text') {
            shape.on('dblclick dbltap', () => this.editText(shape));
        }

        this.canvasManager.addShape(shape);
        this.canvasManager.selectShape(shape);
    }

    /**
     * Duplicate a shape (Alt+Drag functionality)
     */
    duplicateShape(shape) {
        if (!shape || shape === this.canvasManager.stage) return;

        // Create duplicate with offset
        const offset = 20;
        let duplicate;

        try {
            // Clone the shape
            duplicate = shape.clone({
                x: shape.x() + offset,
                y: shape.y() + offset,
            });

            // Add to layer
            this.canvasManager.mainLayer.add(duplicate);

            // Make it draggable
            duplicate.draggable(true);

            // Setup event handlers for the duplicate (double-click for text editing)
            if (duplicate.className === 'Text') {
                duplicate.on('dblclick dbltap', () => {
                    this.editText(duplicate);
                });
            }

            // Select the duplicate
            this.canvasManager.selectShape(duplicate);

            // Save state
            this.canvasManager.saveState();

            console.log('✨ Shape duplicated with Alt+Drag');
        } catch (error) {
            console.error('Error duplicating shape:', error);
        }
    }
}
