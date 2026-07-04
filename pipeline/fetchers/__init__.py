"""Fetchers package — each fetcher returns List[RawItem]."""
from .arxiv import fetch as fetch_arxiv
from .rss import fetch as fetch_rss
from .hackernews import fetch as fetch_hackernews

FETCHERS = {
    "arxiv": fetch_arxiv,
    "rss": fetch_rss,
    "hackernews": fetch_hackernews,
}
