class SimpleProfileGenerator {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.templateImg = null;
        this.userImg = null;
        this.userName = '';
        this.userTrack = '';
        
        // DOM elements
        this.photoUpload = document.getElementById('photo-upload');
        this.uploadArea = document.getElementById('upload-area');
        this.uploadSuccess = document.getElementById('upload-success');
        this.nameInput = document.getElementById('name-input');
        this.trackSelect = document.getElementById('track-select');
        this.downloadBtn = document.getElementById('download-btn');
        this.statusMessage = document.getElementById('status-message');
        
        // Fixed positioning (no user adjustment needed) - Using PROPER CONFIG values
        this.circlePosition = { x: 0.31, y: 0.645 };
        this.namePosition = { x: 0.7, y: 0.635 };
        this.trackPosition = { x: 0.7, y: 0.71 };
        
        // Fixed sizing configuration - Using PROPER CONFIG values
        this.config = {
            circleSize: 0.21,
            nameFontSize: 0.052,
            trackFontSize: 0.04,
            maxTextWidth: 0.29
        };
        
        this.init();
    }
    
    init() {
        this.loadTemplate();
        this.bindEvents();
        this.drawTemplate();
        this.updateFormState();
    }
    
    bindEvents() {
        // File upload events
        this.photoUpload.addEventListener('change', (e) => this.handleFileSelect(e));
        this.uploadArea.addEventListener('click', () => this.photoUpload.click());
        
        // Touch-friendly upload area
        this.uploadArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.uploadArea.style.transform = 'scale(0.98)';
        });
        
        this.uploadArea.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.uploadArea.style.transform = 'scale(1)';
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
        
        this.trackSelect.addEventListener('change', () => {
            this.userTrack = this.trackSelect.value;
            this.drawProfile();
            this.updateFormState();
        });
        
        // Download button
        this.downloadBtn.addEventListener('click', () => this.downloadProfile());
    }
    
    loadTemplate() {
        this.templateImg = new Image();
        this.templateImg.onload = () => {
            this.drawTemplate();
        };
        this.templateImg.src = 'template.jpg';
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
        if (file) {
            this.loadUserImage(file);
        }
    }
    
    loadUserImage(file) {
        if (file && file.type.startsWith('image/')) {
            this.uploadArea.classList.add('uploading');
            this.uploadSuccess.style.display = 'none';
            this.statusMessage.textContent = 'Uploading image...';
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.userImg = new Image();
                this.userImg.onload = () => {
                    this.uploadArea.classList.remove('uploading');
                    this.uploadArea.classList.add('uploaded');
                    
                    // Show success notification
                    this.showUploadSuccess();
                    
                    this.drawProfile();
                    this.updateFormState();
                };
                this.userImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
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
        
        // Calculate circle position based on template scale and position
        const circleX = templateX + (drawWidth * this.circlePosition.x);
        const circleY = templateY + (drawHeight * this.circlePosition.y);
        const circleRadius = drawWidth * this.config.circleSize;
        
        // Draw user image in circle
        this.ctx.save();
        
        // Create circular clipping mask
        this.ctx.beginPath();
        this.ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
        this.ctx.clip();
        
        // Calculate dimensions to fill the entire circle
        const imgAspect = this.userImg.width / this.userImg.height;
        const circleDiameter = circleRadius * 2;
        
        let imgWidth, imgHeight;
        if (imgAspect > 1) {
            // Wide image - make sure height covers the full circle
            imgHeight = circleDiameter;
            imgWidth = imgHeight * imgAspect;
        } else {
            // Tall image - make sure width covers the full circle
            imgWidth = circleDiameter;
            imgHeight = imgWidth / imgAspect;
        }
        
        // Center the image in the circle
        const imgX = circleX - imgWidth / 2;
        const imgY = circleY - imgHeight / 2;
        
        // Draw image
        this.ctx.drawImage(this.userImg, imgX, imgY, imgWidth, imgHeight);
        this.ctx.restore();
        
        // Draw text if available
        if (this.userName) {
            const textX = templateX + (drawWidth * this.namePosition.x);
            const nameY = templateY + (drawHeight * this.namePosition.y);
            
            this.ctx.fillStyle = '#000000';
            this.ctx.textAlign = 'center';
            this.drawConstrainedText(textX, nameY, this.userName.toUpperCase(), drawWidth, true);
        }
        
        if (this.userTrack) {
            const textX = templateX + (drawWidth * this.trackPosition.x);
            const trackY = templateY + (drawHeight * this.trackPosition.y);
            
            this.ctx.fillStyle = '#555555';
            this.drawConstrainedText(textX, trackY, this.userTrack, drawWidth, false);
        }
    }
    
    drawConstrainedText(x, y, text, templateWidth, isBold = false) {
        const baseFontSize = templateWidth * (isBold ? this.config.nameFontSize : this.config.trackFontSize);
        const minFontSize = isBold ? 12 : 10;
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
        const hasTrack = this.userTrack.length > 0;
        
        // Update form styling
        this.nameInput.parentElement.classList.toggle('filled', hasName);
        this.trackSelect.parentElement.classList.toggle('filled', hasTrack);
        
        // Update button state
        const canDownload = hasImage && hasName && hasTrack;
        this.downloadBtn.disabled = !canDownload;
        
        // Update status message
        if (!hasImage) {
            this.statusMessage.textContent = 'Please upload a photo';
        } else if (!hasName) {
            this.statusMessage.textContent = 'Please enter your name';
        } else if (!hasTrack) {
            this.statusMessage.textContent = 'Please select your track';
        } else {
            this.statusMessage.textContent = 'Ready to generate profile!';
            this.statusMessage.style.color = '#28a745';
        }
    }
    
    downloadProfile() {
        if (!this.userImg || !this.userName || !this.userTrack) {
            alert('Please complete all fields before downloading.');
            return;
        }
        
        // Create high-resolution canvas for download
        const downloadCanvas = document.createElement('canvas');
        const downloadCtx = downloadCanvas.getContext('2d');
        
        // Use the original template dimensions for download (2x scale for high quality)
        const scale = 2;
        downloadCanvas.width = this.templateImg.width * scale;
        downloadCanvas.height = this.templateImg.height * scale;
        
        // Enable high quality rendering
        downloadCtx.imageSmoothingEnabled = true;
        downloadCtx.imageSmoothingQuality = 'high';
        
        // Draw template at full resolution
        downloadCtx.drawImage(this.templateImg, 0, 0, downloadCanvas.width, downloadCanvas.height);
        
        // Calculate positions based on original template size
        const templateWidth = downloadCanvas.width;
        const templateHeight = downloadCanvas.height;
        
        // Calculate circle position and size
        const circleX = templateWidth * this.circlePosition.x;
        const circleY = templateHeight * this.circlePosition.y;
        const circleRadius = templateWidth * this.config.circleSize;
        
        // Draw user image in circle
        downloadCtx.save();
        downloadCtx.beginPath();
        downloadCtx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
        downloadCtx.clip();
        
        // Calculate image dimensions to fill the entire circle
        const imgAspect = this.userImg.width / this.userImg.height;
        const circleDiameter = circleRadius * 2;
        
        let imgWidth, imgHeight;
        if (imgAspect > 1) {
            imgHeight = circleDiameter;
            imgWidth = imgHeight * imgAspect;
        } else {
            imgWidth = circleDiameter;
            imgHeight = imgWidth / imgAspect;
        }
        
        const imgX = circleX - imgWidth / 2;
        const imgY = circleY - imgHeight / 2;
        
        downloadCtx.drawImage(this.userImg, imgX, imgY, imgWidth, imgHeight);
        downloadCtx.restore();
        
        // Draw text
        const nameX = templateWidth * this.namePosition.x;
        const nameY = templateHeight * this.namePosition.y;
        const trackX = templateWidth * this.trackPosition.x;
        const trackY = templateHeight * this.trackPosition.y;
        
        // Draw name text
        downloadCtx.fillStyle = '#000000';
        downloadCtx.textAlign = 'center';
        this.drawHighResText(downloadCtx, nameX, nameY, this.userName.toUpperCase(), templateWidth, true);
        
        // Draw track text
        downloadCtx.fillStyle = '#555555';
        this.drawHighResText(downloadCtx, trackX, trackY, this.userTrack, templateWidth, false);
        
        // Create download link
        const link = document.createElement('a');
        const fileName = `${this.userName.replace(/\s+/g, '_')}_GEPA_Profile.png`;
        
        downloadCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
    }
    
    drawHighResText(ctx, x, y, text, templateWidth, isBold = false) {
        const baseFontSize = templateWidth * (isBold ? this.config.nameFontSize : this.config.trackFontSize);
        const minFontSize = isBold ? 24 : 20; // Higher minimum for high-res
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimpleProfileGenerator();
});