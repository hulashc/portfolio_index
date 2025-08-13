// raf-manager.js
console.log("RAF manager script loading...");

const RAFManager = {
    init() {
        console.log("RAF manager initializing...");

        // Animation loop management
        this.callbacks = new Map();
        this.callbackId = 0;
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 0;
        this.frameCount = 0;

        // Performance monitoring
        this.performance = {
            targetFPS: 60,
            frameTime: 1000 / 60, // 16.67ms
            averageFPS: 0,
            worstFrameTime: 0,
            frameHistory: []
        };

        // Priority levels for callbacks
        this.priorities = {
            HIGH: 1, // Critical animations, UI updates
            NORMAL: 2, // Standard animations
            LOW: 3 // Background effects, non-critical updates
        };

        // Bind methods
        this.loop = this.loop.bind(this);

        console.log("RAF manager initialized successfully!");
    },

    // Add callback to animation loop
    add(callback, options = {}) {
        const {
            priority = this.priorities.NORMAL,
                enabled = true,
                throttle = 0,
                id = null
        } = options;

        const callbackData = {
            id: id || ++this.callbackId,
            callback,
            priority,
            enabled,
            throttle,
            lastCall: 0,
            frameCount: 0
        };

        this.callbacks.set(callbackData.id, callbackData);

        // Start loop if not running
        if (!this.isRunning) {
            this.start();
        }

        console.log(`Added RAF callback (ID: ${callbackData.id}, Priority: ${priority})`);
        console.log("Total callbacks:", this.callbacks.size);

        return callbackData.id;
    },

    // Remove callback from animation loop
    remove(id) {
        const removed = this.callbacks.delete(id);

        if (removed) {
            console.log(`Removed RAF callback (ID: ${id})`);
            console.log("Remaining callbacks:", this.callbacks.size);
        }

        // Stop loop if no callbacks remain
        if (this.callbacks.size === 0 && this.isRunning) {
            this.stop();
        }

        return removed;
    },

    // Enable/disable specific callback
    toggle(id, enabled) {
        const callbackData = this.callbacks.get(id);
        if (callbackData) {
            callbackData.enabled = enabled;
            console.log(`${enabled ? 'Enabled' : 'Disabled'} RAF callback (ID: ${id})`);
            return true;
        }
        return false;
    },

    // Start the animation loop
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            this.frameCount = 0;
            requestAnimationFrame(this.loop);
            console.log("RAF loop started");
        }
    },

    // Stop the animation loop
    stop() {
        this.isRunning = false;
        console.log("RAF loop stopped");
    },

    // Main animation loop
    loop(currentTime) {
        if (!this.isRunning) return;

        // Calculate delta time and FPS
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.frameCount++;

        // Update performance metrics
        this.updatePerformance(currentTime);

        // Execute callbacks by priority
        this.executeCallbacks(currentTime);

        // Continue loop
        requestAnimationFrame(this.loop);
    },

    // Execute callbacks in priority order
    executeCallbacks(currentTime) {
        // Group callbacks by priority
        const priorityGroups = {
            [this.priorities.HIGH]: [],
            [this.priorities.NORMAL]: [],
            [this.priorities.LOW]: []
        };

        this.callbacks.forEach(callbackData => {
            if (callbackData.enabled) {
                priorityGroups[callbackData.priority].push(callbackData);
            }
        });

        // Execute in priority order
        [this.priorities.HIGH, this.priorities.NORMAL, this.priorities.LOW].forEach(priority => {
            priorityGroups[priority].forEach(callbackData => {
                this.executeCallback(callbackData, currentTime);
            });
        });
    },

    // Execute individual callback with throttling
    executeCallback(callbackData, currentTime) {
        const {
            callback,
            throttle,
            lastCall,
            id
        } = callbackData;

        // Apply throttling if specified
        if (throttle > 0 && currentTime - lastCall < throttle) {
            return;
        }

        try {
            callback({
                time: currentTime,
                deltaTime: this.deltaTime,
                fps: this.fps,
                frameCount: this.frameCount
            });

            callbackData.lastCall = currentTime;
            callbackData.frameCount++;

        } catch (error) {
            console.error(`Error in RAF callback (ID: ${id}):`, error);
            // Optionally disable problematic callback
            // callbackData.enabled = false;
        }
    },

    // Update performance metrics
    updatePerformance(currentTime) {
        const {
            performance: perf
        } = this;

        // Calculate FPS (every 60 frames for accuracy)
        if (this.frameCount % 60 === 0) {
            perf.frameHistory.push(this.deltaTime);

            // Keep only last 60 frame times
            if (perf.frameHistory.length > 60) {
                perf.frameHistory.shift();
            }

            // Calculate average FPS
            const avgFrameTime = perf.frameHistory.reduce((a, b) => a + b, 0) / perf.frameHistory.length;
            perf.averageFPS = Math.round(1000 / avgFrameTime);
            this.fps = perf.averageFPS;

            // Track worst frame time
            const currentFrameTime = this.deltaTime;
            if (currentFrameTime > perf.worstFrameTime) {
                perf.worstFrameTime = currentFrameTime;
            }
        }
    },

    // Get performance statistics
    getPerformance() {
        return {
            ...this.performance,
            currentFPS: this.fps,
            currentFrameTime: this.deltaTime,
            totalCallbacks: this.callbacks.size,
            isRunning: this.isRunning,
            frameCount: this.frameCount
        };
    },

    // Utility methods for common patterns
    addHighPriority(callback, options = {}) {
        return this.add(callback, {
            ...options,
            priority: this.priorities.HIGH
        });
    },

    addLowPriority(callback, options = {}) {
        return this.add(callback, {
            ...options,
            priority: this.priorities.LOW
        });
    },

    addThrottled(callback, throttleMs, options = {}) {
        return this.add(callback, {
            ...options,
            throttle: throttleMs
        });
    },

    // Integration helpers for existing components
    integrateExistingComponents() {
        // Integrate with smooth scroll
        if (window.smoothScroll && window.smoothScroll.loop) {
            const smoothScrollId = this.add(window.smoothScroll.loop.bind(window.smoothScroll), {
                priority: this.priorities.HIGH,
                id: 'smooth-scroll'
            });
            console.log("Integrated smooth scroll with RAF manager");
        }

        // Integrate with mouse tracker
        if (window.MouseTracker && window.MouseTracker.update) {
            const mouseTrackerId = this.add(window.MouseTracker.update.bind(window.MouseTracker), {
                priority: this.priorities.NORMAL,
                throttle: 16, // ~60fps
                id: 'mouse-tracker'
            });
            console.log("Integrated mouse tracker with RAF manager");
        }

        // Add performance monitoring callback
        this.addLowPriority(() => {
            // Log performance warnings if needed
            if (this.fps < 45 && this.frameCount > 300) { // After 5 seconds
                console.warn("Performance warning: FPS below 45 -", this.getPerformance());
            }
        }, {
            throttle: 5000, // Check every 5 seconds
            id: 'performance-monitor'
        });
    },

    // Debug utilities
    logStats() {
        const stats = this.getPerformance();
        console.table({
            "Current FPS": stats.currentFPS,
            "Average FPS": stats.averageFPS,
            "Current Frame Time (ms)": Math.round(stats.currentFrameTime * 100) / 100,
            "Worst Frame Time (ms)": Math.round(stats.worstFrameTime * 100) / 100,
            "Total Callbacks": stats.totalCallbacks,
            "Total Frames": stats.frameCount
        });
    },

    // Clean up all callbacks
    clear() {
        this.callbacks.clear();
        this.stop();
        console.log("Cleared all RAF callbacks and stopped loop");
    }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing RAF manager...");
    RAFManager.init();

    // Auto-integrate with existing components after a brief delay
    setTimeout(() => {
        RAFManager.integrateExistingComponents();
    }, 100);
});

// Make it globally available
window.RAFManager = RAFManager;

console.log("RAF manager script loaded");