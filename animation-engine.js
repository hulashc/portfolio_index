// animation-engine.js
console.log("Animation engine script loading...");

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
        }
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
        console.log("Creating animation with options:", options);

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
            console.warn("No elements found for selector:", elementSelector);
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
                console.log("Animation completed:", id);
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
        console.log("Animation stopped:", id);
    },

    // Convenience methods
    fadeIn(elements, duration = 1000, easing = 'easeOutCubic') {
        return this.animate({
            elements,
            properties: {
                opacity: 1
            },
            duration,
            easing
        });
    },

    fadeOut(elements, duration = 1000, easing = 'easeOutCubic') {
        return this.animate({
            elements,
            properties: {
                opacity: 0
            },
            duration,
            easing
        });
    },

    slideUp(elements, distance = 100, duration = 1000, easing = 'easeOutCubic') {
        return this.animate({
            elements,
            properties: {
                y: -distance
            },
            duration,
            easing
        });
    },

    slideDown(elements, distance = 100, duration = 1000, easing = 'easeOutCubic') {
        return this.animate({
            elements,
            properties: {
                y: distance
            },
            duration,
            easing
        });
    },

    scaleIn(elements, fromScale = 0, toScale = 1, duration = 1000, easing = 'easeOutElastic') {
        // Set initial scale
        this.getElements(elements).forEach(el => {
            el.style.transform = `scale(${fromScale})`;
        });

        return this.animate({
            elements,
            properties: {
                scale: toScale
            },
            duration,
            easing
        });
    }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("Animation engine initialized!");
});

// Make it globally available
window.AnimationEngine = AnimationEngine;

console.log("Animation engine script loaded");