"""DeepSeek LLM enrichment: score, classify, translate, generate reason.
Uses hash-based caching to avoid re-processing items.
"""
import json
import hashlib
import os
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
from openai import OpenAI


CACHE_DIR = Path(__file__).parent.parent / "cache"
BATCH_SIZE = 10  # items per LLM request

SYSTEM_PROMPT = """你是一个技术资讯分析助手。对每条输入，返回一个 JSON 数组，每个元素包含：

- domain: 字符串数组，从 ["ai", "embodied", "drone"] 中选，可多值
- type: 字符串，从 ["model", "product", "paper", "industry", "tool", "opinion"] 中选一个
- title_zh: 中文标题（必须翻译成中文！规则：专有名词/算法名/模型名保留英文，如 VLA、SLAM、GPT-4、Claude、Gemini、diffusion policy、sim-to-real、transformer 等；其余内容必须翻译成中文。示例：
  * "Controllable Sim Agents with Behavior Latents" → "可控模拟智能体与行为潜变量"
  * "Learning Agile Intruder Interception using Differentiable Quadrotors" → "使用可微分四旋翼飞行器学习敏捷入侵者拦截"
  * "DL-SLAM: Enabling High-Fidelity Gaussian Splatting SLAM in Dynamic Environments" → "DL-SLAM：在动态环境中实现高保真 Gaussian Splatting SLAM"
  * "VT-WAM: Visual-Tactile World Action Model for Contact-Rich Manipulation" → "VT-WAM：用于接触丰富操作的视觉-触觉世界动作模型"
  中文源的 title_zh 等于原标题）
- summary_zh: 2-3 句中文摘要（同样保留技术术语英文，翻译叙述内容）
- relevance: 0-100 整数，与 AI/具身智能/无人机领域相关度
- significance: 0-100 整数，重要性/影响力
- novelty: 0-100 整数，新颖度
- reason: 一句话说明为什么值得看，点破具体关联，禁套话

只返回 JSON 数组，不要任何其他文字。"""


def _cache_key(title: str, summary: str) -> str:
    """Generate cache key from title+summary hash."""
    content = f"{title}|{summary}"
    return hashlib.sha1(content.encode()).hexdigest()


def _load_cache(key: str) -> Optional[Dict[str, Any]]:
    """Load cached LLM result if exists."""
    cache_file = CACHE_DIR / f"{key}.json"
    if cache_file.exists():
        try:
            return json.loads(cache_file.read_text(encoding="utf-8"))
        except Exception:
            pass
    return None


def _save_cache(key: str, result: Dict[str, Any]) -> None:
    """Save LLM result to cache."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_file = CACHE_DIR / f"{key}.json"
    cache_file.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")


def _parse_llm_json(raw_text: str) -> Optional[List[Dict[str, Any]]]:
    """Lenient JSON parsing: strip markdown fences, extract first JSON array."""
    text = raw_text.strip()

    # Strip ```json ... ``` fences
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    # Try direct parse
    try:
        result = json.loads(text)
        if isinstance(result, list):
            return result
        return [result]
    except json.JSONDecodeError:
        pass

    # Try to extract first JSON array
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    return None


def enrich_batch(items: List[Dict[str, Any]], api_key: str, base_url: str = "https://api.deepseek.com") -> List[Dict[str, Any]]:
    """Enrich items with LLM: score, classify, translate, reason.
    Uses caching and batching. Returns items with LLM fields filled.
    """
    client = OpenAI(api_key=api_key, base_url=base_url)

    # Separate cached vs uncached
    uncached_indices = []
    uncached_items = []

    for i, item in enumerate(items):
        key = _cache_key(item["title_raw"], item.get("summary_zh", "") or item.get("title_raw", ""))
        cached = _load_cache(key)
        if cached:
            _apply_llm_result(item, cached)
        else:
            uncached_indices.append(i)
            uncached_items.append(item)

    if not uncached_items:
        return items

    # Process uncached in batches
    for batch_start in range(0, len(uncached_items), BATCH_SIZE):
        batch = uncached_items[batch_start:batch_start + BATCH_SIZE]

        # Build prompt
        entries = []
        for item in batch:
            entries.append({
                "title": item["title_raw"],
                "summary": item.get("title_raw", ""),  # Use title as summary if empty
                "source": item["source"],
            })

        user_msg = json.dumps(entries, ensure_ascii=False)

        # Call LLM with retry
        result = None
        for attempt in range(2):
            try:
                response = client.chat.completions.create(
                    model="deepseek-chat",
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_msg},
                    ],
                    temperature=0.3,
                    max_tokens=2000,
                )
                raw_text = response.choices[0].message.content
                result = _parse_llm_json(raw_text)
                if result and len(result) == len(batch):
                    break
                elif result:
                    print(f"  [LLM] batch size mismatch: expected {len(batch)}, got {len(result)}")
                    # Pad or truncate
                    while len(result) < len(batch):
                        result.append({})
                    result = result[:len(batch)]
                    break
            except Exception as e:
                print(f"  [LLM] attempt {attempt+1} failed: {e}")
                if attempt == 0:
                    import time
                    time.sleep(2)

        # Apply results and cache
        for i, item in enumerate(batch):
            if result and i < len(result) and result[i]:
                _apply_llm_result(item, result[i])
                key = _cache_key(item["title_raw"], item.get("summary_zh", "") or item.get("title_raw", ""))
                _save_cache(key, result[i])
            else:
                # Degraded: mark as unscored
                item["reason"] = "（LLM 评分失败，已降级入 all.json）"

    return items


def _apply_llm_result(item: Dict[str, Any], llm: Dict[str, Any]) -> None:
    """Apply LLM result fields to item."""
    item["domain"] = llm.get("domain", item.get("domain", ["ai"]))
    item["type"] = llm.get("type", item.get("type", "paper"))
    item["title_zh"] = llm.get("title_zh", item["title_raw"])
    item["summary_zh"] = llm.get("summary_zh", "")
    item["reason"] = llm.get("reason", "")

    # Scores (authority and recency computed in code, not LLM)
    relevance = llm.get("relevance", 50)
    significance = llm.get("significance", 50)
    novelty = llm.get("novelty", 50)
    authority = item.get("source_authority", 3) * 20

    # Recency: exponential decay based on published_at
    from datetime import datetime, timezone, timedelta
    try:
        pub = datetime.fromisoformat(item["published_at"].replace("Z", "+00:00"))
        age_hours = (datetime.now(timezone.utc) - pub).total_seconds() / 3600
        recency = max(0, int(100 * (0.97 ** age_hours)))
    except Exception:
        recency = 50

    item["score_detail"] = {
        "relevance": relevance,
        "significance": significance,
        "novelty": novelty,
        "authority": authority,
        "recency": recency,
    }

    # Weighted score
    weights = {"relevance": 0.35, "significance": 0.25, "novelty": 0.15, "authority": 0.15, "recency": 0.10}
    item["score"] = round(sum(item["score_detail"][k] * weights[k] for k in weights))
