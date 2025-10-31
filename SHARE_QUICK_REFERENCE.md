# ShareToLinkedIn Module - Quick Reference

## Installation

1. Copy `modules/shareToLinkedIn.js` to your project
2. Import in your code:

```javascript
import { shareToLinkedIn, useShareToLinkedIn } from './modules/shareToLinkedIn.js';
```

## Basic Usage

### Simple Function Call

```javascript
const result = await shareToLinkedIn({
  imageBlob: blob,
  caption: 'My caption',
  filename: 'image.png'
});

console.log(result.success);  // true or false
console.log(result.message);  // User-friendly message
console.log(result.method);   // 'web-share-api' or 'fallback' or 'none'
```

### With Hook (Recommended)

```javascript
import { useShareToLinkedIn } from './modules/shareToLinkedIn.js';

// Create hook
const linkedInShare = useShareToLinkedIn();

// Listen to status changes
linkedInShare.subscribe((status) => {
  // status: 'idle' | 'sharing' | 'done' | 'error'
  updateUI(status);
});

// Share
const result = await linkedInShare.share({
  imageBlob: profileBlob,
  caption: message,
  filename: 'profile.png'
});

// Check result
if (result.success) {
  console.log('✅ Share initiated!');
} else if (result.cancelled) {
  console.log('User cancelled');
} else {
  console.error('Error:', result.message);
}
```

## API Reference

### `shareToLinkedIn(params)` → Promise

**Parameters:**
```javascript
{
  imageBlob: Blob,        // Required: Image to share
  caption: string,        // Required: Caption text
  filename?: string       // Optional: Filename (default: 'profile.png')
}
```

**Returns:**
```javascript
{
  success: boolean,           // Did the share start successfully?
  message: string,            // User-friendly message with instructions
  method: string,             // 'web-share-api' | 'fallback' | 'none'
  imageCopied?: boolean,      // Was image copied to clipboard?
  captionCopied?: boolean,    // Was caption copied to clipboard?
  cancelled?: boolean,        // Did user cancel? (only if success=false)
  error?: Error               // Error object if failed
}
```

### `useShareToLinkedIn()` → LinkedInShareHook

**Methods:**
- `share(params)` - Start sharing (returns Promise)
- `getStatus()` - Get current status ('idle'|'sharing'|'done'|'error')
- `getLastResult()` - Get result of last share
- `subscribe(callback)` - Listen to status changes (returns unsubscribe function)
- `reset()` - Reset to idle state

**Status Values:**
- `idle` - Ready to share
- `sharing` - Currently sharing
- `done` - Share completed successfully
- `error` - Share failed

## Examples

### React Component

```jsx
import { useShareToLinkedIn } from './modules/shareToLinkedIn.js';

function LinkedInShare({ imageBlob, caption }) {
  const [status, setStatus] = React.useState('idle');
  const linkedInShare = React.useRef(useShareToLinkedIn());

  React.useEffect(() => {
    return linkedInShare.current.subscribe(setStatus);
  }, []);

  const handleShare = async () => {
    const result = await linkedInShare.current.share({
      imageBlob,
      caption
    });
    if (!result.success) alert(result.message);
  };

  return (
    <button onClick={handleShare} disabled={status === 'sharing'}>
      {status === 'sharing' ? '🔄 Sharing...' : '📤 Share on LinkedIn'}
    </button>
  );
}
```

### Vue Component

```vue
<template>
  <button @click="share" :disabled="status === 'sharing'">
    {{ status === 'sharing' ? '🔄 Sharing...' : '📤 Share on LinkedIn' }}
  </button>
</template>

<script>
import { useShareToLinkedIn } from './modules/shareToLinkedIn.js';

export default {
  props: ['imageBlob', 'caption'],
  data() {
    return {
      status: 'idle',
      linkedInShare: null
    }
  },
  mounted() {
    this.linkedInShare = useShareToLinkedIn();
    this.linkedInShare.subscribe((status) => {
      this.status = status;
    });
  },
  methods: {
    async share() {
      const result = await this.linkedInShare.share({
        imageBlob: this.imageBlob,
        caption: this.caption
      });
      if (!result.success) alert(result.message);
    }
  }
}
</script>
```

### Vanilla JavaScript

```javascript
import { useShareToLinkedIn } from './modules/shareToLinkedIn.js';

const linkedInShare = useShareToLinkedIn();
const shareButton = document.getElementById('share-btn');

linkedInShare.subscribe((status) => {
  shareButton.disabled = status === 'sharing';
  shareButton.textContent = status === 'sharing' ? 'Sharing...' : 'Share';
});

shareButton.addEventListener('click', async () => {
  const result = await linkedInShare.share({
    imageBlob: myBlob,
    caption: 'My caption'
  });
  
  if (result.success) {
    console.log('✅', result.message.split('\n')[0]);
  } else if (!result.cancelled) {
    alert('Error: ' + result.message);
  }
});
```

## Status Flow

```
Idle
  ↓ (call share())
Sharing
  ↓
Done ✅ (success) OR Error ❌ (failed) OR Idle (cancelled)
```

## Error Handling

```javascript
const linkedInShare = useShareToLinkedIn();

try {
  const result = await linkedInShare.share({
    imageBlob: blob,
    caption: 'text'
  });

  if (result.cancelled) {
    console.log('User cancelled');
  } else if (result.error) {
    console.error('Error:', result.error.message);
  } else if (result.success) {
    console.log('Share initiated!');
  } else {
    console.error('Unknown error:', result.message);
  }
} catch (error) {
  // Should not happen, but handle just in case
  console.error('Unexpected error:', error);
}
```

## Browser Support

| Browser | Support | Method |
|---------|---------|--------|
| iOS Safari | ✅ Full | Web Share API |
| Chrome/Android | ✅ Full | Web Share API |
| Chrome/Desktop | ✅ Full | Fallback |
| Safari/Desktop | ✅ Full | Fallback |
| Firefox | ✅ Full | Fallback |
| Edge | ✅ Full | Web Share API or Fallback |

## Troubleshooting

**Q: Nothing happens when I click share**
A: Check browser console for errors. Make sure image blob is valid.

**Q: "Image copied to clipboard" but image doesn't paste**
A: Some browsers limit clipboard access. Try using Web Share API (mobile preferred).

**Q: LinkedIn doesn't open**
A: Browser may be blocking popups. Check popup blocker settings.

**Q: Function not found error**
A: Make sure `type: "module"` is set in package.json

**Q: Module not found**
A: Verify file path and that file exists at `modules/shareToLinkedIn.js`

## Tips

1. **Always check `result.success`** before proceeding
2. **Use the hook pattern** for better state management
3. **Subscribe to status changes** for UI feedback
4. **Test on mobile** - Web Share API works best there
5. **Handle cancellation** - User might close share dialog
6. **Provide fallback UI** - Not all browsers support Web Share API

## Migration from Old Code

If you have existing LinkedIn share code:

**Before:**
```javascript
async shareToLinkedIn() {
  // Complex logic with many edge cases
}
```

**After:**
```javascript
async shareToLinkedIn() {
  const result = await this.linkedInShare.share({
    imageBlob: this.profileImageBlob,
    caption: this.shareMessage,
    filename: 'profile.png'
  });
  
  if (result.success) {
    this.showSuccess();
  }
}
```

## Performance

- Module size: ~4 KB (gzipped: ~1.5 KB)
- Load time: < 10ms
- Share operation: < 1s
- No external dependencies

## License

MIT

## Support

See `SHARE_MODULE_DOCS.md` for detailed documentation.
