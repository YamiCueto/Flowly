/**
 * Context Menu UI for node right-click actions
 */
export function setupContextMenu(app) {
	const container = document.body;

	// Create menu element
	const menu = document.createElement('div');
	menu.className = 'flowly-context-menu';
	menu.style.position = 'absolute';
	menu.style.zIndex = 10000;
	menu.style.background = '#ffffff';
	menu.style.border = '1px solid rgba(0,0,0,0.12)';
	menu.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';
	menu.style.padding = '6px';
	menu.style.borderRadius = '4px';
	menu.style.display = 'none';
	menu.style.minWidth = '160px';
	menu.style.fontFamily = 'Arial, sans-serif';

	// Build inner HTML
	menu.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:6px">
            <button data-action="delete" class="btn btn-sm btn-light">Eliminar</button>
            <button data-action="connect" class="btn btn-sm btn-light">Conectar a...</button>
            <label style="display:flex;align-items:center;gap:8px;margin:0">
                <span style="font-size:12px;color:#333">Relleno</span>
                <input data-action="fill" type="color" style="height:28px;width:44px;border:0;padding:0;background:transparent" />
            </label>
            <button data-action="edit" class="btn btn-sm btn-light">Editar texto</button>
        </div>
    `;

	container.appendChild(menu);

	let currentTarget = null;

	const hideMenu = () => {
		menu.style.display = 'none';
		currentTarget = null;
	};

	// Utility: position menu at client coords but keep inside viewport
	const positionMenu = (clientX, clientY) => {
		const pad = 8;
		const rect = menu.getBoundingClientRect();
		let left = clientX;
		let top = clientY;
		if (left + rect.width + pad > window.innerWidth) left = window.innerWidth - rect.width - pad;
		if (top + rect.height + pad > window.innerHeight) top = window.innerHeight - rect.height - pad;
		menu.style.left = `${Math.max(4, left)}px`;
		menu.style.top = `${Math.max(4, top)}px`;
		menu.style.display = 'block';
	};

	// Listen for contextmenu on the Konva stage container
	const stage = app.canvasManager.getStage();
	if (!stage) return; // defensive

	// Hide on any click outside
	document.addEventListener('click', (e) => {
		if (!menu.contains(e.target)) hideMenu();
	});

	// Prevent native context menu on canvas container
	const content = stage.container();
	if (content) {
		content.addEventListener('contextmenu', (e) => e.preventDefault());
	}

	// Main handler: show menu when right-clicking a shape
	const onContext = (e) => {
		try {
			e.evt && e.evt.preventDefault && e.evt.preventDefault();
		} catch (ex) { }

		// If DOM event, extract client coords; else try to use pointer pos
		let clientX = (e.evt && e.evt.clientX) || (e.clientX) || 0;
		let clientY = (e.evt && e.evt.clientY) || (e.clientY) || 0;

		// Compute stage coords for hit testing
		let pointer = app.canvasManager.getStage().getPointerPosition();
		if (!pointer) {
			const rect = content.getBoundingClientRect();
			pointer = { x: clientX - rect.left, y: clientY - rect.top };
		}

		const target = app.canvasManager.getStage().getIntersection(pointer);
		if (!target) {
			hideMenu();
			return;
		}

		// Avoid Transformer or anchors
		const cls = target.getClassName ? target.getClassName() : '';
		if (cls === 'Transformer' || target.name && target.name() === 'anchor') {
			hideMenu();
			return;
		}

		currentTarget = target;

		// Pre-fill color input if available
		const colorInput = menu.querySelector('input[data-action="fill"]');
		try {
			const fill = target.attrs && target.attrs.fill ? target.attrs.fill : '#3498db';
			colorInput.value = fill;
		} catch (e) { }

		positionMenu(clientX, clientY);
	};

	// Attach Konva contextmenu event (try both variants)
	try {
		stage.on('contentContextmenu', onContext);
	} catch (e) { }
	try {
		stage.on('contextmenu', onContext);
	} catch (e) { }

	// Button handlers
	menu.addEventListener('click', (ev) => {
		ev.stopPropagation();
		const btn = ev.target.closest('[data-action]');
		if (!btn) return;
		const action = btn.getAttribute('data-action');
		const target = currentTarget;
		if (!target) return hideMenu();

		switch (action) {
			case 'delete':
				app.canvasManager.selectShape(target);
				app.canvasManager.deleteSelected();
				hideMenu();
				break;
			case 'connect': {
				hideMenu();
				app._pendingConnectionSource = target;
				// notify user (non-blocking)
				if (app.notify) app.notify('Seleccione otra forma para conectar (clic en el destino)').catch(() => { });

				const onClick = (evt) => {
					const ptr = app.canvasManager.getStage().getPointerPosition();
					const dest = app.canvasManager.getStage().getIntersection(ptr);
					if (dest && dest !== app._pendingConnectionSource && dest.name && dest.name() === 'anchor') {
						// if clicked an anchor, map to its parent shape
						// but anchors live on transformLayer as separate nodes; we'll try to get parent by searching shapes near pointer
					}

					if (dest && dest !== app._pendingConnectionSource) {
						// create connector
						if (app.connectorsManager) {
							app.connectorsManager.createConnector(app._pendingConnectionSource, dest, { type: 'elbow' });
						}
					} else {
						if (app.notify) app.notify('Conexión cancelada').catch(() => { });
					}

					app._pendingConnectionSource = null;
					app.canvasManager.getStage().off('click', onClick);
				};

				app.canvasManager.getStage().on('click', onClick);
				break;
			}
			case 'edit': {
				hideMenu();
				// If it's a Text node, open input. Otherwise, attempt to find linked Text node.
				if (target.getClassName && target.getClassName() === 'Text') {
					// Use SweetAlert2 if available for a nicer prompt
					if (window.Swal) {
						window.Swal.fire({
							title: 'Editar texto',
							input: 'text',
							inputValue: target.text() || '',
							showCancelButton: true
						}).then(result => {
							if (result.isConfirmed) {
								target.text(result.value || '');
								app.canvasManager.mainLayer.draw();
								app.canvasManager.saveHistory();
							}
						});
					} else {
						const v = prompt('Editar texto', target.text() || '');
						if (v !== null) {
							target.text(v);
							app.canvasManager.mainLayer.draw();
							app.canvasManager.saveHistory();
						}
					}
				} else {
					// Not a text node
					if (app.notify) app.notify('El elemento no contiene texto editable').catch(() => { });
				}
				break;
			}
		}
	});

	// Color change handler
	menu.querySelector('input[data-action="fill"]').addEventListener('input', (ev) => {
		if (!currentTarget) return;
		const color = ev.target.value;
		try {
			currentTarget.setAttr('fill', color);
			app.canvasManager.mainLayer.draw();
			app.canvasManager.saveHistory();
		} catch (e) { }
	});

	// Public API to hide menu if needed
	return {
		hide: hideMenu
	};
}
