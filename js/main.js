// Import modules
import { initDarkMode } from './darkmode.js';
import { initEnhancedSearch } from './enhanced-search.js';
import { MobileSearchHandler } from './mobile-search.js';
import { initFilter } from './filter.js';
import { loadProjects } from './projects.js';

// Initialize the application
async function initApp() {
    try {
        // Load projects data
        const projects = await loadProjects();
        
        // Initialize features for both desktop and mobile
        initDarkMode('#darkModeToggle');
        initDarkMode('#darkModeToggleMobile'); // Mobile dark mode toggle
        
        // Initialize enhanced search for both desktop and mobile
        const desktopSearch = initEnhancedSearch(projects, '#searchBar');
        const mobileSearch = initEnhancedSearch(projects, '#searchBarMobile');
        
        // Initialize mobile-specific search handlers
        if (desktopSearch) {
            new MobileSearchHandler(desktopSearch);
        }
        if (mobileSearch) {
            new MobileSearchHandler(mobileSearch);
        }
        
        initFilter(projects, '#categoryFilter');
        initFilter(projects, '#categoryFilterMobile'); // Mobile filter
        
        // Initialize mobile menu
        initMobileMenu();
        
        // Update project count
        updateProjectCount(projects.length);
        
        // Initialize performance monitoring
        initPerformanceMonitoring();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showErrorMessage('Failed to load projects. Please try again later.');
    }
}

// Mobile menu toggle functionality
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('mobileMenuClose');
    const menuOverlay = document.getElementById('mobileMenuOverlay');

    if (!menuToggle || !menu || !menuClose || !menuOverlay) {
        console.warn('Mobile menu elements not found. Skipping mobile menu initialization.');
        return;
    }

    // Open mobile menu
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openMobileMenu();
    });

    // Close mobile menu on close button click
    menuClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
    });

    // Close mobile menu on overlay click
    menuOverlay.addEventListener('click', () => {
        closeMobileMenu();
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    function openMobileMenu() {
        menu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        menuClose.focus();
        
        // Announce to screen readers
        announceToScreenReader('Mobile menu opened');
    }

    function closeMobileMenu() {
        menu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to menu toggle
        menuToggle.focus();
        
        announceToScreenReader('Mobile menu closed');
    }
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor search performance
    let searchStartTime;
    
    document.addEventListener('searchStart', () => {
        searchStartTime = performance.now();
    });
    
    document.addEventListener('searchComplete', (e) => {
        if (searchStartTime) {
            const duration = performance.now() - searchStartTime;
            console.log(`Search completed in ${duration.toFixed(2)}ms`);
            
            // Log slow searches
            if (duration > 500) {
                console.warn(`Slow search detected: ${duration.toFixed(2)}ms`);
            }
        }
    });
    
    // Monitor memory usage
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
                console.warn('High memory usage detected');
            }
        }, 30000); // Check every 30 seconds
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
            <div class="error-message" role="alert">
                <p>${message}</p>
            </div>
        `;
    }
}

// Accessibility helper
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Export utility functions for use in other modules
export { updateProjectCount, showErrorMessage, announceToScreenReader };