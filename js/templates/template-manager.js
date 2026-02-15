/**
 * Template Manager
 * Manages loading, saving, and applying diagram templates
 */

export class TemplateManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.templates = [];
        this.categories = [];
        this.metadata = null;
        this.customTemplates = this.loadCustomTemplates();
    }

    /**
     * Load templates catalog from metadata.json
     */
    async loadTemplatesCatalog() {
        try {
            const response = await fetch('templates/metadata.json');
            if (!response.ok) {
                throw new Error('Failed to load templates catalog');
            }

            this.metadata = await response.json();
            this.templates = this.metadata.templates || [];
            this.categories = this.metadata.categories || [];

            // Add custom templates
            this.templates = [...this.templates, ...this.customTemplates];

            console.log(`✅ Loaded ${this.templates.length} templates (${this.customTemplates.length} custom)`);
            return this.metadata;
        } catch (error) {
            console.error('Error loading templates catalog:', error);
            // Fallback to custom templates only
            this.templates = this.customTemplates;
            return { templates: this.customTemplates, categories: [] };
        }
    }

    /**
     * Load a specific template by ID
     */
    async loadTemplate(templateId) {
        try {
            // Check if it's a custom template
            const customTemplate = this.customTemplates.find(t => t.id === templateId);
            if (customTemplate) {
                return customTemplate.data;
            }

            // Find template in catalog
            const template = this.templates.find(t => t.id === templateId);
            if (!template) {
                throw new Error(`Template ${templateId} not found`);
            }

            // Load template file
            const response = await fetch(`templates/${template.file}`);
            if (!response.ok) {
                throw new Error(`Failed to load template file: ${template.file}`);
            }

            const templateData = await response.json();
            console.log(`✅ Loaded template: ${template.name}`);
            return templateData;
        } catch (error) {
            console.error('Error loading template:', error);
            throw error;
        }
    }

    /**
     * Apply template to canvas
     */
    async applyTemplate(templateId, clearCanvas = true) {
        try {
            const templateData = await this.loadTemplate(templateId);

            if (clearCanvas) {
                this.canvasManager.clear();
            }

            // Apply canvas settings if provided
            if (templateData.canvas) {
                const { gridSize, backgroundColor } = templateData.canvas;
                if (gridSize) {
                    this.canvasManager.gridSize = gridSize;
                }
                // Background color could be applied to canvas wrapper
            }

            // Create shapes from template
            const shapeMap = new Map(); // Map template IDs to created shapes

            if (templateData.shapes) {
                for (const shapeData of templateData.shapes) {
                    const shape = await this.createShapeFromTemplate(shapeData);
                    if (shape) {
                        this.canvasManager.addShape(shape, false);
                        shapeMap.set(shapeData.id, shape);
                    }
                }
            }

            // Create connectors if provided
            if (templateData.connectors) {
                for (const connectorData of templateData.connectors) {
                    await this.createConnectorFromTemplate(connectorData, shapeMap);
                }
            }

            // Redraw and save history
            this.canvasManager.mainLayer.draw();
            this.canvasManager.saveHistory();

            console.log(`✅ Applied template: ${templateData.name}`);
            return true;
        } catch (error) {
            console.error('Error applying template:', error);
            throw error;
        }
    }

    /**
 * Create a shape from template data
 */
    async createShapeFromTemplate(shapeData) {
        const { type, componentId, icon, ...attrs } = shapeData;

        // Use global Konva (loaded from CDN in index.html)
        const Konva = window.Konva;

        // If it has an icon (AWS component), create an image shape
        if (icon) {
            return new Promise((resolve) => {
                const imageObj = new Image();
                imageObj.onload = () => {
                    const shape = new Konva.Image({
                        x: attrs.x || 0,
                        y: attrs.y || 0,
                        image: imageObj,
                        width: attrs.width || 80,
                        height: attrs.height || 60,
                        draggable: true,
                        name: 'shape'
                    });

                    // Add label if provided
                    if (attrs.label) {
                        const label = new Konva.Text({
                            x: attrs.x || 0,
                            y: (attrs.y || 0) + (attrs.height || 60) + 5,
                            text: attrs.label,
                            fontSize: 12,
                            fontWeight: 'bold',
                            fill: '#2c3e50',
                            width: attrs.width || 80,
                            align: 'center'
                        });
                        this.canvasManager.mainLayer.add(label);

                        // Link label to shape movement
                        shape.on('dragmove', () => {
                            label.position({
                                x: shape.x(),
                                y: shape.y() + shape.height() + 5
                            });
                        });
                    }

                    resolve(shape);
                };
                imageObj.onerror = () => {
                    console.warn(`Failed to load icon: ${icon}`);
                    // Fallback to basic shape
                    resolve(this.createBasicShape(type, attrs));
                };
                imageObj.src = icon;
            });
        }

        // Otherwise create regular shape
        return this.createBasicShape(type, attrs);
    }

    /**
     * Create basic shape (fallback)
     */
    async createBasicShape(type, attrs) {
        const { ShapeFactory } = await import('../shapes.js');
        return ShapeFactory.create(type, attrs);
    }

    /**
     * Create connector from template data
     */
    async createConnectorFromTemplate(connectorData, shapeMap) {
        const { from, to, type, label, ...attrs } = connectorData;

        // Get source and target shapes
        const sourceShape = shapeMap.get(from);
        const targetShape = shapeMap.get(to);

        if (!sourceShape || !targetShape) {
            console.warn(`Connector skipped: shapes not found (${from} -> ${to})`);
            return null;
        }

        // Create connector using ConnectorsManager if available
        if (this.canvasManager.connectorsManager) {
            const connector = this.canvasManager.connectorsManager.createConnector(
                sourceShape,
                targetShape,
                {
                    type: type || 'arrow',
                    ...attrs
                }
            );

            // Add label if provided
            if (label && connector) {
                // TODO: Add label to connector
            }

            return connector;
        }

        return null;
    }

    /**
     * Save current canvas as custom template
     */
    async saveAsTemplate(name, description, category = 'custom') {
        try {
            // Export current canvas state
            const canvasData = this.canvasManager.exportToJSON();

            // Create template object
            const template = {
                id: `custom-${Date.now()}`,
                name: name,
                description: description,
                category: category,
                file: null, // Custom templates are stored in localStorage
                tags: ['custom'],
                difficulty: 'custom',
                estimatedTime: 'N/A',
                icon: '⭐',
                isCustom: true,
                data: canvasData,
                createdAt: new Date().toISOString()
            };

            // Add to custom templates
            this.customTemplates.push(template);
            this.templates.push(template);

            // Save to localStorage
            this.saveCustomTemplates();

            console.log(`✅ Saved custom template: ${name}`);
            return template;
        } catch (error) {
            console.error('Error saving custom template:', error);
            throw error;
        }
    }

    /**
     * Delete custom template
     */
    deleteCustomTemplate(templateId) {
        const index = this.customTemplates.findIndex(t => t.id === templateId);
        if (index !== -1) {
            this.customTemplates.splice(index, 1);
            this.templates = this.templates.filter(t => t.id !== templateId);
            this.saveCustomTemplates();
            console.log(`✅ Deleted custom template: ${templateId}`);
            return true;
        }
        return false;
    }

    /**
     * Get templates by category
     */
    getTemplatesByCategory(category) {
        if (category === 'all') {
            return this.templates;
        }
        return this.templates.filter(t => t.category === category);
    }

    /**
     * Search templates
     */
    searchTemplates(query) {
        const lowerQuery = query.toLowerCase();
        return this.templates.filter(t =>
            t.name.toLowerCase().includes(lowerQuery) ||
            t.description.toLowerCase().includes(lowerQuery) ||
            t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Load custom templates from localStorage
     */
    loadCustomTemplates() {
        try {
            const stored = localStorage.getItem('flowly-custom-templates');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading custom templates:', error);
        }
        return [];
    }

    /**
     * Save custom templates to localStorage
     */
    saveCustomTemplates() {
        try {
            localStorage.setItem('flowly-custom-templates', JSON.stringify(this.customTemplates));
        } catch (error) {
            console.error('Error saving custom templates:', error);
        }
    }

    /**
     * Get all categories including custom
     */
    getAllCategories() {
        const categories = [...this.categories];

        // Add custom category if there are custom templates
        if (this.customTemplates.length > 0) {
            categories.push({
                id: 'custom',
                name: 'My Templates',
                description: 'Your custom saved templates',
                icon: '⭐'
            });
        }

        return categories;
    }

    /**
     * Export a custom template as JSON file
     */
    exportTemplate(templateId) {
        try {
            const template = this.customTemplates.find(t => t.id === templateId);
            if (!template) {
                throw new Error('Template not found');
            }

            // Create exportable data
            const exportData = {
                id: template.id,
                name: template.name,
                description: template.description,
                category: template.category,
                difficulty: template.difficulty,
                estimatedTime: template.estimatedTime,
                tags: template.tags,
                icon: template.icon,
                data: template.data,
                exportedAt: new Date().toISOString(),
                flowlyVersion: '5.0.0'
            };

            // Convert to JSON
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `flowly-template-${template.id}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`✅ Exported template: ${template.name}`);
            return true;
        } catch (error) {
            console.error('Error exporting template:', error);
            throw error;
        }
    }

    /**
     * Import a template from JSON file
     */
    async importTemplate(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);

                    // Validate required fields
                    if (!importData.name || !importData.data) {
                        throw new Error('Invalid template file: missing required fields');
                    }

                    // Check if template with same ID already exists
                    const existingIndex = this.customTemplates.findIndex(t => t.id === importData.id);
                    if (existingIndex !== -1) {
                        // Update existing template
                        this.customTemplates[existingIndex] = {
                            id: importData.id,
                            name: importData.name,
                            description: importData.description || '',
                            category: 'custom',
                            difficulty: importData.difficulty || 'intermediate',
                            estimatedTime: importData.estimatedTime || '5 min',
                            tags: importData.tags || [],
                            icon: importData.icon || '📄',
                            isCustom: true,
                            data: importData.data
                        };
                    } else {
                        // Add new template
                        const newTemplate = {
                            id: importData.id || `custom-${Date.now()}`,
                            name: importData.name,
                            description: importData.description || '',
                            category: 'custom',
                            difficulty: importData.difficulty || 'intermediate',
                            estimatedTime: importData.estimatedTime || '5 min',
                            tags: importData.tags || [],
                            icon: importData.icon || '📄',
                            isCustom: true,
                            data: importData.data
                        };
                        this.customTemplates.push(newTemplate);
                    }

                    // Save to localStorage
                    this.saveCustomTemplates();

                    // Reload templates list
                    this.templates = [...this.metadata?.templates || [], ...this.customTemplates];

                    console.log(`✅ Imported template: ${importData.name}`);
                    resolve(importData);
                } catch (error) {
                    console.error('Error importing template:', error);
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Export all custom templates as a single JSON file
     */
    exportAllCustomTemplates() {
        try {
            if (this.customTemplates.length === 0) {
                throw new Error('No custom templates to export');
            }

            const exportData = {
                templates: this.customTemplates,
                exportedAt: new Date().toISOString(),
                flowlyVersion: '5.0.0',
                count: this.customTemplates.length
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `flowly-templates-backup-${Date.now()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`✅ Exported ${this.customTemplates.length} custom templates`);
            return true;
        } catch (error) {
            console.error('Error exporting templates:', error);
            throw error;
        }
    }
}
