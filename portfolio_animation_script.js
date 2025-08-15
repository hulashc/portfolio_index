// ENHANCED PORTFOLIO ANIMATIONS - Fade Up + Netflix-style heading
// Updated with smooth fade-up animations and Netflix-style main heading

console.log("🎭 Loading enhanced animation system...");

// ANIMATION ENGINE
const AnimationEngine = {
    // Easing functions for smooth animations
    easing: {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeOutElastic: t => Math.sin(-13 * (t + 1) * Math.PI / 2) * Math.pow(2, -10 * t) + 1,
        easeOutBounce: t => {
            if (t < 1 / 2.75) return 7.5625 * t * t;
            if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        },
        // Netflix-style easing
        easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        easeInOutExpo: t => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2
    },

    // Active animations storage
    animations: new Map(),
    animationId: 0,

    // Helper functions
    lerp(start, end, progress) {
        return start + (end - start) * progress;
    },

    // Get elements from selector
    getElements(selector) {
        if (typeof selector === 'string') {
            if (selector.startsWith('#')) {
                const el = document.getElementById(selector.slice(1));
                return el ? [el] : [];
            } else if (selector.startsWith('.')) {
                return Array.from(document.getElementsByClassName(selector.slice(1)));
            } else {
                return Array.from(document.querySelectorAll(selector));
            }
        }
        return Array.isArray(selector) ? selector : [selector];
    },

    // Main animate function
    animate(options) {
        const {
            elements: elementSelector,
            properties = {},
            duration = 1000,
            easing = 'easeOutCubic',
            delay = 0,
            onUpdate = null,
            onComplete = null
        } = options;

        const elements = this.getElements(elementSelector);
        if (elements.length === 0) {
            return;
        }

        const animId = ++this.animationId;
        const easingFunc = typeof easing === 'string' ? this.easing[easing] : easing;

        // Store initial values for each element
        const initialValues = elements.map(element => {
            const initial = {};
            Object.keys(properties).forEach(prop => {
                initial[prop] = this.getCurrentValue(element, prop);
            });
            return initial;
        });

        const animation = {
            id: animId,
            elements,
            properties,
            initialValues,
            duration,
            easing: easingFunc,
            delay,
            onUpdate,
            onComplete,
            startTime: null,
            progress: 0,
            isComplete: false
        };

        // Store animation
        this.animations.set(animId, animation);

        // Start animation after delay
        setTimeout(() => {
            if (this.animations.has(animId)) {
                animation.startTime = performance.now();
                this.startAnimationLoop();
            }
        }, delay);

        // Return control object
        return {
            id: animId,
            pause: () => this.pauseAnimation(animId),
            resume: () => this.resumeAnimation(animId),
            stop: () => this.stopAnimation(animId)
        };
    },

    // Get current CSS value for property
    getCurrentValue(element, property) {
        const style = window.getComputedStyle(element);

        switch (property) {
            case 'x':
            case 'y':
                const transform = style.transform;
                if (transform === 'none') return 0;
                const matrix = transform.match(/translate3?d?\(([^)]+)\)/);
                if (matrix) {
                    const values = matrix[1].split(',').map(v => parseFloat(v.trim()));
                    return property === 'x' ? (values[0] || 0) : (values[1] || 0);
                }
                return 0;
            case 'scale':
                const scaleTransform = style.transform;
                if (scaleTransform === 'none') return 1;
                const scaleMatch = scaleTransform.match(/scale\(([^)]+)\)/);
                return scaleMatch ? parseFloat(scaleMatch[1]) : 1;
            case 'rotate':
                const rotateTransform = style.transform;
                if (rotateTransform === 'none') return 0;
                const rotateMatch = rotateTransform.match(/rotate\(([^)]+)deg\)/);
                return rotateMatch ? parseFloat(rotateMatch[1]) : 0;
            case 'opacity':
                return parseFloat(style.opacity);
            default:
                const value = style.getPropertyValue(property);
                return parseFloat(value) || 0;
        }
    },

    // Apply animated values to elements
    applyValues(animation) {
        const {
            elements,
            properties,
            initialValues,
            progress,
            easing
        } = animation;
        const easedProgress = easing(progress);

        elements.forEach((element, index) => {
            const initial = initialValues[index];
            const transforms = [];
            let hasTransform = false;

            Object.entries(properties).forEach(([prop, targetValue]) => {
                const startValue = initial[prop];
                const currentValue = this.lerp(startValue, targetValue, easedProgress);

                switch (prop) {
                    case 'x':
                        transforms.push(`translateX(${currentValue}px)`);
                        hasTransform = true;
                        break;
                    case 'y':
                        transforms.push(`translateY(${currentValue}px)`);
                        hasTransform = true;
                        break;
                    case 'scale':
                        transforms.push(`scale(${currentValue})`);
                        hasTransform = true;
                        break;
                    case 'rotate':
                        transforms.push(`rotate(${currentValue}deg)`);
                        hasTransform = true;
                        break;
                    case 'opacity':
                        element.style.opacity = currentValue;
                        break;
                    default:
                        element.style.setProperty(prop, currentValue + 'px');
                        break;
                }
            });

            if (hasTransform) {
                element.style.transform = transforms.join(' ');
            }
        });

        // Call update callback
        if (animation.onUpdate) {
            animation.onUpdate(progress, easedProgress);
        }
    },

    // Animation loop
    startAnimationLoop() {
        if (this.loopRunning) return;
        this.loopRunning = true;
        this.animationLoop();
    },

    animationLoop() {
        const currentTime = performance.now();
        let hasActiveAnimations = false;

        this.animations.forEach((animation, id) => {
            if (animation.startTime === null || animation.isComplete) return;

            const elapsed = currentTime - animation.startTime;
            animation.progress = Math.min(elapsed / animation.duration, 1);

            this.applyValues(animation);

            if (animation.progress >= 1) {
                // Animation complete
                animation.isComplete = true;
                if (animation.onComplete) {
                    animation.onComplete();
                }
                this.animations.delete(id);
            } else {
                hasActiveAnimations = true;
            }
        });

        if (hasActiveAnimations) {
            requestAnimationFrame(() => this.animationLoop());
        } else {
            this.loopRunning = false;
        }
    },

    // Animation controls
    pauseAnimation(id) {
        const animation = this.animations.get(id);
        if (animation) {
            animation.pausedAt = performance.now();
        }
    },

    resumeAnimation(id) {
        const animation = this.animations.get(id);
        if (animation && animation.pausedAt) {
            const pausedDuration = performance.now() - animation.pausedAt;
            animation.startTime += pausedDuration;
            animation.pausedAt = null;
        }
    },

    stopAnimation(id) {
        this.animations.delete(id);
    },

    // Convenience methods
    fadeUp(elements, duration = 1000, distance = 30, easing = 'easeOutCubic') {
        const elementsArray = this.getElements(elements);
        elementsArray.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = `translateY(${distance}px)`;
        });

        return this.animate({
            elements,
            properties: {
                opacity: 1,
                y: 0
            },
            duration,
            easing
        });
    },

    netflixTitle(elements, duration = 2500) {
        const elementsArray = this.getElements(elements);
        elementsArray.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'scale(1.2)';
        });

        return this.animate({
            elements,
            properties: {
                opacity: 1,
                scale: 1
            },
            duration,
            easing: 'easeOutExpo'
        });
    }
};

console.log("✅ Enhanced AnimationEngine loaded");

// ENHANCED PORTFOLIO ANIMATIONS
document.addEventListener('DOMContentLoaded', function () {
    console.log("🎭 Starting enhanced animations...");

    // Wait for page to fully load
    window.addEventListener('load', function () {
        setTimeout(startEnhancedAnimations, 300);
    });

    function startEnhancedAnimations() {
        console.log("✨ Initializing enhanced animations...");

        // 1. NETFLIX-STYLE HERO + FADE UP SEQUENCE
        enhancedPageLoad();

        // 2. SUBTLE HOVER EFFECTS
        setupElegantHovers();

        // 3. LOADING SCREEN (if exists)
        handleLoadingElegantly();

        // 4. SMOOTH SCROLL FADE-UP REVEALS
        setupFadeUpScrolls();
    }

    // 1. Enhanced Page Load Sequence with Netflix-style title and fade-up
    function enhancedPageLoad() {
        // Netflix-style animation for hero title
        const heroTitle = document.querySelector('#ho-ba-ti, h1');
        if (heroTitle) {
            console.log("🎬 Netflix-style hero title animation");
            AnimationEngine.netflixTitle(heroTitle, 2000);
        }

        // Fade up navigation
        const nav = document.querySelector('#n');
        if (nav) {
            console.log("⬆️ Fade up navigation");
            setTimeout(() => {
                AnimationEngine.fadeUp(nav, 1200, 20, 'easeOutCubic');
            }, 800);
        }

        // Fade up about section
        const aboutSection = document.querySelector('#ho-ab0 p');
        if (aboutSection) {
            console.log("⬆️ Fade up about section");
            setTimeout(() => {
                AnimationEngine.fadeUp(aboutSection, 1400, 25, 'easeOutCubic');
            }, 1200);
        }

        // Fade up links section
        const linksSection = document.querySelector('#ho-ab1 p');
        if (linksSection) {
            console.log("⬆️ Fade up links section");
            setTimeout(() => {
                AnimationEngine.fadeUp(linksSection, 1300, 20, 'easeOutCubic');
            }, 1600);
        }
    }

    // 2. Subtle Hover Effects
    function setupElegantHovers() {
        console.log("🖱️ Setting up elegant hover effects...");

        // Smooth hover on project links
        const projectLinks = document.querySelectorAll('.y a, a[href*="/work/"], a[href*="/archive/"]');
        projectLinks.forEach(link => {
            link.addEventListener('mouseenter', function () {
                AnimationEngine.animate({
                    elements: this,
                    properties: {
                        y: -2,
                        opacity: 0.8
                    },
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });

            link.addEventListener('mouseleave', function () {
                AnimationEngine.animate({
                    elements: this,
                    properties: {
                        y: 0,
                        opacity: 1
                    },
                    duration: 300,
                    easing: 'easeOutCubic'
                });
            });
        });

        // Subtle hover on navigation items
        const navItems = document.querySelectorAll('#n a, #n-me a, #n-co');
        navItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                AnimationEngine.animate({
                    elements: this,
                    properties: {
                        y: -1,
                        opacity: 0.7
                    },
                    duration: 200,
                    easing: 'easeOutCubic'
                });
            });

            item.addEventListener('mouseleave', function () {
                AnimationEngine.animate({
                    elements: this,
                    properties: {
                        y: 0,
                        opacity: 1
                    },
                    duration: 200,
                    easing: 'easeOutCubic'
                });
            });
        });

        // Enhanced click effect for back to top
        const topButton = document.getElementById('top');
        if (topButton) {
            topButton.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Bounce effect
                AnimationEngine.animate({
                    elements: this,
                    properties: {
                        scale: 0.95,
                        opacity: 0.6
                    },
                    duration: 150,
                    easing: 'easeOutCubic',
                    onComplete: () => {
                        AnimationEngine.animate({
                            elements: this,
                            properties: {
                                scale: 1,
                                opacity: 1
                            },
                            duration: 200,
                            easing: 'easeOutBounce'
                        });
                    }
                });
            });
        }

        // Enhanced theme toggle effect
        const themeButtons = document.querySelectorAll('#n-th span');
        themeButtons.forEach(button => {
            button.addEventListener('click', function () {
                AnimationEngine.animate({
                    elements: this,
                    properties: {
                        scale: 0.9,
                        opacity: 0.5
                    },
                    duration: 100,
                    easing: 'easeOutCubic',
                    onComplete: () => {
                        AnimationEngine.animate({
                            elements: this,
                            properties: {
                                scale: 1,
                                opacity: 1
                            },
                            duration: 300,
                            easing: 'easeOutBounce'
                        });
                    }
                });
            });
        });
    }

    // 3. Handle Loading Screen Elegantly
    function handleLoadingElegantly() {
        const loadingContainer = document.getElementById('lo');
        const loadingBg = document.getElementById('lo-bg');
        const loadingBar = document.getElementById('lo-pr');

        if (loadingBar) {
            console.log("⏳ Enhanced loading animation");
            AnimationEngine.animate({
                elements: loadingBar,
                properties: {
                    x: 0
                },
                duration: 2000,
                easing: 'easeOutExpo'
            });
        }

        if (loadingBg && loadingContainer) {
            console.log("🔄 Enhanced loading screen fade out");
            setTimeout(() => {
                AnimationEngine.animate({
                    elements: loadingBg,
                    properties: {
                        opacity: 0,
                        scale: 1.05
                    },
                    duration: 1200,
                    easing: 'easeOutExpo'
                });
                setTimeout(() => {
                    loadingContainer.style.display = 'none';
                }, 1200);
            }, 2500);
        }
    }

    // 4. Fade-Up Scroll Reveals
    function setupFadeUpScrolls() {
        console.log("📜 Setting up fade-up scroll animations...");

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    if (!element.classList.contains('fade-up-revealed')) {
                        element.classList.add('fade-up-revealed');

                        // Fade up animation
                        AnimationEngine.animate({
                            elements: element,
                            properties: {
                                opacity: 1,
                                y: 0
                            },
                            duration: 1000,
                            easing: 'easeOutCubic'
                        });
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Elements to fade up on scroll
        const scrollElements = [
            '#ho-se', '#ho-se-co0', '.y_', '#f'
        ];

        scrollElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Set initial state for fade up
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                observer.observe(element);
            });
        });
    }

    console.log("🎭 Enhanced animations ready");
});