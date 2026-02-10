# chatData - 数据分析工具

基于 Coze AGENT 的智能数据分析 Web 应用，支持 CSV 和 Excel 文件的本地分析。

## 功能特点

- 📊 支持 CSV 和 Excel (.xlsx, .xls) 文件上传
- 🤖 集成 Coze AGENT 进行智能数据分析
- 🔒 本地文件读取，数据安全
- 💡 自定义分析需求
- 🎨 现代化响应式界面
- 📱 支持移动端访问

## 快速开始

### 在线使用

访问 GitHub Pages 部署的应用：
```
https://sos0sso0.github.io/chatData/
```

### 本地使用

1. 克隆仓库：
```bash
git clone https://github.com/sos0sso0/chatData.git
cd chatData
```

2. 使用本地服务器运行（推荐）：
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx http-server
```

3. 在浏览器中打开 `http://localhost:8000`

## 使用说明

### 1. 准备 API Token

从 Coze 平台获取您的 API Token。

### 2. 上传文件

- 点击上传区域选择文件，或直接拖拽文件到上传区域
- 支持 CSV 和 Excel 格式

### 3. 配置分析

- 输入您的 API Token
- （可选）自定义分析需求，例如：
  - "请分析这个数据集的统计特征"
  - "找出数据中的异常值和趋势"
  - "对数据进行相关性分析"

### 4. 查看结果

点击"开始分析"按钮，等待 AGENT 返回分析结果。

## API 配置

应用使用以下 Coze AGENT API 配置：

- **API 端点**: `https://5fx7r5n26y.coze.site/stream_run`
- **Session ID**: `21N-hn6wRX0Vt3lplTX5B`
- **Project ID**: `7605065367454679076`

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **文件解析**: 
  - Papa Parse (CSV)
  - SheetJS (Excel)
- **API 集成**: Fetch API
- **部署**: GitHub Pages

## 项目结构

```
chatData/
├── index.html      # 主页面
├── styles.css      # 样式文件
├── app.js          # 应用逻辑
└── README.md       # 项目文档
```

## 开发

### 前置要求

- 现代浏览器（Chrome, Firefox, Safari, Edge）
- 本地 Web 服务器（用于开发测试）

### 修改配置

如需修改 API 配置，编辑 `app.js` 文件中的 `API_CONFIG` 对象：

```javascript
const API_CONFIG = {
    endpoint: 'YOUR_API_ENDPOINT',
    sessionId: 'YOUR_SESSION_ID',
    projectId: 'YOUR_PROJECT_ID'
};
```

## 浏览器兼容性

- Chrome/Edge: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持
- IE11: ❌ 不支持

## 安全提示

- API Token 仅在浏览器本地使用，不会被存储
- 文件数据在浏览器中本地读取，不会上传到服务器
- 建议使用 HTTPS 访问应用

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请在 GitHub 上提交 Issue。