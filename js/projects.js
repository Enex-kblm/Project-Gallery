// Load projects from data source
export async function loadProjects() {
    try {
        // In a real application, this would fetch from an API or JSON file
        // For this example, we'll use the sample data directly
        const projects = [
            {
                id: 1,
                title: "Personal Portfolio",
                description: "A sleek, modern portfolio website showcasing my skills, projects, and professional experience with interactive elements and a contact form.",
                image: "https://images.pexels.com/photos/196646/pexels-photo-196646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                url: "https://example.com/portfolio",
                category: "portfolio",
                date: "2024-01-15"
            },
            {
                id: 2,
                title: "Tech Blog",
                description: "A blog focused on web development, programming tips, and technology trends with a clean, minimalist design and rich content organization.",
                image: "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                url: "https://example.com/blog",
                category: "blog",
                date: "2024-02-20"
            },
            {
                id: 3,
                title: "Weather Dashboard",
                description: "An interactive weather application that provides real-time forecasts, historical data, and visualization tools using modern APIs and charting libraries.",
                image: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                url: "https://example.com/weather",
                category: "tool",
                date: "2024-03-10"
            },
            {
                id: 4,
                title: "E-commerce Platform",
                description: "A fully-featured online store with product catalog, shopping cart, secure checkout, and user account management built with modern web technologies.",
                image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                url: "https://example.com/shop",
                category: "app",
                date: "2024-04-05"
            },
            {
                id: 5,
                title: "Recipe Collection",
                description: "A culinary website featuring curated recipes, cooking tips, and meal planning tools with beautiful food photography and intuitive navigation.",
                image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                url: "https://example.com/recipes",
                category: "blog",
                date: "2024-05-12"
            },
            {
                id: 6,
                title: "Task Manager",
                description: "A productivity application for organizing tasks, managing projects, and tracking progress with customizable workflows and collaboration features.",
                image: "https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                url: "https://example.com/tasks",
                category: "tool",
                date: "2024-06-20"
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