# Product Requirements Document (PRD)

## Creator Growth and Trend Intelligence Platform

**Version:** 1.1\
**Date:** 10 October 2026\
**Status:** Draft\
**Initial delivery:** Modular web application\
**Initial users:** Creator manager and a small group of creators\
**Initial platforms:** TikTok and Instagram\
**Initial discovery sources:** TikTok Creative Center, publicly
accessible Instagram content, YouTube, and Google Trends\
**Initial languages:** English and Amharic

## 1. Product Overview

The Creator Growth and Trend Intelligence Platform helps creators and
managers discover relevant trends, turn them into original content
ideas, plan publishing, and learn from performance data.

The product is **general-purpose**, supporting different content niches
such as fitness, entertainment, education, lifestyle, beauty, gaming,
food, and technology. Users should be able to configure their niche,
audience, region, language, and content style.

The product will initially be used to manage a small number of creators
and should be designed to evolve into a multi-creator SaaS product.

## 2. Problem and Vision

Creators and managers often research trends across separate platforms,
manually save examples, brainstorm ideas, maintain publishing calendars,
and review performance. This fragmented workflow makes it harder to
identify opportunities and publish consistently.

**Vision:** Give creators a practical, evidence-informed system for
deciding what to create, why it may resonate, and how to improve over
time.

The platform will combine: - Trend discovery from global and local
sources. - Original, audience-specific content ideas. - Content planning
and workflow management. - Performance tracking and learning.

It should help users adapt successful ideas and formats rather than copy
other creators' work or automatically repost their videos.

## 3. Goals and Success Measures

### Goals

-   Discover useful trends from selected sources, with separate local
    and global views.
-   Support both automated discovery and manual URL submission.
-   Rank trends using a balanced, explainable score.
-   Generate original content ideas tailored to each creator.
-   Plan and track content across supported platforms.
-   Support independently developable modules and keep early operating
    costs low.
-   Provide a path from an internal tool to a multi-creator SaaS
    product.

### Success measures

The platform should help users work toward: - Follower growth. - Higher
average views and reach. - Improved engagement. - More consistent
publishing.

These are outcomes to measure, not guaranteed results. Product usage
measures should also include trends reviewed, ideas accepted, time
saved, and planned content published.

## 4. Users

-   **Creator manager:** researches trends, chooses opportunities, plans
    content, and reviews results for multiple creators.
-   **Creator:** receives briefs, creates and publishes content, and
    reviews performance.
-   **Future workspace/team:** manages multiple creators with separate
    profiles, access controls, and reporting.

The initial version may use a simple workspace, but the design must not
hard-code the product to two specific creators.

## 5. MVP Scope: Trend Discovery

The first release will focus on a useful, standalone Trend Discovery
module.

### Included

-   Web dashboard.
-   Manual submission of public video, post, or trend URLs.
-   Discovery integrations for TikTok Creative Center, publicly
    accessible Instagram content, YouTube, and Google Trends where
    access is permitted and technically feasible.
-   Trend records with source links, timestamps, available metrics,
    topics, language and regional labels where known.
-   Separate local, global, and combined feeds.
-   Search, filters, sorting, bookmarking, and dismissing.
-   Explainable trend scoring and a short reason for each
    recommendation.
-   Source status, error handling, and clear labels for missing or
    uncertain data.
-   Documented interfaces for future modules.

### Not included in the MVP

-   Full AI script generation.
-   Content calendar and advanced workflow.
-   Direct scheduling or publishing.
-   Advanced analytics and monetization tools.
-   Billing and a complete multi-tenant SaaS administration system.
-   Downloading and reposting other creators' videos.

## 6. Functional Requirements

Priorities: **P0** = MVP, **P1** = later release.

### Trend discovery and records

-   **FR-01 (P0):** Users can submit a public content URL manually.
-   **FR-02 (P0):** The system stores source attribution, timestamps,
    platform, and available metadata.
-   **FR-03 (P0):** Source-specific adapters isolate collection logic so
    one source can be changed or disabled independently.
-   **FR-04 (P0):** The system supports the selected sources only
    through permitted and feasible access methods.
-   **FR-05 (P0):** Users can browse local, global, and combined trend
    feeds.
-   **FR-06 (P0):** Users can search, filter, sort, bookmark, and
    dismiss trend records.
-   **FR-07 (P0):** Missing metrics are shown as unavailable, not
    silently treated as zero.
-   **FR-08 (P0):** Users can see where information came from and when
    it was observed.

### Scoring and recommendations

-   **FR-09 (P0):** The system ranks trends using available evidence
    such as recency, growth, engagement, niche relevance, audience
    relevance, adaptability, and data confidence.
-   **FR-10 (P0):** The system explains the main factors behind each
    score.
-   **FR-11 (P0):** Growth velocity is calculated only when repeated
    observations or a trustworthy source metric supports it.
-   **FR-12 (P0):** Users can correct classifications or dismiss
    recommendations. Scores are decision aids, not guarantees of
    virality.

### Future modules

-   **FR-13 (P1):** AI ideation generates editable, original hooks,
    concepts, scripts, captions, calls to action, and filming or
    production suggestions tailored to a creator.
-   **FR-14 (P1):** Creator profiles store niche, audience, language,
    tone, content pillars, and preferences.
-   **FR-15 (P1):** Content planning supports a calendar,
    creator/platform assignment, status, planned date, publication date,
    and post URL.
-   **FR-16 (P1):** Analytics tracks available post metrics over time
    and compares results by creator, platform, topic, and format.
-   **FR-17 (P1):** English and Amharic are supported for relevant
    labels and AI-generated content, with human review for quality.

## 7. Modularity and Technical Direction

The system must be divided into modules with clear responsibilities,
documented interfaces, and independent tests. The first module, Trend
Discovery, must run and provide value before later modules exist.

Recommended starting architecture: **a modular monolith with
independently runnable background workers**, rather than full
microservices.

Initial modules: 1. **Trend Discovery:** collection, normalization,
deduplication, metadata, and scoring. 2. **AI Content Ideation:**
original ideas and creator-specific briefs. 3. **Content Planning:**
calendar and production workflow. 4. **Analytics:** time-stamped
performance data and comparisons. 5. **Creator Workspaces:** creator
profiles and, later, team access.

Background collection and AI processing must not block normal web
requests. One source failing must not make stored data or other sources
unavailable. Future modules should use documented APIs or contracts
rather than depend on internal implementation details.

## 8. Non-Functional Requirements

-   **Cost:** Prefer free or low-cost services, cache repeated work, and
    monitor API/AI usage.
-   **Reliability:** Show source failures and data freshness; use
    bounded retries and preserve stored records during outages.
-   **Security:** Protect credentials, enforce server-side access
    checks, and plan for workspace isolation before public SaaS launch.
-   **Data quality:** Store metric provenance and observation times;
    distinguish facts, estimates, and AI interpretations.
-   **Compliance:** Respect platform terms, access restrictions, privacy
    requirements, and copyright. Public visibility does not
    automatically permit unrestricted scraping or reuse.
-   **Usability:** Support desktop and mobile browsers and make missing
    data and status labels clear.
-   **Extensibility:** Allow new sources, niches, languages, and
    platforms without redesigning the whole product.

## 9. Initial Data Entities

Conceptual entities for technical design: - **User / Workspace:**
account and ownership boundary. - **Creator Profile:** niche, audience,
language, tone, platforms, and preferences. - **Source:** provider,
status, and last successful collection. - **Trend Item:** URL, platform,
creator/source details, topics, region/language labels, and
timestamps. - **Metric Observation:** metric name, value, source, and
observation time. - **Trend Assessment:** score, score version,
explanation, and confidence. - **Content Item:** creator, platform,
idea/script, workflow status, planned/published dates, and post URL.

Metrics should be time-stamped observations rather than simply
overwritten, so growth can be measured when sufficient data exists.

## 10. Acceptance Criteria for the MVP

The MVP is ready for initial use when: 1. A user can access the web
dashboard and submit a public content URL. 2. The system stores source
attribution and timestamps and clearly reports invalid URLs or
collection failures. 3. Users can view local, global, and combined feeds
and search/filter/sort records. 4. Users can bookmark and dismiss trend
records. 5. Scores have understandable explanations and do not claim to
predict virality with certainty. 6. Missing metrics are distinguishable
from zero values. 7. A failing source does not prevent access to stored
records or unrelated sources. 8. Core URL validation, scoring,
deduplication, and source-failure behavior have automated tests. 9.
Setup, configuration, module interfaces, and known limitations are
documented. 10. Trend Discovery can run without the future modules and
has a low-cost development/deployment path.

## 11. Risks and Open Decisions

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  Platform access changes             Isolate adapters and keep manual
                                      URL submission as a fallback

  Incomplete or inconsistent metrics  Preserve provenance, timestamps,
                                      and missing-data states

  Trends vary by audience and region  Maintain separate local/global
                                      feeds and configurable creator
                                      profiles

  AI recommendations are inaccurate   Show evidence, label generated
                                      interpretation, and require human
                                      review

  Scope grows too quickly             Build Trend Discovery first and
                                      validate it before adding modules

  API and AI costs rise               Use quotas, caching, configurable
                                      frequency, and usage monitoring

  Copyright or platform-policy        Support original adaptation and
  violations                          avoid unauthorized downloading or
                                      reposting
  -----------------------------------------------------------------------

Before implementing a connector, verify its current access method,
available fields, costs, regional coverage, rate limits, and terms.
Exact scoring weights, hosting, database, authentication, and
integration details will be decided in the technical design.

## 12. Roadmap

1.  **Validate:** confirm source access, initial niches/topics, data
    fields, and scoring rules.
2.  **Trend Discovery MVP:** dashboard, manual URLs, permitted source
    adapters, records, filters, scoring, and tests.
3.  **AI Ideation:** creator profiles and original, editable content
    briefs.
4.  **Content Planning:** calendar and production statuses.
5.  **Analytics:** time-stamped metrics and performance comparisons.
6.  **SaaS readiness:** workspaces, roles, tenant isolation, and billing
    if justified.

## 13. Definition of Done

A feature is complete when its behavior and acceptance criteria are
documented, tests pass, module boundaries are respected, errors and
missing data are handled, security checks are in place, setup
instructions are updated, and any recurring costs or external
dependencies are documented.

## 14. Summary

Build a general-purpose creator growth platform that starts with an
independently useful Trend Discovery module. Use it to find and assess
relevant content opportunities, then add AI ideation, planning, and
analytics as separate modules. Keep recommendations explainable,
workflows human-controlled, costs low, and the architecture ready to
support multiple creators and niches.
