// mouse-tracking.js
console.log("Mouse tracking script loading...");

const MouseTracker = {
    init() {
        console.log("Mouse tracking initializing...");

        // Mouse position storage
        this.mouse = {
            x: 0,
            y: 0
        };
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.center = {
            x: this.viewport.width * 0.5,
            y: this.viewport.height * 0.5
        };

        // Callbacks for other components
        this.callbacks = [];

        // Performance optimization
        this.isActive = false;
        this.updateThrottle = 16; // ~60fps
        this.lastUpdate = 0;

        // Bind methods
        this.handleMove = this.handleMove.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
        this.updateViewport = this.updateViewport.bind(this);

        // Attach event listeners
        this.attachEvents();

        console.log("Mouse tracking initialized successfully!");
    },

    attachEvents() {
        // Mouse and touch move events
        document.addEventListener("mousemove", this.handleMove, {
            passive: true
        });
        document.addEventListener("touchmove", this.handleMove, {
            passive: true
        });

        // Mouse enter/leave for performance optimization
        document.addEventListener("mouseenter", this.handleEnter);
        document.addEventListener("mouseleave", this.handleLeave);

        // Window resize handling
        window.addEventListener("resize", this.updateViewport);
    },

    handleMove(e) {
        const now = performance.now();

        // Throttle updates for performance
        if (now - this.lastUpdate < this.updateThrottle) return;
        this.lastUpdate = now;

        // Get coordinates from mouse or touch
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Update mouse position
        this.mouse.x = clientX;
        this.mouse.y = clientY;

        // Calculate relative positions (0 to 1)
        this.mouseNormalized = {
            x: clientX / this.viewport.width,
            y: clientY / this.viewport.height
        };

        // Calculate center-relative positions (-0.5 to 0.5)
        this.mouseCentered = {
            x: this.mouseNormalized.x - 0.5,
            y: this.mouseNormalized.y - 0.5
        };

        // Calculate distance from center
        this.distanceFromCenter = Math.sqrt(
            this.mouseCentered.x * this.mouseCentered.x +
            this.mouseCentered.y * this.mouseCentered.y
        );

        // Notify callbacks
        this.notifyCallbacks();
    },

    handleEnter() {
        this.isActive = true;
        console.log("Mouse tracking activated");
    },

    handleLeave() {
        this.isActive = false;
        console.log("Mouse tracking deactivated");
    },

    updateViewport() {
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.center = {
            x: this.viewport.width * 0.5,
            y: this.viewport.height * 0.5
        };
        console.log("Viewport updated:", this.viewport);
    },

    // Allow other components to subscribe to mouse movement
    onMove(callback) {
        this.callbacks.push(callback);
        console.log("Added mouse tracking callback, total callbacks:", this.callbacks.length);
    },

    notifyCallbacks() {
        if (!this.isActive || this.callbacks.length === 0) return;

        const data = {
            mouse: this.mouse,
            mouseNormalized: this.mouseNormalized,
            mouseCentered: this.mouseCentered,
            distanceFromCenter: this.distanceFromCenter,
            viewport: this.viewport,
            center: this.center
        };

        this.callbacks.forEach((callback, index) => {
            try {
                callback(data);
            } catch (error) {
                console.error("Error in mouse tracking callback", index, error);
            }
        });
    },

    // Utility methods
    getCurrentPosition() {
        return {
            mouse: this.mouse,
            mouseNormalized: this.mouseNormalized,
            mouseCentered: this.mouseCentered,
            distanceFromCenter: this.distanceFromCenter
        };
    },

    // Create hover effects for elements
    createHoverEffect(elements, options = {}) {
        const {
            scale = 1.05,
                duration = 300,
                easing = 'cubic-bezier(0.16, 1, 0.3, 1)'
        } = options;

        const elementList = this.getElements(elements);

        elementList.forEach(element => {
            if (!element) return;

            element.style.transition = `transform ${duration}ms ${easing}`;

            element.addEventListener('mouseenter', () => {
                element.style.transform = `scale(${scale})`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
            });
        });

        console.log("Hover effects created for", elementList.length, "elements");
    },

    // Create cursor following effect
    createFollowEffect(element, options = {}) {
        const el = this.getElements(element)[0];
        if (!el) return;

        const {
            strength = 0.1,
                maxDistance = 100,
                smooth = true
        } = options;

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const updatePosition = () => {
            if (smooth) {
                currentX += (targetX - currentX) * 0.1;
                currentY += (targetY - currentY) * 0.1;
            } else {
                currentX = targetX;
                currentY = targetY;
            }

            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

            if (smooth && (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1)) {
                requestAnimationFrame(updatePosition);
            }
        };

        this.onMove(data => {
            const deltaX = data.mouseCentered.x * maxDistance * strength;
            const deltaY = data.mouseCentered.y * maxDistance * strength;

            targetX = deltaX;
            targetY = deltaY;

            if (smooth) {
                requestAnimationFrame(updatePosition);
            } else {
                updatePosition();
            }
        });

        console.log("Follow effect created for element");
    },

    // Helper to get elements from selector
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
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing mouse tracking...");
    MouseTracker.init();
});

// Make it globally available
window.MouseTracker = MouseTracker;

console.log("Mouse tracking script loaded");