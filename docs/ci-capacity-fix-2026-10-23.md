# Public demo flow capacity fix — 23 October 2026

Run #26 failed because SentinelHub had reached 25 workspaces (HTTP 507),
and Posture had reached 30 active guest accounts (HTTP 429). The browser
timeouts hid these capacity responses. Repeated test runs retained their
primary workspace and both guest accounts until expiration.

## Changes

- SentinelHub supports 100 workspaces while retaining its 8 MiB per-workspace
  limit, bounded SQLite database, authorization and 24-hour expiry for new workspaces.
- Posture allows 60 active guest accounts so two daily admission windows can
  overlap 24-hour data retention. Admission remains 5 per visitor and 30 globally
  per day; the 100 MiB global capture limit remains unchanged.
- Authenticated, CSRF-protected `DELETE /api/private/guest` deletes only the
  current guest and its own captures/sessions. It preserves admission counters
  and cannot delete an owner account or another guest.
- E2E tests clean up their own workspaces and guests in `finally` blocks,
  including failed scenarios. Cleanup errors fail the workflow. Creation HTTP
  errors are reported directly instead of becoming disabled-button timeouts.

## Deployment

Source commits: SentinelHub `25b7936`, private Posture repository `49ba358`.
Both services use release/image tag `ci-fix-20261023`. Consistent SQLite backups
and the previous releases remain on the host. Existing visitor data was preserved.

## Validation

- SentinelHub: 110 pytest tests; Ruff passes.
- Posture: 41 unittest tests, including guest deletion isolation, CSRF, owner
  protection, preserved rate limits and overlapping admission windows.
- Portfolio local links and anchors checked on 11 pages; test script syntax checked.
- Independent public end-to-end run #27 passed all scenarios, including cleanup:
  https://github.com/Adam-Sapiecha/Portfolio-AdamSapiecha/actions/runs/39867732142
- SentinelHub independent quality workflow passed:
  https://github.com/Adam-Sapiecha/SentinelHub/actions/runs/39866765453
