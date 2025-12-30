class MentorCertificateGenerator {
    constructor() {
        // DOM elements
        this.nameInput = document.getElementById('name-input');
        this.departmentSelect = document.getElementById('department-select');
        this.generateBtn = document.getElementById('generate-btn');
        this.downloadPdfBtn = document.getElementById('download-pdf-btn');
        this.statusMessage = document.getElementById('status-message');
        this.downloadSection = document.getElementById('download-section');
        this.previewCanvas = document.getElementById('pdf-preview-canvas');
        this.previewPlaceholder = document.getElementById('preview-placeholder');
        
        // State
        this.userName = '';
        this.selectedDepartment = '';
        this.certificateGenerated = false;
        this.modifiedPdfBytes = null;
        this.poppinsFontBytes = null;
        
        // Department to PDF file mapping
        this.departmentFiles = {
            'finance': 'GMP CERTIFICATE FINANCE.pdf',
            'legal': 'GMP CERTIFICATE legal.pdf',
            'engineering': 'GMP CERTIFICATE  NGINEERING TECHNICAL.pdf',
            'hr': 'GMP CERTIFICATE HR PM.pdf'
        };
        
        // Name positioning configuration (adjust these based on your PDF layout)
        // These values are in PDF points (72 points = 1 inch)
        this.nameConfig = {
            x: 81,           // X position from left 
            y: 360,           // Y position from bottom (PDF coordinates start from bottom)
            fontSize: 32,     // Font size in points (larger for prominence)
            color: { r: 0, g: 0, b: 0 } // Black color (RGB 0-1 scale)
        };
        
        this.init();
    }
    
    async init() {
        console.log('Initializing Mentor Certificate Generator...');
        try {
            await this.loadPoppinsFont();
            this.bindEvents();
            this.updateFormState();
            console.log('Initialization complete!');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showStatus('App initialization error: ' + error.message, 'error');
        }
    }
    
    async loadPoppinsFont() {
        try {
            console.log('Loading Poppins Bold font...');
            // Load from local file first
            const fontUrl = 'Poppins-Bold.ttf';
            console.log('Loading font from:', fontUrl);
            const response = await fetch(fontUrl);
            if (response.ok) {
                this.poppinsFontBytes = await response.arrayBuffer();
                console.log('Poppins Bold font loaded successfully! Size:', this.poppinsFontBytes.byteLength, 'bytes');
            } else {
                throw new Error('Font fetch failed: ' + response.status);
            }
        } catch (error) {
            console.error('Error loading Poppins font:', error);
            this.showStatus('Font loading failed. Using standard font.', 'error');
        }
    }
    
    // Convert to Title Case
    toTitleCase(str) {
        return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }
    
    bindEvents() {
        // Name input event
        this.nameInput.addEventListener('input', () => {
            this.userName = this.toTitleCase(this.nameInput.value.trim());
            this.updateFormState();
            this.updatePreview();
        });
        
        // Department select event
        this.departmentSelect.addEventListener('change', () => {
            this.selectedDepartment = this.departmentSelect.value;
            this.updateFormState();
            this.updatePreview();
        });
        
        // Generate button event
        this.generateBtn.addEventListener('click', () => {
            this.generateCertificate();
        });
        
        // Download button event
        this.downloadPdfBtn.addEventListener('click', () => {
            this.downloadCertificate();
        });
    }
    
    updateFormState() {
        // Enable generate button only if both name and department are selected
        const canGenerate = this.userName.length > 0 && this.selectedDepartment !== '';
        this.generateBtn.disabled = !canGenerate;
        
        // Reset certificate state when inputs change
        if (this.certificateGenerated) {
            this.certificateGenerated = false;
            this.downloadSection.style.display = 'none';
        }
    }
    
    async updatePreview() {
        if (this.userName && this.selectedDepartment) {
            try {
                this.previewPlaceholder.style.display = 'none';
                this.previewCanvas.style.display = 'block';
                await this.renderPdfPreview();
            } catch (error) {
                console.error('Error updating preview:', error);
            }
        } else {
            this.previewPlaceholder.style.display = 'block';
            this.previewCanvas.style.display = 'none';
        }
    }
    
    async loadPdfFile(filename) {
        try {
            console.log('Attempting to load PDF:', filename);
            const response = await fetch(filename);
            console.log('Fetch response status:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}: ${response.status} ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            console.log('PDF loaded successfully, size:', arrayBuffer.byteLength, 'bytes');
            return arrayBuffer;
        } catch (error) {
            console.error('Error loading PDF file:', error);
            throw error;
        }
    }
    
    async renderPdfPreview() {
        try {
            const ctx = this.previewCanvas.getContext('2d');
            this.previewCanvas.width = 600;
            this.previewCanvas.height = 400;
            
            // Background
            ctx.fillStyle = '#f5f5dc';
            ctx.fillRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
            
            // Border
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 3;
            ctx.strokeRect(20, 20, this.previewCanvas.width - 40, this.previewCanvas.height - 40);
            
            // Title
            ctx.fillStyle = '#333333';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('This is to certify that', this.previewCanvas.width / 2, 80);
            
            // Name in Poppins Bold (Title Case)
            ctx.font = 'bold 32px Poppins, Arial';
            ctx.fillStyle = '#000000';
            ctx.fillText(this.userName, this.previewCanvas.width / 2, 140);
            
            // Underline
            const textWidth = ctx.measureText(this.userName).width;
            ctx.strokeStyle = '#4a9ead';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo((this.previewCanvas.width - textWidth) / 2, 155);
            ctx.lineTo((this.previewCanvas.width + textWidth) / 2, 155);
            ctx.stroke();
            
            // Description
            ctx.font = '16px Arial';
            ctx.fillStyle = '#333333';
            ctx.fillText('has successfully completed the 3 month GEPA mentorship', this.previewCanvas.width / 2, 200);
            ctx.fillText(`programme in (${this.selectedDepartment.charAt(0).toUpperCase() + this.selectedDepartment.slice(1)}).`, this.previewCanvas.width / 2, 230);
            
            // Note
            ctx.font = 'italic 14px Arial';
            ctx.fillStyle = '#666666';
            ctx.fillText('Preview - Click "Generate Certificate" to create your PDF', this.previewCanvas.width / 2, 320);
            
        } catch (error) {
            console.error('Error rendering preview:', error);
        }
    }
    
    async generateCertificate() {
        if (!this.userName || !this.selectedDepartment) {
            this.showStatus('Please enter your name and select a department', 'error');
            return;
        }
        
        console.log('Starting certificate generation...');
        console.log('Name:', this.userName);
        console.log('Department:', this.selectedDepartment);
        
        this.showStatus('Generating certificate...', 'loading');
        this.generateBtn.disabled = true;
        
        try {
            if (typeof PDFLib === 'undefined') {
                throw new Error('PDF library not loaded. Please refresh the page.');
            }
            
            const { PDFDocument, rgb } = PDFLib;
            console.log('PDF library loaded successfully');
            
            // Load the appropriate PDF template
            const pdfFile = this.departmentFiles[this.selectedDepartment];
            console.log('Selected department:', this.selectedDepartment);
            console.log('PDF file to load:', pdfFile);
            const existingPdfBytes = await this.loadPdfFile(pdfFile);
            console.log('PDF loaded, size:', existingPdfBytes.byteLength, 'bytes');
            
            // Load the PDF
            let pdfDoc;
            try {
                pdfDoc = await PDFDocument.load(existingPdfBytes);
                console.log('PDF document parsed successfully');
                console.log('Number of pages:', pdfDoc.getPageCount());
            } catch (pdfError) {
                console.error('PDF parsing error:', pdfError);
                throw new Error(`The ${this.selectedDepartment} PDF file appears to be corrupted. Please re-upload the PDF file.`);
            }
            
            // Get the first page
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            const { width, height } = firstPage.getSize();
            
            console.log('PDF dimensions:', width, 'x', height);
            console.log('Text position:', this.nameConfig.x, ',', height - this.nameConfig.y);
            
            // Convert name to Title Case
            const titleCaseName = this.toTitleCase(this.userName);
            console.log('Drawing name:', titleCaseName);
            
            let poppinsFont = null;
            
            // Try to embed Poppins Bold if available
            if (this.poppinsFontBytes) {
                try {
                    if (typeof fontkit === 'undefined') {
                        console.warn('Fontkit library not loaded. Using standard font.');
                    } else {
                        pdfDoc.registerFontkit(fontkit);
                        poppinsFont = await pdfDoc.embedFont(this.poppinsFontBytes);
                        console.log('Poppins Bold font embedded successfully');
                    }
                } catch (fontError) {
                    console.error('Error embedding custom font:', fontError);
                    console.log('Falling back to standard font');
                }
            }
            
            // Use Poppins if available, otherwise use Helvetica Bold
            const font = poppinsFont || await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
            console.log('Using font:', poppinsFont ? 'Poppins Bold' : 'Helvetica Bold');
            
            // Draw the name on the certificate in Title Case
            firstPage.drawText(titleCaseName, {
                x: this.nameConfig.x,
                y: height - this.nameConfig.y,
                size: this.nameConfig.fontSize,
                font: font,
                color: rgb(
                    this.nameConfig.color.r,
                    this.nameConfig.color.g,
                    this.nameConfig.color.b
                ),
            });
            console.log('Text drawn successfully');
            
            // Save the modified PDF
            this.modifiedPdfBytes = await pdfDoc.save();
            console.log('PDF saved successfully');
            
            this.certificateGenerated = true;
            this.showStatus('Certificate generated successfully!', 'success');
            this.downloadSection.style.display = 'block';
            
        } catch (error) {
            console.error('Error generating certificate:', error);
            console.error('Error stack:', error.stack);
            this.showStatus('Error: ' + error.message, 'error');
        } finally {
            this.generateBtn.disabled = false;
        }
    }
    
    downloadCertificate() {
        if (!this.modifiedPdfBytes) {
            this.showStatus('No certificate to download', 'error');
            return;
        }
        
        try {
            // Create a blob from the PDF bytes
            const blob = new Blob([this.modifiedPdfBytes], { type: 'application/pdf' });
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.userName.replace(/\s+/g, '_')}_${this.selectedDepartment}_certificate.pdf`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            this.showStatus('Certificate downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Error downloading certificate:', error);
            this.showStatus('Error downloading certificate', 'error');
        }
    }
    
    showStatus(message, type = 'info') {
        this.statusMessage.textContent = message;
        this.statusMessage.className = 'status-message';
        
        if (type === 'error') {
            this.statusMessage.classList.add('error');
        } else if (type === 'success') {
            this.statusMessage.classList.add('success');
        } else if (type === 'loading') {
            this.statusMessage.classList.add('loading');
        }
        
        this.statusMessage.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.statusMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize the certificate generator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MentorCertificateGenerator();
});
