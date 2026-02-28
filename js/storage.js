/**
 * FLOWLY - Storage Manager
 * Handles saving and loading projects to/from localStorage
 */

export class StorageManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.storageKey = 'flowly_projects';
        this.lastSessionKey = 'flowly_last_session';
        this.maxProjects = 10;
        this._autosaveInterval = null;
        this.startAutosave();
    }

    /**
     * Start autosaving every 30 seconds
     */
    startAutosave(intervalMs = 30000) {
        if (this._autosaveInterval) clearInterval(this._autosaveInterval);
        this._autosaveInterval = setInterval(() => {
            this.saveLastSession();
            console.log('💾 Autosaved at', new Date().toLocaleTimeString());
        }, intervalMs);
    }

    /**
     * Stop autosave
     */
    stopAutosave() {
        if (this._autosaveInterval) {
            clearInterval(this._autosaveInterval);
            this._autosaveInterval = null;
        }
    }

    /**
     * Save current project
     */
    saveProject(name) {
        const projectData = {
            id: Date.now().toString(),
            name: name,
            date: new Date().toISOString(),
            data: this.canvasManager.toJSON()
        };

        // Get existing projects
        const projects = this.getProjects();

        // Add new project
        projects.unshift(projectData);

        // Limit number of stored projects
        if (projects.length > this.maxProjects) {
            projects.pop();
        }

        // Save to localStorage
        this.setProjects(projects);

        // Also save as last session
        this.saveLastSession();

        return projectData.id;
    }

    /**
     * Load project by ID
     */
    loadProject(projectId) {
        const projects = this.getProjects();
        const project = projects.find(p => p.id === projectId);

        if (project) {
            this.canvasManager.loadFromJSON(project.data);
            this.saveLastSession();
            // Return the loaded project object for callers to use (e.g., show notifications)
            return project;
        }

        return null;
    }

    /**
     * Delete project by ID
     */
    deleteProject(projectId) {
        const projects = this.getProjects();
        const filtered = projects.filter(p => p.id !== projectId);
        this.setProjects(filtered);
    }

    /**
     * List all saved projects
     */
    listProjects() {
        return this.getProjects();
    }

    /**
     * Save last session (auto-save)
     */
    saveLastSession() {
        const data = this.canvasManager.toJSON();
        try {
            localStorage.setItem(this.lastSessionKey, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save last session:', e);
        }
    }

    /**
     * Get last session
     */
    getLastSession() {
        try {
            const data = localStorage.getItem(this.lastSessionKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Failed to load last session:', e);
            return null;
        }
    }

    /**
     * Get all projects from localStorage
     */
    getProjects() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn('Failed to load projects:', e);
            return [];
        }
    }

    /**
     * Save projects to localStorage
     */
    setProjects(projects) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(projects));
        } catch (e) {
            console.error('Failed to save projects:', e);

            // If quota exceeded, remove oldest projects
            if (e.name === 'QuotaExceededError') {
                projects.pop();
                this.setProjects(projects);
            }
        }
    }

    /**
     * Clear all saved projects
     */
    clearAllProjects() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.lastSessionKey);
    }

    /**
     * Export project data as downloadable file
     */
    exportProjectFile(projectId) {
        const projects = this.getProjects();
        const project = projects.find(p => p.id === projectId);

        if (project) {
            const json = JSON.stringify(project.data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.download = `${project.name}.json`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }

    /**
     * Get storage usage statistics
     */
    getStorageStats() {
        const projects = this.getProjects();
        const lastSession = this.getLastSession();

        const projectsSize = new Blob([JSON.stringify(projects)]).size;
        const sessionSize = new Blob([JSON.stringify(lastSession)]).size;
        const totalSize = projectsSize + sessionSize;

        return {
            projectCount: projects.length,
            totalSize: totalSize,
            projectsSize: projectsSize,
            sessionSize: sessionSize,
            formattedSize: this.formatBytes(totalSize)
        };
    }

    /**
     * Format bytes to human readable
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}
