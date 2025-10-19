# Samyak Gyan - Project Status

**Last Updated:** January 2025
**Current Focus:** URL Structure Finalized + Ethics & Essay Section Development

---

## 🔗 FINALIZED URL STRUCTURE (v2.0)

### Current Affairs Section:
```
Date Page:          /upsc-current-affairs/2025-01-18  (shows news + editorials mixed)
News Article:       /upsc-current-affairs/2025-01-18/article-slug
Editorial Article:  /upsc-editorials/2025-01-18/article-slug
```

### Ethics & Essays Section:
```
Landing Page:       /upsc-ethics-essays  (latest Sunday's content)
Pagination:         /upsc-ethics-essays/page-1, /page-2, /page-3...
Ethics Article:     /upsc-ethics/article-slug  (NO DATE - timeless!)
Essay Article:      /upsc-essays/article-slug  (NO DATE - timeless!)
```

**Key Design:**
- ✅ Option A behavior: URL updates when tile opens, page URL stays same
- ✅ Cleaner URLs: `/upsc-editorials/` vs `/upsc-current-affairs/editorial/`
- ✅ Smart dates: News/editorials have dates, ethics/essays don't (evergreen)
- ✅ Page numbers for ethics/essays pagination (not dates)

**See:** `docs/URL_STRUCTURE_AND_ACCESS_CONTROL.md` for complete documentation

---

## USER WORKFLOW (100-Line Brief)

### Complete User Journey: (names are different here but logic is correct)

#### Step 1: Login & Dashboard
- User arrives at `landing.html`
- Clicks "Login with Telegram" → OAuth authentication
- First-time users: Fill profile at `profile.html` (name, language)
- Redirected to `homepage.html` (The Dashboard/Journal)
  - Shows recent articles Uploaded
  - Shows calendar with study activity
  - Shows trial days remaining (in Your Journal: Sort of a User Dashboard)

#### Step 2: Reading Regular Articles (`articles.html`)
1. **Click date**: date specific link opens
2. **Click article** → Tile expands, shows content
3. **Highlight text** → TextHighlighter library captures selections
   - Saved to LocalStorage (later: backend)
   - PURPOSE: Included in downloaded notes
4. **5 Buttons appear** below article:

   **READ Button** (Red → Green when clicked)
   - Unlocks VOTE and BOOKMARK buttons
   - Sends to backend → Updates dashboard

   **VOTE Button** (Unlocks after READ)
   - User votes on article quality
   - Helps platform understand valued content

   **BOOKMARK Button** (Unlocks after READ)
   - Save for later review
   - Appears in dashboard "Bookmarked" section

   **SUMMARY Button** (Always available)
   - Opens modal with textarea (150 words, Hindi/English)
   - User writes their own summary
   - **KEY**: Summary included in "Get Your Notes" download

   **SHARE Button** (Always available)
   - Share to Telegram channel/group/p2p (personal chats)

#### Step 3: Ethics & Essay Section (`ethics_essays_poll.html`)
1. **Welcome popup** appears (first visit) → "Start Diving" button
2. **Read essay/poll question** - Ethics scenarios, case studies
3. **Only 2 buttons available**:

   **SUMMARY Button**
   - User writes ethical analysis/answer
   - Same modal as regular articles (150 words)
   - **KEY**: Included in "Get Your Notes" download
   - NO conditionality - always available

   **SHARE Button**
   - Share essay question to study groups
   - Opens Telegram share

4. **Why only 2 buttons?**
   - Ethics is about practice, not consumption
   - Focus on user's written response
   - Writing summary proves engagement

#### Step 4: Download Notes (THE GOAL!)
User clicks **"Get Your Notes"** button:

1. **System collects:**
   - All highlights from articles
   - All summaries (regular articles + Ethics)
   - Article metadata (title, date)

2. **Generates TXT** containing:
   - Get Your NOTES - [Date]
   - Each article with highlights + summary
   - Ethics essays with user's analysis

3. **User downloads** personalized study material
   - Can print, review before exam
   - Dashboard tracks "Notes downloaded on [date]"

### How Everything Connects:
```
LOGIN (Telegram OAuth)
  ↓
DASHBOARD (homepage.html) - User's personal journal
  ↓
READ ARTICLES (articles.html) → Highlight + Summary + Vote + Bookmark
  ↓
READ ETHICS (ethics_essays_poll.html) → Summary only
  ↓
"GET YOUR NOTES" → Combines everything → DOWNLOAD TXT file
  ↓
All activity tracked in DASHBOARD
```

### Key Design Principles:
1. **Active Learning**: Highlighting + Summary writing → Better retention
2. **Progress Tracking**: Dashboard shows study journey/streaks
3. **Two Article Types**:
   - Regular articles: Consume news + form opinions (5 buttons)
   - Ethics essays: Practice writing (2 buttons)
4. **Everything Feeds the Journal**: All actions update dashboard

---

## PROJECT OVERVIEW

**What We're Building:**
A UPSC preparation platform with:
- Article reading system with interactive buttons
- Ethics & Essay practice section
- User authentication via Telegram OAuth
- Highlight and note-taking system
- Downloadable notes with highlights and summaries

**Target Users:** UPSC aspirants preparing for Ethics & Essay papers

**Tech Stack:** Frontend-first (HTML/CSS/JavaScript), Backend planned (PostgreSQL + Node.js)

---

## CURRENT STATUS (January 2025)

### ✅ COMPLETED FEATURES

#### 1. Core Pages
- `landing.html` - Entry point with session detection
- `profile.html` - User profile creation (Telegram OAuth ready)
- `homepage.html` - Dashboard with calendar and recent uploads
- `articles.html` - Regular articles viewer with expandable tiles
- `ethics_essays_poll.html` - Ethics & Essay section with welcome popup

#### 2. Ethics & Essay Section (Latest Work)
- ✅ Welcome popup with "Start Diving" functionality
- ✅ Article structure with **Summary** and **Share** buttons only
- ✅ Summary button opens modal with:
  - Header: "My Summary" (left), Date (center), Word count (right), Close button (bigger × in top-right)
  - Textarea: Unicode support for Hindi/English notes (150 word limit)
  - Save button: Orange chip design at bottom
  - Footer: "Get Your Notes" integration message
- ✅ Share button: Opens Telegram share (working perfectly)
- ✅ Modal positioning: Center-screen overlay (`position: fixed`)
- ✅ LocalStorage: Temporary storage for summaries

**Key Files:**
- `ethics_essays_poll.html` - Main page
- `scripts/ethics_essays_buttons.js` - Summary/Share button logic (standalone, all CSS inline)
- `styles/buttons.css` - COMMENTED OUT in ethics_essays_poll.html (was blocking clicks)

#### 3. Regular Articles Section
- ✅ Full button system: READ, VOTE, BOOKMARK, Summary, Share
- ✅ Conditionality logic: VOTE/BOOKMARK unlock after READ is marked
- ✅ Summary modal with similar design to Ethics section
- ✅ Download button for getting notes with highlights

**Key Files:**
- `articles.html` - Main articles page
- `scripts/buttons.js` - Full button logic
- `styles/buttons.css` - Button styling (active for articles.html)

#### 4. Authentication System
- ✅ Session management (login persistence)
- ✅ Telegram OAuth integration ready
- ✅ Trial tracking system
- ✅ Logout functionality

**Key Files:**
- `scripts/auth.js` - Master authentication system
- `scripts/homepage.js` - Homepage logic

#### 5. UI Components & Libraries
- ✅ TextHighlighter library integration (for highlighting text)
- ✅ Responsive design across all pages
- ✅ Mobile-friendly layouts
- ✅ Calendar component on dashboard
- ✅ Modal systems (Summary, Share)

#### 6. Orientation Detection (New Feature)
- ✅ Detects device orientation (portrait/landscape)
- ✅ Shows notification banner on mobile landscape
- ✅ Encourages portrait mode for better UX
- ✅ Dismissible banner with localStorage persistence

**Key Files:**
- `scripts/orientation-detection.js` - Orientation detection logic
- `ORIENTATION_DETECTION_STANDARD.md` - Implementation guide

---

## SESSION LOG

### Format:
```
## Session [Date] - [Time] - [Account: 1 or 2]
**Quota Used:** [e.g., 90%]
**Duration:** [e.g., 2.5 hours]

**What I Built:**
- [Feature 1]
- [Feature 2]

**Files Modified:**
- [file1.html] - [what changed]
- [file2.js] - [what changed]

**Current State:**
[Brief description of where things stand]

**Next Steps:**
[What needs to be done next]
```

---

### Session 1 - January 19, 2025 - Account 1
**Quota Used:** ~80%
**Duration:** ~3 hours

**What I Built:**
- Fixed Summary button not working (removed `styles/buttons.css` conflict in `ethics_essays_poll.html` line 22)
- Improved Summary modal visual design:
  - Moved date to center of header using CSS grid
  - Made close button (×) bigger (2rem font size)
  - Removed green checkmark from header
  - Added Save button at bottom in orange chip design
  - Added footer with "Get Your Notes" integration message
- Verified Share button working (opens Telegram)
- Tested modal positioning (currently center-screen with `position: fixed`)

**Files Modified:**
- `ethics_essays_poll.html` - Commented out `styles/buttons.css` line 22
- `scripts/ethics_essays_buttons.js` - Complete rewrite with improved modal HTML/CSS

**Current State:**
- Ethics & Essay section Summary/Share buttons working perfectly
- Modal appears center-screen with all visual improvements
- LocalStorage storing summaries temporarily
- Ready for backend integration

**Next Steps:**
- Consider modal positioning adjustments if needed
- Apply similar improvements to `articles.html` if requested
- Backend integration for saving summaries permanently

### 📔 Your Journal (User Dashboard)

The **dashboard** (`user_dashboard_testbed.html`) is your **personal UPSC preparation journal** - a complete story of your learning journey, split into two main sections:

**Left Section: My Stats & Compilations**
- **Reading Insight**: Visual charts showing your daily/weekly reading patterns with article counts
- **Voting Pattern**: Analysis of which articles you found "Magazine Worthy"
- **Notes Dashboard**: All your summaries and highlights in one place
- **Time Spent**: Track how much time you invest in preparation
- **Bookmarked Articles**: Your curated reading list for quick revision

**Right Section: Personal Info & Subscriptions**
- **User Profile**: Your name, language preference (Hindi/English), Telegram ID, join date
- **Trial Status**: "Your Trial Ends: [Date]" with green indicator - clear countdown to subscription decision
- **Extend Trial**: "Help Us Grow!!" button - 3 referrals = 15 extra days (powered by referral popup)
- **Subscription Topics**: Two independent chips (Current Affairs | Ethics & Essay) - Green = Active, Red = Inactive
- **Smart Redirect**: Click inactive subscription → Popup explains benefit → Redirects to payment if needed

**Why It Matters:**
Every action (READ, VOTE, BOOKMARK, Summary) feeds this journal. It's your **motivational companion** tracking consistency, building accountability through visual analytics, and showing your complete UPSC prep timeline. When you look back after months, your journal tells the story of your dedication and growth.
---

## KNOWN ISSUES / TECHNICAL NOTES

### ⚠️ Important Technical Decisions:

1. **Two Separate Button Systems:**
   - `scripts/ethics_essays_buttons.js` - Standalone for Ethics section (Summary + Share only)
   - `scripts/buttons.js` - Full system for regular articles (READ + VOTE + BOOKMARK + Summary + Share)
   - **Why separate?** Different functionality requirements, easier to maintain

2. **CSS Conflict Resolution:**
   - `styles/buttons.css` is **COMMENTED OUT** in `ethics_essays_poll.html` (was blocking clicks)
   - `styles/buttons.css` is **ACTIVE** in `articles.html` (needed for full button system)
   - **Solution:** Ethics buttons have all CSS inline in `ethics_essays_buttons.js`

3. **Modal Positioning:**
   - Ethics section: `position: fixed` (center-screen overlay)
   - Regular articles: `position: relative` (below article in document flow)
   - **Reason:** Different UX requirements for each section

4. **Data Storage Strategy:**
   - **Current:** LocalStorage for summaries and highlights (temporary)
   - **Planned:** Backend API for permanent storage
   - **Migration Path:** LocalStorage → Backend sync → Download feature

### 🔧 Temporary Solutions:
- Using LocalStorage for summaries (will move to backend API when ready)
- Placeholder API endpoints in code (marked with comments)
- Mock data in some components for testing

### 🐛 Known Bugs:
- None currently reported

---

## FILE STRUCTURE

### Current Directory Layout:
```
Frontend/
├── landing.html                    # Entry point with Telegram login
├── profile.html                    # User profile setup
├── homepage.html                   # Dashboard/Journal
├── articles.html                   # Regular articles viewer
├── ethics_essays_poll.html         # Ethics & Essay section
├── notes-dashboard.html            # Notes management
├── user_dashboard.html             # User dashboard (alternative)
├── referral_popup.html             # Referral system UI
│
├── scripts/
│   ├── auth.js                     # Master authentication system
│   ├── homepage.js                 # Homepage/dashboard logic
│   ├── buttons.js                  # Regular articles button system
│   ├── ethics_essays_buttons.js    # Ethics section buttons (standalone)
│   ├── ethics_essays_articles.js   # Ethics articles data/logic
│   ├── download_button.js          # Notes download functionality
│   ├── user_dashboard.js           # User dashboard logic
│   ├── orientation-detection.js    # Mobile orientation detection
│   └── script.js                   # General utilities
│
├── styles/
│   ├── buttons.css                 # Button styling (articles.html only)
│   ├── homepage.css                # Dashboard styling
│   ├── header.css                  # Header component styling
│   ├── download_button.css         # Download button styling
│   ├── user_dashboard.css          # User dashboard styling
│   └── style.css                   # Global styles
│
├── components/                     # Reusable UI components
│
├── assets/                         # Images, icons, fonts
│
├── images/                         # Project images
│   ├── Banner.jpg
│   ├── Banner2.jpg
│   ├── Banner 3.jpg
│   ├── Bhairav.png
│   ├── Bharat.png
│   └── [screenshots]
│
├── docs/                           # Documentation
│
├── .github/                        # GitHub workflows/actions
│
└── Documentation Files:
    ├── PROJECT_STATUS.md           # This file - Project status & workflow
    ├── samyak_gyan_project_brief.md # Complete project vision & requirements
    ├── SETUP_GUIDE.md              # Development setup instructions
    ├── INTEGRATION_COMPLETE_GUIDE.md # Integration documentation
    ├── LIBRARY_TEST_GUIDE.md       # Library testing guide
    ├── TEXTHIGHLIGHTER_TEST_GUIDE.md # TextHighlighter testing
    ├── TESTING_MODE_GUIDE.md       # Testing mode documentation
    ├── ORIENTATION_DETECTION_STANDARD.md # Orientation detection guide
    ├── LICENSE.md                  # Project license
    └── README.md                   # Project README (GitHub)
```

### Key File Relationships:

**Authentication Flow:**
```
landing.html → auth.js → profile.html → homepage.html
```

**Article Reading Flow:**
```
homepage.html → articles.html → buttons.js → download_button.js
```

**Ethics Section Flow:**
```
homepage.html → ethics_essays_poll.html → ethics_essays_buttons.js
```

**Download Feature:**
```
User interactions → LocalStorage → download_button.js → PDF generation
```

---

## TECHNOLOGY STACK

### Frontend:
- **HTML5** - Semantic markup, accessible
- **CSS3** - Responsive design, grid/flexbox layouts
- **Vanilla JavaScript** - No frameworks, ES6+
- **Libraries:**
  - TextHighlighter - Text selection and highlighting
  - (More to be added as needed)

### Backend (Planned):
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Telegram Bot API** - Authentication & notifications
- **Bhashini API** - Hindi translation (Government of India)
- **Razorpay** - Payment processing

### Development Tools:
- **Git** - Version control
- **VS Code** - Code editor
- **Claude Code** - AI development partner

---

## BUSINESS MODEL & FEATURES

### Pricing:
- ₹99/month subscription
- 15-day free trial
- Referral rewards: 3 referrals = 15 extra days

### Key Features (Designed):
- **Interactive Reading**: Mark as read, vote, bookmark
- **Active Learning**: Highlighting (20% limit), Summary writing (150 words)
- **Bilingual Support**: English/Hindi content via Bhashini API
- **Download Notes**: Compiled highlights + summaries in PDF
- **Referral System**: Viral growth mechanism
- **Privacy-First**: Telegram login only, no data selling
- **Analytics**: Custom dashboard (no Google Analytics)

---

## WHAT NEEDS TO BE BUILT

### Phase 1: Core Integration (Week 1-2)
1. **Frontend-Backend Connection**
   - Connect HTML pages to backend APIs
   - User authentication (Telegram OAuth)
   - Article data fetching and display
   - User interaction tracking

2. **Database Setup**
   - PostgreSQL database creation
   - Table creation from schema
   - Sample data insertion

3. **Basic API Endpoints**
   - `POST /api/auth/telegram` - User login
   - `GET /api/articles` - Fetch articles
   - `POST /api/articles/:id/interact` - User actions
   - `POST /api/articles/:id/summary` - Save summary

### Phase 2: Advanced Features (Week 3-4)
1. **Bilingual Support** (Bhashini API integration)
2. **Telegram Bot Integration** (notifications, reminders)
3. **Referral System** (unique links, tracking)
4. **Payment Integration** (Razorpay, subscriptions)

### Phase 3: Analytics & Admin (Week 5)
1. **Custom Analytics Dashboard**
2. **Admin Panel** (content upload, user management)

### Phase 4: Testing & Deployment (Week 6)
1. **Local Testing** (all features, bug fixes)
2. **Production Deployment** (managed hosting, domain setup)
3. **LAUNCH!** 🚀

---

## GIT WORKFLOW

### Before Switching Accounts (at 90-95% quota):
```bash
git add .
git commit -m "Session [X] complete: [brief description of features added]"
git push origin main
```

### When Starting New Session:
1. Check recent commits: `git log --oneline -5`
2. Read this file's Session Log
3. Continue building!

### Current Git Status:
- **Branch:** main
- **Recent Commits:**
  - `f3c737d` Add LICENSE and README files
  - `dd16515` Merge branch 'main'
  - `5a6471e` Update frontend files
  - `1a5c498` Create README.md
  - `6b604d1` Initial project commit

---

## QUICK CONTEXT FOR NEW SESSION

**If you're Claude in a new session, here's what you need to know:**

1. **Project:** UPSC prep platform "Samyak Gyan" - Active learning through highlighting & summarizing
2. **Current Focus:** Ethics & Essay section with Summary/Share functionality
3. **Latest Work:** Summary modal with improved visual design (date centered, bigger close button, chip-style save button)
4. **File Structure:** Check `Frontend/` folder - all code is there
5. **Key Decision:** Two separate button systems (Ethics vs Regular articles)
6. **User Preference:** User describes/narrates, Claude executes technically
7. **User Profile:** Non-technical founder, ex-UPSC aspirant, needs baby-step instructions

**Read the Session Log above to see exact latest changes!**

---

## CRITICAL UNDERSTANDING FOR DEVELOPMENT

### When Building ANY New Feature, Ask:
1. How does this fit into the user workflow?
2. Does this feed data to the Dashboard/Journal?
3. Does this integrate with "Get Your Notes" download?
4. Does this support active learning (highlighting/summarizing)?

**Remember:** The buttons aren't just buttons - they're data collection points that build the user's personalized study journal!

### Design Philosophy:
- **Active Learning Focus:** Highlighting + Summary writing = Better retention
- **Gamification:** READ button → completion, Dashboard shows streaks
- **Everything Feeds the Journal:** All actions update dashboard
- **Two Article Types:** Regular (5 buttons) vs Ethics (2 buttons)

---

## PROJECT DOCUMENTATION

For complete project details, see:
- `samyak_gyan_project_brief.md` - Complete vision, business model, technical requirements
- `SETUP_GUIDE.md` - Development setup instructions
- `INTEGRATION_COMPLETE_GUIDE.md` - Integration documentation
- `ORIENTATION_DETECTION_STANDARD.md` - Mobile orientation detection standard
- `docs/` folder - Additional technical documentation

---

## DEVELOPER NOTES (For Claude Code)

### User Profile:
- **Non-technical founder** - Needs baby-step instructions
- **Ex-UPSC aspirant** - Deep understanding of student needs
- **Visual learner** - Prefers screenshots/examples
- **Full-time on project** - Available 10-12 hours/day

### Communication Style:
- Explain every terminal command
- Show exact file paths and locations
- Use simple language, no jargon
- Verify each step before moving forward
- Be patient with "basic" questions

### User Strengths:
- Clear vision of user experience
- Business logic and strategy
- Content creation
- System architecture thinking

### User Needs Help With:
- Terminal commands
- Server setup
- Git commands
- Deployment
- File organization

---

**Last Human Message Before This Update:**
[Leave blank - update when switching accounts]

**Account Switching Count:** 0
**Total Sessions:** 1

---

**Version:** 2.0
**Last Updated:** January 19, 2025
**Status:** Active Development - Ethics & Essay Section Complete
