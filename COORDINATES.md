# FrankNoir GPS Coordinates Reference

All coordinates verified via Google Maps / location databases.

## Stage Locations

| Stage | Location | Address | Coordinates | Radius |
|-------|----------|---------|-------------|--------|
| 01 | **Home** (Origin) | *Update with your address* | 39.1031, -84.5120 | 50m |
| 02 | **Sleepy Bee Cafe** | 8 E 4th St, Cincinnati | 39.1001, -84.5123 | GPS trigger |
| 03 | **Covington Core** (Radio) | Downtown Covington, KY | 39.0677, -84.5164 | GPS trigger |
| 04 | **Gelato** | Mainstrasse Village, Covington | 39.0872, -84.5089 | 30m |
| 05 | **Dimitridon Studios** (Crystals) | Covington, KY | 39.0680, -84.5120 | GPS trigger |
| 06 | **Roebling Bridge** | Bridge midpoint | 39.0953, -84.5089 | 50m |
| 07 | **Cincinnati Art Museum** | 953 Eden Park Dr | 39.1145, -84.4968 | 100m |
| 08 | **Art Museum** (Damascus) | 953 Eden Park Dr | 39.1145, -84.4968 | Same as 07 |
| 09 | **Art Museum Exit** | 953 Eden Park Dr | 39.1145, -84.4968 | 100m |
| 10 | **The Landing** (420 Protocol) | 4029 Smith Rd | 39.1515, -84.4460 | GPS trigger |
| 11 | **Home** (Safe House) | *Update with your address* | 39.1031, -84.5120 | Time lock |
| 12 | **Art of the Brick** | 18 W 4th St, Downtown | 39.1000, -84.5120 | 75m |
| 13 | **Krohn Conservatory** | 1501 Eden Park Dr | 39.1158, -84.4938 | GPS trigger |
| 14 | **Over-the-Rhine** (Glitch) | OTR neighborhood | 39.1100, -84.5150 | 15m |
| 15 | **Nicola's Ristorante** | 1420 Sycamore St, OTR | 39.1122, -84.5106 | 30m |

## Notes

**TODO for you:**
- Update Stage 01 and Stage 11 coordinates with your actual home address
- Field test GPS accuracy at 2-3 locations (recommended: Sleepy Bee, Art Museum, Nicola's)
- Adjust unlock radiuses if needed based on real-world testing

**Unlock Types:**
- `gps` - Proximity-based unlock (must be within radius)
- `scan` - AR scanning (simulated in MVP)
- `puzzle` - Interactive puzzle (radio frequency, coordinates)
- `time` - Time-locked (5:00 PM for Stage 11)

**Distance Reference:**
- 15m = Very close (tight radius for urban areas)
- 30m = Close (good for storefronts)
- 50m = Medium (good for buildings/blocks)
- 75-100m = Wide (good for museums/large venues)
