"""Hacker News fetcher via Algolia API."""
import time
import httpx
from datetime import datetime, timezone
from typing import List, TypedDict


class RawItem(TypedDict):
    title: str
    url: str
    summary: str
    published_at: str
    source: str
    author: str


ALGOLIA_API = "https://hn.algolia.com/api/v1/search_by_date"
MAX_PAGES = 3


def fetch(source_name: str, query: str, _enabled: bool = True) -> List[RawItem]:
    """Fetch HN stories matching query keywords."""
    items: List[RawItem] = []
    client = httpx.Client(timeout=20, headers={"User-Agent": "FrontierRadar/1.0"})

    keywords = query.replace("+", " ").split(" OR ")

    for page in range(MAX_PAGES):
        params = {
            "tags": "story",
            "query": " OR ".join(keywords),
            "hitsPerPage": 50,
            "page": page,
        }

        try:
            resp = client.get(ALGOLIA_API, params=params)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            print(f"  [HN] page {page} FAILED: {e}")
            break

        hits = data.get("hits", [])
        if not hits:
            break

        for hit in hits:
            title = hit.get("title", "").strip()
            url = hit.get("url", "")
            if not title:
                continue

            # Fallback to HN discussion link if no external URL
            if not url:
                url = f"https://news.ycombinator.com/item?id={hit.get('objectID', '')}"

            story_id = hit.get("objectID", "")
            summary = f"HN discussion ({hit.get('num_comments', 0)} comments) | Points: {hit.get('points', 0)}"

            created = hit.get("created_at", "")
            try:
                dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
                pub_utc = dt.astimezone(timezone.utc).isoformat()
            except Exception:
                pub_utc = datetime.now(timezone.utc).isoformat()

            items.append({
                "title": title,
                "url": url,
                "summary": summary,
                "published_at": pub_utc,
                "source": source_name,
                "author": hit.get("author", "unknown"),
            })

        time.sleep(1)  # politeness

    client.close()
    return items
