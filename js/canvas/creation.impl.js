export function copyImpl(canvas) {
    if (canvas.selectedShapes.length === 0) return;
    canvas.clipboard = canvas.selectedShapes.map(shape => shape.toObject());
}

export function pasteImpl(canvas) {
    if (!canvas.clipboard || canvas.clipboard.length === 0) return;

    canvas.clearSelection();

    canvas.clipboard.forEach(shapeData => {
        const shape = createShapeFromDataImpl(canvas, shapeData);
        if (shape) {
            // Offset the pasted shape
            shape.x(shape.x() + 20);
            shape.y(shape.y() + 20);
            canvas.addShape(shape, false);
            if (typeof canvas.addToSelection === 'function') canvas.addToSelection(shape);
        }
    });

    canvas.saveHistory();
}

export function createShapeFromDataImpl(canvas, data) {
    const className = data.className;
    // clone data so we don't mutate caller's object
    const cfg = Object.assign({}, data);
    delete cfg.className;

    let shape;
    switch (className) {
        case 'Rect':
            shape = new Konva.Rect(cfg);
            break;
        case 'Circle':
            shape = new Konva.Circle(cfg);
            break;
        case 'Ellipse':
            shape = new Konva.Ellipse(cfg);
            break;
        case 'RegularPolygon':
            shape = new Konva.RegularPolygon(cfg);
            break;
        case 'Line':
            shape = new Konva.Line(cfg);
            break;
        case 'Arrow':
            shape = new Konva.Arrow(cfg);
            break;
        case 'Text':
            shape = new Konva.Text(cfg);
            break;
        case 'Group':
            shape = new Konva.Group(cfg);
            // Restore children if serialized
            if (Array.isArray(data.children)) {
                data.children.forEach(childData => {
                    const child = createShapeFromDataImpl(canvas, childData);
                    if (child) shape.add(child);
                });
            }
            break;
        case 'Image': {
            // Restore as a placeholder rect since Image src is not serializable
            const imgCfg = Object.assign({}, cfg);
            delete imgCfg.image;
            shape = new Konva.Rect({ ...imgCfg, fill: imgCfg.fill || '#D0BCFF', stroke: imgCfg.stroke || '#6750A4' });
            break;
        }
        default:
            console.warn('Unknown shape type:', className);
            return null;
    }

    shape.draggable(true);
    return shape;
}
