# Portrait Mode Detection - Project Standard

## 📱 **STANDING ORDER: Implement on ALL Pages**

**Purpose**: Guide mobile users to landscape mode for optimal reading experience

---

## ✅ **Pages That MUST Have Orientation Detection**

- ✅ Homepage (homepage.html)
- ✅ Articles page (articles.html)
- ✅ User Dashboard (user_dashboard.html, user_dashboard_master.html)
- ✅ **ALL future content/reading pages**

## ❌ **Pages That Should NOT Have Orientation Detection**

- ❌ Landing page (landing.html) - First impression, keep flexible
- ❌ Profile creation (profile.html) - Simple form, portrait is fine

---

## 📋 **Implementation Checklist**

For every new page (except landing.html and profile.html):

### 1. Load Header Component
```html
<!-- Unified Header Component (Banner + Navigation + Rotate Message) -->
<div id="header-placeholder"></div>

<!-- Load Header Component -->
<script>
  fetch('components/header.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('header-placeholder').innerHTML = html;

      // Trigger orientation check after header is loaded
      if (typeof checkOrientation === 'function') {
        checkOrientation();
      }

      // Setup "Got it" handler after header is loaded
      if (typeof setupGotItHandler === 'function') {
        setupGotItHandler();
      }
    });
</script>
```

### 2. Load Orientation Detection Script
```html
<!-- Orientation Detection Script (BEFORE header fetch) -->
<script src="scripts/orientation-detection.js"></script>
```

**IMPORTANT**: Load orientation-detection.js BEFORE the header fetch so functions are available when header loads.

---

## 🎯 **User Experience Flow**

### Cycle 1: First Portrait
1. 📱 User holds phone in portrait → **Full intrusive dialog appears** with "Got it" button
2. 🔘 User clicks "Got it" → Dialog closes
3. 📱 User still in portrait → **Faint reminder appears** (non-intrusive, bottom of screen)

### Cycle 2: Rotate to Landscape
4. 🔄 User rotates to landscape → Both dialogs disappear, flag resets

### Cycle 3: Back to Portrait
5. 📱 User rotates back to portrait → **Full intrusive dialog appears AGAIN** (fresh start!)
6. 🔘 User clicks "Got it" → Dialog closes
7. 📱 Still portrait → Faint reminder shows

**...Cycle repeats infinitely!**

---

## 💡 **Why This Strategy?**

### Product Rationale
- **UPSC Prep** = Serious study = Needs screen space
- Articles, notes, highlighting, voting = Better in **landscape/tablet/laptop**
- Mobile is **discovery channel**, not primary usage
- Users will naturally migrate to larger screens for actual study

### Technical Rationale
- Pragmatic approach vs impossible GAFA-level mobile optimization
- Focuses development on **features that matter** (content, notes, voting)
- Transparent about best experience vs broken portrait UI

---

## 🔧 **Technical Details**

### Files Involved
- `components/header.html` - Contains rotate message HTML (with "Got it" button) and faint reminder
- `scripts/orientation-detection.js` - Detection logic and reset on landscape

### How It Works
- Uses JavaScript variable `portraitAcknowledged = false` (NOT localStorage/sessionStorage)
- Resets to `false` when landscape detected
- Every portrait entry = fresh intrusive dialog
- "Got it" click = show faint reminder (within same portrait session only)

### Dialog Elements (in header.html)
1. **Full Dialog**: `#rotate-message` - Intrusive, centered, with "Got it" button
2. **Faint Reminder**: `#rotate-reminder` - Non-intrusive, bottom of screen, no button

---

## 🚀 **For Future Developers**

**When creating a new page:**

1. Check: Is it landing.html or profile.html? → **Skip orientation detection**
2. Otherwise → **Implement orientation detection** (copy pattern from articles.html)
3. Ensure header component loads first
4. Load orientation-detection.js script
5. Test on mobile portrait/landscape rotation

**This is NOT optional - it's a core UX standard for the platform.**

---

## 📝 **Quick Reference**

### Script Loading Order
```
1. Auth.js (if needed)
2. orientation-detection.js ← BEFORE header
3. Header fetch (components/header.html)
4. Other scripts
```

### CSS Classes (auto-handled by header.html)
- Full dialog: Centered, blue background, "Got it" button
- Faint reminder: Bottom positioned, semi-transparent, no button

### Console Logs (for debugging)
- 📱 Orientation Check: { isPortrait, isMobile, portraitAcknowledged }
- ✅ Got it button found, attaching handler
- 🔘 Got it clicked!
- 💡 Showing faint reminder
- 🌄 Landscape - hiding all and resetting

---

**Last Updated**: Session implementing orientation detection across all pages
**Status**: ✅ Active Standard - Enforce on all new pages
