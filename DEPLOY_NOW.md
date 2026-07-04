# 立即部署指南 — FrontierRadar

## 第 1 步: 创建 GitHub 仓库

1. 打开 https://github.com/new
2. 仓库名: `frontier-radar`
3. 设为 **Public**（免费 GitHub Actions）
4. **不要**勾选 "Add a README"（已有）
5. 点击 "Create repository"

## 第 2 步: 推送代码

在终端运行（替换 YOUR_USERNAME）:

```bash
cd C:\Users\Administrator\frontier-radar
git remote add origin https://github.com/YOUR_USERNAME/frontier-radar.git
git push -u origin master
```

## 第 3 步: 配置 GitHub Actions Secret

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. Name: `DEEPSEEK_API_KEY`
4. Value: `sk-1000a0690df24183ac2c764ffa5dbf84`
5. 点击 "Add secret"

## 第 4 步: 连接 Cloudflare Pages

1. 登录 https://dash.cloudflare.com
2. 左侧菜单 → Workers & Pages
3. 点击 "Create application" → "Pages" → "Connect to Git"
4. 授权 GitHub 并选择 `frontier-radar` 仓库
5. 配置构建设置:
   - **Production branch**: `master`
   - **Framework preset**: `None`
   - **Build command**: `cd web && npm ci && cp -r ../data public/data && npm run build`
   - **Build output directory**: `web/dist`
6. 点击 "Save and Deploy"

## 第 5 步: 验证部署

等待 1-2 分钟构建完成，然后:

1. 获得域名: `frontier-radar.pages.dev`
2. 手机浏览器打开，检查:
   - [ ] 精选 Feed 有内容（应显示 144 条）
   - [ ] 点击「全部」显示 194 条
   - [ ] 点击「健康」显示 8/8 源正常
   - [ ] 领域筛选（AI/具身/无人机）工作正常
   - [ ] 类型筛选（论文/产品/行业等）工作正常

## 第 6 步: 触发数据更新

GitHub Actions 会每 3 小时自动运行。手动触发:

1. 进入仓库 → Actions → Ingest Pipeline
2. 点击 "Run workflow" → "Run workflow"

## 成功标志

- ✅ 手机可访问 `frontier-radar.pages.dev`
- ✅ 精选 Feed 显示 144+ 条目
- ✅ 三个领域都有数据
- ✅ 中文翻译正确，技术术语保留英文
- ✅ 每 3 小时自动更新数据

## 故障排除

**问题**: 构建失败
**解决**: 检查 Build command 是否正确: `cd web && npm ci && cp -r ../data public/data && npm run build`

**问题**: 数据不显示
**解决**: 检查 `web/dist/data/` 目录是否存在 JSON 文件

**问题**: Actions 运行失败
**解决**: 检查 `DEEPSEEK_API_KEY` secret 是否正确配置
