/**
 * FLOWLY - Export Manager
 * Handles exporting diagrams to different formats
 */

export class ExportManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        // Notification helper (use SweetAlert2 if available)
        this.notify = (message, opts = {}) => {
            try {
                if (window.Swal && typeof window.Swal.fire === 'function') {
                    window.Swal.fire({
                        text: message,
                        icon: opts.icon || 'warning',
                        toast: opts.toast !== undefined ? opts.toast : true,
                        position: opts.position || 'top-end',
                        showConfirmButton: false,
                        timer: opts.timer || 2000
                    });
                    return;
                }
            } catch (e) { }
            try { alert(message); } catch (e) { }
        };
    }

    /**
     * Export diagram to specified format
     */
    export(format) {
        switch (format) {
            case 'png': this.exportPNG(); break;
            case 'jpg': this.exportJPG(); break;
            case 'svg': this.exportSVG(); break;
            case 'pdf': this.exportPDF(); break;
            case 'json': this.exportJSON(); break;
            default: throw new Error('Unknown export format: ' + format);
        }
    }

    /**
     * Shared helper: compute bounding box of all visible shapes with padding
     */
    _getBounds(padding = 20) {
        const shapes = this.canvasManager.mainLayer.children;
        if (!shapes || shapes.length === 0) return null;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        shapes.forEach(shape => {
            try {
                const box = shape.getClientRect();
                minX = Math.min(minX, box.x);
                minY = Math.min(minY, box.y);
                maxX = Math.max(maxX, box.x + box.width);
                maxY = Math.max(maxY, box.y + box.height);
            } catch (e) { }
        });

        return {
            x: minX - padding,
            y: minY - padding,
            width: maxX - minX + padding * 2,
            height: maxY - minY + padding * 2
        };
    }

    /**
     * Export as PNG (high quality)
     */
    exportPNG() {
        const stage = this.canvasManager.getStage();
        const bounds = this._getBounds();
        if (!bounds) { this.notify('No hay elementos para exportar', { icon: 'warning' }); return; }

        const dataURL = stage.toDataURL({
            ...bounds,
            pixelRatio: 2,
            mimeType: 'image/png'
        });
        this.downloadFile(dataURL, 'diagram.png');
    }

    /**
     * Export as JPG
     */
    exportJPG() {
        const stage = this.canvasManager.getStage();
        const bounds = this._getBounds();
        if (!bounds) { this.notify('No hay elementos para exportar', { icon: 'warning' }); return; }

        // White background rect
        const tempRect = new Konva.Rect({ ...bounds, fill: 'white' });
        this.canvasManager.mainLayer.add(tempRect);
        tempRect.moveToBottom();

        const dataURL = stage.toDataURL({
            ...bounds,
            pixelRatio: 2,
            mimeType: 'image/jpeg',
            quality: 0.9
        });

        tempRect.destroy();
        this.canvasManager.mainLayer.draw();
        this.downloadFile(dataURL, 'diagram.jpg');
    }

    /**
     * Export as SVG
     */
    exportSVG() {
        const bounds = this._getBounds();
        if (!bounds) { this.notify('No hay elementos para exportar', { icon: 'warning' }); return; }

        const shapes = this.canvasManager.mainLayer.children;
        const { x, y, width, height } = bounds;

        let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${x} ${y} ${width} ${height}">
`;
        shapes.forEach(shape => { svg += this.shapeToSVG(shape, x, y); });
        svg += '</svg>';

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.downloadFile(url, 'diagram.svg');
        setTimeout(() => { try { URL.revokeObjectURL(url); } catch (e) { } }, 1500);
    }

    /**
     * Convert Konva shape to SVG element
     */
    shapeToSVG(shape, offsetX, offsetY) {
        const attrs = shape.attrs || {};
        const className = shape.getClassName();

        // Use the absolute transform matrix so rotated/scaled shapes are preserved
        let matrix = [1, 0, 0, 1, 0, 0];
        try {
            const m = shape.getAbsoluteTransform().getMatrix();
            // Konva returns a Transform which exposes getMatrix() as array [a, b, c, d, e, f]
            matrix = m;
        } catch (e) {
            // fallback to identity
        }

        const transform = `matrix(${matrix.map(n => Number(n).toFixed(6)).join(' ')})`;

        const fill = attrs.fill || 'none';
        const stroke = attrs.stroke || 'none';
        const strokeWidth = attrs.strokeWidth || 0;
        const opacity = attrs.opacity !== undefined ? attrs.opacity : 1;

        let svg = '';

        switch (className) {
            case 'Rect': {
                const width = shape.width();
                const height = shape.height();
                const cornerRadius = attrs.cornerRadius || 0;
                svg = `<rect x="0" y="0" width="${width}" height="${height}" rx="${cornerRadius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" transform="${transform}" />`;
                break;
            }
            case 'Circle': {
                const radius = attrs.radius || 0;
                svg = `<circle cx="0" cy="0" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" transform="${transform}" />`;
                break;
            }
            case 'Ellipse': {
                const rx = attrs.radiusX || 0;
                const ry = attrs.radiusY || 0;
                svg = `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" transform="${transform}" />`;
                break;
            }
            case 'RegularPolygon': {
                const sides = attrs.sides || 3;
                const polygonRadius = attrs.radius || 0;
                const rotation = (attrs.rotation || 0) * Math.PI / 180;
                let points = '';
                for (let i = 0; i < sides; i++) {
                    const angle = (i * 2 * Math.PI / sides) + rotation;
                    const px = polygonRadius * Math.cos(angle);
                    const py = polygonRadius * Math.sin(angle);
                    points += `${px},${py} `;
                }
                svg = `<polygon points="${points.trim()}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" transform="${transform}" />`;
                break;
            }
            case 'Line': {
                const linePoints = attrs.points || [];
                let pathData = '';
                for (let i = 0; i < linePoints.length; i += 2) {
                    const px = linePoints[i];
                    const py = linePoints[i + 1];
                    pathData += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
                }
                svg = `<path d="${pathData}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round" transform="${transform}" />`;
                break;
            }
            case 'Arrow': {
                const arrowPoints = attrs.points || [];
                let arrowPath = '';
                for (let i = 0; i < arrowPoints.length; i += 2) {
                    const px = arrowPoints[i];
                    const py = arrowPoints[i + 1];
                    arrowPath += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
                }

                // Add arrowhead using last two points if available
                let arrowHead = '';
                if (arrowPoints.length >= 4) {
                    const lastX = arrowPoints[arrowPoints.length - 2];
                    const lastY = arrowPoints[arrowPoints.length - 1];
                    const prevX = arrowPoints[arrowPoints.length - 4];
                    const prevY = arrowPoints[arrowPoints.length - 3];
                    const angle = Math.atan2(lastY - prevY, lastX - prevX);
                    const arrowLength = attrs.pointerLength || 10;
                    const arrowTip1X = lastX - arrowLength * Math.cos(angle - Math.PI / 6);
                    const arrowTip1Y = lastY - arrowLength * Math.sin(angle - Math.PI / 6);
                    const arrowTip2X = lastX - arrowLength * Math.cos(angle + Math.PI / 6);
                    const arrowTip2Y = lastY - arrowLength * Math.sin(angle + Math.PI / 6);
                    arrowHead = `<polygon points="${lastX},${lastY} ${arrowTip1X},${arrowTip1Y} ${arrowTip2X},${arrowTip2Y}" fill="${stroke}" opacity="${opacity}" transform="${transform}" />`;
                }

                svg = `<path d="${arrowPath}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round" transform="${transform}" />`;
                svg += arrowHead;
                break;
            }
            case 'Text': {
                const text = attrs.text || '';
                const fontSize = attrs.fontSize || 16;
                const fontFamily = attrs.fontFamily || 'Arial';
                const textFill = attrs.fill || '#000000';
                // place text at local origin; vertical offset by fontSize for baseline
                svg = `<text x="0" y="${fontSize}" font-size="${fontSize}" font-family="${fontFamily}" fill="${textFill}" opacity="${opacity}" transform="${transform}">${this.escapeXml(text)}</text>`;
                break;
            }
        }

        return svg + '\n';
    }

    /**
     * Export as PDF
     */
    exportPDF() {
        const stage = this.canvasManager.getStage();
        const bounds = this._getBounds();
        if (!bounds) { this.notify('No hay elementos para exportar', { icon: 'warning' }); return; }

        const dataURL = stage.toDataURL({ ...bounds, pixelRatio: 2 });

        if (!window.jspdf || !window.jspdf.jsPDF) {
            this.notify('jsPDF no está disponible.', { icon: 'error' });
            return;
        }

        const { jsPDF } = window.jspdf;
        const orientation = bounds.width > bounds.height ? 'landscape' : 'portrait';
        const pdf = new jsPDF(orientation, 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const scale = Math.min(pageWidth / bounds.width, pageHeight / bounds.height) * 0.9;
        const imgWidth = bounds.width * scale;
        const imgHeight = bounds.height * scale;
        pdf.addImage(dataURL, 'PNG', (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);
        pdf.save('diagram.pdf');
    }

    /**
     * Export as JSON
     */
    exportJSON() {
        const data = this.canvasManager.toJSON();
        data.exportDate = new Date().toISOString();
        data.appName = 'Flowly';

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        this.downloadFile(url, 'diagram.json');
        URL.revokeObjectURL(url);
    }

    /**
     * Download file helper
     */
    downloadFile(url, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Escape XML special characters
     */
    escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}
