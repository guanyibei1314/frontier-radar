"""Write feed.json, all.json, meta.json with rolling window."""
import json
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Dict, Any


DATA_DIR = Path(__file__).parent.parent.parent / "data"
FEED_SCORE_THRESHOLD = 55
ALL_WINDOW_DAYS = 14


def write_outputs(
    items: List[Dict[str, Any]],
    source_health: List[Dict[str, Any]],
    counts: Dict[str, int],
) -> None:
    """Write feed.json (scored), all.json (all), meta.json (health)."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc).isoformat()

    # feed.json: score >= threshold, sorted by score desc
    feed_items = [i for i in items if i.get("score", 0) >= FEED_SCORE_THRESHOLD]
    feed_items.sort(key=lambda x: x.get("score", 0), reverse=True)
    feed = {"generated_at": now, "items": feed_items}
    (DATA_DIR / "feed.json").write_text(
        json.dumps(feed, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # all.json: rolling window, sorted by published_at desc
    cutoff = datetime.now(timezone.utc) - timedelta(days=ALL_WINDOW_DAYS)
    all_items = []
    for item in items:
        try:
            pub = datetime.fromisoformat(item["published_at"].replace("Z", "+00:00"))
            if pub >= cutoff:
                all_items.append(item)
        except Exception:
            all_items.append(item)  # keep if time unparseable
    all_items.sort(key=lambda x: x.get("published_at", ""), reverse=True)
    all_data = {"generated_at": now, "items": all_items}
    (DATA_DIR / "all.json").write_text(
        json.dumps(all_data, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # meta.json: pipeline health
    meta = {
        "last_run": now,
        "source_health": source_health,
        "counts": {
            "fetched": counts.get("fetched", 0),
            "after_prefilter": counts.get("after_prefilter", 0),
            "after_dedup": counts.get("after_dedup", 0),
            "llm_calls": counts.get("llm_calls", 0),
            "feed_count": len(feed_items),
            "all_count": len(all_items),
        },
    }
    (DATA_DIR / "meta.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"  [Writer] feed.json: {len(feed_items)} items, all.json: {len(all_items)} items")
