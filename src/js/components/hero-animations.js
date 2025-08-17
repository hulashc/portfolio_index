// hero-animations.js
document.addEventListener('DOMContentLoaded', () => {
    const morphContainer = document.querySelector('.morph-container');
    const shapes = document.querySelectorAll('.morph-shape');

    if (!morphContainer || shapes.length === 0) return;

    /* 1. Hover: speed up */
    morphContainer.addEventListener('mouseenter', () => {
        shapes.forEach((shape, i) => {
            const base = parseFloat(getComputedStyle(shape).animationDuration);
            const factor = [0.5, 0.6, 0.7][i];
            shape.style.animationDuration = `${base*factor}s`;
        });
    });

    morphContainer.addEventListener('mouseleave', () => {
        ['12s', '15s', '18s'].forEach((d, i) => shapes[i].style.animationDuration = d);
    });

    /* 2. Click: reverse direction */
    morphContainer.addEventListener('click', () => {
        shapes.forEach(shape => {
            const dir = shape.style.animationDirection || 'normal';
            shape.style.animationDirection = dir === 'reverse' ? 'normal' : 'reverse';
        });
    });

    /* 3. Scroll: subtle speed change */
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.body.scrollHeight - innerHeight);
        shapes.forEach((shape, i) => {
            const base = [12, 15, 18][i];
            shape.style.animationDuration = `${base/(1 + pct*0.5)}s`;
        });
    });
});