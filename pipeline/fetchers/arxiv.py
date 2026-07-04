"""arXiv fetcher — Atom API with RSS fallback."""
import time
import httpx
import feedparser
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import List, TypedDict


class RawItem(TypedDict):
    title: str
    url: str
    summary: str
    published_at: str  # UTC ISO8601
    source: str
    author: str


ARXIV_API = "https://export.arxiv.org/api/query"
ARXIV_RSS_BASE = "https://rss.arxiv.org/rss"
ATOM_NS = {"atom": "http://www.w3.org/2005/Atom"}
MAX_RESULTS = 50


def _fetch_via_api(source_name: str, query: str) -> List[RawItem]:
    """Primary: arXiv Atom API."""
    items: List[RawItem] = []
    client = httpx.Client(timeout=20, headers={"User-Agent": "FrontierRadar/1.0"}, follow_redirects=True)

    # Extract category from query like "cat:cs.RO" or "cat:cs.AI OR cat:cs.CL"
    params = {
        "search_query": query,
        "start": 0,
        "max_results": MAX_RESULTS,
        "sortBy": "submittedDate",
        "sortOrder": "descending",
    }

    try:
        resp = client.get(ARXIV_API, params=params)
        resp.raise_for_status()
    except Exception as e:
        print(f"  [arXiv API] FAILED: {e}")
        client.close()
        return items

    root = ET.fromstring(resp.text)
    entries = root.findall("atom:entry", ATOM_NS)

    for entry in entries:
        title = entry.find("atom:title", ATOM_NS).text.strip().replace("\n", " ")
        summary = entry.find("atom:summary", ATOM_NS).text.strip().replace("\n", " ")
        link = entry.find("atom:link[@type='text/html']", ATOM_NS)
        if link is None:
            link = entry.find("atom:link", ATOM_NS)
        url = link.get("href", "")
        if "/abs/" in url:
            url = url.split("?")[0].rstrip("/")

        published = entry.find("atom:published", ATOM_NS).text.strip()
        try:
            dt = datetime.fromisoformat(published.replace("Z", "+00:00"))
            pub_utc = dt.astimezone(timezone.utc).isoformat()
        except Exception:
            pub_utc = published

        authors = entry.findall("atom:author/atom:name", ATOM_NS)
        author = authors[0].text if authors else "unknown"

        items.append({
            "title": title,
            "url": url,
            "summary": summary[:500],
            "published_at": pub_utc,
            "source": source_name,
            "author": author,
        })

    client.close()
    return items


def _fetch_via_rss(source_name: str, category: str) -> List[RawItem]:
    """Fallback: arXiv RSS feed (faster, no rate limit)."""
    items: List[RawItem] = []
    rss_url = f"{ARXIV_RSS_BASE}/{category}"

    try:
        client = httpx.Client(timeout=15, headers={"User-Agent": "FrontierRadar/1.0"}, follow_redirects=True)
        resp = client.get(rss_url)
        resp.raise_for_status()
        feed = feedparser.parse(resp.text)
        client.close()
    except Exception as e:
        print(f"  [arXiv RSS] FAILED: {e}")
        return items

    for entry in feed.entries[:MAX_RESULTS]:
        title = entry.get("title", "").strip()
        link = entry.get("link", "").strip()
        if not title or not link:
            continue

        import re
        summary = re.sub(r"<[^>]+>", "", entry.get("summary", "")).strip()[:500]

        # arXiv RSS links are like http://arxiv.org/abs/2401.12345v1
        if "/abs/" in link:
            link = link.split("?")[0].rstrip("/")
            # Normalize to https
            link = link.replace("http://arxiv.org", "https://arxiv.org")

        published = ""
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            try:
                dt = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
                published = dt.isoformat()
            except Exception:
                pass
        if not published:
            published = datetime.now(timezone.utc).isoformat()

        # Extract author from summary (arXiv RSS puts it there)
        author = "unknown"
        author_match = re.search(r"Authors?:\s*([^\n<]+)", entry.get("summary", ""))
        if author_match:
            author = author_match.group(1).strip().split(",")[0]

        items.append({
            "title": title,
            "url": link,
            "summary": summary,
            "published_at": published,
            "source": source_name,
            "author": author,
        })

    return items


def fetch(source_name: str, query: str, _enabled: bool = True) -> List[RawItem]:
    """Fetch arXiv papers. Try API first, fall back to RSS."""
    # Extract category for RSS fallback
    # "cat:cs.RO" → "cs.RO", "cat:cs.AI OR cat:cs.CL" → "cs.AI"
    category = query.replace("cat:", "").split(" OR ")[0].strip()

    # Try API first
    items = _fetch_via_api(source_name, query)
    if items:
        return items

    # Fallback to RSS
    print(f"  [arXiv] API failed, falling back to RSS for {category}")
    return _fetch_via_rss(source_name, category)
