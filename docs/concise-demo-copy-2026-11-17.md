# Shorter demo copy — 17 November 2026

Five demos now use shorter instructions, empty states and notices. Project descriptions in Polish and English retain the implementation, verification and limitations, with three main sections each. Archived OAK-D evidence remains available in a collapsed disclosure. Professional experience pages (Samsung, Sorno and Tikrow) are outside this change.

## Description length

Visible English main content, including links and captions; archived evidence is collapsed in the new Posture view.

| Project | Before (words) | After (words) |
| --- | ---: | ---: |
| taskmesh | 844 | 154 |
| sentinelhub | 806 | 171 |
| dual-agent | 724 | 180 |
| posture-lab | 753 | 194 |
| spherex | 376 | 167 |

## Verification

- Both frontend builds pass; SPHEREx passes its 53 existing tests.
- All five descriptions pass keyboard/language checks, local links and axe WCAG A/AA at 1440, 768, 390 and 360 px.
- Seven public demo views pass desktop/mobile checks, with no browser errors or detected WCAG A/AA issues.
- All 45 public frontend assets match the release payload. All five application containers are healthy; 21 unrelated containers retain their previous IDs and images.
- Posture's public guest admission currently reaches its daily cap: the UI reports the HTTP 429 response. The RGB-D upload, 6 cm control result and PDF scenario is checked separately against the exact deployed image with a disposable database. Production admission limits and data are preserved.
- The public CI flow records this admission cap explicitly instead of treating it as an upload result.

Deployment versions and source revisions: [release record](concise-demos-release-2026-11-17.json).
