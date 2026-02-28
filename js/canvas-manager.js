/**
 * FLOWLY - Canvas Manager
 * Manages the Konva stage, layers, and shape operations
 */
import { attachInit } from './canvas/init.js';
import { attachAnchors } from './canvas/anchors.js';
import { attachSelection } from './canvas/selection.js';
import { attachHistory } from './canvas/history.js';
import { attachCreation } from './canvas/creation.js';

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
		this.anchorSize = 12;
		this.anchorStroke = '#3498db';
		this.anchorFill = '#ffffff';
		this.anchorHoverSize = 16;
		this._connecting = null; // temp state when dragging from an anchor

		// Attach modular responsibilities (these will bind existing prototype methods)
		try {
			attachInit(this);
			attachAnchors(this);
			attachSelection(this);
			attachHistory(this);
			attachCreation(this);
		} catch (e) {
			// If modules fail, fall back to prototype methods
			console.warn('Canvas modular attachments failed, continuing with prototype methods', e);
		}

		// Initialize canvas
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
		this.setupZoomEvents();

		// Handle window resize
		window.addEventListener('resize', () => this.handleResize());

		// Save initial state
		this.saveHistory();
	}

	/**
	 * Draw grid - uses CSS background pattern for performance (no Konva nodes)
	 */
	drawGrid() {
		this.gridLayer.destroyChildren();
		this.gridLayer.draw();
		// Delegate all grid rendering to CSS
		this._updateCSSGrid();
	}

	/**
	 * Sync the CSS grid background to match current stage zoom/position
	 */
	_updateCSSGrid() {
		const wrapper = this.container;
		if (!wrapper) return;

		if (!this.gridVisible) {
			wrapper.style.backgroundImage = 'none';
			return;
		}

		const scale = this.zoom;
		const stagePos = this.stage ? this.stage.position() : { x: 0, y: 0 };
		const size = this.gridSize * scale;
		const ox = stagePos.x % size;
		const oy = stagePos.y % size;

		// Use slightly different colors for light/dark mode
		const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
		const lineColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

		wrapper.style.backgroundImage =
			`linear-gradient(${lineColor} 1px, transparent 1px),` +
			`linear-gradient(90deg, ${lineColor} 1px, transparent 1px)`;
		wrapper.style.backgroundSize = `${size}px ${size}px`;
		wrapper.style.backgroundPosition = `${ox}px ${oy}px`;
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
		// makeShapeSelectable is attached from modules
		if (typeof this.makeShapeSelectable === 'function') this.makeShapeSelectable(shape);

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
	 * Snap shape to grid
	 */
	snapShapeToGrid(shape) {
		shape.x(Math.round(shape.x() / this.gridSize) * this.gridSize);
		shape.y(Math.round(shape.y() / this.gridSize) * this.gridSize);
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
		switch (className) {
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
	 * Setup zoom events (wheel zoom)
	 */
	setupZoomEvents() {
		const stage = this.stage;
		const scaleBy = 1.05;

		stage.on('wheel', (e) => {
			e.evt.preventDefault();

			const oldScale = stage.scaleX();
			const pointer = stage.getPointerPosition();

			const mousePointTo = {
				x: (pointer.x - stage.x()) / oldScale,
				y: (pointer.y - stage.y()) / oldScale,
			};

			const direction = e.evt.deltaY > 0 ? -1 : 1;
			const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

			// Limit zoom
			const limitedScale = Math.max(0.1, Math.min(5, newScale));

			stage.scale({ x: limitedScale, y: limitedScale });

			const newPos = {
				x: pointer.x - mousePointTo.x * limitedScale,
				y: pointer.y - mousePointTo.y * limitedScale,
			};

			stage.position(newPos);
			stage.batchDraw();

			this.zoom = limitedScale;
			this._updateCSSGrid();
			this.emit('zoomChanged', this.zoom);
		});

		// Also update grid on pan
		stage.on('dragmove', () => {
			this._updateCSSGrid();
		});
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
		this.emit('zoomChanged', this.zoom);
	}

	getZoom() {
		return this.zoom;
	}

	/**
	 * Fit all content to screen with proper centering and zoom
	 */
	fitToScreen() {
		const children = this.mainLayer.getChildren().filter(n => {
			try { return n.getClassName() !== 'Transformer'; } catch (e) { return true; }
		});

		if (children.length === 0) {
			// No content: just reset to 100% at origin
			this.setZoom(1);
			this.stage.position({ x: 0, y: 0 });
			this.stage.draw();
			this._updateCSSGrid();
			return;
		}

		// Calculate bounding box of all shapes
		let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		children.forEach(shape => {
			try {
				const box = shape.getClientRect({ relativeTo: this.mainLayer });
				minX = Math.min(minX, box.x);
				minY = Math.min(minY, box.y);
				maxX = Math.max(maxX, box.x + box.width);
				maxY = Math.max(maxY, box.y + box.height);
			} catch (e) { }
		});

		const padding = 60;
		const contentW = maxX - minX + padding * 2;
		const contentH = maxY - minY + padding * 2;
		const stageW = this.stage.width();
		const stageH = this.stage.height();

		const scale = Math.min(stageW / contentW, stageH / contentH, 2); // max 200% zoom
		const limitedScale = Math.max(0.1, scale);

		const newX = (stageW - contentW * limitedScale) / 2 - (minX - padding) * limitedScale;
		const newY = (stageH - contentH * limitedScale) / 2 - (minY - padding) * limitedScale;

		this.zoom = limitedScale;
		this.stage.scale({ x: limitedScale, y: limitedScale });
		this.stage.position({ x: newX, y: newY });
		this.stage.draw();
		this._updateCSSGrid();
		this.emit('zoomChanged', this.zoom);
	}

	/**
	 * Grid controls
	 */
	setGridVisible(visible) {
		this.gridVisible = visible;
		this._updateCSSGrid();
	}

	setSnapToGrid(snap) {
		this.snapToGrid = snap;
	}

	/**
	 * History management
	 */
	// saveHistory/undo/redo/canUndo/canRedo are provided by js/canvas/history.impl.js via attachHistory

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
		// Clear connectors FIRST to avoid duplicates/ghost arrows on undo/redo
		if (this.connectorsManager && typeof this.connectorsManager.clearAll === 'function') {
			this.connectorsManager.clearAll();
		}
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
