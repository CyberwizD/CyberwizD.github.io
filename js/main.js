// ===================================
// HORIZONTAL SCROLL NAVIGATION
// ===================================

// Get all sections
const sections = document.querySelectorAll('.section');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Determine if a target element (or its parents) should keep vertical scrolling
function canScrollVertically(element, deltaY) {
    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;
    const isScrollable = (overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight > element.clientHeight;

    if (!isScrollable) return false;
    if (deltaY < 0 && element.scrollTop > 0) return true;
    if (deltaY > 0 && element.scrollTop + element.clientHeight < element.scrollHeight) return true;

    return false;
}

function shouldAllowVerticalScroll(target, deltaY) {
    let el = target;

    while (el && el !== document.body) {
        if (canScrollVertically(el, deltaY)) {
            return true;
        }
        el = el.parentElement;
    }

    return false;
}

// Translate mouse wheel (vertical) to horizontal scroll for desktop users
function handleWheelScroll(event) {
    const dominantAxis = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? 'x' : 'y';

    // Keep native horizontal gestures and allow vertical scroll where needed
    if (dominantAxis === 'x' || shouldAllowVerticalScroll(event.target, event.deltaY)) {
        return;
    }

    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    const maxScrollLeft = (document.body.scrollWidth - window.innerWidth) || 0;
    const atStart = scrollLeft <= 0;
    const atEnd = scrollLeft >= maxScrollLeft;

    // Let the natural edge/bounce happen on the first/last pane
    if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) {
        return;
    }

    event.preventDefault();

    const scrollAmount = event.deltaY || event.deltaX;
    window.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

window.addEventListener('wheel', handleWheelScroll, { passive: false });

// Create scroll indicators
function createScrollIndicators() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';

    const sectionNames = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Certificates', 'Contact'];

    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'scroll-dot';
        dot.setAttribute('data-label', sectionNames[index] || `Section ${index + 1}`);
        dot.setAttribute('data-index', index);

        dot.addEventListener('click', () => {
            scrollToSection(index);
        });

        indicator.appendChild(dot);
    });

    document.body.appendChild(indicator);
}

// Create section counter
function createSectionCounter() {
    const counter = document.createElement('div');
    counter.className = 'section-counter';
    counter.innerHTML = '<span class="current">01</span> / <span class="total">07</span>';
    document.body.appendChild(counter);
}

// Create scroll progress bar
function createScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.style.width = '0%';
    document.body.appendChild(progress);
}

// Scroll hint for visitors
function createScrollHint() {
    const hint = document.createElement('div');
    hint.className = 'scroll-hint';
    hint.innerHTML = `
        <span class="hint-dot"></span>
        <span class="hint-arrow">Scroll / Swipe →</span>
    `;

    const hideHint = () => {
        if (!hint.parentElement) return;
        hint.classList.add('hide');
        setTimeout(() => hint.remove(), 400);
    };

    ['wheel', 'touchstart', 'keydown'].forEach(eventName => {
        window.addEventListener(eventName, hideHint, { once: true, passive: eventName !== 'wheel' });
    });

    setTimeout(hideHint, 6000);
    document.body.appendChild(hint);
}

// Scroll to specific section
function scrollToSection(index) {
    const section = sections[index];
    if (section) {
        section.scrollTop = 0;
        section.querySelectorAll('.container').forEach(child => {
            child.scrollTop = 0;
        });
        section.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }
}

// Update active indicators
function updateScrollIndicators() {
    const scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft || 0;
    const windowWidth = window.innerWidth;
    const currentIndex = Math.round(scrollLeft / windowWidth);

    // Update dots
    const dots = document.querySelectorAll('.scroll-dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update counter
    const counter = document.querySelector('.section-counter .current');
    if (counter) {
        counter.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    // Update progress bar
    const progress = document.querySelector('.scroll-progress');
    if (progress) {
        const totalWidth = document.body.scrollWidth - windowWidth;
        const progressPercent = totalWidth > 0 ? (scrollLeft / totalWidth) * 100 : 0;
        progress.style.width = `${progressPercent}%`;
    }

    // Update navbar active links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        if (index === currentIndex) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Navbar scroll effect and update indicators on scroll
document.body.addEventListener('scroll', () => {
    const scrollLeft = document.body.scrollLeft;
    if (scrollLeft > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    updateScrollIndicators();
});

// Also listen on window for compatibility
window.addEventListener('scroll', () => {
    updateScrollIndicators();
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';

        // Scroll to section
        scrollToSection(index);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    const windowWidth = window.innerWidth;
    const currentIndex = Math.round(scrollLeft / windowWidth);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
            scrollToSection(currentIndex + 1);
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
            scrollToSection(currentIndex - 1);
        }
    } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(sections.length - 1);
    }
});

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(element => {
    observer.observe(element);
});

// ===================================
// ANIMATED COUNTERS
// ===================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
}

// Start counter animation when stats section is visible
const statValues = document.querySelectorAll('.stat-value');
let countersAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            statValues.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
        }
    });
}, { threshold: 0.5 });

const profileCard = document.querySelector('.profile-card');
if (profileCard) {
    statsObserver.observe(profileCard);
}

// ===================================
// TYPING EFFECT FOR HERO SUBTITLE (Optional)
// ===================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Uncomment to enable typing effect
// const heroSubtitle = document.querySelector('.hero-subtitle');
// if (heroSubtitle) {
//     const originalText = heroSubtitle.textContent;
//     typeWriter(heroSubtitle, originalText, 80);
// }

// ===================================
// DYNAMIC BACKGROUND PARTICLES (Optional)
// ===================================

function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(139, 92, 246, 0.5);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(particle);
    }
}

// Add particle animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(${Math.random() * 100 - 50}px);
        }
    }
`;
document.head.appendChild(style);

// Uncomment to enable particles
// createParticles();

// ===================================
// SKILL TAGS HOVER EFFECT
// ===================================

const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
    });

    tag.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });
});

// ===================================
// PROJECT CARDS TILT EFFECT (Optional)
// ===================================

function addTiltEffect(element) {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
}

// Uncomment to enable tilt effect on project cards
// const projectCards = document.querySelectorAll('.project-card');
// projectCards.forEach(card => addTiltEffect(card));

// ===================================
// COPY EMAIL TO CLIPBOARD
// ===================================

const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const email = link.getAttribute('href').replace('mailto:', '');

        // Show a tooltip or notification
        const tooltip = document.createElement('div');
        tooltip.textContent = 'Opening email client...';
        tooltip.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(139, 92, 246, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => tooltip.remove(), 300);
        }, 2000);
    });
});

// ===================================
// LAZY LOADING FOR IMAGES
// ===================================

const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===================================
// THEME TOGGLE (Optional - Dark/Light Mode)
// ===================================

function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.innerHTML = `
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
    `;
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient-primary);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        z-index: 1000;
        transition: all 0.3s ease;
    `;

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        // Store preference
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    // Uncomment to add theme toggle button
    // document.body.appendChild(themeToggle);
}

// initThemeToggle();

// Scroll-to-top removed for horizontal layout

// ===================================
// CURSOR TRAIL EFFECT (Optional)
// ===================================

function createCursorTrail() {
    const coords = { x: 0, y: 0 };
    const circles = [];
    const colors = ['#8b5cf6', '#3b82f6', '#06b6d4'];

    for (let i = 0; i < 20; i++) {
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: ${colors[i % colors.length]};
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i * 0.05};
            transition: all 0.1s ease;
        `;
        circles.push(circle);
        document.body.appendChild(circle);
    }

    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.transform = `scale(${(circles.length - index) / circles.length})`;

            const nextCircle = circles[index + 1] || circles[0];
            x += (parseInt(nextCircle.style.left) - x) * 0.3;
            y += (parseInt(nextCircle.style.top) - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    // Uncomment to enable cursor trail
    // animateCircles();
}

// createCursorTrail();

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for scroll events
function debounce(func, wait = 10) {
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

// Apply debounce to scroll handler
const debouncedScroll = debounce(() => {
    // Your scroll logic here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%cHello, Developer!', 'font-size: 20px; color: #8b5cf6; font-weight: bold;');
console.log('%cLooking for something? Feel free to reach out!', 'font-size: 14px; color: #3b82f6;');
console.log('%cBuilt with passion by Wisdom Udoye', 'font-size: 12px; color: #06b6d4;');

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully!');

    // Force scroll to top on page load
    window.scrollTo(0, 0);
    document.body.scrollTo(0, 0);

    // Initialize horizontal scroll features with a small delay
    setTimeout(() => {
        createScrollIndicators();
        createSectionCounter();
        createScrollProgress();
        createScrollHint();
        updateScrollIndicators();
    }, 100);

    // Preload critical images
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
        const img = new Image();
        img.src = profileImage.src;
    }

    console.log('Horizontal scroll navigation enabled! Use arrow keys or scroll dots to navigate.');
});

// Also reset scroll position when page becomes visible
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was loaded from cache
        window.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
    }
});
