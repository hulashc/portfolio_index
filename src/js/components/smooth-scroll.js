// smooth-scroll.js
console.log("Smooth scroll script loading...");

const smoothScroll = {
    init() {
        console.log("Smooth scroll initializing...");

        this.isActive = false;
        this.currentScroll = window.scrollY;
        this.targetScroll = window.scrollY;
        this.ease = 0.08; // Smoothness factor (lower = smoother, higher = snappier)

        // Disable default scrolling and add custom handlers
        this.disableDefault();
        this.addEventListeners();

        // Start the smooth scroll loop
        this.startLoop();

        console.log("Smooth scroll initialized successfully!");
    },

    disableDefault() {
        // Prevent default scroll behavior
        document.addEventListener('wheel', this.handleWheel.bind(this), {
            passive: false
        });
        document.addEventListener('keydown', this.handleKeydown.bind(this), {
            passive: false
        });
        document.addEventListener('touchstart', this.handleTouch.bind(this), {
            passive: false
        });
        document.addEventListener('touchmove', this.handleTouch.bind(this), {
            passive: false
        });
    },

    addEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateLimits();
        });

        this.updateLimits();
    },

    updateLimits() {
        this.maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
        this.targetScroll = Math.min(this.targetScroll, this.maxScroll);
        console.log("Scroll limits updated. Max scroll:", this.maxScroll);
    },

    handleWheel(e) {
        e.preventDefault();

        let delta = e.deltaY;

        // Handle different wheel modes (Firefox vs Chrome)
        if (e.deltaMode === 1) {
            delta *= 40; // Firefox line mode
        }

        // Apply scroll with speed multiplier
        this.targetScroll += delta * 1.2; // Adjust multiplier for speed
        this.targetScroll = Math.max(0, Math.min(this.maxScroll, this.targetScroll));

        console.log("Wheel scroll - Target:", Math.round(this.targetScroll));
    },

    handleKeydown(e) {
        const scrollKeys = [
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'PageUp', 'PageDown', 'Home', 'End', ' '
        ];

        if (!scrollKeys.includes(e.key)) return;

        e.preventDefault();

        let scrollAmount = 0;
        const viewportHeight = window.innerHeight;

        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                scrollAmount = -80;
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                scrollAmount = 80;
                break;
            case 'PageUp':
                scrollAmount = -viewportHeight * 0.9;
                break;
            case 'PageDown':
            case ' ':
                scrollAmount = e.shiftKey ? -viewportHeight * 0.9 : viewportHeight * 0.9;
                break;
            case 'Home':
                this.targetScroll = 0;
                return;
            case 'End':
                this.targetScroll = this.maxScroll;
                return;
        }

        this.targetScroll += scrollAmount;
        this.targetScroll = Math.max(0, Math.min(this.maxScroll, this.targetScroll));

        console.log("Key scroll - Target:", Math.round(this.targetScroll));
    },

    handleTouch(e) {
        // Basic touch handling - you can expand this for more sophisticated touch scrolling
        if (e.type === 'touchstart') {
            this.touchStartY = e.touches[0].clientY;
        } else if (e.type === 'touchmove' && this.touchStartY !== undefined) {
            e.preventDefault();
            const touchCurrentY = e.touches[0].clientY;
            const deltaY = (this.touchStartY - touchCurrentY) * 2; // Touch sensitivity

            this.targetScroll += deltaY;
            this.targetScroll = Math.max(0, Math.min(this.maxScroll, this.targetScroll));

            this.touchStartY = touchCurrentY;
        }
    },

    startLoop() {
        this.isActive = true;
        this.loop();
    },

    stopLoop() {
        this.isActive = false;
    },

    loop() {
        if (!this.isActive) return;

        // Smooth interpolation between current and target scroll
        const diff = this.targetScroll - this.currentScroll;

        if (Math.abs(diff) > 0.1) {
            this.currentScroll += diff * this.ease;

            // Apply the smooth scroll
            window.scrollTo(0, this.currentScroll);
        } else {
            // Snap to target when very close
            this.currentScroll = this.targetScroll;
            window.scrollTo(0, this.currentScroll);
        }

        // Continue the loop
        requestAnimationFrame(() => this.loop());
    },

    // Public method to scroll to a specific position
    scrollTo(position, smooth = true) {
        this.targetScroll = Math.max(0, Math.min(this.maxScroll, position));

        if (!smooth) {
            this.currentScroll = this.targetScroll;
            window.scrollTo(0, this.currentScroll);
        }

        console.log("Scrolling to:", Math.round(this.targetScroll));
    },

    // Public method to get current scroll position
    getScrollTop() {
        return this.currentScroll;
    }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing smooth scroll...");
    smoothScroll.init();
});

// Make it globally available for other scripts
window.smoothScroll = smoothScroll;

console.log("Smooth scroll script loaded");