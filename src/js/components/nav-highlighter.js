// nav-highlighter.js
console.log("Navigation highlighter script loading...");

const navHighlighter = {
    init() {
        console.log("Navigation highlighter initializing...");

        // Find navigation container
        this.navContainer = document.getElementById("n-me");

        console.log("Navigation container found:", this.navContainer);

        if (!this.navContainer) {
            console.error("ERROR: #n-me navigation container not found!");
            return;
        }

        // Get all navigation links
        this.navLinks = this.navContainer.querySelectorAll("a");

        console.log("Navigation links found:", this.navLinks.length);

        if (this.navLinks.length === 0) {
            console.error("ERROR: No navigation links found in #n-me!");
            return;
        }

        // Update highlight on page load
        this.updateHighlight();

        // Update on page navigation (if you have SPA routing)
        window.addEventListener('popstate', () => {
            console.log("Navigation change detected, updating highlight...");
            this.updateHighlight();
        });

        console.log("Navigation highlighter initialized successfully!");
    },

    updateHighlight() {
        const currentPath = window.location.pathname;
        console.log("Current path:", currentPath);

        this.navLinks.forEach(link => {
            try {
                const linkPath = new URL(link.href).pathname;
                console.log("Checking link:", linkPath, "against current:", currentPath);

                if (linkPath === currentPath) {
                    link.classList.add("o");
                    console.log("✅ Added highlight to:", link.textContent.trim());
                } else {
                    link.classList.remove("o");
                    console.log("❌ Removed highlight from:", link.textContent.trim());
                }
            } catch (error) {
                console.error("Error processing link:", link.href, error);
            }
        });
    }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing navigation highlighter...");
    navHighlighter.init();
});

console.log("Navigation highlighter script loaded");