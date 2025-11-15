class CertificateGenerator {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.certificateImg = null;
        this.userName = '';
        
        // DOM elements
        this.nameInput = document.getElementById('name-input');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadPngBtn = document.getElementById('download-png-btn');
        this.downloadPdfBtn = document.getElementById('download-pdf-btn');
        this.statusMessage = document.getElementById('status-message');
        this.downloadSection = document.getElementById('download-section');
        
        // State tracking
        this.certificateGenerated = false;
        this.certificateBlob = null;
        
        // Certificate text positioning (adjust these based on your certificate.jpg layout)
        // These are proportions of the canvas width/height (0 to 1)
        this.namePosition = {
            x: 0.33,      // Shifted right
            y: 0.53      // Position vertically on the line
        };
        
        // Font configuration
        this.fontConfig = {
            fontFamily: "'Lobster', cursive",
            fontSize: 0.045,       // Smaller font size to ensure it fits
            color: '#595959',      // Dark gray color
            maxWidth: 0.48         // Max width to stay within the line boundaries
        };
        
        this.init();
    }
    
    init() {
        this.loadCertificateTemplate();
        this.bindEvents();
        this.updateFormState();
    }
    
    bindEvents() {
        // Name input event
        this.nameInput.addEventListener('input', () => {
            this.userName = this.nameInput.value;
            this.drawCertificate();
            this.updateFormState();
        });
        
        // Generate button
        this.generateBtn.addEventListener('click', () => this.generateCertificate());
        
        // Download buttons
        this.downloadPngBtn.addEventListener('click', () => this.downloadCertificate('png'));
        this.downloadPdfBtn.addEventListener('click', () => this.downloadCertificate('pdf'));
    }
    
    loadCertificateTemplate() {
        this.certificateImg = new Image();
        this.certificateImg.crossOrigin = 'anonymous'; // Enable CORS if needed
        this.certificateImg.onload = () => {
            console.log('Certificate template loaded successfully');
            this.drawCertificate();
        };
        this.certificateImg.onerror = () => {
            console.error('Failed to load certificate.jpg');
            this.drawPlaceholder();
        };
        this.certificateImg.src = 'certificate.jpg';
    }
    
    drawPlaceholder() {
        // Draw a placeholder if certificate.jpg is not found
        this.ctx.fillStyle = '#f8fafa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw border
        this.ctx.strokeStyle = '#2d9a8c';
        this.ctx.lineWidth = 10;
        this.ctx.strokeRect(20, 20, this.canvas.width - 40, this.canvas.height - 40);
        
        // Draw placeholder text
        this.ctx.fillStyle = '#2d9a8c';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Certificate Template', this.canvas.width / 2, 100);
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#5a6b6b';
        this.ctx.fillText('(Place your certificate.jpg in the root folder)', this.canvas.width / 2, 130);
        
        // Draw name if available
        if (this.userName) {
            this.drawNameOnCanvas(this.ctx, this.canvas.width, this.canvas.height);
        }
    }
    
    drawCertificate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.certificateImg || !this.certificateImg.complete) {
            this.drawPlaceholder();
            return;
        }
        
        // Enable high quality rendering
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        // Draw certificate template to fit canvas
        const canvasAspect = this.canvas.width / this.canvas.height;
        const imageAspect = this.certificateImg.width / this.certificateImg.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imageAspect > canvasAspect) {
            // Image is wider - fit to height
            drawHeight = this.canvas.height;
            drawWidth = drawHeight * imageAspect;
            offsetX = (this.canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Image is taller - fit to width
            drawWidth = this.canvas.width;
            drawHeight = drawWidth / imageAspect;
            offsetX = 0;
            offsetY = (this.canvas.height - drawHeight) / 2;
        }
        
        this.ctx.drawImage(this.certificateImg, offsetX, offsetY, drawWidth, drawHeight);
        
        // Draw name if available
        if (this.userName) {
            this.drawNameOnCanvas(this.ctx, this.canvas.width, this.canvas.height);
        }
    }
    
    drawNameOnCanvas(ctx, canvasWidth, canvasHeight) {
        // Calculate position
        const x = canvasWidth * this.namePosition.x;
        const y = canvasHeight * this.namePosition.y;
        
        // Convert name to Title Case
        const titleCaseName = this.toTitleCase(this.userName);
        
        // Calculate maximum allowed width
        const maxWidth = canvasWidth * this.fontConfig.maxWidth;
        
        // Set initial font and style
        ctx.fillStyle = this.fontConfig.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Enable text smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Start with the configured font size and dynamically reduce until it fits on ONE LINE
        let fontSize = canvasWidth * this.fontConfig.fontSize;
        let currentFontSize = fontSize;
        const minFontSize = fontSize * 0.2; // Can go down to 20% of original size to fit on one line
        
        // Keep reducing font size until text fits on one line
        ctx.font = `${currentFontSize}px ${this.fontConfig.fontFamily}`;
        let textMetrics = ctx.measureText(titleCaseName);
        
        while (textMetrics.width > maxWidth && currentFontSize > minFontSize) {
            currentFontSize -= fontSize * 0.02; // Reduce by 2% each iteration for finer control
            ctx.font = `${currentFontSize}px ${this.fontConfig.fontFamily}`;
            textMetrics = ctx.measureText(titleCaseName);
        }
        
        // Draw the text on ONE LINE only
        ctx.fillText(titleCaseName, x, y);
    }
    
    toTitleCase(str) {
        return str.toLowerCase().split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }
    
    updateFormState() {
        const hasName = this.userName.trim().length > 0;
        
        // Update form styling
        this.nameInput.parentElement.classList.toggle('filled', hasName);
        
        // Update generate button state
        const canGenerate = hasName && !this.certificateGenerated;
        this.generateBtn.disabled = !canGenerate;
        
        // Show/hide download section based on generation state
        if (this.certificateGenerated) {
            this.downloadSection.style.display = 'block';
            this.generateBtn.style.display = 'none';
            this.statusMessage.style.display = 'none';
        } else {
            this.downloadSection.style.display = 'none';
            this.generateBtn.style.display = 'block';
            this.statusMessage.style.display = 'block';
        }
        
        // Update status message
        if (!this.certificateGenerated) {
            if (!hasName) {
                this.statusMessage.textContent = 'Please enter your name';
                this.statusMessage.style.color = '';
            } else {
                this.statusMessage.textContent = 'Ready to generate your certificate!';
                this.statusMessage.style.color = '#28a745';
            }
        }
    }
    
    generateCertificate() {
        if (!this.userName.trim()) {
            alert('Please enter your name.');
            return;
        }
        
        // Show generating message
        this.generateBtn.textContent = 'Generating...';
        this.generateBtn.disabled = true;
        
        // Generate high-resolution certificate
        this.generateHighResCertificate().then(() => {
            // Mark as generated
            this.certificateGenerated = true;
            
            // Update the UI to show download section
            this.updateFormState();
            
            // Scroll to download section
            setTimeout(() => {
                this.downloadSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });
    }
    
    async generateHighResCertificate() {
        return new Promise((resolve) => {
            // Create high-resolution canvas for download
            const downloadCanvas = document.createElement('canvas');
            const downloadCtx = downloadCanvas.getContext('2d');
            
            // Use original image dimensions for best quality
            const scale = 2; // 2x resolution
            downloadCanvas.width = this.certificateImg.width * scale;
            downloadCanvas.height = this.certificateImg.height * scale;
            
            // Enable high quality rendering
            downloadCtx.imageSmoothingEnabled = true;
            downloadCtx.imageSmoothingQuality = 'high';
            
            // Draw certificate at high resolution
            downloadCtx.drawImage(
                this.certificateImg, 
                0, 0, 
                downloadCanvas.width, 
                downloadCanvas.height
            );
            
            // Draw name at high resolution
            this.drawNameOnCanvas(downloadCtx, downloadCanvas.width, downloadCanvas.height);
            
            // Convert to blob
            downloadCanvas.toBlob((blob) => {
                this.certificateBlob = blob;
                console.log('High-resolution certificate generated');
                resolve();
            }, 'image/png', 1.0);
        });
    }
    
    downloadCertificate(format = 'png') {
        if (!this.certificateBlob) {
            alert('Please generate your certificate first.');
            return;
        }
        
        const fileName = `${this.userName.replace(/\s+/g, '_')}_Certificate`;
        
        if (format === 'pdf') {
            this.downloadAsPDF(fileName);
        } else {
            this.downloadAsPNG(fileName);
        }
    }
    
    downloadAsPNG(fileName) {
        // Create download link for PNG
        const url = URL.createObjectURL(this.certificateBlob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        this.showDownloadSuccess('PNG');
    }
    
    downloadAsPDF(fileName) {
        // Create a temporary image to convert blob to data URL
        const img = new Image();
        const url = URL.createObjectURL(this.certificateBlob);
        
        img.onload = () => {
            // Get image dimensions
            const imgWidth = img.width;
            const imgHeight = img.height;
            
            // Calculate PDF dimensions (A4 landscape or custom size based on image)
            const pdfWidth = imgWidth > imgHeight ? 297 : 210; // A4 dimensions in mm
            const pdfHeight = imgWidth > imgHeight ? 210 : 297;
            
            // Create PDF with jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            // Calculate scaling to fit the page
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
            const scaledWidth = imgWidth * ratio;
            const scaledHeight = imgHeight * ratio;
            
            // Center the image on the page
            const x = (pageWidth - scaledWidth) / 2;
            const y = (pageHeight - scaledHeight) / 2;
            
            // Add image to PDF
            pdf.addImage(img, 'PNG', x, y, scaledWidth, scaledHeight, undefined, 'FAST');
            
            // Download PDF
            pdf.save(`${fileName}.pdf`);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            this.showDownloadSuccess('PDF');
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(url);
            alert('Error creating PDF. Please try downloading as PNG instead.');
        };
        
        img.src = url;
    }
    
    showDownloadSuccess(format) {
        // Show success message
        const statusMsg = document.querySelector('.download-info');
        if (statusMsg) {
            const originalText = statusMsg.textContent;
            statusMsg.textContent = `✅ Certificate downloaded as ${format} successfully!`;
            statusMsg.style.color = '#28a745';
            setTimeout(() => {
                statusMsg.textContent = originalText;
                statusMsg.style.color = '';
            }, 3000);
        }
    }
}

// Initialize the certificate generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CertificateGenerator();
});
