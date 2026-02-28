/**
 * Flowly - Smart Guides Manager
 * Sistema de guías de alineación inteligentes con snap automático
 */

export class SmartGuides {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.guidesLayer = null;
        this.guides = [];
        this.snapThreshold = 5; // Distancia en píxeles para snap
        this.enabled = true;

        this.init();
    }

    /**
     * Inicializa el layer para las guías
     */
    init() {
        const stage = this.canvasManager.getStage();

        // Crear layer para las guías (arriba de todo)
        this.guidesLayer = new Konva.Layer();
        stage.add(this.guidesLayer);
        this.guidesLayer.moveToTop();

        // Always clean up guides when mouse is released anywhere (prevents ghost lines)
        this._onWindowMouseUp = () => this.clearGuides();
        window.addEventListener('mouseup', this._onWindowMouseUp);
    }

    /**
     * Habilita o deshabilita las smart guides
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.clearGuides();
        }
    }

    /**
     * Calcula y muestra las guías de alineación para una forma que se está moviendo
     */
    showGuides(movingShape) {
        if (!this.enabled) return null;

        this.clearGuides();

        const movingBox = movingShape.getClientRect();
        const movingCenter = {
            x: movingBox.x + movingBox.width / 2,
            y: movingBox.y + movingBox.height / 2
        };

        const snapPoints = {
            vertical: null,
            horizontal: null
        };

        // Obtener todas las otras formas del canvas
        const allShapes = this.canvasManager.mainLayer.getChildren((node) => {
            // Excluir la forma que se está moviendo, conectores y anchors
            if (node === movingShape) return false;
            if (node.name && (node.name() === 'connector' || node.name() === 'anchor')) {
                return false;
            }
            return node.getClassName() !== 'Group' || node.attrs.shapeType;
        });

        let minVerticalDist = Infinity;
        let minHorizontalDist = Infinity;

        // Buscar las formas más cercanas para alineación
        allShapes.forEach(shape => {
            const box = shape.getClientRect();
            const center = {
                x: box.x + box.width / 2,
                y: box.y + box.height / 2
            };

            // Alineación vertical (centros)
            const verticalDist = Math.abs(center.x - movingCenter.x);
            if (verticalDist < this.snapThreshold && verticalDist < minVerticalDist) {
                minVerticalDist = verticalDist;
                snapPoints.vertical = {
                    x: center.x,
                    type: 'center',
                    alignTo: shape
                };
            }

            // Alineación vertical (bordes izquierdos)
            const leftDist = Math.abs(box.x - movingBox.x);
            if (leftDist < this.snapThreshold && leftDist < minVerticalDist) {
                minVerticalDist = leftDist;
                snapPoints.vertical = {
                    x: box.x,
                    type: 'left',
                    alignTo: shape
                };
            }

            // Alineación vertical (bordes derechos)
            const rightDist = Math.abs((box.x + box.width) - (movingBox.x + movingBox.width));
            if (rightDist < this.snapThreshold && rightDist < minVerticalDist) {
                minVerticalDist = rightDist;
                snapPoints.vertical = {
                    x: box.x + box.width,
                    type: 'right',
                    alignTo: shape
                };
            }

            // Alineación horizontal (centros)
            const horizontalDist = Math.abs(center.y - movingCenter.y);
            if (horizontalDist < this.snapThreshold && horizontalDist < minHorizontalDist) {
                minHorizontalDist = horizontalDist;
                snapPoints.horizontal = {
                    y: center.y,
                    type: 'center',
                    alignTo: shape
                };
            }

            // Alineación horizontal (bordes superiores)
            const topDist = Math.abs(box.y - movingBox.y);
            if (topDist < this.snapThreshold && topDist < minHorizontalDist) {
                minHorizontalDist = topDist;
                snapPoints.horizontal = {
                    y: box.y,
                    type: 'top',
                    alignTo: shape
                };
            }

            // Alineación horizontal (bordes inferiores)
            const bottomDist = Math.abs((box.y + box.height) - (movingBox.y + movingBox.height));
            if (bottomDist < this.snapThreshold && bottomDist < minHorizontalDist) {
                minHorizontalDist = bottomDist;
                snapPoints.horizontal = {
                    y: box.y + box.height,
                    type: 'bottom',
                    alignTo: shape
                };
            }
        });

        // Dibujar las guías
        this.drawGuides(snapPoints, movingBox);

        return snapPoints;
    }

    /**
     * Dibuja las líneas guía en el canvas
     */
    drawGuides(snapPoints, movingBox) {
        const stage = this.canvasManager.getStage();
        const stageWidth = stage.width();
        const stageHeight = stage.height();

        // Guía vertical
        if (snapPoints.vertical) {
            const verticalLine = new Konva.Line({
                points: [snapPoints.vertical.x, 0, snapPoints.vertical.x, stageHeight],
                stroke: '#e74c3c',
                strokeWidth: 1,
                dash: [4, 4],
                listening: false
            });
            this.guides.push(verticalLine);
            this.guidesLayer.add(verticalLine);
        }

        // Guía horizontal
        if (snapPoints.horizontal) {
            const horizontalLine = new Konva.Line({
                points: [0, snapPoints.horizontal.y, stageWidth, snapPoints.horizontal.y],
                stroke: '#e74c3c',
                strokeWidth: 1,
                dash: [4, 4],
                listening: false
            });
            this.guides.push(horizontalLine);
            this.guidesLayer.add(horizontalLine);
        }

        this.guidesLayer.draw();
    }

    /**
     * Limpia todas las guías visibles
     */
    clearGuides() {
        this.guides.forEach(guide => guide.destroy());
        this.guides = [];
        this.guidesLayer.draw();
    }

    /**
     * Calcula la posición con snap aplicado
     */
    getSnappedPosition(movingShape, snapPoints) {
        if (!snapPoints) return null;

        const movingBox = movingShape.getClientRect();
        const movingCenter = {
            x: movingBox.x + movingBox.width / 2,
            y: movingBox.y + movingBox.height / 2
        };

        const snapped = {};

        // Snap vertical
        if (snapPoints.vertical) {
            switch (snapPoints.vertical.type) {
                case 'center':
                    snapped.x = snapPoints.vertical.x - movingBox.width / 2;
                    break;
                case 'left':
                    snapped.x = snapPoints.vertical.x;
                    break;
                case 'right':
                    snapped.x = snapPoints.vertical.x - movingBox.width;
                    break;
            }
        }

        // Snap horizontal
        if (snapPoints.horizontal) {
            switch (snapPoints.horizontal.type) {
                case 'center':
                    snapped.y = snapPoints.horizontal.y - movingBox.height / 2;
                    break;
                case 'top':
                    snapped.y = snapPoints.horizontal.y;
                    break;
                case 'bottom':
                    snapped.y = snapPoints.horizontal.y - movingBox.height;
                    break;
            }
        }

        return snapped;
    }

    /**
     * Destruye el manager y limpia recursos
     */
    destroy() {
        this.clearGuides();
        if (this._onWindowMouseUp) {
            window.removeEventListener('mouseup', this._onWindowMouseUp);
        }
        if (this.guidesLayer) {
            this.guidesLayer.destroy();
        }
    }
}
