class ElegantViewBox {
    constructor() {
        this.lightbox = null;
        this.currentImages = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.createLightbox();
        this.bindEvents();
        this.addHoverPreviews();
    }

    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'elegant-lightbox';
        this.lightbox.innerHTML = `
      <div class="lightbox-container">
        <span class="lightbox-close">&times;</span>
        <button class="lightbox-nav lightbox-prev">‹</button>
        <button class="lightbox-nav lightbox-next">›</button>
        <img class="lightbox-image" src="" alt="">
        <div class="lightbox-info">
          <div class="lightbox-title"></div>
          <div class="lightbox-subtitle"></div>
        </div>
      </div>
    `;
        document.body.appendChild(this.lightbox);
    }

    addHoverPreviews() {
        // Add hover preview containers to your existing masonry images
        const masonryImages = document.querySelectorAll('#wo-m ._me');
        masonryImages.forEach((container, index) => {
            container.classList.add('project-preview');

            // Add a sample image for demo (replace with your actual images)
            const img = document.createElement('img');
            img.src = `images/project-${index + 1}.jpg`; // Replace with actual paths
            img.alt = `Project ${index + 1}`;

            const overlay = document.createElement('div');
            overlay.className = 'project-overlay';
            overlay.innerHTML = `
        <h3>Project ${index + 1}</h3>
        <p>Click to view gallery</p>
      `;

            container.appendChild(img);
            container.appendChild(overlay);
        });
    }

    bindEvents() {
        // Project link clicks
        document.addEventListener('click', (e) => {
            const projectLink = e.target.closest('.wo-l-li');
            if (projectLink) {
                e.preventDefault();
                const href = projectLink.getAttribute('href');
                const projectName = href.split('/').pop();
                this.openLightbox(projectName);
            }
        });

        // Masonry image clicks
        document.addEventListener('click', (e) => {
            const previewContainer = e.target.closest('.project-preview');
            if (previewContainer) {
                const index = Array.from(document.querySelectorAll('.project-preview')).indexOf(previewContainer);
                this.openLightbox(`project-${index + 1}`);
            }
        });

        // Lightbox controls
        const closeBtn = this.lightbox.querySelector('.lightbox-close');
        const prevBtn = this.lightbox.querySelector('.lightbox-prev');
        const nextBtn = this.lightbox.querySelector('.lightbox-next');

        closeBtn.addEventListener('click', () => this.closeLightbox());
        prevBtn.addEventListener('click', () => this.prevImage());
        nextBtn.addEventListener('click', () => this.nextImage());

        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.classList.contains('lightbox-container')) {
                this.closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;

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
    }

    openLightbox(projectName) {
        // Define your project images (replace with actual paths)
        const projectImages = {
            'quantum-shield': [
                'images/quantum-shield/img1.jpg',
                'images/quantum-shield/img2.jpg',
                'images/quantum-shield/img3.jpg',
            ],
            'neural-fortress': [
                'images/neural-fortress/img1.jpg',
                'images/neural-fortress/img2.jpg',
            ],
            // Add more projects...
        };

        this.currentImages = projectImages[projectName] || [`images/${projectName}.jpg`];
        this.currentIndex = 0;

        this.updateLightboxContent();
        this.lightbox.style.display = 'block';

        setTimeout(() => {
            this.lightbox.classList.add('active');
        }, 10);

        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        setTimeout(() => {
            this.lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 400);
    }

    updateLightboxContent() {
        const img = this.lightbox.querySelector('.lightbox-image');
        const title = this.lightbox.querySelector('.lightbox-title');
        const subtitle = this.lightbox.querySelector('.lightbox-subtitle');

        img.src = this.currentImages[this.currentIndex];
        title.textContent = 'Security Project';
        subtitle.textContent = `${this.currentIndex + 1} of ${this.currentImages.length}`;
    }

    prevImage() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.currentImages.length - 1;
        this.updateLightboxContent();
    }

    nextImage() {
        this.currentIndex = this.currentIndex < this.currentImages.length - 1 ? this.currentIndex + 1 : 0;
        this.updateLightboxContent();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ElegantViewBox();
});