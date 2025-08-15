// Elegant & Smooth Portfolio Animations
// A clean, performant animation system for modern portfolios

(function () {
    'use strict';

    // Animation Engine
    class SmoothAnimations {
        constructor() {
            this.animations = new Map();
            this.observers = new Map();
            this.isInitialized = false;
            this.rafId = null;
        }

        // Initialize the animation system
        init() {
            if (this.isInitialized) return;

            this.isInitialized = true;
            this.setupInitialAnimations();
//             this.setupScrollAnimations();
//             this.setupHoverEffects();
//             this.setupLoadingAnimations();

            console.log('Smooth animations initialized');
        }

        // Utility: Get elements safely
        getElements(selector) {
            if (typeof selector === 'string') {
                return Array.from(document.querySelectorAll(selector));
            }
            return Array.isArray(selector) ? selector : [selector];
        }

        // Core animation function
        animate(element, properties, options = {}) {
            const {
                duration = 800,
                    delay = 0,
                    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
                    onComplete = null
            } = options;

            if (!element || !element.style) return;

            // Apply initial transform if needed
            if (properties.transform && !element.style.transform) {
                element.style.transform = properties.transform.from || '';
            }

            // Set transition
            element.style.transition = `all ${duration}ms ${easing}`;

            // Apply animation after delay
            setTimeout(() => {
                Object.keys(properties).forEach(prop => {
                    if (prop === 'transform') {
                        element.style.transform = properties[prop].to || properties[prop];
                    } else {
                        element.style[prop] = properties[prop];
                    }
                });

                // Handle completion
                if (onComplete) {
                    setTimeout(onComplete, duration);
                }
            }, delay);
        }

        // Fade up animation
//         fadeUp(elements, options = {}) {
//             const {
//                 distance = 30,
//                     duration = 800,
//                     delay = 0,
//                     stagger = 0
//             } = options;

            this.getElements(elements).forEach((element, index) => {
                // Set initial state
                element.style.opacity = '0';
                element.style.transform = `translateY(${distance}px)`;

                // Animate
                this.animate(element, {
                    opacity: '1',
                    transform: 'translateY(0px)'
                }, {
                    duration,
                    delay: delay + (index * stagger)
                });
            });
        }

        // Netflix-style title animation
        netflixTitle(elements, options = {}) {
            const {
                duration = 2000,
                    delay = 0
            } = options;

            this.getElements(elements).forEach(element => {
                // Set initial state
                element.style.opacity = '0';
                element.style.transform = 'scale(1.15)';
                element.style.filter = 'blur(8px)';

                // Animate
                this.animate(element, {
                    opacity: '1',
                    transform: 'scale(1)',
                    filter: 'blur(0px)'
                }, {
                    duration,
                    delay,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
            });
        }

        // Smooth fade in
//         fadeIn(elements, options = {}) {
//             const {
//                 duration = 1000,
//                     delay = 0,
//                     stagger = 0
//             } = options;

            this.getElements(elements).forEach((element, index) => {
                element.style.opacity = '0';

                this.animate(element, {
                    opacity: '1'
                }, {
                    duration,
                    delay: delay + (index * stagger)
                });
            });
        }

        // Scale in animation
//         scaleIn(elements, options = {}) {
//             const {
//                 fromScale = 0.8,
//                     duration = 600,
//                     delay = 0
//             } = options;

            this.getElements(elements).forEach(element => {
                element.style.opacity = '0';
                element.style.transform = `scale(${fromScale})`;

                this.animate(element, {
                    opacity: '1',
                    transform: 'scale(1)'
                }, {
                    duration,
                    delay,
                    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                });
            });
        }

        // Setup initial page load animations
        setupInitialAnimations() {
            // Wait for fonts and images to load
            document.fonts.ready.then(() => {
                // Hero title - Netflix style
                const heroSelectors = [
                    'h1',
                    '.hero-title',
                    '[class*="title"]',
                    'header h1, header h2',
                    '.main-title'
                ];

                for (const selector of heroSelectors) {
                    const heroElement = document.querySelector(selector);
                    if (heroElement) {
                        this.netflixTitle(heroElement, {
                            delay: 300
                        });
                        break;
                    }
                }

                // Navigation - smooth fade up
                const navSelectors = ['nav', '.navigation', 'header nav', '.nav'];
                for (const selector of navSelectors) {
                    const navElement = document.querySelector(selector);
                    if (navElement) {
//                         this.fadeUp(navElement, {
                            delay: 800,
                            distance: 20
                        });
                        break;
                    }
                }

                // Content sections - staggered fade up
                const contentSelectors = [
                    'main section',
                    '.content section',
                    'article',
                    '.about',
                    '.projects',
                    'p',
                    '.description'
                ];

                contentSelectors.forEach((selector, index) => {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
//                         this.fadeUp(elements, {
                            delay: 1200 + (index * 200),
                            stagger: 100,
                            distance: 25
                        });
                    }
                });
            });
        }

        // Setup scroll-triggered animations
//         setupScrollAnimations() {
//             const observerOptions = {
//                 threshold: 0.1,
//                 rootMargin: '0px 0px -50px 0px'
//             };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        entry.target.classList.add('animated');

//                         this.fadeUp(entry.target, {
                            duration: 1000,
                            distance: 30
                        });
                    }
                });
            }, observerOptions);

            // Observe common content elements
            const scrollElements = document.querySelectorAll(`
                .card,
                .project,
                .work-item,
                .portfolio-item,
                .skill,
                .experience,
                .education,
                footer,
                .footer,
                .contact,
                .cta
            `);

            scrollElements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                observer.observe(element);
            });

            this.observers.set('scroll', observer);
        }

        // Setup elegant hover effects
//         setupHoverEffects() {
//             // Links and buttons
//             const interactiveElements = document.querySelectorAll(`
//                 a,
//                 button,
//                 .btn,
//                 .link,
//                 .project-link,
//                 .card,
//                 .project-item
//             `);
// 
//             interactiveElements.forEach(element => {
//                 element.style.transition = 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)';
// 
//                 element.addEventListener('mouseenter', () => {
//                     element.style.transform = 'translateY(-2px)';
//                     element.style.filter = 'brightness(1.1)';
//                 });

                element.addEventListener('mouseleave', () => {
                    element.style.transform = 'translateY(0px)';
                    element.style.filter = 'brightness(1)';
                });

                // Click effect
                element.addEventListener('mousedown', () => {
                    element.style.transform = 'translateY(0px) scale(0.98)';
                });

                element.addEventListener('mouseup', () => {
                    element.style.transform = 'translateY(-2px) scale(1)';
                });
            });

            // Special hover effect for navigation items
            const navLinks = document.querySelectorAll('nav a, .nav a, .navigation a');
            navLinks.forEach(link => {
                link.style.transition = 'all 250ms ease-out';

                link.addEventListener('mouseenter', () => {
                    link.style.opacity = '0.7';
                    link.style.transform = 'translateX(3px)';
                });

                link.addEventListener('mouseleave', () => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateX(0px)';
                });
            });
        }

        // Handle loading animations
//         setupLoadingAnimations() {
//             // Loading screen fade out
//             const loadingElements = document.querySelectorAll(`
//                 .loading,
//                 .loader,
//                 .preloader,
//                 #loading,
//                 #loader
//             `);
// 
//             loadingElements.forEach(loader => {
//                 setTimeout(() => {
//                     this.animate(loader, {
//                         opacity: '0',
//                         transform: 'scale(0.9)'
//                     }, {
                        duration: 800,
                        onComplete: () => {
                            loader.style.display = 'none';
                        }
                    });
                }, 2500);
            });

            // Progress bars
            const progressBars = document.querySelectorAll(`
                .progress-bar,
                .loading-bar,
                .progress
            `);

            progressBars.forEach(bar => {
                bar.style.transform = 'scaleX(0)';
                bar.style.transformOrigin = 'left center';

                setTimeout(() => {
                    this.animate(bar, {
                        transform: 'scaleX(1)'
                    }, {
                        duration: 2000,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    });
                }, 100);
            });
        }

        // Smooth scroll to top
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Cleanup method
        destroy() {
            this.observers.forEach(observer => observer.disconnect());
            this.observers.clear();
            this.animations.clear();
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
        }
    }

    // Initialize when DOM is ready
    function initializeAnimations() {
        const animations = new SmoothAnimations();

        // Initialize immediately if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => animations.init(), 100);
            });
        } else {
            setTimeout(() => animations.init(), 100);
        }

        // Make available globally for manual control
        window.SmoothAnimations = animations;

        // Auto-handle back to top buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.back-to-top, .scroll-top, #top, .top-btn')) {
                e.preventDefault();
                animations.scrollToTop();
            }
        });
    }

    // Start the system
    initializeAnimations();

    // Add CSS for smooth scrolling and performance
    const style = document.createElement('style');
    style.textContent = `
        html {
// Removed scroll-behavior to avoid scroll issues
        }
        
        * {
            backface-visibility: hidden;
            perspective: 1000;
        }
        
        .animated {
            will-change: transform, opacity;
        }
    `;
    document.head.appendChild(style);

})();

console.log('Elegant smooth animations loaded');