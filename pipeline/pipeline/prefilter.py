"""Rule-based pre-filter: drop items outside time window, no domain keywords, obvious junk."""
import re
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Set


# Domain keywords for filtering generic sources (HN, Reddit)
DOMAIN_KEYWORDS: Dict[str, Set[str]] = {
    "ai": {
        "ai", "artificial intelligence", "llm", "large language model", "gpt",
        "chatgpt", "claude", "gemini", "transformer", "neural", "deep learning",
        "machine learning", "ml", "nlp", "multimodal", "agent", "rag",
        "fine-tuning", "inference", "openai", "anthropic", "hugging", "diffusion",
    },
    "embodied": {
        "robot", "robotics", "embodied", "vla", "diffusion policy", "humanoid",
        "manipulation", "sim-to-real", "slam", "ros", "grasp", "locomotion",
        "quadruped", "bimanual", "figure", "unitree", "physical intelligence",
    },
    "drone": {
        "drone", "uav", "quadrotor", "vtol", "evtol", "unmanned", "aerial",
        "low-altitude", "dji", "skydio", "autonomous flight", "drone swarm",
    },
}

# Compile all keywords into a single set for fast matching
ALL_KEYWORDS = set()
for kw_set in DOMAIN_KEYWORDS.values():
    ALL_KEYWORDS.update(kw_set)

# Regex pattern for keyword matching (word boundary)
_KEYWORD_PATTERN = re.compile(
    r"\b(" + "|".join(re.escape(k) for k in sorted(ALL_KEYWORDS, key=len, reverse=True)) + r")\b",
    re.IGNORECASE,
)


def has_domain_keyword(title: str, summary: str) -> bool:
    """Check if title or summary contains any domain keyword."""
    text = f"{title} {summary}"
    return bool(_KEYWORD_PATTERN.search(text))


def prefilter(items: List[Dict[str, Any]], max_age_days: int = 7) -> List[Dict[str, Any]]:
    """Filter items: keep only those within time window and with domain relevance."""
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=max_age_days)
    kept = []

    for item in items:
        # Time window check
        try:
            pub = datetime.fromisoformat(item["published_at"].replace("Z", "+00:00"))
            if pub < cutoff:
                continue
        except Exception:
            pass  # keep if time unparseable

        # Domain keyword check for generic sources
        source = item.get("source", "")
        if source in ("Hacker News",):
            if not has_domain_keyword(item.get("title_raw", ""), item.get("summary_zh", "")):
                # Use raw fields since LLM hasn't run yet
                if not has_domain_keyword(item.get("title_raw", ""), ""):
                    continue

        kept.append(item)

    return kept
