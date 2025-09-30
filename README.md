# GEPA Profile Generator 🎯

A beautiful, responsive web application for creating professional GEPA (Graced Energy Professionals for Africa) profile pictures. Upload your photo, enter your details, and generate a branded profile image instantly!

![GEPA Profile Generator](https://img.shields.io/badge/Status-Ready-brightgreen) ![Mobile Friendly](https://img.shields.io/badge/Mobile-Friendly-blue) ![No Dependencies](https://img.shields.io/badge/Dependencies-None-orange)

## ✨ Features

- **🎨 Beautiful Design**: Modern teal theme matching GEPA branding
- **📱 Mobile Responsive**: Works perfectly on all devices
- **🚀 One-Click Generation**: Simple 3-step process
- **✅ Success Feedback**: Visual confirmation for uploads
- **🔍 Live Preview**: See changes in real-time
- **📸 Perfect Circles**: Properly positioned circular profile photos
- **⚡ No Server Required**: Pure client-side application

## 🎯 How It Works

1. **Upload** your profile photo
2. **Enter** your name and select your track
3. **Download** your branded GEPA profile

### Available Tracks
- Legal/Regulatory
- Engineering/Technical  
- Finance
- HR/Admin/Project Management

## 🚀 Quick Start

### Option 1: Direct Use
1. Clone this repository
2. Open `index.html` in any modern web browser
3. Start creating profiles!

### Option 2: Local Server
```bash
# Clone the repository
git clone https://github.com/yourusername/gepa-profile-generator.git
cd gepa-profile-generator

# Start a simple server (optional)
python -m http.server 3000
# Or use any other local server

# Open http://localhost:3000 in your browser
```

## 📱 Mobile Support

The application is fully optimized for mobile devices with:
- Touch-friendly interface
- Responsive layout  
- Drag & drop support (desktop)
- Camera integration (mobile)
- Optimized file handling

## 🛠️ Technical Details

- **Framework**: Vanilla JavaScript (no dependencies)
- **Canvas API**: For image manipulation and rendering
- **File API**: For drag & drop and file handling  
- **Responsive Design**: CSS Grid + Flexbox
- **Image Format**: Downloads as high-quality PNG
- **Browser Support**: All modern browsers

## 📁 File Structure

```
gepa-profile-generator/
├── index.html          # Main application file
├── styles.css          # Teal theme styling
├── script.js           # Application logic
├── template.jpg        # GEPA template image
├── package.json        # Project metadata
├── vercel.json         # Deployment configuration
└── README.md          # This file
```

## 🌐 Deployment

### GitHub Pages (Recommended)
1. Push to GitHub
2. Go to Settings > Pages
3. Select source branch
4. Your app will be available at `https://yourusername.github.io/gepa-profile-generator`

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
1. Drag and drop the folder to Netlify
2. Or connect your GitHub repository

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with ❤️ for the GEPA community**