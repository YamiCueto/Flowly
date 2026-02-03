/**
 * FLOWLY - Main Application Entry Point
 * Initializes the canvas, event listeners, and application state
 */

import { CanvasManager } from './canvas-manager.js';
import { ToolManager } from './tools.js';
import { ExportManager } from './export-manager.js';
import { StorageManager } from './storage.js';
import { ConnectorsManager } from './connectors.js';
import { attachNotificationHelpers } from './ui/notifications.js';
import { setupToolbar } from './ui/toolbar.js';
import { setupKeyboardShortcuts } from './ui/shortcuts.js';
import { setupModals } from './ui/modals.js';
import { setupPropertiesPanel } from './ui/properties.js';
import { attachFileOperations } from './ui/fileops.js';
import { setupContextMenu } from './ui/context-menu.js';
import { TooltipManager } from './ui/tooltip.js';

class FlowlyApp {
	constructor() {
		this.canvasManager = null;
		this.toolManager = null;
		this.exportManager = null;
		this.storageManager = null;
		this.connectorsManager = null;
		this.tooltipManager = null;
		this.currentTool = 'select';
		this.selectedShape = null;
	}

	/**
	 * Initialize the application
	 */
	init() {
		console.log('🎨 Initializing Flowly...');

		// Initialize managers
		this.canvasManager = new CanvasManager('canvas-wrapper');
		this.toolManager = new ToolManager(this.canvasManager);
		this.exportManager = new ExportManager(this.canvasManager);
		this.storageManager = new StorageManager(this.canvasManager);
		// Connectors manager handles connections between shapes
		this.connectorsManager = new ConnectorsManager(this.canvasManager);
		this.tooltipManager = new TooltipManager(); // Initialize TooltipManager here
		
		// Cross-link managers for Sprint 2 features
		this.canvasManager.toolManager = this.toolManager; // Enable smart guides in drag
		
		// Expose to canvas manager so it can create connectors during anchor-drag UX
		this.canvasManager.connectorsManager = this.connectorsManager;

		// Setup event listeners (delegated to modular helpers)
		attachNotificationHelpers(this);
		setupToolbar(this);
		setupKeyboardShortcuts(this);
		this.setupCanvasControls();
		setupPropertiesPanel(this);
		attachFileOperations(this);
		setupModals(this);
		// Right-click context menu for nodes
		try { setupContextMenu(this); } catch (e) { console.warn('Context menu failed to initialize', e); }
		this.setupShapesLibrary();

		// Listen to selection changes
		this.canvasManager.on('selectionChanged', (shapes) => {
			this.updatePropertiesPanel(shapes);
		});

		// Expose a small test helper to create a connector between first two shapes
		window.createTestConnector = () => {
			// Convert the Konva collection to a proper array in a robust way
			const children = Array.from(this.canvasManager.mainLayer.getChildren ? this.canvasManager.mainLayer.getChildren() : this.canvasManager.mainLayer.children || []);
			// Filter out non-shape nodes (Transformer, etc.)
			const shapes = children.filter(n => {
				try {
					const cls = n.getClassName ? n.getClassName() : n.className || '';
					return cls !== 'Transformer';
				} catch (e) {
					return true;
				}
			});

			if (shapes.length >= 2) {
				const conn = this.connectorsManager.createConnector(shapes[0], shapes[1]);
				console.log('Test connector created', conn);
			} else {
				console.warn('Need at least two shapes on the canvas to create a test connector');
			}
		};

		// Listen to history changes
		this.canvasManager.on('historyChanged', () => {
			this.updateHistoryButtons();
		});

		// Initialize Bootstrap tooltips if available
		try {
			if (window.bootstrap && typeof window.bootstrap.Tooltip === 'function') {
				document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
					try { new window.bootstrap.Tooltip(el); } catch (e) { }
				});
			}
		} catch (e) { }
		console.log('✅ Flowly initialized successfully!');
		// Load last session if available
		this.loadLastSession();
	}

	/**
	 * Setup canvas control toggles
	 */
	setupCanvasControls() {
		document.getElementById('grid-toggle').addEventListener('change', (e) => {
			this.canvasManager.setGridVisible(e.target.checked);
			document.getElementById('canvas-wrapper').classList.toggle('hide-grid', !e.target.checked);
		});

		document.getElementById('snap-toggle').addEventListener('change', (e) => {
			this.canvasManager.setSnapToGrid(e.target.checked);
		});
	}





	/**
	 * Setup shapes library
	 */
	setupShapesLibrary() {
		document.querySelectorAll('.shape-item').forEach(item => {
			item.addEventListener('click', (e) => {
				const shape = e.currentTarget.dataset.shape;
				this.toolManager.addShapeToCenter(shape);
			});
		});
	}

	/**
	 * Select a tool
	 */
	selectTool(tool) {
		this.currentTool = tool;

		// Update UI
		document.querySelectorAll('.tool-btn').forEach(btn => {
			btn.classList.remove('active');
		});
		document.querySelector(`[data-tool="${tool}"]`)?.classList.add('active');

		// Update canvas cursor
		const canvasWrapper = document.getElementById('canvas-wrapper');
		canvasWrapper.className = canvasWrapper.className.replace(/tool-\w+/g, '');
		canvasWrapper.classList.add(`tool-${tool}`);

		// Update canvas manager
		this.toolManager.setActiveTool(tool);
	}

	/**
	 * Update properties panel based on selection
	 */
	updatePropertiesPanel(shapes) {
		const noSelection = document.querySelector('.no-selection');
		const propertiesContent = document.getElementById('properties-content');
		const textProperties = document.getElementById('text-properties');

		if (shapes.length === 0) {
			noSelection.style.display = 'flex';
			propertiesContent.style.display = 'none';
			return;
		}

		noSelection.style.display = 'none';
		propertiesContent.style.display = 'block';

		// Get first selected shape properties
		const shape = shapes[0];
		const attrs = shape.attrs;

		// Update color inputs
		document.getElementById('fill-color').value = attrs.fill || '#3498db';
		document.getElementById('fill-color-text').value = attrs.fill || '#3498db';
		document.getElementById('stroke-color').value = attrs.stroke || '#2c3e50';
		document.getElementById('stroke-color-text').value = attrs.stroke || '#2c3e50';

		// Update stroke width
		document.getElementById('stroke-width').value = attrs.strokeWidth || 2;
		document.getElementById('stroke-width-value').textContent = (attrs.strokeWidth || 2) + 'px';

		// Update opacity
		const opacity = (attrs.opacity !== undefined ? attrs.opacity : 1) * 100;
		document.getElementById('opacity').value = opacity;
		document.getElementById('opacity-value').textContent = opacity + '%';

		// Update position and size
		document.getElementById('pos-x').value = Math.round(shape.x());
		document.getElementById('pos-y').value = Math.round(shape.y());
		document.getElementById('width').value = Math.round(shape.width() * shape.scaleX());
		document.getElementById('height').value = Math.round(shape.height() * shape.scaleY());

		// Show/hide text properties
		if (shape.getClassName() === 'Text') {
			textProperties.style.display = 'block';
			document.getElementById('font-size').value = attrs.fontSize || 16;
			document.getElementById('text-color').value = attrs.fill || '#000000';
			document.getElementById('text-color-text').value = attrs.fill || '#000000';
		} else {
			textProperties.style.display = 'none';
		}

		// Connector-specific UI (works for Arrow, Line and Bezier shapes)
		const connectorProps = document.getElementById('connector-properties');
		const conn = this.connectorsManager ? this.connectorsManager.findConnectorByArrow(shape) : null;
		if (conn) {
			// Show connector controls
			connectorProps.style.display = 'block';
			// Populate values
			const stroke = attrs.stroke || '#2c3e50';
			const strokeWidth = attrs.strokeWidth || 2;
			const dash = attrs.dash && attrs.dash.length > 0;

			document.getElementById('connector-stroke-color').value = stroke;
			document.getElementById('connector-stroke-color-text').value = stroke;
			document.getElementById('connector-stroke-width').value = strokeWidth;
			document.getElementById('connector-stroke-width-value').textContent = strokeWidth + 'px';
			document.getElementById('connector-dashed').checked = !!dash;

			// type and curvature
			const type = conn ? conn.type : 'arrow';
			document.getElementById('connector-type').value = type;
			document.getElementById('connector-arrowhead').checked = (type === 'arrow');
			if (type === 'bezier') {
				document.getElementById('connector-curvature-row').style.display = 'block';
				document.getElementById('connector-curvature').value = conn ? (conn.options.curvature || 0.5) : 0.5;
				document.getElementById('connector-curvature-value').textContent = (conn ? (conn.options.curvature || 0.5) : 0.5).toFixed(2);
			} else {
				document.getElementById('connector-curvature-row').style.display = 'none';
			}
		} else {
			connectorProps.style.display = 'none';
		}
	}

	/**
	 * Update zoom display
	 */
	updateZoomDisplay() {
		const zoom = Math.round(this.canvasManager.getZoom() * 100);
		document.getElementById('zoom-display').textContent = zoom + '%';
	}

	/**
	 * Update undo/redo button states
	 */
	updateHistoryButtons() {
		const undoBtn = document.getElementById('undo-btn');
		const redoBtn = document.getElementById('redo-btn');

		undoBtn.disabled = !this.canvasManager.canUndo();
		redoBtn.disabled = !this.canvasManager.canRedo();
	}

	/**
	 * New project
	 */
	async newProject() {
		const ok = await this.confirm('¿Crear un nuevo proyecto? Los cambios no guardados se perderán.');
		if (ok) {
			this.canvasManager.clear();
			this.updateHistoryButtons();
		}
	}

	/**
	 * Load last session
	 */
	loadLastSession() {
		const lastSession = this.storageManager.getLastSession();
		if (lastSession) {
			this.canvasManager.loadFromJSON(lastSession);
		}
	}
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		const app = new FlowlyApp();
		app.init();

		// Make app globally accessible for debugging
		window.flowlyApp = app;
	});
} else {
	const app = new FlowlyApp();
	app.init();
	window.flowlyApp = app;
}
