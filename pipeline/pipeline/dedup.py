"""V1 rule-based dedup: exact ID match + fuzzy title match via rapidfuzz."""
from typing import List, Dict, Any
from rapidfuzz import fuzz


FUZZY_THRESHOLD = 88  # title similarity threshold for merging


def dedup(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Deduplicate items: exact ID match, then fuzzy title merge."""
    # Phase 1: exact ID dedup (keep first occurrence)
    seen_ids = set()
    exact_deduped = []
    for item in items:
        if item["id"] not in seen_ids:
            seen_ids.add(item["id"])
            exact_deduped.append(item)

    # Phase 2: fuzzy title dedup (keep higher authority item as main)
    merged = []
    used = set()

    for i, item_a in enumerate(exact_deduped):
        if i in used:
            continue

        cluster = [item_a]
        for j in range(i + 1, len(exact_deduped)):
            if j in used:
                continue
            item_b = exact_deduped[j]

            # Compare titles (case-insensitive)
            sim = fuzz.token_sort_ratio(
                item_a["title_raw"].lower(),
                item_b["title_raw"].lower(),
            )
            if sim >= FUZZY_THRESHOLD:
                cluster.append(item_b)
                used.add(j)

        # Pick main item: highest authority
        cluster.sort(key=lambda x: x.get("source_authority", 0), reverse=True)
        main = cluster[0]

        # Attach related sources if cluster > 1
        if len(cluster) > 1:
            main["related"] = [
                {"source": c["source"], "url": c["url"]}
                for c in cluster[1:]
            ]

        merged.append(main)

    return merged
