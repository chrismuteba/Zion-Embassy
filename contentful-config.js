// Contentful Configuration
// Replace the placeholder values with your actual Contentful credentials

const CONTENTFUL_CONFIG = {
    spaceId: 'your_space_id_here',        // Replace with your Space ID from Contentful
    accessToken: 'your_access_token_here'  // Replace with your Content Delivery API access token
};

// Initialize Contentful client when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create a new instance of the ContentfulClient
        const contentfulClient = new ContentfulClient(
            CONTENTFUL_CONFIG.spaceId,
            CONTENTFUL_CONFIG.accessToken
        );
        
        // Initialize the client
        const connected = await contentfulClient.init();
        
        if (connected) {
            console.log('✅ Connected to Contentful successfully');
            
            // Make the client available globally
            window.contentfulClient = contentfulClient;
            
            // Dispatch an event that other scripts can listen for
            document.dispatchEvent(new CustomEvent('contentful:ready', {
                detail: { client: contentfulClient }
            }));
        } else {
            console.error('❌ Failed to connect to Contentful');
        }
    } catch (error) {
        console.error('❌ Error initializing Contentful:', error);
    }
});