/**
 * FLOWLY - Tooltip Manager
 * Custom tooltips with keyboard shortcuts support
 */

export class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.currentTarget = null;
        this.showTimeout = null;
        this.hideTimeout = null;
        this.delay = 500; // ms before showing tooltip
        
        this.init();
    }

    init() {
        // Create tooltip element
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'flowly-tooltip';
        this.tooltip.innerHTML = `
            <div class="flowly-tooltip-content">
                <span class="flowly-tooltip-text"></span>
                <span class="flowly-tooltip-shortcut" style="display: none;"></span>
            </div>
        `;
        document.body.appendChild(this.tooltip);

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Use event delegation for better performance
        document.addEventListener('mouseenter', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.show(target);
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.hide();
            }
        }, true);

        // Hide on scroll
        window.addEventListener('scroll', () => this.hide(), true);
    }

    show(target) {
        // Clear any pending hide
        clearTimeout(this.hideTimeout);

        // Set delay before showing
        this.showTimeout = setTimeout(() => {
            this.currentTarget = target;
            
            const text = target.dataset.tooltip;
            const shortcut = target.dataset.shortcut;
            const variant = target.dataset.tooltipVariant || '';
            const position = target.dataset.tooltipPosition || 'top';

            if (!text) return;

            // Update content
            const textElement = this.tooltip.querySelector('.flowly-tooltip-text');
            const shortcutElement = this.tooltip.querySelector('.flowly-tooltip-shortcut');

            textElement.textContent = text;

            if (shortcut) {
                shortcutElement.style.display = 'inline-flex';
                shortcutElement.innerHTML = this.formatShortcut(shortcut);
            } else {
                shortcutElement.style.display = 'none';
            }

            // Apply variant
            this.tooltip.className = `flowly-tooltip ${variant} ${position}`;

            // Position tooltip
            this.position(target, position);

            // Show tooltip
            requestAnimationFrame(() => {
                this.tooltip.classList.add('show');
            });
        }, this.delay);
    }

    hide() {
        clearTimeout(this.showTimeout);
        
        this.hideTimeout = setTimeout(() => {
            this.tooltip.classList.remove('show');
            this.currentTarget = null;
        }, 100);
    }

    formatShortcut(shortcut) {
        // Convert shortcut string to HTML with kbd elements
        // Example: "Ctrl+Z" -> "<kbd>Ctrl</kbd><kbd>Z</kbd>"
        const keys = shortcut.split('+').map(key => key.trim());
        return keys.map(key => `<kbd>${key}</kbd>`).join('');
    }

    position(target, placement = 'top') {
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        let top, left;

        switch (placement) {
            case 'top':
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'bottom':
                top = rect.bottom + 8;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.right + 8;
                break;
            default:
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        }

        // Keep tooltip within viewport
        const padding = 8;
        if (left < padding) left = padding;
        if (left + tooltipRect.width > window.innerWidth - padding) {
            left = window.innerWidth - tooltipRect.width - padding;
        }
        if (top < padding) {
            top = rect.bottom + 8; // Flip to bottom if no space on top
        }

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    destroy() {
        clearTimeout(this.showTimeout);
        clearTimeout(this.hideTimeout);
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
    }
}

// Helper function to add tooltips to elements
export function addTooltip(element, text, shortcut = null, variant = '') {
    element.setAttribute('data-tooltip', text);
    if (shortcut) {
        element.setAttribute('data-shortcut', shortcut);
    }
    if (variant) {
        element.setAttribute('data-tooltip-variant', variant);
    }
    // Remove native title to avoid double tooltips
    element.removeAttribute('title');
}

// Helper to add tooltips to multiple elements
export function addTooltips(elements, config) {
    elements.forEach(element => {
        const { text, shortcut, variant } = config(element);
        addTooltip(element, text, shortcut, variant);
    });
}
