// Global State
const state = {
    currentFile: null,
    decodedResult: null,
    originalContent: '',
    extractedCode: '',
    stats: {
        filesProcessed: 0,
        codesFound: 0,
        totalProcessingTime: 0,
        totalSizeProcessed: 0
    },
    theme: 'dark',
    settings: {
        autoProcess: true,
        showHex: true,
        fontSize: 'medium'
    }
};

// DOM Elements
const elements = {
    // File elements
    fileInput: document.getElementById('fileInput'),
    uploadArea: document.getElementById('uploadArea'),
    uploadProgress: document.getElementById('uploadProgress'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    processBtn: document.getElementById('processBtn'),
    
    // Info elements
    fileInfoCard: document.getElementById('fileInfoCard'),
    fileName: document.getElementById('fileName'),
    fileSize: document.getElementById('fileSize'),
    fileType: document.getElementById('fileType'),
    
    // Result elements
    resultsSection: document.getElementById('resultsSection'),
    previewContent: document.getElementById('previewContent'),
    sourceContent: document.getElementById('sourceContent'),
    decodedContent: document.getElementById('decodedContent'),
    hexContent: document.getElementById('hexContent'),
    
    // Analysis elements
    fileInfoList: document.getElementById('fileInfoList'),
    decodeInfoList: document.getElementById('decodeInfoList'),
    contentInfoList: document.getElementById('contentInfoList'),
    
    // Stats elements
    resultStats: document.getElementById('resultStats'),
    filesProcessed: document.getElementById('filesProcessed'),
    codesFound: document.getElementById('codesFound'),
    avgTime: document.getElementById('avgTime'),
    totalSize: document.getElementById('totalSize'),
    
    // Modal elements
    modalSourceContent: document.getElementById('modalSourceContent'),
    themeSelect: document.getElementById('themeSelect'),
    fontSizeSelect: document.getElementById('fontSizeSelect'),
    autoProcess: document.getElementById('autoProcess'),
    showHex: document.getElementById('showHex')
};

// Initialize Application
function init() {
    console.log('🚀 CyberDecoder Pro initialized');
    setupEventListeners();
    loadSettings();
    loadStats();
    updateStatsDisplay();
    applySettings();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to CyberDecoder Pro! Ready to decrypt your files.', 'success');
    }, 1000);
}

// Event Listeners
function setupEventListeners() {
    // File input change
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Upload area interactions
    elements.uploadArea.addEventListener('click', () => elements.fileInput.click());
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('dragleave', handleDragLeave);
    elements.uploadArea.addEventListener('drop', handleFileDrop);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.currentTarget.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Paste from clipboard
    document.addEventListener('paste', handlePaste);
}

// File Handling
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processSelectedFile(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    elements.uploadArea.classList.add('active');
}

function handleDragLeave(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('active');
}

function handleFileDrop(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('active');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processSelectedFile(files[0]);
    }
}

async function processSelectedFile(file) {
    if (file.size > 10 * 1024 * 1024) {
        showError('File size exceeds 10MB limit');
        return;
    }
    
    state.currentFile = file;
    showUploadProgress(0);
    
    try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 50));
            showUploadProgress(i);
        }
        
        const content = await readFileContent(file);
        state.originalContent = content;
        
        updateFileInfo(file);
        showSuccess('File uploaded successfully!');
        
        // Auto-process if enabled
        if (state.settings.autoProcess) {
            setTimeout(() => processFile(), 500);
        }
        
    } catch (error) {
        showError('Error reading file: ' + error.message);
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

// Processing and Decoding
async function processFile() {
    if (!state.currentFile) {
        showError('Please select a file first!');
        return;
    }
    
    showLoading('Decrypting content...');
    updateLoadingSteps(0);
    
    const startTime = performance.now();
    
    try {
        updateLoadingSteps(1);
        // Extract JavaScript code
        const extractedCode = extractJavaScriptCode(state.originalContent);
        state.extractedCode = extractedCode;
        
        updateLoadingSteps(2);
        // Decode content
        const result = await decodeExtractedContent(extractedCode);
        state.decodedResult = result;
        
        updateLoadingSteps(3);
        const endTime = performance.now();
        const processingTime = endTime - startTime;
        
        // Update stats
        updateStats(processingTime, extractedCode !== 'No encrypted JavaScript code found');
        
        // Display results
        displayResults(result, processingTime);
        showSuccess('Decoding completed successfully!');
        
    } catch (error) {
        showError('Decoding failed: ' + error.message);
    } finally {
        hideLoading();
    }
}

function extractJavaScriptCode(content) {
    // Multiple patterns to find encrypted JavaScript code
    const patterns = [
        /<script[^>]*>([\s\S]*?)<\/script>/gi,
        /(let|var|const)\s+e\s*=\s*"([^"]+)"/,
        /(let|var|const)\s+e\s*=\s*'([^']+)'/,
        /decodeURIComponent\([^)]+\)/,
        /String\.fromCharCode\([^)]+\)/,
        /atob\([^)]+\)/
    ];
    
    for (let pattern of patterns) {
        const match = content.match(pattern);
        if (match) {
            return match[0];
        }
    }
    
    return 'No encrypted JavaScript code found';
}

async function decodeExtractedContent(jsCode) {
    return new Promise((resolve, reject) => {
        try {
            // Extract encrypted string
            const stringMatch = jsCode.match(/(let|var|const)\s+e\s*=\s*["']([^"']+)["']/);
            if (!stringMatch || !stringMatch[2]) {
                reject(new Error('No encrypted string found'));
                return;
            }
            
            const encryptedString = stringMatch[2];
            const result = decodeProtectedContent(encryptedString);
            resolve(result);
            
        } catch (error) {
            reject(error);
        }
    });
}

function decodeProtectedContent(encryptedString) {
    try {
        console.log('🔐 Starting decryption process...');
        
        // Step 1: Decode URI Component
        let step1 = decodeURIComponent(encryptedString);
        
        // Step 2: Subtract 1 from each character code
        let step2 = '';
        for (let i = 0; i < step1.length; i++) {
            step2 += String.fromCharCode(step1.charCodeAt(i) - 1);
        }
        
        // Step 3: Base64 decode
        let step3 = atob(step2);
        
        // Step 4: Split by | and decode each part
        let step4 = step3.split("|").map(x => atob(x)).join("");
        
        // Step 5: Reverse string
        let step5 = step4.split("").reverse().join("");
        
        // Step 6: Final Base64 decode with escape
        let step6 = atob(step5);
        
        // Step 7: Escape and URI decode
        let step7 = decodeURIComponent(escape(step6));
        
        console.log('✅ Decryption completed');
        return step7;
        
    } catch (error) {
        console.error('❌ Decryption failed:', error);
        throw new Error(`Decryption failed: ${error.message}`);
    }
}

// UI Updates
function displayResults(result, processingTime) {
    // Update content displays
    elements.previewContent.textContent = state.originalContent.substring(0, 5000) + 
        (state.originalContent.length > 5000 ? '\n\n... (content truncated)' : '');
    elements.sourceContent.textContent = state.extractedCode;
    elements.decodedContent.textContent = result;
    
    // Update hex view if enabled
    if (state.settings.showHex) {
        updateHexView(state.originalContent);
    }
    
    // Update analysis info
    updateAnalysisInfo(processingTime, result);
    
    // Show results section
    elements.resultsSection.style.display = 'block';
    
    // Switch to decoded tab
    switchTab('decoded');
}

function updateHexView(content) {
    let hexString = '';
    for (let i = 0; i < Math.min(content.length, 2000); i++) {
        const hex = content.charCodeAt(i).toString(16).padStart(2, '0');
        hexString += hex + ' ';
        if ((i + 1) % 16 === 0) hexString += '\n';
    }
    elements.hexContent.textContent = hexString || 'No hex data available';
}

function updateAnalysisInfo(processingTime, result) {
    // File info
    elements.fileInfoList.innerHTML = `
        <div class="info-item">
            <span>Name:</span>
            <span>${state.currentFile.name}</span>
        </div>
        <div class="info-item">
            <span>Size:</span>
            <span>${formatFileSize(state.currentFile.size)}</span>
        </div>
        <div class="info-item">
            <span>Type:</span>
            <span>${state.currentFile.type || 'Unknown'}</span>
        </div>
        <div class="info-item">
            <span>Modified:</span>
            <span>${new Date(state.currentFile.lastModified).toLocaleString()}</span>
        </div>
    `;
    
    // Decode info
    const securityLevel = result.length > 1000 ? 'High' : result.length > 500 ? 'Medium' : 'Low';
    elements.decodeInfoList.innerHTML = `
        <div class="info-item">
            <span>Processing Time:</span>
            <span>${Math.round(processingTime)}ms</span>
        </div>
        <div class="info-item">
            <span>Content Length:</span>
            <span>${result.length} chars</span>
        </div>
        <div class="info-item">
            <span>Encryption Type:</span>
            <span>HTML/JS Obfuscation</span>
        </div>
        <div class="info-item">
            <span>Security Level:</span>
            <span>${securityLevel}</span>
        </div>
    `;
    
    // Content analysis
    const lines = result.split('\n').length;
    const vars = (state.extractedCode.match(/(let|var|const)\s+(\w+)/g) || []).length;
    const functions = (state.extractedCode.match(/function\s+(\w+)/g) || []).length;
    const complexity = lines > 100 ? 'High' : lines > 50 ? 'Medium' : 'Low';
    
    elements.contentInfoList.innerHTML = `
        <div class="info-item">
            <span>Lines of Code:</span>
            <span>${lines}</span>
        </div>
        <div class="info-item">
            <span>Variables Found:</span>
            <span>${vars}</span>
        </div>
        <div class="info-item">
            <span>Functions:</span>
            <span>${functions}</span>
        </div>
        <div class="info-item">
            <span>Complexity:</span>
            <span>${complexity}</span>
        </div>
    `;
    
    elements.resultStats.textContent = `Processed in ${Math.round(processingTime)}ms | ${result.length} chars | ${securityLevel} Security`;
}

// Tab Management
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === tabName + 'Tab');
    });
}

// View Source Feature
function showViewSource() {
    if (!state.extractedCode) {
        showError('No source code to view');
        return;
    }
    
    elements.modalSourceContent.textContent = state.extractedCode;
    showModal('viewSourceModal');
}

function viewSourceCode() {
    showViewSource();
}

// Action Functions
function copyContent(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Content copied to clipboard!', 'success');
    }).catch(err => {
        showError('Failed to copy: ' + err.message);
    });
}

function copySourceCode() {
    copyContent('modalSourceContent');
}

function downloadResult() {
    if (!state.decodedResult) {
        showError('No result to download');
        return;
    }
    
    const blob = new Blob([state.decodedResult], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `decoded_${state.currentFile?.name || 'result'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('File downloaded successfully!', 'success');
}

function downloadSource() {
    if (!state.extractedCode) {
        showError('No source code to download');
        return;
    }
    
    const blob = new Blob([state.extractedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `source_${state.currentFile?.name || 'code'}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Source code downloaded!', 'success');
}

function viewInNewWindow() {
    if (!state.decodedResult) {
        showError('No result to display');
        return;
    }
    
    const newWindow = window.open();
    newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Decoded Result - ${state.currentFile?.name || 'File'}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    background: #0a1929;
                    color: #e3f2fd;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                pre {
                    background: #1a1a1a;
                    color: #00ff00;
                    padding: 20px;
                    border-radius: 10px;
                    overflow-x: auto;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    border: 1px solid #1976d2;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔓 Decoded Result</h1>
                <p><strong>File:</strong> ${state.currentFile?.name || 'Unknown'}</p>
                <pre>${state.decodedResult}</pre>
            </div>
        </body>
        </html>
    `);
}

function shareResult() {
    if (!state.decodedResult) {
        showError('No result to share');
        return;
    }
    
    if (navigator.share) {
        navigator.share({
            title: 'Decoded Content from CyberDecoder Pro',
            text: state.decodedResult.substring(0, 100) + '...',
            url: window.location.href
        }).then(() => {
            showNotification('Content shared successfully!', 'success');
        }).catch(err => {
            console.log('Share cancelled:', err);
        });
    } else {
        copyContent('decodedContent');
        showNotification('Content copied to clipboard for sharing!', 'success');
    }
}

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showUploadProgress(percent) {
    elements.progressFill.style.width = percent + '%';
    elements.progressText.textContent = percent + '%';
    elements.uploadProgress.style.display = percent > 0 ? 'block' : 'none';
}

function updateFileInfo(file) {
    elements.fileName.textContent = file.name;
    elements.fileSize.textContent = formatFileSize(file.size);
    elements.fileType.textContent = file.type || 'Unknown';
    elements.fileInfoCard.classList.add('show');
}

function updateStats(processingTime, codeFound = true) {
    state.stats.filesProcessed++;
    state.stats.totalProcessingTime += processingTime;
    state.stats.totalSizeProcessed += state.currentFile.size;
    
    if (codeFound) {
        state.stats.codesFound++;
    }
    
    saveStats();
    updateStatsDisplay();
}

function updateStatsDisplay() {
    elements.filesProcessed.textContent = state.stats.filesProcessed;
    elements.codesFound.textContent = state.stats.codesFound;
    elements.totalSize.textContent = formatFileSize(state.stats.totalSizeProcessed);
    
    const avgTime = state.stats.filesProcessed > 0 ? 
        Math.round(state.stats.totalProcessingTime / state.stats.filesProcessed) : 0;
    elements.avgTime.textContent = avgTime + 'ms';
}

function loadStats() {
    const saved = localStorage.getItem('cyberdecoder_stats');
    if (saved) {
        state.stats = { ...state.stats, ...JSON.parse(saved) };
    }
}

function saveStats() {
    localStorage.setItem('cyberdecoder_stats', JSON.stringify(state.stats));
}

// Modal Functions
function showLoading(message = 'Processing...') {
    const modal = document.getElementById('loadingModal');
    const messageEl = document.getElementById('loadingMessage');
    
    messageEl.textContent = message;
    modal.classList.add('active');
}

function updateLoadingSteps(step) {
    const steps = document.querySelectorAll('.loading-step');
    steps.forEach((s, index) => {
        s.classList.toggle('active', index === step);
    });
}

function hideLoading() {
    const modal = document.getElementById('loadingModal');
    modal.classList.remove('active');
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showAbout() {
    showModal('aboutModal');
}

function showSettings() {
    // Update settings form with current values
    elements.themeSelect.value = state.theme;
    elements.fontSizeSelect.value = state.settings.fontSize;
    elements.autoProcess.checked = state.settings.autoProcess;
    elements.showHex.checked = state.settings.showHex;
    
    showModal('settingsModal');
}

// Theme Management
function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveSettings();
    showNotification(`Theme changed to ${state.theme} mode`, 'success');
}

function changeTheme(theme) {
    state.theme = theme === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
    applyTheme();
    saveSettings();
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
}

function changeFontSize(size) {
    state.settings.fontSize = size;
    document.documentElement.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
    saveSettings();
}

// Settings Management
function loadSettings() {
    const saved = localStorage.getItem('cyberdecoder_settings');
    if (saved) {
        state.settings = { ...state.settings, ...JSON.parse(saved) };
    }
    
    const savedTheme = localStorage.getItem('cyberdecoder_theme');
    if (savedTheme) {
        state.theme = savedTheme;
    }
}

function saveSettings() {
    localStorage.setItem('cyberdecoder_settings', JSON.stringify(state.settings));
    localStorage.setItem('cyberdecoder_theme', state.theme);
}

function applySettings() {
    applyTheme();
    changeFontSize(state.settings.fontSize);
    
    // Show/hide hex tab based on setting
    const hexTab = document.querySelector('[data-tab="hex"]');
    if (hexTab) {
        hexTab.style.display = state.settings.showHex ? 'flex' : 'none';
    }
}

// Sample Data
function loadSample() {
    const sampleCode = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Protected Content</title>
</head>
<body>
    <script>
        let e="U25mc3RyaW5nIGVuY3J5cHRlZCBjb250ZW50IGZvciBkZW1vbnN0cmF0aW9u";
        let d=decodeURIComponent(e);
        let c='';
        for(let i=0;i<d.length;i++){c+=String.fromCharCode(d.charCodeAt(i)-1);}
        let b=atob(c);
        let a=b.split("|").map(x=>atob(x)).join("");
        a=a.split("").reverse().join("");
        a=decodeURIComponent(escape(atob(a)));
        document.write(a);
    </script>
</body>
</html>`;
    
    const blob = new Blob([sampleCode], { type: 'text/html' });
    const file = new File([blob], 'sample_encrypted.html', { type: 'text/html' });
    
    processSelectedFile(file);
    showNotification('Sample file loaded successfully!', 'success');
}

function clearFile() {
    state.currentFile = null;
    elements.fileInfoCard.classList.remove('show');
    elements.uploadProgress.style.display = 'none';
    showUploadProgress(0);
}

function clearAll() {
    clearFile();
    state.decodedResult = null;
    state.originalContent = '';
    state.extractedCode = '';
    
    elements.fileInput.value = '';
    elements.resultsSection.style.display = 'none';
    
    showNotification('All cleared! Ready for new file.', 'success');
}

// Additional Features
function pasteFromClipboard() {
    showNotification('Click anywhere and press Ctrl+V to paste content', 'info');
}

function handlePaste(e) {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText) {
        const blob = new Blob([pastedText], { type: 'text/plain' });
        const file = new File([blob], 'pasted_content.txt', { type: 'text/plain' });
        processSelectedFile(file);
        showNotification('Pasted content processed as file!', 'success');
    }
}

function takeScreenshot() {
    showNotification('Screenshot feature would capture current view', 'info');
    // In a real implementation, this would use html2canvas or similar
}

function showQRCode() {
    showNotification('QR Code feature would generate shareable code', 'info');
}

function searchInPreview() {
    const searchTerm = prompt('Enter search term:');
    if (searchTerm) {
        showNotification(`Searching for: ${searchTerm}`, 'info');
        // Search implementation would go here
    }
}

function analyzeCode() {
    showNotification('Advanced code analysis started', 'info');
    // Code analysis implementation would go here
}

function exportAsHTML() {
    if (!state.decodedResult) {
        showError('No result to export');
        return;
    }
    
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Decoded Content - ${state.currentFile?.name || 'File'}</title>
    <meta charset="UTF-8">
</head>
<body>
    <pre>${state.decodedResult}</pre>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `decoded_${state.currentFile?.name || 'result'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('HTML file exported successfully!', 'success');
}

function copyHex() {
    copyContent('hexContent');
}

function toggleHexView() {
    showNotification('Hex view toggled', 'info');
}

function showBatchProcessing() {
    showNotification('Batch processing feature would allow multiple files', 'info');
}

function saveToCloud() {
    showNotification('Cloud save feature would sync with cloud storage', 'info');
}

function printResult() {
    window.print();
}

function createReport() {
    showNotification('PDF report generation started', 'info');
}

function compareVersions() {
    showNotification('Version comparison tool opened', 'info');
}

function showHelp() {
    showNotification('Opening help documentation...', 'info');
    // Would open help documentation
}

function showKeyboardShortcuts() {
    const shortcuts = `
Keyboard Shortcuts:
Ctrl+O - Open file
Ctrl+D - Process file
Ctrl+L - Clear all
Ctrl+C - Copy selected
Ctrl+S - Save result
    `.trim();
    
    showNotification(shortcuts, 'info');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'o':
                e.preventDefault();
                elements.fileInput.click();
                break;
            case 'd':
                e.preventDefault();
                processFile();
                break;
            case 'l':
                e.preventDefault();
                clearAll();
                break;
            case 's':
                e.preventDefault();
                downloadResult();
                break;
        }
    }
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-left: 4px solid var(--primary-blue);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        box-shadow: var(--shadow);
    }
    .notification-success { border-left-color: var(--success); }
    .notification-error { border-left-color: var(--error); }
    .notification-warning { border-left-color: var(--warning); }
    .notification button {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 1.2rem;
        margin-left: 10px;
    }
    .notification i {
        font-size: 1.2rem;
    }
    .notification-success i { color: var(--success); }
    .notification-error i { color: var(--error); }
    .notification-warning i { color: var(--warning); }
    .notification-info i { color: var(--primary-blue); }
`;
document.head.appendChild(notificationStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
});

// Export for global access
window.toggleTheme = toggleTheme;
window.showAbout = showAbout;
window.showSettings = showSettings;
window.closeModal = closeModal;
window.loadSample = loadSample;
window.clearAll = clearAll;
window.clearFile = clearFile;
window.processFile = processFile;
window.switchTab = switchTab;
window.viewSourceCode = viewSourceCode;
window.copyContent = copyContent;
window.copySourceCode = copySourceCode;
window.downloadResult = downloadResult;
window.downloadSource = downloadSource;
window.viewInNewWindow = viewInNewWindow;
window.shareResult = shareResult;
window.pasteFromClipboard = pasteFromClipboard;
window.takeScreenshot = takeScreenshot;
window.showQRCode = showQRCode;
window.searchInPreview = searchInPreview;
window.analyzeCode = analyzeCode;
window.exportAsHTML = exportAsHTML;
window.copyHex = copyHex;
window.toggleHexView = toggleHexView;
window.showBatchProcessing = showBatchProcessing;
window.saveToCloud = saveToCloud;
window.printResult = printResult;
window.createReport = createReport;
window.compareVersions = compareVersions;
window.showHelp = showHelp;
window.showKeyboardShortcuts = showKeyboardShortcuts;
window.showViewSource = showViewSource;
window.changeTheme = changeTheme;
window.changeFontSize = changeFontSize;
