"""Normalize RawItem → Item: URL canonicalization, timezone, ID generation."""
import hashlib
from datetime import datetime, timezone
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from typing import List, Dict, Any


# Tracking params to strip from URLs
TRACKING_PARAMS = {
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "ref", "source", "fbclid", "gclid", "mc_cid", "mc_eid",
}


def canonical_url(url: str) -> str:
    """Normalize URL: strip tracking params, force https, remove trailing slash."""
    parsed = urlparse(url)

    # Force https
    scheme = "https"

    # Remove tracking params
    qs = parse_qs(parsed.query, keep_blank_values=False)
    clean_qs = {k: v for k, v in qs.items() if k.lower() not in TRACKING_PARAMS}
    query = urlencode(clean_qs, doseq=True)

    # Remove trailing slash from path
    path = parsed.path.rstrip("/")

    return urlunparse((scheme, parsed.netloc, path, "", query, ""))


def make_id(url: str) -> str:
    """Generate stable dedup ID from canonical URL."""
    return hashlib.sha1(canonical_url(url).encode()).hexdigest()[:16]


def normalize_item(raw: Dict[str, Any], source_name: str, source_domains: list, source_authority: int) -> Dict[str, Any]:
    """Convert a RawItem to the Item schema."""
    url = canonical_url(raw["url"])

    # Parse and normalize time to UTC ISO8601
    published_at = raw.get("published_at", "")
    try:
        if published_at:
            dt = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
            published_at = dt.astimezone(timezone.utc).isoformat()
    except Exception:
        published_at = datetime.now(timezone.utc).isoformat()

    fetched_at = datetime.now(timezone.utc).isoformat()

    return {
        "id": make_id(raw["url"]),
        "title_zh": "",  # filled by LLM
        "title_raw": raw["title"],
        "summary_zh": "",  # filled by LLM
        "url": url,
        "source": source_name,
        "source_authority": source_authority,
        "domain": source_domains,
        "type": "paper",  # default, overridden by LLM
        "published_at": published_at,
        "fetched_at": fetched_at,
        "score": 0,
        "score_detail": {},
        "reason": "",
        "cluster_id": None,
        "related": [],
    }


def normalize(raw_items: List[Dict[str, Any]], source_name: str, source_domains: list, source_authority: int) -> List[Dict[str, Any]]:
    """Normalize a batch of raw items."""
    return [normalize_item(r, source_name, source_domains, source_authority) for r in raw_items]
