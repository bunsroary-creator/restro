// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Confirm delete actions
    const deleteButtons = document.querySelectorAll('form[action*="DELETE"]');
    deleteButtons.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!showConfirmDialog('Delete Item', 'Are you sure you want to delete this item? This action cannot be undone.', 'danger')) {
                e.preventDefault();
            }
        });
    });

    // Auto-refresh order status
    if (window.location.pathname === '/orders') {
        setInterval(() => {
            // Only refresh if no modals are open
            if (!document.querySelector('.modal.show')) {
                refreshOrdersTable();
            }
        }, 15000); // Refresh every 15 seconds
    }

    // Image preview for menu items
    const imageUrlInput = document.getElementById('image_url');
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', function() {
            const url = this.value;
            let preview = document.getElementById('image-preview');
            
            if (!preview) {
                preview = document.createElement('img');
                preview.id = 'image-preview';
                preview.className = 'img-thumbnail mt-3 shadow-sm';
                preview.style.maxWidth = '200px';
                preview.style.maxHeight = '200px';
                preview.style.borderRadius = '0.75rem';
                this.parentNode.appendChild(preview);
            }
            
            if (url) {
                preview.src = url;
                preview.style.display = 'block';
                preview.classList.add('animate-fade-in');
                preview.onerror = function() {
                    this.style.display = 'none';
                };
            } else {
                preview.style.display = 'none';
            }
        });
    }

    // Real-time search for menu items
    const searchInput = document.getElementById('search');
    if (searchInput) {
        let searchTimeout;
        const searchIcon = searchInput.parentNode.querySelector('.bi-search');
        
        searchInput.addEventListener('input', function() {
            if (searchIcon) {
                searchIcon.className = 'bi bi-hourglass-split';
            }
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (searchIcon) {
                    searchIcon.className = 'bi bi-search';
                }
                this.form.submit();
            }, 800);
        });
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Status update confirmation
    const statusSelects = document.querySelectorAll('select[name="status"]');
    statusSelects.forEach(select => {
        const originalValue = select.value;
        select.addEventListener('change', function() {
            const orderId = this.form.action.match(/orders\/([^\/]+)/)[1];
            const newStatus = this.value;
            
            if (showConfirmDialog('Update Order Status', `Change order status to "${newStatus.toUpperCase()}"?`, 'primary')) {
                // Add loading state
                this.disabled = true;
                this.classList.add('loading');
                this.form.submit();
            } else {
                // Reset to previous value
                this.value = originalValue;
            }
        });
    });
    
    // Enhanced form validation
    const forms = document.querySelectorAll('form[data-validate="true"]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Please fill in all required fields correctly.', 'warning');
            }
        });
    });
    
    // Auto-save draft functionality
    const draftForms = document.querySelectorAll('form[data-autosave="true"]');
    draftForms.forEach(form => {
        const formId = form.id || 'default-form';
        
        // Load saved draft
        loadFormDraft(form, formId);
        
        // Save draft on input
        form.addEventListener('input', debounce(() => {
            saveFormDraft(form, formId);
        }, 1000));
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save forms
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const activeForm = document.activeElement.closest('form');
            if (activeForm) {
                activeForm.submit();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                const modal = bootstrap.Modal.getInstance(openModal);
                if (modal) modal.hide();
            }
        }
    });
});

// Initialize animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateX(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        if (el.classList.contains('animate-fade-in')) {
            el.style.transform = 'translateY(20px)';
        } else if (el.classList.contains('animate-slide-in')) {
            el.style.transform = 'translateX(20px)';
        }
        observer.observe(el);
    });
}

// Enhanced confirm dialog
function showConfirmDialog(title, message, type = 'primary') {
    return confirm(`${title}\n\n${message}`);
}

// Show notification
function showNotification(message, type = 'info') {
    const alertClass = `alert-${type}`;
    const iconClass = type === 'success' ? 'bi-check-circle-fill' : 
                     type === 'warning' ? 'bi-exclamation-triangle-fill' :
                     type === 'danger' ? 'bi-x-circle-fill' : 'bi-info-circle-fill';
    
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show animate-slide-in" role="alert">
            <i class="bi ${iconClass} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const container = document.querySelector('.container-fluid') || document.body;
    container.insertAdjacentHTML('afterbegin', alertHtml);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const alert = container.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Auto-save functionality
function saveFormDraft(form, formId) {
    const formData = new FormData(form);
    const draftData = {};
    
    for (let [key, value] of formData.entries()) {
        draftData[key] = value;
    }
    
    localStorage.setItem(`draft_${formId}`, JSON.stringify(draftData));
}

function loadFormDraft(form, formId) {
    const draftData = localStorage.getItem(`draft_${formId}`);
    
    if (draftData) {
        try {
            const data = JSON.parse(draftData);
            
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && !field.value) {
                    field.value = data[key];
                }
            });
        } catch (e) {
            console.warn('Failed to load form draft:', e);
        }
    }
}

// Refresh orders table
function refreshOrdersTable() {
    const ordersTable = document.querySelector('.table tbody');
    if (ordersTable) {
        // Add subtle loading indicator
        ordersTable.style.opacity = '0.7';
        
        // Simulate refresh (in real app, this would be an AJAX call)
        setTimeout(() => {
            ordersTable.style.opacity = '1';
        }, 1000);
    }
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(dateString) {
    return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateString));
}

// Enhanced utility functions
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Export functions for global use
window.adminUtils = {
    formatCurrency,
    formatDate,
    formatRelativeTime,
    animateNumber,
    showNotification,
    showConfirmDialog
};