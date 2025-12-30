# Mentor Certificate Generator

A simple web application to generate personalized mentor certificates for different departments.

## Features

- **Name Input**: Enter your full name
- **Department Selection**: Choose from Finance, Legal, Engineering/Technical, or HR/PM
- **PDF Annotation**: Automatically adds your name to the certificate in Poppins Bold font
- **Download**: Download the annotated certificate as a PDF file

## How to Use

1. Open `mentor_cert.html` in your web browser
2. Enter your full name in the name field
3. Select your department from the dropdown menu
4. Click "Generate Certificate"
5. Click "Download Certificate (PDF)" to save your certificate

## PDF Templates

The app uses the following PDF templates based on department:

- **Finance**: `GMP CERTIFICATE FINANCE.pdf`
- **Legal**: `GMP CERTIFICATE legal.pdf`
- **Engineering/Technical**: `GMP CERTIFICATE  NGINEERING TECHNICAL.pdf`
- **HR/PM**: `GMP CERTIFICATE HR PM.pdf`

## Configuration

To adjust the position of the name on the certificate, edit the `nameConfig` object in `mentor_cert.js`:

```javascript
this.nameConfig = {
    x: 150,           // X position from left (in PDF points)
    y: 320,           // Y position from bottom (in PDF points)
    fontSize: 24,     // Font size
    color: { r: 0, g: 0, b: 0 } // RGB color (0-1 scale)
};
```

### Finding the Right Position

1. Open your PDF in a PDF editor (like Adobe Acrobat)
2. Enable the ruler or grid
3. Measure the position where you want the name to appear
4. PDF coordinates start from the **bottom-left corner**
5. Adjust the `x` and `y` values accordingly

## Technical Details

- **PDF Library**: pdf-lib (v1.17.1)
- **Font**: Poppins Bold (loaded from Google Fonts)
- **Format**: PDF annotation (preserves original PDF quality)

## Running Locally

You can run this app using any local web server:

```bash
# Using Python
python -m http.server 3000

# Then open http://localhost:3000/mentor_cert.html
```

## Browser Compatibility

Works in all modern browsers that support ES6 and Canvas API:
- Chrome/Edge (recommended)
- Firefox
- Safari

---

**Note**: The position values are currently set to example coordinates. You'll need to adjust them based on where the name field appears in your specific PDF templates.
