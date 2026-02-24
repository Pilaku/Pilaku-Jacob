// Smooth scrolling for navigation links
// Mobile hamburger menu toggle
const hamburger = document.getElementById('hamburger-toggle');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (link.classList.contains('has-arrow')) return; // don't close for dropdown toggles
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        }
    });
}

// Smooth scrolling for navigation links (exclude dropdown toggles)
document.querySelectorAll('a[href^="#"]:not(.has-arrow)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dropdown open on click (toggle .open) and close when clicking outside
document.querySelectorAll('.has-dropdown .has-arrow').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const parent = this.parentElement;
        const isOpen = parent.classList.contains('open');
        // close any other open dropdowns
        document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) parent.classList.add('open');
    });
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.has-dropdown')) {
        document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
    }
});


// Form handling
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        
        // Send form data using fetch
        fetch('contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Parse response
            const result = JSON.parse(data);
            
            // Show appropriate message
            showMessage(result.message, result.success ? 'success' : 'error');
            
            // Reset form if successful
            if (result.success) {
                form.reset();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again.', 'error');
        });
    });
}

// Function to show alert messages
function showMessage(message, type) {
    // Create or get alert container
    let alertDiv = document.querySelector('.alert');
    
    if (!alertDiv) {
        alertDiv = document.createElement('div');
        alertDiv.className = 'alert';
        form.parentNode.insertBefore(alertDiv, form);
    }
    
    // Update alert
    alertDiv.textContent = message;
    alertDiv.className = `alert ${type} show`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
    }, 5000);
}

// Lazy loading for images (optional)
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}
