// YouTube Sermons Integration
// Fetches sermons directly from YouTube channel

class YouTubeSermons {
    constructor(apiKey, channelId) {
        this.apiKey = apiKey;
        this.channelId = channelId;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
        this.sermons = [];
        this.isLive = false;
    }

    // Initialize the YouTube integration
    async init() {
        try {
            await this.checkForLiveStream();
            await this.loadSermons();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing YouTube sermons:', error);
            this.showError('Unable to load sermons. Please try again later.');
        }
    }

    // Check if there's a live stream
    async checkForLiveStream() {
        try {
            const response = await fetch(
                `${this.baseUrl}/search?` +
                `key=${this.apiKey}&` +
                `channelId=${this.channelId}&` +
                `part=snippet&` +
                `eventType=live&` +
                `type=video&` +
                `maxResults=1`
            );

            if (!response.ok) {
                throw new Error('Failed to check live stream');
            }

            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                this.showLiveBanner(data.items[0]);
                this.isLive = true;
            }
        } catch (error) {
            console.error('Error checking live stream:', error);
        }
    }

    // Load sermons from YouTube channel
    async loadSermons(maxResults = 20) {
        try {
            const response = await fetch(
                `${this.baseUrl}/search?` +
                `key=${this.apiKey}&` +
                `channelId=${this.channelId}&` +
                `part=snippet&` +
                `order=date&` +
                `maxResults=${maxResults}&` +
                `type=video&` +
                `q=sermon OR preaching OR message`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch sermons');
            }

            const data = await response.json();
            
            // Get additional video details
            const videoIds = data.items.map(item => item.id.videoId).join(',');
            const detailsResponse = await fetch(
                `${this.baseUrl}/videos?` +
                `key=${this.apiKey}&` +
                `id=${videoIds}&` +
                `part=contentDetails,statistics`
            );

            const detailsData = await detailsResponse.json();
            
            // Combine search results with video details
            this.sermons = data.items.map(item => {
                const details = detailsData.items.find(d => d.id === item.id.videoId);
                return {
                    ...item,
                    details: details || {}
                };
            });

            this.renderSermons();
        } catch (error) {
            console.error('Error loading sermons:', error);
            this.showError('Unable to load sermons from YouTube.');
        }
    }

    // Show live stream banner
    showLiveBanner(liveStream) {
        const existingBanner = document.querySelector('.live-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        const banner = document.createElement('div');
        banner.className = 'live-banner';
        banner.innerHTML = `
            <div class="live-content">
                <div class="live-indicator">
                    <span class="live-dot"></span>
                    <span class="live-text">LIVE NOW</span>
                </div>
                <div class="live-info">
                    <h3>${liveStream.snippet.title}</h3>
                    <p>Service is streaming live now!</p>
                </div>
                <a href="https://www.youtube.com/watch?v=${liveStream.id.videoId}" 
                   class="btn btn-secondary live-btn" target="_blank">
                    <i class="fab fa-youtube"></i>
                    Join Live Stream
                </a>
            </div>
        `;

        // Insert at the top of the page
        const header = document.querySelector('.header');
        if (header) {
            header.insertAdjacentElement('afterend', banner);
        }
    }

    // Render sermons grid
    renderSermons() {
        const sermonsGrid = document.getElementById('sermons-grid');
        if (!sermonsGrid) {
            console.error('Sermons grid container not found');
            return;
        }

        sermonsGrid.innerHTML = '';

        this.sermons.forEach(sermon => {
            const sermonCard = this.createSermonCard(sermon);
            sermonsGrid.appendChild(sermonCard);
        });

        // Update sermon count
        const countElement = document.getElementById('sermon-count');
        if (countElement) {
            countElement.textContent = `${this.sermons.length} sermons available`;
        }
    }

    // Create individual sermon card
    createSermonCard(sermon) {
        const card = document.createElement('div');
        card.className = 'sermon-card';
        
        const publishDate = new Date(sermon.snippet.publishedAt);
        const duration = this.parseDuration(sermon.details.contentDetails?.duration);
        const viewCount = this.formatNumber(sermon.details.statistics?.viewCount);

        card.innerHTML = `
            <div class="sermon-thumbnail">
                <img src="${sermon.snippet.thumbnails.medium.url}" 
                     alt="${sermon.snippet.title}"
                     loading="lazy">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
                ${duration ? `<div class="duration-badge">${duration}</div>` : ''}
            </div>
            <div class="sermon-content">
                <h3 class="sermon-title">${this.truncateText(sermon.snippet.title, 60)}</h3>
                <div class="sermon-meta">
                    <span class="sermon-date">
                        <i class="far fa-calendar"></i>
                        ${publishDate.toLocaleDateString()}
                    </span>
                    ${viewCount ? `
                        <span class="sermon-views">
                            <i class="far fa-eye"></i>
                            ${viewCount} views
                        </span>
                    ` : ''}
                </div>
                <p class="sermon-description">
                    ${this.truncateText(sermon.snippet.description, 120)}
                </p>
                <div class="sermon-actions">
                    <button class="btn btn-primary sermon-watch-btn" 
                            data-video-id="${sermon.id.videoId}"
                            data-title="${sermon.snippet.title}">
                        <i class="fas fa-play"></i>
                        Watch Sermon
                    </button>
                    <button class="btn btn-outline sermon-share-btn"
                            data-video-id="${sermon.id.videoId}"
                            data-title="${sermon.snippet.title}">
                        <i class="fas fa-share"></i>
                        Share
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Setup event listeners
    setupEventListeners() {
        // Watch sermon buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.sermon-watch-btn')) {
                const btn = e.target.closest('.sermon-watch-btn');
                const videoId = btn.dataset.videoId;
                const title = btn.dataset.title;
                this.openSermonModal(videoId, title);
            }
        });

        // Share sermon buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.sermon-share-btn')) {
                const btn = e.target.closest('.sermon-share-btn');
                const videoId = btn.dataset.videoId;
                const title = btn.dataset.title;
                this.shareSermon(videoId, title);
            }
        });

        // Search functionality
        const searchInput = document.getElementById('sermon-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterSermons(e.target.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filterByCategory(e.target.value);
            });
        }
    }

    // Open sermon in modal
    openSermonModal(videoId, title) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('sermon-modal');
        if (!modal) {
            modal = this.createSermonModal();
            document.body.appendChild(modal);
        }

        // Update modal content
        const iframe = modal.querySelector('#youtube-player');
        const titleElement = modal.querySelector('#sermon-title');
        const youtubeLink = modal.querySelector('#youtube-link');

        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        titleElement.textContent = title;
        youtubeLink.href = `https://www.youtube.com/watch?v=${videoId}`;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Create sermon modal
    createSermonModal() {
        const modal = document.createElement('div');
        modal.id = 'sermon-modal';
        modal.className = 'sermon-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="youtubeSermons.closeSermonModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="sermon-title">Sermon</h2>
                    <button class="modal-close" onclick="youtubeSermons.closeSermonModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="youtube-embed">
                        <iframe 
                            id="youtube-player"
                            width="100%" 
                            height="400"
                            src="" 
                            frameborder="0" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div class="sermon-actions">
                        <a id="youtube-link" class="btn btn-primary" target="_blank">
                            <i class="fab fa-youtube"></i> 
                            Watch on YouTube
                        </a>
                        <button class="btn btn-secondary" onclick="youtubeSermons.shareCurrentSermon()">
                            <i class="fas fa-share"></i> 
                            Share
                        </button>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    // Close sermon modal
    closeSermonModal() {
        const modal = document.getElementById('sermon-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Stop video playback
            const iframe = modal.querySelector('#youtube-player');
            iframe.src = '';
        }
    }

    // Share sermon
    shareSermon(videoId, title) {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const text = `Check out this sermon: "${title}"`;

        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: url
            });
        } else {
            // Fallback - copy to clipboard
            const shareText = `${text}\n${url}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Sermon link copied to clipboard!');
            }).catch(() => {
                // Further fallback
                prompt('Copy this link to share:', url);
            });
        }
    }

    // Share current sermon from modal
    shareCurrentSermon() {
        const modal = document.getElementById('sermon-modal');
        const title = modal.querySelector('#sermon-title').textContent;
        const url = modal.querySelector('#youtube-link').href;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this sermon: "${title}"`,
                url: url
            });
        } else {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Sermon link copied to clipboard!');
            });
        }
    }

    // Filter sermons by search term
    filterSermons(searchTerm) {
        const cards = document.querySelectorAll('.sermon-card');
        const term = searchTerm.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector('.sermon-title').textContent.toLowerCase();
            const description = card.querySelector('.sermon-description').textContent.toLowerCase();
            
            if (title.includes(term) || description.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Filter by category (based on keywords in title/description)
    filterByCategory(category) {
        const cards = document.querySelectorAll('.sermon-card');
        
        cards.forEach(card => {
            if (category === 'all') {
                card.style.display = 'block';
                return;
            }

            const title = card.querySelector('.sermon-title').textContent.toLowerCase();
            const description = card.querySelector('.sermon-description').textContent.toLowerCase();
            const content = title + ' ' + description;
            
            let shouldShow = false;
            
            switch (category) {
                case 'sunday':
                    shouldShow = content.includes('sunday') || content.includes('worship');
                    break;
                case 'series':
                    shouldShow = content.includes('series') || content.includes('part');
                    break;
                case 'special':
                    shouldShow = content.includes('special') || content.includes('event');
                    break;
                case 'youth':
                    shouldShow = content.includes('youth') || content.includes('young');
                    break;
            }
            
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    // Utility functions
    parseDuration(duration) {
        if (!duration) return null;
        
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        if (!match) return null;
        
        const hours = (match[1] || '').replace('H', '');
        const minutes = (match[2] || '').replace('M', '');
        const seconds = (match[3] || '').replace('S', '');
        
        if (hours) {
            return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
        } else {
            return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
        }
    }

    formatNumber(num) {
        if (!num) return null;
        
        const number = parseInt(num);
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'K';
        }
        return number.toString();
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        `;
        
        const sermonsGrid = document.getElementById('sermons-grid');
        if (sermonsGrid) {
            sermonsGrid.appendChild(errorDiv);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // Refresh sermons (useful for checking new uploads)
    async refresh() {
        await this.checkForLiveStream();
        await this.loadSermons();
    }
}

// Global instance
let youtubeSermons;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Replace these with your actual YouTube API key and Channel ID
    const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Get from Google Cloud Console
    const CHANNEL_ID = 'YOUR_CHANNEL_ID'; // Your church's YouTube channel ID
    
    // Initialize YouTube sermons
    youtubeSermons = new YouTubeSermons(YOUTUBE_API_KEY, CHANNEL_ID);
    youtubeSermons.init();
    
    // Auto-refresh every 5 minutes to check for new content
    setInterval(() => {
        youtubeSermons.refresh();
    }, 5 * 60 * 1000);
});