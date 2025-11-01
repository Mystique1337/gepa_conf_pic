class SimpleProfileGenerator {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.templateImg = null;
        this.userImg = null;
        this.userName = '';
        
        // DOM elements
        this.photoUpload = document.getElementById('photo-upload');
        this.photoUploadCamera = document.getElementById('photo-upload-camera');
        this.photoUploadUserCamera = document.getElementById('photo-upload-user-camera');
        this.uploadArea = document.getElementById('upload-area');
        this.uploadProgress = document.getElementById('upload-progress');
        this.progressText = document.getElementById('progress-text');
        this.progressFill = document.getElementById('progress-fill');
        this.uploadSuccess = document.getElementById('upload-success');
        this.nameInput = document.getElementById('name-input');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.statusMessage = document.getElementById('status-message');
        this.shareSection = document.getElementById('share-section');
        
        // Caption elements
        this.captionDisplayText = document.getElementById('caption-display-text');
        this.copyCaptionBtn = document.getElementById('copy-caption-btn');
        this.captionCopyHint = document.getElementById('caption-copy-hint');
        
        // Detect mobile device
        this.isMobile = this.detectMobile();
        
        // State tracking
        this.profileGenerated = false;
        this.isUploading = false;
        
        // Social media share buttons
        this.shareLinkedIn = document.getElementById('share-linkedin');
        this.shareTwitter = document.getElementById('share-twitter');
        this.shareFacebook = document.getElementById('share-facebook');
        this.shareWhatsApp = document.getElementById('share-whatsapp');
        this.shareInstagram = document.getElementById('share-instagram');
        
        // Share message - Faith & Energy Conference 1.0
        this.shareMessage = `I will be at Faith & Energy Conference 1.0 🔥

📅 Nov 15, 2025
📍 Pistis Annex Marwa, Lekki Lagos
🕘 9AM sharp
Theme: "The Great Light" (Matthew 4:16)

If you are ready for growth, direction, and networking that will improve your energy career, you should  be there too! 💥
👉 Register at conference.gepafrica.com

#FaithAndEnergy #GEPA #TheGreatLight #IWillBeAttending #FaithVibesOnly`;
        
        // Store generated profile image
        this.profileImageBlob = null;
        this.profileImageFile = null;
        
        // Rectangle position and sizing (for new template with rectangular image area)
        // Based on the visible template layout - fine-tuned positioning
        this.rectanglePosition = { x: 0.10, y: 0.28 }; // Top-left corner of rectangle (white frame)
        this.rectangleSize = { width: 0.34, height: 0.38 }; // Width and height as proportion of template
        this.namePosition = { x: 0.27, y: 0.70 }; // Centered in the black name bar
        
        // Fixed sizing configuration
        this.config = {
            nameFontSize: 0.035,
            maxTextWidth: 0.38
        };
        
        this.init();
    }
    
    init() {
        this.loadTemplate();
        this.bindEvents();
        this.drawTemplate();
        this.updateFormState();
        this.updateMobileHint();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    updateMobileHint() {
        const hint = document.getElementById('upload-mobile-hint');
        if (hint && this.isMobile) {
            const ua = navigator.userAgent;
            if (/iPhone|iPad|iPod/.test(ua)) {
                hint.textContent = 'Tip: Press and hold to access Photos or Camera app';
            } else if (/Android/.test(ua)) {
                hint.textContent = 'Tip: Choose Photos or Camera from the menu';
            }
        }
    }
    
    bindEvents() {
        // File upload events
        this.photoUpload.addEventListener('change', (e) => {
            console.log('📁 File input changed:', e.target.files);
            this.handleFileSelect(e);
        });
        
        // Camera capture inputs
        this.photoUploadCamera.addEventListener('change', (e) => {
            console.log('📷 Camera capture changed:', e.target.files);
            this.handleFileSelect(e);
        });
        
        this.photoUploadUserCamera.addEventListener('change', (e) => {
            console.log('🤳 User camera capture changed:', e.target.files);
            this.handleFileSelect(e);
        });
        
        // Click event for upload area - enhanced for mobile
        this.uploadArea.addEventListener('click', (e) => {
            console.log('🖱️ Upload area clicked');
            e.preventDefault();
            e.stopPropagation();
            this.photoUpload.click();
        });
        
        // Drag and drop events (desktop)
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });
        
        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });
        
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            console.log('📂 Files dropped:', files);
            if (files.length > 0) {
                this.loadUserImage(files[0]);
            }
        });
        
        // Form input events
        this.nameInput.addEventListener('input', () => {
            this.userName = this.nameInput.value;
            this.drawProfile();
            this.updateFormState();
        });
        
        // Generate button
        this.generateBtn.addEventListener('click', () => this.generateProfile());
        
        // Download button
        this.downloadBtn.addEventListener('click', () => this.downloadProfile());
        
        // Social media share buttons
        this.shareLinkedIn.addEventListener('click', () => this.shareToLinkedIn());
        this.shareTwitter.addEventListener('click', () => this.shareToTwitter());
        this.shareFacebook.addEventListener('click', () => this.shareToFacebook());
        this.shareWhatsApp.addEventListener('click', () => this.shareToWhatsApp());
        this.shareInstagram.addEventListener('click', () => this.shareToInstagram());
        
        // Caption copy button
        this.copyCaptionBtn.addEventListener('click', () => this.copyCaption());
    }
    
    loadTemplate() {
        this.templateImg = new Image();
        this.templateImg.onload = () => {
            this.drawTemplate();
        };
        this.templateImg.src = 'New_template.jpg';
    }
    
    drawTemplate() {
        if (!this.templateImg) {
            this.drawPlaceholderTemplate();
            return;
        }
        
        // Clear canvas with high quality
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Enable high quality image rendering
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        // Calculate template dimensions to fit canvas while maintaining aspect ratio
        const aspectRatio = this.templateImg.width / this.templateImg.height;
        let drawWidth = this.canvas.width;
        let drawHeight = this.canvas.width / aspectRatio;
        
        if (drawHeight > this.canvas.height) {
            drawHeight = this.canvas.height;
            drawWidth = this.canvas.height * aspectRatio;
        }
        
        const x = (this.canvas.width - drawWidth) / 2;
        const y = (this.canvas.height - drawHeight) / 2;
        
        // Draw template image with high quality
        this.ctx.drawImage(this.templateImg, x, y, drawWidth, drawHeight);
    }
    
    drawPlaceholderTemplate() {
        // Draw a simple placeholder
        this.ctx.fillStyle = '#2d9a8c';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GEPA Template Loading...', 300, 400);
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        console.log('📷 File selected:', file);
        if (file) {
            this.loadUserImage(file);
        } else {
            console.warn('⚠️ No file selected');
        }
        
        // Reset the input so the same file can be selected again
        e.target.value = '';
    }
    
    loadUserImage(file) {
        console.log('🖼️ Loading image:', file.name, file.type, file.size);
        
        if (!file) {
            console.error('❌ No file provided');
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            console.error('❌ Invalid file type:', file.type);
            alert('Please upload an image file (PNG, JPG, etc.)');
            return;
        }
        
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            console.error('❌ File too large:', file.size);
            alert('Image is too large. Please upload an image smaller than 10MB.');
            return;
        }
        
        // Mark as uploading
        this.isUploading = true;
        this.uploadArea.classList.add('uploading');
        this.uploadProgress.style.display = 'block';
        this.uploadSuccess.style.display = 'none';
        this.progressText.textContent = 'Processing your image...';
        this.progressFill.style.width = '0%';
        this.statusMessage.textContent = 'Processing image...';
        
        const reader = new FileReader();
        
        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;
            this.progressFill.style.width = progress + '%';
        }, 100);
        
        reader.onerror = (error) => {
            console.error('❌ FileReader error:', error);
            clearInterval(progressInterval);
            this.isUploading = false;
            this.uploadArea.classList.remove('uploading');
            this.uploadProgress.style.display = 'none';
            this.statusMessage.textContent = 'Error reading file. Please try again.';
            alert('Error reading file. Please try a different image.');
        };
        
        reader.onload = (e) => {
            console.log('✓ File read successfully');
            this.userImg = new Image();
            
            this.userImg.onerror = (error) => {
                console.error('❌ Image load error:', error);
                clearInterval(progressInterval);
                this.isUploading = false;
                this.uploadArea.classList.remove('uploading');
                this.uploadProgress.style.display = 'none';
                this.statusMessage.textContent = 'Error loading image. Please try a different file.';
                alert('Error loading image. Please try a different file.');
            };
            
            this.userImg.onload = () => {
                console.log('✅ Image loaded successfully:', this.userImg.width, 'x', this.userImg.height);
                clearInterval(progressInterval);
                this.progressFill.style.width = '100%';
                
                // Wait a moment to show completion
                setTimeout(() => {
                    this.uploadArea.classList.remove('uploading');
                    this.uploadArea.classList.add('uploaded');
                    this.uploadProgress.style.display = 'none';
                    this.isUploading = false;
                    
                    // Show success notification
                    this.showUploadSuccess();
                    
                    this.drawProfile();
                    this.updateFormState();
                    
                    // Scroll to form on mobile
                    if (this.isMobile) {
                        setTimeout(() => {
                            this.nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 300);
                    }
                }, 300);
            };
            
            this.userImg.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
    
    showUploadSuccess() {
        // Show the success notification
        this.uploadSuccess.style.display = 'block';
        
        // Hide it after 3 seconds
        setTimeout(() => {
            this.uploadSuccess.style.opacity = '0';
            this.uploadSuccess.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                this.uploadSuccess.style.display = 'none';
                this.uploadSuccess.style.opacity = '1';
                this.uploadSuccess.style.transform = 'translateY(0)';
            }, 300);
        }, 3000);
    }
    
    drawProfile() {
        // Always draw template first
        this.drawTemplate();
        
        if (!this.userImg) return;
        
        // Calculate template dimensions and position
        const aspectRatio = this.templateImg.width / this.templateImg.height;
        let drawWidth = this.canvas.width;
        let drawHeight = this.canvas.width / aspectRatio;
        
        if (drawHeight > this.canvas.height) {
            drawHeight = this.canvas.height;
            drawWidth = this.canvas.height * aspectRatio;
        }
        
        const templateX = (this.canvas.width - drawWidth) / 2;
        const templateY = (this.canvas.height - drawHeight) / 2;
        
        // Calculate rectangle position and size based on template scale and position
        const rectX = templateX + (drawWidth * this.rectanglePosition.x);
        const rectY = templateY + (drawHeight * this.rectanglePosition.y);
        const rectWidth = drawWidth * this.rectangleSize.width;
        const rectHeight = drawHeight * this.rectangleSize.height;
        
        // Draw user image in rectangle
        this.ctx.save();
        
        // Create rectangular clipping mask
        this.ctx.beginPath();
        this.ctx.rect(rectX, rectY, rectWidth, rectHeight);
        this.ctx.clip();
        
        // Calculate dimensions to fill the entire rectangle while maintaining aspect ratio
        const imgAspect = this.userImg.width / this.userImg.height;
        const rectAspect = rectWidth / rectHeight;
        
        let imgWidth, imgHeight;
        if (imgAspect > rectAspect) {
            // Wide image - make sure height covers the full rectangle
            imgHeight = rectHeight;
            imgWidth = imgHeight * imgAspect;
        } else {
            // Tall image - make sure width covers the full rectangle
            imgWidth = rectWidth;
            imgHeight = imgWidth / imgAspect;
        }
        
        // Center the image in the rectangle
        const imgX = rectX + (rectWidth - imgWidth) / 2;
        const imgY = rectY + (rectHeight - imgHeight) / 2;
        
        // Draw image
        this.ctx.drawImage(this.userImg, imgX, imgY, imgWidth, imgHeight);
        this.ctx.restore();
        
        // Draw name text in white if available
        if (this.userName) {
            const textX = templateX + (drawWidth * this.namePosition.x);
            const nameY = templateY + (drawHeight * this.namePosition.y);
            
            this.ctx.fillStyle = '#FFFFFF'; // White color for name
            this.ctx.textAlign = 'center';
            this.drawConstrainedText(textX, nameY, this.userName.toUpperCase(), drawWidth, true);
        }
    }
    
    drawConstrainedText(x, y, text, templateWidth, isBold = false) {
        const baseFontSize = templateWidth * this.config.nameFontSize;
        const minFontSize = 12;
        let currentFontSize = Math.max(baseFontSize, minFontSize);
        
        const maxWidth = templateWidth * this.config.maxTextWidth;
        
        this.ctx.font = `${isBold ? 'bold' : ''} ${currentFontSize}px Arial, sans-serif`;
        let textMetrics = this.ctx.measureText(text);
        
        // Scale down font if text is too wide
        if (textMetrics.width > maxWidth) {
            const scaleFactor = maxWidth / textMetrics.width;
            currentFontSize = Math.max(currentFontSize * scaleFactor, minFontSize);
            this.ctx.font = `${isBold ? 'bold' : ''} ${currentFontSize}px Arial, sans-serif`;
        }
        
        // Draw the text
        this.ctx.fillText(text, x, y);
    }
    
    updateFormState() {
        const hasImage = this.userImg !== null;
        const hasName = this.userName.trim().length > 0;
        
        // Update form styling
        this.nameInput.parentElement.classList.toggle('filled', hasName);
        
        // Update generate button state - disable if uploading
        const canGenerate = hasImage && hasName && !this.profileGenerated && !this.isUploading;
        this.generateBtn.disabled = !canGenerate;
        
        // Show/hide share section based on generation state
        if (this.profileGenerated) {
            this.shareSection.style.display = 'block';
            this.generateBtn.style.display = 'none';
            this.statusMessage.style.display = 'none';
            
            // Populate caption display
            if (this.captionDisplayText) {
                this.captionDisplayText.textContent = this.shareMessage;
            }
        } else {
            this.shareSection.style.display = 'none';
            this.generateBtn.style.display = 'block';
            this.statusMessage.style.display = 'block';
        }
        
        // Update status message
        if (!this.profileGenerated) {
            if (this.isUploading) {
                this.statusMessage.textContent = 'Image uploading... Please wait';
                this.statusMessage.style.color = '#f4c430';
            } else if (!hasImage) {
                this.statusMessage.textContent = 'Please upload a photo';
                this.statusMessage.style.color = '';
            } else if (!hasName) {
                this.statusMessage.textContent = 'Please enter your name';
                this.statusMessage.style.color = '';
            } else {
                this.statusMessage.textContent = 'Ready to generate your profile! Click the button above';
                this.statusMessage.style.color = '#28a745';
            }
        }
    }
    
    generateProfile() {
        if (!this.userImg || !this.userName) {
            alert('Please upload a photo and enter your name.');
            return;
        }
        
        // Show generating message
        this.generateBtn.textContent = 'Generating...';
        this.generateBtn.disabled = true;
        
        // Generate the profile image immediately
        this.generateProfileImageForSharing().then(() => {
            // Mark as generated
            this.profileGenerated = true;
            
            // Update the UI to show share section
            this.updateFormState();
            
            // Scroll to share section
            setTimeout(() => {
                this.shareSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });
    }
    
    downloadProfile() {
        if (!this.profileImageFile) {
            alert('Please generate your profile first.');
            return;
        }
        
        // Use the helper method to download
        this.downloadProfileImage();
    }
    
    drawHighResText(ctx, x, y, text, templateWidth, isBold = false) {
        const baseFontSize = templateWidth * this.config.nameFontSize;
        const minFontSize = 24; // Higher minimum for high-res
        let currentFontSize = Math.max(baseFontSize, minFontSize);
        
        const maxWidth = templateWidth * this.config.maxTextWidth;
        
        ctx.font = `${isBold ? 'bold' : ''} ${currentFontSize}px Arial, sans-serif`;
        let textMetrics = ctx.measureText(text);
        
        // Scale down font if text is too wide
        if (textMetrics.width > maxWidth) {
            const scaleFactor = maxWidth / textMetrics.width;
            currentFontSize = Math.max(currentFontSize * scaleFactor, minFontSize);
            ctx.font = `${isBold ? 'bold' : ''} ${currentFontSize}px Arial, sans-serif`;
        }
        
        // Draw the text
        ctx.fillText(text, x, y);
    }
    
    // Generate profile image for sharing
    async generateProfileImageForSharing() {
        return new Promise((resolve) => {
            if (this.profileImageBlob) {
                resolve(this.profileImageFile);
                return;
            }
            
            // Generate the image if not already generated
            const downloadCanvas = document.createElement('canvas');
            const downloadCtx = downloadCanvas.getContext('2d');
            
            const scale = 2;
            downloadCanvas.width = this.templateImg.width * scale;
            downloadCanvas.height = this.templateImg.height * scale;
            
            downloadCtx.imageSmoothingEnabled = true;
            downloadCtx.imageSmoothingQuality = 'high';
            
            downloadCtx.drawImage(this.templateImg, 0, 0, downloadCanvas.width, downloadCanvas.height);
            
            const templateWidth = downloadCanvas.width;
            const templateHeight = downloadCanvas.height;
            
            const rectX = templateWidth * this.rectanglePosition.x;
            const rectY = templateHeight * this.rectanglePosition.y;
            const rectWidth = templateWidth * this.rectangleSize.width;
            const rectHeight = templateHeight * this.rectangleSize.height;
            
            downloadCtx.save();
            downloadCtx.beginPath();
            downloadCtx.rect(rectX, rectY, rectWidth, rectHeight);
            downloadCtx.clip();
            
            const imgAspect = this.userImg.width / this.userImg.height;
            const rectAspect = rectWidth / rectHeight;
            
            let imgWidth, imgHeight;
            if (imgAspect > rectAspect) {
                imgHeight = rectHeight;
                imgWidth = imgHeight * imgAspect;
            } else {
                imgWidth = rectWidth;
                imgHeight = imgWidth / imgAspect;
            }
            
            const imgX = rectX + (rectWidth - imgWidth) / 2;
            const imgY = rectY + (rectHeight - imgHeight) / 2;
            
            downloadCtx.drawImage(this.userImg, imgX, imgY, imgWidth, imgHeight);
            downloadCtx.restore();
            
            const nameX = templateWidth * this.namePosition.x;
            const nameY = templateHeight * this.namePosition.y;
            
            downloadCtx.fillStyle = '#FFFFFF';
            downloadCtx.textAlign = 'center';
            this.drawHighResText(downloadCtx, nameX, nameY, this.userName.toUpperCase(), templateWidth, true);
            
            const fileName = `${this.userName.replace(/\s+/g, '_')}_GEPA_Profile.png`;
            
            downloadCanvas.toBlob((blob) => {
                this.profileImageBlob = blob;
                this.profileImageFile = new File([blob], fileName, { type: 'image/png' });
                resolve(this.profileImageFile);
            }, 'image/png', 1.0);
        });
    }

    
    // Helper method to download the profile image
    downloadProfileImage() {
        if (!this.profileImageBlob || !this.profileImageFile) {
            console.error('No profile image to download');
            return;
        }
        const url = URL.createObjectURL(this.profileImageBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.profileImageFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
    
    // CAPTION MODAL METHODS
    
    // Open the caption preview modal
    openCaptionModal() {
        console.log('�️ Opening caption preview modal...');
        
        // Display the caption in the modal
        this.captionText.textContent = this.shareMessage;
        
        // Show modal with animation
        this.captionModal.style.display = 'flex';
        setTimeout(() => {
            this.captionModal.classList.add('show');
        }, 10);
    }
    
    // Close the caption preview modal
    closeCaptionModal() {
        console.log('❌ Closing caption modal');
        this.captionModal.classList.remove('show');
        setTimeout(() => {
            this.captionModal.style.display = 'none';
            this.modalCopyStatus.style.display = 'none';
        }, 300);
    }
    
    // Copy caption to clipboard
    async copyCaption() {
        try {
            console.log('📋 Copying caption to clipboard...');
            
            // Try modern Clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(this.shareMessage);
                console.log('✅ Caption copied to clipboard!');
                this.showCopySuccess();
            } else {
                // Fallback for older browsers
                this.fallbackCopyCaption();
            }
        } catch (error) {
            console.error('❌ Error copying caption:', error);
            this.fallbackCopyCaption();
        }
    }
    
    // Fallback method for browsers without Clipboard API
    fallbackCopyCaption() {
        const textArea = document.createElement('textarea');
        textArea.value = this.shareMessage;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            console.log('✅ Caption copied (fallback method)!');
            this.showCopySuccess();
        } catch (error) {
            console.error('❌ Fallback copy failed:', error);
            alert('Could not copy caption. Please try manually selecting and copying the text.');
        } finally {
            document.body.removeChild(textArea);
        }
    }
    
    // Show success message when caption is copied
    showCopySuccess() {
        if (this.captionCopyHint) {
            this.captionCopyHint.style.display = 'block';
            this.captionCopyHint.style.animation = 'none';
            
            // Trigger reflow to restart animation
            void this.captionCopyHint.offsetWidth;
            this.captionCopyHint.style.animation = 'slideInUp 0.4s ease-out';
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                if (this.captionCopyHint.style.display === 'block') {
                    this.captionCopyHint.style.opacity = '0';
                    this.captionCopyHint.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        this.captionCopyHint.style.display = 'none';
                        this.captionCopyHint.style.opacity = '1';
                        this.captionCopyHint.style.transform = 'translateY(0)';
                    }, 300);
                }
            }, 3000);
        }
    }
    
    // CORE SHARE FUNCTION - Handles all sharing logic
    async shareProfile(platformName, platformUrl = null, useNativeShare = true) {
        try {
            console.log(`\n🚀 Starting share to ${platformName}...`);
            
            // Ensure image is generated
            if (!this.profileImageFile) {
                console.log('⚙️ Generating profile image...');
                await this.generateProfileImageForSharing();
            }
            
            console.log('✓ Profile image ready:', this.profileImageFile);
            
            // Strategy 1: Try Web Share API (works on mobile and some modern desktop browsers)
            if (useNativeShare && navigator.share) {
                console.log('📱 Checking Web Share API support...');
                
                try {
                    const shareData = {
                        files: [this.profileImageFile],
                        title: 'Faith & Energy Conference 1.0',
                        text: this.shareMessage
                    };
                    
                    // Check if browser can share this data
                    if (navigator.canShare && navigator.canShare(shareData)) {
                        console.log('✓ Web Share API available - opening share dialog...');
                        await navigator.share(shareData);
                        console.log('✅ Share successful!');
                        this.showShareSuccess(platformName);
                        return; // SUCCESS - sharing completed
                    } else {
                        console.log('⚠️ Web Share API cannot share files on this browser');
                    }
                } catch (error) {
                    if (error.name === 'AbortError') {
                        console.log('ℹ️ User cancelled share');
                        return; // User cancelled - not an error
                    }
                    console.log('⚠️ Web Share API failed:', error.message);
                    // Continue to fallback strategies
                }
            } else {
                console.log('ℹ️ Web Share API not used (disabled or not available)');
            }
            
            // Strategy 2: Open platform directly with helpers
            console.log(`🌐 Using platform URL strategy for ${platformName}...`);
            
            // Try to copy image to clipboard (silent - helps on desktop)
            let imageCopied = false;
            try {
                if (navigator.clipboard && navigator.clipboard.write) {
                    console.log('📋 Attempting to copy image to clipboard...');
                    const clipboardItem = new ClipboardItem({
                        'image/png': this.profileImageBlob
                    });
                    await navigator.clipboard.write([clipboardItem]);
                    imageCopied = true;
                    console.log('✓ Image copied to clipboard');
                }
            } catch (err) {
                console.log('⚠️ Could not copy image:', err.message);
            }
            
            // Try to copy text to clipboard
            let textCopied = false;
            try {
                console.log('📝 Attempting to copy text to clipboard...');
                await navigator.clipboard.writeText(this.shareMessage);
                textCopied = true;
                console.log('✓ Text copied to clipboard');
            } catch (err) {
                console.log('⚠️ Could not copy text:', err.message);
            }
            
            // Open the platform
            if (platformUrl) {
                console.log(`🌐 Opening ${platformName}:`, platformUrl);
                window.open(platformUrl, '_blank', 'noopener,noreferrer');
            } else {
                console.log(`ℹ️ No URL for ${platformName} - image needs to be downloaded`);
                // For Instagram on desktop, download the image
                this.downloadProfileImage();
            }
            
            // Give user feedback based on what worked
            if (imageCopied && textCopied) {
                console.log(`✅ Ready to share on ${platformName} - image and text in clipboard`);
                this.showShareInstructions(platformName, 'both');
            } else if (imageCopied) {
                console.log(`✅ Ready to share on ${platformName} - image in clipboard`);
                this.showShareInstructions(platformName, 'image');
            } else if (textCopied) {
                console.log(`✅ Ready to share on ${platformName} - text in clipboard`);
                this.showShareInstructions(platformName, 'text');
            } else {
                console.log(`ℹ️ ${platformName} opened - manual upload needed`);
                this.showShareInstructions(platformName, 'manual');
            }
            
        } catch (error) {
            console.error('❌ Share error:', error);
            alert(`Unable to share right now. Please try:\n1. Download your profile using the Download button\n2. Manually post to ${platformName}`);
        }
    }
    
    // Show share success message
    showShareSuccess(platformName) {
        const badge = document.querySelector('.success-badge');
        if (badge) {
            const text = badge.querySelector('.badge-text h3');
            if (text) {
                text.textContent = `Shared to ${platformName}! 🎉`;
                setTimeout(() => {
                    text.textContent = 'Profile Generated Successfully!';
                }, 3000);
            }
        }
    }
    
    // Show helpful instructions based on what was copied
    showShareInstructions(platformName, copiedType) {
        let message = '';
        
        switch(copiedType) {
            case 'both':
                message = `✅ ${platformName} opened!\n\nImage and text copied to clipboard.\nJust paste (Ctrl+V) in the ${platformName} post!`;
                break;
            case 'image':
                message = `✅ ${platformName} opened!\n\nImage copied to clipboard.\nPaste it (Ctrl+V) and add your message.`;
                break;
            case 'text':
                message = `✅ ${platformName} opened!\n\nCaption copied to clipboard.\nUpload the image and paste the caption.`;
                break;
            case 'manual':
                message = `✅ ${platformName} opened!\n\nPlease upload the image manually and use the provided caption.`;
                break;
        }
        
        if (message) {
            // Show as a temporary toast notification instead of alert
            console.log(message);
            const statusMsg = document.getElementById('status-message');
            if (statusMsg) {
                const originalText = statusMsg.textContent;
                statusMsg.textContent = message.split('\n')[0];
                statusMsg.style.color = '#2d9a8c';
                setTimeout(() => {
                    statusMsg.textContent = originalText;
                    statusMsg.style.color = '';
                }, 5000);
            }
        }
    }
    
    // SOCIAL MEDIA SHARE METHODS
    async shareToLinkedIn() {
        console.log('=== LinkedIn Share Started ===');
        
        // Ensure image is generated
        if (!this.profileImageFile) {
            console.log('⚙️ Generating profile image...');
            await this.generateProfileImageForSharing();
        }
        
        try {
            // Try Web Share API first (best option - works on mobile and modern browsers)
            if (navigator.share) {
                const shareData = {
                    files: [this.profileImageFile],
                    title: 'Faith & Energy Conference 1.0',
                    text: this.shareMessage
                };
                
                if (navigator.canShare && navigator.canShare(shareData)) {
                    console.log('✓ Using Web Share API for LinkedIn');
                    await navigator.share(shareData);
                    this.showShareSuccess('LinkedIn');
                    return;
                }
            }
            
            // Fallback: Copy both image and text, then open LinkedIn
            console.log('📋 Copying content for LinkedIn...');
            
            // Copy image to clipboard
            let imageCopied = false;
            try {
                if (navigator.clipboard && navigator.clipboard.write) {
                    const clipboardItem = new ClipboardItem({
                        'image/png': this.profileImageBlob
                    });
                    await navigator.clipboard.write([clipboardItem]);
                    imageCopied = true;
                    console.log('✓ Image copied to clipboard');
                }
            } catch (err) {
                console.log('⚠️ Could not copy image:', err.message);
            }
            
            // Copy text to clipboard
            let textCopied = false;
            try {
                await navigator.clipboard.writeText(this.shareMessage);
                textCopied = true;
                console.log('✓ Text copied to clipboard');
            } catch (err) {
                console.log('⚠️ Could not copy text:', err.message);
            }
            
            // Open LinkedIn
            console.log('🌐 Opening LinkedIn...');
            window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
            
            // Show instructions
            if (imageCopied && textCopied) {
                this.showLinkedInInstructions('both');
            } else if (imageCopied) {
                this.showLinkedInInstructions('image');
            } else if (textCopied) {
                this.showLinkedInInstructions('text');
            } else {
                this.showLinkedInInstructions('manual');
            }
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('ℹ️ User cancelled share');
                return;
            }
            console.error('❌ LinkedIn share error:', error);
            alert('Please download the image and share manually on LinkedIn.');
        }
    }
    
    // Show LinkedIn-specific instructions
    showLinkedInInstructions(copiedType) {
        let message = '';
        
        switch(copiedType) {
            case 'both':
                message = `✅ LinkedIn opened!\n\n1. Click "Start a post"\n2. Paste the image (Ctrl+V or Cmd+V)\n3. The caption is already in your clipboard - paste it too!\n4. Click "Post"`;
                break;
            case 'image':
                message = `✅ LinkedIn opened!\n\nImage copied! Click "Start a post" and paste (Ctrl+V or Cmd+V)`;
                break;
            case 'text':
                message = `✅ LinkedIn opened!\n\nCaption copied! Click "Start a post", upload the image, and paste the caption.`;
                break;
            case 'manual':
                message = `✅ LinkedIn opened!\n\nClick "Start a post" and upload your profile image manually.`;
                break;
        }
        
        // Show as alert for now - you can customize this to a nicer modal
        alert(message);
        
        // Also update status message
        const statusMsg = document.getElementById('status-message');
        if (statusMsg) {
            statusMsg.textContent = 'Ready to post on LinkedIn!';
            statusMsg.style.color = '#2d9a8c';
        }
    }
    
    async shareToTwitter() {
        console.log('=== Twitter/X Share Started ===');
        const text = encodeURIComponent(this.shareMessage);
        await this.shareProfile(
            'Twitter/X',
            `https://twitter.com/intent/tweet?text=${text}`,
            true // Allow Web Share API
        );
    }
    
    async shareToFacebook() {
        console.log('=== Facebook Share Started ===');
        await this.shareProfile(
            'Facebook',
            'https://www.facebook.com/',
            true // Allow Web Share API
        );
    }
    
    async shareToWhatsApp() {
        console.log('=== WhatsApp Share Started ===');
        const text = encodeURIComponent(this.shareMessage);
        await this.shareProfile(
            'WhatsApp',
            `https://wa.me/?text=${text}`,
            true // Allow Web Share API - works great on mobile
        );
    }
    
    async shareToInstagram() {
        console.log('=== Instagram Share Started ===');
        await this.shareProfile(
            'Instagram',
            null, // Instagram has no web posting URL
            true // Allow Web Share API on mobile
        );
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimpleProfileGenerator();
});