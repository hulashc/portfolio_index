// Modern Lightbox Gallery Script
class PortfolioLightbox {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createLightboxHTML();
        this.bindEvents();
        this.loadProjectImages();
    }

    createLightboxHTML() {
        const lightboxHTML = `
            <div id="portfolio-lightbox" class="lightbox-overlay">
                <div class="lightbox-container">
                    <button class="lightbox-close">&times;</button>
                    <button class="lightbox-prev">‹</button>
                    <button class="lightbox-next">›</button>
                    <div class="lightbox-content">
                        <img id="lightbox-image" src="" alt="">
                        <div class="lightbox-info">
                            <h3 id="lightbox-title"></h3>
                            <p id="lightbox-counter"></p>
                        </div>
                    </div>
                    <div class="lightbox-thumbnails" id="lightbox-thumbnails"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    loadProjectImages() {
        // Define your project images here
        this.projectImages = {
            'quantum-shield': [
                'images/quantum-shield/quantum-1.jpg',
                'images/quantum-shield/quantum-2.jpg',
                'images/quantum-shield/quantum-3.jpg',
                'images/quantum-shield/quantum-4.jpg',
                'images/quantum-shield/quantum-5.jpg',
                'images/quantum-shield/quantum-6.jpg',
                'images/quantum-shield/quantum-7.jpg',
                'images/quantum-shield/quantum-8.jpg',
                'images/quantum-shield/quantum-9.jpg',
                'images/quantum-shield/quantum-10.jpg',
                'images/quantum-shield/quantum-11.jpg',
                'images/quantum-shield/quantum-12.jpg'
            ],
            'neural-fortress': [
                'images/neural-fortress/neural-1.jpg',
                'images/neural-fortress/neural-2.jpg',
                'images/neural-fortress/neural-3.jpg',
                'images/neural-fortress/neural-4.jpg',
                'images/neural-fortress/neural-5.jpg',
                'images/neural-fortress/neural-6.jpg',
                'images/neural-fortress/neural-7.jpg',
                'images/neural-fortress/neural-8.jpg',
                'images/neural-fortress/neural-9.jpg',
                'images/neural-fortress/neural-10.jpg',
                'images/neural-fortress/neural-11.jpg',
                'images/neural-fortress/neural-12.jpg',
                'images/neural-fortress/neural-13.jpg',
                'images/neural-fortress/neural-14.jpg',
                'images/neural-fortress/neural-15.jpg',
                'images/neural-fortress/neural-16.jpg',
                'images/neural-fortress/neural-17.jpg',
                'images/neural-fortress/neural-18.jpg'
            ],
            // Add more projects as needed...
        };
    }

    bindEvents() {
        // Bind click events to project links
        document.addEventListener('click', (e) => {
            const projectLink = e.target.closest('.wo-l-li');
            if (projectLink) {
                e.preventDefault();
                const href = projectLink.getAttribute('href');
                const projectName = href.split('/').pop();
                this.openLightbox(projectName);
            }
        });

        // Lightbox controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox-close') || e.target.classList.contains('lightbox-overlay')) {
                this.closeLightbox();
            }
            if (e.target.classList.contains('lightbox-prev')) {
                this.prevImage();
            }
            if (e.target.classList.contains('lightbox-next')) {
                this.nextImage();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.prevImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });

        // Touch/swipe support
        this.addTouchSupport();
    }

    openLightbox(projectName) {
        const images = this.projectImages[projectName];
        if (!images || images.length === 0) {
            console.warn(`No images found for project: ${projectName}`);
            return;
        }

        this.images = images;
        this.currentIndex = 0;
        this.isOpen = true;

        const lightbox = document.getElementById('portfolio-lightbox');
        lightbox.style.display = 'flex';

        // Animate in
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);

        this.updateLightbox();
        this.createThumbnails();
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('portfolio-lightbox');
        lightbox.classList.remove('active');

        setTimeout(() => {
            lightbox.style.display = 'none';
            this.isOpen = false;
            document.body.style.overflow = 'auto';
        }, 300);
    }

    updateLightbox() {
        const image = document.getElementById('lightbox-image');
        const title = document.getElementById('lightbox-title');
        const counter = document.getElementById('lightbox-counter');

        image.src = this.images[this.currentIndex];
        title.textContent = this.getCurrentProjectName();
        counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

        // Update active thumbnail
        this.updateActiveThumbnail();
    }

    prevImage() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
        this.updateLightbox();
    }

    nextImage() {
        this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
        this.updateLightbox();
    }

    createThumbnails() {
        const container = document.getElementById('lightbox-thumbnails');
        container.innerHTML = '';

        this.images.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'lightbox-thumb';
            thumb.innerHTML = `<img src="${img}" alt="Thumbnail ${index + 1}">`;
            thumb.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateLightbox();
            });
            container.appendChild(thumb);
        });
    }

    updateActiveThumbnail() {
        const thumbs = document.querySelectorAll('.lightbox-thumb');
        thumbs.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
    }

    getCurrentProjectName() {
        // Extract project name from current URL or context
        const projectKeys = Object.keys(this.projectImages);
        for (let key of projectKeys) {
            if (this.projectImages[key] === this.images) {
                return key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
        }
        return 'Project Gallery';
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;

        const lightboxContainer = document.querySelector('.lightbox-container');

        lightboxContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        lightboxContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches.clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextImage();
                } else {
                    this.prevImage();
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioLightbox();
});