import { renderProjects } from './projects.js';
import { updateProjectCount } from './main.js';

// Enhanced search functionality with improved UX
export class EnhancedSearch {
    constructor(projects, elementId = '#searchBar') {
        this.projects = projects;
        this.elementId = elementId;
        this.searchBar = document.querySelector(elementId);
        this.searchContainer = this.searchBar?.closest('.search-container');
        this.debounceTimer = null;
        this.currentQuery = '';
        this.searchHistory = this.loadSearchHistory();
        this.suggestions = [];
        
        if (!this.searchBar) {
            console.error('Search bar element not found');
            return;
        }
        
        this.init();
    }
    
    init() {
        this.createSearchElements();
        this.bindEvents();
        this.generateSuggestions();
        this.setupKeyboardShortcuts();
    }
    
    createSearchElements() {
        // Add clear button
        const clearButton = document.createElement('button');
        clearButton.className = 'search-clear';
        clearButton.innerHTML = '×';
        clearButton.setAttribute('aria-label', 'Clear search');
        clearButton.type = 'button';
        this.searchContainer.appendChild(clearButton);
        
        // Add keyboard shortcut indicator (desktop only)
        if (window.innerWidth >= 768) {
            const shortcut = document.createElement('span');
            shortcut.className = 'search-shortcut';
            shortcut.textContent = 'Ctrl+K';
            this.searchContainer.appendChild(shortcut);
        }
        
        // Add suggestions dropdown
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.setAttribute('role', 'listbox');
        this.searchContainer.appendChild(suggestionsContainer);
        
        this.clearButton = clearButton;
        this.suggestionsContainer = suggestionsContainer;
    }
    
    bindEvents() {
        // Search input with enhanced debouncing
        this.searchBar.addEventListener('input', (e) => {
            this.handleInput(e);
        });
        
        // Clear button
        this.clearButton.addEventListener('click', () => {
            this.clearSearch();
        });
        
        // Focus and blur events
        this.searchBar.addEventListener('focus', () => {
            this.handleFocus();
        });
        
        this.searchBar.addEventListener('blur', (e) => {
            // Delay hiding suggestions to allow clicking
            setTimeout(() => this.handleBlur(e), 150);
        });
        
        // Keyboard navigation
        this.searchBar.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!this.searchContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
    
    handleInput(e) {
        const query = e.target.value.trim();
        this.currentQuery = query;
        
        // Update UI state
        this.updateSearchState(query);
        
        // Clear previous timer
        clearTimeout(this.debounceTimer);
        
        // Show loading state
        this.showLoadingState();
        
        // Debounced search
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
            this.updateSuggestions(query);
        }, 300);
    }
    
    updateSearchState(query) {
        this.searchContainer.classList.toggle('has-text', query.length > 0);
        this.searchContainer.classList.toggle('has-results', query.length > 0);
    }
    
    showLoadingState() {
        this.searchContainer.classList.add('loading');
    }
    
    hideLoadingState() {
        this.searchContainer.classList.remove('loading');
    }
    
    performSearch(query) {
        this.hideLoadingState();
        
        if (!query) {
            renderProjects(this.projects);
            updateProjectCount(this.projects.length);
            return;
        }
        
        // Enhanced search with weighted scoring
        const results = this.searchWithScoring(query);
        
        renderProjects(results);
        updateProjectCount(results.length);
        
        // Save to search history
        this.saveToHistory(query, results.length);
        
        // Analytics
        this.logSearch(query, results.length);
    }
    
    searchWithScoring(query) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        return this.projects
            .map(project => ({
                ...project,
                score: this.calculateRelevanceScore(project, searchTerms)
            }))
            .filter(project => project.score > 0)
            .sort((a, b) => b.score - a.score);
    }
    
    calculateRelevanceScore(project, searchTerms) {
        let score = 0;
        const title = project.title.toLowerCase();
        const description = project.description.toLowerCase();
        const category = project.category.toLowerCase();
        
        searchTerms.forEach(term => {
            // Title matches (highest weight)
            if (title.includes(term)) {
                score += title.startsWith(term) ? 10 : 5;
            }
            
            // Category matches (medium weight)
            if (category.includes(term)) {
                score += 3;
            }
            
            // Description matches (lower weight)
            if (description.includes(term)) {
                score += 1;
            }
        });
        
        return score;
    }
    
    generateSuggestions() {
        // Generate suggestions from project data
        const categories = [...new Set(this.projects.map(p => p.category))];
        const titles = this.projects.map(p => p.title);
        const keywords = this.extractKeywords();
        
        this.suggestions = [
            ...categories.map(cat => ({ type: 'category', text: cat, icon: '🏷️' })),
            ...titles.map(title => ({ type: 'project', text: title, icon: '📁' })),
            ...keywords.map(keyword => ({ type: 'keyword', text: keyword, icon: '🔍' }))
        ];
    }
    
    extractKeywords() {
        // Extract common keywords from descriptions
        const allText = this.projects
            .map(p => p.description.toLowerCase())
            .join(' ');
            
        const words = allText
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);
            
        const wordCount = {};
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
        
        return Object.entries(wordCount)
            .filter(([word, count]) => count > 1)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }
    
    updateSuggestions(query) {
        if (!query || query.length < 2) {
            this.hideSuggestions();
            return;
        }
        
        const filteredSuggestions = this.suggestions
            .filter(suggestion => 
                suggestion.text.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5);
            
        if (filteredSuggestions.length > 0) {
            this.showSuggestions(filteredSuggestions);
        } else {
            this.hideSuggestions();
        }
    }
    
    showSuggestions(suggestions) {
        const html = suggestions
            .map((suggestion, index) => `
                <div class="search-suggestion" 
                     data-index="${index}" 
                     data-text="${suggestion.text}"
                     role="option">
                    <span class="search-suggestion-icon">${suggestion.icon}</span>
                    <span class="search-suggestion-text">${suggestion.text}</span>
                    <span class="search-suggestion-category">${suggestion.type}</span>
                </div>
            `)
            .join('');
            
        this.suggestionsContainer.innerHTML = html;
        this.suggestionsContainer.classList.add('visible');
        
        // Bind click events
        this.suggestionsContainer.querySelectorAll('.search-suggestion').forEach(item => {
            item.addEventListener('click', () => {
                this.selectSuggestion(item.dataset.text);
            });
        });
    }
    
    hideSuggestions() {
        this.suggestionsContainer.classList.remove('visible');
        this.selectedSuggestionIndex = -1;
    }
    
    selectSuggestion(text) {
        this.searchBar.value = text;
        this.currentQuery = text;
        this.updateSearchState(text);
        this.performSearch(text);
        this.hideSuggestions();
        this.searchBar.focus();
    }
    
    handleKeydown(e) {
        const suggestions = this.suggestionsContainer.querySelectorAll('.search-suggestion');
        
        switch (e.key) {
            case 'Escape':
                if (this.suggestionsContainer.classList.contains('visible')) {
                    this.hideSuggestions();
                } else {
                    this.clearSearch();
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                this.navigateSuggestions(suggestions, 1);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.navigateSuggestions(suggestions, -1);
                break;
                
            case 'Enter':
                e.preventDefault();
                const highlighted = this.suggestionsContainer.querySelector('.highlighted');
                if (highlighted) {
                    this.selectSuggestion(highlighted.dataset.text);
                }
                break;
        }
    }
    
    navigateSuggestions(suggestions, direction) {
        if (suggestions.length === 0) return;
        
        const currentIndex = this.selectedSuggestionIndex || -1;
        let newIndex = currentIndex + direction;
        
        if (newIndex < 0) newIndex = suggestions.length - 1;
        if (newIndex >= suggestions.length) newIndex = 0;
        
        // Remove previous highlight
        suggestions.forEach(s => s.classList.remove('highlighted'));
        
        // Add new highlight
        suggestions[newIndex].classList.add('highlighted');
        this.selectedSuggestionIndex = newIndex;
        
        // Scroll into view
        suggestions[newIndex].scrollIntoView({ block: 'nearest' });
    }
    
    setupKeyboardShortcuts() {
        // Ctrl+K or Cmd+K to focus search
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchBar.focus();
                this.searchBar.select();
            }
        });
    }
    
    handleFocus() {
        if (this.currentQuery && this.currentQuery.length >= 2) {
            this.updateSuggestions(this.currentQuery);
        }
    }
    
    handleBlur(e) {
        // Only hide if not clicking on suggestions
        if (!this.searchContainer.contains(e.relatedTarget)) {
            this.hideSuggestions();
        }
    }
    
    clearSearch() {
        this.searchBar.value = '';
        this.currentQuery = '';
        this.updateSearchState('');
        this.performSearch('');
        this.hideSuggestions();
        this.searchBar.focus();
    }
    
    saveToHistory(query, resultCount) {
        if (query.length < 2) return;
        
        const historyItem = {
            query,
            resultCount,
            timestamp: Date.now()
        };
        
        this.searchHistory.unshift(historyItem);
        this.searchHistory = this.searchHistory.slice(0, 10); // Keep last 10
        
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
    
    loadSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('searchHistory') || '[]');
        } catch {
            return [];
        }
    }
    
    logSearch(term, resultCount) {
        console.log(`Enhanced Search: "${term}" - ${resultCount} results`);
        
        // In production, send to analytics
        if (window.gtag) {
            window.gtag('event', 'search', {
                search_term: term,
                result_count: resultCount
            });
        }
    }
}

// Initialize enhanced search
export function initEnhancedSearch(projects, elementId = '#searchBar') {
    return new EnhancedSearch(projects, elementId);
}

// Legacy compatibility
export function initSearch(projects, elementId = '#searchBar') {
    return initEnhancedSearch(projects, elementId);
}