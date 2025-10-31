# LinkedIn Share Module Documentation

## Overview

The `shareToLinkedIn` module provides a robust way to share images to LinkedIn with multiple fallback strategies. It implements the Web Share API as the primary method and falls back to clipboard copy + manual upload when needed.

## Features

✅ **Web Share API Support** - Direct sharing on supported browsers/platforms
✅ **Smart Fallbacks** - Automatically adapts to browser capabilities
✅ **Clipboard Operations** - Copies both image and caption to clipboard
✅ **Auto-Download** - Downloads image as final fallback
✅ **React Hook Pattern** - Easy state management with `useShareToLinkedIn()`
✅ **Status Tracking** - Track sharing progress: idle → sharing → done/error
✅ **Error Handling** - Comprehensive error handling with user-friendly messages

## API

### `shareToLinkedIn(params)`

Core function for sharing to LinkedIn.

**Parameters:**
```javascript
{
  imageBlob: Blob,        // The image blob to share (required)
  caption: string,        // The caption/message (required)
  filename?: string       // Filename for download (default: 'profile.png')
}
```

**Returns:**
```javascript
Promise<{
  success: boolean,           // Whether share was successful
  message: string,            // User-friendly message
  method: string,             // 'web-share-api' | 'fallback' | 'none'
  imageCopied?: boolean,      // If image was copied to clipboard
  captionCopied?: boolean,    // If caption was copied to clipboard
  cancelled?: boolean,        // If user cancelled
  error?: Error               // Error object if failed
}>
```

**Usage Example:**
```javascript
import { shareToLinkedIn } from './modules/shareToLinkedIn.js';

const result = await shareToLinkedIn({
  imageBlob: profileImageBlob,
  caption: 'I will be at Faith & Energy Conference...',
  filename: 'MyProfile_GEPA.png'
});

if (result.success) {
  console.log(result.message);
  // Show user: "LinkedIn opened! Image and caption in clipboard..."
}
```

### `useShareToLinkedIn()` - Hook/Class

State management wrapper around the `shareToLinkedIn` function.

**Returns:**
```javascript
{
  status: string,           // 'idle' | 'sharing' | 'done' | 'error'
  share(params): Promise,   // Async share function
  reset(): void,            // Reset to idle state
  getStatus(): string,      // Get current status
  getLastResult(): Object,  // Get last share result
  subscribe(callback): Function  // Listen to status changes
}
```

**Usage Example:**

```javascript
import { useShareToLinkedIn } from './modules/shareToLinkedIn.js';

// Create hook instance
const linkedInShare = useShareToLinkedIn();

// Subscribe to status changes
const unsubscribe = linkedInShare.subscribe((status) => {
  console.log('Share status:', status);
  updateUI(status);
});

// Perform share
const result = await linkedInShare.share({
  imageBlob: imageData,
  caption: message
});

// Check result
console.log('Status:', linkedInShare.getStatus()); // 'done' or 'error'
console.log('Result:', linkedInShare.getLastResult());

// Cleanup
unsubscribe();
```

## Browser Support

| Browser | Web Share API | Fallback | Status |
|---------|---------------|----------|--------|
| Chrome 75+ | ✅ | ✅ | Full Support |
| Edge 79+ | ✅ | ✅ | Full Support |
| Safari 13+ | ✅ | ✅ | Full Support |
| Firefox 71+ | ⚠️ Limited | ✅ | Works with fallback |
| iOS Safari | ✅ | ✅ | Full Support |
| Chrome Mobile | ✅ | ✅ | Full Support |

## Share Strategies

### Strategy 1: Web Share API (Primary)
**When available:** On modern browsers and iOS
**Behavior:** Opens native share dialog, user can select LinkedIn or other apps
**Advantage:** Native experience, direct sharing

### Strategy 2: Clipboard + Manual Upload (Fallback)
**When:** Web Share API not available or doesn't support files
**Behavior:**
1. Copies image to clipboard
2. Copies caption to clipboard
3. Downloads image file
4. Opens LinkedIn.com in new tab

**User Experience:**
- User sees instructions on what to do
- Image ready to paste (Ctrl+V)
- Caption ready to paste
- Downloaded as backup

## Integration Examples

### With Current Script.js

```javascript
// In script.js, replace existing shareToLinkedIn method:
import { useShareToLinkedIn } from './modules/shareToLinkedIn.js';

class SimpleProfileGenerator {
  constructor() {
    // ... existing code ...
    this.linkedInShare = useShareToLinkedIn();
  }

  async shareToLinkedIn() {
    const result = await this.linkedInShare.share({
      imageBlob: this.profileImageBlob,
      caption: this.shareMessage,
      filename: `${this.userName}_GEPA_Profile.png`
    });

    if (result.success) {
      this.showShareSuccess('LinkedIn');
    } else {
      alert(result.message);
    }
  }
}
```

### With React Component

```jsx
import { useShareToLinkedIn } from './modules/shareToLinkedIn.js';

export function LinkedInShareButton({ imageBlob, caption }) {
  const linkedInShare = useShareToLinkedIn();
  const [status, setStatus] = React.useState('idle');

  React.useEffect(() => {
    return linkedInShare.subscribe(setStatus);
  }, []);

  const handleShare = async () => {
    const result = await linkedInShare.share({
      imageBlob,
      caption,
      filename: 'profile.png'
    });

    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <button 
      onClick={handleShare} 
      disabled={status === 'sharing'}
    >
      {status === 'sharing' ? 'Sharing...' : 'Share on LinkedIn'}
    </button>
  );
}
```

## Implementation Steps

1. **Copy the module:**
   ```bash
   cp modules/shareToLinkedIn.js your-project/
   ```

2. **Import in your code:**
   ```javascript
   import { shareToLinkedIn, useShareToLinkedIn } from './shareToLinkedIn.js';
   ```

3. **Use in your component/class:**
   ```javascript
   const result = await shareToLinkedIn({
     imageBlob: myImage,
     caption: 'My caption',
     filename: 'image.png'
   });
   ```

## Error Handling

The module handles these scenarios:

- **Invalid Blob:** Error caught and returned in result
- **Clipboard Access Denied:** Falls back to download only
- **Web Share Cancelled:** Returns with `cancelled: true`
- **Browser Incompatibility:** Uses fallback strategy
- **Network Issues:** LinkedIn opens, user can share manually

## Helper Functions (Internal)

### `downloadFile(blob, filename)`
Downloads a blob as a file to user's device.

### `copyToClipboard(text)`
Copies text to clipboard. Returns boolean success.

### `copyImageToClipboard(blob)`
Copies image blob to clipboard. Returns boolean success.

## Testing

### Test Cases

1. **Web Share API Available**
   - Test on iOS Safari or Android Chrome
   - Should open native share dialog

2. **Fallback Strategy**
   - Test on Firefox or older browsers
   - Image should be copied and downloaded
   - LinkedIn should open

3. **Clipboard Permission Denied**
   - Revoke clipboard permissions in browser settings
   - Image should download, manual instructions shown

4. **Cancelled Share**
   - In native share dialog, cancel/close
   - Should return gracefully

## Performance

- **Lightweight:** ~4KB minified
- **No Dependencies:** Pure JavaScript
- **Fast:** Clipboard operations are instant
- **Async:** Non-blocking with Promises

## License

MIT - Same as GEPA Profile Generator

## Support

For issues or questions, refer to the main repository documentation.
