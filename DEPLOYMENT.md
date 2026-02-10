# GitHub Pages 部署指南

本文档说明如何将数据分析工具部署到 GitHub Pages。

## 快速部署

### 方法 1: 使用 GitHub Web 界面

1. 访问仓库设置页面：`https://github.com/sos0sso0/chatData/settings/pages`

2. 在 "Source" 部分:
   - 选择分支: `main` (或 `copilot/add-agent-data-analysis`)
   - 选择文件夹: `/ (root)`
   - 点击 "Save"

3. 等待几分钟，页面将可以通过以下地址访问:
   ```
   https://sos0sso0.github.io/chatData/
   ```

### 方法 2: 使用 GitHub Actions (推荐)

1. 创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. 提交并推送到 main 分支

3. 在仓库设置中启用 GitHub Pages (Source: GitHub Actions)

## 访问应用

部署成功后，访问:
```
https://sos0sso0.github.io/chatData/
```

## 验证部署

1. 打开部署的 URL
2. 上传一个测试 CSV 或 Excel 文件
3. 输入 API Token
4. 点击 "开始分析" 验证 API 集成

## 故障排除

### 页面 404 错误
- 确保已在设置中启用 GitHub Pages
- 检查分支和文件夹路径是否正确
- 等待几分钟让 GitHub 完成部署

### JavaScript 库加载失败
- 确保 `lib/` 目录包含所需的库文件
- 检查浏览器控制台的错误信息
- 确认文件路径正确

### API 调用失败
- 验证 API Token 是否正确
- 检查浏览器网络控制台
- 确认 API 端点可访问

## 更新应用

修改代码后:
1. 提交并推送到配置的分支
2. GitHub Pages 会自动重新部署
3. 清除浏览器缓存以查看最新版本

## 自定义域名 (可选)

1. 在仓库根目录创建 `CNAME` 文件
2. 添加您的域名，例如: `data.yourdomain.com`
3. 在域名服务商处配置 DNS:
   - 类型: CNAME
   - 名称: data (或您的子域名)
   - 值: sos0sso0.github.io
4. 在 GitHub Pages 设置中输入自定义域名
