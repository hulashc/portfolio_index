// viewport-manager.js
console.log("Viewport manager script loading...");

const ViewportManager = {
    init() {
        console.log("Viewport manager initializing...");

        // Device and viewport tracking
        this.viewport = {
            width: 0,
            height: 0
        };
        this.center = {
            x: 0,
            y: 0
        };
        this.ratios = {
            wh: 0,
            hw: 0
        };
        this.orientation = 'portrait';
        this.deviceType = 'desktop';

        // Configuration
        this.config = {
            dimensions: {
                desktop: [1920, 1080],
                mobile: [1080, 1920]
            },
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1440
            }
        };

        // Callbacks for other components
        this.callbacks = [];

        // Initialize
        this.detectDevice();
        this.updateViewport();
        this.attachEvents();

        console.log("Viewport manager initialized successfully!");
        console.log("Device type:", this.deviceType);
        console.log("Viewport:", this.viewport);
        console.log("Orientation:", this.orientation);
    },

    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMacIntel = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
        const isMobile = /mobi|android|tablet|ipad|iphone/.test(userAgent) || isMacIntel;
        const isFirefox = userAgent.indexOf("firefox") > -1;

        this.deviceInfo = {
            isMobile,
            isFirefox,
            isMacIntel,
            userAgent
        };

        console.log("Device detection:", this.deviceInfo);
    },

    updateViewport() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Update viewport dimensions
        this.viewport = {
            width,
            height
        };
        this.center = {
            x: width * 0.5,
            y: height * 0.5
        };
        this.ratios = {
            wh: width / height,
            hw: height / width
        };

        // Determine orientation
        this.orientation = this.ratios.wh > 1 ? 'landscape' : 'portrait';

        // Determine device type based on width
        if (width <= this.config.breakpoints.mobile) {
            this.deviceType = 'mobile';
        } else if (width <= this.config.breakpoints.tablet) {
            this.deviceType = 'tablet';
        } else {
            this.deviceType = 'desktop';
        }

        // Calculate responsive scaling
        const designDimensions = this.orientation === 'landscape' ?
            this.config.dimensions.desktop :
            this.config.dimensions.mobile;

        this.scaling = {
            width: width / designDimensions[0],
            height: height / designDimensions[1]
        };

        console.log("Viewport updated:", {
            dimensions: this.viewport,
            orientation: this.orientation,
            deviceType: this.deviceType,
            ratios: this.ratios
        });

        // Notify callbacks
        this.notifyCallbacks();
    },

    attachEvents() {
        const eventType = this.deviceInfo.isMobile ? "orientationchange" : "resize";
        let resizeTimeout;

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateViewport();
            }, 100); // Debounce resize events
        };

        window.addEventListener(eventType, handleResize);
        console.log("Attached", eventType, "event listener");
    },

    // Allow other components to subscribe to viewport changes
    onResize(callback) {
        this.callbacks.push(callback);
        console.log("Added resize callback, total callbacks:", this.callbacks.length);
    },

    notifyCallbacks() {
        this.callbacks.forEach((callback, index) => {
            try {
                callback(this.getViewportInfo());
            } catch (error) {
                console.error("Error in viewport callback", index, error);
            }
        });
    },

    // Get comprehensive viewport information
    getViewportInfo() {
        return {
            viewport: this.viewport,
            center: this.center,
            ratios: this.ratios,
            orientation: this.orientation,
            deviceType: this.deviceType,
            deviceInfo: this.deviceInfo,
            scaling: this.scaling
        };
    },

    // Utility methods for responsive design
    isMobile() {
        return this.deviceType === 'mobile';
    },

    isTablet() {
        return this.deviceType === 'tablet';
    },

    isDesktop() {
        return this.deviceType === 'desktop';
    },

    isLandscape() {
        return this.orientation === 'landscape';
    },

    isPortrait() {
        return this.orientation === 'portrait';
    },

    // Get viewport-relative units
    vw(value) {
        return (value / 100) * this.viewport.width;
    },

    vh(value) {
        return (value / 100) * this.viewport.height;
    }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing viewport manager...");
    ViewportManager.init();
});

// Make it globally available
window.ViewportManager = ViewportManager;

console.log("Viewport manager script loaded");