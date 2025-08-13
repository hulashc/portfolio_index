// text-animation.js
console.log("Text animation script loading...");

const TextAnimation = {
    init() {
        console.log("Text animation initializing...");

        // Store all text animation instances
        this.instances = [];
        this.instanceId = 0;

        console.log("Text animation initialized successfully!");
    },

    // Create a text animation instance
    create(options) {
        const {
            element: elementSelector,
            splitBy = 'lines', // 'lines', 'words', 'chars'
            animation = 'slideUp',
            duration = 800,
            delay = 0,
            stagger = 100,
            easing = 'easeOutCubic'
        } = options;

        console.log("Creating text animation for:", elementSelector);

        const elements = this.getElements(elementSelector);
        if (elements.length === 0) {
            console.warn("No elements found for text animation:", elementSelector);
            return null;
        }

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

        this.instances.push(instance);
        console.log("Text animation instance created:", instance.id);

        return {
            id: instance.id,
            play: () => this.play(instance.id),
            reset: () => this.reset(instance.id),
            destroy: () => this.destroy(instance.id)
        };
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

    // Split text into animatable parts
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

        // Create wrapper elements for animation
        const wrappedParts = parts.map((part, index) => {
            const wrapper = document.createElement('span');
            wrapper.className = `text-anim-part text-anim-${splitBy}`;
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';

            const inner = document.createElement('span');
            inner.className = 'text-anim-inner';
            inner.style.display = 'inline-block';
            inner.textContent = part;

            // Set initial animation state
            this.setInitialState(inner, 'slideUp');

            wrapper.appendChild(inner);
            return {
                wrapper,
                inner,
                text: part,
                index
            };
        });

        // Replace element content with wrapped parts
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
    },

    // Split text into lines by measuring width
    splitIntoLines(element) {
        const originalText = element.textContent;
        const words = originalText.split(' ');
        const lines = [];

        // Create temporary element to measure text width
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

            // Add last line
            if (index === words.length - 1) {
                lines.push(currentLine);
            }
        });

        document.body.removeChild(temp);
        return lines.length > 0 ? lines : [originalText];
    },

    // Split text into words
    splitIntoWords(text) {
        return text.split(' ').filter(word => word.length > 0);
    },

    // Split text into characters
    splitIntoChars(text) {
        return text.split('');
    },

    // Set initial animation state
    setInitialState(element, animation) {
        switch (animation) {
            case 'slideUp':
                element.style.transform = 'translateY(100%)';
                element.style.opacity = '1';
                break;
            case 'slideDown':
                element.style.transform = 'translateY(-100%)';
                element.style.opacity = '1';
                break;
            case 'slideLeft':
                element.style.transform = 'translateX(100%)';
                element.style.opacity = '1';
                break;
            case 'slideRight':
                element.style.transform = 'translateX(-100%)';
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
    },

    // Animate to final state
    animateToFinal(element, animation, duration, easing, delay = 0) {
        setTimeout(() => {
            element.style.transition = `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

            switch (animation) {
                case 'slideUp':
                case 'slideDown':
                case 'slideLeft':
                case 'slideRight':
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
    },

    // Play animation for instance
    play(instanceId) {
        const instance = this.instances.find(inst => inst.id === instanceId);
        if (!instance) {
            console.warn("Text animation instance not found:", instanceId);
            return;
        }

        console.log("Playing text animation:", instanceId);

        instance.splitElements.forEach((splitData, elementIndex) => {
            splitData.parts.forEach((part, partIndex) => {
                const delay = instance.delay + (partIndex * instance.stagger);
                this.animateToFinal(
                    part.inner,
                    instance.animation,
                    instance.duration,
                    instance.easing,
                    delay
                );
            });
        });

        instance.isAnimated = true;
    },

    // Reset animation
    reset(instanceId) {
        const instance = this.instances.find(inst => inst.id === instanceId);
        if (!instance) return;

        console.log("Resetting text animation:", instanceId);

        instance.splitElements.forEach(splitData => {
            splitData.parts.forEach(part => {
                part.inner.style.transition = 'none';
                this.setInitialState(part.inner, instance.animation);
            });
        });

        instance.isAnimated = false;
    },

    // Destroy animation instance
    destroy(instanceId) {
        const instanceIndex = this.instances.findIndex(inst => inst.id === instanceId);
        if (instanceIndex === -1) return;

        const instance = this.instances[instanceIndex];
        console.log("Destroying text animation:", instanceId);

        // Restore original text
        instance.splitElements.forEach(splitData => {
            splitData.element.textContent = splitData.originalText;
        });

        this.instances.splice(instanceIndex, 1);
    },

    // Convenience methods for common animations
    slideUp(selector, options = {}) {
        return this.create({
            element: selector,
            animation: 'slideUp',
            splitBy: 'lines',
            ...options
        });
    },

    fadeInWords(selector, options = {}) {
        return this.create({
            element: selector,
            animation: 'fadeIn',
            splitBy: 'words',
            stagger: 50,
            ...options
        });
    },

    typeWriter(selector, options = {}) {
        return this.create({
            element: selector,
            animation: 'fadeIn',
            splitBy: 'chars',
            stagger: 30,
            ...options
        });
    }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing text animation...");
    TextAnimation.init();
});

// Make it globally available
window.TextAnimation = TextAnimation;

console.log("Text animation script loaded");