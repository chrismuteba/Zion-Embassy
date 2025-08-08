// Contentful CMS Integration
// Handles all content management operations for the church website

class ContentfulClient {
    constructor(spaceId, accessToken, previewToken = null) {
        this.spaceId = spaceId;
        this.accessToken = accessToken;
        this.previewToken = previewToken;
        this.baseUrl = 'https://cdn.contentful.com';
        this.previewUrl = 'https://preview.contentful.com';
        this.managementUrl = 'https://api.contentful.com';
        this.isPreview = false;
    }

    // Initialize Contentful client
    async init() {
        try {
            await this.testConnection();
            console.log('✅ Contentful connected successfully');
            return true;
        } catch (error) {
            console.error('❌ Contentful connection failed:', error);
            return false;
        }
    }

    // Test connection to Contentful
    async testConnection() {
        const response = await this.makeRequest('/spaces/' + this.spaceId);
        if (!response.sys) {
            throw new Error('Invalid Contentful configuration');
        }
        return response;
    }

    // Make API request to Contentful
    async makeRequest(endpoint, options = {}) {
        const baseUrl = this.isPreview ? this.previewUrl : this.baseUrl;
        const token = this.isPreview ? this.previewToken : this.accessToken;
        
        const url = `${baseUrl}${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    // Get all entries of a specific content type
    async getEntries(contentType, options = {}) {
        const params = new URLSearchParams({
            content_type: contentType,
            include: 2,
            order: '-sys.createdAt',
            ...options
        });

        const response = await this.makeRequest(`/spaces/${this.spaceId}/entries?${params}`);
        return this.processEntries(response);
    }

    // Get a single entry by ID
    async getEntry(entryId) {
        const response = await this.makeRequest(`/spaces/${this.spaceId}/entries/${entryId}`);
        return this.processEntry(response);
    }

    // Process entries response
    processEntries(response) {
        if (!response.items) return [];
        
        return response.items.map(item => this.processEntry(item, response.includes));
    }

    // Process single entry
    processEntry(entry, includes = {}) {
        if (!entry.fields) return entry;

        const processedEntry = {
            id: entry.sys.id,
            createdAt: entry.sys.createdAt,
            updatedAt: entry.sys.updatedAt,
            contentType: entry.sys.contentType?.sys?.id,
            ...entry.fields
        };

        // Process linked assets and entries
        Object.keys(processedEntry).forEach(key => {
            const field = processedEntry[key];
            if (field && field.sys) {
                if (field.sys.type === 'Link' && field.sys.linkType === 'Asset') {
                    processedEntry[key] = this.processAsset(field, includes);
                } else if (field.sys.type === 'Link' && field.sys.linkType === 'Entry') {
                    processedEntry[key] = this.processLinkedEntry(field, includes);
                }
            } else if (Array.isArray(field)) {
                processedEntry[key] = field.map(item => {
                    if (item && item.sys) {
                        if (item.sys.type === 'Link' && item.sys.linkType === 'Asset') {
                            return this.processAsset(item, includes);
                        } else if (item.sys.type === 'Link' && item.sys.linkType === 'Entry') {
                            return this.processLinkedEntry(item, includes);
                        }
                    }
                    return item;
                });
            }
        });

        return processedEntry;
    }

    // Process asset links
    processAsset(assetLink, includes = {}) {
        if (!includes.Asset) return assetLink;
        
        const asset = includes.Asset.find(a => a.sys.id === assetLink.sys.id);
        if (!asset || !asset.fields) return assetLink;

        return {
            id: asset.sys.id,
            title: asset.fields.title,
            description: asset.fields.description,
            url: asset.fields.file?.url ? `https:${asset.fields.file.url}` : null,
            contentType: asset.fields.file?.contentType,
            size: asset.fields.file?.details?.size,
            width: asset.fields.file?.details?.image?.width,
            height: asset.fields.file?.details?.image?.height
        };
    }

    // Process linked entries
    processLinkedEntry(entryLink, includes = {}) {
        if (!includes.Entry) return entryLink;
        
        const entry = includes.Entry.find(e => e.sys.id === entryLink.sys.id);
        if (!entry) return entryLink;

        return this.processEntry(entry, includes);
    }

    // Content-specific methods

    // Get all events
    async getEvents(limit = 50) {
        return await this.getEntries('event', {
            limit,
            order: 'fields.startDate'
        });
    }

    // Get upcoming events
    async getUpcomingEvents(limit = 10) {
        const now = new Date().toISOString();
        return await this.getEntries('event', {
            limit,
            'fields.startDate[gte]': now,
            order: 'fields.startDate'
        });
    }

    // Get all projects
    async getProjects(limit = 50) {
        return await this.getEntries('project', {
            limit,
            order: '-fields.priority,fields.targetDate'
        });
    }

    // Get active projects
    async getActiveProjects(limit = 10) {
        return await this.getEntries('project', {
            limit,
            'fields.status': 'active',
            order: '-fields.priority,fields.targetDate'
        });
    }

    // Get all blog posts
    async getBlogPosts(limit = 20) {
        return await this.getEntries('blogPost', {
            limit,
            order: '-fields.publishDate'
        });
    }

    // Get published blog posts
    async getPublishedBlogPosts(limit = 10) {
        return await this.getEntries('blogPost', {
            limit,
            'fields.published': true,
            order: '-fields.publishDate'
        });
    }

    // Get featured blog posts
    async getFeaturedBlogPosts(limit = 3) {
        return await this.getEntries('blogPost', {
            limit,
            'fields.featured': true,
            'fields.published': true,
            order: '-fields.publishDate'
        });
    }

    // Get sermons (if managed in Contentful)
    async getSermons(limit = 20) {
        return await this.getEntries('sermon', {
            limit,
            order: '-fields.date'
        });
    }

    // Search content
    async searchContent(query, contentTypes = ['blogPost', 'event', 'project']) {
        const results = [];
        
        for (const contentType of contentTypes) {
            try {
                const entries = await this.getEntries(contentType, {
                    query,
                    limit: 10
                });
                results.push(...entries.map(entry => ({
                    ...entry,
                    contentType
                })));
            } catch (error) {
                console.warn(`Search failed for ${contentType}:`, error);
            }
        }

        return results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    // Rich text processing
    processRichText(richTextContent) {
        if (!richTextContent || !richTextContent.content) {
            return '';
        }

        return this.renderRichTextNodes(richTextContent.content);
    }

    renderRichTextNodes(nodes) {
        return nodes.map(node => this.renderRichTextNode(node)).join('');
    }

    renderRichTextNode(node) {
        if (node.nodeType === 'text') {
            let text = node.value;
            
            // Apply marks (bold, italic, etc.)
            if (node.marks) {
                node.marks.forEach(mark => {
                    switch (mark.type) {
                        case 'bold':
                            text = `<strong>${text}</strong>`;
                            break;
                        case 'italic':
                            text = `<em>${text}</em>`;
                            break;
                        case 'underline':
                            text = `<u>${text}</u>`;
                            break;
                        case 'code':
                            text = `<code>${text}</code>`;
                            break;
                    }
                });
            }
            
            return text;
        }

        const content = node.content ? this.renderRichTextNodes(node.content) : '';

        switch (node.nodeType) {
            case 'paragraph':
                return `<p>${content}</p>`;
            case 'heading-1':
                return `<h1>${content}</h1>`;
            case 'heading-2':
                return `<h2>${content}</h2>`;
            case 'heading-3':
                return `<h3>${content}</h3>`;
            case 'heading-4':
                return `<h4>${content}</h4>`;
            case 'heading-5':
                return `<h5>${content}</h5>`;
            case 'heading-6':
                return `<h6>${content}</h6>`;
            case 'unordered-list':
                return `<ul>${content}</ul>`;
            case 'ordered-list':
                return `<ol>${content}</ol>`;
            case 'list-item':
                return `<li>${content}</li>`;
            case 'blockquote':
                return `<blockquote>${content}</blockquote>`;
            case 'hr':
                return '<hr>';
            case 'hyperlink':
                const uri = node.data?.uri || '#';
                return `<a href="${uri}" target="_blank" rel="noopener">${content}</a>`;
            case 'embedded-asset-block':
                return this.renderEmbeddedAsset(node);
            case 'embedded-entry-block':
                return this.renderEmbeddedEntry(node);
            default:
                return content;
        }
    }

    renderEmbeddedAsset(node) {
        // This would need the asset data from includes
        return `<div class="embedded-asset">[Asset: ${node.data?.target?.sys?.id}]</div>`;
    }

    renderEmbeddedEntry(node) {
        // This would need the entry data from includes
        return `<div class="embedded-entry">[Entry: ${node.data?.target?.sys?.id}]</div>`;
    }

    // Utility methods
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Error handling
    handleError(error, context = '') {
        console.error(`Contentful error ${context}:`, error);
        
        if (error.message.includes('401')) {
            throw new Error('Invalid Contentful access token');
        } else if (error.message.includes('404')) {
            throw new Error('Contentful space or content not found');
        } else if (error.message.includes('429')) {
            throw new Error('Contentful API rate limit exceeded');
        } else {
            throw new Error(`Contentful API error: ${error.message}`);
        }
    }
}

// Export for use in other files
window.ContentfulClient = ContentfulClient;