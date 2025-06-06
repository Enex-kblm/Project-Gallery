import { renderProjects } from './projects.js';
import { updateProjectCount } from './main.js';

// Initialize search functionality
export function initSearch(projects, elementId = '#searchBar') {
    const searchBar = document.querySelector(elementId);
    
    if (!searchBar) {
        console.error('Search bar element not found');
        return;
    }
    
    // Add input event listener with debounce
    let debounceTimer;
    searchBar.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            searchProjects(searchTerm, projects);
        }, 300); // 300ms debounce
    });
    
    // Add clear search on Escape key
    searchBar.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchBar.value = '';
            searchProjects('', projects);
        }
    });
}

// Search projects based on search term
function searchProjects(searchTerm, projects) {
    // If search is empty, show all projects
    if (!searchTerm) {
        renderProjects(projects);
        updateProjectCount(projects.length);
        return;
    }
    
    // Filter projects based on search term
    const filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.category.toLowerCase().includes(searchTerm)
    );
    
    // Update UI with filtered projects
    renderProjects(filteredProjects);
    updateProjectCount(filteredProjects.length);
    
    // Track search for analytics (in a real app)
    logSearch(searchTerm, filteredProjects.length);
}

// Log search for analytics purposes
function logSearch(term, resultCount) {
    // In a real application, this would send data to an analytics service
    console.log(`Search: "${term}" - ${resultCount} results`);
}

// Toggle search input on small screens
document.addEventListener("DOMContentLoaded", () => {
    const searchContainer = document.querySelector(".search-container");
    const searchToggle = document.getElementById("searchToggle");

    if (searchToggle && searchContainer) {
        searchToggle.addEventListener("click", () => {
            searchContainer.classList.toggle("active");
            const input = document.getElementById("searchBar");
            if (input && searchContainer.classList.contains("active")) {
                input.focus();
            }
        });
    }
});