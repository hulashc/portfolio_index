// unified-animations.js - Complete unified animation system

(function () {
    'use strict';

    class UnifiedAnimations {
        constructor() {
            this.animations = new Map();
            this.observers = new Map();
            this.isInitialized = false;
            this.rafId = null;

            // Text animation properties
            this.textInstances = [];
            this.instanceId = 0;
        }

        // Initialize the unified system
        init() {
            if (this.isInitialized) return;
            this.isInitialized = true;
            this.setupInitialAnimations();
            console.log('Unified animations initialized');
        }

        // Utility: Get elements safely
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
        }

        // UNIFIED ANIMATE METHOD - Main entry point
        animate(options) {
            const {
                element: selector,
                type = 'element', // 'text' or 'element'
                animation = 'fadeIn',
                splitBy = null, // for text: 'lines', 'words', 'chars'
                duration = 800,
                delay = 0,
                stagger = 0,
                easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
                distance = 30,
                scale = 0.8,
                onComplete = null
            } = options;

            const elements = this.getElements(selector);
            if (elements.length === 0) {
                console.warn(`No elements found for selector: ${selector}`);
                return null;
            }

            // Route to appropriate animation system
            if (type === 'text' || splitBy) {
                return this.handleTextAnimation({
                    element: selector,
                    splitBy: splitBy || 'lines',
                    animation,
                    duration,
                    delay,
                    stagger,
                    easing
                });
            } else {
                return this.handleElementAnimation(elements, {
                    animation,
                    duration,
                    delay,
                    stagger,
                    easing,
                    distance,
                    scale,
                    onComplete
                });
            }
        }

        // Handle text animations (from your text-animation.js)
        handleTextAnimation(options) {
            const {
                element: elementSelector,
                splitBy = 'lines',
                animation = 'slideUp',
                duration = 800,
                delay = 0,
                stagger = 100,
                easing = 'easeOutCubic'
            } = options;

            const elements = this.getElements(elementSelector);
            if (elements.length === 0) return null;

            const instance = {
                id: ++this.instanceId,
                elements,
                splitBy,
                animation,
                duration,
                delay,
                stagger,
                easing,
                splitElements: [],
                isAnimated: false
            };

            // Process each element
            elements.forEach((element, index) => {
                const splitData = this.splitText(element, splitBy);
                instance.splitElements[index] = splitData;
            });

            this.textInstances.push(instance);

            return {
                id: instance.id,
                play: () => this.playTextAnimation(instance.id),
                reset: () => this.resetTextAnimation(instance.id),
                destroy: () => this.destroyTextAnimation(instance.id)
            };
        }

        // Handle element animations (from your animation-engine.js)
        handleElementAnimation(elements, options) {
            const {
                animation = 'fadeIn',
                    duration = 800,
                    delay = 0,
                    stagger = 0,
                    easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
                    distance = 30,
                    scale = 0.8,
                    onComplete = null
            } = options;

            elements.forEach((element, index) => {
                const elementDelay = delay + (index * stagger);

                switch (animation) {
                    case 'fadeIn':
                        this.fadeInElement(element, {
                            duration,
                            delay: elementDelay,
                            easing,
                            onComplete
                        });
                        break;
                    case 'fadeUp':
                        this.fadeUpElement(element, {
                            duration,
                            delay: elementDelay,
                            easing,
                            distance,
                            onComplete
                        });
                        break;
                    case 'scaleIn':
                        this.scaleInElement(element, {
                            duration,
                            delay: elementDelay,
                            easing,
                            scale,
                            onComplete
                        });
                        break;
                    case 'netflixTitle':
                        this.netflixTitleElement(element, {
                            duration,
                            delay: elementDelay,
                            onComplete
                        });
                        break;
                    default:
                        this.fadeInElement(element, {
                            duration,
                            delay: elementDelay,
                            easing,
                            onComplete
                        });
                }
            });

            return {
                play: () => this.handleElementAnimation(elements, options)
            };
        }

        // Element animation methods
        fadeInElement(element, options = {}) {
            const {
                duration = 800, delay = 0, easing = 'cubic-bezier(0.4, 0, 0.2, 1)', onComplete = null
            } = options;

            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ${easing}`;

            setTimeout(() => {
                element.style.opacity = '1';
                if (onComplete) setTimeout(onComplete, duration);
            }, delay);
        }

        fadeUpElement(element, options = {}) {
            const {
                duration = 800, delay = 0, easing = 'cubic-bezier(0.4, 0, 0.2, 1)', distance = 30, onComplete = null
            } = options;

            element.style.opacity = '0';
            element.style.transform = `translateY(${distance}px)`;
            element.style.transition = `all ${duration}ms ${easing}`;

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0px)';
                if (onComplete) setTimeout(onComplete, duration);
            }, delay);
        }

        scaleInElement(element, options = {}) {
            const {
                duration = 600, delay = 0, easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)', scale = 0.8, onComplete = null
            } = options;

            element.style.opacity = '0';
            element.style.transform = `scale(${scale})`;
            element.style.transition = `all ${duration}ms ${easing}`;

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                if (onComplete) setTimeout(onComplete, duration);
            }, delay);
        }

        netflixTitleElement(element, options = {}) {
            const {
                duration = 1200, delay = 0, onComplete = null
            } = options;

            element.style.opacity = '0';
            element.style.transform = 'scale(0.80)';
            element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                if (onComplete) setTimeout(onComplete, duration);
            }, delay);
        }

        // Text animation methods (from your text-animation.js)
        splitText(element, splitBy) {
            const originalText = element.textContent;
            let parts = [];

            if (splitBy === 'lines') {
                parts = this.splitIntoLines(element);
            } else if (splitBy === 'words') {
                parts = this.splitIntoWords(originalText);
            } else if (splitBy === 'chars') {
                parts = this.splitIntoChars(originalText);
            }

            const wrappedParts = parts.map((part, index) => {
                const wrapper = document.createElement('span');
                wrapper.className = `text-anim-part text-anim-${splitBy}`;
                wrapper.style.display = 'inline-block';
                wrapper.style.overflow = 'hidden';

                const inner = document.createElement('span');
                inner.className = 'text-anim-inner';
                inner.style.display = 'inline-block';
                inner.textContent = part;

                this.setInitialTextState(inner, 'slideUp');
                wrapper.appendChild(inner);

                return {
                    wrapper,
                    inner,
                    text: part,
                    index
                };
            });

            element.innerHTML = '';
            wrappedParts.forEach((part, index) => {
                element.appendChild(part.wrapper);
                if ((splitBy === 'words' || splitBy === 'chars') && index < wrappedParts.length - 1) {
                    element.appendChild(document.createTextNode(' '));
                }
            });

            return {
                originalText,
                parts: wrappedParts,
                element
            };
        }

        splitIntoLines(element) {
            const originalText = element.textContent;
            const words = originalText.split(' ');
            const lines = [];

            const temp = document.createElement('div');
            temp.style.visibility = 'hidden';
            temp.style.position = 'absolute';
            temp.style.whiteSpace = 'nowrap';
            temp.style.font = window.getComputedStyle(element).font;
            document.body.appendChild(temp);

            const maxWidth = element.offsetWidth;
            let currentLine = '';

            words.forEach((word, index) => {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                temp.textContent = testLine;

                if (temp.offsetWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }

                if (index === words.length - 1) {
                    lines.push(currentLine);
                }
            });

            document.body.removeChild(temp);
            return lines.length > 0 ? lines : [originalText];
        }

        splitIntoWords(text) {
            return text.split(' ').filter(word => word.length > 0);
        }

        splitIntoChars(text) {
            return text.split('');
        }

        setInitialTextState(element, animation) {
            switch (animation) {
                case 'slideUp':
                    element.style.transform = 'translateY(100%)';
                    element.style.opacity = '1';
                    break;
                case 'slideDown':
                    element.style.transform = 'translateY(-100%)';
                    element.style.opacity = '1';
                    break;
                case 'fadeIn':
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(20px)';
                    break;
                case 'scaleIn':
                    element.style.transform = 'scale(0)';
                    element.style.opacity = '1';
                    break;
            }
        }

        playTextAnimation(instanceId) {
            const instance = this.textInstances.find(inst => inst.id === instanceId);
            if (!instance) return;

            instance.splitElements.forEach((splitData, elementIndex) => {
                splitData.parts.forEach((part, partIndex) => {
                    const delay = instance.delay + (partIndex * instance.stagger);
                    this.animateTextToFinal(part.inner, instance.animation, instance.duration, instance.easing, delay);
                });
            });

            instance.isAnimated = true;
        }

        animateTextToFinal(element, animation, duration, easing, delay = 0) {
            setTimeout(() => {
                element.style.transition = `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

                switch (animation) {
                    case 'slideUp':
                    case 'slideDown':
                        element.style.transform = 'translate(0, 0)';
                        element.style.opacity = '1';
                        break;
                    case 'fadeIn':
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                        break;
                    case 'scaleIn':
                        element.style.transform = 'scale(1)';
                        element.style.opacity = '1';
                        break;
                }
            }, delay);
        }

        resetTextAnimation(instanceId) {
            const instance = this.textInstances.find(inst => inst.id === instanceId);
            if (!instance) return;

            instance.splitElements.forEach(splitData => {
                splitData.parts.forEach(part => {
                    part.inner.style.transition = 'none';
                    this.setInitialTextState(part.inner, instance.animation);
                });
            });

            instance.isAnimated = false;
        }

        destroyTextAnimation(instanceId) {
            const instanceIndex = this.textInstances.findIndex(inst => inst.id === instanceId);
            if (instanceIndex === -1) return;

            const instance = this.textInstances[instanceIndex];
            instance.splitElements.forEach(splitData => {
                splitData.element.textContent = splitData.originalText;
            });

            this.textInstances.splice(instanceIndex, 1);
        }

        // Setup initial animations
        setupInitialAnimations() {
            document.fonts.ready.then(() => {
                // Hero title - Netflix style
                const heroSelectors = ['h1', '.hero-title', '[class*="title"]', 'header h1, header h2', '.main-title'];
                for (const selector of heroSelectors) {
                    const heroElement = document.querySelector(selector);
                    if (heroElement) {
                        this.animate({
                            element: selector,
                            type: 'element',
                            animation: 'netflixTitle',
                            delay: 300
                        });
                        break;
                    }
                }
            });
        }

        // Convenience methods
        slideUp(selector, options = {}) {
            return this.animate({
                element: selector,
                type: 'text',
                animation: 'slideUp',
                splitBy: 'lines',
                ...options
            });
        }

        fadeInWords(selector, options = {}) {
            return this.animate({
                element: selector,
                type: 'text',
                animation: 'fadeIn',
                splitBy: 'words',
                stagger: 50,
                ...options
            });
        }

        typeWriter(selector, options = {}) {
            return this.animate({
                element: selector,
                type: 'text',
                animation: 'fadeIn',
                splitBy: 'chars',
                stagger: 30,
                ...options
            });
        }

        fadeInElements(selector, options = {}) {
            return this.animate({
                element: selector,
                type: 'element',
                animation: 'fadeIn',
                ...options
            });
        }

        fadeUpElements(selector, options = {}) {
            return this.animate({
                element: selector,
                type: 'element',
                animation: 'fadeUp',
                ...options
            });
        }

        scaleInElements(selector, options = {}) {
            return this.animate({
                element: selector,
                type: 'element',
                animation: 'scaleIn',
                ...options
            });
        }

        // Cleanup
        destroy() {
            this.observers.forEach(observer => observer.disconnect());
            this.observers.clear();
            this.animations.clear();
            this.textInstances = [];
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
        }
    }

    // Initialize when DOM is ready
    function initializeUnifiedAnimations() {
        const animations = new UnifiedAnimations();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => animations.init(), 100);
            });
        } else {
            setTimeout(() => animations.init(), 100);
        }

        // Make available globally
        window.UnifiedAnimations = animations;
        return animations;
    }

    // Start the unified system
    const unifiedAnimations = initializeUnifiedAnimations();

    // Add CSS for performance
    const style = document.createElement('style');
    style.textContent = `
  .text-anim-part {
    backface-visibility: hidden;
    perspective: 1000px;
    will-change: transform, opacity;
  }
  .animated {
    will-change: transform, opacity;
  }
`;
    document.head.appendChild(style);

    console.log('Unified animations system loaded');

})();