// Mobile-specific search enhancements
export class MobileSearchHandler {
    constructor(searchInstance) {
        this.searchInstance = searchInstance;
        this.isMobile = window.innerWidth <= 767;
        this.init();
    }
    
    init() {
        if (!this.isMobile) return;
        
        this.setupMobileToggle();
        this.setupTouchOptimizations();
        this.setupMobileKeyboard();
    }
    
    setupMobileToggle() {
        const searchContainer = document.querySelector('.search-container');
        const searchToggle = document.getElementById('searchToggle');
        const searchBar = document.getElementById('searchBar');
        
        if (!searchToggle || !searchContainer || !searchBar) return;
        
        searchToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileSearch();
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target) && 
                searchContainer.classList.contains('active')) {
                this.closeMobileSearch();
            }
        });
        
        // Handle escape key
        searchBar.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileSearch();
            }
        });
    }
    
    toggleMobileSearch() {
        const searchContainer = document.querySelector('.search-container');
        const searchBar = document.getElementById('searchBar');
        
        if (searchContainer.classList.contains('active')) {
            this.closeMobileSearch();
        } else {
            this.openMobileSearch();
        }
    }
    
    openMobileSearch() {
        const searchContainer = document.querySelector('.search-container');
        const searchBar = document.getElementById('searchBar');
        
        searchContainer.classList.add('active');
        
        // Focus with slight delay for animation
        setTimeout(() => {
            searchBar.focus();
            
            // Show virtual keyboard on iOS
            if (this.isIOS()) {
                searchBar.click();
            }
        }, 100);
        
        // Announce to screen readers
        this.announceToScreenReader('Search opened');
    }
    
    closeMobileSearch() {
        const searchContainer = document.querySelector('.search-container');
        const searchBar = document.getElementById('searchBar');
        
        searchContainer.classList.remove('active');
        searchBar.blur();
        
        // Hide suggestions
        if (this.searchInstance) {
            this.searchInstance.hideSuggestions();
        }
        
        this.announceToScreenReader('Search closed');
    }
    
    setupTouchOptimizations() {
        const searchToggle = document.getElementById('searchToggle');
        
        if (!searchToggle) return;
        
        // Add touch feedback
        searchToggle.addEventListener('touchstart', (e) => {
            searchToggle.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        searchToggle.addEventListener('touchend', (e) => {
            setTimeout(() => {
                searchToggle.style.transform = '';
            }, 100);
        }, { passive: true });
        
        // Prevent double-tap zoom
        searchToggle.addEventListener('touchend', (e) => {
            e.preventDefault();
        });
    }
    
    setupMobileKeyboard() {
        const searchBar = document.getElementById('searchBar');
        
        if (!searchBar) return;
        
        // Optimize for mobile keyboards
        searchBar.setAttribute('autocomplete', 'off');
        searchBar.setAttribute('autocorrect', 'off');
        searchBar.setAttribute('autocapitalize', 'off');
        searchBar.setAttribute('spellcheck', 'false');
        
        // Handle virtual keyboard
        if (this.isIOS()) {
            this.setupIOSKeyboard(searchBar);
        } else if (this.isAndroid()) {
            this.setupAndroidKeyboard(searchBar);
        }
    }
    
    setupIOSKeyboard(searchBar) {
        // Handle iOS virtual keyboard behavior
        searchBar.addEventListener('focus', () => {
            // Prevent zoom on focus
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                const originalContent = viewport.content;
                viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                
                searchBar.addEventListener('blur', () => {
                    viewport.content = originalContent;
                }, { once: true });
            }
            
            // Scroll to top to ensure visibility
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 300);
        });
    }
    
    setupAndroidKeyboard(searchBar) {
        // Handle Android virtual keyboard
        let initialViewportHeight = window.innerHeight;
        
        searchBar.addEventListener('focus', () => {
            // Monitor viewport changes
            const checkKeyboard = () => {
                const currentHeight = window.innerHeight;
                const keyboardHeight = initialViewportHeight - currentHeight;
                
                if (keyboardHeight > 150) {
                    // Keyboard is open
                    document.body.style.paddingBottom = `${keyboardHeight}px`;
                }
            };
            
            setTimeout(checkKeyboard, 300);
        });
        
        searchBar.addEventListener('blur', () => {
            document.body.style.paddingBottom = '';
        });
    }
    
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }
    
    isAndroid() {
        return /Android/.test(navigator.userAgent);
    }
    
    announceToScreenReader(message) {
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
}

// Screen reader only class
const srOnlyCSS = `
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
`;

// Inject screen reader styles
if (!document.querySelector('#sr-only-styles')) {
    const style = document.createElement('style');
    style.id = 'sr-only-styles';
    style.textContent = srOnlyCSS;
    document.head.appendChild(style);
}