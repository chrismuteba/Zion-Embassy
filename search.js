// Search functionality for The Ekklesia Zion Embassy website

class SearchEngine {
    constructor() {
        this.searchData = [];
        this.searchHistory = JSON.parse(localStorage.getItem('search_history') || '[]');
        this.currentFilters = {
            type: 'all',
            date: 'all'
        };
        this.init();
    }

    init() {
        this.loadSearchData();
        this.setupEventListeners();
        this.displaySearchHistory();
        this.handleURLParams();
    }

    // Load all searchable content
    loadSearchData() {
        this.searchData = [
            // Sermons
            {
                id: 'sermon-1',
                title: 'Walking in the Spirit',
                content: 'Exploring what it means to live a life led by the Holy Spirit in our daily walk with God. Understanding the fruits of the Spirit and how they manifest in our lives.',
                category: 'sermons',
                type: 'Sermon',
                url: 'sermons.html',
                author: 'Pastor Emmanuel',
                date: '2024-06-18',
                tags: ['holy spirit', 'christian living', 'spiritual growth']
            },
            {
                id: 'sermon-2',
                title: 'The Power of Praise',
                content: 'Discover how praise can break chains and open doors in your spiritual journey. Learn about the biblical foundation of worship and praise.',
                category: 'sermons',
                type: 'Sermon',
                url: 'sermons.html',
                author: 'Minister Sarah',
                date: '2024-06-11',
                tags: ['praise', 'worship', 'breakthrough', 'spiritual warfare']
            },
            {
                id: 'sermon-3',
                title: 'Building Kingdom Families',
                content: 'Biblical principles for establishing godly families that reflect God\'s kingdom on earth. Understanding roles and relationships in Christian families.',
                category: 'sermons',
                type: 'Sermon',
                url: 'sermons.html',
                author: 'Pastor Emmanuel',
                date: '2024-06-04',
                tags: ['family', 'kingdom', 'relationships', 'marriage']
            },
            {
                id: 'sermon-4',
                title: 'Faith That Moves Mountains',
                content: 'Understanding the power of faith and how to apply it in challenging circumstances. Biblical examples of mountain-moving faith.',
                category: 'sermons',
                type: 'Sermon',
                url: 'sermons.html',
                author: 'Pastor Emmanuel',
                date: '2024-05-28',
                tags: ['faith', 'miracles', 'prayer', 'breakthrough']
            },
            
            // Events
            {
                id: 'event-1',
                title: 'Sunday Worship Service',
                content: 'Join us every Sunday at 9:00 AM for inspiring worship, powerful preaching, and fellowship with our church family.',
                category: 'events',
                type: 'Weekly Event',
                url: 'events.html',
                date: '2024-12-08',
                tags: ['worship', 'sunday service', 'fellowship', 'preaching']
            },
            {
                id: 'event-2',
                title: 'Bible Study',
                content: 'Interactive Bible study sessions every Tuesday at 6:30 PM. Dive deeper into God\'s Word with discussion and fellowship.',
                category: 'events',
                type: 'Weekly Event',
                url: 'events.html',
                date: '2024-12-10',
                tags: ['bible study', 'tuesday', 'learning', 'discussion']
            },
            {
                id: 'event-3',
                title: 'Prayer Meeting',
                content: 'Corporate prayer and worship every Friday at 6:30 PM. Come together for powerful prayer and spiritual breakthrough.',
                category: 'events',
                type: 'Weekly Event',
                url: 'events.html',
                date: '2024-12-13',
                tags: ['prayer', 'friday', 'worship', 'breakthrough']
            },
            {
                id: 'event-4',
                title: 'Christmas Concert',
                content: 'Annual Christmas concert featuring our choir and worship team. An evening of worship and celebration of Christ\'s birth.',
                category: 'events',
                type: 'Special Event',
                url: 'events.html',
                date: '2024-12-22',
                tags: ['christmas', 'concert', 'choir', 'celebration']
            },
            {
                id: 'event-5',
                title: 'Youth Camp 2025',
                content: 'Three-day youth camp for ages 13-25. Activities, worship, teaching, and fellowship for young people.',
                category: 'events',
                type: 'Special Event',
                url: 'events.html',
                date: '2025-01-15',
                tags: ['youth', 'camp', 'fellowship', 'activities']
            },
            
            // Ministries
            {
                id: 'ministry-1',
                title: 'Worship & Arts Ministry',
                content: 'Lead the congregation into God\'s presence through music and creative arts. Join our choir, band, or creative arts team.',
                category: 'ministries',
                type: 'Ministry',
                url: 'ministries.html',
                tags: ['worship', 'music', 'arts', 'choir', 'band']
            },
            {
                id: 'ministry-2',
                title: 'Youth Ministry',
                content: 'Engaging young people with relevant biblical teaching and community. Programs for teens and young adults.',
                category: 'ministries',
                type: 'Ministry',
                url: 'ministries.html',
                tags: ['youth', 'teens', 'young adults', 'community']
            },
            {
                id: 'ministry-3',
                title: 'Children\'s Church',
                content: 'A fun, safe environment where kids learn about Jesus through age-appropriate lessons, games, and activities.',
                category: 'ministries',
                type: 'Ministry',
                url: 'ministries.html',
                tags: ['children', 'kids', 'sunday school', 'education']
            },
            {
                id: 'ministry-4',
                title: 'Community Outreach',
                content: 'Share God\'s love through community service and evangelism. Food programs, clothing drives, and community events.',
                category: 'ministries',
                type: 'Ministry',
                url: 'ministries.html',
                tags: ['outreach', 'community', 'service', 'evangelism']
            },
            {
                id: 'ministry-5',
                title: 'Women\'s Ministry',
                content: 'Empowering women through Bible study, fellowship, and service opportunities. Monthly meetings and special events.',
                category: 'ministries',
                type: 'Ministry',
                url: 'ministries.html',
                tags: ['women', 'fellowship', 'bible study', 'empowerment']
            },
            
            // Blog/News
            {
                id: 'blog-1',
                title: 'Preparing Our Hearts for Christmas',
                content: 'As we approach the Christmas season, it\'s important to prepare our hearts for the true meaning of Christ\'s birth.',
                category: 'blog',
                type: 'Blog Post',
                url: 'blog.html',
                author: 'Pastor Emmanuel',
                date: '2024-12-01',
                tags: ['christmas', 'preparation', 'advent', 'reflection']
            },
            {
                id: 'blog-2',
                title: 'Youth Ministry Reaches New Heights',
                content: 'Our youth ministry has grown tremendously this year, with over 50 young people actively participating in weekly programs.',
                category: 'blog',
                type: 'News',
                url: 'blog.html',
                author: 'Minister Sarah',
                date: '2024-11-28',
                tags: ['youth ministry', 'growth', 'programs', 'success']
            },
            {
                id: 'blog-3',
                title: 'Thanksgiving Food Drive Success',
                content: 'Thanks to your generous donations, we were able to provide Thanksgiving meals to over 100 families in our community.',
                category: 'blog',
                type: 'News',
                url: 'blog.html',
                date: '2024-11-25',
                tags: ['thanksgiving', 'food drive', 'community', 'generosity']
            },
            
            // Pages
            {
                id: 'page-1',
                title: 'About Our Church',
                content: 'Learn about The Ekklesia Zion Embassy\'s history, mission, vision, beliefs, and leadership. Our journey of faith in Gezina.',
                category: 'pages',
                type: 'Page',
                url: 'about.html',
                tags: ['about', 'history', 'mission', 'vision', 'beliefs', 'leadership']
            },
            {
                id: 'page-2',
                title: 'Contact Us',
                content: 'Get in touch with The Ekklesia Zion Embassy. Find our location, service times, contact information, and send us a message.',
                category: 'pages',
                type: 'Page',
                url: 'contact.html',
                tags: ['contact', 'location', 'service times', 'phone', 'email']
            },
            {
                id: 'page-3',
                title: 'Give Generously',
                content: 'Support The Ekklesia Zion Embassy through your generous giving. Learn about tithing, offerings, and special projects.',
                category: 'pages',
                type: 'Page',
                url: 'give.html',
                tags: ['giving', 'tithe', 'offering', 'donation', 'support']
            }
        ];
    }

    // Setup event listeners
    setupEventListeners() {
        const searchInput = document.getElementById('main-search-input');
        const filterOptions = document.querySelectorAll('.filter-option');
        const suggestionItems = document.querySelectorAll('.suggestion-item');
        const clearHistoryBtn = document.getElementById('clear-history');

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length > 0) {
                    searchTimeout = setTimeout(() => {
                        this.performSearch(query);
                    }, 300);
                } else {
                    this.clearResults();
                    this.displaySearchHistory();
                }
            });

            // Handle Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query.length > 0) {
                        this.performSearch(query);
                    }
                }
            });
        }

        // Filter options
        filterOptions.forEach(option => {
            option.addEventListener('click', () => {
                const filterType = option.dataset.filter || option.dataset.date;
                const filterCategory = option.dataset.filter ? 'type' : 'date';
                
                // Update active state
                option.parentElement.querySelectorAll('.filter-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
                
                // Update current filters
                this.currentFilters[filterCategory] = filterType;
                
                // Re-run search if there's a query
                const currentQuery = searchInput?.value.trim();
                if (currentQuery) {
                    this.performSearch(currentQuery);
                }
            });
        });

        // Suggestion items
        suggestionItems.forEach(item => {
            item.addEventListener('click', () => {
                const suggestion = item.dataset.suggestion;
                if (searchInput) {
                    searchInput.value = suggestion;
                    this.performSearch(suggestion);
                }
            });
        });

        // Clear history
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.clearSearchHistory();
            });
        }
    }

    // Handle URL parameters
    handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const searchInput = document.getElementById('main-search-input');
        
        if (query && searchInput) {
            searchInput.value = query;
            this.performSearch(query);
        } else {
            this.displaySearchHistory();
        }
    }

    // Perform search
    async performSearch(query) {
        if (!query || query.length < 1) return;
        
        // Add to search history
        this.addToSearchHistory(query);
        
        // Show loading
        this.showLoading();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter results
        const results = this.filterResults(query);
        
        // Display results
        this.displayResults(results, query);
        
        // Hide loading
        this.hideLoading();
    }

    // Filter search results
    filterResults(query) {
        const queryLower = query.toLowerCase();
        
        let results = this.searchData.filter(item => {
            // Text matching
            const titleMatch = item.title.toLowerCase().includes(queryLower);
            const contentMatch = item.content.toLowerCase().includes(queryLower);
            const authorMatch = item.author?.toLowerCase().includes(queryLower) || false;
            const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(queryLower)) || false;
            
            const textMatch = titleMatch || contentMatch || authorMatch || tagsMatch;
            
            // Type filter
            const typeMatch = this.currentFilters.type === 'all' || item.category === this.currentFilters.type;
            
            // Date filter
            const dateMatch = this.filterByDate(item.date);
            
            return textMatch && typeMatch && dateMatch;
        });

        // Sort by relevance
        results = results.sort((a, b) => {
            const aScore = this.calculateRelevanceScore(a, queryLower);
            const bScore = this.calculateRelevanceScore(b, queryLower);
            return bScore - aScore;
        });

        return results;
    }

    // Calculate relevance score
    calculateRelevanceScore(item, query) {
        let score = 0;
        
        // Title matches are most important
        if (item.title.toLowerCase().includes(query)) {
            score += 10;
            if (item.title.toLowerCase().startsWith(query)) {
                score += 5;
            }
        }
        
        // Content matches
        const contentMatches = (item.content.toLowerCase().match(new RegExp(query, 'g')) || []).length;
        score += contentMatches * 2;
        
        // Author matches
        if (item.author?.toLowerCase().includes(query)) {
            score += 3;
        }
        
        // Tag matches
        const tagMatches = item.tags?.filter(tag => tag.toLowerCase().includes(query)).length || 0;
        score += tagMatches * 4;
        
        // Recent content gets slight boost
        if (item.date) {
            const itemDate = new Date(item.date);
            const now = new Date();
            const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24);
            if (daysDiff < 30) score += 1;
        }
        
        return score;
    }

    // Filter by date
    filterByDate(itemDate) {
        if (this.currentFilters.date === 'all' || !itemDate) return true;
        
        const now = new Date();
        const date = new Date(itemDate);
        const diffTime = now - date;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        switch (this.currentFilters.date) {
            case 'week':
                return diffDays <= 7;
            case 'month':
                return diffDays <= 30;
            case 'year':
                return diffDays <= 365;
            default:
                return true;
        }
    }

    // Display search results
    displayResults(results, query) {
        const resultsContainer = document.getElementById('search-results-container');
        const resultsList = document.getElementById('search-results-list');
        const statsElement = document.getElementById('search-stats');
        const noResultsElement = document.getElementById('no-results');
        const historySection = document.getElementById('search-history-section');
        
        // Hide search history
        if (historySection) {
            historySection.style.display = 'none';
        }
        
        if (results.length === 0) {
            // Show no results
            resultsContainer.style.display = 'none';
            noResultsElement.style.display = 'block';
        } else {
            // Show results
            noResultsElement.style.display = 'none';
            resultsContainer.style.display = 'block';
            
            // Update stats
            if (statsElement) {
                const resultText = results.length === 1 ? 'result' : 'results';
                statsElement.textContent = `Found ${results.length} ${resultText} for "${query}"`;
            }
            
            // Render results
            if (resultsList) {
                resultsList.innerHTML = results.map(result => this.renderSearchResult(result, query)).join('');
            }
        }
    }

    // Render individual search result
    renderSearchResult(result, query) {
        const highlightedTitle = this.highlightText(result.title, query);
        const highlightedContent = this.highlightText(this.truncateText(result.content, 150), query);
        const date = result.date ? new Date(result.date).toLocaleDateString() : '';
        
        return `
            <div class="search-result-item">
                <div class="result-title">
                    <a href="${result.url}" onclick="this.trackResultClick('${result.id}', '${query}')">${highlightedTitle}</a>
                </div>
                <div class="result-meta">
                    <span class="result-category">${result.type}</span>
                    ${result.author ? `<span><i class="fas fa-user"></i> ${result.author}</span>` : ''}
                    ${date ? `<span><i class="fas fa-calendar"></i> ${date}</span>` : ''}
                </div>
                <div class="result-excerpt">${highlightedContent}</div>
            </div>
        `;
    }

    // Highlight search terms in text
    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: var(--secondary); color: var(--primary); padding: 0 2px; border-radius: 2px;">$1</mark>');
    }

    // Truncate text
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    // Show loading state
    showLoading() {
        const loadingSpinner = document.getElementById('loading-spinner');
        const resultsContainer = document.getElementById('search-results-container');
        const noResultsElement = document.getElementById('no-results');
        
        if (loadingSpinner) loadingSpinner.classList.add('active');
        if (resultsContainer) resultsContainer.style.display = 'none';
        if (noResultsElement) noResultsElement.style.display = 'none';
    }

    // Hide loading state
    hideLoading() {
        const loadingSpinner = document.getElementById('loading-spinner');
        if (loadingSpinner) loadingSpinner.classList.remove('active');
    }

    // Clear results
    clearResults() {
        const resultsContainer = document.getElementById('search-results-container');
        const noResultsElement = document.getElementById('no-results');
        
        if (resultsContainer) resultsContainer.style.display = 'none';
        if (noResultsElement) noResultsElement.style.display = 'none';
    }

    // Search history management
    addToSearchHistory(query) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item.query !== query);
        
        // Add to beginning
        this.searchHistory.unshift({
            query: query,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10 searches
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
    }

    displaySearchHistory() {
        const historySection = document.getElementById('search-history-section');
        const historyList = document.getElementById('search-history-list');
        
        if (!historyList || this.searchHistory.length === 0) {
            if (historySection) historySection.style.display = 'none';
            return;
        }
        
        if (historySection) historySection.style.display = 'block';
        
        historyList.innerHTML = this.searchHistory.map(item => `
            <div class="history-item" onclick="searchEngine.searchFromHistory('${item.query}')">
                <span><i class="fas fa-history mr-2"></i>${item.query}</span>
                <span class="history-remove" onclick="event.stopPropagation(); searchEngine.removeFromHistory('${item.query}')">
                    <i class="fas fa-times"></i>
                </span>
            </div>
        `).join('');
    }

    searchFromHistory(query) {
        const searchInput = document.getElementById('main-search-input');
        if (searchInput) {
            searchInput.value = query;
            this.performSearch(query);
        }
    }

    removeFromHistory(query) {
        this.searchHistory = this.searchHistory.filter(item => item.query !== query);
        localStorage.setItem('search_history', JSON.stringify(this.searchHistory));
        this.displaySearchHistory();
    }

    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('search_history');
        this.displaySearchHistory();
    }

    // Track result clicks (for analytics)
    trackResultClick(resultId, query) {
        console.log(`Result clicked: ${resultId} for query: ${query}`);
        // Here you could send analytics data to your server
    }
}

// Initialize search engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('main-search-input')) {
        window.searchEngine = new SearchEngine();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchEngine;
}