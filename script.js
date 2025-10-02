// DOM Elements
const cursorSpotlight = document.querySelector('.cursor-spotlight');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav__link');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('submitButton');
const securityControlsTrigger = document.getElementById('securityControlsTrigger');

// Achievement Gallery Elements
const achievementsGrid = document.getElementById('achievementsGrid');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalDate = document.getElementById('modalDate');

// Cursor Spotlight Effect (Performance Optimized)
if (cursorSpotlight) {
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;
    
    function updateCursorPosition() {
        cursorSpotlight.style.transform = `translate(${mouseX - 400}px, ${mouseY - 400}px)`;
        ticking = false;
    }
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!ticking) {
            requestAnimationFrame(updateCursorPosition);
            ticking = true;
        }
    });

    document.addEventListener('mouseleave', () => {
        cursorSpotlight.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorSpotlight.style.opacity = '1';
    });
}

// Navigation Active State Management
function setActiveNav() {
    let current = '';
    const scrollOffsetForActive = 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY + scrollOffsetForActive >= sectionTop && 
            window.scrollY + scrollOffsetForActive < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('nav__link--active');
        
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('nav__link--active');
        }
    });
}

// Throttled scroll event for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            setActiveNav();
            scrollTimeout = null;
        }, 10);
    }
});

window.addEventListener('load', setActiveNav);

// Smooth Navigation with Enhanced Features
navLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        navLinks.forEach(l => l.classList.remove('nav__link--active'));
        link.classList.add('nav__link--active');
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 96;
            const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
    
    // Add keyboard navigation support
    link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowDown' && index < navLinks.length - 1) {
            e.preventDefault();
            navLinks[index + 1].focus();
        }
        
        if (e.key === 'ArrowUp' && index > 0) {
            e.preventDefault();
            navLinks[index - 1].focus();
        }
    });
});

// Console Security Messages
console.log(
    '%c🔐 Interested in security? ',
    'color: #5eead4; font-size: 14px; font-weight: bold;'
);
console.log(
    '%cReach out at ashfaquejahan5@gmail.com',
    'color: #94a3b8; font-size: 12px;'
);

// Enhanced Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animation delay for multiple elements
            const siblings = Array.from(entry.target.parentNode.children);
            const index = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 100}ms`;
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.section p, .experience, .cert, .skill-item, .achievement-item').forEach(el => {
    observer.observe(el);
});

// Enhanced hover effects for experience and certification items
document.querySelectorAll('.experience, .cert').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
        this.style.transform = 'translateY(-2px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Responsive and Accessibility Checks
if (window.matchMedia('(max-width: 1024px)').matches || 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (cursorSpotlight) {
        cursorSpotlight.style.display = 'none';
    }
}

// Enhanced Security Console Easter Egg
if (securityControlsTrigger) {
    let triggeredHackingMessage = false;
    
    const securityMessages = [
        '%cACCESS GRANTED. Initiating scan protocols...',
        '%cScanning for vulnerabilities...',
        '%cChecking authentication mechanisms...',
        '%cAnalyzing encryption protocols...',
        '%cTesting input validation...',
        '%c _  _ ____ ____ ___ _ ____ ____ ____ ',
        '%c |\\ | |___ |__/  |  | |___ |__/ |___ ',
        '%c | \\| |___ |  \\  |  | |___ |  \\ |___ ',
        '%cScan complete. Vulnerabilities found: 0. Keep digging! 🔒'
    ];
    
    securityControlsTrigger.addEventListener('mouseenter', () => {
        if (!triggeredHackingMessage) {
            console.clear();
            
            securityMessages.forEach((message, index) => {
                setTimeout(() => {
                    const isAsciiArt = index >= 5 && index <= 7;
                    const style = isAsciiArt ? 'color: #5eead4; font-family: monospace;' : 
                                 index === 0 ? 'color: #5eead4; font-size: 16px; font-weight: bold;' :
                                 index === 8 ? 'color: #94a3b8; font-size: 12px;' :
                                 'color: #5eead4; font-size: 12px;';
                    
                    console.log(message, style);
                }, index * 300);
            });
            
            triggeredHackingMessage = true;
        }
    });
}

// ===== ACHIEVEMENT GALLERY FUNCTIONALITY =====

// Initialize Achievement Gallery
function initializeGallery() {
    const achievementItems = document.querySelectorAll('.achievement-item');
    
    // Add click listeners to all achievement items
    achievementItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(item, index));
        
        // Add keyboard support
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(item, index);
            }
        });
    });
}

// Open Modal with Achievement Details
function openModal(item, index) {
    const img = item.querySelector('img');
    const info = item.querySelector('.achievement-info');
    
    if (!img || !info) return;
    
    // Set modal content
    modalImage.src = img.src;
    modalImage.alt = img.alt || 'Achievement Image';
    
    const title = info.querySelector('h3');
    const description = info.querySelector('p');
    const date = info.querySelector('.achievement-date');
    
    modalTitle.textContent = title ? title.textContent : 'Achievement';
    modalDescription.textContent = description ? description.textContent : 'No description available';
    modalDate.textContent = date ? date.textContent : '';
    
    // Show modal
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const closeButton = imageModal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.focus();
    }
}

// Close Modal
function closeModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Return focus to the previously focused element
    const focusedAchievement = document.querySelector('.achievement-item:focus');
    if (focusedAchievement) {
        focusedAchievement.focus();
    }
}

// Keyboard Navigation for Modal
document.addEventListener('keydown', (e) => {
    if (imageModal.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'Tab':
                // Trap focus within modal
                e.preventDefault();
                const closeButton = imageModal.querySelector('.modal-close');
                if (closeButton) {
                    closeButton.focus();
                }
                break;
        }
    }
});

// Click outside modal to close
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
});

// ===== CONTACT FORM FUNCTIONALITY =====

// Enhanced Contact Form with Validation and Error Handling
if (contactForm) {
    console.log('Contact form element found:', contactForm);
    
    contactForm.addEventListener('submit', async (e) => {
        console.log('Submit event triggered.');
        e.preventDefault();
        console.log('Default prevented.');

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Basic form validation
        if (!validateFormData(data)) {
            return;
        }

        // Add comprehensive metadata
        data.timestamp = new Date().toISOString();
        data.screenResolution = `${window.screen.width}x${window.screen.height}`;
        data.viewportDimensions = `${window.innerWidth}x${window.innerHeight}`;
        data.currentPageURL = window.location.href;
        data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        data.browserLanguage = navigator.language;
        data.userAgent = navigator.userAgent;
        data.referrer = document.referrer || 'Direct';

        // Set loading state
        setFormState('loading');

        try {
            const response = await fetch('/api/send-telegram-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setFormState('success', 'Message sent successfully!');
                contactForm.reset();

                // Clear success message after delay
                setTimeout(() => {
                    setFormState('default');
                }, 5000);
            } else {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || 'Server error occurred';
                setFormState('error', `Failed to send message: ${errorMessage}`);
                console.error('Form submission failed on server:', errorData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setFormState('error', 'Network error. Please check your connection and try again.');
        }
    });
}

// Form Validation Function
function validateFormData(data) {
    const errors = [];
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    // Email validation
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 3) {
        errors.push('Message must be at least 3 characters long');
    }
    
    if (errors.length > 0) {
        setFormState('error', errors.join('. '));
        return false;
    }
    
    return true;
}

// Email Validation Helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form State Management
function setFormState(state, message = '') {
    const button = submitButton;
    const status = formStatus;
    
    // Reset classes
    status.className = 'form-status';
    button.disabled = false;
    
    switch (state) {
        case 'loading':
            button.disabled = true;
            button.textContent = 'Sending...';
            status.textContent = 'Sending message...';
            status.classList.add('loading');
            break;
            
        case 'success':
            button.textContent = 'Send Message';
            status.textContent = message;
            status.classList.add('success');
            break;
            
        case 'error':
            button.textContent = 'Send Message';
            status.textContent = message;
            status.classList.add('error');
            break;
            
        case 'default':
        default:
            button.textContent = 'Send Message';
            status.textContent = '';
            break;
    }
}

// Enhanced Form Group Click Handlers
const formGroups = document.querySelectorAll('.form-group');

formGroups.forEach(group => {
    group.addEventListener('click', (event) => {
        const targetTagName = event.target.tagName;
        if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA' || targetTagName === 'LABEL') {
            return;
        }

        const inputField = group.querySelector('input, textarea');
        if (inputField) {
            inputField.focus();
        }
    });
});

// Enhanced form input focus effects
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
        if (this.value.trim()) {
            this.parentElement.classList.add('has-value');
        } else {
            this.parentElement.classList.remove('has-value');
        }
    });
    
    // Real-time validation feedback
    input.addEventListener('input', function() {
        const group = this.parentElement;
        group.classList.remove('error');
        
        // Clear any existing error messages
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
});

// ===== INITIALIZATION =====

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing gallery...');
    initializeGallery();
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !href.startsWith('#!')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 96;
                    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Performance monitoring (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        console.log(`%cPage loaded in ${performance.now().toFixed(2)}ms`, 'color: #5eead4;');
    });
}

// Make functions global for HTML onclick handlers
window.closeModal = closeModal;
window.openModal = openModal;

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setActiveNav,
        validateFormData,
        isValidEmail,
        openModal,
        closeModal
    };
}
