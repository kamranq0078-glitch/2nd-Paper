# "Ready." — For Ainain

A private, tactile, motion-designed website for **Ainain**, from **Kamran**, built for the night before her surgery paper.

---

## Quick Start (How to Preview Locally)

Because the site uses modern ES modules and JSON data, run a lightweight local server:

1. Open your terminal in this directory:
   ```bash
   cd "/Users/mohammadkamran/Documents/2nd Paper"
   ```
2. Start Python's built-in HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser and visit:
   [http://localhost:8000](http://localhost:8000)

> **Previewing the Morning Card Tonight:**
> The Morning Card envelope is sealed until `04:00` on `27 Oct 2026`. If you want to preview the opened card right now without waiting or changing your system clock, open:
> [http://localhost:8000/?morning](http://localhost:8000/?morning)

---

## Experience Flow (Six Scenes)

- **Scene 0: Threshold** — Deep indigo, a resting-heartbeat ring of warm light, and her name (*Ainain*) fading in beneath.
- **Scene 1: The Road Here** — Kashmir snowfield at dusk, mountains faint in the distance, footprints already made behind her, and new footsteps illuminating ahead as she scrolls or drags. Includes a quiet, unlabelled lantern for Dadyy with a soft du'a.
- **Scene 2: Steady Hands** — Tracing a fine golden surgical suture thread. Softly magnetized and smoothed so even shaky fingers produce a graceful line. No failure state, no score. Ends in a golden knot blooming into a star, with the single word *Steady.*
- **Scene 3: Charge** — Press and hold the central ring of light. The ring breathes and fills over ~8 seconds while the sacred ayat form around it. Recedes gently if released early. Blooms into light with a gentle haptic pulse and the single word *Ready.*
- **Scene 4: Proud** — Her unedited photographs hanging like polaroids from a golden wire, swaying gently, lit by small stars. Tap any photo to lift and focus.
- **Scene 5: Tonight** — Four tactile ritual icons (drink water 💧, pack bag 🎒, set clock ⏰, sleep 🌙). Tapping the moon enters Sleep Mode (*Rest.*). A sealed envelope in the corner unlocks at `04:00` on exam morning with du'as and *— Kamran*.

---

## Where the Sacred Text Lives

All sacred Arabic text, translations, and references live exclusively in:
```
content/sacred-text.json
```
Nothing sacred is hardcoded in HTML or JavaScript.

| Item | Arabic | Translation (Sahih International) | Reference |
|---|---|---|---|
| Rely upon Allah | وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ | And whoever relies upon Allah - then He is sufficient for him. | At-Talaq 65:3 |
| Capacity | لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا | Allah does not charge a soul except [with that within] its capacity. | Al-Baqarah 2:286 |
| Expand breast | رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي | My Lord, expand for me my breast and ease for me my task | Ta-Ha 20:25–26 |
| Increase knowledge | وَقُل رَّبِّ زِدْنِي عِلْمًا | And say, 'My Lord, increase me in knowledge.' | Ta-Ha 20:114 |
| Bismillah | بِسْمِ اللَّهِ | *(No translation line)* | |
| Du'a for Dadyy | اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ | O Allah, forgive him and have mercy on him. | Sahih Muslim 963 |

---

## How to Adjust Settings

### 1. Changing the Morning Card Unlock Time
At the very top of `scripts/main.js`:
```javascript
export const MORNING_CARD_OPENS = '2026-10-27T04:00:00';
```
Change `'2026-10-27T04:00:00'` to any time in ISO format (uses the phone's local time). If that time has passed, the envelope opens on tap.

### 2. Toggling the Light for Dadyy
The small lantern in Scene 1 is completely unlabelled and optional. If you prefer to remove it entirely:
In `index.html`, find `#dadyyLantern` (around line 72) and comment it out or delete it.

### 3. Swapping Photographs
The photos live in `assets/photos/`:
1. `WhatsApp_Image_2026-09-15_at_01_16_16.jpeg` (snow, blue jacket, mittens)
2. `WhatsApp_Image_2026-09-15_at_01_16_17.jpeg` (snow, laughing)
3. `WhatsApp_Image_2026-09-08_at_22_51_58__1_.jpeg` (blue kurta, warm smile)
4. `WhatsApp_Image_2026-09-22_at_02_38_24.jpeg` (jumpsuit / face shield / peace sign)

To swap any photo, replace the file in `assets/photos/` keeping the name, or update the `src` attribute in `index.html`.

---

## How to Privately Share with Her Tonight

Since this site is private (`<meta name="robots" content="noindex, nofollow">` is enabled):

1. **Netlify Drop (Easiest & Fastest — 30 seconds):**
   - Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop this entire `2nd Paper` folder onto the webpage.
   - Netlify will give you a random unguessable URL (e.g. `https://peaceful-haven-87391.netlify.app`).
   - Send her that private link.

2. **Vercel CLI / Vercel Web:**
   - Run `npx vercel` or drag into the Vercel dashboard for an immediate private deployment.

3. **GitHub Pages (with private repository):**
   - Push to a private repo and deploy to GitHub Pages or link to Cloudflare Pages.

---

## Craft & Accessibility Guarantees
- **No failure states:** Tracing the thread or holding the ring cannot "fail", "reset", or display errors.
- **Silent by default:** No audio or sound effects. Optional gentle haptics (`navigator.vibrate`) on supported mobile devices.
- **Unaltered photos:** No filters, retouching, or AI modifications.
- **Reduced motion support:** Fully honors `prefers-reduced-motion` with soft static fades.
- **Strict word count:** English text is restricted to: *Ainain*, *Steady.*, *Ready.*, *Rest.*, *— Kamran*, and the verse translations.
