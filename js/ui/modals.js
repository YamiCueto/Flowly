// Modal wiring (export/import modal behaviors)
export function setupModals(app) {
    // Export modal
    const exportModal = document.getElementById('export-modal');
    const exportClose = document.getElementById('export-modal-close');

    if (exportClose) exportClose.addEventListener('click', () => { exportModal.classList.remove('active'); });
    if (exportModal) exportModal.addEventListener('click', (e) => { if (e.target === exportModal) exportModal.classList.remove('active'); });
    document.querySelectorAll('.export-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const format = e.currentTarget.dataset.format;
            app.exportDiagram(format);
            if (exportModal) exportModal.classList.remove('active');
        });
    });

    // Load modal
    const loadModal = document.getElementById('load-modal');
    const loadClose = document.getElementById('load-modal-close');

    if (loadClose) loadClose.addEventListener('click', () => { loadModal.classList.remove('active'); });
    if (loadModal) loadModal.addEventListener('click', (e) => { if (e.target === loadModal) loadModal.classList.remove('active'); });

    // File input
    const fileInput = document.getElementById('file-input');
    const loadFileBtn = document.getElementById('load-file-btn');
    if (loadFileBtn) loadFileBtn.addEventListener('click', () => { if (fileInput) fileInput.click(); });
    if (fileInput) fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            app.loadFromFile(file);
            if (loadModal) loadModal.classList.remove('active');
        }
    });

    // Saved projects list wiring will be done by app.openLoadModal which still lives in app.js
}
