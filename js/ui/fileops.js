// File and export operations: attach save/load/export functionality to the app instance
export function attachFileOperations(app) {
    // Save project (uses SweetAlert2 input modal when available)
    app.saveProject = async function() {
        if (window.Swal && typeof window.Swal.fire === 'function') {
            try {
                const result = await window.Swal.fire({
                    title: 'Nombre del proyecto',
                    input: 'text',
                    inputLabel: 'Nombre del proyecto:',
                    inputValue: 'Mi Diagrama',
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar',
                    inputValidator: (value) => {
                        if (!value || !value.trim()) return 'Por favor ingresa un nombre válido.';
                        return null;
                    }
                });

                if (result.isConfirmed && result.value) {
                    const projectName = result.value.trim();
                    app.storageManager.saveProject(projectName);
                    try { app.notify('Proyecto guardado correctamente', { icon: 'success' }); } catch (e) { }
                }
            } catch (e) {
                try {
                    const projectName = prompt('Nombre del proyecto:', 'Mi Diagrama');
                    if (projectName) {
                        app.storageManager.saveProject(projectName);
                        try { app.notify('Proyecto guardado correctamente', { icon: 'success' }); } catch (e) { }
                    }
                } catch (err) { }
            }

            return;
        }

        try {
            const projectName = prompt('Nombre del proyecto:', 'Mi Diagrama');
            if (projectName) {
                app.storageManager.saveProject(projectName);
                try { app.notify('Proyecto guardado correctamente', { icon: 'success' }); } catch (e) { }
            }
        } catch (e) { }
    };

    // Open load modal (renders saved projects and wires actions)
    app.openLoadModal = function() {
        const modal = document.getElementById('load-modal');
        const container = document.getElementById('saved-projects');

        const projects = app.storageManager.listProjects();
        if (projects.length === 0) {
            container.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-folder-open"></i>
                    <p>No hay proyectos guardados</p>
                </div>
            `;
        } else {
            container.innerHTML = projects.map(project => `
                <div class="project-item" data-id="${project.id}">
                    <div class="project-info">
                        <div class="project-name">${project.name}</div>
                        <div class="project-date">${new Date(project.date).toLocaleString()}</div>
                    </div>
                    <div class="project-actions">
                        <button class="project-btn load-project" title="Cargar">
                            <i class="fas fa-folder-open"></i>
                        </button>
                        <button class="project-btn delete-project" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            container.querySelectorAll('.load-project').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const projectId = e.target.closest('.project-item').dataset.id;
                    app.loadProject(projectId);
                    modal.classList.remove('active');
                });
            });

            container.querySelectorAll('.delete-project').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const projectId = e.target.closest('.project-item').dataset.id;
                    const ok = await app.confirm('¿Eliminar este proyecto?');
                    if (ok) {
                        app.storageManager.deleteProject(projectId);
                        app.openLoadModal();
                    }
                });
            });
        }

        modal.classList.add('active');
    };

    // Load project
    app.loadProject = function(projectId) {
        const project = app.storageManager.loadProject(projectId);
        app.updateHistoryButtons();
        if (project) {
            try { app.notify(`Proyecto "${project.name}" cargado`, { icon: 'success' }); } catch (e) { try { alert('Proyecto cargado: ' + project.name); } catch (err) { } }
        } else {
            try { app.notify('No se encontró el proyecto solicitado', { icon: 'error' }); } catch (e) { alert('No se encontró el proyecto solicitado'); }
        }
    };

    // Load from file
    app.loadFromFile = function(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                app.canvasManager.loadFromJSON(data);
                app.updateHistoryButtons();
                try {
                    const name = data && (data.name || data.projectName || data.appName) ? (data.name || data.projectName || data.appName) : null;
                    if (name) {
                        app.notify(`Proyecto "${name}" cargado`, { icon: 'success' });
                    } else {
                        app.notify('Archivo cargado correctamente', { icon: 'success' });
                    }
                } catch (err) { try { alert('Archivo cargado correctamente'); } catch (e) { } }
            } catch (error) {
                try { app.notify('Error al cargar el archivo: ' + error.message, { icon: 'error' }); } catch (e) { alert('❌ Error al cargar el archivo: ' + error.message); }
            }
        };
        reader.readAsText(file);
    };

    // Export modal
    app.openExportModal = function() { document.getElementById('export-modal').classList.add('active'); };

    // Export diagram (delegates to ExportManager already on app)
    app.exportDiagram = function(format) {
        try {
            app.exportManager.export(format);
            console.log(`✅ Exported as ${format.toUpperCase()}`);
        } catch (error) {
            try { app.notify('Error al exportar: ' + error.message, { icon: 'error' }); } catch (e) { alert('❌ Error al exportar: ' + error.message); }
            console.error(error);
        }
    };
}
