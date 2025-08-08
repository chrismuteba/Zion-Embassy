# Contentful CMS Setup Guide
## The Ekklesia Zion Embassy Website

This guide will help you set up Contentful CMS for your church website to manage events, projects, blog posts, and other content with multiple administrators.

## What You'll Get with Contentful

### ✅ **Content Management**
- **Blog/News Posts**: Rich text editor with images
- **Events**: Full event management with registration tracking
- **Projects**: Fundraising project management
- **Sermons**: Metadata for YouTube videos (titles, descriptions, series)
- **Multi-Admin**: Multiple staff members can manage content

### ✅ **Professional Features**
- **Rich Text Editor**: Format posts like Microsoft Word
- **Image Management**: Upload and organize photos
- **Content Scheduling**: Publish posts at specific times
- **Version History**: See all changes and revert if needed
- **Mobile App**: Manage content from phones/tablets

## Step-by-Step Setup

### Step 1: Create Contentful Account (5 minutes)

1. **Go to Contentful**
   - Visit: https://www.contentful.com
   - Click "Start building for free"

2. **Sign Up**
   - Use church email address
   - Choose "Content Creator" role
   - Create organization: "Zion Embassy"

3. **Create Space**
   - Space name: "Zion Embassy Website"
   - Choose "Empty space"

### Step 2: Get API Keys (2 minutes)

1. **Go to Settings**
   - In Contentful dashboard, click "Settings" → "API keys"

2. **Create API Key**
   - Click "Add API key"
   - Name: "Website Integration"
   - Copy these values:
     - **Space ID**: `abc123def456` (example)
     - **Content Delivery API - access token**: `xyz789uvw012` (example)

### Step 3: Create Content Models (10 minutes)

Content models define the structure of your content. Create these models:

#### **Blog Post Model**
1. Go to "Content model" → "Add content type"
2. Name: "Blog Post", API Identifier: "blogPost"
3. Add these fields:

| Field Name | Field ID | Type | Required | Help Text |
|------------|----------|------|----------|-----------|
| Title | title | Short text | Yes | Blog post title |
| Slug | slug | Short text | Yes | URL-friendly version (auto-generated) |
| Author | author | Short text | Yes | Who wrote this post |
| Publish Date | publishDate | Date & time | Yes | When to publish |
| Featured Image | featuredImage | Media | No | Main image for the post |
| Excerpt | excerpt | Long text | No | Short description (150 chars) |
| Content | content | Rich text | Yes | Main blog post content |
| Tags | tags | Short text, list | No | Categories/topics |
| Published | published | Boolean | Yes | Is this post live? |
| Featured | featured | Boolean | No | Show on homepage? |

#### **Event Model**
1. Add content type: "Event", API Identifier: "event"
2. Add these fields:

| Field Name | Field ID | Type | Required | Help Text |
|------------|----------|------|----------|-----------|
| Title | title | Short text | Yes | Event name |
| Description | description | Rich text | Yes | Event details |
| Start Date | startDate | Date & time | Yes | When event starts |
| End Date | endDate | Date & time | No | When event ends |
| Location | location | Short text | No | Where is the event |
| Category | category | Short text | Yes | worship, youth, family, special, outreach |
| Featured Image | featuredImage | Media | No | Event photo |
| Registration Required | registrationRequired | Boolean | No | Need to register? |
| Max Attendees | maxAttendees | Number | No | Capacity limit |
| Registration Fee | registrationFee | Number | No | Cost to attend |
| Status | status | Short text | Yes | draft, active, completed |

#### **Project Model**
1. Add content type: "Project", API Identifier: "project"
2. Add these fields:

| Field Name | Field ID | Type | Required | Help Text |
|------------|----------|------|----------|-----------|
| Title | title | Short text | Yes | Project name |
| Description | description | Rich text | Yes | Project details |
| Funding Goal | fundingGoal | Number | Yes | Target amount |
| Current Amount | currentAmount | Number | No | Amount raised so far |
| Target Date | targetDate | Date | No | Completion deadline |
| Category | category | Short text | Yes | building, ministry, outreach, equipment, missions |
| Featured Image | featuredImage | Media | No | Project photo |
| Is Urgent | isUrgent | Boolean | No | Priority project? |
| Status | status | Short text | Yes | active, completed, paused |

#### **Sermon Model** (Optional - for YouTube metadata)
1. Add content type: "Sermon", API Identifier: "sermon"
2. Add these fields:

| Field Name | Field ID | Type | Required | Help Text |
|------------|----------|------|----------|-----------|
| Title | title | Short text | Yes | Sermon title |
| Preacher | preacher | Short text | Yes | Who preached |
| Date | date | Date | Yes | Service date |
| YouTube Video ID | youtubeVideoId | Short text | Yes | Video ID from YouTube URL |
| Scripture | scripture | Short text | No | Bible passage |
| Series | series | Short text | No | Sermon series name |
| Description | description | Long text | No | Sermon summary |
| Tags | tags | Short text, list | No | Topics covered |

### Step 4: Configure Website (5 minutes)

1. **Update Configuration**
   - Open your website files
   - Find `js/contentful-config.js` (will be created)
   - Add your Contentful credentials:

```javascript
const CONTENTFUL_CONFIG = {
    spaceId: 'your_space_id_here',
    accessToken: 'your_access_token_here'
};
```

2. **Test Connection**
   - Open admin dashboard
   - Check if Contentful data loads
   - Create test blog post

### Step 5: Add Team Members (2 minutes)

1. **Invite Users**
   - Go to Settings → Members
   - Click "Invite users"
   - Add email addresses for:
     - Pastor
     - Secretary
     - Communications team

2. **Set Permissions**
   - **Admin**: Full access to everything
   - **Editor**: Can create/edit content
   - **Author**: Can create content, edit own posts

## Content Management Workflow

### Creating Blog Posts
1. **Login to Contentful**
   - Go to contentful.com
   - Login with your account

2. **Create New Post**
   - Click "Content" → "Add entry" → "Blog Post"
   - Fill in all fields
   - Upload featured image
   - Write content with rich text editor

3. **Publish**
   - Set "Published" to true
   - Click "Publish"
   - Post appears on website automatically

### Managing Events
1. **Create Event**
   - Content → Add entry → Event
   - Set dates, location, category
   - Upload event image
   - Set registration requirements

2. **Track Registrations**
   - View in admin dashboard
   - Monitor capacity vs registrations

### Managing Projects
1. **Create Project**
   - Content → Add entry → Project
   - Set funding goal and deadline
   - Upload project images
   - Mark as urgent if needed

2. **Update Progress**
   - Edit "Current Amount" as donations come in
   - Update status when completed

## Advanced Features

### Content Scheduling
- Set future publish dates
- Posts go live automatically
- Perfect for announcements

### Rich Text Features
- **Bold**, *italic*, underline text
- Headers and subheaders
- Bullet points and numbered lists
- Links to other pages
- Embedded images and videos
- Blockquotes for Bible verses

### Image Management
- Upload multiple sizes automatically
- Automatic optimization for web
- Alt text for accessibility
- Organize in folders

### Mobile Management
- Download Contentful mobile app
- Create/edit posts from phone
- Upload photos directly
- Perfect for event updates

## Troubleshooting

### Common Issues

**1. "Space not found" error**
- Check Space ID is correct
- Ensure space is not deleted

**2. "Access token invalid" error**
- Verify access token is copied correctly
- Check token hasn't expired

**3. Content not showing on website**
- Ensure content is published (not draft)
- Check "Published" field is set to true
- Verify content model fields match code

**4. Images not loading**
- Check image is uploaded to Contentful
- Verify image field is filled
- Ensure image is published

### Getting Help
- Contentful documentation: https://www.contentful.com/developers/docs/
- Contentful support: Available in dashboard
- Church website administrator

## Cost Information

### Free Tier (Perfect for Churches)
- **25,000 records**: Enough for years of content
- **3 users**: Pastor, Secretary, Communications
- **Unlimited API calls**: No usage limits
- **2 locales**: English + another language
- **Community support**

### Paid Plans (If Needed Later)
- **Team Plan**: $489/month (10 users, 100k records)
- **Enterprise**: Custom pricing

**Recommendation**: Start with free tier - it's more than enough for most churches.

## Security Best Practices

### API Key Security
1. **Never share access tokens publicly**
2. **Use environment variables in production**
3. **Regenerate tokens if compromised**
4. **Monitor API usage in dashboard**

### User Management
1. **Remove users who leave the team**
2. **Use appropriate permission levels**
3. **Regular access reviews**
4. **Strong passwords required**

## Content Strategy Tips

### Blog Posts
- **Weekly updates**: Service highlights, announcements
- **Event recaps**: Photos and stories from events
- **Teaching series**: Supplement sermons with articles
- **Community spotlights**: Member testimonies

### Events
- **Plan ahead**: Create events 2-4 weeks early
- **Clear descriptions**: What, when, where, why
- **Registration deadlines**: Set cutoff dates
- **Follow-up posts**: Recap and photos after events

### Projects
- **Compelling stories**: Why this project matters
- **Regular updates**: Progress reports and milestones
- **Thank donors**: Recognition and gratitude posts
- **Visual progress**: Photos of work being done

## Next Steps After Setup

1. ✅ **Create first blog post**
2. ✅ **Add upcoming events**
3. ✅ **Set up current projects**
4. ✅ **Train team members**
5. ✅ **Establish content calendar**
6. ✅ **Monitor analytics**

## Integration with YouTube

Your website will have **both**:
- ✅ **YouTube integration**: Automatic sermon updates
- ✅ **Contentful sermons**: Enhanced metadata and organization

**Best of both worlds**:
- Sermons automatically appear from YouTube
- Additional details managed in Contentful
- Rich descriptions and series organization
- Search and filtering capabilities

---

**Ready to get started?** Follow this guide step-by-step, and you'll have a professional content management system running in under 30 minutes!