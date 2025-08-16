document.addEventListener('DOMContentLoaded', function () {
    console.log('Tab script loaded');

    const projectsTab = document.getElementById('projects-tab');
    const archiveTab = document.getElementById('archive-tab');
    const projectsContent = document.getElementById('projects-content');
    const archiveContent = document.getElementById('archive-content');

    console.log('Elements found:', {
        projectsTab,
        archiveTab,
        projectsContent,
        archiveContent
    });

    // Ensure initial state
    if (archiveContent) {
        archiveContent.classList.remove('active');
    }
    if (projectsContent) {
        projectsContent.classList.add('active');
    }

    if (projectsTab) {
        projectsTab.addEventListener('click', function () {
            console.log('Projects clicked');
            archiveContent.classList.remove('active');
            archiveTab.classList.remove('active');
            projectsContent.classList.add('active');
            projectsTab.classList.add('active');
        });
    }

    if (archiveTab) {
        archiveTab.addEventListener('click', function () {
            console.log('Archive clicked');
            projectsContent.classList.remove('active');
            projectsTab.classList.remove('active');
            archiveContent.classList.add('active');
            archiveTab.classList.add('active');
        });
    }
});