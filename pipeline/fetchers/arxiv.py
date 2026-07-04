"""arXiv Atom API fetcher. Respects ~3s/request politeness with exponential backoff."""
import time
import httpx
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
ATOM_NS = {"atom": "http://www.w3.org/2005/Atom"}
MAX_RESULTS_PER_QUERY = 100
POLITENESS_DELAY = 3.5  # seconds between requests


def fetch(source_name: str, query: str, _enabled: bool = True) -> List[RawItem]:
    """Fetch papers from arXiv Atom API with pagination."""
    items: List[RawItem] = []
    start = 0
    client = httpx.Client(timeout=15, headers={"User-Agent": "FrontierRadar/1.0"}, follow_redirects=True)

    while True:
        params = {
            "search_query": query,
            "start": start,
            "max_results": min(MAX_RESULTS_PER_QUERY, 50),  # smaller batch for faster response
            "sortBy": "submittedDate",
            "sortOrder": "descending",
        }

        for attempt in range(3):
            try:
                resp = client.get(ARXIV_API, params=params)
                resp.raise_for_status()
                break
            except Exception as e:
                if attempt < 2:
                    wait = 2 ** (attempt + 1)  # 2s, 4s
                    print(f"  [arXiv] retry {attempt+1}/3, wait {wait}s: {e}")
                    time.sleep(wait)
                else:
                    print(f"  [arXiv] FAILED after 3 attempts: {e}")
                    client.close()
                    return items

        root = ET.fromstring(resp.text)
        entries = root.findall("atom:entry", ATOM_NS)

        if not entries:
            break

        for entry in entries:
            title = entry.find("atom:title", ATOM_NS).text.strip().replace("\n", " ")
            summary = entry.find("atom:summary", ATOM_NS).text.strip().replace("\n", " ")
            link = entry.find("atom:link[@type='text/html']", ATOM_NS)
            if link is None:
                link = entry.find("atom:link", ATOM_NS)
            url = link.get("href", "")

            # Normalize URL: strip version suffix for dedup stability
            if "/abs/" in url:
                url = url.split("?")[0].rstrip("/")

            published = entry.find("atom:published", ATOM_NS).text.strip()

            # Parse ISO8601 → UTC
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
                "summary": summary[:500],  # cap summary length
                "published_at": pub_utc,
                "source": source_name,
                "author": author,
            })

        start += len(entries)
        if len(entries) < MAX_RESULTS_PER_QUERY:
            break

        time.sleep(POLITENESS_DELAY)

    client.close()
    return items
