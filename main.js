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
        
        // Initialize mobile menu and controls
        initMobileMenu(projects);
        
        // Update project count
        updateProjectCount(projects.length);
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showErrorMessage('Failed to load projects. Please try again later.');
    }
}

// Initialize mobile menu
function initMobileMenu(projects) {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (!mobileMenuToggle || !mobileMenu || !overlay) return;
    
    // Toggle menu
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close menu
    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    mobileMenuClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // Initialize dark mode for mobile
    initDarkMode('#darkModeToggleMobile');
    
    // Initialize search for mobile
    initSearch(projects, '#searchBarMobile');
    
    // Initialize filter for mobile
    initFilter(projects, '#categoryFilterMobile');
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