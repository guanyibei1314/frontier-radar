/** Frontend data types — mirrors pipeline Item schema exactly. */

export interface Item {
  id: string
  title_zh: string
  title_raw: string
  summary_zh: string
  url: string
  source: string
  source_authority: number
  domain: Domain[]
  type: ItemType
  published_at: string
  fetched_at: string
  score: number
  score_detail: ScoreDetail
  reason: string
  cluster_id: string | null
  related: RelatedSource[]
}

export interface RelatedSource {
  source: string
  url: string
}

export interface ScoreDetail {
  relevance: number
  significance: number
  novelty: number
  authority: number
  recency: number
}

export type Domain = 'ai' | 'embodied' | 'drone'

export type ItemType = 'model' | 'product' | 'paper' | 'industry' | 'tool' | 'opinion'

export interface FeedData {
  generated_at: string
  items: Item[]
}

export interface SourceHealth {
  name: string
  ok: boolean
  count: number
  error: string | null
}

export interface MetaData {
  last_run: string
  source_health: SourceHealth[]
  counts: {
    fetched: number
    after_prefilter: number
    after_dedup: number
    llm_calls: number
    feed_count: number
    all_count: number
  }
}

export const DOMAIN_LABELS: Record<Domain, string> = {
  ai: 'AI',
  embodied: '具身智能',
  drone: '无人机',
}

export const DOMAIN_COLORS: Record<Domain, string> = {
  ai: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  embodied: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  drone: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

export const TYPE_LABELS: Record<ItemType, string> = {
  model: '模型',
  product: '产品',
  paper: '论文',
  industry: '行业',
  tool: '工具',
  opinion: '观点',
}
