/**
 * Flowly - Lasso Selection Manager
 * Gestiona la selección múltiple por arrastre (rectángulo de selección)
 */

export class LassoSelection {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.isSelecting = false;
        this.selectionRect = null;
        this.startPos = null;
        this.selectionLayer = null;
        
        this.init();
    }

    /**
     * Inicializa el layer para la selección lasso
     */
    init() {
        const stage = this.canvasManager.getStage();
        
        // Crear layer para el rectángulo de selección
        this.selectionLayer = new Konva.Layer();
        stage.add(this.selectionLayer);
        this.selectionLayer.moveToTop();
        
        // Crear el rectángulo de selección (inicialmente oculto)
        this.selectionRect = new Konva.Rect({
            fill: 'rgba(52, 152, 219, 0.1)',
            stroke: '#3498db',
            strokeWidth: 1,
            dash: [5, 5],
            visible: false
        });
        
        this.selectionLayer.add(this.selectionRect);
    }

    /**
     * Inicia la selección lasso
     */
    start(pos) {
        this.isSelecting = true;
        this.startPos = { x: pos.x, y: pos.y };
        
        this.selectionRect.setAttrs({
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            visible: true
        });
        
        this.selectionLayer.draw();
    }

    /**
     * Actualiza el rectángulo de selección mientras se arrastra
     */
    update(pos) {
        if (!this.isSelecting || !this.startPos) return;

        const x = Math.min(this.startPos.x, pos.x);
        const y = Math.min(this.startPos.y, pos.y);
        const width = Math.abs(pos.x - this.startPos.x);
        const height = Math.abs(pos.y - this.startPos.y);

        this.selectionRect.setAttrs({
            x: x,
            y: y,
            width: width,
            height: height
        });

        this.selectionLayer.draw();
    }

    /**
     * Finaliza la selección y selecciona las formas dentro del rectángulo
     */
    finish(shiftKey = false) {
        if (!this.isSelecting) return;

        const box = this.selectionRect.getClientRect();
        const selectedShapes = [];

        // Obtener todas las formas del mainLayer
        const shapes = this.canvasManager.mainLayer.getChildren((node) => {
            // Excluir grupos de conectores y anchors
            if (node.name && (node.name() === 'connector' || node.name() === 'anchor')) {
                return false;
            }
            return node.getClassName() !== 'Group' || node.attrs.shapeType;
        });

        // Verificar qué formas están dentro del rectángulo de selección
        shapes.forEach(shape => {
            if (this.isShapeInSelection(shape, box)) {
                selectedShapes.push(shape);
            }
        });

        // Limpiar selección anterior si no se mantiene Shift
        if (!shiftKey) {
            this.canvasManager.clearSelection();
        }

        // Seleccionar todas las formas encontradas
        selectedShapes.forEach(shape => {
            this.canvasManager.addToSelection(shape);
        });

        // Ocultar rectángulo de selección
        this.selectionRect.visible(false);
        this.selectionLayer.draw();

        // Resetear estado
        this.isSelecting = false;
        this.startPos = null;
    }

    /**
     * Cancela la selección
     */
    cancel() {
        this.isSelecting = false;
        this.startPos = null;
        this.selectionRect.visible(false);
        this.selectionLayer.draw();
    }

    /**
     * Verifica si una forma está dentro del rectángulo de selección
     */
    isShapeInSelection(shape, selectionBox) {
        const shapeBox = shape.getClientRect();
        
        // Verificar intersección o contención completa
        return !(
            shapeBox.x + shapeBox.width < selectionBox.x ||
            shapeBox.x > selectionBox.x + selectionBox.width ||
            shapeBox.y + shapeBox.height < selectionBox.y ||
            shapeBox.y > selectionBox.y + selectionBox.height
        );
    }

    /**
     * Verifica si está en proceso de selección
     */
    isActive() {
        return this.isSelecting;
    }
}
