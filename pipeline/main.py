"""Pipeline orchestrator: fetch → normalize → prefilter → dedup → enrich → write."""
import os
import sys
import time
from pathlib import Path

import yaml

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from fetchers import FETCHERS
from pipeline.normalize import normalize
from pipeline.prefilter import prefilter
from pipeline.dedup import dedup
from pipeline.enrich_llm import enrich_batch
from pipeline.writer import write_outputs


def load_sources() -> list:
    """Load sources.yaml."""
    sources_path = Path(__file__).parent.parent / "sources.yaml"
    with open(sources_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def run_pipeline():
    """Run the full ingestion pipeline."""
    print("=" * 60)
    print("FrontierRadar Pipeline — Starting")
    print("=" * 60)

    sources = load_sources()
    all_items = []
    source_health = []
    counts = {"fetched": 0, "after_prefilter": 0, "after_dedup": 0, "llm_calls": 0}

    # Step 1: Fetch
    print("\n[1/6] Fetching sources...")
    for src in sources:
        if not src.get("enabled", True):
            source_health.append({"name": src["name"], "ok": False, "count": 0, "error": "disabled"})
            print(f"  SKIP {src['name']} (disabled)")
            continue

        kind = src["kind"]
        fetcher = FETCHERS.get(kind)
        if not fetcher:
            source_health.append({"name": src["name"], "ok": False, "count": 0, "error": f"no fetcher for {kind}"})
            print(f"  SKIP {src['name']} (no fetcher for {kind})")
            continue

        try:
            if kind == "arxiv":
                raw_items = fetcher(src["name"], src["query"])
            elif kind == "rss":
                raw_items = fetcher(src["name"], src["url"])
            elif kind == "hackernews":
                raw_items = fetcher(src["name"], src["query"])
            else:
                raw_items = []

            # Normalize
            items = normalize(raw_items, src["name"], src["domain"], src["authority"])
            all_items.extend(items)

            source_health.append({"name": src["name"], "ok": True, "count": len(items), "error": None})
            print(f"  OK   {src['name']}: {len(items)} items")
        except Exception as e:
            source_health.append({"name": src["name"], "ok": False, "count": 0, "error": str(e)})
            print(f"  FAIL {src['name']}: {e}")

    counts["fetched"] = len(all_items)
    print(f"\n  Total fetched: {len(all_items)}")

    # Step 2: Pre-filter
    print("\n[2/6] Pre-filtering...")
    all_items = prefilter(all_items, max_age_days=14)
    counts["after_prefilter"] = len(all_items)
    print(f"  After prefilter: {len(all_items)}")

    # Step 3: Dedup
    print("\n[3/6] Deduplicating...")
    all_items = dedup(all_items)
    counts["after_dedup"] = len(all_items)
    print(f"  After dedup: {len(all_items)}")

    # Step 4: LLM Enrichment
    print("\n[4/6] LLM enrichment...")
    api_key = os.environ.get("DEEPSEEK_API_KEY", "")
    if api_key:
        llm_before = len(all_items)
        all_items = enrich_batch(all_items, api_key)
        counts["llm_calls"] = llm_before  # approximate
        print(f"  Enriched: {llm_before} items")
    else:
        print("  SKIP (no DEEPSEEK_API_KEY)")
        # Set default scores for walking skeleton
        for item in all_items:
            item["title_zh"] = item["title_raw"]
            item["summary_zh"] = item["title_raw"]
            item["score"] = 65
            item["score_detail"] = {"relevance": 65, "significance": 65, "novelty": 65, "authority": item.get("source_authority", 3) * 20, "recency": 65}
            item["reason"] = "（无 LLM 密钥，使用默认分数）"

    # Step 5: Write outputs
    print("\n[5/6] Writing outputs...")
    write_outputs(all_items, source_health, counts)

    # Step 6: Summary
    print("\n[6/6] Pipeline complete!")
    print(f"  Fetched: {counts['fetched']}")
    print(f"  After prefilter: {counts['after_prefilter']}")
    print(f"  After dedup: {counts['after_dedup']}")
    print(f"  Feed items (score≥60): check feed.json")
    print("=" * 60)


if __name__ == "__main__":
    run_pipeline()
