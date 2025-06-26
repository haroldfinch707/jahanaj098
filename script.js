// =========================================================
// Global DOM Selectors and Variables
// =========================================================
const cursorSpotlight = document.querySelector('.cursor-spotlight');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav__link');

// For Contact Form
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('submitButton');
// Removed: openContactFormPrompt and contactFormContainer as they are no longer needed

// For "Hacking Thing" trigger
const securityControlsTrigger = document.getElementById('securityControlsTrigger');


// =========================================================
// 1. Cursor Spotlight Effect
// =========================================================
if (cursorSpotlight) {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Direct positioning for immediate response
        cursorSpotlight.style.left = mouseX - 400 + 'px';
        cursorSpotlight.style.top = mouseY - 400 + 'px';
    });

    // Hide cursor spotlight when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursorSpotlight.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorSpotlight.style.opacity = '1';
    });
}

// =========================================================
// 2. Active Navigation on Scroll
// =========================================================
function setActiveNav() {
    let current = '';
    
    // Adjust the offset for when a section becomes "active" in the nav
    // This value might need fine-tuning to feel just right.
    const scrollOffsetForActive = 150; // Controls how high up the section needs to be to become active
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY + scrollOffsetForActive >= sectionTop && window.scrollY + scrollOffsetForActive < sectionTop + sectionHeight) {
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

// Call on page load
window.addEventListener('load', setActiveNav);
// Call on scroll
window.addEventListener('scroll', setActiveNav);

// =========================================================
// 3. Smooth Scrolling and Manual Active State
// =========================================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('nav__link--active'));
        // Add active class to clicked link
        link.classList.add('nav__link--active');
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 96; // This should match the padding at the top of your main content
            const elementPosition = targetSection.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Removed: Logic to programmatically click openContactFormPrompt, as form is always visible now
        }
    });
});

// =========================================================
// 4. Initial Console Message
// =========================================================
console.log(
    '%c🔐 Interested in security? ',
    'color: #5eead4; font-size: 14px; font-weight: bold;'
);
console.log(
    '%cReach out at ashfaquejahan5@gmail.com',
    'color: #94a3b8; font-size: 12px;'
);

// =========================================================
// 5. Fade in Animation on Scroll
// =========================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply initial styles and observe
document.querySelectorAll('.section p, .experience, .cert, .skill-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// =========================================================
// 6. Add hover effect to experience and cert items
// =========================================================
document.querySelectorAll('.experience, .cert').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease'; // Ensures transition applies only once on enter
    });
});

// =========================================================
// 7. Disable cursor spotlight on mobile/reduced motion
// =========================================================
if (window.matchMedia('(max-width: 1024px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (cursorSpotlight) {
        cursorSpotlight.style.display = 'none';
    }
}

// =========================================================
// 8. Secret Console Message / "Hacking Thing"
// =========================================================
if (securityControlsTrigger) {
    let triggeredHackingMessage = false; // Flag to ensure message appears only once initially

    securityControlsTrigger.addEventListener('mouseenter', () => {
        if (!triggeredHackingMessage) {
            console.clear(); // Clear previous console messages (optional, but cleaner)
            console.log(
                '%cACCESS GRANTED. Initiating scan protocols...',
                'color: #5eead4; font-size: 16px; font-weight: bold;'
            );
            console.log(
                '%c\n',
                'font-size: 1px; line-height: 0;' // This helps create a new line for the ASCII art
            );
            console.log(
                '%c _  _ ____ ____ ___ _ ____ ____ ____ ',
                'color: #5eead4;'
            );
            console.log(
                '%c |\\ | |___ |__/  |  | |___ |__/ |___ ',
                'color: #5eead4;'
            );
            console.log(
                '%c | \\| |___ |  \\  |  | |___ |  \\ |___ ',
                'color: #5eead4;'
            );
            console.log(
                '%c\nScan complete. Vulnerabilities found: 0. Keep digging!',
                'color: #94a3b8; font-size: 12px;'
            );
            triggeredHackingMessage = true; // Set flag so it doesn't repeat on subsequent hovers
        }
    });

    // Optional: Reset/clear console on mouse leave, or provide a hint
    securityControlsTrigger.addEventListener('mouseleave', () => {
        // You could clear the console again or log a different message if you want
        // console.clear(); // Uncomment to clear console when mouse leaves
    });
}

// =========================================================
// Removed Section 9: Toggle Contact Form Visibility (No longer needed)
// =========================================================

// =========================================================
// 10. Handle Contact Form Submission
// =========================================================
if (contactForm) {
    console.log('Contact form element found:', contactForm); // DEBUG: Confirm form is selected
    contactForm.addEventListener('submit', async (e) => {
        console.log('Submit event triggered.'); // DEBUG: Confirm listener fires
        e.preventDefault(); // Prevent default form submission (page reload)
        console.log('Default prevented.'); // DEBUG: Confirm preventDefault worked

        // --- MOVED TO HERE: Show "Sending..." status and disable button immediately ---
        submitButton.disabled = true;
        formStatus.textContent = 'Sending message...';
        formStatus.className = 'form-status'; // Reset classes for styling
        // --- END MOVED ---

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // --- Add Client-Side Data ---
        data.screenResolution = `${window.screen.width}x${window.screen.height}`;
        data.viewportDimensions = `${window.innerWidth}x${window.innerHeight}`;
        data.currentPageURL = window.location.href;
        data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        data.browserLanguage = navigator.language;
        // --- END Add Client-Side Data ---

        try {
            // This is the endpoint for your Vercel Serverless Function
            const response = await fetch('/api/send-telegram-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.classList.add('success');
                contactForm.reset(); // Clear the form

                // Clear the success message after 3 seconds
                setTimeout(() => {
                    formStatus.textContent = ''; // Clear text
                    formStatus.className = 'form-status'; // Reset classes
                    console.log('Form status message cleared after timeout.'); // DEBUG: Confirms timeout runs
                }, 3000); // 3000 milliseconds = 3 seconds
            } else {
                const errorData = await response.json();
                formStatus.textContent = `Failed to send message: ${errorData.message || 'Unknown error'}`;
                formStatus.classList.add('error');
                console.error('Form submission failed on server:', errorData); // DEBUG: Log server error
            }
        } catch (error) {
            console.error('Error submitting form:', error); // DEBUG: Log client-side fetch error
            formStatus.textContent = 'An error occurred. Please try again later.';
            formStatus.classList.add('error');
        } finally {
            submitButton.disabled = false;
        }
    });
}

// =========================================================
// 11. Make Clicking Anywhere within a Form Group Focus Input
// =========================================================
const formGroups = document.querySelectorAll('.form-group');

formGroups.forEach(group => {
    group.addEventListener('click', (event) => {
        // Check if the click target is already an input, textarea, or a label
        // If it is, let the browser's default behavior handle the focus
        const targetTagName = event.target.tagName;
        if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA' || targetTagName === 'LABEL') {
            return;
        }

        // Otherwise, find the first input or textarea within this form-group
        // and programmatically focus it
        const inputField = group.querySelector('input, textarea');
        if (inputField) {
            inputField.focus(); // Focus the found input field
        }
    });
});
