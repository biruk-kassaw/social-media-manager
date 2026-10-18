# Product Brief: Creator Growth & Trend Intelligence

**Status:** Draft \| **Version:** 1.0 \| **Date:** 10 October 2026

## Overview

A general-purpose platform that helps creators and managers discover
emerging content trends, turn them into original ideas, plan publishing,
and learn from performance. It supports any niche, including education,
entertainment, lifestyle, food, fitness, gaming, and technology.

## Problem

Trend research and content planning are fragmented across platforms.
Creators must manually find promising content, judge whether it fits
their audience, plan posts, and review results. Local and global
opportunities can be difficult to compare consistently.

## Target Users

-   **Creator managers:** research trends and coordinate content for
    multiple creators.
-   **Creators:** get relevant ideas, publish consistently, and
    understand what resonates.
-   **Future teams/agencies:** manage multiple creator profiles and
    workspaces.

## Product Approach

Combine local and global trend discovery with explainable scoring and a
feedback loop from published-content performance. Help users adapt
successful concepts into original content, not copy or automatically
repost other creators' work.

## MVP: Trend Discovery

-   Web dashboard with manual public-link submission.
-   Discover trends from TikTok Creative Center, publicly accessible
    Instagram content, YouTube, and Google Trends where access is
    permitted and feasible.
-   Separate local, global, and combined feeds.
-   Store source links, timestamps, available metrics, and relevant
    topic/region/language labels.
-   Search, filter, sort, bookmark, and dismiss trends.
-   Rank opportunities using recency, growth and engagement when
    available, audience relevance, adaptability, and data confidence.
-   Explain recommendations and clearly label missing or uncertain data.

## Roadmap

1.  **Trend Discovery:** collect, organize, and score trend candidates.
2.  **AI Content Ideation:** generate editable hooks, concepts, scripts,
    captions, and production suggestions for each creator.
3.  **Content Planning:** manage content calendars and production
    status.
4.  **Analytics:** track available post metrics and identify useful
    performance patterns.
5.  **SaaS capabilities:** add team workspaces, permissions, and billing
    if validated by demand.

## Product Principles

-   **Modular:** build Trend Discovery first; add independently testable
    modules through documented interfaces.
-   **Practical:** start with a modular monolith and background workers,
    avoiding premature microservices.
-   **Human-controlled:** recommendations and drafts require user
    review; no automatic publishing in the MVP.
-   **Responsible:** respect platform terms, privacy, and copyright;
    public visibility does not imply unrestricted collection or reuse.
-   **Cost-conscious:** prioritize free or low-cost services, caching,
    and usage limits.

## Success Measures

-   Follower growth.
-   Average views and reach.
-   Engagement rate.
-   Publishing consistency.
-   Supporting product measures: trends reviewed, ideas used, research
    time saved, and collection reliability.

## MVP Success Criteria

Users can submit and review content references, browse local/global
feeds, filter and save trends, understand scores and data limitations,
and continue using stored results when a source fails. The Trend
Discovery module must run independently, have core automated tests, and
include setup and interface documentation.

## Key Constraint

Source access and available metrics vary by platform. Verify each
integration's permitted access, coverage, limits, and cost before
implementation. Trend scores are decision aids, not guarantees of
virality.
