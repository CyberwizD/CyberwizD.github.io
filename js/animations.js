// Animation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-level-bar');
    const progressBars = document.querySelectorAll('.progress-skill-value');
    
    // Store original widths and reset to 0
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        bar.dataset.width = width;
    });
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        bar.dataset.width = width;
    });
    
    // Detect elements that should animate when scrolled into view
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    
    // Animate on scroll
    function animateOnScroll() {
        // Skill bars animation
        skillBars.forEach(bar => {
            if (isElementInViewport(bar) && bar.style.width === '0px') {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width;
                }, 200);
            }
        });
        
        // Progress bars animation
        progressBars.forEach(bar => {
            if (isElementInViewport(bar) && bar.style.width === '0px') {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width;
                }, 200);
            }
        });
        
        // Generic scroll animations
        animateOnScrollElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
            }
        });
    }
    
    // Matrix background animation
    const matrixBgs = document.querySelectorAll('.matrix-bg');
    let matrixAnimationFrame;
    
    function animateMatrix() {
        matrixBgs.forEach(bg => {
            if (isElementInViewport(bg)) {
                // Only animate if in viewport
                const after = window.getComputedStyle(bg, '::after');
                if (after) {
                    const currentPos = parseFloat(after.backgroundPositionY || '0');
                    bg.style.setProperty('--matrix-pos', `${currentPos + 0.5}px`);
                }
            }
        });
        
        matrixAnimationFrame = requestAnimationFrame(animateMatrix);
    }
    
    // Start matrix animation
    matrixAnimationFrame = requestAnimationFrame(animateMatrix);
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    window.addEventListener('scroll', function() {
        if (hero && isElementInViewport(hero)) {
            const scrollPosition = window.pageYOffset;
            if (heroContent) heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
            if (heroImage) heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        }
    });
    
    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Check if element is partially in viewport
    function isElementPartiallyInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
        
        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
        
        return (vertInView && horInView);
    }
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Typing animation
    // function createTypewriter(element, text, speed = 50, startDelay = 0) {
    //     if (!element) return;
        
    //     element.textContent = '';
    //     element.style.borderRight = '2px solid var(--accent)';
        
    //     let i = 0;
        
    //     setTimeout(() => {
    //         function typing() {
    //             if (i < text.length) {
    //                 element.textContent += text.charAt(i);
    //                 i++;
    //                 setTimeout(typing, speed);
    //             } else {
    //                 // Remove cursor when done
    //                 setTimeout(() => {
    //                     element.style.borderRight = 'none';
    //                 }, 1000);
    //             }
    //         }
    //         typing();
    //     }, startDelay);
    // }

    function createTypewriter(element, text, speed = 50, startDelay = 0) {
        if (!element) return;
    
        element.innerHTML = ''; // Clear existing content
        element.style.borderRight = '2px solid var(--accent)'; // Add cursor effect
    
        let i = 0;
    
        setTimeout(() => {
            function typing() {
                if (i < text.length) {
                    // Add characters one by one, respecting line breaks
                    if (text[i] === '\n') {
                        element.innerHTML += '<br>';
                    } else {
                        element.innerHTML += text[i];
                    }
                    i++;
                    setTimeout(typing, speed);
                } else {
                    // Remove cursor when done
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }
            typing();
        }, startDelay);
    }
    
    // Apply typing effect to terminal outputs if they have the typewriter class
    document.querySelectorAll('.typewriter').forEach(element => {
        const originalText = element.textContent;
        createTypewriter(element, originalText, 20, 500);
    });
    
    // Cursor blink effect
    const cursors = document.querySelectorAll('.cursor-blink');
    cursors.forEach(cursor => {
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    });
    
    // Clean up animation frame on page unload
    window.addEventListener('beforeunload', () => {
        if (matrixAnimationFrame) {
            cancelAnimationFrame(matrixAnimationFrame);
        }
    });
});