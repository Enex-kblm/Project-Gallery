// Import modules
import { initDarkMode } from './darkmode.js';
import { initSearch } from './search.js';
import { initFilter } from './filter.js';
import { loadProjects } from './projects.js';

// Initialize the application
async function initApp() {
    try {
        // Load projects data
        const projects = await loadProjects();
        
        // Initialize features
        initDarkMode();
        initSearch(projects);
        initFilter(projects);
        
        // Update project count
        updateProjectCount(projects.length);
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showErrorMessage('Failed to load projects. Please try again later.');
    }
}

// Update the project count in the UI
function updateProjectCount(count) {
    const countElement = document.getElementById('projectCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Show error message to the user
function showErrorMessage(message) {
    const container = document.getElementById('projectsContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export utility functions for use in other modules
export { updateProjectCount, showErrorMessage };