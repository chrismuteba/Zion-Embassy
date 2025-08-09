# YouTube Integration Setup Guide
## The Ekklesia Zion Embassy Website

This guide will help you set up YouTube integration for your church website to automatically display sermons from your YouTube channel.

## Overview

The website now includes YouTube API integration that will:
- ✅ Automatically fetch sermons from your YouTube channel
- ✅ Display live stream notifications when you're broadcasting
- ✅ Allow visitors to watch sermons directly or be redirected to YouTube
- ✅ Show video thumbnails, durations, and view counts
- ✅ Provide search and filtering capabilities
- ✅ Work on mobile and desktop devices

## Prerequisites

- A YouTube channel for your church
- A Google account with access to Google Cloud Console
- Basic understanding of editing HTML files

## Step-by-Step Setup

### Step 1: Get YouTube API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click "Select a project" at the top
   - Either create a new project or select an existing one
   - Name it something like "Zion Embassy Website"

3. **Enable YouTube Data API v3**
   - In the left sidebar, go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key (keep it secure!)

5. **Restrict API Key (Recommended)**
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your website domain (e.g., `yourdomain.com/*`)
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Save the changes

### Step 2: Find Your YouTube Channel ID

1. **Method 1: From YouTube Studio**
   - Go to YouTube Studio (studio.youtube.com)
   - Click "Settings" → "Channel" → "Advanced settings"
   - Copy the "Channel ID"

2. **Method 2: From Channel URL**
   - Go to your YouTube channel
   - Look at the URL - if it shows `/channel/UC...`, that's your Channel ID
   - If it shows `/c/channelname` or `/user/username`, use Method 1

3. **Method 3: Using YouTube API**
   - Go to: https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=YOUR_USERNAME&key=YOUR_API_KEY
   - Replace YOUR_USERNAME and YOUR_API_KEY with your values

### Step 3: Configure the Website

1. **Open sermons.html**
   - Find lines around 825-835 where it says:
   ```javascript
   const YOUTUBE_CONFIG = {
       API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
       CHANNEL_ID: 'YOUR_CHANNEL_ID_HERE'
   };
   ```

2. **Replace the placeholders**
   ```javascript
   const YOUTUBE_CONFIG = {
       API_KEY: 'AIzaSyC4K8B9X7Y2Z1A3B4C5D6E7F8G9H0I1J2K',  // Your actual API key
       CHANNEL_ID: 'UC1234567890abcdefghijklmnopqrstuvwxyz'     // Your actual channel ID
   };
   ```

3. **Save the file**

### Step 4: Test the Integration

1. **Open sermons.html in a browser**
2. **Check for errors**
   - Open browser developer tools (F12)
   - Look for any error messages in the console
3. **Verify functionality**
   - Sermons should load automatically
   - Search and filtering should work
   - Clicking sermons should redirect to YouTube

## Troubleshooting

### Common Issues

**1. "API key not valid" error**
- Check that you copied the API key correctly
- Ensure the YouTube Data API v3 is enabled
- Verify API key restrictions aren't blocking your domain

**2. "Channel not found" error**
- Double-check your Channel ID
- Make sure the channel is public
- Try using a different method to find the Channel ID

**3. "Quota exceeded" error**
- YouTube API has daily limits (10,000 requests/day for free)
- Consider caching results or reducing API calls
- For high-traffic sites, you may need to pay for additional quota

**4. No sermons showing**
- Check that your channel has public videos
- Ensure videos are not set to "Unlisted" or "Private"
- Try searching for videos with "sermon" or "message" in the title

### API Limits

- **Free quota**: 10,000 requests per day
- **Each sermon load**: ~2-3 API requests
- **Estimated capacity**: ~1,500-3,000 page loads per day
- **Live stream check**: 1 request every 5 minutes

### Security Best Practices

1. **Restrict your API key** to your domain only
2. **Don't commit API keys** to public repositories
3. **Monitor usage** in Google Cloud Console
4. **Set up billing alerts** to avoid unexpected charges

## Advanced Configuration

### Customizing Video Search

In `js/youtube-sermons.js`, you can modify the search query:

```javascript
// Current search (line ~47)
`q=sermon OR preaching OR message`

// Custom search examples
`q=sunday service`           // Only Sunday services
`q=pastor emmanuel`          // Only Pastor Emmanuel's videos
`q=-youth`                   // Exclude youth videos
```

### Adjusting Video Count

Change `maxResults` parameter (line ~51):

```javascript
`maxResults=20`  // Default: 20 videos
`maxResults=50`  // Maximum: 50 videos per request
```

### Live Stream Settings

Auto-refresh interval for live streams (line ~456):

```javascript
// Check every 5 minutes (default)
setInterval(() => {
    youtubeSermons.refresh();
}, 5 * 60 * 1000);

// Check every 2 minutes (more frequent)
setInterval(() => {
    youtubeSermons.refresh();
}, 2 * 60 * 1000);
```

## Content Management Options

### Option 1: Pure YouTube (Current Setup)
- ✅ Automatic updates
- ✅ No manual work
- ❌ Limited customization
- ❌ Dependent on YouTube

### Option 2: Hybrid (YouTube + Contentful)
- ✅ YouTube for videos
- ✅ Contentful for metadata
- ✅ Custom descriptions and tags
- ❌ More setup required

### Option 3: Manual Management
- ✅ Full control
- ✅ Custom organization
- ❌ Manual updates required
- ❌ More maintenance

## Support and Maintenance

### Regular Tasks
- Monitor API usage in Google Cloud Console
- Check for broken videos or API errors
- Update video search terms if needed
- Review and update API key restrictions

### Backup Plan
If YouTube integration fails:
1. The website will show setup instructions
2. Visitors can still access your YouTube channel directly
3. Static sermon content can be added manually

### Getting Help
- Google Cloud Console documentation
- YouTube Data API documentation
- Church website developer/administrator

## Cost Considerations

### Free Tier
- 10,000 API requests/day (free)
- Sufficient for most small-medium churches
- No additional costs

### Paid Usage
- $0.0001 per request after free quota
- ~$1 per 10,000 additional requests
- Set up billing alerts to monitor costs

## Next Steps

1. ✅ Complete the API setup
2. ✅ Test the integration
3. 🔄 Consider adding Contentful for enhanced content management
4. 🔄 Set up Google Analytics to track sermon views
5. 🔄 Add email notifications for new sermons
6. 🔄 Implement sermon series grouping
7. 🔄 Add sermon notes/transcripts download

---

**Need Help?** Contact your website administrator or developer for assistance with this setup.