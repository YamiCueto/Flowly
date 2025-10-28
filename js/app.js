/**
 * FLOWLY - Main Application Entry Point
 * Initializes the canvas, event listeners, and application state
 */

import { CanvasManager } from './canvas-manager.js';
import { ToolManager } from './tools.js';
import { ExportManager } from './export-manager.js';
import { StorageManager } from './storage.js';
import { ConnectorsManager } from './connectors.js';

class FlowlyApp {
    constructor() {
        this.canvasManager = null;
        this.toolManager = null;
        this.exportManager = null;
        this.storageManager = null;
        this.connectorsManager = null;
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
        // Expose to canvas manager so it can create connectors during anchor-drag UX
        this.canvasManager.connectorsManager = this.connectorsManager;
        
        // Setup event listeners
        this.setupToolbar();
        this.setupKeyboardShortcuts();
        this.setupCanvasControls();
        this.setupPropertiesPanel();
        this.setupModals();
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
        
        console.log('✅ Flowly initialized successfully!');
        
        // Load last session if available
        this.loadLastSession();
    }

    /**
     * Setup toolbar button handlers
     */
    setupToolbar() {
        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.selectTool(tool);
            });
        });
        
        // Action buttons
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.canvasManager.undo();
        });
        
        document.getElementById('redo-btn').addEventListener('click', () => {
            this.canvasManager.redo();
        });
        
        document.getElementById('zoom-in-btn').addEventListener('click', () => {
            this.canvasManager.zoomIn();
            this.updateZoomDisplay();
        });
        
        document.getElementById('zoom-out-btn').addEventListener('click', () => {
            this.canvasManager.zoomOut();
            this.updateZoomDisplay();
        });
        
        document.getElementById('zoom-fit-btn').addEventListener('click', () => {
            this.canvasManager.fitToScreen();
            this.updateZoomDisplay();
        });
        
        document.getElementById('new-btn').addEventListener('click', () => {
            this.newProject();
        });
        
        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveProject();
        });
        
        document.getElementById('load-btn').addEventListener('click', () => {
            this.openLoadModal();
        });
        
        document.getElementById('export-btn').addEventListener('click', () => {
            this.openExportModal();
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            // Tool shortcuts
            if (!e.ctrlKey && !e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'v': this.selectTool('select'); break;
                    case 'r': this.selectTool('rectangle'); break;
                    case 'c': this.selectTool('circle'); break;
                    case 'l': this.selectTool('line'); break;
                    case 'a': this.selectTool('arrow'); break;
                    case 't': this.selectTool('text'); break;
                    case 'h': this.selectTool('pan'); break;
                    case 'delete': 
                    case 'backspace':
                        this.canvasManager.deleteSelected();
                        e.preventDefault();
                        break;
                }
            }
            
            // Ctrl/Cmd shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'z':
                        if (e.shiftKey) {
                            this.canvasManager.redo();
                        } else {
                            this.canvasManager.undo();
                        }
                        e.preventDefault();
                        break;
                    case 'y':
                        this.canvasManager.redo();
                        e.preventDefault();
                        break;
                    case 'c':
                        this.canvasManager.copy();
                        e.preventDefault();
                        break;
                    case 'v':
                        this.canvasManager.paste();
                        e.preventDefault();
                        break;
                    case 's':
                        this.saveProject();
                        e.preventDefault();
                        break;
                    case 'o':
                        this.openLoadModal();
                        e.preventDefault();
                        break;
                    case 'n':
                        this.newProject();
                        e.preventDefault();
                        break;
                }
            }
            
            // Zoom shortcuts
            if (e.key === '+' || e.key === '=') {
                this.canvasManager.zoomIn();
                this.updateZoomDisplay();
                e.preventDefault();
            } else if (e.key === '-') {
                this.canvasManager.zoomOut();
                this.updateZoomDisplay();
                e.preventDefault();
            }
        });
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
     * Setup properties panel controls
     */
    setupPropertiesPanel() {
        // Fill color
        const fillColorInput = document.getElementById('fill-color');
        const fillColorText = document.getElementById('fill-color-text');
        
        fillColorInput.addEventListener('input', (e) => {
            fillColorText.value = e.target.value;
            this.canvasManager.updateSelectedProperty('fill', e.target.value);
        });
        
        fillColorText.addEventListener('change', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                fillColorInput.value = color;
                this.canvasManager.updateSelectedProperty('fill', color);
            }
        });
        
        // Stroke color
        const strokeColorInput = document.getElementById('stroke-color');
        const strokeColorText = document.getElementById('stroke-color-text');
        
        strokeColorInput.addEventListener('input', (e) => {
            strokeColorText.value = e.target.value;
            this.canvasManager.updateSelectedProperty('stroke', e.target.value);
        });
        
        strokeColorText.addEventListener('change', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                strokeColorInput.value = color;
                this.canvasManager.updateSelectedProperty('stroke', color);
            }
        });

        // Connector controls
        const connectorProps = document.getElementById('connector-properties');
        const connectorType = document.getElementById('connector-type');
        const connectorStroke = document.getElementById('connector-stroke-color');
        const connectorStrokeText = document.getElementById('connector-stroke-color-text');
        const connectorWidth = document.getElementById('connector-stroke-width');
        const connectorWidthValue = document.getElementById('connector-stroke-width-value');
        const connectorDashed = document.getElementById('connector-dashed');
        const connectorArrowhead = document.getElementById('connector-arrowhead');
        const connectorCurvatureRow = document.getElementById('connector-curvature-row');
        const connectorCurvature = document.getElementById('connector-curvature');
        const connectorCurvatureValue = document.getElementById('connector-curvature-value');

        const updateConnectorSelection = () => {
            // Called when controls change to update the selected connector
            const sel = this.canvasManager.selectedShapes[0];
            if (!sel || !this.connectorsManager) return;
            const conn = this.connectorsManager.findConnectorByArrow(sel);
            if (!conn) return;

            const opts = {
                stroke: connectorStroke.value || '#2c3e50',
                strokeWidth: parseInt(connectorWidth.value, 10) || 2,
                dash: connectorDashed.checked ? [6, 4] : [],
                type: connectorType.value,
                curvature: parseFloat(connectorCurvature.value)
            };

            // pointer options
            if (connectorArrowhead.checked) {
                opts.pointerLength = conn.options.pointerLength || 10;
                opts.pointerWidth = conn.options.pointerWidth || 10;
            } else {
                opts.pointerLength = 0;
                opts.pointerWidth = 0;
            }

            this.connectorsManager.updateConnectorStyle(conn.id, opts);
        };

        // Wire events
        connectorType.addEventListener('change', (e) => {
            connectorCurvatureRow.style.display = (e.target.value === 'bezier') ? 'block' : 'none';
            updateConnectorSelection();
        });
        connectorStroke.addEventListener('input', (e) => { connectorStrokeText.value = e.target.value; updateConnectorSelection(); });
        connectorStrokeText.addEventListener('change', (e) => { const c = e.target.value; if (/^#[0-9A-F]{6}$/i.test(c)) { connectorStroke.value = c; updateConnectorSelection(); } });
        connectorWidth.addEventListener('input', (e) => { connectorWidthValue.textContent = e.target.value + 'px'; updateConnectorSelection(); });
        connectorDashed.addEventListener('change', updateConnectorSelection);
        connectorArrowhead.addEventListener('change', updateConnectorSelection);
        connectorCurvature.addEventListener('input', (e) => { connectorCurvatureValue.textContent = parseFloat(e.target.value).toFixed(2); updateConnectorSelection(); });
        
        // Stroke width
        document.getElementById('stroke-width').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('stroke-width-value').textContent = value + 'px';
            this.canvasManager.updateSelectedProperty('strokeWidth', value);
        });
        
        // Opacity
        document.getElementById('opacity').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('opacity-value').textContent = value + '%';
            this.canvasManager.updateSelectedProperty('opacity', value / 100);
        });
        
        // Text properties
        document.getElementById('font-size').addEventListener('change', (e) => {
            this.canvasManager.updateSelectedProperty('fontSize', parseInt(e.target.value));
        });
        
        const textColorInput = document.getElementById('text-color');
        const textColorText = document.getElementById('text-color-text');
        
        textColorInput.addEventListener('input', (e) => {
            textColorText.value = e.target.value;
            this.canvasManager.updateSelectedProperty('fill', e.target.value);
        });
        
        // Position and size
        ['pos-x', 'pos-y', 'width', 'height'].forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                const value = parseFloat(e.target.value);
                const property = id.includes('pos-') ? id.replace('pos-', '') : id;
                this.canvasManager.updateSelectedPosition(property, value);
            });
        });
        
        // Layer controls
        document.getElementById('bring-front-btn').addEventListener('click', () => {
            this.canvasManager.bringToFront();
        });
        
        document.getElementById('send-back-btn').addEventListener('click', () => {
            this.canvasManager.sendToBack();
        });
        
        // Delete button
        document.getElementById('delete-btn').addEventListener('click', () => {
            this.canvasManager.deleteSelected();
        });
    }

    /**
     * Setup modal dialogs
     */
    setupModals() {
        // Export modal
        const exportModal = document.getElementById('export-modal');
        const exportBtn = document.getElementById('export-btn');
        const exportClose = document.getElementById('export-modal-close');
        
        exportClose.addEventListener('click', () => {
            exportModal.classList.remove('active');
        });
        
        exportModal.addEventListener('click', (e) => {
            if (e.target === exportModal) {
                exportModal.classList.remove('active');
            }
        });
        
        // Export format buttons
        document.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                this.exportDiagram(format);
                exportModal.classList.remove('active');
            });
        });
        
        // Load modal
        const loadModal = document.getElementById('load-modal');
        const loadClose = document.getElementById('load-modal-close');
        
        loadClose.addEventListener('click', () => {
            loadModal.classList.remove('active');
        });
        
        loadModal.addEventListener('click', (e) => {
            if (e.target === loadModal) {
                loadModal.classList.remove('active');
            }
        });
        
        // File input
        const fileInput = document.getElementById('file-input');
        document.getElementById('load-file-btn').addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadFromFile(file);
                loadModal.classList.remove('active');
            }
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
    newProject() {
        if (confirm('¿Crear un nuevo proyecto? Los cambios no guardados se perderán.')) {
            this.canvasManager.clear();
            this.updateHistoryButtons();
        }
    }

    /**
     * Save project
     */
    saveProject() {
        const projectName = prompt('Nombre del proyecto:', 'Mi Diagrama');
        if (projectName) {
            this.storageManager.saveProject(projectName);
            alert('✅ Proyecto guardado correctamente');
        }
    }

    /**
     * Open load modal
     */
    openLoadModal() {
        const modal = document.getElementById('load-modal');
        const container = document.getElementById('saved-projects');
        
        // Load saved projects
        const projects = this.storageManager.listProjects();
        
        if (projects.length === 0) {
            container.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-folder-open"></i>
                    <p>No hay proyectos guardados</p>
                </div>
            `;
        } else {
            container.innerHTML = projects.map(project => `
                <div class="project-item" data-id="${project.id}">
                    <div class="project-info">
                        <div class="project-name">${project.name}</div>
                        <div class="project-date">${new Date(project.date).toLocaleString()}</div>
                    </div>
                    <div class="project-actions">
                        <button class="project-btn load-project" title="Cargar">
                            <i class="fas fa-folder-open"></i>
                        </button>
                        <button class="project-btn delete-project" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners
            container.querySelectorAll('.load-project').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const projectId = e.target.closest('.project-item').dataset.id;
                    this.loadProject(projectId);
                    modal.classList.remove('active');
                });
            });
            
            container.querySelectorAll('.delete-project').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const projectId = e.target.closest('.project-item').dataset.id;
                    if (confirm('¿Eliminar este proyecto?')) {
                        this.storageManager.deleteProject(projectId);
                        this.openLoadModal();
                    }
                });
            });
        }
        
        modal.classList.add('active');
    }

    /**
     * Load project
     */
    loadProject(projectId) {
        this.storageManager.loadProject(projectId);
        this.updateHistoryButtons();
    }

    /**
     * Load from file
     */
    loadFromFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.canvasManager.loadFromJSON(data);
                this.updateHistoryButtons();
            } catch (error) {
                alert('❌ Error al cargar el archivo: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    /**
     * Open export modal
     */
    openExportModal() {
        document.getElementById('export-modal').classList.add('active');
    }

    /**
     * Export diagram
     */
    exportDiagram(format) {
        try {
            this.exportManager.export(format);
            console.log(`✅ Exported as ${format.toUpperCase()}`);
        } catch (error) {
            alert('❌ Error al exportar: ' + error.message);
            console.error(error);
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
