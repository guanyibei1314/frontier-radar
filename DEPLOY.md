# 部署指南 — FrontierRadar

## 方案: Cloudflare Pages（推荐）

### 步骤 1: 推送到 GitHub

```bash
# 在 GitHub 创建新仓库 frontier-radar，然后:
git remote add origin https://github.com/YOUR_USERNAME/frontier-radar.git
git push -u origin master
```

### 步骤 2: 配置 GitHub Actions Secret

在仓库 Settings → Secrets and variables → Actions:
- `DEEPSEEK_API_KEY`: 你的 DeepSeek API key

### 步骤 3: 连接 Cloudflare Pages

1. 登录 Cloudflare Dashboard → Pages
2. 点击 "Create a project" → "Connect to Git"
3. 选择 `frontier-radar` 仓库
4. 配置构建:
   - **Production branch**: `master`
   - **Build command**: `cd web && npm ci && cp -r ../data public/data && npm run build`
   - **Build output directory**: `web/dist`
5. 点击 "Save and Deploy"

### 步骤 4: 验证

部署完成后会得到一个 `*.pages.dev` 域名。

验证清单:
- [ ] 手机浏览器打开 URL，看到精选 Feed
- [ ] 点击「全部」标签，看到所有条目
- [ ] 点击「健康」标签，看到源状态
- [ ] 领域筛选（AI/具身/无人机）正常工作
- [ ] 类型筛选（论文/产品/行业等）正常工作

### 步骤 5: 触发数据更新

GitHub Actions 会每 3 小时自动运行。也可以手动触发:
1. 进入仓库 → Actions → Ingest Pipeline
2. 点击 "Run workflow"

## 备选方案: Vercel

如果 CF Pages 不可用:

1. 登录 Vercel → Import Git Repository
2. 选择 `frontier-radar`
3. 配置:
   - **Framework Preset**: Vite
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. 在 Settings → Environment Variables 添加 `DEEPSEEK_API_KEY`

## 国内访问

CF Pages 的 `*.pages.dev` 域名在国内需要代理。如果需要直连:
1. 在 Cloudflare 绑定自定义域名
2. 配置 DNS 指向 CF Pages
3. 或使用 FastStunnel 等内网穿透服务

## 成本

| 项目 | 免费额度 | 实际用量 |
|------|---------|---------|
| GitHub Actions | 2000 min/月 | ~30 min/月 (每 3h 一次) |
| CF Pages 构建 | 500 次/月 | ~240 次/月 |
| DeepSeek API | 按量付费 | ~$0.01/天 (批量+缓存) |
