# FrontierRadar — 前沿热点雷达

从 AI / 具身智能 / 无人机三大领域，筛出值得你看的前沿动态。

## 快速开始

### 1. 运行流水线（本地测试）

```bash
cd pipeline
pip install -r requirements.txt
python main.py
```

设置 `DEEPSEEK_API_KEY` 环境变量启用 LLM 翻译/评分。

### 2. 构建前端

```bash
cd web
npm install
npm run build
```

### 3. 部署到 Cloudflare Pages

1. 推送到 GitHub
2. 在 CF Pages 连接仓库
3. 构建命令: `cd web && npm install && npm run build`
4. 输出目录: `web/dist`
5. 添加 `DEEPSEEK_API_KEY` 到 GitHub Actions Secrets

## 架构

```
sources.yaml → Pipeline (Python) → data/*.json → Frontend (React) → CF Pages
```

- **Pipeline**: 每 3h 由 GitHub Actions 触发
- **数据**: JSON 滚动窗口，版本化在仓库内
- **前端**: 纯静态，零后端，直读 JSON

## 信源

| 领域 | 源 |
|------|-----|
| AI | arXiv cs.AI/CL/LG, Hacker News |
| 具身智能 | arXiv cs.RO, IEEE Spectrum Robotics |
| 无人机 | DroneDJ, sUAS News |

## 文件结构

```
frontier-radar/
├─ pipeline/          # 入库流水线
├─ data/              # 流水线产物
├─ web/               # 前端
├─ sources.yaml       # 信源注册表
└─ .github/workflows/ # CI/CD
```
