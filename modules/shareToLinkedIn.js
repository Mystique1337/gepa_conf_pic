/**
 * LinkedIn Share Module
 * Handles sharing images to LinkedIn using Web Share API with fallback strategies
 */

/**
 * Default LinkedIn post caption for Faith & Energy Conference
 */
export const DEFAULT_LINKEDIN_CAPTION = `I will be at Faith & Energy Conference 1.0 🔥

📅 Nov 15, 2025
📍 Pistis Annex Marwa, Lekki Lagos
🕘 9AM sharp
Theme: "The Great Light" (Matthew 4:16)

If you are ready for growth, faith, and powerful inspiration, you should totally be there too! 💥
👉 Register at conference.gepafrica.com

#FaithAndEnergy #GEPA #TheGreatLight #IWillBeAttending #FaithVibesOnly`;

/**
 * Download a blob as a file
 * @param {Blob} blob - The file blob to download
 * @param {string} filename - The filename for download
 */
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - True if copy was successful
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            console.log('✓ Text copied to clipboard');
            return true;
        }
        return false;
    } catch (err) {
        console.error('❌ Failed to copy text:', err);
        return false;
    }
}

/**
 * Copy image blob to clipboard
 * @param {Blob} blob - The image blob
 * @returns {Promise<boolean>} - True if copy was successful
 */
async function copyImageToClipboard(blob) {
    try {
        if (navigator.clipboard && navigator.clipboard.write) {
            const clipboardItem = new ClipboardItem({
                'image/png': blob
            });
            await navigator.clipboard.write([clipboardItem]);
            console.log('✓ Image copied to clipboard');
            return true;
        }
        return false;
    } catch (err) {
        console.error('❌ Failed to copy image:', err);
        return false;
    }
}

/**
 * Share to LinkedIn with Web Share API and fallbacks
 * @param {Object} params - Share parameters
 * @param {Blob} params.imageBlob - The image blob to share
 * @param {string} params.caption - The caption/message to share
 * @param {string} params.filename - The filename for the image (optional)
 * @returns {Promise<Object>} - Result object with success and message
 */
export async function shareToLinkedIn({ imageBlob, caption, filename = 'profile.png' }) {
    try {
        console.log('=== LinkedIn Share Started ===');
        console.log('Image size:', imageBlob.size, 'bytes');

        // Strategy 1: Try Web Share API with files
        if (navigator.share && navigator.canShare) {
            console.log('📱 Checking Web Share API support with files...');

            const shareData = {
                files: [new File([imageBlob], filename, { type: 'image/png' })],
                title: 'Faith & Energy Conference 1.0',
                text: caption
            };

            // Check if browser can share with files
            if (navigator.canShare(shareData)) {
                try {
                    console.log('✓ Web Share API available - opening share dialog...');
                    await navigator.share(shareData);
                    console.log('✅ Share successful via Web Share API!');
                    return {
                        success: true,
                        message: 'Shared to LinkedIn successfully! 🎉',
                        method: 'web-share-api'
                    };
                } catch (error) {
                    if (error.name === 'AbortError') {
                        console.log('ℹ️ User cancelled share');
                        return {
                            success: false,
                            message: 'Share cancelled',
                            method: 'web-share-api',
                            cancelled: true
                        };
                    }
                    console.log('⚠️ Web Share API failed:', error.message);
                }
            } else {
                console.log('⚠️ Web Share API cannot share files on this browser');
            }
        } else {
            console.log('ℹ️ Web Share API not available');
        }

        // Strategy 2: Fallback - Copy to clipboard and open LinkedIn
        console.log('📋 Using fallback strategy - copy and open LinkedIn...');

        // Copy image to clipboard
        const imageCopied = await copyImageToClipboard(imageBlob);

        // Copy caption to clipboard (as alternative if image fails)
        const captionCopied = await copyToClipboard(caption);

        // Open LinkedIn in new tab
        console.log('🌐 Opening LinkedIn...');
        const linkedInWindow = window.open('https://www.linkedin.com/', '_blank', 'noopener,noreferrer');

        if (!linkedInWindow) {
            console.warn('⚠️ Could not open LinkedIn tab');
        }

        // Determine what was successfully copied
        let message = '✅ LinkedIn opened!';
        if (imageCopied && captionCopied) {
            message += '\n\n📋 Image and caption copied to clipboard!\n\nSteps:\n1. Click "Start a post"\n2. Paste the image (Ctrl+V or Cmd+V)\n3. Paste the caption below\n4. Click "Post"';
        } else if (imageCopied) {
            message += '\n\n📷 Image copied to clipboard!\n\nSteps:\n1. Click "Start a post"\n2. Paste the image (Ctrl+V or Cmd+V)\n3. Add your caption\n4. Click "Post"';
        } else if (captionCopied) {
            message += '\n\n📝 Caption copied to clipboard!\n\nSteps:\n1. Download the image\n2. Click "Start a post"\n3. Upload the image\n4. Paste the caption (Ctrl+V or Cmd+V)\n5. Click "Post"';
        }

        // Download image as fallback
        console.log('💾 Downloading image...');
        downloadFile(imageBlob, filename);

        console.log('✅ Fallback strategy completed');
        return {
            success: true,
            message,
            method: 'fallback',
            imageCopied,
            captionCopied
        };
    } catch (error) {
        console.error('❌ Share error:', error);
        return {
            success: false,
            message: `Error sharing: ${error.message}`,
            method: 'none',
            error: error
        };
    }
}

/**
 * React Hook for LinkedIn Sharing
 * Usage:
 *   const { share, status } = useShareToLinkedIn();
 *   await share({ imageBlob, caption, filename });
 */
export class LinkedInShareHook {
    constructor() {
        this.status = 'idle'; // idle | sharing | done | error
        this.lastResult = null;
        this.listeners = [];
    }

    /**
     * Subscribe to status changes
     * @param {Function} callback - Called when status changes
     * @returns {Function} - Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Update status and notify listeners
     * @param {string} newStatus
     */
    _setStatus(newStatus) {
        this.status = newStatus;
        this.listeners.forEach(listener => listener(newStatus));
    }

    /**
     * Share to LinkedIn
     * @param {Object} params - Share parameters
     * @returns {Promise<Object>} - Result object
     */
    async share(params) {
        this._setStatus('sharing');
        try {
            const result = await shareToLinkedIn(params);
            this.lastResult = result;

            if (result.success) {
                this._setStatus('done');
            } else if (!result.cancelled) {
                this._setStatus('error');
            } else {
                this._setStatus('idle');
            }

            return result;
        } catch (error) {
            this._setStatus('error');
            this.lastResult = {
                success: false,
                message: error.message,
                error
            };
            return this.lastResult;
        }
    }

    /**
     * Reset the hook to idle state
     */
    reset() {
        this._setStatus('idle');
        this.lastResult = null;
    }

    /**
     * Get current status
     * @returns {string}
     */
    getStatus() {
        return this.status;
    }

    /**
     * Get last result
     * @returns {Object|null}
     */
    getLastResult() {
        return this.lastResult;
    }
}

/**
 * Create a new LinkedIn Share Hook instance
 * @returns {LinkedInShareHook}
 */
export function useShareToLinkedIn() {
    return new LinkedInShareHook();
}

export default shareToLinkedIn;
