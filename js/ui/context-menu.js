/**
 * Context Menu UI for node right-click actions
 * Sprint 2: Enhanced with more options, shortcuts display, and better UX
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
	menu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
	menu.style.padding = '8px';
	menu.style.borderRadius = '8px';
	menu.style.display = 'none';
	menu.style.minWidth = '220px';
	menu.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

	// Build inner HTML with improved design and shortcuts
	menu.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:2px">
            <button data-action="duplicate" class="context-menu-item">
                <span class="menu-icon">📋</span>
                <span class="menu-label">Duplicar</span>
                <span class="menu-shortcut">Alt+Drag</span>
            </button>
            <button data-action="copy" class="context-menu-item">
                <span class="menu-icon">📄</span>
                <span class="menu-label">Copiar</span>
                <span class="menu-shortcut">Ctrl+C</span>
            </button>
            <div class="menu-separator"></div>
            <button data-action="bring-front" class="context-menu-item">
                <span class="menu-icon">⬆️</span>
                <span class="menu-label">Traer al frente</span>
                <span class="menu-shortcut">Ctrl+]</span>
            </button>
            <button data-action="send-back" class="context-menu-item">
                <span class="menu-icon">⬇️</span>
                <span class="menu-label">Enviar atrás</span>
                <span class="menu-shortcut">Ctrl+[</span>
            </button>
            <div class="menu-separator"></div>
            <button data-action="lock" class="context-menu-item">
                <span class="menu-icon">🔒</span>
                <span class="menu-label">Bloquear</span>
                <span class="menu-shortcut">Ctrl+L</span>
            </button>
            <button data-action="group" class="context-menu-item" id="menu-group">
                <span class="menu-icon">📦</span>
                <span class="menu-label">Agrupar</span>
                <span class="menu-shortcut">Ctrl+G</span>
            </button>
            <div class="menu-separator"></div>
            <label class="context-menu-item" style="cursor:pointer;padding:8px 12px">
                <span class="menu-icon">🎨</span>
                <span class="menu-label">Color de relleno</span>
                <input data-action="fill" type="color" style="width:32px;height:24px;border:1px solid #ddd;border-radius:4px;cursor:pointer" />
            </label>
            <button data-action="edit" class="context-menu-item">
                <span class="menu-icon">✏️</span>
                <span class="menu-label">Editar texto</span>
                <span class="menu-shortcut">Doble-click</span>
            </button>
            <div class="menu-separator"></div>
            <button data-action="delete" class="context-menu-item danger">
                <span class="menu-icon">🗑️</span>
                <span class="menu-label">Eliminar</span>
                <span class="menu-shortcut">Del</span>
            </button>
        </div>
    `;

	container.appendChild(menu);

	// Add CSS styles for menu items
	const style = document.createElement('style');
	style.textContent = `
        .context-menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            background: transparent;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            text-align: left;
            font-size: 14px;
            color: #2c3e50;
            transition: background 0.15s ease;
        }

        .context-menu-item:hover {
            background: #f0f2f5;
        }

        .context-menu-item.danger:hover {
            background: #fee;
            color: #e74c3c;
        }

        .menu-icon {
            font-size: 16px;
            width: 20px;
            text-align: center;
        }

        .menu-label {
            flex: 1;
            font-weight: 500;
        }

        .menu-shortcut {
            font-size: 11px;
            color: #95a5a6;
            background: #ecf0f1;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }

        .menu-separator {
            height: 1px;
            background: #ecf0f1;
            margin: 4px 0;
        }

        .context-menu-item:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .context-menu-item:disabled:hover {
            background: transparent;
        }
    `;
	document.head.appendChild(style);

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
		if (!btn || btn.tagName === 'INPUT') return;
		const action = btn.getAttribute('data-action');
		const target = currentTarget;
		if (!target) return hideMenu();

		switch (action) {
			case 'duplicate':
				app.canvasManager.selectShape(target);
				duplicateSelected(app);
				hideMenu();
				break;

			case 'copy':
				app.canvasManager.selectShape(target);
				app.canvasManager.copy();
				if (app.notify) app.notify('Copiado al portapapeles').catch(() => { });
				hideMenu();
				break;

			case 'bring-front':
				app.canvasManager.selectShape(target);
				app.canvasManager.bringToFront();
				hideMenu();
				break;

			case 'send-back':
				app.canvasManager.selectShape(target);
				app.canvasManager.sendToBack();
				hideMenu();
				break;

			case 'lock':
				toggleLock(target);
				hideMenu();
				break;

			case 'group':
				groupSelected(app);
				hideMenu();
				break;

			case 'delete':
				app.canvasManager.selectShape(target);
				app.canvasManager.deleteSelected();
				hideMenu();
				break;

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
							showCancelButton: true,
							confirmButtonText: 'Guardar',
							cancelButtonText: 'Cancelar'
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

/**
 * Helper function: Duplicate selected shape
 */
function duplicateSelected(app) {
	const selected = app.canvasManager.selectedShapes;
	if (selected.length === 0) return;

	app.canvasManager.clearSelection();

	selected.forEach(shape => {
		const duplicate = shape.clone({
			x: shape.x() + 20,
			y: shape.y() + 20
		});

		app.canvasManager.addShape(duplicate, false);
		app.canvasManager.makeShapeSelectable(duplicate);
		app.canvasManager.addToSelection(duplicate);
	});

	app.canvasManager.saveHistory();
}

/**
 * Helper function: Toggle lock/unlock shape
 */
function toggleLock(shape) {
	const isLocked = shape.attrs.locked || false;
	shape.setAttr('locked', !isLocked);
	shape.draggable(!isLocked);

	// Visual feedback
	if (!isLocked) {
		shape.opacity(0.7);
	} else {
		shape.opacity(1);
	}

	shape.getLayer().draw();
}

/**
 * Helper function: Group selected shapes
 */
function groupSelected(app) {
	const selected = app.canvasManager.selectedShapes;
	if (selected.length < 2) {
		if (app.notify) app.notify('Selecciona al menos 2 formas para agrupar').catch(() => { });
		return;
	}

	// Create group
	const group = new Konva.Group({
		draggable: true
	});

	// Add shapes to group
	selected.forEach(shape => {
		const pos = shape.absolutePosition();
		shape.moveTo(group);
		shape.absolutePosition(pos);
	});

	app.canvasManager.mainLayer.add(group);
	app.canvasManager.clearSelection();
	app.canvasManager.selectShape(group);
	app.canvasManager.saveHistory();
}
