export default function About() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100 mb-1">关于 FrontierRadar</h2>
        <p className="text-sm text-gray-500">前沿热点雷达 — AI / 具身智能 / 无人机</p>
      </div>

      <div className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">项目简介</h3>
          <p className="text-gray-400 leading-relaxed">
            FrontierRadar 是一个前沿技术资讯聚合工具，专注于 AI、具身智能和无人机三大领域。
            它从多个高质量信源（arXiv、IEEE Spectrum、DroneDJ 等）自动抓取、翻译、评分和分类内容，
            帮助你快速了解领域最新动态。
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">核心功能</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-primary-400 mt-1">•</span>
              <span><strong>智能评分</strong>：基于相关性、重要性、新颖度、权威度、时效性五维度自动评分</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400 mt-1">•</span>
              <span><strong>自动翻译</strong>：使用 DeepSeek 大模型翻译标题和摘要，保留技术术语英文</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400 mt-1">•</span>
              <span><strong>智能分类</strong>：自动识别领域（AI/具身/无人机）和类型（论文/产品/行业等）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400 mt-1">•</span>
              <span><strong>去重聚簇</strong>：同一事件多源报道自动合并，避免刷屏</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400 mt-1">•</span>
              <span><strong>实时更新</strong>：每 3 小时自动抓取最新内容</span>
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">技术栈</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">后端</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• Python 3.11</li>
                <li>• feedparser / httpx</li>
                <li>• DeepSeek API</li>
                <li>• GitHub Actions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">前端</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• React 18 + TypeScript</li>
                <li>• TailwindCSS</li>
                <li>• Vite</li>
                <li>• Vercel</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">信源列表</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">AI</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• arXiv cs.AI</li>
                <li>• arXiv cs.CL</li>
                <li>• arXiv cs.LG</li>
                <li>• Hacker News</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">具身智能</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• arXiv cs.RO</li>
                <li>• IEEE Spectrum</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">无人机</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• DroneDJ</li>
                <li>• sUAS News</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">开源地址</h3>
          <p className="text-gray-400">
            <a
              href="https://github.com/zhangshujuan1314/frontier-radar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:underline"
            >
              https://github.com/zhangshujuan1314/frontier-radar
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
