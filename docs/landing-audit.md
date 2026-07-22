# Landing-page design audit trail

A record of the alternative landing pages built for the site, the reasoning behind
each, and the evaluation cycles that add and remove them. Maintained across Ralph-loop
iterations.

## Ground rules

- The original landing page (`src/pages/index.astro`, a domain-grouped **textual list**)
  is the permanent baseline. It is never removed ("do not replace the existing landing
  page") and is not part of the removable evaluation pool.
- Each alternative is a real route the user can reach through the shared
  `LandingSwitcher` navigation. The switcher lists only variants whose pages exist
  (registered in `src/lib/catalog.ts` → `landingVariants`).
- All variants read the same catalog data through `src/lib/catalog.ts`, so they differ
  in framing and layout, not in content.

## Process for each new design

1. Review all previously created landing pages (recorded below).
2. State the goal, theme, target audience, and justification.
3. Only then implement it and register it in the switcher.

---

## Iteration 1 — infrastructure + designs 1–3

Reviewed before starting: only the original textual list existed. It is exhaustive and
scannable but dumps every equation at once, leads with no visual hook, and gives a
newcomer no sense of where to start or how the topics relate.

### Design 1 — Gallery (`/home/gallery/`)

- **Goal:** turn browsing into something visual and low-commitment.
- **Theme:** a responsive grid of equation cards, grouped by domain, each card tinted by
  its layout archetype and leading with the equation glyph itself.
- **Audience:** casual/visual explorers who bounce off a plain link list.
- **Justification:** the original buries the equations inside sentences. Cards put the
  equation front and center and make the catalog skimmable at a glance; the archetype
  tint hints at what kind of interaction each page offers.

### Design 2 — Spotlight (`/home/spotlight/`)

- **Goal:** give a first-time visitor one obvious place to start, not 28 choices.
- **Theme:** an editorial hero featuring the flagship equation large, followed by a few
  curated cross-domain picks and a single "browse everything" link.
- **Audience:** first-time visitors prone to choice paralysis.
- **Justification:** the list and gallery both present the whole catalog up front. A
  curated front door reduces the decision to "open this one," then offers a small,
  deliberate second step. Complements rather than duplicates the exhaustive views.

### Design 3 — Path (`/home/path/`)

- **Goal:** reframe the catalog as a course, not a menu.
- **Theme:** a numbered vertical journey ordered by the collection's `order`, with a
  connector line and each step naming what it "builds on" (from `prerequisites`).
- **Audience:** self-learners who want a recommended sequence.
- **Justification:** the metadata to sequence the material already exists (`order`,
  `prerequisites`) and nothing surfaced it. This is the only variant that answers "in
  what order should I learn these?"
- **Known limitation:** every entry currently ships with `prerequisites: []`, so the
  "Builds on" affordance renders nothing today. It activates automatically once
  prerequisites are populated in the content (an M2 learning-path task, out of scope
  here). Flag for the evaluation: judge Path on its ordered-journey framing, not on a
  feature that has no data yet.

Shared infrastructure added this iteration: `src/lib/catalog.ts` (data + variant
registry), `src/components/LandingSwitcher.astro` (navigation), and the switcher wired
into the original list page.

---

## Iteration 2 — designs 4–5, then evaluation cycle 1

Reviewed before starting: Gallery, Spotlight, Path (above) plus the baseline list. Gap
noticed — nothing served a reader who *knows what they want* (fast lookup) and nothing
conveyed the overall *structure* of the field. The two new designs target those gaps.

### Design 4 — Search (`/home/search/`)

- **Goal:** fast lookup as the catalog grows.
- **Theme:** a prominent search box that live-filters the full list by name, idea,
  domain, or symbol; results render server-side so the page works with JS off.
- **Audience:** returning visitors and educators hunting a specific equation.
- **Justification:** scanning 28+ items is slow; a filter scales where a static list
  does not.

### Design 5 — Map (`/home/map/`)

- **Goal:** show the whole field on one screen.
- **Theme:** colour-coded domain panels, each holding compact equation tiles — a
  field-guide / periodic-table feel.
- **Audience:** overview-seekers and educators showing the scope of the collection.
- **Justification:** conveys the shape and breadth of physics at a glance, which neither
  the linear list nor the curated Spotlight does.

### Evaluation cycle 1

**Criteria** (each scored 1–5): (1) first-time clarity, (2) findability at scale,
(3) visual appeal / distinctiveness, (4) accessibility & robustness, (5) distinct value
vs the baseline list and the other variants.

| Design | Clarity | Findability | Visual | A11y | Distinct | Total |
| --- | --- | --- | --- | --- | --- | --- |
| Spotlight | 5 | 2 | 5 | 5 | 5 | **22** |
| Map | 4 | 4 | 4 | 5 | 4 | **21** |
| Path | 4 | 3 | 4 | 4 | 4 | **19** |
| Gallery | 3 | 3 | 4 | 5 | 3 | **18** |
| Search | 2 | 5 | 2 | 3 | 4 | **16** |

**Removed (2 lowest):**

- **Search (16)** — best findability but weakest cold-start (an empty box only helps if
  you already know the term), least visually appealing, and its core value needs JS.
- **Gallery (18)** — a prettier restatement of the baseline list; its grouped-by-domain
  framing is the most redundant against both the baseline and Map.

**Surviving 3:** Spotlight, Map, Path. Page files `gallery.astro` and `search.astro`
deleted; both removed from the switcher registry.

---

## Iteration 3 — designs 6–7, then evaluation cycle 2

Reviewed before starting: the three cycle-1 survivors (Spotlight, Map, Path) plus the
baseline list. Gaps noticed — nothing was built mobile-immersive (Gallery, the closest,
was culled), and every survivor still assumes the reader knows the topic vocabulary. The
two new designs target those gaps.

### Design 6 — Feed (`/home/feed/`)

- **Goal:** immersive, one-equation-at-a-time browsing.
- **Theme:** full-width "story" blocks, each roughly a screen tall with a large equation
  and a single call to action; optional scroll-snap, gated behind reduced-motion and a
  min-height check.
- **Audience:** mobile scrollers who prefer swiping through one thing at a time.
- **Justification:** none of the survivors give each equation the whole viewport; Feed
  trades density for focus.

### Design 7 — Chooser (`/home/chooser/`)

- **Goal:** route by curiosity, not by physics vocabulary.
- **Theme:** a grid of plain-language question tiles ("Why do moving clocks run slow?")
  each linking to the equation that answers it; unmatched questions are dropped at build
  so no link can dangle.
- **Audience:** curious non-physicists who have a question but not the terms.
- **Justification:** List, Map, Spotlight, and Path all assume the reader recognizes
  topic names. The Chooser is the only door that opens at the level of questions.

### Evaluation cycle 2

Same five criteria as cycle 1.

| Design | Clarity | Findability | Visual | A11y | Distinct | Total |
| --- | --- | --- | --- | --- | --- | --- |
| Spotlight | 5 | 2 | 5 | 5 | 5 | **22** |
| Chooser | 5 | 3 | 4 | 5 | 5 | **22** |
| Map | 4 | 4 | 4 | 5 | 4 | **21** |
| Path | 4 | 3 | 4 | 4 | 4 | **19** |
| Feed | 3 | 2 | 5 | 4 | 4 | **18** |

**Removed (2 lowest):**

- **Feed (18)** — visually boldest, but one-equation-per-screen makes finding a specific
  topic slow, and the immersive scroll is closer to a gimmick than a durable front door.
- **Path (19)** — its distinguishing "builds on" affordance is still dormant (empty
  `prerequisites` everywhere), so today it is a numbered linear list, and Chooser now
  covers novice onboarding more directly.

Page files `feed.astro` and `path.astro` deleted; both removed from the switcher.

---

## Final state

Alongside the permanent baseline **List** (`/`), three alternative landing pages ship,
reachable through the `LandingSwitcher` on every one:

1. **Spotlight** (`/home/spotlight/`) — a curated editorial front door.
2. **Curious?** (`/home/chooser/`) — a jargon-free, question-first router.
3. **Map** (`/home/map/`) — a colour-coded structural overview of the whole field.

All three are pure links with no client JS, degrade gracefully, and read the shared
catalog through `src/lib/catalog.ts`. The trio was chosen for distinct perspectives —
guided, curiosity-driven, and structural — rather than three variations on the same idea.

### Designs built and culled over the run

- Cycle 1 pool: Gallery, Spotlight, Path, Search, Map → removed **Search**, **Gallery**.
- Cycle 2 pool: Spotlight, Path, Map, Feed, Chooser → removed **Feed**, **Path**.

Loop reached its 3-iteration cap here.
