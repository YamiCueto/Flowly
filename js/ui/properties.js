// Properties panel wiring
export function setupPropertiesPanel(app) {
    // Fill color
    const fillColorInput = document.getElementById('fill-color');
    const fillColorText = document.getElementById('fill-color-text');

    if (fillColorInput) fillColorInput.addEventListener('input', (e) => {
        fillColorText.value = e.target.value;
        app.canvasManager.updateSelectedProperty('fill', e.target.value);
    });

    if (fillColorText) fillColorText.addEventListener('change', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            fillColorInput.value = color;
            app.canvasManager.updateSelectedProperty('fill', color);
        }
    });

    // Stroke color
    const strokeColorInput = document.getElementById('stroke-color');
    const strokeColorText = document.getElementById('stroke-color-text');
    if (strokeColorInput) strokeColorInput.addEventListener('input', (e) => {
        strokeColorText.value = e.target.value;
        app.canvasManager.updateSelectedProperty('stroke', e.target.value);
    });
    if (strokeColorText) strokeColorText.addEventListener('change', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            strokeColorInput.value = color;
            app.canvasManager.updateSelectedProperty('stroke', color);
        }
    });

    // Connector controls
    const connectorType = document.getElementById('connector-type');
    const connectorStroke = document.getElementById('connector-stroke-color');
    const connectorStrokeText = document.getElementById('connector-stroke-color-text');
    const connectorWidth = document.getElementById('connector-stroke-width');
    const connectorDashed = document.getElementById('connector-dashed');
    const connectorArrowhead = document.getElementById('connector-arrowhead');
    const connectorCurvature = document.getElementById('connector-curvature');
    const connectorCurvatureValue = document.getElementById('connector-curvature-value');

    const updateConnectorSelection = () => {
        const sel = app.canvasManager.selectedShapes[0];
        if (!sel || !app.connectorsManager) return;
        const conn = app.connectorsManager.findConnectorByArrow(sel);
        if (!conn) return;

        // Get theme-aware default stroke
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const defaultStroke = isDarkMode ? '#60A5FA' : '#2c3e50';

        const opts = {
            stroke: connectorStroke.value || defaultStroke,
            strokeWidth: parseInt(connectorWidth.value, 10) || 2,
            dash: connectorDashed.checked ? [6, 4] : [],
            type: connectorType.value,
            curvature: parseFloat(connectorCurvature.value)
        };

        if (connectorArrowhead.checked) {
            opts.pointerLength = conn.options.pointerLength || 10;
            opts.pointerWidth = conn.options.pointerWidth || 10;
        } else {
            opts.pointerLength = 0;
            opts.pointerWidth = 0;
        }

        app.connectorsManager.updateConnectorStyle(conn.id, opts);
    };

    if (connectorType) connectorType.addEventListener('change', (e) => { document.getElementById('connector-curvature-row').style.display = (e.target.value === 'bezier') ? 'block' : 'none'; updateConnectorSelection(); });
    if (connectorStroke) connectorStroke.addEventListener('input', (e) => { connectorStrokeText.value = e.target.value; updateConnectorSelection(); });
    if (connectorStrokeText) connectorStrokeText.addEventListener('change', (e) => { const c = e.target.value; if (/^#[0-9A-F]{6}$/i.test(c)) { connectorStroke.value = c; updateConnectorSelection(); } });
    if (connectorWidth) connectorWidth.addEventListener('input', (e) => { document.getElementById('connector-stroke-width-value').textContent = e.target.value + 'px'; updateConnectorSelection(); });
    if (connectorDashed) connectorDashed.addEventListener('change', updateConnectorSelection);
    if (connectorArrowhead) connectorArrowhead.addEventListener('change', updateConnectorSelection);
    if (connectorCurvature) connectorCurvature.addEventListener('input', (e) => { connectorCurvatureValue.textContent = parseFloat(e.target.value).toFixed(2); updateConnectorSelection(); });

    // Stroke width
    const strokeWidthRange = document.getElementById('stroke-width');
    if (strokeWidthRange) strokeWidthRange.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('stroke-width-value').textContent = value + 'px';
        app.canvasManager.updateSelectedProperty('strokeWidth', value);
    });

    // Opacity
    const opacityRange = document.getElementById('opacity');
    if (opacityRange) opacityRange.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('opacity-value').textContent = value + '%';
        app.canvasManager.updateSelectedProperty('opacity', value / 100);
    });

    // Text properties
    const fontSizeInput = document.getElementById('font-size');
    if (fontSizeInput) fontSizeInput.addEventListener('change', (e) => { app.canvasManager.updateSelectedProperty('fontSize', parseInt(e.target.value)); });
    const textColorInput = document.getElementById('text-color');
    const textColorText = document.getElementById('text-color-text');
    if (textColorInput) textColorInput.addEventListener('input', (e) => { textColorText.value = e.target.value; app.canvasManager.updateSelectedProperty('fill', e.target.value); });

    // Position and size
    ['pos-x', 'pos-y', 'width', 'height'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', (e) => {
            const value = parseFloat(e.target.value);
            const property = id.includes('pos-') ? id.replace('pos-', '') : id;
            app.canvasManager.updateSelectedPosition(property, value);
        });
    });

    // Layer controls
    const bringFrontBtn = document.getElementById('bring-front-btn');
    const sendBackBtn = document.getElementById('send-back-btn');
    if (bringFrontBtn) bringFrontBtn.addEventListener('click', () => { app.canvasManager.bringToFront(); });
    if (sendBackBtn) sendBackBtn.addEventListener('click', () => { app.canvasManager.sendToBack(); });

    // Delete
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) deleteBtn.addEventListener('click', () => { app.canvasManager.deleteSelected(); });
}
