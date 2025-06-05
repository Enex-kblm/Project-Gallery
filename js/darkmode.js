// Initialize dark mode functionality
export function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or check system preference
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else if (savedTheme === 'light') {
        disableDarkMode();
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            enableDarkMode();
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
                    enableDarkMode(false); // Don't save preference
                } else {
                    disableDarkMode(false); // Don't save preference
                }
            }
        });
    }
}

// Toggle between light and dark mode
function toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Enable dark mode
function enableDarkMode(savePreference = true) {
    document.body.classList.add('dark-mode');
    if (savePreference) {
        localStorage.setItem('theme', 'dark');
    }
}

// Disable dark mode
function disableDarkMode(savePreference = true) {
    document.body.classList.remove('dark-mode');
    if (savePreference) {
        localStorage.setItem('theme', 'light');
    }
}