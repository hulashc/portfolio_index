document.addEventListener('DOMContentLoaded', function () {

    const projectsTab = document.getElementById('projects-tab');
    const archiveTab = document.getElementById('archive-tab');
    const projectsContent = document.getElementById('projects-content');
    const archiveContent = document.getElementById('archive-content');

    // Set initial state
    archiveContent.classList.remove('active');
    archiveTab.classList.remove('active');
    projectsContent.classList.add('active');
    projectsTab.classList.add('active');

    projectsTab.addEventListener('click', function () {
        archiveContent.classList.remove('active');
        archiveTab.classList.remove('active');
        projectsContent.classList.add('active');
        projectsTab.classList.add('active');
    });

    archiveTab.addEventListener('click', function () {
        projectsContent.classList.remove('active');
        projectsTab.classList.remove('active');
        archiveContent.classList.add('active');
        archiveTab.classList.add('active');
    });

});