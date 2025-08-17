// simple-router.js - Debug version
console.log("Simple router script loading...");

const simpleRouter = {
    init() {
        console.log("Simple router initializing...");

        // Handle all link clicks
        document.addEventListener("click", (e) => this.handleClick(e));

        // Handle back/forward browser buttons
        window.addEventListener("popstate", (e) => this.handlePopState(e));

        console.log("Simple router initialized successfully!");
    },

    handleClick(e) {
        console.log("Click detected on:", e.target);

        const link = e.target.closest("a");
        if (!link) {
            console.log("Not a link, ignoring");
            return;
        }

        const href = link.getAttribute("href");
        console.log("Link href:", href);

        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || link.hasAttribute("target")) {
            console.log("Special link type, allowing default behavior");
            return; // Let default behavior handle these
        }

        // Check if it's an internal link
        try {
            const url = new URL(href, window.location.origin);
            console.log("Parsed URL:", url.href);
            console.log("URL origin:", url.origin);
            console.log("Current origin:", window.location.origin);

            if (url.origin !== window.location.origin) {
                console.log("External link, allowing default behavior");
                return; // External link
            }

            console.log("Internal link detected, preventing default and navigating");
            e.preventDefault();
            this.navigateTo(url.pathname);
        } catch (err) {
            console.error("Error parsing URL:", href, err);
            // Invalid URL, let default behavior handle
        }
    },

    handlePopState(e) {
        console.log("Popstate event:", e.state);
        this.loadPage(window.location.pathname, false);
    },

    navigateTo(path) {
        console.log("Navigating to:", path);
        console.log("Current path:", window.location.pathname);

        if (path === window.location.pathname) {
            console.log("Already on this page, skipping navigation");
            return;
        }

        history.pushState({
            page: path
        }, "", path);
        this.loadPage(path, true);
    },

    async loadPage(path, addToHistory = true) {
        console.log("Loading page:", path);

        try {
            // Show loading state
            document.body.classList.add("loading");
            console.log("Added loading class to body");

            // Fetch new page content
            console.log("Fetching:", path);
            const response = await fetch(path);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const html = await response.text();
            console.log("Received HTML, length:", html.length);

            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, "text/html");

            // Update title
            console.log("Old title:", document.title);
            document.title = newDoc.title;
            console.log("New title:", document.title);

            // Update main content (assuming content is in #m)
            const mainContent = document.getElementById("m");
            const newMainContent = newDoc.getElementById("m");

            console.log("Main content found:", !!mainContent);
            console.log("New main content found:", !!newMainContent);

            if (mainContent && newMainContent) {
                console.log("Replacing main content...");
                mainContent.innerHTML = newMainContent.innerHTML;
                console.log("Main content replaced successfully");
            } else {
                console.warn("Could not find main content containers");
            }

            // Re-initialize components on the new page
            this.reinitializeComponents();

            // Remove loading state
            document.body.classList.remove("loading");
            console.log("Removed loading class from body");

        } catch (error) {
            console.error("Router error:", error);
            // Fallback to normal navigation
            console.log("Falling back to normal navigation");
            window.location.href = path;
        }
    },

    reinitializeComponents() {
        console.log("Reinitializing components...");

        // Re-run other component initializations
        if (window.themeToggle) {
            console.log("Reinitializing theme toggle");
            themeToggle.init();
        }

        if (window.navHighlighter) {
            console.log("Updating navigation highlighter");
            navHighlighter.updateHighlight();
        }

        if (window.backToTop) {
            console.log("Updating back to top");
            backToTop.updateIcon();
        }

        console.log("Component reinitialization complete");
    }
};

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing simple router...");
    simpleRouter.init();
});

// Make it globally available
window.simpleRouter = simpleRouter;

console.log("Simple router script loaded");