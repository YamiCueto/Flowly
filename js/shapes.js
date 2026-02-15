/**
 * FLOWLY - Shape Factory
 * Creates different types of shapes with default properties
 */

export class ShapeFactory {
    static defaultProps = {
        fill: '#3498db',
        stroke: '#2c3e50',
        strokeWidth: 2,
        draggable: true,
        opacity: 1
    };

    static textProps = {
        fontSize: 16,
        fontFamily: 'Arial, sans-serif',
        fill: '#000000',
        align: 'left',
        draggable: true
    };

    static lineProps = {
        stroke: '#2c3e50',
        strokeWidth: 2,
        lineCap: 'round',
        lineJoin: 'round',
        draggable: true
    };

    /**
     * Create a shape based on type
     */
    static create(type, options = {}) {
        switch(type) {
            case 'rectangle':
                return this.createRectangle(options);
            case 'rounded-rectangle':
                return this.createRoundedRectangle(options);
            case 'circle':
                return this.createCircle(options);
            case 'ellipse':
                return this.createEllipse(options);
            case 'triangle':
                return this.createTriangle(options);
            case 'pentagon':
                return this.createPentagon(options);
            case 'hexagon':
                return this.createHexagon(options);
            case 'line':
                return this.createLine(options);
            case 'arrow':
                return this.createArrow(options);
            case 'text':
                return this.createText(options);
            default:
                console.warn('Unknown shape type:', type);
                return null;
        }
    }

    /**
     * Create rectangle
     */
    static createRectangle(options) {
        return new Konva.Rect({
            ...this.defaultProps,
            ...options
        });
    }

    /**
     * Create rounded rectangle
     */
    static createRoundedRectangle(options) {
        return new Konva.Rect({
            ...this.defaultProps,
            cornerRadius: 10,
            ...options
        });
    }

    /**
     * Create circle
     */
    static createCircle(options) {
        return new Konva.Circle({
            ...this.defaultProps,
            ...options
        });
    }

    /**
     * Create ellipse
     */
    static createEllipse(options) {
        return new Konva.Ellipse({
            ...this.defaultProps,
            ...options
        });
    }

    /**
     * Create triangle (using RegularPolygon)
     */
    static createTriangle(options) {
        return new Konva.RegularPolygon({
            ...this.defaultProps,
            sides: 3,
            rotation: -90, // Point up
            ...options
        });
    }

    /**
     * Create pentagon
     */
    static createPentagon(options) {
        return new Konva.RegularPolygon({
            ...this.defaultProps,
            sides: 5,
            rotation: -90,
            ...options
        });
    }

    /**
     * Create hexagon
     */
    static createHexagon(options) {
        return new Konva.RegularPolygon({
            ...this.defaultProps,
            sides: 6,
            rotation: -90,
            ...options
        });
    }

    /**
     * Create line
     */
    static createLine(options) {
        return new Konva.Line({
            ...this.lineProps,
            points: [0, 0, 100, 0],
            ...options
        });
    }

    /**
     * Create arrow
     */
    static createArrow(options) {
        return new Konva.Arrow({
            ...this.lineProps,
            points: [0, 0, 100, 0],
            pointerLength: 10,
            pointerWidth: 10,
            fill: options.stroke || this.lineProps.stroke,
            ...options
        });
    }

    /**
     * Create text
     */
    static createText(options) {
        // Detect current theme for text color
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDarkMode ? '#E6E0E9' : '#000000';
        
        return new Konva.Text({
            ...this.textProps,
            fill: textColor,
            text: 'Texto',
            ...options
        });
    }

    /**
     * Create connector (line that connects two shapes)
     */
    static createConnector(startShape, endShape, options = {}) {
        const startPos = startShape.position();
        const endPos = endShape.position();
        
        const arrow = new Konva.Arrow({
            ...this.lineProps,
            points: [
                startPos.x + startShape.width() / 2,
                startPos.y + startShape.height() / 2,
                endPos.x + endShape.width() / 2,
                endPos.y + endShape.height() / 2
            ],
            pointerLength: 10,
            pointerWidth: 10,
            fill: options.stroke || this.lineProps.stroke,
            ...options
        });
        
        // Update connector when shapes move
        const updateConnector = () => {
            const start = startShape.position();
            const end = endShape.position();
            
            arrow.points([
                start.x + startShape.width() / 2,
                start.y + startShape.height() / 2,
                end.x + endShape.width() / 2,
                end.y + endShape.height() / 2
            ]);
        };
        
        startShape.on('dragmove', updateConnector);
        endShape.on('dragmove', updateConnector);
        
        return arrow;
    }

    /**
     * Get default properties for a shape type
     */
    static getDefaultProps(type) {
        switch(type) {
            case 'text':
                return { ...this.textProps };
            case 'line':
            case 'arrow':
                return { ...this.lineProps };
            default:
                return { ...this.defaultProps };
        }
    }
}
