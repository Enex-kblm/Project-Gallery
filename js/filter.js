import { renderProjects } from './projects.js';
import { updateProjectCount } from './main.js';

// Initialize filter functionality
export function initFilter(projects) {
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!categoryFilter) {
        console.error('Category filter element not found');
        return;
    }
    
    // Populate filter with unique categories
    populateCategoryFilter(categoryFilter, projects);
    
    // Add change event listener
    categoryFilter.addEventListener('change', (e) => {
        const category = e.target.value;
        filterProjects(category, projects);
    });
}

// Populate category filter with unique categories from projects
function populateCategoryFilter(selectElement, projects) {
    // Get unique categories from projects
    const categories = [...new Set(projects.map(project => project.category))];
    
    // Keep the "All Categories" option
    const allOption = selectElement.options[0];
    
    // Clear existing options except the first one
    selectElement.innerHTML = '';
    selectElement.appendChild(allOption);
    
    // Add category options
    categories.sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = capitalize(category);
        selectElement.appendChild(option);
    });
}

// Filter projects based on selected category
function filterProjects(category, projects) {
    // If "all" is selected, show all projects
    const filteredProjects = category === 'all' 
        ? projects 
        : projects.filter(project => project.category === category);
    
    // Update UI with filtered projects
    renderProjects(filteredProjects);
    updateProjectCount(filteredProjects.length);
    
    // Track filter for analytics (in a real app)
    logFilter(category, filteredProjects.length);
}

// Capitalize first letter of a string
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Log filter for analytics purposes
function logFilter(category, resultCount) {
    // In a real application, this would send data to an analytics service
    console.log(`Filter: "${category}" - ${resultCount} results`);
}