"""POST /reports — rider-submitted "I see a coaster here" pings.

Feeds into the crowdsourced position stream for routes without driver-app
coverage. Rate-limited per device and later scored by the anti-spam service
(see Open Questions in POC.md).
"""
