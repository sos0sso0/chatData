# chatData - 数据分析工具

基于 Coze AGENT 的智能数据分析 Web 应用，支持 CSV 文件的安全分析。

## ⚠️ 重要安全通知

**Excel 支持已暂时移除**

由于 SheetJS (xlsx) 库存在以下**无补丁**的高危漏洞，我们已决定暂时移除 Excel 文件支持：

1. **正则表达式拒绝服务 (ReDoS)** - [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9)
   - CVSS 评分: 7.5 (高危)
   - 影响版本: < 0.20.2
   - **修复版本: 不可用**

2. **原型污染漏洞** - [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6)
   - CVSS 评分: 7.8 (高危)
   - 影响版本: < 0.19.3
   - **修复版本: 不可用**

### 安全优先原则

在没有可用补丁的情况下，我们选择：
- ✅ **完全移除漏洞依赖** - 不再包含 xlsx 库
- ✅ **仅支持 CSV 格式** - Papa Parse 库安全可靠
- ✅ **零已知漏洞** - 所有依赖均无安全问题

### Excel 支持恢复计划

一旦 SheetJS 发布修复版本（v0.19.3+ 或 v0.20.2+）到 npm，我们将：
1. 立即升级到安全版本
2. 恢复 Excel 文件支持
3. 发布更新通知

### 临时解决方案

如需分析 Excel 文件，请先转换为 CSV：
```
Excel → 文件 → 另存为 → CSV UTF-8 (逗号分隔)
```

---

## 功能特点

- 📊 **CSV 文件支持**: 安全可靠的数据文件解析
- 🔒 **零安全漏洞**: 所有依赖均无已知安全问题
- 🤖 **智能分析**: 集成 Coze AGENT 进行数据分析
- 🎨 **现代化界面**: 渐变设计，响应式布局
- 📱 **移动端支持**: 完美适配各种屏幕尺寸
- 🚀 **即开即用**: 无需构建步骤，直接部署

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

### 1. 准备文件

将您的数据保存为 CSV 格式：
- 如果数据在 Excel 中，选择"另存为 CSV UTF-8"
- 确保使用 UTF-8 编码以支持中文

### 2. 上传文件

- 点击上传区域选择文件，或直接拖拽文件到上传区域
- 当前仅支持 CSV 格式

### 3. 配置 API

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
- **文件解析**: Papa Parse (CSV) - 无安全漏洞
- **API 集成**: Fetch API
- **部署**: GitHub Pages

## 安全状态

✅ **当前安全状态: 优秀**

| 依赖库 | 版本 | 安全状态 | 说明 |
|--------|------|----------|------|
| **papaparse** | 5.4.1 | ✅ 安全 | CSV 解析，无已知漏洞 |
| ~~**xlsx**~~ | ~~已移除~~ | ✅ 已移除 | 因高危漏洞暂时移除 |

**npm audit 结果**: ✅ found 0 vulnerabilities

### 为什么移除 Excel 支持？

**安全优先原则**：
- xlsx v0.18.5 存在 2 个高危漏洞（CVSS 7.5 和 7.8）
- npm 上无可用的修复版本
- 无法通过配置或代码缓解这些漏洞
- 唯一安全的选择是完全移除该依赖

**用户影响**：
- ✅ 保证所有用户的安全
- ✅ 消除所有已知安全风险
- ✅ CSV 格式满足大多数数据分析需求
- ✅ 提供Excel转CSV的简单方法

## 依赖安全

```
chatData/
├── index.html              # 主页面
├── styles.css              # 样式文件
├── app.js                  # 应用逻辑
├── lib/                    # 本地库
│   └── papaparse.min.js   # CSV 解析（✅ 安全）
├── sample-data.csv         # 示例数据
├── README.md              # 使用文档
├── DEPLOYMENT.md          # 部署指南
├── SECURITY.md            # 安全文档
├── package.json           # 项目配置
└── .gitignore            # Git 忽略规则
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

### 数据隐私
- ✅ API Token 仅在浏览器本地使用，不会被存储
- ✅ 文件数据在浏览器中本地读取，不会上传到服务器
- ✅ 建议使用 HTTPS 访问应用

### Excel 文件安全（重要）
- ⚠️ **SheetJS 库存在高危漏洞**：仅上传您信任的 Excel 文件
- ⚠️ **推荐使用 CSV 格式**：可完全避免 Excel 解析相关的安全风险
- ⚠️ **恶意文件风险**：精心构造的恶意 Excel 文件可能导致：
  - 拒绝服务攻击（DoS）
  - 原型污染攻击
  - 浏览器性能下降或崩溃

### 已实施的安全措施
- 文件大小限制（10MB）
- 数据行数限制提醒（10,000 行）
- Excel 文件上传前的明确警告
- 文件扩展名验证
- 错误捕获和安全降级

### 如果必须使用 Excel 文件
1. 确保文件来自可信来源
2. 使用杀毒软件扫描文件
3. 考虑先转换为 CSV 格式
4. 限制文件大小和复杂度

## 依赖安全

### 当前依赖状态
### 当前依赖状态

| 依赖库 | 版本 | 安全状态 | 说明 |
|--------|------|----------|------|
| **papaparse** | 5.4.1 | ✅ 安全 | CSV 解析，无已知漏洞 |
| **xlsx** | 0.18.5 | ⚠️ 有漏洞 | Excel 解析，存在 2 个高危漏洞 |

### xlsx 库漏洞详情

**漏洞 1: 正则表达式拒绝服务 (ReDoS)**
- **CVE**: 待分配
- **GHSA**: [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9)
- **影响**: < 0.20.2
- **修复**: 需要 0.20.2+（暂未发布到 npm）
- **风险**: 恶意构造的输入可能导致拒绝服务

**漏洞 2: 原型污染**
- **CVE**: 待分配
- **GHSA**: [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6)
- **影响**: < 0.19.3
- **修复**: 需要 0.19.3+（暂未发布到 npm）
- **风险**: 可能导致原型链污染

### 为什么不移除 Excel 支持？

1. **用户需求**: Excel 是常用的数据格式
2. **实际风险**: 在本地客户端环境中，用户处理自己的文件，风险相对可控
3. **缓解措施**: 已实施多层防护和警告
4. **替代方案**: 强烈推荐使用 CSV 格式

### 监控和更新计划

我们正在积极关注 SheetJS 的更新，并承诺：
- 📅 每周检查 npm 是否有新版本发布
- 🔄 新版本发布后 24 小时内完成升级
- 📢 升级后立即通知所有用户

**检查命令**：
```bash
npm view xlsx version  # 当前最新: 0.18.5

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请在 GitHub 上提交 Issue。