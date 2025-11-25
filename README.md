# 🔐 Decoder Tools 

A powerful web-based tool for decoding encrypted HTML/JavaScript content with a modern interface and professional features.

## 🚀 Features

- **Advanced Decoding**: Multi-step algorithm for encrypted content
- **File Upload**: Support all file formats (HTML, TXT, JS, etc.)
- **Drag & Drop**: Modern file upload interface
- **View Source**: View encrypted source code
- **Hex Viewer**: Hexadecimal content analysis
- **Content Analysis**: Detailed file and security metrics
- **Multiple Export**: Download results in various formats
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Theme**: Theme customization

## 📁 File Structure
```bash
project/
├──index.html          # Main application
├──style.css           # Styles and themes
├──main.js             # Core functionality
└──README.md           # Documentation
```
## 🛠️ Usage

1. **Upload File**
   - Click upload area or drag & drop file
   - Supported formats: HTML, TXT, JS, etc.
   - Max file size: 10MB

2. **Process & Decode**
   - Click "Process & Decode" button
   - Automatic encrypted code detection
   - Multi-step decoding process

3. **View Results**
   - **Preview**: Original file content
   - **Source**: Extracted JavaScript code
   - **Decoded**: Decryption results
   - **Analysis**: File and security analysis
   - **Hex**: Hexadecimal view

4. **Export Options**
   - Copy to clipboard
   - Download as text/HTML
   - View in new window
   - Print results

## 🎯 Decoding Algorithm

7-step decoding process:
1. URI Component Decoding
2. Character Code Manipulation
3. Base64 Decoding
4. Split and Decode Parts
5. String Reversal
6. Final Base64 Decoding
7. Escape and URI Decoding

## ⌨️ Keyboard Shortcuts

- `Ctrl + O` - Open file
- `Ctrl + D` - Process file
- `Ctrl + L` - Clear all
- `Ctrl + S` - Save result

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Opera 50+

## 🔧 Technical Details

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Styling**: CSS Variables for theming
- **Icons**: Font Awesome 6.4.0
- **No Dependencies**: Pure vanilla JavaScript

## 📊 Features Overview

### Core Functionality
- File upload with progress indicator
- Automatic encrypted code detection
- Multi-format export options
- Real-time processing statistics

### UI/UX Features
- Responsive grid layout
- Smooth animations
- Theme customization
- Touch-friendly interface

### Advanced Tools
- Hexadecimal viewer
- Content analysis
- Security metrics
- Batch processing simulation

## 🔒 Privacy & Security

- All processing happens locally in browser
- No data sent to external servers
- Client-side only execution
- Secure file handling

## 🐛 Troubleshooting

**Common Issues:**
- Ensure file contains encrypted JavaScript code
- Check file size (max 10MB)
- Use supported file formats
- Refresh page if unresponsive

**Debug Mode:**
Open browser console (F12) to view processing logs.

## 📈 Performance

- Fast processing for files under 5MB
- Optimized memory usage
- Smooth 60fps animations
- Quick load time

---

**Version:** 2.1.0  
**Build:** 2024.12  
**License:** MIT
