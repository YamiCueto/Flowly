// Notification helpers: attach notify and confirm helpers to the app instance
export function attachNotificationHelpers(app) {
    // Notification helper using SweetAlert2 if available
    app.notify = (message, options = {}) => {
        const title = options.title || '';
        const icon = options.icon || 'success';
        const toast = options.toast !== undefined ? options.toast : true;
        const position = options.position || 'top-end';
        const timer = options.timer || 2000;
        if (window.Swal && typeof window.Swal.fire === 'function') {
            window.Swal.fire({
                title,
                text: message,
                icon,
                toast,
                position,
                showConfirmButton: false,
                timer,
                timerProgressBar: true
            });
        } else {
            try { alert(message); } catch (e) { }
        }
    };

    // Confirm helper using SweetAlert2 if available
    app.confirm = async (message, options = {}) => {
        try {
            if (window.Swal && typeof window.Swal.fire === 'function') {
                const result = await window.Swal.fire({
                    title: options.title || '',
                    text: message,
                    icon: options.icon || 'question',
                    showCancelButton: true,
                    confirmButtonText: options.confirmText || 'Aceptar',
                    cancelButtonText: options.cancelText || 'Cancelar',
                    reverseButtons: true
                });
                return !!result.isConfirmed;
            }
        } catch (e) { }
        try { return confirm(message); } catch (e) { return false; }
    };
}
