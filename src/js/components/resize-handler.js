// resize-handler.js
console.log("Resize handler script loading...");

const ResizeHandler = {
    init() {
        console.log("Resize handler initializing...");

        // Resize tracking
        this.callbacks = [];
        this.isResizing = false;
        this.resizeTimeout = null;
        this.debounceDelay = 150; // ms

        // Current dimensions
        this.current = {
            width: window.innerWidth,
            height: window.innerHeight,
            aspectRatio: window.innerWidth / window.innerHeight
        };

        // Previous dimensions for comparison
        this.previous = {
            ...this.current
        };

        // Device detection
        this.device = {
            isMobile: this.detectMobile(),
            isTablet: this.detectTablet(),
            isDesktop: this.detectDesktop()
        };

        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.handleOrientationChange = this.handleOrientationChange.bind(this);
        this.processResize = this.processResize.bind(this);

        // Attach events
        this.attachEvents();

        // Initial resize to set up components
        this.processResize();

        console.log("Resize handler initialized successfully!");
        console.log("Initial dimensions:", this.current);
        console.log("Device type:", this.getDeviceType());
    },

    attachEvents() {
        // Use appropriate event for device type
        const eventType = this.device.isMobile ? 'orientationchange' : 'resize';

        window.addEventListener('resize', this.handleResize, {
            passive: true
        });

        if (this.device.isMobile) {
            window.addEventListener('orientationchange', this.handleOrientationChange, {
                passive: true
            });
        }

        console.log("Resize event listeners attached for:", eventType);
    },

    handleResize() {
        this.isResizing = true;

        // Clear existing timeout
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        // Debounce resize events
        this.resizeTimeout = setTimeout(() => {
            this.processResize();
            this.isResizing = false;
        }, this.debounceDelay);
    },

    handleOrientationChange() {
        // Mobile orientation change needs longer delay
        setTimeout(() => {
            this.processResize();
        }, 300);
    },

    processResize() {
        // Store previous dimensions
        this.previous = {
            ...this.current
        };

        // Update current dimensions
        this.current = {
            width: window.innerWidth,
            height: window.innerHeight,
            aspectRatio: window.innerWidth / window.innerHeight
        };

        // Update device detection
        this.device = {
            isMobile: this.detectMobile(),
            isTablet: this.detectTablet(),
            isDesktop: this.detectDesktop()
        };

        // Calculate changes
        const changes = {
            width: this.current.width - this.previous.width,
            height: this.current.height - this.previous.height,
            aspectRatio: this.current.aspectRatio - this.previous.aspectRatio
        };

        // Create resize data
        const resizeData = {
            current: this.current,
            previous: this.previous,
            changes,
            device: this.device,
            orientation: this.getOrientation(),
            breakpoint: this.getBreakpoint(),
            timestamp: performance.now()
        };

        console.log("Resize processed:", {
            dimensions: `${this.current.width}x${this.current.height}`,
            device: this.getDeviceType(),
            orientation: this.getOrientation()
        });

        // Notify all callbacks
        this.notifyCallbacks(resizeData);
    },

    // Device detection methods
    detectMobile() {
        return window.innerWidth <= 768 ||
            /mobi|android|tablet|ipad|iphone/.test(navigator.userAgent.toLowerCase()) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    },

    detectTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },

    detectDesktop() {
        return window.innerWidth > 1024;
    },

    getDeviceType() {
        if (this.device.isMobile) return 'mobile';
        if (this.device.isTablet) return 'tablet';
        return 'desktop';
    },

    getOrientation() {
        return this.current.aspectRatio > 1 ? 'landscape' : 'portrait';
    },

    getBreakpoint() {
        const width = this.current.width;
        if (width <= 480) return 'xs';
        if (width <= 768) return 'sm';
        if (width <= 1024) return 'md';
        if (width <= 1440) return 'lg';
        return 'xl';
    },

    // Callback management
    onResize(callback, options = {}) {
        const callbackData = {
            id: Date.now() + Math.random(),
            callback,
            immediate: options.immediate || false,
            debounce: options.debounce || 0
        };

        this.callbacks.push(callbackData);

        // Call immediately if requested
        if (options.immediate) {
            callback({
                current: this.current,
                previous: this.current,
                changes: {
                    width: 0,
                    height: 0,
                    aspectRatio: 0
                },
                device: this.device,
                orientation: this.getOrientation(),
                breakpoint: this.getBreakpoint(),
                timestamp: performance.now()
            });
        }

        console.log("Added resize callback, total callbacks:", this.callbacks.length);

        return callbackData.id;
    },

    offResize(callbackId) {
        const index = this.callbacks.findIndex(cb => cb.id === callbackId);
        if (index !== -1) {
            this.callbacks.splice(index, 1);
            console.log("Removed resize callback, remaining:", this.callbacks.length);
            return true;
        }
        return false;
    },

    notifyCallbacks(resizeData) {
        this.callbacks.forEach((cbData, index) => {
            try {
                if (cbData.debounce > 0) {
                    // Debounced callback
                    if (cbData.debounceTimeout) {
                        clearTimeout(cbData.debounceTimeout);
                    }
                    cbData.debounceTimeout = setTimeout(() => {
                        cbData.callback(resizeData);
                    }, cbData.debounce);
                } else {
                    // Immediate callback
                    cbData.callback(resizeData);
                }
            } catch (error) {
                console.error(`Error in resize callback ${index}:`, error);
            }
        });
    },

    // Utility methods
    getCurrentDimensions() {
        return {
            ...this.current
        };
    },

    isCurrentlyResizing() {
        return this.isResizing;
    },

    // Responsive utilities
    matchesBreakpoint(breakpoint) {
        return this.getBreakpoint() === breakpoint;
    },

    isMinWidth(width) {
        return this.current.width >= width;
    },

    isMaxWidth(width) {
        return this.current.width <= width;
    },

    isMinHeight(height) {
        return this.current.height >= height;
    },

    isMaxHeight(height) {
        return this.current.height <= height;
    },

    // Integration with existing components
    updateExistingComponents(resizeData) {
        // Update ViewportManager if it exists
        if (window.ViewportManager) {
            ViewportManager.updateViewport();
        }

        // Update smooth scroll limits if it exists
        if (window.smoothScroll) {
            smoothScroll.updateLimits();
        }

        // Update mouse tracking viewport if it exists
        if (window.MouseTracker) {
            MouseTracker.updateViewport();
        }

        console.log("Updated existing components after resize");
    }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing resize handler...");
    ResizeHandler.init();

    // Auto-integration with existing components
    ResizeHandler.onResize((data) => {
        ResizeHandler.updateExistingComponents(data);
    });
});

// Make it globally available
window.ResizeHandler = ResizeHandler;

console.log("Resize handler script loaded");