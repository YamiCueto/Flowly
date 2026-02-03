/**
 * Technical Components Library - Sprint 4
 * Provides pre-built cloud, database, server, and network components
 * Organized in collapsible categories with search functionality
 */

export class ComponentLibrary {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.searchInput = null;
        this.categories = this.initializeComponents();
        this.init();
    }

    /**
     * Initialize all available components organized by category
     */
    initializeComponents() {
        return {
            'AWS': [
                { id: 'aws-ec2', name: 'EC2', icon: '🖥️', color: '#FF9900', shape: 'rect', width: 80, height: 60 },
                { id: 'aws-s3', name: 'S3', icon: '🪣', color: '#569A31', shape: 'rect', width: 80, height: 60 },
                { id: 'aws-lambda', name: 'Lambda', icon: 'λ', color: '#FF9900', shape: 'rect', width: 80, height: 60 },
                { id: 'aws-rds', name: 'RDS', icon: '🗄️', color: '#527FFF', shape: 'rect', width: 80, height: 60 },
                { id: 'aws-dynamodb', name: 'DynamoDB', icon: '⚡', color: '#4053D6', shape: 'rect', width: 80, height: 60 },
                { id: 'aws-api-gateway', name: 'API Gateway', icon: '🌐', color: '#FF4F8B', shape: 'rect', width: 80, height: 60 },
            ],
            'Azure': [
                { id: 'azure-vm', name: 'Virtual Machine', icon: '💻', color: '#0078D4', shape: 'rect', width: 80, height: 60 },
                { id: 'azure-functions', name: 'Functions', icon: '⚡', color: '#0078D4', shape: 'rect', width: 80, height: 60 },
                { id: 'azure-storage', name: 'Storage', icon: '📦', color: '#0078D4', shape: 'rect', width: 80, height: 60 },
                { id: 'azure-sql', name: 'SQL Database', icon: '🗃️', color: '#0078D4', shape: 'rect', width: 80, height: 60 },
                { id: 'azure-cosmos', name: 'Cosmos DB', icon: '🌍', color: '#0078D4', shape: 'rect', width: 80, height: 60 },
                { id: 'azure-app-service', name: 'App Service', icon: '🚀', color: '#0078D4', shape: 'rect', width: 80, height: 60 },
            ],
            'GCP': [
                { id: 'gcp-compute', name: 'Compute Engine', icon: '⚙️', color: '#4285F4', shape: 'rect', width: 80, height: 60 },
                { id: 'gcp-cloud-functions', name: 'Cloud Functions', icon: '⚡', color: '#4285F4', shape: 'rect', width: 80, height: 60 },
                { id: 'gcp-storage', name: 'Cloud Storage', icon: '☁️', color: '#4285F4', shape: 'rect', width: 80, height: 60 },
                { id: 'gcp-sql', name: 'Cloud SQL', icon: '🗄️', color: '#4285F4', shape: 'rect', width: 80, height: 60 },
                { id: 'gcp-firestore', name: 'Firestore', icon: '🔥', color: '#4285F4', shape: 'rect', width: 80, height: 60 },
                { id: 'gcp-pub-sub', name: 'Pub/Sub', icon: '📡', color: '#4285F4', shape: 'rect', width: 80, height: 60 },
            ],
            'Databases': [
                { id: 'db-mysql', name: 'MySQL', icon: '🐬', color: '#00758F', shape: 'cylinder', width: 80, height: 60 },
                { id: 'db-postgresql', name: 'PostgreSQL', icon: '🐘', color: '#336791', shape: 'cylinder', width: 80, height: 60 },
                { id: 'db-mongodb', name: 'MongoDB', icon: '🍃', color: '#47A248', shape: 'cylinder', width: 80, height: 60 },
                { id: 'db-redis', name: 'Redis', icon: '⚡', color: '#DC382D', shape: 'cylinder', width: 80, height: 60 },
                { id: 'db-cassandra', name: 'Cassandra', icon: '💫', color: '#1287B1', shape: 'cylinder', width: 80, height: 60 },
                { id: 'db-elasticsearch', name: 'Elasticsearch', icon: '🔍', color: '#005571', shape: 'cylinder', width: 80, height: 60 },
            ],
            'Servers': [
                { id: 'server-web', name: 'Web Server', icon: '🌐', color: '#2ecc71', shape: 'rect', width: 80, height: 60 },
                { id: 'server-app', name: 'App Server', icon: '📱', color: '#3498db', shape: 'rect', width: 80, height: 60 },
                { id: 'server-api', name: 'API Server', icon: '🔌', color: '#9b59b6', shape: 'rect', width: 80, height: 60 },
                { id: 'server-mail', name: 'Mail Server', icon: '📧', color: '#e74c3c', shape: 'rect', width: 80, height: 60 },
                { id: 'server-cache', name: 'Cache Server', icon: '⚡', color: '#f39c12', shape: 'rect', width: 80, height: 60 },
                { id: 'server-proxy', name: 'Proxy Server', icon: '🔒', color: '#34495e', shape: 'rect', width: 80, height: 60 },
            ],
            'Network': [
                { id: 'net-router', name: 'Router', icon: '📡', color: '#16a085', shape: 'diamond', width: 80, height: 60 },
                { id: 'net-firewall', name: 'Firewall', icon: '🛡️', color: '#c0392b', shape: 'diamond', width: 80, height: 60 },
                { id: 'net-load-balancer', name: 'Load Balancer', icon: '⚖️', color: '#27ae60', shape: 'diamond', width: 80, height: 60 },
                { id: 'net-vpn', name: 'VPN', icon: '🔐', color: '#8e44ad', shape: 'diamond', width: 80, height: 60 },
                { id: 'net-cdn', name: 'CDN', icon: '🌍', color: '#2980b9', shape: 'diamond', width: 80, height: 60 },
                { id: 'net-dns', name: 'DNS', icon: '🔍', color: '#d35400', shape: 'diamond', width: 80, height: 60 },
            ],
            'Users & Devices': [
                { id: 'user-single', name: 'User', icon: '👤', color: '#95a5a6', shape: 'circle', width: 60, height: 60 },
                { id: 'user-group', name: 'User Group', icon: '👥', color: '#7f8c8d', shape: 'circle', width: 60, height: 60 },
                { id: 'device-mobile', name: 'Mobile', icon: '📱', color: '#3498db', shape: 'rect', width: 50, height: 70 },
                { id: 'device-desktop', name: 'Desktop', icon: '🖥️', color: '#2c3e50', shape: 'rect', width: 80, height: 60 },
                { id: 'device-tablet', name: 'Tablet', icon: '📲', color: '#34495e', shape: 'rect', width: 70, height: 70 },
                { id: 'device-iot', name: 'IoT Device', icon: '📟', color: '#16a085', shape: 'circle', width: 60, height: 60 },
            ]
        };
    }

    /**
     * Initialize the component library UI
     */
    init() {
        this.container = document.getElementById('components-library');
        if (!this.container) {
            console.error('Components library container not found');
            return;
        }

        this.render();
        this.attachEventListeners();
    }

    /**
     * Render the entire library UI
     */
    render() {
        this.container.innerHTML = `
            <div class="library-header">
                <h3>Biblioteca Técnica</h3>
                <input 
                    type="text" 
                    class="library-search" 
                    placeholder="🔍 Buscar componente..."
                    id="component-search"
                />
            </div>
            <div class="library-categories" id="library-categories">
                ${this.renderCategories()}
            </div>
        `;

        this.searchInput = this.container.querySelector('#component-search');
    }

    /**
     * Render all categories and their components
     */
    renderCategories() {
        return Object.entries(this.categories).map(([categoryName, components]) => {
            return `
                <div class="library-category" data-category="${categoryName}">
                    <div class="category-header" data-toggle="${categoryName}">
                        <span class="category-icon">▼</span>
                        <span class="category-name">${categoryName}</span>
                        <span class="category-count">${components.length}</span>
                    </div>
                    <div class="category-components" data-components="${categoryName}">
                        ${components.map(comp => this.renderComponent(comp)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render a single component item
     */
    renderComponent(component) {
        return `
            <div class="component-item" 
                 data-component-id="${component.id}"
                 draggable="true"
                 title="${component.name}">
                <div class="component-icon" style="background-color: ${component.color}20; color: ${component.color}">
                    ${component.icon}
                </div>
                <div class="component-name">${component.name}</div>
            </div>
        `;
    }

    /**
     * Attach event listeners for interactions
     */
    attachEventListeners() {
        // Category toggle
        this.container.querySelectorAll('[data-toggle]').forEach(header => {
            header.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.toggle;
                this.toggleCategory(category);
            });
        });

        // Component drag start
        this.container.querySelectorAll('.component-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const componentId = e.currentTarget.dataset.componentId;
                e.dataTransfer.setData('component-id', componentId);
                e.dataTransfer.effectAllowed = 'copy';
            });

            // Click to add to center
            item.addEventListener('click', (e) => {
                const componentId = e.currentTarget.dataset.componentId;
                this.addComponentToCanvas(componentId);
            });
        });

        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterComponents(e.target.value);
            });
        }

        // Canvas drop handler
        const canvasWrapper = document.getElementById('canvas-wrapper');
        if (canvasWrapper) {
            canvasWrapper.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            });

            canvasWrapper.addEventListener('drop', (e) => {
                e.preventDefault();
                const componentId = e.dataTransfer.getData('component-id');
                if (componentId) {
                    const rect = canvasWrapper.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    this.addComponentToCanvas(componentId, x, y);
                }
            });
        }
    }

    /**
     * Toggle category open/closed
     */
    toggleCategory(categoryName) {
        const categoryEl = this.container.querySelector(`[data-category="${categoryName}"]`);
        if (!categoryEl) return;

        const componentsEl = categoryEl.querySelector(`[data-components="${categoryName}"]`);
        const iconEl = categoryEl.querySelector('.category-icon');

        const isOpen = componentsEl.style.display !== 'none';
        
        componentsEl.style.display = isOpen ? 'none' : 'grid';
        iconEl.textContent = isOpen ? '▶' : '▼';
    }

    /**
     * Filter components by search query
     */
    filterComponents(query) {
        const lowerQuery = query.toLowerCase();
        
        Object.entries(this.categories).forEach(([categoryName, components]) => {
            const categoryEl = this.container.querySelector(`[data-category="${categoryName}"]`);
            if (!categoryEl) return;

            const matchingComponents = components.filter(comp => 
                comp.name.toLowerCase().includes(lowerQuery) ||
                comp.id.toLowerCase().includes(lowerQuery)
            );

            if (matchingComponents.length === 0 && query) {
                categoryEl.style.display = 'none';
            } else {
                categoryEl.style.display = 'block';
                
                // Show/hide individual components
                const componentEls = categoryEl.querySelectorAll('.component-item');
                componentEls.forEach(el => {
                    const compId = el.dataset.componentId;
                    const comp = components.find(c => c.id === compId);
                    if (comp) {
                        const matches = comp.name.toLowerCase().includes(lowerQuery) ||
                                      comp.id.toLowerCase().includes(lowerQuery);
                        el.style.display = matches || !query ? 'flex' : 'none';
                    }
                });
            }
        });
    }

    /**
     * Add a component to the canvas
     */
    addComponentToCanvas(componentId, x = null, y = null) {
        // Find component definition
        let component = null;
        for (const components of Object.values(this.categories)) {
            component = components.find(c => c.id === componentId);
            if (component) break;
        }

        if (!component) return;

        // Get canvas manager
        const canvasManager = this.app.canvasManager;
        const stage = canvasManager.stage;
        const layer = canvasManager.mainLayer;

        // Calculate position
        if (x === null || y === null) {
            const stageSize = stage.size();
            const scale = stage.scaleX();
            const position = stage.position();
            
            x = (stageSize.width / 2 - position.x) / scale;
            y = (stageSize.height / 2 - position.y) / scale;
        } else {
            // Convert screen coordinates to canvas coordinates
            const scale = stage.scaleX();
            const position = stage.position();
            x = (x - position.x) / scale;
            y = (y - position.y) / scale;
        }

        // Create the shape based on component type
        let shape;
        const commonAttrs = {
            x, y,
            fill: component.color,
            stroke: '#000',
            strokeWidth: 2,
            draggable: true,
            name: 'shape'
        };

        switch (component.shape) {
            case 'rect':
                shape = new Konva.Rect({
                    ...commonAttrs,
                    width: component.width,
                    height: component.height,
                    cornerRadius: 8
                });
                break;
            
            case 'circle':
                shape = new Konva.Circle({
                    ...commonAttrs,
                    radius: component.width / 2,
                });
                break;
            
            case 'diamond':
                // Diamond shape using Konva.Line with closed points
                const halfW = component.width / 2;
                const halfH = component.height / 2;
                shape = new Konva.Line({
                    ...commonAttrs,
                    points: [0, -halfH, halfW, 0, 0, halfH, -halfW, 0],
                    closed: true
                });
                break;
            
            case 'cylinder':
                // Create a group for cylinder (ellipse top + rect body)
                shape = new Konva.Group({
                    x, y,
                    draggable: true,
                    name: 'shape'
                });
                
                const cylinderW = component.width;
                const cylinderH = component.height;
                const ellipseH = cylinderH * 0.15;
                
                const body = new Konva.Rect({
                    x: 0,
                    y: ellipseH / 2,
                    width: cylinderW,
                    height: cylinderH - ellipseH,
                    fill: component.color,
                    stroke: '#000',
                    strokeWidth: 2
                });
                
                const topEllipse = new Konva.Ellipse({
                    x: cylinderW / 2,
                    y: ellipseH,
                    radiusX: cylinderW / 2,
                    radiusY: ellipseH,
                    fill: component.color,
                    stroke: '#000',
                    strokeWidth: 2
                });
                
                const bottomEllipse = new Konva.Ellipse({
                    x: cylinderW / 2,
                    y: cylinderH - ellipseH / 2,
                    radiusX: cylinderW / 2,
                    radiusY: ellipseH,
                    fill: component.color,
                    stroke: '#000',
                    strokeWidth: 2
                });
                
                shape.add(body);
                shape.add(bottomEllipse);
                shape.add(topEllipse);
                break;
            
            default:
                shape = new Konva.Rect({
                    ...commonAttrs,
                    width: component.width,
                    height: component.height
                });
        }

        // Add text label
        const text = new Konva.Text({
            x: shape.x ? shape.x() : x,
            y: (shape.y ? shape.y() : y) + (component.height || 60) + 5,
            text: component.name,
            fontSize: 12,
            fontFamily: 'Arial',
            fill: '#2c3e50',
            align: 'center',
            width: component.width
        });

        // Add to layer
        layer.add(shape);
        layer.add(text);
        
        // Make selectable
        canvasManager.makeShapeSelectable(shape);
        
        // Link text to shape for movement
        shape.on('dragmove', () => {
            text.position({
                x: shape.x(),
                y: shape.y() + (component.height || 60) + 5
            });
        });

        // Save to history
        canvasManager.saveHistory(`Añadido ${component.name}`);
        layer.draw();

        // Notify user
        if (this.app.notify) {
            this.app.notify(`${component.name} añadido al canvas`).catch(() => {});
        }
    }
}
