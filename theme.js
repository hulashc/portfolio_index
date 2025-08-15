const themeToggle = {
    init() {
        const toggleEl = document.getElementById("n-th");
        if (!toggleEl) return;

        const spans = toggleEl.querySelectorAll("span");
        if (spans.length < 2) return;

        this.lightBtn = spans[0];
        this.darkBtn = spans[1];

        this.applySavedTheme();

        this.lightBtn.addEventListener("click", () => this.setLight());
        this.darkBtn.addEventListener("click", () => this.setDark());
    },

    setLight() {
        document.body.className = "_l";
        this.lightBtn.classList.add("o");
        this.darkBtn.classList.remove("o");
        localStorage.setItem("th", "_l");
        document.querySelector('meta[name="theme-color"]').content = "#ecebeb";
    },

    setDark() {
        document.body.className = "_d";
        this.darkBtn.classList.add("o");
        this.lightBtn.classList.remove("o");
        localStorage.setItem("th", "_d");
        document.querySelector('meta[name="theme-color"]').content = "#161310";
    },

    applySavedTheme() {
        const saved = localStorage.getItem("th");
        if (saved === "_d") {
            this.setDark();
        } else {
            this.setLight();
        }
    } // ✅ Added missing closing brace
}; // ✅ Added missing closing brace and semicolon

document.addEventListener("DOMContentLoaded", () => {
    themeToggle.init();
});