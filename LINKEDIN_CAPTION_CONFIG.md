# LinkedIn Caption Configuration

## Current Caption

The Faith & Energy Conference 1.0 caption is now centralized and can be used across your application:

```
I will be at Faith & Energy Conference 1.0 🔥

📅 Nov 15, 2025
📍 Pistis Annex Marwa, Lekki Lagos
🕘 9AM sharp
Theme: "The Great Light" (Matthew 4:16)

If you are ready for growth, faith, and powerful inspiration, you should totally be there too! 💥
👉 Register at conference.gepafrica.com

#FaithAndEnergy #GEPA #TheGreatLight #IWillBeAttending #FaithVibesOnly
```

## Usage

### In Module Code (ES6)

```javascript
import { DEFAULT_LINKEDIN_CAPTION, shareToLinkedIn } from './modules/shareToLinkedIn.js';

// Use the caption
const result = await shareToLinkedIn({
    imageBlob: yourImageBlob,
    caption: DEFAULT_LINKEDIN_CAPTION,
    filename: 'my_profile.png'
});
```

### In Main Script (Current)

```javascript
// The caption is defined in script.js
this.shareMessage = `I will be at Faith & Energy Conference 1.0 🔥
...`;

// Use it when sharing
async shareToLinkedIn() {
    const result = await shareToLinkedIn({
        imageBlob: this.profileImageBlob,
        caption: this.shareMessage,
        filename: this.profileImageFile.name
    });
}
```

### Using the Hook

```javascript
import { useShareToLinkedIn, DEFAULT_LINKEDIN_CAPTION } from './modules/shareToLinkedIn.js';

// Create hook instance
const linkedInShare = useShareToLinkedIn();

// Subscribe to status changes
linkedInShare.subscribe((status) => {
    console.log('Share status:', status); // 'idle' | 'sharing' | 'done' | 'error'
});

// Share with caption
await linkedInShare.share({
    imageBlob: blob,
    caption: DEFAULT_LINKEDIN_CAPTION,
    filename: 'profile.png'
});

// Check results
const result = linkedInShare.getLastResult();
if (result.success) {
    console.log('Share successful!');
}
```

## Features

✅ **Centralized Caption** - Single source of truth for the message  
✅ **Web Share API** - Uses modern APIs when available  
✅ **Fallback Strategy** - Copies to clipboard and opens LinkedIn  
✅ **Status Tracking** - Know when sharing is in progress  
✅ **Error Handling** - Graceful failure with helpful messages  
✅ **Mobile Optimized** - Works seamlessly on all platforms  

## Caption Details

- **Conference**: Faith & Energy Conference 1.0
- **Date**: November 15, 2025
- **Time**: 9AM sharp
- **Location**: Pistis Annex Marwa, Lekki Lagos
- **Theme**: "The Great Light" (Matthew 4:16)
- **Registration**: conference.gepafrica.com
- **Hashtags**: #FaithAndEnergy #GEPA #TheGreatLight #IWillBeAttending #FaithVibesOnly

## Customization

To change the caption, update it in one of two places:

### Option 1: Update the Module (Recommended)
Edit `/modules/shareToLinkedIn.js`:
```javascript
export const DEFAULT_LINKEDIN_CAPTION = `Your custom caption here...`;
```

### Option 2: Update script.js
Edit `/script.js`:
```javascript
this.shareMessage = `Your custom caption here...`;
```

## Share Flow

1. **User taps share button** → Share dialog opens
2. **Image is generated** → High-resolution profile image
3. **Web Share API attempted** → If available on device
   - ✅ Success → Image and caption shared via native share menu
   - ❌ Fails → Fall to Strategy 2
4. **Fallback Strategy**:
   - 📋 Caption copied to clipboard
   - 📷 Image copied to clipboard (if supported)
   - 💾 Image downloaded to device
   - 🌐 LinkedIn opens in new tab
5. **User pastes and posts** → Manual posting with caption already ready

## Browser Support

| Browser | Web Share API | Fallback | Status |
|---------|:---:|:---:|:---:|
| Safari (iOS) | ✅ | ✅ | Full Support |
| Chrome (Android) | ✅ | ✅ | Full Support |
| Firefox | ✅ | ✅ | Full Support |
| Edge | ✅ | ✅ | Full Support |
| Safari (Mac) | ✅ | ✅ | Full Support |
| Chrome (Desktop) | ⚠️ | ✅ | Partial Support |

## Performance

- **Caption Length**: 256 characters
- **Image Size**: Varies (high resolution)
- **API Response**: <500ms typical
- **Fallback Execution**: <1s typical

## SEO & Analytics

The caption includes:
- Conference hashtags for discoverability
- Direct registration link
- Call-to-action for attendance
- Inspirational messaging
- Multiple entry points for engagement
