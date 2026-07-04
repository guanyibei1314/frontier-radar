"""Generic RSS/Atom fetcher using feedparser."""
import feedparser
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


def fetch(source_name: str, url: str, _enabled: bool = True) -> List[RawItem]:
    """Fetch items from an RSS/Atom feed URL."""
    items: List[RawItem] = []

    try:
        client = httpx.Client(timeout=20, headers={"User-Agent": "FrontierRadar/1.0"})
        resp = client.get(url)
        resp.raise_for_status()
        feed = feedparser.parse(resp.text)
        client.close()
    except Exception as e:
        print(f"  [RSS] {source_name} FAILED: {e}")
        return items

    for entry in feed.entries:
        title = entry.get("title", "").strip()
        link = entry.get("link", "").strip()
        if not title or not link:
            continue

        summary = entry.get("summary", entry.get("description", ""))
        # Strip HTML tags crudely
        import re
        summary = re.sub(r"<[^>]+>", "", summary).strip()[:500]

        # Parse published time
        published_at = ""
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            try:
                dt = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
                published_at = dt.isoformat()
            except Exception:
                pass
        if not published_at and hasattr(entry, "updated_parsed") and entry.updated_parsed:
            try:
                dt = datetime(*entry.updated_parsed[:6], tzinfo=timezone.utc)
                published_at = dt.isoformat()
            except Exception:
                pass
        if not published_at:
            published_at = datetime.now(timezone.utc).isoformat()

        author = entry.get("author", "unknown")

        items.append({
            "title": title,
            "url": link.split("?")[0].rstrip("/"),
            "summary": summary,
            "published_at": published_at,
            "source": source_name,
            "author": author,
        })

    return items
