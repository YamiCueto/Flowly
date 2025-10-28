/**
 * FLOWLY - Export Manager
 * Handles exporting diagrams to different formats
 */

export class ExportManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
    }

    /**
     * Export diagram to specified format
     */
    export(format) {
        switch(format) {
            case 'png':
                this.exportPNG();
                break;
            case 'jpg':
                this.exportJPG();
                break;
            case 'svg':
                this.exportSVG();
                break;
            case 'pdf':
                this.exportPDF();
                break;
            case 'json':
                this.exportJSON();
                break;
            default:
                throw new Error('Unknown export format: ' + format);
        }
    }

    /**
     * Export as PNG (high quality)
     */
    exportPNG() {
        const stage = this.canvasManager.getStage();
        
        // Get the bounding box of all shapes
        const shapes = this.canvasManager.mainLayer.children;
        if (shapes.length === 0) {
            alert('No hay elementos para exportar');
            return;
        }
        
        // Calculate bounds
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        shapes.forEach(shape => {
            const box = shape.getClientRect();
            minX = Math.min(minX, box.x);
            minY = Math.min(minY, box.y);
            maxX = Math.max(maxX, box.x + box.width);
            maxY = Math.max(maxY, box.y + box.height);
        });
        
        const padding = 20;
        const width = maxX - minX + padding * 2;
        const height = maxY - minY + padding * 2;
        
        // Export with white background
        const dataURL = stage.toDataURL({
            x: minX - padding,
            y: minY - padding,
            width: width,
            height: height,
            pixelRatio: 2, // High quality
            mimeType: 'image/png'
        });
        
        this.downloadFile(dataURL, 'diagram.png');
    }

    /**
     * Export as JPG
     */
    exportJPG() {
        const stage = this.canvasManager.getStage();
        
        const shapes = this.canvasManager.mainLayer.children;
        if (shapes.length === 0) {
            alert('No hay elementos para exportar');
            return;
        }
        
        // Calculate bounds
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        shapes.forEach(shape => {
            const box = shape.getClientRect();
            minX = Math.min(minX, box.x);
            minY = Math.min(minY, box.y);
            maxX = Math.max(maxX, box.x + box.width);
            maxY = Math.max(maxY, box.y + box.height);
        });
        
        const padding = 20;
        const width = maxX - minX + padding * 2;
        const height = maxY - minY + padding * 2;
        
        // Create temporary white background
        const tempRect = new Konva.Rect({
            x: minX - padding,
            y: minY - padding,
            width: width,
            height: height,
            fill: 'white'
        });
        
        this.canvasManager.mainLayer.add(tempRect);
        tempRect.moveToBottom();
        
        const dataURL = stage.toDataURL({
            x: minX - padding,
            y: minY - padding,
            width: width,
            height: height,
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
        const stage = this.canvasManager.getStage();
        
        const shapes = this.canvasManager.mainLayer.children;
        if (shapes.length === 0) {
            alert('No hay elementos para exportar');
            return;
        }
        
        // Calculate bounds
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        shapes.forEach(shape => {
            const box = shape.getClientRect();
            minX = Math.min(minX, box.x);
            minY = Math.min(minY, box.y);
            maxX = Math.max(maxX, box.x + box.width);
            maxY = Math.max(maxY, box.y + box.height);
        });
        
        const padding = 20;
        const width = maxX - minX + padding * 2;
        const height = maxY - minY + padding * 2;
        
        // Create SVG string
        let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX - padding} ${minY - padding} ${width} ${height}">
`;
        
        // Convert each shape to SVG
        shapes.forEach(shape => {
            svg += this.shapeToSVG(shape, minX - padding, minY - padding);
        });
        
        svg += '</svg>';
        
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.downloadFile(url, 'diagram.svg');
        URL.revokeObjectURL(url);
    }

    /**
     * Convert Konva shape to SVG element
     */
    shapeToSVG(shape, offsetX, offsetY) {
        const attrs = shape.attrs;
        const className = shape.getClassName();
        
        const x = shape.x() - offsetX;
        const y = shape.y() - offsetY;
        const fill = attrs.fill || 'none';
        const stroke = attrs.stroke || 'none';
        const strokeWidth = attrs.strokeWidth || 0;
        const opacity = attrs.opacity !== undefined ? attrs.opacity : 1;
        
        let svg = '';
        
        switch(className) {
            case 'Rect':
                const width = shape.width() * shape.scaleX();
                const height = shape.height() * shape.scaleY();
                const cornerRadius = attrs.cornerRadius || 0;
                svg = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${cornerRadius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
                break;
                
            case 'Circle':
                const radius = attrs.radius * shape.scaleX();
                svg = `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
                break;
                
            case 'Ellipse':
                const rx = attrs.radiusX * shape.scaleX();
                const ry = attrs.radiusY * shape.scaleY();
                svg = `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
                break;
                
            case 'RegularPolygon':
                const sides = attrs.sides;
                const polygonRadius = attrs.radius * shape.scaleX();
                const rotation = (attrs.rotation || 0) * Math.PI / 180;
                let points = '';
                
                for (let i = 0; i < sides; i++) {
                    const angle = (i * 2 * Math.PI / sides) + rotation;
                    const px = x + polygonRadius * Math.cos(angle);
                    const py = y + polygonRadius * Math.sin(angle);
                    points += `${px},${py} `;
                }
                
                svg = `<polygon points="${points.trim()}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
                break;
                
            case 'Line':
                const linePoints = attrs.points || [];
                let pathData = '';
                for (let i = 0; i < linePoints.length; i += 2) {
                    const px = x + linePoints[i];
                    const py = y + linePoints[i + 1];
                    pathData += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
                }
                svg = `<path d="${pathData}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round" />`;
                break;
                
            case 'Arrow':
                const arrowPoints = attrs.points || [];
                let arrowPath = '';
                for (let i = 0; i < arrowPoints.length; i += 2) {
                    const px = x + arrowPoints[i];
                    const py = y + arrowPoints[i + 1];
                    arrowPath += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
                }
                
                // Add arrowhead
                const lastX = x + arrowPoints[arrowPoints.length - 2];
                const lastY = y + arrowPoints[arrowPoints.length - 1];
                const prevX = x + arrowPoints[arrowPoints.length - 4];
                const prevY = y + arrowPoints[arrowPoints.length - 3];
                
                const angle = Math.atan2(lastY - prevY, lastX - prevX);
                const arrowLength = attrs.pointerLength || 10;
                const arrowWidth = attrs.pointerWidth || 10;
                
                const arrowTip1X = lastX - arrowLength * Math.cos(angle - Math.PI / 6);
                const arrowTip1Y = lastY - arrowLength * Math.sin(angle - Math.PI / 6);
                const arrowTip2X = lastX - arrowLength * Math.cos(angle + Math.PI / 6);
                const arrowTip2Y = lastY - arrowLength * Math.sin(angle + Math.PI / 6);
                
                svg = `<path d="${arrowPath}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round" />`;
                svg += `<polygon points="${lastX},${lastY} ${arrowTip1X},${arrowTip1Y} ${arrowTip2X},${arrowTip2Y}" fill="${stroke}" opacity="${opacity}" />`;
                break;
                
            case 'Text':
                const text = attrs.text || '';
                const fontSize = attrs.fontSize || 16;
                const fontFamily = attrs.fontFamily || 'Arial';
                const textFill = attrs.fill || '#000000';
                svg = `<text x="${x}" y="${y + fontSize}" font-size="${fontSize}" font-family="${fontFamily}" fill="${textFill}" opacity="${opacity}">${this.escapeXml(text)}</text>`;
                break;
        }
        
        return svg + '\n';
    }

    /**
     * Export as PDF
     */
    exportPDF() {
        const stage = this.canvasManager.getStage();
        
        const shapes = this.canvasManager.mainLayer.children;
        if (shapes.length === 0) {
            alert('No hay elementos para exportar');
            return;
        }
        
        // Get image data
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        shapes.forEach(shape => {
            const box = shape.getClientRect();
            minX = Math.min(minX, box.x);
            minY = Math.min(minY, box.y);
            maxX = Math.max(maxX, box.x + box.width);
            maxY = Math.max(maxY, box.y + box.height);
        });
        
        const padding = 20;
        const width = maxX - minX + padding * 2;
        const height = maxY - minY + padding * 2;
        
        const dataURL = stage.toDataURL({
            x: minX - padding,
            y: minY - padding,
            width: width,
            height: height,
            pixelRatio: 2
        });
        
        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        
        // Determine page orientation
        const orientation = width > height ? 'landscape' : 'portrait';
        const pdf = new jsPDF(orientation, 'pt', 'a4');
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate scale to fit
        const scale = Math.min(pageWidth / width, pageHeight / height) * 0.9;
        const imgWidth = width * scale;
        const imgHeight = height * scale;
        
        // Center the image
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        
        pdf.addImage(dataURL, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save('diagram.pdf');
    }

    /**
     * Export as JSON
     */
    exportJSON() {
        const data = this.canvasManager.toJSON();
        data.exportDate = new Date().toISOString();
        data.appName = 'Flowly ';
        
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
