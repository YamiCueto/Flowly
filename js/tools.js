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
     * Edit text
     */
    editText(textNode) {
        // Hide transformer
        this.canvasManager.transformer.hide();

        // Create textarea
        const textPosition = textNode.absolutePosition();
        const stage = this.canvasManager.getStage();
        const stageBox = stage.container().getBoundingClientRect();

        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = stageBox.top + textPosition.y + 'px';
        textarea.style.left = stageBox.left + textPosition.x + 'px';
        textarea.style.width = textNode.width() + 'px';
        textarea.style.fontSize = textNode.fontSize() + 'px';
        textarea.style.border = '2px solid #3498db';
        textarea.style.padding = '4px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'white';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        textarea.style.zIndex = '1000';

        textarea.focus();
        textarea.select();

        const removeTextarea = () => {
            textarea.parentNode.removeChild(textarea);
            textNode.text(textarea.value);
            this.canvasManager.mainLayer.draw();
            this.canvasManager.transformer.show();
            this.canvasManager.transformer.forceUpdate();
            this.canvasManager.saveHistory();
        };

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                removeTextarea();
            }
            if (e.key === 'Enter' && e.ctrlKey) {
                removeTextarea();
            }
        });

        textarea.addEventListener('blur', removeTextarea);
    }

    /**
     * Add shape to center of canvas
     */
    addShapeToCenter(shapeType) {
        const stage = this.canvasManager.getStage();
        const centerX = stage.width() / 2;
        const centerY = stage.height() / 2;

        let shape;

        switch (shapeType) {
            case 'rectangle':
                shape = ShapeFactory.create('rectangle', {
                    x: centerX - 50,
                    y: centerY - 40,
                    width: 100,
                    height: 80
                });
                break;

            case 'circle':
                shape = ShapeFactory.create('circle', {
                    x: centerX,
                    y: centerY,
                    radius: 50
                });
                break;

            case 'triangle':
                shape = ShapeFactory.create('triangle', {
                    x: centerX,
                    y: centerY,
                    radius: 50
                });
                break;

            case 'rounded-rectangle':
                shape = ShapeFactory.create('rounded-rectangle', {
                    x: centerX - 50,
                    y: centerY - 40,
                    width: 100,
                    height: 80
                });
                break;

            case 'ellipse':
                shape = ShapeFactory.create('ellipse', {
                    x: centerX,
                    y: centerY,
                    radiusX: 70,
                    radiusY: 40
                });
                break;

            case 'line':
                shape = ShapeFactory.create('line', {
                    x: centerX - 60,
                    y: centerY,
                    points: [0, 0, 120, 0]
                });
                break;

            case 'arrow':
                shape = ShapeFactory.create('arrow', {
                    x: centerX - 60,
                    y: centerY,
                    points: [0, 0, 120, 0]
                });
                break;
            case 'pentagon':
                shape = ShapeFactory.create('pentagon', {
                    x: centerX,
                    y: centerY,
                    radius: 50
                });
                break;
            case 'hexagon':
                shape = ShapeFactory.create('hexagon', {
                    x: centerX,
                    y: centerY,
                    radius: 50
                });
                break;

            case 'text':
                shape = ShapeFactory.create('text', {
                    x: centerX - 100,
                    y: centerY - 8,
                    text: 'Doble-click para editar',
                    fontSize: 16,
                    fill: '#000000',
                    width: 200
                });

                shape.on('dblclick dbltap', () => {
                    this.editText(shape);
                });
                break;
        }

        if (shape) {
            this.canvasManager.addShape(shape);
            this.canvasManager.selectShape(shape);
        }
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

            // Setup event handlers for the duplicate
            this.canvasManager.setupShapeEvents(duplicate);

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
