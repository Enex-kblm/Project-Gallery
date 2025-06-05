// Load projects from data source
export async function loadProjects() {
    try {
        // In a real application, this would fetch from an API or JSON file
        // For this example, we'll use the sample data directly
        const projects = [
            {
                id: 1,
                title: "MH-DDoS",
                description: "A customized version of the MH-DDoS tool originally developed by matrixTM, enhanced with a web-based user interface for easier interaction. This interface simplifies the configuration and execution of stress tests, making the tool more accessible for educational and testing purposes.",
                image: "https://raw.githubusercontent.com/Enex-kblm/MH-DDoS/main/files/preview.png",
                url: "https://github.com/Enex-kblm/MH-DDoS.git",
                category: "tool",
                date: "2025-06-01"
            },
            {
                id: 2,
                title: "MH-DDoS",
                description: "A customized version of the MH-DDoS tool originally developed by matrixTM, enhanced with a web-based user interface for easier interaction. This interface simplifies the configuration and execution of stress tests, making the tool more accessible for educational and testing purposes.",
                image: "https://raw.githubusercontent.com/Enex-kblm/MH-DDoS/main/files/preview.png",
                url: "https://github.com/Enex-kblm/MH-DDoS.git",
                category: "tool",
                date: "2025-06-01"
            },
            {
                id: 3,
                title: "MH-DDoS",
                description: "A customized version of the MH-DDoS tool originally developed by matrixTM, enhanced with a web-based user interface for easier interaction. This interface simplifies the configuration and execution of stress tests, making the tool more accessible for educational and testing purposes.",
                image: "https://raw.githubusercontent.com/Enex-kblm/MH-DDoS/main/files/preview.png",
                url: "https://github.com/Enex-kblm/MH-DDoS.git",
                category: "tool",
                date: "2025-06-01"
            },
            {
                id: 4,
                title: "MH-DDoS",
                description: "A customized version of the MH-DDoS tool originally developed by matrixTM, enhanced with a web-based user interface for easier interaction. This interface simplifies the configuration and execution of stress tests, making the tool more accessible for educational and testing purposes.",
                image: "https://raw.githubusercontent.com/Enex-kblm/MH-DDoS/main/files/preview.png",
                url: "https://github.com/Enex-kblm/MH-DDoS.git",
                category: "tool",
                date: "2025-06-01"
            },
            {
                id: 5,
                title: "MH-DDoS",
                description: "A customized version of the MH-DDoS tool originally developed by matrixTM, enhanced with a web-based user interface for easier interaction. This interface simplifies the configuration and execution of stress tests, making the tool more accessible for educational and testing purposes.",
                image: "https://raw.githubusercontent.com/Enex-kblm/MH-DDoS/main/files/preview.png",
                url: "https://github.com/Enex-kblm/MH-DDoS.git",
                category: "tool",
                date: "2025-06-01"
            },
            { 
                id: 6,
                title: "MH-DDoS",
                description: "A customized version of the MH-DDoS tool originally developed by matrixTM, enhanced with a web-based user interface for easier interaction. This interface simplifies the configuration and execution of stress tests, making the tool more accessible for educational and testing purposes.",
                image: "https://raw.githubusercontent.com/Enex-kblm/MH-DDoS/main/files/preview.png",
                url: "https://github.com/Enex-kblm/MH-DDoS.git",
                category: "tool",
                date: "2025-06-01"
            }
        ];
        
        // Render the projects
        renderProjects(projects);
        
        // Return the projects for use in other modules
        return projects;
    } catch (error) {
        console.error('Error loading projects:', error);
        throw new Error('Failed to load projects data');
    }
}

// Create HTML for a project card
export function createProjectCard(project) {
    return `
        <div class="project-card" data-id="${project.id}" data-category="${project.category}">
            <img class="project-image" src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <div class="project-meta">
                    <span class="project-category">${project.category}</span>
                    <span class="project-date">${formatDate(project.date)}</span>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-actions">
                    <a href="${project.url}" class="view-button" target="_blank" rel="noopener noreferrer">View Project</a>
                </div>
            </div>
        </div>
    `;
}

// Render projects to the DOM
export function renderProjects(projectsArray) {
    const container = document.getElementById('projectsContainer');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    if (projectsArray.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.classList.remove('hidden');
    } else {
        container.innerHTML = projectsArray
            .map(project => createProjectCard(project))
            .join('');
        if (noResults) noResults.classList.add('hidden');
    }
}

// Format date to a more readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}