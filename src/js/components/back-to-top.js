// back-to-top.js - Updated for smooth scroll integration
const backToTop = {
    init() {
        console.log("Back-to-top initializing...");

        this.topButton = document.getElementById("top");

        if (!this.topButton) {
            console.error("ERROR: #top element not found!");
            return;
        }

        // Attach click event
        this.topButton.addEventListener("click", (e) => {
            console.log("Back-to-top clicked!");
            e.preventDefault();
            this.scrollToTop();
        });

        console.log("Back-to-top initialized successfully!");
    },

    scrollToTop() {
        console.log("Starting scroll to top...");

        // Use smooth scroll system if available
        if (window.smoothScroll) {
            console.log("Using smooth scroll system");
            window.smoothScroll.scrollTo(0);
        } else {
            console.log("Using browser scroll");
            // Fallback to browser scroll
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
};

// Auto-initialize
document.addEventListener("DOMContentLoaded", () => {
    backToTop.init();
});