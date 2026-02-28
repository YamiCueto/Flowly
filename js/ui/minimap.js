/**
 * Flowly - Mini-mapa de Navegación
 * Proporciona una vista general del canvas para navegación rápida
 */

export class Minimap {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.container = null;
        this.minimapCanvas = null;
        this.ctx = null;
        this.viewportRect = null;
        this.isDragging = false;
        this.scale = 0.1; // Escala del mini-mapa (10% del tamaño real)
        this.visible = true;

        this.init();
    }

    /**
     * Inicializa el mini-mapa
     */
    init() {
        // Crear contenedor del mini-mapa
        this.container = document.createElement('div');
        this.container.id = 'minimap-container';
        this.container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 200px;
            height: 150px;
            background: white;
            border: 2px solid #3498db;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            overflow: hidden;
            cursor: pointer;
        `;

        // Crear canvas del mini-mapa
        this.minimapCanvas = document.createElement('canvas');
        this.minimapCanvas.width = 200;
        this.minimapCanvas.height = 150;
        this.ctx = this.minimapCanvas.getContext('2d');

        this.container.addEventListener('click', () => this.toggle());
        document.body.appendChild(this.container);

        // Setup events
        this.setupEvents();

        // Initial render
        this.render();
    }

    /**
     * Setup eventos del mini-mapa (event-driven, no polling)
     */
    setupEvents() {
        // Click para navegar
        this.minimapCanvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.navigateToPosition(e);
        });

        this.minimapCanvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) this.navigateToPosition(e);
        });

        this.minimapCanvas.addEventListener('mouseup', () => { this.isDragging = false; });
        this.minimapCanvas.addEventListener('mouseleave', () => { this.isDragging = false; });

        // Re-render on meaningful canvas events (no polling)
        this.canvasManager.on('historyChanged', () => this.render());
        this.canvasManager.on('zoomChanged', () => this.render());
        this.canvasManager.on('selectionChanged', () => this.render());

        // Also re-render after drag ends on any shape
        if (this.canvasManager.mainLayer) {
            this.canvasManager.mainLayer.on('dragend', () => this.render());
        }
    }

    /**
     * Navega a una posición en el canvas principal
     */
    navigateToPosition(e) {
        const rect = this.minimapCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const stage = this.canvasManager.getStage();
        const scale = stage.scaleX();

        // Calcular posición en el canvas principal
        const targetX = -(x / this.scale - stage.width() / 2);
        const targetY = -(y / this.scale - stage.height() / 2);

        stage.position({ x: targetX, y: targetY });
        stage.batchDraw();

        this.render();
    }

    /**
     * Renderiza el mini-mapa
     */
    render() {
        if (!this.visible) return;

        const stage = this.canvasManager.getStage();
        const mainLayer = this.canvasManager.mainLayer;

        // Limpiar
        this.ctx.clearRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);

        // Fondo
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);

        // Dibujar formas
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);

        mainLayer.children.forEach(shape => {
            if (shape.name && (shape.name() === 'connector' || shape.name() === 'anchor')) {
                return;
            }

            const x = shape.x();
            const y = shape.y();

            this.ctx.fillStyle = shape.fill() || '#3498db';
            this.ctx.strokeStyle = shape.stroke() || '#2c3e50';
            this.ctx.lineWidth = 1;

            const className = shape.getClassName();

            if (className === 'Rect') {
                this.ctx.fillRect(x, y, shape.width(), shape.height());
                this.ctx.strokeRect(x, y, shape.width(), shape.height());
            } else if (className === 'Circle') {
                this.ctx.beginPath();
                this.ctx.arc(x, y, shape.radius(), 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } else if (className === 'Ellipse') {
                this.ctx.beginPath();
                this.ctx.ellipse(x, y, shape.radiusX(), shape.radiusY(), 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            } else {
                // Formas genéricas como un punto
                this.ctx.fillRect(x - 2, y - 2, 4, 4);
            }
        });

        this.ctx.restore();

        // Dibujar viewport (área visible)
        const pos = stage.position();
        const scale = stage.scaleX();

        const viewportX = (-pos.x / scale) * this.scale;
        const viewportY = (-pos.y / scale) * this.scale;
        const viewportW = (stage.width() / scale) * this.scale;
        const viewportH = (stage.height() / scale) * this.scale;

        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(viewportX, viewportY, viewportW, viewportH);

        // Semi-transparente fuera del viewport
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.minimapCanvas.width, viewportY);
        this.ctx.fillRect(0, viewportY + viewportH, this.minimapCanvas.width, this.minimapCanvas.height);
        this.ctx.fillRect(0, viewportY, viewportX, viewportH);
        this.ctx.fillRect(viewportX + viewportW, viewportY, this.minimapCanvas.width, viewportH);
    }

    /**
     * Muestra/oculta el mini-mapa
     */
    toggle() {
        this.visible = !this.visible;
        this.container.style.display = this.visible ? 'block' : 'none';
        if (this.visible) {
            this.render();
        }
    }

    /**
     * Destruye el mini-mapa
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
