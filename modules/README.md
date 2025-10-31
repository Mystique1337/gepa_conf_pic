# Modules Directory

This directory contains reusable, modular JavaScript code for specific features.

## Contents

### `shareToLinkedIn.js`

A production-ready module for sharing images to LinkedIn with Web Share API support and intelligent fallback strategies.

**Key Features:**
- ✅ Web Share API with file support
- ✅ Smart clipboard operations
- ✅ Auto-download fallback
- ✅ React-friendly hook pattern
- ✅ Comprehensive error handling
- ✅ Status tracking and subscription model

**Quick Start:**

```javascript
import { shareToLinkedIn } from './modules/shareToLinkedIn.js';

const result = await shareToLinkedIn({
  imageBlob: myImageBlob,
  caption: 'My caption here',
  filename: 'image.png'
});

if (result.success) {
  console.log('Shared successfully!');
}
```

**Advanced Usage with Hook:**

```javascript
import { useShareToLinkedIn } from './modules/shareToLinkedIn.js';

const linkedInShare = useShareToLinkedIn();

// Subscribe to status changes
linkedInShare.subscribe((status) => {
  console.log('Status:', status); // idle | sharing | done | error
});

// Share
const result = await linkedInShare.share({
  imageBlob,
  caption,
  filename: 'profile.png'
});

// Check status
console.log(linkedInShare.getStatus());
```

## File Structure

```
modules/
├── shareToLinkedIn.js          # Main module
├── README.md                   # This file
└── [future modules...]
```

## Module Development Guidelines

When adding new modules to this directory, follow these guidelines:

### 1. Structure
- One module per file
- Clear separation of concerns
- Single responsibility principle

### 2. Exports
- Default export for main function
- Named exports for utilities
- Hook/class patterns for state management

### 3. Documentation
- JSDoc comments for all functions
- Parameter and return type documentation
- Usage examples in comments

### 4. Error Handling
- Try-catch blocks where appropriate
- Meaningful error messages
- Graceful degradation

### 5. Performance
- No external dependencies (unless necessary)
- Async/await for long operations
- Efficient clipboard operations

### 6. Testing
- Include test file in tests/ directory
- Test both happy path and error cases
- Mock external APIs

### 7. Browser Compatibility
- Check for feature support before use
- Provide fallbacks for older browsers
- Document browser support matrix

## Creating a New Module

Template for new modules:

```javascript
/**
 * Module: [Feature Name]
 * Description: [What this module does]
 */

// ============================================================================
// Helper Functions
// ============================================================================

function helperFunction() {
  // Implementation
}

// ============================================================================
// Main Export
// ============================================================================

/**
 * Main function
 * @param {Object} params - Parameters
 * @returns {Promise<Object>}
 */
export async function mainFunction(params) {
  // Implementation
}

// ============================================================================
// Hook/State Management
// ============================================================================

export class MyHook {
  constructor() {
    this.status = 'idle';
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  async execute(params) {
    // Implementation
  }
}

export function useMyHook() {
  return new MyHook();
}

export default mainFunction;
```

## Future Modules

Planned modules for future development:

- [ ] `shareToTwitter.js` - Twitter/X sharing
- [ ] `shareToFacebook.js` - Facebook sharing
- [ ] `shareToWhatsApp.js` - WhatsApp sharing
- [ ] `imageProcessor.js` - Image processing utilities
- [ ] `storageManager.js` - Local storage management
- [ ] `analytics.js` - Analytics tracking

## Testing

Each module should have corresponding tests in the `tests/` directory:

```bash
tests/
├── shareToLinkedIn.test.js
├── [future tests...]
```

Run tests:

```bash
node tests/shareToLinkedIn.test.js
# or in browser:
# window.runShareToLinkedInTests()
```

## Performance Metrics

### shareToLinkedIn.js
- Size: ~4 KB minified
- Dependencies: 0
- Load time: < 10ms
- Share operation: < 1s

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Share API | 75+ | 71+* | 13+ | 79+ |
| Clipboard API | 63+ | 63+ | 13.1+ | 79+ |
| File API | All | All | All | All |

*Firefox has limited Web Share API support

## Contributing

When adding new modules:

1. Follow the structure and guidelines above
2. Add comprehensive JSDoc comments
3. Create corresponding tests
4. Update this README
5. Ensure no external dependencies (unless absolutely necessary)
6. Test in multiple browsers

## License

MIT - Same as GEPA Profile Generator

## Support

For issues, questions, or suggestions for new modules, refer to the main repository documentation.
