// Application state
const state = {
    fileData: null,
    fileName: null,
    fileType: 'csv'
};

// Configuration
const CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB limit
    MAX_ROWS: 10000, // Maximum rows to process
    ALLOWED_EXTENSIONS: ['csv']
};

// DOM Elements
const fileInput = document.getElementById('fileInput');
const fileNameDisplay = document.getElementById('fileName');
const apiToken = document.getElementById('apiToken');
const analysisPrompt = document.getElementById('analysisPrompt');
const analyzeBtn = document.getElementById('analyzeBtn');
const toggleTokenBtn = document.getElementById('toggleToken');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');
const errorSection = document.getElementById('errorSection');
const errorContent = document.getElementById('errorContent');

// API Configuration
// Note: These credentials are provided by the repository owner for this specific Coze AGENT instance
// Users will need to provide their own API token when using the application
const API_CONFIG = {
    endpoint: 'https://5fx7r5n26y.coze.site/stream_run',
    sessionId: '21N-hn6wRX0Vt3lplTX5B',
    projectId: '7605065367454679076'
};

// Event Listeners
fileInput.addEventListener('change', handleFileSelect);
analyzeBtn.addEventListener('click', handleAnalyze);
toggleTokenBtn.addEventListener('click', toggleTokenVisibility);

// Enable drag and drop
const fileLabel = document.querySelector('.file-label');
fileLabel.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = 'var(--primary-color)';
});

fileLabel.addEventListener('dragleave', () => {
    fileLabel.style.borderColor = 'var(--border-color)';
});

fileLabel.addEventListener('drop', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = 'var(--border-color)';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect({ target: fileInput });
    }
});

// Handle file selection
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    hideError();
    hideResult();

    // Validate file size
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        showError(`文件过大。最大允许 ${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB，当前文件大小：${(file.size / 1024 / 1024).toFixed(2)}MB`);
        resetFileState();
        return;
    }

    state.fileName = file.name;
    const extension = file.name.split('.').pop().toLowerCase();

    // Validate file extension
    if (!CONFIG.ALLOWED_EXTENSIONS.includes(extension)) {
        showError('不支持的文件格式。当前仅支持 CSV 文件。Excel 支持将在相关库安全漏洞修复后恢复。');
        resetFileState();
        return;
    }

    try {
        state.fileType = 'csv';
        await readCSVFile(file);

        // Validate data size
        if (state.fileData && state.fileData.length > CONFIG.MAX_ROWS) {
            const confirmLarge = confirm(
                `文件包含 ${state.fileData.length} 行数据，超过建议的 ${CONFIG.MAX_ROWS} 行限制。\n\n` +
                `处理大文件可能影响性能。是否继续？`
            );
            
            if (!confirmLarge) {
                resetFileState();
                return;
            }
        }

        fileNameDisplay.textContent = `✓ 已选择文件: ${state.fileName} (${(file.size / 1024).toFixed(2)} KB, ${state.fileData.length} 行)`;
        fileNameDisplay.classList.add('show');
        updateAnalyzeButton();
    } catch (error) {
        showError(`文件读取失败: ${error.message}`);
        resetFileState();
    }
}

// Read CSV file
function readCSVFile(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: (results) => {
                state.fileData = results.data;
                resolve();
            },
            error: (error) => {
                reject(error);
            },
            skipEmptyLines: true
        });
    });
}

// Update analyze button state
function updateAnalyzeButton() {
    const hasFile = state.fileData !== null;
    const hasToken = apiToken.value.trim() !== '';
    analyzeBtn.disabled = !(hasFile && hasToken);
}

// Toggle token visibility
function toggleTokenVisibility() {
    const isPassword = apiToken.type === 'password';
    apiToken.type = isPassword ? 'text' : 'password';
    toggleTokenBtn.textContent = isPassword ? '隐藏' : '显示';
}

// Handle analyze button click
async function handleAnalyze() {
    hideError();
    hideResult();
    setLoading(true);

    try {
        // Prepare data summary
        const dataSummary = prepareDataSummary();
        
        // Get user prompt
        const userPrompt = analysisPrompt.value.trim() || '请对这个数据集进行统计分析，包括基本统计信息、数据分布特征和可能的趋势。';
        
        // Combine prompt with data
        const fullPrompt = `${userPrompt}\n\n数据文件信息:\n文件名: ${state.fileName}\n数据摘要:\n${dataSummary}`;
        
        // Call API
        const result = await callCozeAPI(fullPrompt);
        
        // Display result
        showResult(result);
    } catch (error) {
        showError(`分析失败: ${error.message}`);
    } finally {
        setLoading(false);
    }
}

// Prepare data summary for API
function prepareDataSummary() {
    if (!state.fileData || state.fileData.length === 0) {
        return '数据为空';
    }

    const rowCount = state.fileData.length;
    const headers = state.fileData[0];
    const columnCount = Array.isArray(headers) ? headers.length : Object.keys(headers).length;
    
    let summary = `行数: ${rowCount}\n列数: ${columnCount}\n`;
    
    // Add headers
    if (Array.isArray(headers)) {
        summary += `列名: ${headers.join(', ')}\n`;
    }
    
    // Add first few rows as sample
    summary += '\n数据样本（前5行）:\n';
    const sampleRows = state.fileData.slice(0, Math.min(5, rowCount));
    summary += JSON.stringify(sampleRows, null, 2);
    
    // Add data preview limit note
    if (rowCount > 5) {
        summary += `\n\n注：完整数据集包含 ${rowCount} 行数据`;
    }
    
    return summary;
}

// Call Coze API
async function callCozeAPI(prompt) {
    const token = apiToken.value.trim();
    
    const requestBody = {
        content: {
            query: {
                prompt: [
                    {
                        type: 'text',
                        content: {
                            text: prompt
                        }
                    }
                ]
            }
        },
        type: 'query',
        session_id: API_CONFIG.sessionId,
        project_id: API_CONFIG.projectId
    };

    try {
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
        }

        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            result += chunk;
        }

        // Parse the streaming response
        return parseStreamingResponse(result);
    } catch (error) {
        throw new Error(`网络请求失败: ${error.message}`);
    }
}

// Parse streaming response from Coze API
function parseStreamingResponse(rawResponse) {
    try {
        // Split by newlines and parse each line as JSON
        const lines = rawResponse.split('\n').filter(line => line.trim());
        let combinedText = '';

        for (const line of lines) {
            try {
                const data = JSON.parse(line);
                
                // Extract text content from the response
                if (data.content) {
                    combinedText += data.content;
                } else if (data.messages && Array.isArray(data.messages)) {
                    data.messages.forEach(msg => {
                        if (msg.content) {
                            combinedText += msg.content;
                        }
                    });
                }
            } catch (e) {
                // Skip invalid JSON lines
                continue;
            }
        }

        return combinedText || rawResponse;
    } catch (error) {
        return rawResponse;
    }
}

// UI Helper Functions
function setLoading(loading) {
    analyzeBtn.disabled = loading;
    if (loading) {
        analyzeBtn.classList.add('loading');
    } else {
        analyzeBtn.classList.remove('loading');
        updateAnalyzeButton();
    }
}

function showResult(text) {
    resultContent.textContent = text;
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResult() {
    resultSection.style.display = 'none';
}

function showError(message) {
    errorContent.textContent = message;
    errorSection.style.display = 'block';
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    errorSection.style.display = 'none';
}

function resetFileState() {
    state.fileData = null;
    state.fileName = null;
    state.fileType = null;
    fileNameDisplay.classList.remove('show');
    fileInput.value = '';
    updateAnalyzeButton();
}

// Monitor token input to enable/disable analyze button
apiToken.addEventListener('input', updateAnalyzeButton);

// Initialize
updateAnalyzeButton();
