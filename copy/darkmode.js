// Initialize dark mode functionality
export function initDarkMode(selector = '#darkModeToggle') {
    const darkModeToggle = document.querySelector(selector);
    const body = document.body;
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or check system preference
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
        }
    }
    
    // Add toggle event listener
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Only apply if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    body.classList.add('dark-mode');
                } else {
                    body.classList.remove('dark-mode');
                }
            }
        });
    }
}

// Toggle between light and dark mode
function toggleDarkMode() {
    const body = document.body;
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
};