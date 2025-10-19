# Samyak Gyan - Complete Project Brief

**Date:** October 2025  
**Developer:** Solo Founder (Non-technical, Ex UPSC Aspirant, What to build my digital business)  
**Development Partner:** Claude AI  
**Timeline:** 40-45 days to launch  (fewer day the better)
**Status:** 75-80% Complete (Architecture & Frontend Done)( Diagnosed by Claude AI)

---

## 🎯 PROJECT VISION

**Mission:** Eliminate the friction in digital learning by integrating note-taking directly into the content consumption experience for UPSC aspirants.

**Problem Solved:** Students currently read digital content but must manually write notes with pen and paper. This creates friction and reduces learning effectiveness.

**Solution:** Seamless read → highlight → summarize → download workflow, all in one platform.

---

## 💰 BUSINESS MODEL

- **Pricing:** ₹99/month (affordable for Indian students)
- **Trial:** 15 days free
- **Growth:** Referral system (3 referrals = 15 extra days)
- **Market:** 10+ lakh UPSC aspirants annually
- **Target:** 1% market share = 10,000 users = ₹9.9 lakh/month revenue (intial Target: freee the portal is good it could potential get 80-99% market share)
- **CAC:** ₹0 (pure viral referral growth)
- **Privacy-First:** No data selling, Telegram login only

---

## 🏗️ CURRENT PROJECT STATUS

### ✅ COMPLETED (Built in 45 Days)

**Frontend Modules:**
- `homepage.html` - Landing page with calendar, recent uploads
- `index.html` - Article display system with interactive tiles
- `download_button.html` - Daily notes download functionality
- All CSS files (modular, responsive design)
- All JavaScript files (button interactions, state management)

**Backend Architecture:**
- Complete database schema (7+ tables)
- Full API documentation
- Business logic mapped
- Referral system designed
- Payment integration planned

**Key Features Designed:**
- Interactive button system (mark as read → unlocks other features)
- Summary creation (100-word limit)
- Highlight system (20% of article limit)
- Bookmark functionality
- Vote system ("Magazine Worthy")
- Download compiled notes

---

## 🎯 WHAT NEEDS TO BE BUILT

### Phase 1: Core Integration (Week 1-2)
1. **Frontend-Backend Connection**
   - Connect HTML pages to backend APIs
   - User authentication (Telegram OAuth)
   - Article data fetching and display
   - User interaction tracking (read, vote, bookmark)

2. **Database Setup**
   - PostgreSQL database creation
   - Table creation from schema
   - Sample data insertion for testing

3. **Basic API Endpoints**
   - `POST /api/auth/telegram` - User login
   - `GET /api/articles` - Fetch articles
   - `GET /api/articles/:id` - Single article
   - `POST /api/articles/:id/interact` - User actions
   - `POST /api/articles/:id/summary` - Save summary

### Phase 2: Advanced Features (Week 3-4)
1. **Bilingual Support (Bhashini API)**
   - Content translation (English → Hindi)
   - Language preference system
   - User can toggle English/Hindi
   - Highlights/summaries in user's language
   - Downloads in user's language

2. **Telegram Bot Integration**
   - Welcome messages
   - Referral notifications
   - Trial reminders
   - Daily content alerts
   - Payment reminders

3. **Referral System**
   - Unique referral links per user
   - Automatic reward tracking
   - Trial extension automation
   - Notification triggers

4. **Payment Integration (Razorpay)**
   - Subscription management
   - Trial period tracking
   - Auto-renewal
   - Payment notifications

### Phase 3: Analytics & Admin (Week 5)
1. **Custom Analytics Dashboard**
   - Live visitors (24 hours)
   - Total subscribers
   - Revenue tracking
   - Referral performance
   - Privacy-safe tracking (no Google Analytics)

2. **Admin Panel**
   - Content upload (English only)
   - Auto-translation trigger
   - User management
   - Analytics viewing

### Phase 4: Testing & Deployment (Week 6)
1. **Local Testing**
   - All features working on localhost
   - Bug fixes
   - Performance optimization

2. **Deployment**
   - Git repository prepared
   - Documentation for managed hosting
   - Production deployment
   - Domain setup
   - LAUNCH! 🚀

---

## 📁 PROJECT STRUCTURE

```
samyak-gyan/
├── frontend/
│   ├── index.html (main article viewer)
│   ├── homepage.html (landing page)
│   ├── download_button.html (notes download)
│   ├── styles/
│   │   ├── buttons.css
│   │   ├── homepage.css
│   │   ├── download_button.css
│   │   └── (other CSS files)
│   ├── scripts/
│   │   ├── buttons.js (interaction logic)
│   │   ├── homepage.js (calendar, navigation)
│   │   ├── download_button.js
│   │   └── (other JS files)
│   └── assets/ (images, icons)
│
├── backend/
│   ├── server.js (main server file - TO BE BUILT)
│   ├── routes/
│   │   ├── auth.js (authentication)
│   │   ├── articles.js (article endpoints)
│   │   ├── users.js (user management)
│   │   └── analytics.js (tracking)
│   ├── models/
│   │   ├── User.js
│   │   ├── Article.js
│   │   ├── Interaction.js
│   │   └── (other models)
│   ├── services/
│   │   ├── bhashini.js (translation API)
│   │   ├── telegram.js (bot integration)
│   │   ├── razorpay.js (payments)
│   │   └── analytics.js (tracking)
│   └── config/
│       ├── database.js
│       └── environment.js
│
├── database/
│   └── schema.sql (database structure)
│
└── README.md (project documentation)
```

---

## 🗄️ DATABASE SCHEMA

### Tables (Already Designed):

1. **users**
   - User profiles, authentication
   - Language preference (English/Hindi)
   - Trial status, subscription details
   - Referral tracking

2. **articles**
   - Content in English
   - Auto-generated Hindi translation (cached)
   - Metadata (date, tags, section)
   - Word count tracking

3. **public_interactions**
   - User actions: read, vote, bookmark
   - Prevents duplicates
   - Analytics data source

4. **summaries**
   - User-written summaries (100-word limit)
   - Language-specific storage
   - Linked to articles and users

5. **highlights**
   - Selected text by users
   - 20% article limit enforcement
   - Language preserved

6. **referrals**
   - Referrer-referee relationships
   - Reward status tracking
   - Trial extension automation

7. **payments**
   - Subscription transactions
   - Razorpay integration
   - Trial/active status

---

## 🎨 KEY FEATURES EXPLAINED

### 1. Interactive Button System
**Philosophy:** Users must read before interacting

**Flow:**
1. Article loads, all buttons disabled except "Mark as Read"
2. User clicks "Mark as Read" → button turns green
3. Other buttons (vote, bookmark, summary) become enabled
4. User can now interact meaningfully

**Why:** Ensures genuine engagement, not mindless clicking

### 2. Summary Creation (100 Words)
**Why 100 words?**
- Forces concise thinking
- Active learning (not passive copying)
- Builds retention through writing

**Implementation:**
- Real-time word counter
- Prevents exceeding 100 words
- Saves in user's preferred language
- Included in daily download

### 3. Highlight System (20% Limit)
**Purpose:** Selective highlighting, not entire article

**Logic:**
- Calculate article word count
- Allow user to highlight max 20%
- Visual feedback when limit approached
- Premium "Magazine" version has 100% highlighting

**Why:** Encourages critical reading and selection

### 4. Download Feature
**What it does:**
- Compiles user's daily highlights + summaries
- Generates plain text file
- Naming: `SamyakGyan_Notes_YYYY-MM-DD.txt`
- Language: User's preference (English/Hindi)

### 5. Referral System
**Viral Growth Mechanism:**
- Each user gets unique referral link
- Friend signs up → both get rewards
- 3 successful referrals = 15 extra days
- Automated tracking and notification

---

## 🔧 TECHNICAL REQUIREMENTS

### Technology Stack:
**Frontend:** Vanilla HTML/CSS/JavaScript (no frameworks)
**Backend:** Node.js with Express (simple, fast)
**Database:** PostgreSQL (relational, robust)
**APIs:** Bhashini (translation), Telegram Bot API, Razorpay
**Hosting:** Managed hosting service (₹5,000/month)

### External Services:
1. **Bhashini API**
   - Government of India translation service
   - English → Hindi
   - Free/subsidized for education

2. **Telegram Bot API**
   - User authentication
   - Automated messaging
   - Notification system

3. **Razorpay**
   - Payment gateway
   - Subscription management
   - UPI/Cards/Netbanking support

4. **Managed Hosting**
   - Server management
   - Backups and security
   - Monitoring and alerts

---

## 👤 USER JOURNEY

### First-Time User:
1. Lands on homepage
2. Sees "Login with Telegram" button
3. Clicks → Telegram OAuth → Logged in (5 seconds!)
4. Selects language preference (English/Hindi)
5. Sees recent articles
6. Clicks article → Reads content
7. Marks as read → Features unlock
8. Bookmarks article
9. Writes 100-word summary
10. Receives welcome message on Telegram
11. Gets unique referral link
12. 15-day trial starts

### Daily User:
1. Opens website (auto-logged in)
2. Sees new daily article
3. Reads and interacts
4. Writes summary
5. Clicks "Download Notes"
6. Gets compiled highlights + summaries
7. Studies from downloaded notes

### Trial Ending:
1. Day 12: Reminder notification (Telegram)
2. Day 14: Payment page prompted
3. Pays ₹99 via Razorpay
4. Subscription activated
5. Continues learning uninterrupted

### Referral Success:
1. Shares referral link with 3 friends
2. Friends sign up
3. User receives Telegram notification: "You got 15 extra days!"
4. Trial automatically extended
5. Motivated to share more

---

## 🎯 DEVELOPER INSTRUCTIONS (For Claude Code)

### I AM A NON-CODER
**Important:** I need baby-step instructions for EVERYTHING

**Examples of help I need:**
- "Open terminal: Ctrl + ` in VS Code"
- "Type this exact command: `npm install express`"
- "Create new file: Right-click → New File → name it 'server.js'"
- "Copy this code into server.js: [code]"
- "Save file: Ctrl + S"

**Please:**
- Explain every step clearly
- Don't assume I know terminal commands
- Show me exactly where to click/type
- Verify each step before moving forward
- Use simple language, no jargon

### MY STRENGTHS:
- Clear vision of user experience
- Deep understanding of UPSC student needs
- Business logic and strategy
- Content creation
- System architecture thinking

### MY WEAKNESSES:
- Don't know terminal commands
- Never set up a server before
- Unfamiliar with Git commands
- Don't understand deployment
- Need guidance on file organization

---

## 📝 CURRENT FILES AVAILABLE

**Frontend:**
- All HTML files (homepage, article viewer, download button)
- All CSS files (complete styling)
- All JavaScript files (button logic, calendar, interactions)

**Backend:**
- Database schema documented
- API endpoints documented
- Business logic mapped
- Ready to be coded

**What's Missing:**
- Backend code implementation
- Database connection
- API endpoint code
- External service integrations
- Testing scripts

---

## 🚀 SUCCESS CRITERIA

### Technical:
- All features work on local testing
- No bugs in core functionality
- Fast page load times (<2 seconds)
- Mobile-responsive design
- Secure user authentication
- Reliable data persistence

### Business:
- 15-day free trial works automatically
- Referral system tracks correctly
- Payment integration functional
- Telegram notifications sent properly
- Bilingual content displays correctly

### User Experience:
- Intuitive navigation
- Clear button states
- Smooth interactions
- Fast note downloads
- Helpful error messages

---

## 💡 PHILOSOPHY & CONSTRAINTS

### Core Principles:
1. **Privacy First:** No Google Analytics, no Meta Pixel, no data selling
2. **Simplicity:** No complex frameworks, no over-engineering
3. **Accessibility:** Works on any device, any screen size
4. **Speed:** Fast loading, responsive interactions
5. **User-Focused:** Every feature serves learning, not vanity metrics

### Technical Constraints:
- No React/Vue/Angular (vanilla JS only)
- No app required (browser-based only)
- No email/SMS OTP (Telegram login only)
- No external tracking tools
- Clean, readable code (for future maintenance)

### Business Constraints:
- Zero marketing budget (organic growth only)
- Solo operation (one-person content team)
- Sustainable pricing (₹99/month)
- No VC funding (profitable from day 1)

---

## 📞 CONTACT & SUPPORT

**Managed Hosting Partner:** (To be decided)
**Payment Gateway:** Razorpay
**Translation API:** Bhashini (Government of India)
**User Communication:** Telegram Bot

---

## 🎯 NEXT STEPS

1. **Set up local development environment**
   - Install Node.js
   - Install PostgreSQL
   - Initialize Git repository

2. **Build backend server**
   - Create Express server
   - Connect to database
   - Build API endpoints

3. **Integrate frontend with backend**
   - Connect HTML pages to APIs
   - Test user flows
   - Fix bugs

4. **Add external services**
   - Bhashini API integration
   - Telegram bot setup
   - Razorpay payment gateway

5. **Test everything locally**
   - Complete user journey testing
   - Performance optimization
   - Bug fixing

6. **Deploy to production**
   - Share repository with managed hosting
   - Configure production environment
   - Final testing on live domain
   - LAUNCH!

---

## 📌 IMPORTANT NOTES FOR CLAUDE

- **I am NOT a developer** - Please use beginner-friendly language
- **Explain every command** - Don't assume I know anything
- **Show me where things go** - File paths, folder locations, everything
- **Test as we build** - Let's verify each piece works before moving on
- **Be patient** - I might ask "silly" questions, please answer them all

**My Learning Style:**
- Visual learner (show me screenshots/examples)
- Step-by-step instructions work best
- Need to understand "why" behind decisions
- Prefer trying things locally before deploying

**My Time Commitment:**
- Working full-time on this (quit my job)
- Available 10-12 hours/day for development
- Highly motivated and determined
- Fast learner, just need proper guidance

---

## 🎉 LET'S BUILD SOMETHING AMAZING!

This project will help thousands of UPSC aspirants learn more effectively. The vision is clear, the architecture is solid, and now it's time to bring it to life.

**Ready to start whenever you are!** 🚀

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Status:** Ready for Development Phase