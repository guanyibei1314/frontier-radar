# FrontierRadar — 前沿热点雷达

从 AI / 具身智能 / 无人机三大领域，筛出值得你看的前沿动态。

## 🚀 快速开始

### 在线访问

**https://web-red-one-81.vercel.app**

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/zhangshujuan1314/frontier-radar.git
cd frontier-radar

# 2. 运行流水线
cd pipeline
pip install -r requirements.txt
python main.py

# 3. 启动前端
cd ../web
npm install
npm run dev
```

## ✨ 核心功能

### 智能内容处理

- **自动抓取**：每 3 小时从 8 个信源自动抓取
- **智能翻译**：使用 DeepSeek 大模型翻译标题和摘要
- **五维评分**：相关性、重要性、新颖度、权威度、时效性
- **自动分类**：AI / 具身智能 / 无人机领域识别
- **去重聚簇**：同一事件多源报道自动合并

### 前端功能

| 功能 | 说明 |
|------|------|
| 📊 数据分析 | 分数、领域、类型、信源分布图表 |
| 📰 每日精选 | 按今天/昨天/本周筛选，分领域 Top 5 |
| 🔥 热门趋势 | 基于浏览记录的热门内容 |
| ⭐ 收藏夹 | 收藏条目，独立页面查看 |
| 🔍 全文搜索 | 搜索标题和摘要 |
| 🏷️ 多维筛选 | 领域、类型、分数筛选 |
| 📤 导出功能 | 导出 CSV/JSON 格式 |
| 📥 导入功能 | 导入备份数据 |
| 🔔 通知系统 | 浏览器通知高分条目 |
| 🌙 主题切换 | 暗色/亮色模式 |
| ⌨️ 键盘快捷键 | 数字键快速切换页面 |
| 📱 移动端适配 | 响应式设计 |
| 💾 离线支持 | PWA + Service Worker |
| 📈 性能监控 | 页面加载时间追踪 |
| 🐛 错误追踪 | 全局错误捕获 |
| 📖 阅读进度 | 已读条目标记 |
| 🔍 搜索历史 | 保存搜索记录 |
| ⚙️ 个性化设置 | 主题、筛选、分页等配置 |

## 🗺️ 开发路线图

### ✅ 已完成（V1.0）

- [x] 自动抓取 8 个信源
- [x] DeepSeek 智能翻译
- [x] 五维评分系统
- [x] 自动分类（AI/具身/无人机）
- [x] 去重聚簇
- [x] 精选 Feed 页面
- [x] 全部动态页面
- [x] 收藏夹功能
- [x] 数据分析图表
- [x] 每日精选
- [x] 热门趋势
- [x] 全文搜索
- [x] 多维筛选
- [x] 导出 CSV/JSON
- [x] 导入备份数据
- [x] 浏览器通知
- [x] 主题切换
- [x] 键盘快捷键
- [x] 移动端适配
- [x] PWA 离线支持
- [x] 性能监控
- [x] 错误追踪
- [x] 阅读进度
- [x] 搜索历史
- [x] 个性化设置
- [x] 条目详情页
- [x] GitHub Actions 自动化
- [x] Vercel 自动部署

### 🔜 待开发（V1.1）

- [ ] **RSSHub 集成**：接入 Twitter、微信公众号
- [ ] **Embedding 聚簇**：使用向量相似度进行更精确的去重
- [ ] **用户认证**：支持多用户登录
- [ ] **云端同步**：跨设备同步收藏、阅读进度
- [ ] **AI 摘要**：使用 LLM 生成更详细的摘要
- [ ] **相关推荐**：基于内容相似度推荐相关条目
- [ ] **标签系统**：自定义标签分类
- [ ] **评论系统**：条目评论和讨论
- [ ] **API 接口**：开放 RESTful API
- [ ] **RSS 输出**：生成 RSS Feed
- [ ] **邮件订阅**：每日/每周精选邮件
- [ ] **Slack/飞书集成**：推送到团队协作工具
- [ ] **更多信源**：
  - [ ] Reddit r/robotics
  - [ ] GitHub Trending
  - [ ] Product Hunt
  - [ ] Hacker News（完整）
  - [ ] 中文媒体（机器之心、量子位）

### 🚀 待开发（V2.0）

- [ ] **智能推荐引擎**：基于用户行为的个性化推荐
- [ ] **知识图谱**：构建领域知识图谱
- [ ] **趋势预测**：基于历史数据预测热点
- [ ] **自动摘要**：长文自动生成摘要
- [ ] **多语言支持**：英文、日文界面
- [ ] **移动端 App**：React Native / Flutter
- [ ] **浏览器插件**：Chrome / Firefox 扩展
- [ ] **桌面应用**：Electron 桌面版
- [ ] **数据分析后台**：管理员数据面板
- [ ] **机器学习优化**：自动调整评分权重
- [ ] **实时推送**：WebSocket 实时更新
- [ ] **社交功能**：关注、分享、讨论
- [ ] **付费订阅**：高级功能付费
- [ ] **企业版**：团队协作版本

### 💡 待探索

- [ ] **大模型 Agent**：自动阅读和总结论文
- [ ] **代码分析**：自动分析 GitHub 仓库
- [ ] **论文解读**：自动生成论文解读
- [ ] **会议日历**：集成学术会议日历
- [ ] **基金信息**：科研基金申请信息
- [ ] **招聘信息**：领域相关招聘信息
- [ ] **专利信息**：技术专利动态
- [ ] **标准规范**：行业标准更新

## 📄 页面结构

| 页面 | 路径 | 功能 |
|------|------|------|
| 精选 | `/` | 高质量条目，分页、筛选、导出 |
| 全部 | `/all` | 所有条目，搜索、筛选 |
| 收藏 | `/bookmarks` | 收藏的条目 |
| 分析 | `/analytics` | 数据可视化图表 |
| 日报 | `/digest` | 每日精选，按领域分组 |
| 热门 | `/trending` | 基于浏览记录的热门内容 |
| 详情 | `/item/:id` | 条目详情页 |
| 健康 | `/health` | 流水线状态 |
| 关于 | `/about` | 项目介绍 |
| 设置 | `/settings` | 个性化配置 |
| 性能 | `/performance` | 性能监控 |

## ⌨️ 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `1` | 精选 Feed |
| `2` | 全部动态 |
| `3` | 收藏夹 |
| `4` | 数据分析 |
| `5` | 每日精选 |
| `6` | 热门趋势 |
| `7` | 健康状态 |
| `8` | 关于页面 |
| `9` | 设置页面 |
| `0` | 性能监控 |
| `?` | 显示快捷键帮助 |
| `Esc` | 关闭弹窗 |

## 📡 信源列表

### AI
- arXiv cs.AI
- arXiv cs.CL
- arXiv cs.LG
- Hacker News

### 具身智能
- arXiv cs.RO
- IEEE Spectrum Robotics

### 无人机
- DroneDJ
- sUAS News

## 🏗️ 技术栈

### 后端
- Python 3.11
- feedparser / httpx
- DeepSeek API
- GitHub Actions

### 前端
- React 18 + TypeScript
- TailwindCSS
- Vite
- Vercel

## 📦 项目结构

```
frontier-radar/
├─ pipeline/              # 入库流水线
│  ├─ fetchers/           # 信源抓取器
│  ├─ pipeline/           # 处理模块
│  ├─ cache/              # LLM 缓存
│  └─ main.py             # 编排入口
├─ data/                  # 流水线产物
│  ├─ feed.json           # 精选条目
│  ├─ all.json            # 全部条目
│  └─ meta.json           # 元数据
├─ web/                   # 前端
│  ├─ src/
│  │  ├─ components/      # 组件
│  │  ├─ pages/           # 页面
│  │  └─ lib/             # 工具库
│  └─ public/             # 静态资源
├─ sources.yaml           # 信源注册表
└─ .github/workflows/     # CI/CD
```

## 🚀 部署

### GitHub Actions

每 3 小时自动运行流水线，更新数据并部署。

### Vercel

自动从 GitHub 部署，每次 push 触发构建。

### Cloudflare Pages（备选）

构建命令：`cd web && npm ci && cp -r ../data public/data && npm run build`

输出目录：`web/dist`

## 📊 数据统计

- **精选条目**：184+ 条
- **全部条目**：216+ 条
- **AI 领域**：135+ 条
- **具身智能**：43+ 条
- **无人机**：36+ 条
- **翻译质量**：100% 中文
- **更新频率**：每 3 小时

## 🔧 配置

### 环境变量

| 变量 | 说明 |
|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 |

### GitHub Secrets

在仓库 Settings → Secrets → Actions 中添加：

- `DEEPSEEK_API_KEY`：你的 DeepSeek API 密钥

## 📈 性能

- **首次加载**：< 2s
- **数据缓存**：5 分钟有效期
- **离线支持**：PWA + Service Worker
- **Bundle 大小**：~226 KB (gzipped: ~70 KB)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 链接

- **GitHub**：https://github.com/zhangshujuan1314/frontier-radar
- **Vercel**：https://web-red-one-81.vercel.app
