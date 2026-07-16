#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import UTC, datetime, timedelta
from pathlib import Path


GRAPHQL_QUERY = """
query PortfolioGithubInsights($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    login
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        isArchived
        stargazerCount
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
"""


def post_graphql(query: str, variables: dict[str, str], token: str) -> dict:
    payload = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    request = urllib.request.Request(
        "https://api.github.com/graphql",
        data=payload,
        headers={
          "Authorization": f"Bearer {token}",
          "Content-Type": "application/json",
          "User-Agent": "connectwithsajid-portfolio-github-insights"
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def compute_streaks(days: list[dict[str, object]]) -> tuple[int, int]:
    longest = 0
    current = 0
    streak = 0
    for day in days:
        count = int(day["count"])
        if count > 0:
            streak += 1
            longest = max(longest, streak)
        else:
            streak = 0
    for day in reversed(days):
        if int(day["count"]) > 0:
            current += 1
        else:
            break
    return longest, current


def main() -> int:
    token = os.getenv("GITHUB_TOKEN")
    username = os.getenv("GITHUB_USER", "connectwithsajid")
    output_path = Path(os.getenv("GITHUB_INSIGHTS_OUTPUT", "assets/data/github-insights.json"))

    if not token:
        print("GITHUB_TOKEN is required", file=sys.stderr)
        return 1

    now = datetime.now(UTC).replace(microsecond=0)
    from_dt = now - timedelta(days=365)
    variables = {
      "login": username,
      "from": from_dt.isoformat().replace("+00:00", "Z"),
      "to": now.isoformat().replace("+00:00", "Z"),
    }

    try:
        payload = post_graphql(GRAPHQL_QUERY, variables, token)
    except urllib.error.URLError as exc:
        print(f"GitHub request failed: {exc}", file=sys.stderr)
        return 1

    if payload.get("errors"):
        print(json.dumps(payload["errors"], indent=2), file=sys.stderr)
        return 1

    user = payload["data"]["user"]
    repo_nodes = [repo for repo in user["repositories"]["nodes"] if not repo.get("isArchived")]
    contribution_days = []
    for week in user["contributionsCollection"]["contributionCalendar"]["weeks"]:
        for day in week["contributionDays"]:
            contribution_days.append({
              "date": day["date"],
              "count": int(day["contributionCount"])
            })

    language_totals: dict[str, dict[str, object]] = {}
    total_stars = 0
    for repo in repo_nodes:
        total_stars += int(repo.get("stargazerCount", 0))
        for edge in repo.get("languages", {}).get("edges", []):
            language_name = edge["node"]["name"]
            current = language_totals.setdefault(language_name, {
              "name": language_name,
              "bytes": 0,
              "color": edge["node"].get("color") or "#9bc8bd"
            })
            current["bytes"] = int(current["bytes"]) + int(edge["size"])

    total_language_bytes = sum(int(item["bytes"]) for item in language_totals.values()) or 1
    top_languages = sorted(language_totals.values(), key=lambda item: int(item["bytes"]), reverse=True)
    top_languages = [
      {
        "name": item["name"],
        "bytes": int(item["bytes"]),
        "color": item["color"],
        "percentage": round((int(item["bytes"]) / total_language_bytes) * 100, 2),
      }
      for item in top_languages[:8]
    ]

    total_30d = sum(day["count"] for day in contribution_days[-30:])
    total_365d = sum(day["count"] for day in contribution_days)
    longest_streak, current_streak = compute_streaks(contribution_days)

    output = {
      "username": user["login"],
      "generated_at": now.isoformat().replace("+00:00", "Z"),
      "summary": {
        "public_repo_count": len(repo_nodes),
        "total_contributions_30d": total_30d,
        "total_contributions_365d": total_365d,
        "longest_streak": longest_streak,
        "current_streak": current_streak,
        "total_stars": total_stars
      },
      "contribution_days": contribution_days,
      "top_languages": top_languages
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote GitHub insights to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
