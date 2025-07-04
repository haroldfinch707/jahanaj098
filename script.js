
const cursorSpotlight = document.querySelector('.cursor-spotlight');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav__link');

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('submitButton');

const securityControlsTrigger = document.getElementById('securityControlsTrigger');



if (cursorSpotlight) {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorSpotlight.style.left = mouseX - 400 + 'px';
        cursorSpotlight.style.top = mouseY - 400 + 'px';
    });

    document.addEventListener('mouseleave', () => {
        cursorSpotlight.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorSpotlight.style.opacity = '1';
    });
}


function setActiveNav() {
    let current = '';

    const scrollOffsetForActive = 150; 
    
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

window.addEventListener('load', setActiveNav);
window.addEventListener('scroll', setActiveNav);


navLinks.forEach(link => {
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
});


console.log(
    '%c🔐 Interested in security? ',
    'color: #5eead4; font-size: 14px; font-weight: bold;'
);
console.log(
    '%cReach out at ashfaquejahan5@gmail.com',
    'color: #94a3b8; font-size: 12px;'
);


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

document.querySelectorAll('.section p, .experience, .cert, .skill-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


document.querySelectorAll('.experience, .cert').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease'; 
    });
});


if (window.matchMedia('(max-width: 1024px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (cursorSpotlight) {
        cursorSpotlight.style.display = 'none';
    }
}


if (securityControlsTrigger) {
    let triggeredHackingMessage = false; 

    securityControlsTrigger.addEventListener('mouseenter', () => {
        if (!triggeredHackingMessage) {
            console.clear(); 
            console.log(
                '%cACCESS GRANTED. Initiating scan protocols...',
                'color: #5eead4; font-size: 16px; font-weight: bold;'
            );
            console.log(
                '%c\n',
                'font-size: 1px; line-height: 0;' 
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
            triggeredHackingMessage = true; 
        }
    });

    securityControlsTrigger.addEventListener('mouseleave', () => {
        
    });
}


if (contactForm) {
    console.log('Contact form element found:', contactForm); 
    contactForm.addEventListener('submit', async (e) => {
        console.log('Submit event triggered.'); 
        e.preventDefault(); 
        console.log('Default prevented.'); 

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        data.screenResolution = `${window.screen.width}x${window.screen.height}`;
        data.viewportDimensions = `${window.innerWidth}x${window.innerHeight}`;
        data.currentPageURL = window.location.href;
        data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        data.browserLanguage = navigator.language;

        submitButton.disabled = true;
        formStatus.textContent = 'Sending message...';
        formStatus.className = 'form-status'; 

        try {
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
                contactForm.reset(); 

                setTimeout(() => {
                    formStatus.textContent = ''; 
                    formStatus.className = 'form-status'; 
                    console.log('Form status message cleared after timeout.'); 
                }, 3000); 
            } else {
                const errorData = await response.json();
                formStatus.textContent = `Failed to send message: ${errorData.message || 'Unknown error'}`;
                formStatus.classList.add('error');
                console.error('Form submission failed on server:', errorData); 
            }
        } catch (error) {
            console.error('Error submitting form:', error); 
            formStatus.textContent = 'An error occurred. Please try again later.';
            formStatus.classList.add('error');
        } finally {
            submitButton.disabled = false;
        }
    });
}


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
