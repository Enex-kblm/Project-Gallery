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
                title: "Julian-CF",
                description: "A multifunctional WhatsApp bot designed to assist with daily activities. It automates routine tasks, provides quick access to useful tools, and improves productivity through an easy-to-use chat-based interface. Ideal for personal use or lightweight task management.",
                image: "https://raw.githubusercontent.com/Enex-kblm/julian-cf/refs/heads/main/image/thumb.webp",
                url: "https://github.com/Enex-kblm/julian-cf.git",
                category: "wabot",
                date: "2025-06-01"
            },
            {
                id: 3,
                title: "DiG-L",
                description: "Dig-L is a WhatsApp-based penetration testing assistant that offers a range of cybersecurity tools accessible via chat commands. It enables users to perform basic recon, information gathering, and network testing directly through WhatsApp, making it a lightweight and mobile-friendly companion for ethical hackers and security enthusiasts.",
                image: "https://raw.githubusercontent.com/Enex-kblm/DiG-L-wabot/main/DiG-L.png",
                url: "https://github.com/Enex-kblm/DiG-L-wabot.git",
                category: "wabot",
                date: "2025-06-01"
            },
            {
                id: 4,
                title: "Hitung usia",
                description: "A simple and interactive age calculator website that lets users find out how long they've been alive. It calculates a person's current age based on their birth date and displays the result in years, months, and days, making it a fun and informative tool for personal use.",
                image: "https://raw.githubusercontent.com/Enex-kblm/hitung-usia-kamu/main/Screenshot%202025-06-06%20080031.png",
                url: "https://enex-kblm.github.io/hitung-usia-kamu/",
                category: "website",
                date: "2025-06-01"
            },
            {
                id: 5,
                title: "QRcode generator",
                description: "A web-based QR code generator that allows users to instantly create QR codes from any URL or plain text. Designed for simplicity and speed, this tool makes sharing links or information more efficient and accessible across devices.",
                image: "https://raw.githubusercontent.com/Enex-kblm/QRcode-generator/main/Screenshot%202025-06-06%20080350.png",
                url: "https://qr-code-generator-liart-ten.vercel.app/",
                category: "website",
                date: "2025-06-01"
            },
            {
                id: 6,
                title: "Choice picker",
                description: "A lightweight and intuitive web tool that randomly selects from a list of user-defined choices. Perfect for making quick, unbiased decisions in any situation where multiple options are available.",
                image: "https://raw.githubusercontent.com/Enex-kblm/choice_picker/main/Screenshot%202025-06-06%20100734.png",
                url: "https://enex-kblm.github.io/choice_picker/",
                category: "website",
                date: "2025-06-01"
            },
            {
                id: 7,
                title: "Hand tracking game",
                description: "Hand Tracking Game is a Python-based program where players use their hands to catch falling objects from the top of the screen. The goal is to collect as many objects as possible. As the player catches more objects at once, the falling speed of subsequent objects increases, making the game progressively more challenging. If an object is missed and falls without being caught, the game ends.",
                image: "https://raw.githubusercontent.com/Enex-kblm/tracking_game/main/PYtracking%20game.png",
                url: "https://github.com/Enex-kblm/tracking_game.git",
                category: "python",
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
    const uniqueId = `description-${project.id}`;
    return `
        <div class="project-card" data-id="${project.id}" data-category="${project.category}">
            <img class="project-image" src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <div class="project-meta">
                    <span class="project-category">${project.category}</span>
                    <span class="project-date">${formatDate(project.date)}</span>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <div class="description-container">
                    <p id="${uniqueId}" class="project-description truncated">${project.description}</p>
                    <button class="show-more-btn" data-target="${uniqueId}">Show more</button>
                </div>
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
            
        // Add event listeners for show more/less buttons
        const showMoreButtons = container.querySelectorAll('.show-more-btn');
        showMoreButtons.forEach(button => {
            button.addEventListener('click', toggleDescription);
        });
            
        if (noResults) noResults.classList.add('hidden');
    }
}

// Toggle description expansion
function toggleDescription(event) {
    const button = event.target;
    const targetId = button.getAttribute('data-target');
    const description = document.getElementById(targetId);
    
    if (!description) return;
    
    const isExpanded = !description.classList.contains('truncated');
    description.classList.toggle('truncated');
    button.textContent = isExpanded ? 'Show more' : 'Show less';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}