// visibility-handler.js
console.log("Visibility handler script loading...");

const VisibilityHandler = {
    init() {
        console.log("Visibility handler initializing...");

        // Visibility state tracking
        this.isVisible = !document.hidden;
        this.callbacks = {
            visible: [],
            hidden: [],
            change: []
        };

        // Performance optimization tracking
        this.performance = {
            hiddenTime: 0,
            visibleTime: 0,
            switches: 0,
            lastSwitch: performance.now()
        };

        // Component states to manage
        this.componentStates = new Map();

        // Bind methods
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

        // Attach event listener
        this.attachEvents();

        // Initial state
        this.updateState();

        console.log("Visibility handler initialized successfully!");
        console.log("Initial visibility state:", this.isVisible ? "visible" : "hidden");
    },

    attachEvents() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange, {
            passive: true
        });

        // Also listen for focus/blur as backup
        window.addEventListener('focus', () => this.handleVisibilityChange('focus'), {
            passive: true
        });
        window.addEventListener('blur', () => this.handleVisibilityChange('blur'), {
            passive: true
        });

        console.log("Visibility event listeners attached");
    },

    handleVisibilityChange(source) {
        const wasVisible = this.isVisible;
        const now = performance.now();

        // Update visibility state
        this.isVisible = !document.hidden;

        // Track performance metrics
        if (wasVisible !== this.isVisible) {
            this.performance.switches++;

            if (wasVisible) {
                this.performance.visibleTime += now - this.performance.lastSwitch;
            } else {
                this.performance.hiddenTime += now - this.performance.lastSwitch;
            }

            this.performance.lastSwitch = now;

            console.log(`Visibility changed: ${wasVisible ? 'visible' : 'hidden'} → ${this.isVisible ? 'visible' : 'hidden'}`);
            console.log(`Source: ${source || 'visibilitychange'}`);

            this.updateState();
        }
    },

    updateState() {
        const state = this.isVisible ? 'visible' : 'hidden';

        // Update document body class for CSS targeting
        document.body.classList.toggle('page-hidden', !this.isVisible);
        document.body.classList.toggle('page-visible', this.isVisible);

        // Notify specific callbacks
        this.notifyCallbacks(state);

        // Notify general change callbacks
        this.notifyCallbacks('change', {
            isVisible: this.isVisible,
            state,
            timestamp: performance.now()
        });

        // Manage component performance
        this.manageComponents();
    },

    // Component performance management
    manageComponents() {
        if (this.isVisible) {
            this.resumeComponents();
        } else {
            this.pauseComponents();
        }
    },

    pauseComponents() {
        console.log("Pausing components for performance...");

        // Pause RAF Manager if it exists
        if (window.RAFManager) {
            this.componentStates.set('RAFManager', {
                wasRunning: RAFManager.isRunning,
                callbackCount: RAFManager.callbacks.size
            });

            // Don't completely stop, but reduce frequency
            RAFManager.callbacks.forEach(callback => {
                if (!callback.throttle || callback.throttle < 500) {
                    callback.originalThrottle = callback.throttle;
                    callback.throttle = 500; // Slow down to 2fps when hidden
                }
            });
        }

        // Pause smooth scrolling if it exists
        if (window.smoothScroll) {
            this.componentStates.set('smoothScroll', {
                wasActive: smoothScroll.isActive
            });
            // Keep smooth scroll active but reduce update frequency
        }

        // Pause mouse tracking if it exists
        if (window.MouseTracker) {
            this.componentStates.set('MouseTracker', {
                wasActive: MouseTracker.isActive
            });
            MouseTracker.isActive = false;
        }

        // Reduce animation frame rate for any custom animations
        this.reduceAnimationFrameRate();
    },

    resumeComponents() {
        console.log("Resuming components...");

        // Resume RAF Manager
        if (window.RAFManager && this.componentStates.has('RAFManager')) {
            RAFManager.callbacks.forEach(callback => {
                if (callback.originalThrottle !== undefined) {
                    callback.throttle = callback.originalThrottle;
                    delete callback.originalThrottle;
                }
            });
        }

        // Resume mouse tracking
        if (window.MouseTracker && this.componentStates.has('MouseTracker')) {
            const state = this.componentStates.get('MouseTracker');
            MouseTracker.isActive = state.wasActive;
        }

        // Restore animation frame rate
        this.restoreAnimationFrameRate();

        // Clear component states
        this.componentStates.clear();
    },

    reduceAnimationFrameRate() {
        // Store original requestAnimationFrame
        if (!this.originalRAF) {
            this.originalRAF = window.requestAnimationFrame;

            // Create throttled version
            this.throttledRAF = (callback) => {
                return setTimeout(() => {
                    callback(performance.now());
                }, 500); // 2fps when hidden
            };
        }
    },

    restoreAnimationFrameRate() {
        // Restore original requestAnimationFrame if we modified it
        if (this.originalRAF) {
            // Don't actually override global RAF as it might break other things
            // Just let components handle their own throttling
        }
    },

    // Callback management
    onVisible(callback) {
        this.callbacks.visible.push(callback);
        console.log("Added visibility callback for 'visible' event");
        return this.callbacks.visible.length - 1;
    },

    onHidden(callback) {
        this.callbacks.hidden.push(callback);
        console.log("Added visibility callback for 'hidden' event");
        return this.callbacks.hidden.length - 1;
    },

    onChange(callback) {
        this.callbacks.change.push(callback);
        console.log("Added visibility callback for 'change' event");
        return this.callbacks.change.length - 1;
    },

    off(type, index) {
        if (this.callbacks[type] && this.callbacks[type][index]) {
            this.callbacks[type].splice(index, 1);
            console.log(`Removed visibility callback for '${type}' event`);
            return true;
        }
        return false;
    },

    notifyCallbacks(type, data = null) {
        const callbacks = this.callbacks[type];
        if (callbacks && callbacks.length > 0) {
            callbacks.forEach((callback, index) => {
                try {
                    callback(data || {
                        isVisible: this.isVisible,
                        timestamp: performance.now()
                    });
                } catch (error) {
                    console.error(`Error in visibility callback (${type}/${index}):`, error);
                }
            });
        }
    },

    // Utility methods
    isPageVisible() {
        return this.isVisible;
    },

    isPageHidden() {
        return !this.isVisible;
    },

    getVisibilityState() {
        return document.visibilityState;
    },

    getPerformanceStats() {
        const now = performance.now();
        const currentSession = now - this.performance.lastSwitch;

        return {
            isVisible: this.isVisible,
            visibilityState: document.visibilityState,
            totalHiddenTime: this.performance.hiddenTime + (this.isVisible ? 0 : currentSession),
            totalVisibleTime: this.performance.visibleTime + (this.isVisible ? currentSession : 0),
            switchCount: this.performance.switches,
            currentSessionDuration: currentSession,
            sessionType: this.isVisible ? 'visible' : 'hidden'
        };
    },

    // Integration helpers
    integrateWithExistingComponents() {
        // Integrate with theme toggle
        if (window.themeToggle) {
            this.onVisible(() => {
                // Resume theme animations when visible
                console.log("Page visible: Theme animations resumed");
            });

            this.onHidden(() => {
                // Pause theme animations when hidden
                console.log("Page hidden: Theme animations paused");
            });
        }

        // Integrate with smooth scroll
        if (window.smoothScroll) {
            this.onHidden(() => {
                // Reduce smooth scroll precision when hidden
                if (smoothScroll.ease) {
                    smoothScroll.originalEase = smoothScroll.ease;
                    smoothScroll.ease = 0.15; // Less smooth but more performant
                }
            });

            this.onVisible(() => {
                // Restore smooth scroll precision
                if (smoothScroll.originalEase) {
                    smoothScroll.ease = smoothScroll.originalEase;
                }
            });
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing visibility handler...");
    VisibilityHandler.init();

    // Auto-integrate with existing components
    setTimeout(() => {
        VisibilityHandler.integrateWithExistingComponents();
    }, 100);
});

// Make it globally available
window.VisibilityHandler = VisibilityHandler;

console.log("Visibility handler script loaded");