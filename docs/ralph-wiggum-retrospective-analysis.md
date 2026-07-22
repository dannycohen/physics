# Ralph-loop retrospective: the landing-page design run

A retrospective on the session that added switchable alternative landing pages to this
site using a self-repeating `/ralph-loop:ralph-loop` invocation. It records what happened,
what to change, and a rephrased prompt that folds those lessons back in.

The companion decision log for the work itself is [`landing-audit.md`](./landing-audit.md).

## What the loop was asked to do

Add alternative landing pages beside the original textual list, with a switcher to move
between them. For each design: review the previous ones, state goal/theme/audience/
justification, then build it. Once 5 alternatives exist, define criteria, rank, remove
the 2 lowest, then repeat by adding 2 more. Maintain an audit trail. Configured with
`--max-iterations=3 --completion-promise="reach max iterations"`.

## Timeline

| # | Trigger | Action | Verification / outcome |
| --- | --- | --- | --- |
| 1 | Loop iteration 1 | Built shared `catalog.ts` + `LandingSwitcher`, audit doc, 3 designs (Gallery, Spotlight, Path); wired switcher into the baseline list | 0 errors, 31 pages, 195 tests, links OK; no commit |
| 2 | "continue with iteration 2" | Built Search + Map (→5); eval cycle 1 removed Search, Gallery | 31 pages, links clean, tests green |
| 3 | Stop hook → iteration 3 | Built Feed + Chooser (→5); eval cycle 2 removed Feed, Path; finalized audit; stated promise | 31 pages, 195 tests, links OK |
| 4 | Stop hook re-fired (4th) | Diagnosed loop misconfiguration; set `active:false`, corrected state; restated promise | Loop stopped on a true condition |
| 5 | "commit and push" | Ran tests + build, committed, pushed to `main` | Deploy triggered |
| 6 | "always verify deploy green" | Confirmed CI + Deploy success, curled live 200s; saved memory preference | Deploy green end-to-end |

## Loop, per iteration

| Iteration | Reviewed first | Designs added | Evaluation → culled | Pool after |
| --- | --- | --- | --- | --- |
| 1 | Baseline list only | Gallery, Spotlight, Path | — (only 3 exist) | 3 |
| 2 | The 3 above | Search, Map | Cycle 1: removed Search, Gallery | 3 (Spotlight, Path, Map) |
| 3 | The 3 survivors | Feed, Chooser | Cycle 2: removed Feed, Path | 3 (Spotlight, Chooser, Map) |

## Design lifecycle

| Design | Born | Fate | Reason |
| --- | --- | --- | --- |
| List (baseline) | pre-existing | permanent | Never in removable pool ("do not replace") |
| Spotlight | iter 1 | survives | Best onboarding, distinct, accessible |
| Gallery | iter 1 | culled cycle 1 | Prettier restatement of the baseline |
| Path | iter 1 | culled cycle 2 | "Builds on" affordance dormant (empty `prerequisites`) |
| Search | iter 2 | culled cycle 1 | Weak cold-start, JS-dependent, plain |
| Map | iter 2 | survives | Structural overview, no-JS |
| Feed | iter 3 | culled cycle 2 | Poor findability, gimmicky scroll |
| Chooser | iter 3 | survives | Only jargon-free question router |

## Process improvement recommendations

### Loop and workflow mechanics

| # | Recommendation | Source event |
| --- | --- | --- |
| 1 | Validate loop configuration at activation, not at exit. Reconcile the tool's reported state against the arguments passed before doing work. | State file recorded `max_iterations: 0` / `completion_promise: null` despite `--max-iterations=3`; the activation banner said "runs forever" and it went unflagged |
| 2 | Treat an open-ended instruction ("repeat the cycle") as needing an explicit termination contract up front. | Task step 4 has no natural end; only the CLI cap ended it |
| 3 | Plan the iteration budget against the task's arithmetic before starting, and state what "done" means at the cap. | The 3/2/2 split was improvised; the final state was an artifact of the cap, not a planned stop |
| 4 | When correcting a tool's state file by hand, say what the alternative was (report + ask vs. edit). | Iteration 4: manual edit of loop frontmatter to stop the runaway hook |

### Evaluation quality

| # | Recommendation | Source event |
| --- | --- | --- |
| 5 | Score designs with evidence (screenshots, axe pass, HTML size, tap-target checks), not judgment alone. | Eval cycles 1–2: all 10 scores per cycle were asserted, never measured |
| 6 | Fix the criteria before building candidates, not at first evaluation, so the rubric steers construction instead of rationalizing it. | Criteria first stated in iteration 2, after 5 designs existed |
| 7 | Don't build a design whose key affordance is known-dormant — populate minimal data first or pick another concept. | Path's "Builds on" rendered nothing (empty prerequisites); it was later culled for exactly that |
| 8 | Give evaluations a tie-break rule. | Cycle 2: Spotlight and Chooser both scored 22/25 |

### Verification and delivery

| # | Recommendation | Source event |
| --- | --- | --- |
| 9 | Keep working-directory discipline in long sessions: absolute paths or explicit `cd` per command. | A build failed after an earlier `cd src/content/viz` leaked into a later compound command |
| 10 | Visual designs deserve visual verification, not just structural checks. | All 7 variants verified only via grep/build/link-check; the browser tool sat unused |
| 11 | Front-load background-task hygiene; scope filesystem searches instead of `find /`. | A stray backgrounded `find /` produced two follow-up polls and a notification for zero information |
| 12 | Verify at the level the user cares about, not the level the tool reports: "push succeeded" ≠ "site works". | The "always verify the deploy is green" feedback, now saved to memory |

### Communication

| # | Recommendation | Source event |
| --- | --- | --- |
| 13 | Surface configuration doubts immediately rather than absorbing them. | The activation warning contradicted `--max-iterations=3` and I proceeded on my own interpretation |
| 14 | Record decisions in the artifact, not just the transcript — do more of this. | `landing-audit.md` let later iterations review prior designs without depending on chat context |
| 15 | When a cull deletes user-visible work, offer a preservation path (branch, snapshot commit). | Four culled designs were `rm`-ed and never committed, so they exist nowhere |

The sharpest lesson is #15 combined with #1: because the misconfiguration went unflagged
and no intermediate commits happened, the four culled designs are genuinely lost — the only
unrecoverable session artifacts. Everything else was recoverable friction.

## Rephrased prompt

Original vs. recommended, section by section.

| Section | Original | Recommended | Fixes |
| --- | --- | --- | --- |
| Goal | "Propose alternative landing page designs that are more appealing from different perspectives." | Build alternatives that are more appealing, each serving a distinctly different audience; "appealing" is judged by the criteria below, not asserted. | 5, 6 |
| Baseline | "Do not replace the existing landing page… navigation mechanism to switch between them." | Unchanged — this worked. | — |
| Criteria placement | Defined only at evaluation time. | Define the criteria (5 max) before building, with ≥2 objectively checkable ones and a tie-break rule; all designs built against them and scored with cited evidence. | 5, 6, 8 |
| Per-design steps | Review → define → implement. | Add: verify the key affordance has real data today (else populate a sample or pick another concept); screenshot the rendered page and record visual verification. | 7, 10, 14 |
| Evaluation cycle | Rank 5, remove 2, repeat. | Score with evidence cited per score; commit the full 5-design pool before deleting anything so culled designs survive in git. | 5, 15 |
| Termination | "Repeat the cycle by adding 2 more." | Stop after exactly 2 complete cycles (7 built, 3 survive); don't start a cycle the cap would cut off; if recorded loop config disagrees with the prompt, stop and report. | 1, 2, 3, 13 |
| Audit trail | "Maintain an audit trail." | Maintain the audit file as the single source of truth (criteria, rationale, evidence-linked scores, cull decisions, commit SHAs); each iteration resumable from it alone. | 14 |
| Commits | Unspecified. | Pre-approved commit checkpoints: first green pool, before each cull, final state; full test/typecheck/build/link-check before each; verify deploy green after each push. | 12, 15 |
| Flags | `--max-iterations=3 --completion-promise="reach max iterations"` | `--max-iterations=4 --completion-promise="two evaluation cycles complete and final audit written"` — promise tied to task state, one spare iteration as a safety net. | 1, 2, 3 |

### Assembled recommended prompt

```
The current landing page is a purely textual list. Design and build alternative
landing pages that are more appealing, each serving a distinctly different
audience or perspective. Do not replace the existing landing page: add new pages
alongside it plus a navigation mechanism to switch between them.

BEFORE building anything, define the evaluation criteria (5 max) in
docs/landing-audit.md, including at least two objectively checkable ones
(no-JS operation, axe scan, screenshot at 360px and desktop). Include a
tie-break rule.

For each new design:
1. Review all previously created landing pages (from the audit file).
2. Define goal, theme, target audience, and justification.
3. Verify the design's key affordance has real data behind it today; if not,
   populate a minimal sample first or choose a different concept.
4. Implement it and register it in the switcher.
5. Screenshot the rendered page and record visual verification in the audit.

Once 5 alternatives exist, run an evaluation cycle: score against the
pre-declared criteria with evidence cited per score, remove the 2 lowest.
Commit the full 5-design pool BEFORE deleting anything, so culled designs
survive in git history.

Stop after exactly 2 complete evaluation cycles (7 designs total, 3 survivors).
Do not start a cycle the iteration cap would cut off — finalize the audit
instead. If the loop's recorded configuration ever disagrees with this prompt,
stop and report the discrepancy.

Commit checkpoints (pre-approved): after the first pool is green, before each
cull, and at final state — full test suite, typecheck, build, and link-check
before each commit; verify the deploy lands green after each push.

Maintain docs/landing-audit.md as the single source of truth: criteria,
rationale, evidence-linked score tables, cull decisions, and commit SHAs.
Each iteration must be resumable from this file alone.
```

with flags: `--max-iterations=4 --completion-promise="two evaluation cycles complete and final audit written"`.
