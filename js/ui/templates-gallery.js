/**
 * Templates Gallery UI
 * Modal interface for browsing and selecting templates
 */

export class TemplatesGallery {
    constructor(templateManager, app) {
        this.templateManager = templateManager;
        this.app = app;
        this.modal = null;
        this.currentCategory = 'all';
        this.searchQuery = '';
    }

    /**
     * Show templates gallery modal
     */
    async show() {
        // Create modal if it doesn't exist
        if (!this.modal) {
            this.createModal();
        }

        // Load templates if not already loaded
        if (this.templateManager.templates.length === 0) {
            await this.templateManager.loadTemplatesCatalog();
        }

        // Render templates
        this.renderTemplates();

        // Show modal
        this.modal.style.display = 'flex';
    }

    /**
     * Hide modal
     */
    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }

    /**
     * Create modal HTML structure
     */
    createModal() {
        const modalHTML = `
			<div class="modal" id="templates-modal">
				<div class="modal-content modal-large">
					<div class="modal-header">
						<h2>📚 Galería de Plantillas</h2>
						<button type="button" title="Cerrar" class="modal-close" id="templates-modal-close">
							<i class="fas fa-times"></i>
						</button>
					</div>
					<div class="modal-body">
						<!-- Search bar and actions -->
						<div class="templates-search-bar">
							<input type="text" 
								   id="templates-search" 
								   class="templates-search-input" 
								   placeholder="🔍 Buscar plantillas...">
							<div class="template-actions-bar">
								<button class="btn-save-template" id="save-template-btn" title="Guardar canvas actual como plantilla">
									<i class="fas fa-save"></i> Guardar como Plantilla
								</button>
								<button class="btn-import-template" id="import-template-btn" title="Importar plantilla desde archivo">
									<i class="fas fa-file-import"></i> Importar
								</button>
								<button class="btn-export-templates" id="export-all-templates-btn" title="Exportar todas las plantillas personalizadas">
									<i class="fas fa-file-export"></i> Exportar Todas
								</button>
							</div>
							<input type="file" id="import-template-input" accept=".json" style="display: none;">
						</div>

						<!-- Category tabs -->
						<div class="templates-tabs" id="templates-tabs">
							<button class="tab-btn active" data-category="all">
								Todas
							</button>
						</div>
						
						<!-- Templates grid -->
						<div class="templates-grid" id="templates-grid">
							<!-- Templates will be rendered here -->
						</div>
					</div>
				</div>
			</div>
		`;

        // Insert modal into body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('templates-modal');

        // Setup event listeners
        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Close button
        document.getElementById('templates-modal-close').addEventListener('click', () => {
            this.hide();
        });

        // Click outside modal to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Search input
        document.getElementById('templates-search').addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.renderTemplates();
        });

        // Save template button
        document.getElementById('save-template-btn').addEventListener('click', () => {
            this.showSaveTemplateDialog();
        });

        // Import template button
        document.getElementById('import-template-btn').addEventListener('click', () => {
            document.getElementById('import-template-input').click();
        });

        // Import template file input
        document.getElementById('import-template-input').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await this.importTemplate(file);
                e.target.value = ''; // Reset input
            }
        });

        // Export all templates button
        document.getElementById('export-all-templates-btn').addEventListener('click', () => {
            this.exportAllTemplates();
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.hide();
            }
        });
    }

    /**
     * Render category tabs
     */
    renderCategoryTabs() {
        const tabsContainer = document.getElementById('templates-tabs');
        const categories = this.templateManager.getAllCategories();

        let tabsHTML = `
			<button class="tab-btn ${this.currentCategory === 'all' ? 'active' : ''}" 
					data-category="all">
				Todas
			</button>
		`;

        categories.forEach(category => {
            tabsHTML += `
				<button class="tab-btn ${this.currentCategory === category.id ? 'active' : ''}" 
						data-category="${category.id}">
					${category.icon} ${category.name}
				</button>
			`;
        });

        tabsContainer.innerHTML = tabsHTML;

        // Add click listeners to tabs
        tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentCategory = e.currentTarget.dataset.category;
                this.renderTemplates();
            });
        });
    }

    /**
     * Render templates grid
     */
    renderTemplates() {
        // Render tabs first
        this.renderCategoryTabs();

        const gridContainer = document.getElementById('templates-grid');

        // Get templates to display
        let templates = this.searchQuery
            ? this.templateManager.searchTemplates(this.searchQuery)
            : this.templateManager.getTemplatesByCategory(this.currentCategory);

        if (templates.length === 0) {
            gridContainer.innerHTML = `
				<div class="no-templates">
					<i class="fas fa-inbox" style="font-size: 48px; opacity: 0.3;"></i>
					<p>No se encontraron plantillas</p>
				</div>
			`;
            return;
        }

        // Render template cards
        let gridHTML = '';
        templates.forEach(template => {
            gridHTML += this.createTemplateCard(template);
        });

        gridContainer.innerHTML = gridHTML;

        // Add click listeners to template cards
        gridContainer.querySelectorAll('.template-use-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const templateId = e.currentTarget.dataset.templateId;
                await this.useTemplate(templateId);
            });
        });

        // Add export listeners for custom templates
        gridContainer.querySelectorAll('.template-export-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const templateId = e.currentTarget.dataset.templateId;
                await this.exportTemplate(templateId);
            });
        });

        // Add delete listeners for custom templates
        gridContainer.querySelectorAll('.template-delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const templateId = e.currentTarget.dataset.templateId;
                await this.deleteTemplate(templateId);
            });
        });
    }

    /**
     * Create template card HTML
     */
    createTemplateCard(template) {
        const difficultyColors = {
            'beginner': '#27ae60',
            'intermediate': '#f39c12',
            'advanced': '#e74c3c',
            'custom': '#9b59b6'
        };

        const difficultyColor = difficultyColors[template.difficulty] || '#95a5a6';

        return `
			<div class="template-card">
				<div class="template-thumbnail">
					<div class="template-icon">${template.icon || '📄'}</div>
					${template.isCustom ? '<span class="custom-badge">⭐ Custom</span>' : ''}
				</div>
				<div class="template-info">
					<h3>${template.name}</h3>
					<p>${template.description}</p>
					<div class="template-meta">
						<span class="template-difficulty" style="color: ${difficultyColor}">
							<i class="fas fa-signal"></i> ${template.difficulty}
						</span>
						<span class="template-time">
							<i class="far fa-clock"></i> ${template.estimatedTime}
						</span>
					</div>
					<div class="template-tags">
						${template.tags.slice(0, 3).map(tag =>
            `<span class="template-tag">${tag}</span>`
        ).join('')}
					</div>
				</div>
				<div class="template-actions">
					<button class="template-use-btn" data-template-id="${template.id}">
						<i class="fas fa-plus-circle"></i> Usar Plantilla
					</button>
					${template.isCustom ? `
						<button class="template-export-btn" data-template-id="${template.id}" title="Exportar plantilla">
							<i class="fas fa-file-export"></i>
						</button>
						<button class="template-delete-btn" data-template-id="${template.id}" title="Eliminar plantilla">
							<i class="fas fa-trash"></i>
						</button>
					` : ''}
				</div>
			</div>
		`;
    }

    /**
     * Use template - confirm and apply
     */
    async useTemplate(templateId) {
        try {
            // Check if canvas has content
            const hasContent = this.app.canvasManager.mainLayer.getChildren().length > 1;

            if (hasContent) {
                // Ask for confirmation
                const result = await Swal.fire({
                    title: '¿Cargar plantilla?',
                    text: 'Esto reemplazará el contenido actual del canvas. ¿Deseas continuar?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#6750A4',
                    cancelButtonColor: '#95a5a6',
                    confirmButtonText: 'Sí, cargar plantilla',
                    cancelButtonText: 'Cancelar'
                });

                if (!result.isConfirmed) {
                    return;
                }
            }

            // Show loading
            Swal.fire({
                title: 'Cargando plantilla...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Apply template
            await this.templateManager.applyTemplate(templateId, true);

            // Hide modal
            this.hide();

            // Show success
            Swal.fire({
                icon: 'success',
                title: '¡Plantilla cargada!',
                text: 'La plantilla se ha aplicado correctamente',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error using template:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la plantilla: ' + error.message
            });
        }
    }

    /**
     * Show save template dialog
     */
    async showSaveTemplateDialog() {
        const { value: formValues } = await Swal.fire({
            title: 'Guardar como Plantilla',
            html: `
				<input id="swal-input1" class="swal2-input" placeholder="Nombre de la plantilla">
				<textarea id="swal-input2" class="swal2-textarea" placeholder="Descripción (opcional)"></textarea>
			`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#6750A4',
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value;
                const description = document.getElementById('swal-input2').value;

                if (!name) {
                    Swal.showValidationMessage('Por favor ingresa un nombre');
                    return false;
                }

                return { name, description };
            }
        });

        if (formValues) {
            try {
                await this.templateManager.saveAsTemplate(
                    formValues.name,
                    formValues.description || 'Plantilla personalizada'
                );

                // Refresh templates
                this.renderTemplates();

                Swal.fire({
                    icon: 'success',
                    title: '¡Guardado!',
                    text: 'Tu plantilla se ha guardado correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo guardar la plantilla: ' + error.message
                });
            }
        }
    }

    /**
     * Delete custom template
     */
    async deleteTemplate(templateId) {
        const result = await Swal.fire({
            title: '¿Eliminar plantilla?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#95a5a6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            this.templateManager.deleteCustomTemplate(templateId);
            this.renderTemplates();

            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'La plantilla se ha eliminado',
                timer: 2000,
                showConfirmButton: false
            });
        }
    }

    /**
     * Export a single custom template
     */
    async exportTemplate(templateId) {
        try {
            this.templateManager.exportTemplate(templateId);
            
            Swal.fire({
                icon: 'success',
                title: 'Exportado',
                text: 'La plantilla se ha exportado correctamente',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo exportar la plantilla: ' + error.message
            });
        }
    }

    /**
     * Import a template from file
     */
    async importTemplate(file) {
        try {
            Swal.fire({
                title: 'Importando plantilla...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const templateData = await this.templateManager.importTemplate(file);

            // Refresh templates
            this.renderTemplates();

            Swal.fire({
                icon: 'success',
                title: '¡Importado!',
                text: `Plantilla "${templateData.name}" importada correctamente`,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al importar',
                text: error.message
            });
        }
    }

    /**
     * Export all custom templates
     */
    async exportAllTemplates() {
        try {
            if (this.templateManager.customTemplates.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin plantillas',
                    text: 'No tienes plantillas personalizadas para exportar'
                });
                return;
            }

            this.templateManager.exportAllCustomTemplates();

            Swal.fire({
                icon: 'success',
                title: 'Exportado',
                text: `${this.templateManager.customTemplates.length} plantilla(s) exportada(s) correctamente`,
                timer: 2500,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron exportar las plantillas: ' + error.message
            });
        }
    }
}
