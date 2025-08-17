// touch-drag.js
console.log("Touch/drag support script loading...");

const TouchDrag = {
    init() {
        console.log("Touch/drag support initializing...");

        // Touch tracking
        this.touches = new Map();
        this.isActive = false;
        this.threshold = 10; // Minimum movement to register as drag

        // Gesture detection
        this.gestures = {
            swipe: {
                enabled: true,
                threshold: 50,
                velocity: 0.3
            },
            pinch: {
                enabled: true,
                threshold: 20
            },
            pan: {
                enabled: true,
                threshold: 5
            }
        };

        // Callbacks
        this.callbacks = {
            touchStart: [],
            touchMove: [],
            touchEnd: [],
            swipe: [],
            pinch: [],
            pan: []
        };

        // Bind methods
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        // Attach events
        this.attachEvents();

        console.log("Touch/drag support initialized successfully!");
    },

    attachEvents() {
        const options = {
            passive: false
        };

        document.addEventListener('touchstart', this.handleTouchStart, options);
        document.addEventListener('touchmove', this.handleTouchMove, options);
        document.addEventListener('touchend', this.handleTouchEnd, options);
        document.addEventListener('touchcancel', this.handleTouchEnd, options);

        console.log("Touch event listeners attached");
    },

    handleTouchStart(e) {
        this.isActive = true;
        const time = performance.now();

        // Store touch data
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            this.touches.set(touch.identifier, {
                id: touch.identifier,
                startX: touch.clientX,
                startY: touch.clientY,
                currentX: touch.clientX,
                currentY: touch.clientY,
                startTime: time,
                element: e.target
            });
        }

        console.log("Touch start:", this.touches.size, "touches");

        // Notify callbacks
        this.notifyCallbacks('touchStart', {
            touches: Array.from(this.touches.values()),
            originalEvent: e
        });
    },

    handleTouchMove(e) {
        if (!this.isActive) return;

        e.preventDefault(); // Prevent scrolling during touch
        const time = performance.now();

        // Update touch positions
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const stored = this.touches.get(touch.identifier);

            if (stored) {
                stored.currentX = touch.clientX;
                stored.currentY = touch.clientY;
                stored.deltaX = touch.clientX - stored.startX;
                stored.deltaY = touch.clientY - stored.startY;
                stored.distance = Math.sqrt(stored.deltaX * stored.deltaX + stored.deltaY * stored.deltaY);
                stored.velocity = stored.distance / (time - stored.startTime);
            }
        }

        // Detect gestures
        this.detectGestures(e);

        // Notify callbacks
        this.notifyCallbacks('touchMove', {
            touches: Array.from(this.touches.values()),
            originalEvent: e
        });
    },

    handleTouchEnd(e) {
        const time = performance.now();
        const endedTouches = [];

        // Process ended touches
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const stored = this.touches.get(touch.identifier);

            if (stored) {
                stored.endTime = time;
                stored.duration = time - stored.startTime;
                endedTouches.push(stored);
                this.touches.delete(touch.identifier);
            }
        }

        // Check for swipe gestures on ended touches
        endedTouches.forEach(touch => {
            this.checkSwipe(touch);
        });

        console.log("Touch end:", endedTouches.length, "touches ended,", this.touches.size, "remaining");

        // Deactivate if no touches remain
        if (this.touches.size === 0) {
            this.isActive = false;
        }

        // Notify callbacks
        this.notifyCallbacks('touchEnd', {
            endedTouches,
            remainingTouches: Array.from(this.touches.values()),
            originalEvent: e
        });
    },

    detectGestures(e) {
        const touchArray = Array.from(this.touches.values());

        // Pan gesture (single touch)
        if (touchArray.length === 1 && this.gestures.pan.enabled) {
            const touch = touchArray[0];
            if (touch.distance > this.gestures.pan.threshold) {
                this.notifyCallbacks('pan', {
                    touch,
                    deltaX: touch.deltaX,
                    deltaY: touch.deltaY,
                    distance: touch.distance,
                    originalEvent: e
                });
            }
        }

        // Pinch gesture (two touches)
        if (touchArray.length === 2 && this.gestures.pinch.enabled) {
            const [touch1, touch2] = touchArray;
            const currentDistance = Math.sqrt(
                Math.pow(touch2.currentX - touch1.currentX, 2) +
                Math.pow(touch2.currentY - touch1.currentY, 2)
            );
            const startDistance = Math.sqrt(
                Math.pow(touch2.startX - touch1.startX, 2) +
                Math.pow(touch2.startY - touch1.startY, 2)
            );

            const scale = currentDistance / startDistance;
            const deltaScale = Math.abs(scale - 1);

            if (deltaScale > this.gestures.pinch.threshold / 100) {
                this.notifyCallbacks('pinch', {
                    scale,
                    deltaScale,
                    center: {
                        x: (touch1.currentX + touch2.currentX) / 2,
                        y: (touch1.currentY + touch2.currentY) / 2
                    },
                    originalEvent: e
                });
            }
        }
    },

    checkSwipe(touch) {
        if (!this.gestures.swipe.enabled) return;

        const {
            deltaX,
            deltaY,
            distance,
            velocity,
            duration
        } = touch;
        const {
            threshold,
            velocity: minVelocity
        } = this.gestures.swipe;

        if (distance > threshold && velocity > minVelocity) {
            const direction = this.getSwipeDirection(deltaX, deltaY);

            this.notifyCallbacks('swipe', {
                direction,
                distance,
                velocity,
                duration,
                deltaX,
                deltaY,
                touch,
                originalEvent: null
            });

            console.log("Swipe detected:", direction, "distance:", distance, "velocity:", velocity);
        }
    },

    getSwipeDirection(deltaX, deltaY) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX > absY) {
            return deltaX > 0 ? 'right' : 'left';
        } else {
            return deltaY > 0 ? 'down' : 'up';
        }
    },

    // Callback subscription methods
    onTouchStart(callback) {
        this.callbacks.touchStart.push(callback);
        console.log("Added touchStart callback");
    },

    onTouchMove(callback) {
        this.callbacks.touchMove.push(callback);
        console.log("Added touchMove callback");
    },

    onTouchEnd(callback) {
        this.callbacks.touchEnd.push(callback);
        console.log("Added touchEnd callback");
    },

    onSwipe(callback) {
        this.callbacks.swipe.push(callback);
        console.log("Added swipe callback");
    },

    onPinch(callback) {
        this.callbacks.pinch.push(callback);
        console.log("Added pinch callback");
    },

    onPan(callback) {
        this.callbacks.pan.push(callback);
        console.log("Added pan callback");
    },

    notifyCallbacks(type, data) {
        const callbacks = this.callbacks[type];
        if (callbacks && callbacks.length > 0) {
            callbacks.forEach((callback, index) => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${type} callback ${index}:`, error);
                }
            });
        }
    },

    // Utility methods
    enableGesture(gesture, enabled = true) {
        if (this.gestures[gesture]) {
            this.gestures[gesture].enabled = enabled;
            console.log(`${gesture} gesture ${enabled ? 'enabled' : 'disabled'}`);
        }
    },

    setGestureThreshold(gesture, threshold) {
        if (this.gestures[gesture]) {
            this.gestures[gesture].threshold = threshold;
            console.log(`${gesture} threshold set to:`, threshold);
        }
    },

    getCurrentTouches() {
        return Array.from(this.touches.values());
    },

    isMultiTouch() {
        return this.touches.size > 1;
    }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing touch/drag support...");
    TouchDrag.init();
});

// Make it globally available
window.TouchDrag = TouchDrag;

console.log("Touch/drag support script loaded");