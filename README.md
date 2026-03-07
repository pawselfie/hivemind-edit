# Deepsea Hive Builder

A web-based hive planning tool for **Bee Swarm Simulator**, fork of Dully's fork of **Hivemind** by t4styl.

Plan your hive layout visually, assign bees, set levels, apply mutations, equip beequips, and export your build — all in the browser, no installation needed, and faster than ever.

---

## Extra Features

- **Bee and Beequip Images** — Brings an image to each Bee and Beequip selection to ease search
- **Unreleased Beequips** — Has all 12 Unreleased Beequips found in Onett's inventory
- **Better Style** — A more consistent style made out of a shade of dark blue
- **Replaced Dialogs** — Dialogs are now their own GUI, and aren't dependant on the browser
- **Keybinds** — You can do quick actions via Keybinds instead of having to use your mouse; a full keybind reference is accessible via the **Show Keybinds** button in the header
- **Share your Hive** — Send a 1-Click URL of your hive so others can edit it
- **More Utility Buttons:**
  - Select All Slots
  - Remove Mutation
  - Clear Hive
  - Hide/Show Levels
  - Empty Partial Slot
  - Set Partial Level
- **Token Sources Panel** — A live slide-out panel on the left edge that lists every ability token your hive produces, how many sources each token has, and whether any are in a partial (transitional) slot; see the full spec below
- **Presets** — Load curated hive builds from the menu across Blue, Red, White, RBC, and Alts tabs; save and manage your own builds in the Custom tab
- **Partial Slots** — Overlay a second bee on the right half of any slot using `Ctrl`+click, with its own beequip, mutation, and level; see the full spec below

---

## Presets

The menu includes a preset panel with curated hive builds organized into tabs:

| Tab | Contents |
|-----|----------|
| **Blue** | Blue Hive, Blessing Boost Comp, Diamond Comp, Honeyday Comp, Pop Gummy Comp |
| **Red** | Red Hive, Bloom Comp, Scorch Gummy Comp |
| **White** | White Hive |
| **RBC** | RBC Hive, RBC Blue Hive |
| **Alts** | Fuzzy, Tad, Buoyant, Blue-Guide, Guide, Attack, Mondo Attack, Guide-Fuzzy, Guide-Buo, Tri-Hybrid, Tetra-Hybrid Alts |
| **Custom** | Your saved builds — see below |

### Custom Presets

The **Custom** tab lets you save and manage your own hive builds, stored locally in your browser.

- Click **+ Create Preset** to save the hive you're currently editing — you'll be prompted to give it a name
- Click a saved preset to load it
- Click the **×** next to a preset to delete it

Custom presets persist across sessions via `localStorage`.

---

## Partial Slots

Partial slots let you plan two bees on a single hive slot — the original bee occupies the left half and the partial bee occupies the right half.

### Setting a partial slot
| Action | How |
|--------|-----|
| Set partial bee | Hold `Ctrl` and click a bee button |
| Set partial beequip | Hold `Ctrl` and click a beequip button |
| Set partial mutation | Hold `Ctrl` and click a mutation button |
| Set partial level | Hold `Ctrl` + `Arrow` (if slot has a partial bee), or use **Set Partial Level** button |
| Clear all partial data | `Backspace` (first press), or **Empty Partial Slot** button |

### How it renders
- Partial bee appears on the **right half** of the slot
- A thin black line divides the slot from top-right to bottom-left vertex
- When a partial is present: the **regular beequip** moves to the **bottom-left corner**; the **partial beequip** renders at the **bottom-right corner**
- Partial level is shown at the **mirrored X position** of the regular level number; hidden when it matches the regular level and mutation

### Backspace behavior
| Keys | Effect |
|------|--------|
| `Backspace` | If any partial data exists: clears partial bee, beequip, mutation, level. Otherwise: clears bee, beequip, and mutation |
| `Ctrl + Backspace` | Clears regular bee and beequip only (partial data is untouched) |

---

## Token Sources Panel

The **Token Sources** panel slides out from the left edge of the screen while you're in the hive builder. Click the vertical tab (labeled **Token Sources**) to open or close it.

### What it shows

The panel lists every ability token produced by the bees and beequips in your hive. Each row shows:

| Column | Meaning |
|--------|---------|
| **Count** (teal) | Number of committed sources for this token |
| **Count** (orange, `f/t` format) | `f` committed + some partial sources — the total including partial slots is `t` |
| **Token name** | Normalized token name (e.g. `Baby Love`, `Red Boost`) |

Rows are sorted by a fixed priority list (Baby Love → Token Link → Melody → Haste → Honey Mark → Red Boost → Blue Boost → …), then by total count descending, then alphabetically.

### Token counting rules

- **Bee tokens** — every bee type contributes the tokens listed in its stat sheet. If a partial bee is on the same slot and also provides the token, it counts as committed; if only one side provides it, it counts as partial.
- **Guaranteed beequip tokens** (100% base chance) — always counted as committed sources; no icon appears on the canvas.
- **Optional beequip tokens** — counted only when you explicitly select them in the token picker that appears when placing the beequip; selected optional tokens also display as small icons on the beequip slot in the canvas.
- **Beequip transforms** — certain beequips transform a bee's token into a different one (e.g. Reindeer Antlers change Fetch → Reindeer Fetch on the same slot), which is reflected in the count.
- **Duplicate suppression** — if a beequip ability token normalizes to the same name as the bee's own token in the same slot (e.g. Focus from both the bee and its beequip), it is not double-counted.

### Beequip token picker

When you place a beequip that has **optional** ability tokens, a picker dialog appears with cards showing the beequip image and the possible tokens overlaid:

- **Flat options** — for beequips with one set of optional tokens, every possible subset (or, for exclusive tokens, one-of-N) is shown as a card. Click a card to confirm.
- **Multi-group options** (e.g. Bang Snap) — groups are shown as separate labeled rows. Select one option per row, then click **Confirm**.
- Press `Escape` or click **Cancel** to abort the placement.

The selected optional tokens are saved with the hive and included in export, URL sharing, and presets.

### Export image

When you export the hive as an image, a **Token Sources** column is appended to the right of the canvas in the same sort order as the panel. Committed counts are shown in teal; partial counts in orange using `f/t` notation.

---

## Keybinds

### Menu
| Key | Action |
|-----|--------|
| `Enter` / `Space` | Start a new hive with 50 slots |
| `I` | Open import hive dialog |
| `C` | Continue working on saved hive (if one exists) |

### Selection
| Key | Action |
|-----|--------|
| `Click` | Select slot |
| `Shift + Click` | Add slot to selection |
| `Shift + Drag` | Drag-select multiple slots |
| `Ctrl + A` | Select all slots |

### Hive Builder
| Key | Action |
|-----|--------|
| `↑` / `↓` | Adjust level ±1 on selected slots |
| `←` / `→` | Adjust level ±5 on selected slots |
| `Ctrl + Arrow` | Adjust partial level ±1/5 (only if slot has a partial bee) |
| `Ctrl + Bee/Beequip/Mutation` | Set as partial instead of regular |
| `Backspace` | Clear partial data first; then clear bee, beequip & mutation |
| `Ctrl + Backspace` | Clear regular bee & beequip only (keeps partial) |
| `Ctrl + Z` | Undo last change |
| `Ctrl + C` | Copy selected slots |
| `Ctrl + X` | Cut selected slots |
| `Ctrl + V` | Paste into selected slots |
| `Ctrl + I` | Set level on selected slots (dialog) |
| `Ctrl + Q` | Clear hive |
| `Ctrl + Y` | Toggle level number visibility |

---

## Contact

Made by riot at **Abyssal Trench Network**.

[Join the Discord](https://discord.gg/QWeGutM76U) for more BSS tools and data.
