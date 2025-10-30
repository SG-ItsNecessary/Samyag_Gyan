# Samyak Gyan - Complete Backend Architecture & API Documentation

**Project:** Samyak Gyan - Digital Learning Platform for UPSC Aspirants
**Developer:** Deepanshu Anand
**Development Partner:** AI
**Date:** October 2025
**Status:** Frontend Complete, Backend Ready for Development

**© All Rights Reserved - Deepanshu Anand**
Unauthorized use, reproduction, or distribution is strictly prohibited.

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [🔗 CONNECTION CONTEXT - How Everything Links Together](#connection-context)
3. [Database Schema](#database-schema)
4. [API Endpoints Specification](#api-endpoints-specification)
5. [Business Logic](#business-logic)
6. [External Integrations](#external-integrations)
7. [Security & Compliance](#security-compliance)
8. [Deployment Requirements](#deployment-requirements)
9. [🗳️ Voting System & Magazine Curation](#️-voting-system--magazine-curation) **(NEW)**
10. [📚 Bookmarks System](#-bookmarks-system) **(NEW)**
11. [📊 Reading Insights Analytics](#-reading-insights-analytics) **(NEW)**
12. [⏱️ Time Spent Analytics](#️-time-spent-analytics) **(NEW)**
13. [🗳️ Tracking Preference Poll](#️-tracking-preference-poll) **(NEW)**
14. [🔍 SEO Optimization & Server-Side Rendering](#-seo-optimization--server-side-rendering) **(NEW - CRITICAL)**
15. [Testing Checklist](#-testing-checklist)

---

## 🎯 PROJECT OVERVIEW

### Mission
Eliminate friction in digital learning by integrating note-taking directly into the content consumption experience for UPSC aspirants.

### Core Features
- **Read**: Web-based article reading
- **Highlight**: Book-like highlighting.
- **Summarize**: 100-word summary creation
- **Download**: Daily compiled notes in `.txt` format

### Business Model
- **Pricing**: ₹99/month
- **Trial**: 15 days free
- **Referral Bonus**: 3 referrals = 15 extra trial days
- **Privacy-First**: No GAFA tracking, Telegram-only authentication

### Technology Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Node.js + Express (recommended)
- **Database**: PostgreSQL
- **Auth**: Telegram OAuth
- **APIs**: Bhashini (translation), Razorpay (payments), Telegram Bot

---

## 🔗 CONNECTION CONTEXT - How Everything Links Together

### 📊 Complete Data Flow Map

This section shows **exactly** how frontend buttons connect to backend APIs and database tables. Use this as your implementation reference.

---

### 🎯 USER INTERACTION FLOW

#### **Flow 1: Mark as Read Button**

```
┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND (articles.html + buttons.js)                              │
├─────────────────────────────────────────────────────────────────────┤
│ User clicks "Mark as Read" button                                  │
│ ↓                                                                   │
│ buttons.js line 145: logInteraction(articleId, userId, 'read')     │
│ ↓                                                                   │
│ Sends HTTP POST request                                            │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ BACKEND API ENDPOINT                                                │
├─────────────────────────────────────────────────────────────────────┤
│ POST /api/articles/interact                                         │
│                                                                     │
│ Request Body:                                                       │
│ {                                                                   │
│   "userId": "123456789",                                            │
│   "articleId": 42,                                                  │
│   "actionType": "read"                                              │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ DATABASE (PostgreSQL)                                               │
├─────────────────────────────────────────────────────────────────────┤
│ Table: public_interactions                                          │
│                                                                     │
│ INSERT INTO public_interactions (user_id, article_id, action_type) │
│ VALUES ('123456789', 42, 'read')                                    │
│                                                                     │
│ Result:                                                             │
│ | id | user_id   | article_id | action_type | created_at        |  │
│ |  1 | 123456789 |         42 | read        | 2025-10-10 10:30  |  │
└─────────────────────────────────────────────────────────────────────┘
```

---

#### **Flow 2: Vote Button (Magazine Worthy)**

```
FRONTEND → buttons.js line 170: logInteraction(articleId, userId, 'magazine_worthy')
    ↓
BACKEND → POST /api/articles/interact
    Body: { userId, articleId, actionType: "magazine_worthy" }
    ↓
DATABASE → public_interactions table
    action_type = 'magazine_worthy'
```

**Purpose**: Track which articles users want in the monthly magazine PDF.

---

#### **Flow 3: Bookmark Button**

```
FRONTEND → buttons.js line 221: logInteraction(articleId, userId, 'bookmark')
    ↓
BACKEND → POST /api/articles/interact
    Body: { userId, articleId, actionType: "bookmark" }
    ↓
DATABASE → public_interactions table
    action_type = 'bookmark'
```

**Purpose**: Save article for later reading (displayed in user's bookmark list).

---

#### **Flow 4: Summary Button (Open Modal)**

```
FRONTEND → buttons.js line 242: logInteraction(articleId, userId, 'summary')
    ↓
BACKEND → POST /api/articles/interact
    Body: { userId, articleId, actionType: "summary" }
    ↓
DATABASE → public_interactions table
    action_type = 'summary'
```

**Note**: This tracks that user OPENED the summary modal. Actual summary text is saved separately (see Flow 5).

---

#### **Flow 5: Summary Save Button (Save Text)**

```
┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND (buttons.js lines 345-365)                                │
├─────────────────────────────────────────────────────────────────────┤
│ User types summary (100 word limit) and clicks Save                │
│ ↓                                                                   │
│ POST /api/articles/summary                                          │
│                                                                     │
│ Request Body:                                                       │
│ {                                                                   │
│   "userId": "123456789",                                            │
│   "articleId": 42,                                                  │
│   "summaryText": "DPI like Aadhaar and UPI enable..."              │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ DATABASE (PostgreSQL)                                               │
├─────────────────────────────────────────────────────────────────────┤
│ Table: summaries                                                    │
│                                                                     │
│ INSERT INTO summaries (user_id, article_id, summary_text)           │
│ VALUES ('123456789', 42, 'DPI like Aadhaar and UPI enable...')      │
│ ON CONFLICT (user_id, article_id) DO UPDATE                         │
│ SET summary_text = EXCLUDED.summary_text                            │
│                                                                     │
│ Result:                                                             │
│ | id | user_id   | article_id | summary_text          | created_at│ │
│ |  1 | 123456789 |         42 | DPI like Aadhaar...   | 2025-10-10│ │
└─────────────────────────────────────────────────────────────────────┘
```

**Important**: This goes to a DIFFERENT table (`summaries`) than button interactions (`public_interactions`).

---

#### **Flow 6: Share Button**

```
FRONTEND → buttons.js line 236-240
    ↓
    Opens Telegram share dialog (client-side only)
    ↓
    NO DATABASE CALL
```

**Note**: Share button does NOT save to database per schema design. It only opens Telegram's native share UI.

---

### 🖍️ HIGHLIGHT SYSTEM FLOW

#### **Flow 7: User Highlights Text**

```
┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND (script.js - TextHighlighter library)                     │
├─────────────────────────────────────────────────────────────────────┤
│ User selects text in answer paragraph                              │
│ ↓                                                                   │
│ Color palette appears                                               │
│ ↓                                                                   │
│ User clicks color (yellow/green/blue/pink)                         │
│ ↓                                                                   │
│ POST /api/highlights                                                │
│                                                                     │
│ Request Body:                                                       │
│ {                                                                   │
│   "user_id": "123456789",                                           │
│   "article_id": 42,                                                 │
│   "language": "en",                                                 │
│   "question_type": "mains",                                         │
│   "question_id": 101,                                               │
│   "answer_id": 201,                                                 │
│   "highlighted_text": "DPI refers to foundational systems..."      │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ BACKEND API - 20% LIMIT ENFORCEMENT                                 │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Get article.total_word_count = 1250                             │
│ 2. Count words in new highlight = 12                               │
│ 3. Query existing highlights for user+article = 200 words          │
│ 4. Calculate: (200 + 12) / 1250 = 16.96%                          │
│ 5. Check: 16.96% < 20% ✅ ALLOWED                                  │
│ 6. Insert into highlights table                                    │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ DATABASE (PostgreSQL)                                               │
├─────────────────────────────────────────────────────────────────────┤
│ Table: highlights                                                   │
│                                                                     │
│ | highlight_id | user_id   | article_id | question_type |          │
│ |            1 | 123456789 |         42 | mains         |          │
│                                                                     │
│ | question_id | answer_id | highlighted_text            |          │
│ |         101 |       201 | DPI refers to foundational...|         │
└─────────────────────────────────────────────────────────────────────┘
```

**Key Logic**: Backend MUST enforce 20% limit by comparing total highlighted words to `article.total_word_count`.

---

### 📥 DOWNLOAD NOTES FLOW

#### **Flow 8: Daily Notes Generation**

```
┌─────────────────────────────────────────────────────────────────────┐
│ FRONTEND (articles.html - Download button)                         │
├─────────────────────────────────────────────────────────────────────┤
│ User clicks "Download Today's Notes"                               │
│ ↓                                                                   │
│ GET /api/users/123456789/notes/2025-10-10                          │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ BACKEND API - Multi-Table Query                                    │
├─────────────────────────────────────────────────────────────────────┤
│ Step 1: Find all articles user interacted with on this date        │
│   - Query public_interactions WHERE DATE(created_at) = '2025-10-10'│
│   - Query highlights WHERE DATE(created_at) = '2025-10-10'         │
│   - Query summaries WHERE DATE(created_at) = '2025-10-10'          │
│   - Get UNIQUE article_ids = [42, 43]                              │
│                                                                     │
│ Step 2: For EACH article, fetch:                                   │
│   - Article details (title, date, tags, source)                    │
│   - All questions (main_questions + prelims_questions)             │
│   - User's highlights for each question                            │
│   - User's summary text                                            │
│   - Interaction status (read/bookmarked/summary)                   │
│                                                                     │
│ Step 3: Format as plain text using template (see below)            │
│                                                                     │
│ Step 4: Return as downloadable .txt file                           │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│ DATABASE QUERIES (PostgreSQL)                                       │
├─────────────────────────────────────────────────────────────────────┤
│ Query 1: Get article IDs                                           │
│ SELECT DISTINCT article_id FROM public_interactions                │
│ WHERE user_id = '123456789' AND DATE(created_at) = '2025-10-10'    │
│ UNION                                                               │
│ SELECT DISTINCT article_id FROM highlights                         │
│ WHERE user_id = '123456789' AND DATE(created_at) = '2025-10-10'    │
│ UNION                                                               │
│ SELECT DISTINCT article_id FROM summaries                          │
│ WHERE user_id = '123456789' AND DATE(created_at) = '2025-10-10'    │
│                                                                     │
│ Query 2: Get article details                                       │
│ SELECT * FROM articles WHERE article_id IN (42, 43)                │
│                                                                     │
│ Query 3: Get questions with highlights                             │
│ SELECT mq.question_text, h.highlighted_text                        │
│ FROM main_questions mq                                              │
│ LEFT JOIN highlights h ON h.question_id = mq.main_question_id      │
│ WHERE mq.article_id = 42 AND h.user_id = '123456789'               │
│                                                                     │
│ Query 4: Get user summary                                          │
│ SELECT summary_text FROM summaries                                 │
│ WHERE user_id = '123456789' AND article_id = 42                    │
│                                                                     │
│ Query 5: Check interaction status                                  │
│ SELECT action_type FROM public_interactions                        │
│ WHERE user_id = '123456789' AND article_id = 42                    │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
                    Plain text file returned
```

---

### 📋 TABLE RELATIONSHIP DIAGRAM

```
┌─────────────────┐
│     users       │ ← User signs up via Telegram
└────────┬────────┘
         │ user_id
         │
         ├────────────────────────────────────────────┐
         │                                            │
         ↓                                            ↓
┌──────────────────────┐                  ┌──────────────────────┐
│ public_interactions  │ ← Button clicks  │     summaries        │ ← Summary text
├──────────────────────┤                  ├──────────────────────┤
│ user_id              │                  │ user_id              │
│ article_id ───┐      │                  │ article_id ───┐      │
│ action_type   │      │                  │ summary_text  │      │
└───────────────┼──────┘                  └───────────────┼──────┘
                │                                         │
                │         ┌───────────────────────────────┘
                │         │
                ↓         ↓
         ┌──────────────────────┐
         │      articles        │ ← Content storage
         ├──────────────────────┤
         │ article_id (PK)      │
         │ title                │
         │ publish_date         │
         │ total_word_count     │
         └──────┬───────────────┘
                │
                ├─────────────────────────┐
                ↓                         ↓
    ┌────────────────────────┐  ┌────────────────────────┐
    │   main_questions       │  │  prelims_questions     │
    ├────────────────────────┤  ├────────────────────────┤
    │ main_question_id (PK)  │  │ prelims_question_id(PK)│
    │ article_id (FK)        │  │ article_id (FK)        │
    │ question_text          │  │ question_text          │
    └───────┬────────────────┘  └───────┬────────────────┘
            │                           │
            │ 1:N                       │ 1:N
            ↓                           ↓
    ┌────────────────────────┐  ┌────────────────────────┐
    │   main_answers         │  │  prelims_answers       │
    ├────────────────────────┤  ├────────────────────────┤
    │ main_answer_id (PK)    │  │ prelims_answer_id (PK) │
    │ main_question_id (FK)  │  │ prelims_question_id(FK)│
    │ answer_text            │  │ answer_text            │
    └───────┬────────────────┘  └───────┬────────────────┘
            │                           │
            └───────────┬───────────────┘
                        │
                        ↓
                ┌──────────────────────────────────────────┐
                │         highlights                       │ ← User text selections
                ├──────────────────────────────────────────┤
                │ highlight_id (PK)                        │
                │ user_id                                  │
                │ article_id (FK → articles)               │
                │ question_type ('mains' or 'prelims')     │
                │ question_id (POLYMORPHIC FK)             │
                │   ├─ IF mains → main_question_id         │
                │   └─ IF prelims → prelims_question_id    │
                │ answer_id (POLYMORPHIC FK)               │
                │   ├─ IF mains → main_answer_id           │
                │   └─ IF prelims → prelims_answer_id      │
                │ highlighted_text                         │
                │ created_at                               │
                └──────────────────────────────────────────┘
```

**🔑 Key Points About Relationships:**

1. **Articles → Questions (1:N)**
   - One article has MANY questions
   - Questions are split into TWO tables: `main_questions` and `prelims_questions`
   - Both link back to `articles` via `article_id` foreign key

2. **Questions → Answers (1:N)**
   - One question has MANY answers (paragraphs)
   - `main_questions` → `main_answers` (via `main_question_id`)
   - `prelims_questions` → `prelims_answers` (via `prelims_question_id`)

3. **Highlights → Questions/Answers (Polymorphic)**
   - `highlights` table uses **polymorphic foreign keys**
   - `question_type` field determines which table to join:
     - If `'mains'`: join `main_questions` and `main_answers`
     - If `'prelims'`: join `prelims_questions` and `prelims_answers`
   - `question_id` can point to EITHER `main_question_id` OR `prelims_question_id`
   - `answer_id` can point to EITHER `main_answer_id` OR `prelims_answer_id`

**💡 Why This Design?**
- Separates Mains vs Prelims content (different exam types)
- Allows user to highlight text from ANY answer paragraph
- Tracks WHICH question and WHICH answer the highlight came from
- Backend can retrieve question context when generating daily notes

---

### 📝 CONCRETE EXAMPLE: How Data Flows from Article to Highlight

**Scenario**: User reads article about "Digital Public Infrastructure" and highlights text.

#### **Step 1: Article Created**
```sql
INSERT INTO articles VALUES (
    42,                                    -- article_id
    'en',                                  -- language
    'Digital Public Infrastructure',       -- title
    '2025-10-10/digital-public-infrastructure', -- slug
    '2025-10-10',                         -- publish_date
    '#Governance #DigitalIndia',          -- hashtags
    'Why should I read it?',              -- prelude_title
    'It ties digital India with...',      -- prelude_body
    'The Hindu',                          -- source_ribbon
    'Essay + GS2',                        -- secondary_ribbon
    1250                                  -- total_word_count (for 20% limit)
);
```

#### **Step 2: Questions Added**
```sql
-- Mains Question 1
INSERT INTO main_questions VALUES (
    101,                                   -- main_question_id
    42,                                    -- article_id (links to article above)
    'en',                                  -- language
    'What is Digital Public Infrastructure (DPI)?'  -- question_text
);

-- Mains Question 2
INSERT INTO main_questions VALUES (
    102,                                   -- main_question_id
    42,                                    -- article_id
    'en',                                  -- language
    'How does DPI impact governance?'     -- question_text
);

-- Prelims Question 1
INSERT INTO prelims_questions VALUES (
    301,                                   -- prelims_question_id
    42,                                    -- article_id
    'en',                                  -- language
    'What is DPI?'                        -- question_text
);
```

#### **Step 3: Answers Added**
```sql
-- Answer to Main Question 101
INSERT INTO main_answers VALUES (
    201,                                   -- main_answer_id
    101,                                   -- main_question_id (links to Q101)
    'en',                                  -- language
    'DPI refers to foundational digital systems like Aadhaar, UPI, and DigiLocker that enable digital governance.'
);

-- Answer to Main Question 102
INSERT INTO main_answers VALUES (
    202,                                   -- main_answer_id
    102,                                   -- main_question_id (links to Q102)
    'en',                                  -- language
    'DPI enables direct benefit transfers reaching 50 crore citizens, reducing intermediary leakages by 90%.'
);

-- Answer to Prelims Question 301
INSERT INTO prelims_answers VALUES (
    401,                                   -- prelims_answer_id
    301,                                   -- prelims_question_id (links to Q301)
    'en',                                  -- language
    'DPI is the foundational digital infrastructure stack of India including Aadhaar, UPI, DigiLocker.'
);
```

#### **Step 4: User Highlights Text**

**User action**: User selects text "foundational digital systems like Aadhaar, UPI" from Answer 201

**Frontend sends**:
```javascript
POST /api/highlights
{
    "user_id": "123456789",
    "article_id": 42,
    "language": "en",
    "question_type": "mains",          // ← Tells backend this is from main_questions
    "question_id": 101,                // ← Points to main_question_id = 101
    "answer_id": 201,                  // ← Points to main_answer_id = 201
    "highlighted_text": "foundational digital systems like Aadhaar, UPI"
}
```

**Backend stores**:
```sql
INSERT INTO highlights VALUES (
    5678,                              -- highlight_id
    '123456789',                       -- user_id
    42,                                -- article_id
    'mains',                           -- question_type
    101,                               -- question_id (refers to main_question_id 101)
    201,                               -- answer_id (refers to main_answer_id 201)
    'foundational digital systems like Aadhaar, UPI',  -- highlighted_text
    '2025-10-10 10:30:00'             -- created_at
);
```

#### **Step 5: Retrieving Highlights with Question Context**

**Backend Query for Daily Notes**:
```sql
-- Get all highlights with question context for this article
SELECT
    h.highlighted_text,
    mq.question_text,
    ma.answer_text
FROM highlights h
LEFT JOIN main_questions mq ON (h.question_id = mq.main_question_id AND h.question_type = 'mains')
LEFT JOIN main_answers ma ON (h.answer_id = ma.main_answer_id AND h.question_type = 'mains')
WHERE h.user_id = '123456789'
  AND h.article_id = 42
  AND h.question_type = 'mains'

UNION

SELECT
    h.highlighted_text,
    pq.question_text,
    pa.answer_text
FROM highlights h
LEFT JOIN prelims_questions pq ON (h.question_id = pq.prelims_question_id AND h.question_type = 'prelims')
LEFT JOIN prelims_answers pa ON (h.answer_id = pa.prelims_answer_id AND h.question_type = 'prelims')
WHERE h.user_id = '123456789'
  AND h.article_id = 42
  AND h.question_type = 'prelims';
```

**Result**:
```
| highlighted_text                              | question_text                           | answer_text                |
|-----------------------------------------------|----------------------------------------|---------------------------|
| foundational digital systems like Aadhaar, UPI| What is Digital Public Infrastructure? | DPI refers to foundational... |
```

**Formatted in Daily Notes**:
```
Q1: What is Digital Public Infrastructure?
Highlights:
1. foundational digital systems like Aadhaar, UPI
```

---

### 🔑 KEY MAPPING TABLE

| Frontend Button | Function Call | API Endpoint | Database Table | Field Name |
|----------------|---------------|--------------|----------------|------------|
| **Mark as Read** | `logInteraction(id, uid, 'read')` | `POST /api/articles/interact` | `public_interactions` | `action_type = 'read'` |
| **Vote** | `logInteraction(id, uid, 'magazine_worthy')` | `POST /api/articles/interact` | `public_interactions` | `action_type = 'magazine_worthy'` |
| **Bookmark** | `logInteraction(id, uid, 'bookmark')` | `POST /api/articles/interact` | `public_interactions` | `action_type = 'bookmark'` |
| **Summary (open)** | `logInteraction(id, uid, 'summary')` | `POST /api/articles/interact` | `public_interactions` | `action_type = 'summary'` |
| **Summary (save)** | `fetch('/api/articles/summary', ...)` | `POST /api/articles/summary` | `summaries` | `summary_text` field |
| **Highlight text** | `saveHighlight(...)` | `POST /api/highlights` | `highlights` | `highlighted_text` field |
| **Download Notes** | `window.location.href = '/api/users/.../notes/...'` | `GET /api/users/:userId/notes/:date` | Multiple tables | Joins all user data |

---

### 💡 IMPLEMENTATION NOTES

**For Backend Developer:**
1. The frontend code has `fetch()` calls commented out in `buttons.js`
2. Uncomment lines 24-45 (logInteraction function) when API is ready
3. Uncomment lines 349-365 (summary save) when API is ready
4. All action types match your database CHECK constraint exactly
5. No need to change frontend code - just build matching API endpoints

**For Database Admin:**
1. The `public_interactions` table uses UNIQUE constraint on (user_id, article_id, action_type)
2. If user clicks same button twice, handle with INSERT ... ON CONFLICT
3. The 20% highlight limit MUST be enforced in backend, not frontend
4. Daily notes generation requires JOINs across 5+ tables

---

## 🗄️ DATABASE SCHEMA

### Database Type: PostgreSQL

**Note**: Original schema used SQLite syntax (`AUTOINCREMENT`). For PostgreSQL, use `SERIAL` instead.

---

### Table 1: `users`

**Purpose**: Store user accounts, trial status, subscription details, and referral codes.

```sql
CREATE TABLE IF NOT EXISTS users (
    user_serial_number SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    date_of_joining TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    language TEXT NOT NULL DEFAULT 'English',
    name TEXT,
    referral_code TEXT UNIQUE NOT NULL,
    referral_code_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referred_by TEXT,
    trial_start TIMESTAMP NOT NULL,
    trial_end TIMESTAMP NOT NULL,
    subscription_status TEXT CHECK(subscription_status IN ('active','inactive','cancelled')) DEFAULT 'inactive',
    subscription_start TIMESTAMP,
    subscription_end TIMESTAMP,
    razorpay_subscription_id TEXT,
    last_payment_status TEXT,
    last_payment_date TIMESTAMP
);
```

**Key Fields**:
- `user_id`: Telegram user ID (unique identifier)
- `referral_code`: 8-character unique code (auto-generated)
- `referred_by`: Referral code of person who invited this user
- `trial_start` / `trial_end`: 15-day free trial period
- `subscription_status`: 'active', 'inactive', or 'cancelled'

**Indexes**:
```sql
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_user_id ON users(user_id);
```

---

### Table 2: `referrals`

**Purpose**: Track referral relationships and reward status.

```sql
CREATE TABLE IF NOT EXISTS referrals (
    referral_id SERIAL PRIMARY KEY,
    referrer_user_id TEXT NOT NULL,
    referee_user_id TEXT NOT NULL,
    referral_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reward_granted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (referrer_user_id) REFERENCES users(user_id),
    FOREIGN KEY (referee_user_id) REFERENCES users(user_id),
    UNIQUE(referrer_user_id, referee_user_id)
);
```

**Key Fields**:
- `referrer_user_id`: Person who shared the referral link
- `referee_user_id`: Person who signed up using the link
- `reward_granted`: TRUE after 3rd successful referral (triggers 15-day extension)

**Indexes**:
```sql
CREATE INDEX idx_referrals_referrer ON referrals(referrer_user_id);
```

---

### Table 3: `articles`

**Purpose**: Store article content with bilingual support (English/Hindi).

```sql
CREATE TABLE IF NOT EXISTS articles (
    article_id SERIAL PRIMARY KEY,
    language TEXT CHECK(language IN ('en','hi')) NOT NULL DEFAULT 'en',
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    publish_date DATE NOT NULL,
    hashtags TEXT,
    prelude_title TEXT,
    prelude_body TEXT,
    source_ribbon TEXT,
    secondary_ribbon TEXT,
    total_word_count INTEGER,
    is_votable BOOLEAN DEFAULT TRUE,
    total_votes INTEGER DEFAULT 0
);
```

**Key Fields**:
- `article_id`: Auto-generated unique ID
- `language`: 'en' (English) or 'hi' (Hindi)
- `slug`: URL-friendly identifier (format: `YYYY-MM-DD/article-title`)
- `total_word_count`: Sum of all answer word counts (for 20% highlight limit)
- `is_votable`: Admin can disable voting (FALSE for important editorials)
- `total_votes`: Cached count of votes (updated via trigger or cron job)

**Indexes**:
```sql
CREATE INDEX idx_articles_publish_date ON articles(publish_date DESC);
CREATE INDEX idx_articles_language ON articles(language);
CREATE INDEX idx_articles_slug ON articles(slug);
```

---

### Table 4: `main_questions`

**Purpose**: Store "Mains" exam questions linked to articles.

```sql
CREATE TABLE IF NOT EXISTS main_questions (
    main_question_id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL,
    language TEXT CHECK(language IN ('en','hi')) NOT NULL DEFAULT 'en',
    question_text TEXT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
);
```

---

### Table 5: `main_answers`

**Purpose**: Store answers to "Mains" questions.

```sql
CREATE TABLE IF NOT EXISTS main_answers (
    main_answer_id SERIAL PRIMARY KEY,
    main_question_id INTEGER NOT NULL,
    language TEXT CHECK(language IN ('en','hi')) NOT NULL DEFAULT 'en',
    answer_text TEXT NOT NULL,
    FOREIGN KEY (main_question_id) REFERENCES main_questions(main_question_id) ON DELETE CASCADE
);
```

---

### Table 6: `prelims_questions`

**Purpose**: Store "Prelims" exam questions linked to articles.

```sql
CREATE TABLE IF NOT EXISTS prelims_questions (
    prelims_question_id SERIAL PRIMARY KEY,
    article_id INTEGER NOT NULL,
    language TEXT CHECK(language IN ('en','hi')) NOT NULL DEFAULT 'en',
    question_text TEXT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
);
```

---

### Table 7: `prelims_answers`

**Purpose**: Store answers to "Prelims" questions.

```sql
CREATE TABLE IF NOT EXISTS prelims_answers (
    prelims_answer_id SERIAL PRIMARY KEY,
    prelims_question_id INTEGER NOT NULL,
    language TEXT CHECK(language IN ('en','hi')) NOT NULL DEFAULT 'en',
    answer_text TEXT NOT NULL,
    FOREIGN KEY (prelims_question_id) REFERENCES prelims_questions(prelims_question_id) ON DELETE CASCADE
);
```

---

### Table 8: `highlights`

**Purpose**: Store user-highlighted text with 20% article limit enforcement.

```sql
CREATE TABLE IF NOT EXISTS highlights (
    highlight_id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    article_id INTEGER NOT NULL,
    question_type TEXT CHECK(question_type IN ('mains','prelims')) NOT NULL,
    question_id INTEGER NOT NULL,
    answer_id INTEGER,
    highlighted_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
);
```

**Key Fields Explained**:
- `user_id`: Who highlighted the text (Telegram user ID)
- `article_id`: Which article (links to `articles` table)
- `question_type`: Either 'mains' or 'prelims' (tells which table to join)
- `question_id`: The ID of the question (either `main_question_id` OR `prelims_question_id` depending on `question_type`)
- `answer_id`: The ID of the answer (either `main_answer_id` OR `prelims_answer_id` depending on `question_type`)
- `highlighted_text`: The actual text user selected

**Important Relationships**:

```
IF question_type = 'mains':
    question_id refers to → main_questions.main_question_id
    answer_id refers to → main_answers.main_answer_id

IF question_type = 'prelims':
    question_id refers to → prelims_questions.prelims_question_id
    answer_id refers to → prelims_answers.prelims_answer_id
```

**Data Flow Example**:
```
Article ID: 42
    ↓
Main Question ID: 101 ("What is DPI?")
    ↓
Main Answer ID: 201 ("DPI refers to foundational systems...")
    ↓
User highlights text from Answer 201
    ↓
Stored as:
    article_id = 42
    question_type = 'mains'
    question_id = 101
    answer_id = 201
    highlighted_text = "foundational systems like Aadhaar"
```

**Key Logic**:
- Sum word count of all `highlighted_text` for user + article
- Reject new highlights if total exceeds 20% of `article.total_word_count`

**Indexes**:
```sql
CREATE INDEX idx_highlights_user_article ON highlights(user_id, article_id);
```

---

### Table 9: `public_interactions`

**Purpose**: Track public user actions (read, vote, bookmark, summary).

```sql
CREATE TABLE IF NOT EXISTS public_interactions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    article_id INTEGER NOT NULL,
    action_type TEXT CHECK(action_type IN ('read','magazine_worthy','bookmark','summary')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, article_id, action_type)
);
```

**Key Fields**:
- `action_type`: 'read', 'magazine_worthy', 'bookmark', or 'summary'
- `UNIQUE` constraint: User can only perform each action once per article

**Indexes**:
```sql
CREATE INDEX idx_public_article ON public_interactions(article_id);
CREATE INDEX idx_public_user ON public_interactions(user_id);
```

---

### Table 10: `summaries`

**Purpose**: Store private user-written summaries (100-word limit).

```sql
CREATE TABLE IF NOT EXISTS summaries (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    article_id INTEGER NOT NULL,
    summary_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, article_id)
);
```

**Key Logic**:
- Frontend enforces 100-word limit
- One summary per user per article
- UPDATE if exists, INSERT if new

**Indexes**:
```sql
CREATE INDEX idx_summary_user ON summaries(user_id);
```

---

## 🔌 API ENDPOINTS SPECIFICATION

### Base URL
```
https://[YOUR_DOMAIN_HERE]/api
```

**Note**: Replace `[YOUR_DOMAIN_HERE]` with actual domain when ready.

---

### 🔐 AUTHENTICATION ENDPOINTS

#### 1. User Registration / Login

**Endpoint**: `POST /api/auth/telegram`
**Purpose**: Create new user or login existing user via Telegram OAuth

**Request Body**:
```json
{
  "id": 123456789,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "photo_url": "https://t.me/i/userpic/320/johndoe.jpg",
  "auth_date": 1696320000,
  "hash": "abc123def456..."
}
```

**Backend Logic**:
1. **Verify Telegram Hash** using Telegram's verification algorithm
2. **Check if user exists**: Query `users` table with `user_id = id`
3. **If New User**:
   - Generate unique 8-character `referral_code` (uppercase, lowercase, numbers, symbols)
   - Validate uniqueness against existing codes
   - Set `trial_start` = current date
   - Set `trial_end` = current date + 15 days
   - Insert into `users` table
   - **If `referred_by_code` provided**: Insert into `referrals` table
   - **Send Telegram Bot Message**: Welcome + referral link
4. **If Existing User**:
   - Update `last_login` timestamp
   - Return existing user data

**Success Response** (200 OK or 201 Created):
```json
{
  "success": true,
  "user_id": 123456789,
  "name": "John",
  "referral_code": "A8x9Zw#2",
  "trial_start": "2025-10-04",
  "trial_end": "2025-10-19",
  "subscription_status": "inactive",
  "message": "Welcome! Check Telegram for your referral link."
}
```

**Error Response** (400/500):
```json
{
  "success": false,
  "error": "Invalid Telegram data",
  "message": "Hash verification failed"
}
```

---

#### 2. Check User Status

**Endpoint**: `GET /api/users/:userId/status`
**Purpose**: Get trial/subscription status

**Response**:
```json
{
  "success": true,
  "user_id": 123456789,
  "trial_start": "2025-10-04",
  "trial_end": "2025-10-19",
  "trial_active": true,
  "days_remaining": 15,
  "subscription_status": "inactive"
}
```

---

### 📰 ARTICLE ENDPOINTS

#### 3. Get Latest Article

**Endpoint**: `GET /api/articles/latest`

**Response**:
```json
{
  "success": true,
  "article": {
    "article_id": 42,
    "date": "2025-10-04",
    "title": "Digital Public Infrastructure in India",
    "slug": "digital-public-infrastructure-in-india"
  }
}
```

---

#### 4. Get Recent Articles

**Endpoint**: `GET /api/articles/recent?limit=3`

**Response**:
```json
{
  "success": true,
  "articles": [
    {
      "article_id": 42,
      "date": "2025-10-04",
      "title": "Digital Public Infrastructure"
    },
    {
      "article_id": 41,
      "date": "2025-10-03",
      "title": "Renewable Energy Transition"
    }
  ]
}
```

---

#### 5. Get Calendar Dates

**Endpoint**: `GET /api/articles/calendar-dates`
**Purpose**: Return all dates with published articles (for calendar highlighting)

**Response**:
```json
{
  "success": true,
  "dates": [
    "2025-10-04",
    "2025-10-03",
    "2025-10-02"
  ]
}
```

---

#### 6. Get Full Article

**Endpoint**: `GET /api/articles/:articleId?language=en`

**Response**:
```json
{
  "success": true,
  "article": {
    "article_id": 42,
    "language": "en",
    "title": "Digital Public Infrastructure in India",
    "slug": "digital-public-infrastructure-in-india",
    "publish_date": "2025-10-04",
    "hashtags": "#Governance #DigitalIndia",
    "prelude_title": "Why should I read it?",
    "prelude_body": "It ties digital India with delivery on the ground...",
    "source_ribbon": "the-hindu",
    "secondary_ribbon": "Essay + GS2",
    "total_word_count": 1250,
    "main_content": [
      {
        "main_question_id": 101,
        "question_text": "What is DPI?",
        "main_answer_id": 201,
        "answer_text": "DPI refers to foundational systems..."
      }
    ],
    "prelims_content": [
      {
        "prelims_question_id": 301,
        "question_text": "What is DPI?",
        "prelims_answer_id": 401,
        "answer_text": "DPI is the foundational digital infrastructure..."
      }
    ]
  }
}
```

---

#### 7. Get Public Interaction Counts

**Endpoint**: `GET /api/articles/:articleId/counts`

**Response**:
```json
{
  "success": true,
  "readCount": 150,
  "magazineWorthyCount": 72,
  "bookmarkCount": 91,
  "summaryCount": 45
}
```

**Backend Logic**:
1. Query `public_interactions` table
2. Filter by `article_id`
3. Count rows grouped by `action_type`

---

### 💬 USER INTERACTION ENDPOINTS

#### 8. Save User Interaction

**Endpoint**: `POST /api/articles/interact`

**Request Body**:
```json
{
  "userId": "123456789",
  "articleId": 42,
  "actionType": "read"
}
```

**Allowed `actionType`**: `"read"`, `"magazine_worthy"`, `"bookmark"`, `"summary"`

**Backend Logic**:
1. Validate `actionType`
2. Insert into `public_interactions` table
3. Handle duplicate gracefully (UNIQUE constraint)

**Response**:
```json
{
  "success": true,
  "message": "Interaction recorded"
}
```

---

#### 9. Save User Summary

**Endpoint**: `POST /api/articles/summary`

**Request Body**:
```json
{
  "userId": "123456789",
  "articleId": 42,
  "summaryText": "DPI like Aadhaar and UPI enable digital governance..."
}
```

**Backend Logic**:
1. Check if summary exists for `user_id + article_id`
2. If exists: UPDATE
3. If new: INSERT
4. Also call `POST /api/articles/interact` with `actionType: "summary"`

**Response**:
```json
{
  "success": true,
  "message": "Summary saved",
  "id": 1234
}
```

---

#### 10. Get User Summary

**Endpoint**: `GET /api/articles/:articleId/summary?userId=:userId`

**Response**:
```json
{
  "success": true,
  "summary": {
    "id": 1234,
    "user_id": "123456789",
    "article_id": 42,
    "summary_text": "DPI like Aadhaar and UPI...",
    "created_at": "2025-10-04T10:30:00Z"
  }
}
```

---

### 🖍️ HIGHLIGHT ENDPOINTS

#### 11. Save Highlight

**Endpoint**: `POST /api/highlights` or `POST /api/save-highlight`

**Request Body**:
```json
{
  "user_id": "123456789",
  "article_id": 42,
  "language": "en",
  "question_type": "mains",
  "question_id": 101,
  "answer_id": 201,
  "highlighted_text": "DPI refers to foundational systems like Aadhaar, UPI, DigiLocker"
}
```

**Backend Logic (Word Completion + 20% Limit Enforcement)**:

**⚠️ CRITICAL: Word Completion Must Run BEFORE Saving**

1. **Get full answer text from database** using `answer_id` and `question_type`
2. **Complete partial words** (see detailed algorithm below)
3. Get `total_word_count` from `articles` table
4. Count words in **completed** `highlighted_text`
5. Sum existing highlight word counts for this `user_id + article_id`
6. Calculate: `(existing_words + new_words) / total_word_count`
7. **If > 0.20**: Return error with message (see below)
8. **If ≤ 0.20**: Insert **completed highlight** into `highlights` table

**Success Response**:
```json
{
  "success": true,
  "highlight_id": 5678,
  "message": "Highlight saved",
  "usage": {
    "words_highlighted": 250,
    "total_words": 1250,
    "percentage": 20
  }
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "message": "Highlights are tools to make short notes. Your highlight exceeded the limit. If you liked the Article consider Voting to get in next Magazine. The Magazine version will be Mains ready (concise and to the point)."
}
```

---

### 🔧 **WORD COMPLETION ALGORITHM (CRITICAL FOR DATA QUALITY)**

#### **Problem Statement**

Frontend text selection often captures **partial words** due to:
- User selection not perfectly aligned with word boundaries
- Browser selection behavior variations
- Touch/mouse precision issues
- TextHighlighter library limitations

**Example Issues**:
```
Database: "DPI refers to foundational systems like Aadhaar"
User selects: "ational systems like Aadha"  ❌ Broken!

Without word completion:
  Downloaded notes: "...ational systems like Aadha..."  ← Looks unprofessional

With word completion:
  Downloaded notes: "foundational systems like Aadhaar"  ✅ Clean!
```

---

#### **Algorithm: `completeWordBoundaries(highlightedText, fullAnswerText)`**

**Input**:
- `highlightedText`: Text received from frontend (may have partial words)
- `fullAnswerText`: Complete answer text from database

**Output**:
- Completed highlight with full words at both ends

**Steps**:

```javascript
function completeWordBoundaries(highlightedText, fullAnswerText) {
    // Step 1: Find where highlight appears in full text
    let startIndex = fullAnswerText.indexOf(highlightedText);

    if (startIndex === -1) {
        // Highlight not found - return original (handle fuzzy matching in production)
        console.warn('⚠️ Highlight not found in answer text');
        return highlightedText.trim();
    }

    let endIndex = startIndex + highlightedText.length;

    // Step 2: Extend START to word boundary
    // Move backwards until we hit: space, punctuation, or start of text
    while (startIndex > 0) {
        const charBefore = fullAnswerText[startIndex - 1];

        // Stop if we hit word boundary
        if (charBefore === ' ' ||
            charBefore === '\n' ||
            charBefore === '\t' ||
            charBefore === '(' ||
            charBefore === '[' ||
            charBefore === '{' ||
            charBefore === '"' ||
            charBefore === "'" ||
            charBefore === '—' ||
            charBefore === '–') {
            break;
        }

        startIndex--;
    }

    // Step 3: Extend END to word boundary
    // Move forward until we hit: space, punctuation, or end of text
    while (endIndex < fullAnswerText.length) {
        const charAfter = fullAnswerText[endIndex];

        // Stop if we hit word boundary
        if (charAfter === ' ' ||
            charAfter === '\n' ||
            charAfter === '\t' ||
            charAfter === '.' ||
            charAfter === ',' ||
            charAfter === ';' ||
            charAfter === ':' ||
            charAfter === '!' ||
            charAfter === '?' ||
            charAfter === ')' ||
            charAfter === ']' ||
            charAfter === '}' ||
            charAfter === '"' ||
            charAfter === "'" ||
            charAfter === '—' ||
            charAfter === '–') {
            break;
        }

        endIndex++;
    }

    // Step 4: Extract completed highlight
    let completed = fullAnswerText.substring(startIndex, endIndex);

    // Step 5: Clean up
    completed = completed.trim();  // Remove leading/trailing spaces
    completed = completed.replace(/\s+/g, ' ');  // Normalize multiple spaces to single
    completed = completed.replace(/\n+/g, ' ');  // Replace line breaks with space

    return completed;
}
```

---

#### **Edge Cases Handled**

| Case | Example Input | Example Output | Notes |
|------|---------------|----------------|-------|
| **Partial start** | `"ational systems"` | `"foundational systems"` | Extends to word start |
| **Partial end** | `"systems lik"` | `"systems like"` | Extends to word end |
| **Both partial** | `"ational sys"` | `"foundational systems"` | Extends both ends |
| **With punctuation** | `"systems, like"` | `"systems, like"` | Stops at comma |
| **With quotes** | `"'Aadhaar' is"` | `"Aadhaar' is"` | Handles quotes |
| **Line breaks** | `"systems\nlike"` | `"systems like"` | Normalizes to space |
| **Multiple spaces** | `"systems    like"` | `"systems like"` | Normalizes spaces |
| **Hindi text** | `"ढांचागत प्रणालि"` | `"ढांचागत प्रणालियाँ"` | Works with Unicode |

---

#### **Implementation in Backend Endpoint**

```javascript
// POST /api/highlights endpoint

app.post('/api/highlights', async (req, res) => {
    const { user_id, article_id, language, question_type, question_id, answer_id, highlighted_text } = req.body;

    try {
        // 1. Get full answer text from database
        let fullAnswerText;
        if (question_type === 'mains') {
            const result = await db.query(
                'SELECT answer_text FROM main_answers WHERE main_answer_id = $1',
                [answer_id]
            );
            fullAnswerText = result.rows[0]?.answer_text;
        } else if (question_type === 'prelims') {
            const result = await db.query(
                'SELECT answer_text FROM prelims_answers WHERE prelims_answer_id = $1',
                [answer_id]
            );
            fullAnswerText = result.rows[0]?.answer_text;
        }

        if (!fullAnswerText) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        // 2. COMPLETE PARTIAL WORDS (CRITICAL STEP!)
        const completedHighlight = completeWordBoundaries(highlighted_text, fullAnswerText);

        console.log('📝 Word Completion:');
        console.log('  Original:', highlighted_text);
        console.log('  Completed:', completedHighlight);

        // 3. Check 20% limit (using completed text)
        const wordCount = completedHighlight.split(/\s+/).length;

        const articleResult = await db.query(
            'SELECT total_word_count FROM articles WHERE article_id = $1',
            [article_id]
        );
        const totalWords = articleResult.rows[0].total_word_count;

        const existingResult = await db.query(
            'SELECT SUM(array_length(string_to_array(highlighted_text, \' \'), 1)) as existing_words FROM highlights WHERE user_id = $1 AND article_id = $2',
            [user_id, article_id]
        );
        const existingWords = existingResult.rows[0].existing_words || 0;

        const percentage = ((existingWords + wordCount) / totalWords) * 100;

        if (percentage > 20) {
            return res.status(400).json({
                success: false,
                message: 'Highlights are tools to make short notes. Your highlight exceeded the limit. If you liked the Article consider Voting to get in next Magazine.'
            });
        }

        // 4. Save COMPLETED highlight to database
        const insertResult = await db.query(
            'INSERT INTO highlights (user_id, article_id, question_type, question_id, answer_id, highlighted_text, language) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING highlight_id',
            [user_id, article_id, question_type, question_id, answer_id, completedHighlight, language]
        );

        return res.json({
            success: true,
            highlight_id: insertResult.rows[0].highlight_id,
            message: 'Highlight saved',
            original_text: highlighted_text,
            completed_text: completedHighlight,  // Return to show user what was saved
            usage: {
                words_highlighted: existingWords + wordCount,
                total_words: totalWords,
                percentage: percentage.toFixed(1)
            }
        });

    } catch (error) {
        console.error('❌ Error saving highlight:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
```

---

#### **Benefits of Word Completion**

| Benefit | Description |
|---------|-------------|
| **✅ Professional Downloads** | Notes always contain complete words |
| **✅ No Frontend Complexity** | Frontend sends raw selection, backend fixes it |
| **✅ Consistent Quality** | Works across all browsers and devices |
| **✅ Better User Experience** | Users don't need to be careful with selection |
| **✅ Database Integrity** | Only clean data stored |
| **✅ Foolproof System** | Handles all edge cases automatically |

---

#### **Testing the Algorithm**

**Test Cases**:

```javascript
// Test 1: Partial word at end
const fullText = "DPI refers to foundational systems like Aadhaar";
const highlight = "foundational sys";
const result = completeWordBoundaries(highlight, fullText);
// Expected: "foundational systems"

// Test 2: Partial word at start
const highlight2 = "ational systems";
const result2 = completeWordBoundaries(highlight2, fullText);
// Expected: "foundational systems"

// Test 3: Both ends partial
const highlight3 = "ational sys";
const result3 = completeWordBoundaries(highlight3, fullText);
// Expected: "foundational systems"

// Test 4: With punctuation
const fullText4 = "India's DPI includes Aadhaar, UPI, and DigiLocker.";
const highlight4 = "Aadhaar, UP";
const result4 = completeWordBoundaries(highlight4, fullText4);
// Expected: "Aadhaar, UPI"

// Test 5: Already complete
const highlight5 = "foundational systems";
const result5 = completeWordBoundaries(highlight5, fullText);
// Expected: "foundational systems" (no change)
```

---

#### **⚠️ Important Notes for Backend Developer**

1. **ALWAYS run word completion BEFORE saving to database**
2. **Log both original and completed text** for debugging
3. **Use completed text for word count calculations** (20% limit)
4. **Return completed text to frontend** so user knows what was saved
5. **Handle Unicode properly** for Hindi text support
6. **Consider fuzzy matching** if exact substring not found (advanced feature)

---

#### 12. Get User Highlights

**Endpoint**: `GET /api/users/:userId/highlights?articleId=:articleId`

**Response**:
```json
{
  "success": true,
  "highlights": [
    {
      "highlight_id": 5678,
      "article_id": 42,
      "article_title": "Digital Public Infrastructure",
      "question_type": "mains",
      "highlighted_text": "DPI refers to foundational systems...",
      "created_at": "2025-10-04T10:30:00Z"
    }
  ]
}
```

---

### 📊 USER DASHBOARD ENDPOINTS ("YOUR JOURNAL")

---

## 🔐 TELEGRAM AUTHENTICATION & PROFILE CREATION WORKFLOW

### Complete User Onboarding Flow

**Data Received from Telegram Bot**:

When user logs in via Telegram, these data points are captured:

```json
{
  "username": "@D2313",
  "id": 681522234,
  "first": "Deepanshu",
  "last": "Anand",
  "lang": "en"
}
```

**Field Mapping**:
- `username`: Telegram username (e.g., @D2313)
- `id`: Telegram user ID (9-20 digits long)
- `first`: First name from Telegram profile
- `last`: Last name from Telegram profile
- `lang`: Language code from Telegram settings (en/hi)

---

### Profile Creation & Display Logic

#### **1. User ID Masking (Security + UX)**

**Database Storage**: Store FULL Telegram ID
```sql
INSERT INTO users (telegram_id, ...) VALUES (681522234, ...);
```

**UI Display**: Show last 8 digits, mask first 5
```
Full ID: 681522234
Display: *****234
```

**Implementation**:
```javascript
function maskTelegramId(telegramId) {
  const idStr = String(telegramId);
  const lastEight = idStr.slice(-8); // Last 8 digits
  const masked = '*****' + lastEight.slice(-3); // Show only last 3
  return masked; // Result: "*****234"
}
```

**Why This Design?**
- ✅ Security: Full ID not exposed publicly
- ✅ Uniqueness: Last 3 digits help user identify their account
- ✅ Professionalism: Looks cleaner than full 12-digit ID

---

#### **2. Display Name Creation**

**Combine First + Last Name**:
```javascript
const displayName = `${telegramData.first} ${telegramData.last}`.trim();
// Result: "Deepanshu Anand"
```

**Store in Database**:
```sql
UPDATE users
SET display_name = 'Deepanshu Anand',
    telegram_first_name = 'Deepanshu',
    telegram_last_name = 'Anand'
WHERE telegram_id = 681522234;
```

**Editable Fields**:
- ✅ `display_name`: User can edit in dashboard
- ❌ `telegram_id`: System-controlled, never editable
- ❌ `date_of_joining`: System-controlled, never editable

---

#### **3. Date Format (Indian Standard)**

**Backend Storage**: TIMESTAMP
```sql
date_of_joining TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**Frontend Display**: DD Month YYYY (Indian format)
```
Database: 2025-10-10T00:00:00Z
Display: "10 October 2025"
```

**Formatting Function**:
```javascript
function formatDateIndian(dateStr) {
  const date = new Date(dateStr);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`; // "10 October 2025"
}
```

---

#### **4. Trial Calculation Logic**

**Initial Trial**: `date_of_joining + 15 days`

```sql
-- On user creation
INSERT INTO users (telegram_id, trial_start_date, trial_end_date)
VALUES (
  681522234,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP + INTERVAL '15 days'
);
```

**Trial Extension Logic** (3 Referrals = +15 Days):

```sql
-- When 3rd referral completes signup
UPDATE users
SET trial_end_date = trial_end_date + INTERVAL '15 days',
    trial_extended = TRUE
WHERE telegram_id = 681522234;
```

**Trial End Date Display**:
```
Format: "Your Trial Ends: 25 October 2025" (Green button)
```

---

### 🎁 REFERRAL SYSTEM WORKFLOW

#### **"Help Us Grow !!" Button & Referral Popup**

**UI Flow**: When user clicks "Help Us Grow !!" button on dashboard

**Purpose**: Encourage viral growth through referrals with 15-day trial extension reward

**Popup Trigger**:
```javascript
// Frontend: user_dashboard.html
document.getElementById('extend-trial').addEventListener('click', () => {
  // Open referral popup
  showReferralPopup();
});
```

**Popup Content** (file: `referral_popup.html`):
- **Headline**: "🎉 Welcome to Samyak Gyan!"
- **Message**: "15-day free access" + referral instructions
- **CTA Button**: "📲 Send Link to My Telegram"
- **Motivation**: "Samyak Gyan is not spending on ads - Help SG grow!"
- **Close/Skip**: Darker (×) button with "Skip" text

**Analytics Events to Track**:

1. **Popup Viewed**:
```javascript
POST /api/analytics/event
Body: {
  event_type: 'popup_viewed',
  user_id: '681522234',
  trial_days_remaining: 12,
  timestamp: '2025-10-14T10:30:00Z'
}
```

2. **Referral Link Generated**:
```javascript
POST /api/analytics/event
Body: {
  event_type: 'referral_link_generated',
  user_id: '681522234',
  referral_code: 'SG-DANAN-X7K2',
  timestamp: '2025-10-14T10:31:00Z'
}
```

3. **Popup Dismissed**:
```javascript
POST /api/analytics/event
Body: {
  event_type: 'popup_dismissed',
  user_id: '681522234',
  dismiss_reason: 'close_button' OR 'skip_button',
  timestamp: '2025-10-14T10:31:30Z'
}
```

4. **Referral Progress Updated**:
```javascript
POST /api/analytics/event
Body: {
  event_type: 'referral_progress_viewed',
  user_id: '681522234',
  referrals_completed: 1,
  timestamp: '2025-10-14T10:32:00Z'
}
```

**Database Schema for Analytics Events**:
```sql
CREATE TABLE IF NOT EXISTS analytics_events (
  event_id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  user_id TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(telegram_id)
);

CREATE INDEX idx_analytics_user_type ON analytics_events(user_id, event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);
```

**Why Track These Events?**
- **Conversion Rate**: popup_viewed → referral_link_generated
- **Abandonment Rate**: popup_viewed → popup_dismissed
- **A/B Testing**: Test different popup copy to optimize conversions
- **User Behavior**: Understand when users are most likely to refer

---

#### **Referral Link Generation**

**Telegram Bot Integration**:

When user clicks "Get Your Referral Link" button:

1. **Frontend** sends request:
```javascript
POST /api/telegram/send-referral-link
Body: { user_id: "681522234", referral_code: "DEMO_REF_123" }
```

2. **Backend** triggers Telegram Bot API:
```javascript
const telegramBot = require('node-telegram-bot-api');

async function sendReferralLink(userId, referralCode) {
  const referralUrl = `https://samyakgyan.com/ref/${referralCode}`;

  const message = `
🎉 Your Unique Referral Link:

${referralUrl}

📢 Share with friends and earn 15 extra days of trial!

When 3 friends join using your link, you'll get +15 days automatically.

Happy Sharing! 🚀
  `;

  await bot.sendMessage(userId, message);
}
```

3. **User receives message in Telegram** with clickable referral link

---

#### **Referral Tracking**

**Database Trigger** (Auto-extend trial when 3 referrals complete):

```sql
CREATE OR REPLACE FUNCTION check_referral_reward()
RETURNS TRIGGER AS $$
DECLARE
  referral_count INTEGER;
BEGIN
  -- Count completed referrals for the referrer
  SELECT COUNT(*) INTO referral_count
  FROM referrals
  WHERE referrer_user_id = NEW.referrer_user_id
    AND status = 'completed';

  -- If 3 referrals completed, extend trial
  IF referral_count >= 3 THEN
    UPDATE users
    SET trial_end_date = trial_end_date + INTERVAL '15 days',
        trial_extended = TRUE
    WHERE telegram_id = NEW.referrer_user_id;

    -- Send Telegram notification
    PERFORM pg_notify('referral_reward', NEW.referrer_user_id::text);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER referral_reward_trigger
AFTER INSERT OR UPDATE ON referrals
FOR EACH ROW
EXECUTE FUNCTION check_referral_reward();
```

**Backend listens for notification**:
```javascript
db.on('notification', (msg) => {
  if (msg.channel === 'referral_reward') {
    const userId = msg.payload;
    sendTelegramRewardNotification(userId);
  }
});
```

---

### 📅 SUBSCRIPTION STATE MANAGEMENT

#### **Two Independent Subscriptions**

**Topics**:
1. **Current Affairs** (Weekday/Saturday dates)
2. **Ethics & Essay** (Sunday updates only)

**Database Schema**:

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  subscription_id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  topic TEXT CHECK(topic IN ('current-affairs', 'ethics-essay')) NOT NULL,
  status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'inactive',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  razorpay_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, topic),
  FOREIGN KEY (user_id) REFERENCES users(telegram_id)
);

CREATE INDEX idx_subscriptions_user_topic ON subscriptions(user_id, topic);
```

---

#### **Trial Active Display Logic**

**Scenario 1: Trial Active (Days 1-15)**

```sql
-- Check if trial is active
SELECT
  CASE
    WHEN trial_end_date > CURRENT_TIMESTAMP THEN TRUE
    ELSE FALSE
  END as trial_active
FROM users
WHERE telegram_id = $1;
```

**UI Display**:
- **"Your Trial Ends" Button**: Green, shows date
- **Current Affairs Button**: Transparent (access granted)
- **Ethics & Essay Button**: Transparent (access granted)

---

#### **Trial Expired Display Logic**

**Scenario 2: Both Subscriptions Active**

```sql
SELECT topic, status
FROM subscriptions
WHERE user_id = $1;

-- Result:
-- current-affairs | active
-- ethics-essay    | active
```

**UI Display**:
- **"Your Trial Ends" Button**: Changed to "Active" (Green)
- **Both Topic Buttons**: Transparent

---

**Scenario 3: Only Current Affairs Active**

```sql
-- Result:
-- current-affairs | active
-- ethics-essay    | inactive
```

**UI Display**:
- **"Your Trial Ends" Button**: "Active: Current Affairs" (Green)
- **Current Affairs Button**: Transparent
- **Ethics & Essay Button**: RED

---

**Scenario 4: Only Ethics & Essay Active**

```sql
-- Result:
-- current-affairs | inactive
-- ethics-essay    | active
```

**UI Display**:
- **"Your Trial Ends" Button**: "Active: Ethics & Essay" (Green)
- **Current Affairs Button**: RED
- **Ethics & Essay Button**: Transparent

---

**Scenario 5: Both Subscriptions Inactive**

```sql
-- Result:
-- current-affairs | inactive
-- ethics-essay    | inactive
```

**UI Display**:
- **"Your Trial Ends" Button**: Hidden or "Subscribe to access"
- **Both Topic Buttons**: RED

---

### 🚪 ACCESS CONTROL & REDIRECT FLOW

#### **Endpoint: Check User Access**

**Purpose**: Validate subscription before allowing content access

```
GET /api/users/:userId/check-access?topic=current-affairs
```

**Query Parameters**:
- `topic`: `current-affairs` OR `ethics-essay`

**Backend Logic**:
```javascript
app.get('/api/users/:userId/check-access', async (req, res) => {
  const { userId } = req.params;
  const { topic } = req.query;

  try {
    // 1. Check trial status
    const userResult = await db.query(
      'SELECT trial_end_date FROM users WHERE telegram_id = $1',
      [userId]
    );

    const trialActive = new Date(userResult.rows[0].trial_end_date) > new Date();

    // 2. If trial active, grant access
    if (trialActive) {
      return res.json({ has_access: true, redirect_url: null });
    }

    // 3. Check subscription status
    const subResult = await db.query(
      'SELECT status FROM subscriptions WHERE user_id = $1 AND topic = $2',
      [userId, topic]
    );

    const subscriptionActive = subResult.rows[0]?.status === 'active';

    if (subscriptionActive) {
      return res.json({ has_access: true, redirect_url: null });
    }

    // 4. No access - redirect to dashboard
    return res.json({
      has_access: false,
      redirect_url: `/user_dashboard.html?highlight=${topic}`
    });

  } catch (error) {
    console.error('Access check error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

**Response Examples**:

**Access Granted**:
```json
{
  "has_access": true,
  "redirect_url": null
}
```

**Access Denied**:
```json
{
  "has_access": false,
  "redirect_url": "/user_dashboard.html?highlight=current-affairs"
}
```

---

#### **Frontend Integration Flow**

**Weekday Date Click** (Homepage):

```javascript
function onDateClick(date) {
  // Check subscription status
  fetch(`/api/users/${userId}/check-access?topic=current-affairs`)
    .then(res => res.json())
    .then(data => {
      if (data.has_access) {
        // Access granted - navigate to article
        window.location.href = `/articles/${date}`;
      } else {
        // Access denied - redirect to dashboard
        window.location.href = data.redirect_url;
      }
    });
}
```

**Sunday Date Click** (Homepage):

```javascript
function onSundayDateClick(date) {
  const today = new Date();
  const isSunday = today.getDay() === 0;

  if (!isSunday) {
    // Not Sunday - show message
    alert('Ethics & Essay content is updated every Sunday.');
    return;
  }

  // Check subscription status
  fetch(`/api/users/${userId}/check-access?topic=ethics-essay`)
    .then(res => res.json())
    .then(data => {
      if (data.has_access) {
        window.location.href = `/ethics-essay`;
      } else {
        window.location.href = data.redirect_url;
      }
    });
}
```

**Ethics & Essay Nav Button Click**:

```javascript
document.getElementById('nav-ethics-btn').addEventListener('click', (e) => {
  e.preventDefault();

  fetch(`/api/users/${userId}/check-access?topic=ethics-essay`)
    .then(res => res.json())
    .then(data => {
      if (data.has_access) {
        window.location.href = `/ethics-essay`;
      } else {
        window.location.href = data.redirect_url;
      }
    });
});
```

---

#### **Dashboard Highlight Flow**

**URL Parameter Handling**:

When user lands on dashboard with `?highlight=current-affairs`:

1. **Auto-scroll** to subscription block
2. **Add glow effect** to inactive button (red pulse)
3. **Show overlay** message: "Subscribe to Read" (2 seconds)
4. **Remove URL parameter** (clean up)

**Backend: No action needed** - This is pure frontend behavior

---

### 📋 USER DASHBOARD ENDPOINTS

#### 14. Get User Dashboard Data

**Endpoint**: `GET /api/users/:userId/dashboard`

**Purpose**: Fetch complete user profile with Telegram data, trial status, and subscriptions

**Parameters**:
- `userId`: Telegram user ID (full ID, e.g., 681522234)

**Response**:
```json
{
  "success": true,
  "telegram_id": "681522234",
  "telegram_id_masked": "*****234",
  "telegram_username": "@D2313",
  "telegram_first_name": "Deepanshu",
  "telegram_last_name": "Anand",
  "display_name": "Deepanshu Anand",
  "date_of_joining": "2025-10-10",
  "date_of_joining_formatted": "10 October 2025",
  "preferred_language": "en",
  "trial_start_date": "2025-10-10",
  "trial_end_date": "2025-10-25",
  "trial_end_date_formatted": "25 October 2025",
  "trial_active": true,
  "trial_extended": false,
  "referral_code": "DEMO_REF_123",
  "referrals_completed": 1,
  "referrals_remaining": 2,
  "subscriptions": [
    {
      "topic": "current-affairs",
      "status": "inactive",
      "start_date": null,
      "end_date": null
    },
    {
      "topic": "ethics-essay",
      "status": "inactive",
      "start_date": null,
      "end_date": null
    }
  ]
}
```

**Backend Logic**:
```javascript
app.get('/api/users/:userId/dashboard', async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Get user profile
    const userResult = await db.query(`
      SELECT
        telegram_id,
        telegram_username,
        telegram_first_name,
        telegram_last_name,
        display_name,
        date_of_joining,
        preferred_language,
        trial_start_date,
        trial_end_date,
        trial_extended,
        referral_code
      FROM users
      WHERE telegram_id = $1
    `, [userId]);

    const user = userResult.rows[0];

    // 2. Mask Telegram ID
    const maskedId = '*****' + String(user.telegram_id).slice(-3);

    // 3. Format dates (Indian format)
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    // 4. Check trial active
    const trialActive = new Date(user.trial_end_date) > new Date();

    // 5. Get referral count
    const referralResult = await db.query(
      'SELECT COUNT(*) as count FROM referrals WHERE referrer_user_id = $1 AND status = \'completed\'',
      [userId]
    );
    const referralsCompleted = parseInt(referralResult.rows[0].count);
    const referralsRemaining = Math.max(0, 3 - (referralsCompleted % 3));

    // 6. Get subscriptions
    const subResult = await db.query(
      'SELECT topic, status, start_date, end_date FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    return res.json({
      success: true,
      telegram_id: user.telegram_id,
      telegram_id_masked: maskedId,
      telegram_username: user.telegram_username,
      telegram_first_name: user.telegram_first_name,
      telegram_last_name: user.telegram_last_name,
      display_name: user.display_name,
      date_of_joining: user.date_of_joining,
      date_of_joining_formatted: formatDate(user.date_of_joining),
      preferred_language: user.preferred_language,
      trial_start_date: user.trial_start_date,
      trial_end_date: user.trial_end_date,
      trial_end_date_formatted: formatDate(user.trial_end_date),
      trial_active: trialActive,
      trial_extended: user.trial_extended,
      referral_code: user.referral_code,
      referrals_completed: referralsCompleted,
      referrals_remaining: referralsRemaining,
      subscriptions: subResult.rows
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

**Database Query**:
```sql
SELECT
    telegram_id,
    telegram_username,
    telegram_first_name,
    telegram_last_name,
    display_name,
    date_of_joining,
    preferred_language,
    trial_start_date,
    trial_end_date,
    trial_extended,
    referral_code
FROM users
WHERE telegram_id = $1;
```

---

#### 15. Get User Analytics

**Endpoint**: `GET /api/users/:userId/analytics`

**Purpose**: Fetch analytics data for selected stat type, month, and fortnight

**Query Parameters**:
- `stat`: reading | voting | notes | time | bookmarked
- `month`: 1-12 (January to December)
- `fortnight`: 1 | 2 (1st half: 1-15, 2nd half: 16-end)

**Example**: `GET /api/users/123456789/analytics?stat=reading&month=10&fortnight=1`

**Response (for "reading" stat)**:
```json
{
  "success": true,
  "stat": "reading",
  "month": 10,
  "fortnight": 1,
  "data": {
    "totalArticles": 30,
    "readArticles": 22,
    "completionRate": 73.3,
    "dailyBreakdown": [
      {"date": "2025-10-01", "articlesRead": 2},
      {"date": "2025-10-02", "articlesRead": 3},
      ...
    ]
  }
}
```

**Backend Logic per Stat Type**:

**1. Reading Insight** (`stat=reading`):
```sql
-- Total articles in fortnight
SELECT COUNT(*) as total
FROM articles
WHERE EXTRACT(MONTH FROM publish_date) = $1
  AND EXTRACT(DAY FROM publish_date) BETWEEN $2 AND $3;

-- Articles read by user
SELECT COUNT(DISTINCT article_id) as read_count
FROM public_interactions
WHERE user_id = $4
  AND action_type = 'read'
  AND EXTRACT(MONTH FROM created_at) = $1
  AND EXTRACT(DAY FROM created_at) BETWEEN $2 AND $3;

-- Calculate completion_rate = (read_count / total) * 100
```

**2. Voting Pattern** (`stat=voting`):

**Purpose**: Show user which dates they voted on + Top 5 community-voted articles per day + whether user voted on each

**Expected Response Format**:
```json
{
  "success": true,
  "stat": "voting",
  "month": "2025-02",
  "fortnight": 1,
  "data": {
    "activeDates": [1, 2, 3, 4, 5],
    "votingData": {
      "1": {
        "top5": [
          {
            "articleId": 142,
            "title": "Clean Energy Mission",
            "votes": 520,
            "userVoted": true
          },
          {
            "articleId": 156,
            "title": "Youth Parliament Highlights",
            "votes": 480,
            "userVoted": false
          }
        ]
      },
      "2": { "top5": [...] }
    }
  }
}
```

**Backend Implementation**:

**Step 1**: Get dates user was active (voted on ANY article):
```sql
SELECT DISTINCT EXTRACT(DAY FROM created_at) as day
FROM public_interactions
WHERE user_id = $1
  AND action_type = 'magazine_worthy'
  AND EXTRACT(MONTH FROM created_at) = $2
  AND EXTRACT(YEAR FROM created_at) = $3
  AND EXTRACT(DAY FROM created_at) BETWEEN $4 AND $5
ORDER BY day;
```

**Step 2**: For EACH active date, get Top 5 community-voted articles:
```sql
SELECT
  a.article_id,
  a.title,
  COUNT(pi.id) as vote_count,
  EXISTS(
    SELECT 1 FROM public_interactions uv
    WHERE uv.user_id = $1
      AND uv.article_id = a.article_id
      AND uv.action_type = 'magazine_worthy'
  ) as user_voted
FROM public_interactions pi
JOIN articles a ON a.article_id = pi.article_id
WHERE pi.action_type = 'magazine_worthy'
  AND a.is_votable = TRUE
  AND DATE(pi.created_at) = $2
GROUP BY a.article_id, a.title
ORDER BY vote_count DESC
LIMIT 5;
```

**Important Notes**:
- ✅ Filter `is_votable = TRUE` to exclude editorials from Top 5
- ✅ Each date has its own Top 5 (not fortnight-wide)
- ✅ `user_voted` uses EXISTS subquery for efficiency
- ✅ Only articles with `is_votable = TRUE` can appear in rankings

**3. Notes Dashboard** (`stat=notes`):
```sql
-- Count highlights
SELECT COUNT(*) as highlight_count
FROM highlights
WHERE user_id = $1
  AND EXTRACT(MONTH FROM created_at) = $2
  AND EXTRACT(DAY FROM created_at) BETWEEN $3 AND $4;

-- Count summaries
SELECT COUNT(*) as summary_count
FROM summaries
WHERE user_id = $1
  AND EXTRACT(MONTH FROM created_at) = $2
  AND EXTRACT(DAY FROM created_at) BETWEEN $3 AND $4;
```

**4. Time Spent** (`stat=time`):
```sql
-- Calculate based on:
-- - Read articles (avg 15 min/article)
-- - Highlights made (avg 2 min/highlight)
-- - Summaries written (avg 5 min/summary)

SELECT
    (COUNT(DISTINCT pi.article_id) * 15) +
    (COUNT(h.highlight_id) * 2) +
    (COUNT(s.id) * 5) as estimated_minutes
FROM public_interactions pi
LEFT JOIN highlights h ON h.user_id = pi.user_id
LEFT JOIN summaries s ON s.user_id = pi.user_id
WHERE pi.user_id = $1
  AND EXTRACT(MONTH FROM pi.created_at) = $2
  AND EXTRACT(DAY FROM pi.created_at) BETWEEN $3 AND $4;
```

**5. Bookmarked Articles** (`stat=bookmarked`):
```sql
-- List bookmarked articles
SELECT a.article_id, a.title, a.publish_date, pi.created_at as bookmarked_at
FROM public_interactions pi
JOIN articles a ON a.article_id = pi.article_id
WHERE pi.user_id = $1
  AND pi.action_type = 'bookmark'
  AND EXTRACT(MONTH FROM pi.created_at) = $2
  AND EXTRACT(DAY FROM pi.created_at) BETWEEN $3 AND $4
ORDER BY pi.created_at DESC;
```

**Fortnight Date Ranges**:
- Fortnight 1: Days 1-15
- Fortnight 2: Days 16-[last day of month]

---

#### 16. Update User Profile

**Endpoint**: `PUT /api/users/:userId/profile`

**Purpose**: Update user's name and language preference

**Request Body**:
```json
{
  "userName": "New Name",
  "language": "hi"
}
```

**Backend Logic**:
1. Validate user exists
2. Update `users` table
3. If language changed to "hi" (Hindi), trigger Bhashini API translation workflow
4. Return updated profile

**Database Query**:
```sql
UPDATE users
SET name = $1, language = $2
WHERE user_id = $3
RETURNING user_id, name, language;
```

**Special Case - Hindi Selected**:
```javascript
if (language === 'hi') {
    // TODO: Trigger Bhashini API
    // - Translate all articles from 'en' to 'hi'
    // - Store translated versions in articles table with language = 'hi'
    // - Cache translations for performance
    // - Update UI text (buttons, labels) to Hindi
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "userId": "123456789",
    "userName": "New Name",
    "language": "hi"
  }
}
```

---

#### 17. Manage Subscription (Topic Access)

**Endpoint**: `POST /api/users/:userId/subscribe`

**Purpose**: Subscribe user to specific topic (Current Affairs or Ethics & Essay)

**Request Body**:
```json
{
  "topic": "ethics-essay",
  "action": "subscribe"
}
```

**Allowed Topics**:
- `current-affairs`
- `ethics-essay`

**Allowed Actions**:
- `subscribe`: Activate topic access
- `unsubscribe`: Deactivate topic access

**Backend Logic**:
1. Check current subscription status
2. Validate payment via Razorpay
3. Update subscription record
4. Set topic access flags
5. Send Telegram notification

**Database Query**:
```sql
-- Check subscription status
SELECT subscription_status, subscription_end
FROM users
WHERE user_id = $1;

-- Update topic access (stored in users table or separate topic_access table)
UPDATE users
SET subscription_status = 'active',
    subscription_start = NOW(),
    subscription_end = NOW() + INTERVAL '1 month'
WHERE user_id = $1;
```

**Response**:
```json
{
  "success": true,
  "message": "Subscription activated for Ethics & Essay",
  "topicAccess": {
    "currentAffairs": true,
    "ethicsEssay": true
  },
  "subscriptionEnd": "2025-11-10"
}
```

---

### 📊 USER DASHBOARD - FRONTEND INTEGRATION

**Files Created**:
1. `user_dashboard.html` - Main dashboard page
2. `styles/user_dashboard.css` - Dashboard styling
3. `scripts/user_dashboard.js` - Dashboard logic

**Navigation Integration**:
- Updated `components/header.html` line 24
- "Your Journal" button now links to `user_dashboard.html`

**Features**:
1. **Personal Info**: Name (editable), Language (selectable)
2. **Account Info**: User ID, Join Date, Subscription Status, Topic Access
3. **My Stats & Compilations**: 5 analytics views (Reading, Voting, Notes, Time, Bookmarked)
4. **Dynamic Panel**: Charts/stats filtered by Month + Fortnight
5. **Fortnight-Based System**: Consistent with download notes feature

**Backend Integration Points**:
```javascript
// Load dashboard data
GET /api/users/:userId/dashboard

// Load analytics
GET /api/users/:userId/analytics?stat=reading&month=10&fortnight=1

// Update profile
PUT /api/users/:userId/profile
Body: { userName, language }

// Subscribe to topic
POST /api/users/:userId/subscribe
Body: { topic: "ethics-essay", action: "subscribe" }
```

---

### 📥 DOWNLOAD NOTES ENDPOINT

#### 18. Generate Daily Notes File

**Endpoint**: `GET /api/users/:userId/notes/:date`

**Parameters**:
- `userId`: Telegram user ID
- `date`: Format `YYYY-MM-DD`

**Response Headers**:
```
Content-Type: text/plain; charset=utf-8
Content-Disposition: attachment; filename="SamyakGyan_Notes_2025-10-04.txt"
```

**Backend Logic**:
1. Find all `article_id`s from:
   - `public_interactions` where `DATE(created_at) = :date`
   - `highlights` where `DATE(created_at) = :date`
   - `summaries` where `DATE(created_at) = :date`
2. For each article:
   - Fetch article details
   - Fetch highlights
   - Fetch summary
   - Check interaction statuses
3. Format as plain text (template below)

**Response Body (Plain Text)** - Complete Format with All Fields:
```
========================================
SAMYAK GYAN - DAILY NOTES
Date: October 4, 2025
========================================

[Article 1]
Title: Digital Public Infrastructure in India
Published: 2025-10-04
Source: The Hindu
Topics: #Governance #DigitalIndia
Usability: Essay + GS2

Why should I read it?
It ties digital India with delivery on the ground, showing how DPI
enables efficient governance and inclusive development through
foundational infrastructure like Aadhaar, UPI, and DigiLocker.

Status:
✓ Read: Yes
✓ Bookmarked: Yes
✓ Summary: Yes

--- MAINS QUESTIONS & HIGHLIGHTS ---

Q1: What is Digital Public Infrastructure (DPI)?
Highlights:
1. DPI refers to foundational systems like Aadhaar, UPI, DigiLocker
2. India's DPI stack is open, low-cost, scalable, and sovereign

Q2: How does DPI impact governance?
Highlights:
1. Enables direct benefit transfers reaching 50 crore citizens
2. Reduces intermediary leakages by 90%

(If question has no highlights, show question only without highlight section)

Q3: What are the challenges in DPI implementation?
(No highlights for this question)

--- PRELIMS QUESTIONS & HIGHLIGHTS ---

Q1: What is DPI?
Highlights:
1. DPI is the foundational infrastructure for digital services
2. Includes Aadhaar (identity), UPI (payments), DigiLocker (documents)

Q2: When was UPI launched in India?
Highlights:
1. UPI was launched by NPCI in 2016

(If no prelims questions exist for article, skip this section entirely)

--- MY SUMMARY ---
DPI like Aadhaar and UPI enable digital governance by providing
foundational infrastructure for direct benefit transfers, reducing
corruption and ensuring last-mile delivery of government services.

========================================

[Article 2]
Title: Renewable Energy Transition in India
Published: 2025-10-03
Source: Down To Earth
Topics: #Environment #Energy
Usability: Essay + GS3

Why should I read it?
This article examines India's renewable energy targets and the
challenges in achieving them, crucial for understanding climate
policy and sustainable development.

Status:
✓ Read: Yes
✓ Bookmarked: No
✓ Summary: No

--- MAINS QUESTIONS & HIGHLIGHTS ---

Q1: What is India's renewable energy target?
Highlights:
1. Target of 500 GW non-fossil fuel capacity by 2030
2. Currently at 180 GW as of 2025

--- PRELIMS QUESTIONS & HIGHLIGHTS ---

Q1: What is India's current renewable energy capacity?
Highlights:
1. 180 GW as of January 2025

--- MY SUMMARY ---
(No summary provided)

========================================
END OF NOTES
========================================
```

---

## 🎯 BUSINESS LOGIC

### Referral System Logic

**Trigger**: New user signs up with `referred_by_code`

**Automatic Actions**:
1. Insert into `referrals` table
2. Count total referrals for referrer
3. **If count reaches 3**:
   - Update referrer's `trial_end` = `trial_end + 15 days`
   - Set `reward_granted = TRUE` for those 3 referrals
   - Send Telegram notification to referrer

**Handle Multiple Bonuses**:
- Count resets after each reward
- User can earn unlimited extensions (3 referrals = 15 days each time)

---

### Trial & Subscription Logic

**Trial Management**:
- New user: 15 days from signup
- 3 referrals: +15 days extension
- Trial ends: Redirect to payment page

**Subscription Activation**:
- Razorpay webhook → `subscription_status = 'active'`
- Set `subscription_start` and `subscription_end`
- Trial becomes irrelevant (subscription takes precedence)

**Access Control**:
- Check: Is trial active OR subscription active?
- If both expired: Block content, show payment page

---

## 🔗 EXTERNAL INTEGRATIONS

### 1. Telegram Bot Integration

**Setup**:
1. Create bot via @BotFather
2. Get bot token
3. Configure webhook or use polling

**Message Templates**:

#### Welcome Message
```
🎉 Welcome to Samyak Gyan!

Your free 15-day trial has started.

📢 Share with friends and earn 15 extra days!
Your unique referral link:
https://[YOUR_DOMAIN_HERE]/?ref=A8x9Zw#2

✅ 3 friends sign up = 15 extra days for you!

Happy Learning! 📚
```

#### Referral Reward
```
🎊 Congratulations!

3 friends joined using your link!
You earned 15 EXTRA days of free access.

New trial end date: [DATE]

Keep sharing! 🚀
```

#### Trial Expiry Warning (3 days before)
```
⏰ Reminder: Your trial expires in 3 days

Subscribe for just ₹99/month to continue learning!

Click here: https://[YOUR_DOMAIN_HERE]/subscribe
```

---

### 2. Bhashini API (Translation)

**Purpose**: Translate English articles to Hindi

**Implementation**:
- Store English version in `articles` table
- Call Bhashini API to translate
- Store Hindi version with `language = 'hi'`
- Cache translations for performance

**API Details**: [Bhashini Documentation](https://bhashini.gov.in/)

---

### 3. Razorpay (Payment Gateway)

**Setup**:
1. Create Razorpay account
2. Get API keys (test + live)
3. Configure webhook URL

**Webhook Endpoint**: `POST /api/webhooks/razorpay`

**Event**: `subscription.charged`

**Action**:
- Update `users` table
- Set `subscription_status = 'active'`
- Record `subscription_start` and `subscription_end`
- Send confirmation to Telegram

---

## 🔒 SECURITY & COMPLIANCE

### Security Requirements

1. **Telegram Hash Verification**: Always verify `hash` parameter
2. **Rate Limiting**: 100 requests/minute per user
3. **CORS**: Enable only for your domain
4. **Input Validation**: Sanitize all user inputs
5. **HTTPS Only**: Production must use HTTPS
6. **SQL Injection Prevention**: Use parameterized queries
7. **XSS Prevention**: Escape user-generated content

### Privacy Compliance

**DPDP Act 2023 (India)** ✅
- No personal data collection (only Telegram ID)
- No tracking scripts
- No data selling
- Grievance mechanism in place

**GDPR (EU)** ✅
- Right to erasure (via Telegram profile deletion)
- Right to information (privacy policy)
- Data minimization (only essential data)

### No-GAFA Principle

**Prohibited**:
- ❌ Google Analytics
- ❌ Meta Pixel
- ❌ Amazon tracking
- ❌ Any third-party analytics

**Allowed**:
- ✅ Self-hosted analytics
- ✅ Telegram integration
- ✅ Razorpay (payment only)
- ✅ Bhashini (government service)

---

## 🚀 DEPLOYMENT REQUIREMENTS

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/samyakgyan

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_BOT_USERNAME=SamyakGyanLogin_bot

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Security
API_SECRET_KEY=random_secret_key_here
CORS_ALLOWED_ORIGIN=https://[YOUR_DOMAIN_HERE]

# Domain
DOMAIN=https://[YOUR_DOMAIN_HERE]
```

### HTTPS Setup (Required!)

**Why**: Telegram OAuth requires HTTPS

**Options**:
1. **Let's Encrypt** (Free SSL certificate)
2. **Cloudflare** (Free SSL + CDN)
3. **Hosting Provider** (Usually includes SSL)

**Setup Steps**:
1. Get domain name
2. Point domain to server IP
3. Install SSL certificate
4. Configure Telegram bot domain in @BotFather

---

## 🗳️ VOTING SYSTEM & MAGAZINE CURATION

### Overview

The Voting System allows users to vote on articles they find important. The **Top 5 most-voted articles per day** are identified and will be included in the fortnightly SG Magazine. Users can track their voting patterns in the **User Dashboard → My Voting Pattern** section.

### How Voting Works

1. **User votes** on articles via "Magazine Worthy??" button after marking as read
2. **System records** vote in `public_interactions` table with `action_type = 'magazine_worthy'`
3. **Daily Top 5** is calculated based on vote count (only articles with `is_votable = TRUE`)
4. **Dashboard displays** honeycomb layout showing dates user voted + Top 5 articles per date
5. **Magazine publication** uses Top 5 articles for condensed coverage

### Database Schema

**Table Used**: `public_interactions` (already exists - see Table 9 in Database Schema section)

**Vote Records**:
- `user_id`: Telegram user ID (who voted)
- `article_id`: Article that was voted on
- `action_type`: Must be `'magazine_worthy'` for vote records
- `created_at`: When the vote was cast (used for daily grouping)
- `UNIQUE` constraint: User can only vote once per article

**Articles Table Fields** (for voting control):
```sql
is_votable BOOLEAN DEFAULT TRUE  -- Admin can disable for editorials
total_votes INTEGER DEFAULT 0    -- Cached vote count (updated via trigger/cron)
```

### Voting Workflow

#### 1. User Clicks Vote Button (Frontend)

**File**: `scripts/buttons.js` (lines 34-44 in buttons.html)

```javascript
// When user clicks "Magazine Worthy??" button after marking article as read
voteBtn.addEventListener('click', function(e) {
  e.preventDefault();

  // Check if article is votable (editorials have is_votable = FALSE)
  if (!article.is_votable) {
    showModal('vote-editorial-disabled-info');
    return;
  }

  // Log vote interaction
  logInteraction(articleId, userId, 'magazine_worthy');

  // Visual feedback
  voteBtn.classList.add('voted');
  voteBtn.disabled = true;
});
```

#### 2. Backend Receives Vote (API)

**Endpoint**: `POST /api/articles/interact`

**Request Body**:
```json
{
  "userId": "123456789",
  "articleId": 42,
  "actionType": "magazine_worthy"
}
```

**Backend Logic**:
```javascript
app.post('/api/articles/interact', authenticateUser, async (req, res) => {
  const { userId, articleId, actionType } = req.body;

  // 1. Check if article allows voting
  const article = await db.query(
    'SELECT is_votable FROM articles WHERE article_id = $1',
    [articleId]
  );

  if (!article.rows[0]?.is_votable) {
    return res.status(403).json({ error: 'Voting disabled for this article' });
  }

  // 2. Record vote (UNIQUE constraint prevents duplicate votes)
  try {
    await db.query(`
      INSERT INTO public_interactions (user_id, article_id, action_type)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, article_id, action_type) DO NOTHING
    `, [userId, articleId, actionType]);

    // 3. Update cached vote count
    await db.query(`
      UPDATE articles
      SET total_votes = total_votes + 1
      WHERE article_id = $1
    `, [articleId]);

    res.json({ success: true, message: 'Vote recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record vote' });
  }
});
```

#### 3. Admin Disables Voting (Content Upload)

**File**: Admin panel article upload form (see docs/BACKEND_COMPLETE.md #4440-4451)

```html
<fieldset>
  <legend>Community Voting</legend>
  <label>
    <input type="checkbox" name="is_votable" value="true" checked>
    Allow community voting on this article
  </label>
  <small>
    ℹ️ Uncheck for important editorials that should ALWAYS be included in magazine.
    Editorials with voting disabled won't appear in Top 5 rankings.
  </small>
</fieldset>
```

**Backend Handler**: Sets `is_votable = FALSE` for editorials

#### 4. Dashboard Displays Voting Pattern

**Endpoint**: `GET /api/users/:userId/analytics?stat=voting&month=2025-02&fortnight=1`

**Response** (see API section above for SQL queries):
```json
{
  "success": true,
  "stat": "voting",
  "month": "2025-02",
  "fortnight": 1,
  "data": {
    "activeDates": [1, 2, 3, 4, 5],
    "votingData": {
      "1": {
        "top5": [
          { "articleId": 142, "title": "Clean Energy Mission", "votes": 520, "userVoted": true },
          { "articleId": 156, "title": "Youth Parliament", "votes": 480, "userVoted": false }
        ]
      }
    }
  }
}
```

**Frontend Rendering**: `user_dashboard_testbed.html` lines 2816-3090

- Honeycomb layout shows active voting dates
- Click date → displays Top 5 articles for that day
- Green checkmark if user voted, red X if not

### Key Business Logic

**Top 5 Calculation Rules**:
1. ✅ Only count articles where `is_votable = TRUE`
2. ✅ Calculate DAILY Top 5 (not fortnight-wide)
3. ✅ Each day's Top 5 is independent
4. ✅ Editorials never appear in Top 5 (is_votable = FALSE)

**Magazine Publication Workflow**:
1. At end of fortnight, backend generates list of all Top 5 articles across 15 days
2. Maximum 75 articles per fortnight (15 days × 5 articles)
3. These articles get condensed into Mains-ready notes
4. Published in SG Magazine PDF

### Frontend Files

- `buttons.html` (lines 32-44): Vote button with info icon
- `scripts/buttons.js`: Vote button click handler + API integration
- `user_dashboard_testbed.html` (lines 2816-3090): Voting pattern honeycomb display
- `articles.html` (lines 138-148): Vote dialog explaining system

### Testing Checklist

- [ ] Vote button disabled for editorials (is_votable = FALSE)
- [ ] Clicking vote records in public_interactions table
- [ ] Duplicate votes prevented by UNIQUE constraint
- [ ] total_votes field increments correctly
- [ ] Top 5 API excludes editorials
- [ ] Dashboard honeycomb shows correct active dates
- [ ] userVoted field accurately reflects user's vote status
- [ ] Admin panel checkbox sets is_votable correctly

---

## 📚 BOOKMARKS SYSTEM

### Overview

The Bookmarks feature allows users to save articles for later reading. Bookmarked articles are displayed in the **User Dashboard → Bookmarked Articles** section, organized by month and fortnight.

### Database Schema (ALREADY EXISTS!)

**Good News**: Bookmarks are already stored in the existing `public_interactions` table, **NO NEW TABLE NEEDED!**

Bookmarks use the same `public_interactions` table with `action_type = 'bookmark'` (see Table 9 in Database Schema section above).

**Key Fields for Bookmarks**:
- `user_id`: Telegram user ID (who bookmarked the article)
- `article_id`: The article that was bookmarked (foreign key to `articles` table)
- `action_type`: Must be `'bookmark'` for bookmark records
- `created_at`: When the bookmark was created (used for organizing by date)
- `UNIQUE` constraint: User can only bookmark each article once

### Bookmarks Data Flow

#### 1. User Clicks Bookmark Button (Frontend)

**File**: `scripts/buttons.js` (lines 200-227)

```javascript
// When user clicks bookmark button after marking article as read
bookmarkBtn.addEventListener('click', function(e) {
    // Toggle bookmarked state
    const isBookmarked = bookmarkBtn.classList.toggle('saved');
    const bookmarkText = bookmarkBtn.querySelector('span');
    if (bookmarkText) {
        bookmarkText.textContent = isBookmarked ? 'Bookmarked' : 'Bookmark';
    }

    // Save to database: action_type = 'bookmark'
    // Backend should handle toggle logic (insert if not exists, delete if exists)
    logInteraction(articleId, userId, 'bookmark');
});
```

#### 2. API Call to Backend

**Endpoint**: `POST /api/articles/interact`

**Request Body**:
```json
{
  "userId": "123456789",
  "articleId": 42,
  "actionType": "bookmark"
}
```

#### 3. Backend Processing (Toggle Logic)

```javascript
app.post('/api/articles/interact', async (req, res) => {
  const { userId, articleId, actionType } = req.body;

  // Validate action_type
  const validActions = ['read', 'magazine_worthy', 'bookmark', 'summary'];
  if (!validActions.includes(actionType)) {
    return res.status(400).json({
      success: false,
      message: `Invalid actionType. Must be one of: ${validActions.join(', ')}`
    });
  }

  try {
    // FOR BOOKMARK: Handle toggle logic
    if (actionType === 'bookmark') {
      // Check if bookmark already exists
      const existing = await db.query(
        'SELECT id FROM public_interactions WHERE user_id = $1 AND article_id = $2 AND action_type = $3',
        [userId, articleId, 'bookmark']
      );

      if (existing.rows.length > 0) {
        // Bookmark exists → REMOVE IT (user toggled off)
        await db.query(
          'DELETE FROM public_interactions WHERE user_id = $1 AND article_id = $2 AND action_type = $3',
          [userId, articleId, 'bookmark']
        );

        return res.json({
          success: true,
          message: 'Bookmark removed',
          action: 'removed'
        });
      } else {
        // Bookmark doesn't exist → ADD IT (user toggled on)
        await db.query(
          'INSERT INTO public_interactions (user_id, article_id, action_type) VALUES ($1, $2, $3)',
          [userId, articleId, 'bookmark']
        );

        return res.json({
          success: true,
          message: 'Bookmark saved',
          action: 'added'
        });
      }
    } else {
      // For other actions (read, magazine_worthy, summary): Just insert
      await db.query(
        'INSERT INTO public_interactions (user_id, article_id, action_type) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [userId, articleId, actionType]
      );

      return res.json({
        success: true,
        message: 'Interaction recorded'
      });
    }
  } catch (error) {
    console.error('Error saving interaction:', error);
    return res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
});
```

**Key Points**:
- **Toggle Logic**: If bookmark exists, DELETE it. If it doesn't exist, INSERT it.
- **Other actions** (read, vote, summary): Just INSERT (use `ON CONFLICT DO NOTHING`)
- **No separate bookmarks table needed**: Everything goes into `public_interactions`

### Bookmarks API Endpoints

#### Endpoint 1: Toggle Bookmark (Add/Remove)

**Endpoint**: `POST /api/articles/interact`

**Request Body**:
```json
{
  "userId": "123456789",
  "articleId": 42,
  "actionType": "bookmark"
}
```

**Success Response (Bookmark Added)**:
```json
{
  "success": true,
  "message": "Bookmark saved",
  "action": "added"
}
```

**Success Response (Bookmark Removed)**:
```json
{
  "success": true,
  "message": "Bookmark removed",
  "action": "removed"
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "message": "Invalid actionType. Must be one of: read, magazine_worthy, bookmark, summary"
}
```

---

#### Endpoint 2: Get User's Bookmarked Articles (Dashboard View)

**Endpoint**: `GET /api/users/:userId/bookmarks`

**Query Parameters**:
- `month` (required): Month number (1-12)
- `year` (required): Year (e.g., 2025)
- `fortnight` (required): Fortnight index (0 = 1st fortnight [1-15], 1 = 2nd fortnight [16-end])
- `language` (optional): 'en' or 'hi' (defaults to 'en')

**Example Request**:
```
GET /api/users/123456789/bookmarks?month=10&year=2025&fortnight=0&language=en
```

**Backend Logic**:

```javascript
app.get('/api/users/:userId/bookmarks', async (req, res) => {
  const { userId } = req.params;
  const { month, year, fortnight, language = 'en' } = req.query;

  // Validate inputs
  if (!month || !year || fortnight === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters: month, year, fortnight'
    });
  }

  try {
    // Calculate date range for the fortnight
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    const fortnightIndex = parseInt(fortnight);

    // Get days in month (handles leap years)
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

    // Define fortnight ranges
    const fortnightRanges = [
      { start: 1, end: 15 },                      // 1st fortnight
      { start: 16, end: daysInMonth }             // 2nd fortnight
    ];

    const range = fortnightRanges[fortnightIndex];

    // Construct start and end dates
    const startDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(range.start).padStart(2, '0')}`;
    const endDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(range.end).padStart(2, '0')}`;

    // Query: Get bookmarked articles for this fortnight
    const query = `
      SELECT
        pi.created_at,
        a.article_id,
        a.title,
        a.slug,
        a.publish_date
      FROM public_interactions pi
      JOIN articles a ON pi.article_id = a.article_id
      WHERE pi.user_id = $1
        AND pi.action_type = 'bookmark'
        AND DATE(pi.created_at) >= $2
        AND DATE(pi.created_at) <= $3
        AND a.language = $4
      ORDER BY DATE(pi.created_at) ASC
    `;

    const result = await db.query(query, [userId, startDate, endDate, language]);

    // Format response
    const bookmarks = result.rows.map(row => ({
      date: row.created_at.toISOString().split('T')[0], // YYYY-MM-DD
      articleId: row.article_id,
      title: row.title,
      slug: row.slug,
      publishDate: row.publish_date
    }));

    return res.json({
      success: true,
      bookmarks: bookmarks,
      count: bookmarks.length,
      fortnight: fortnightIndex === 0 ? '1st Fortnight' : '2nd Fortnight',
      month: monthNum,
      year: yearNum
    });

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
});
```

**Success Response**:
```json
{
  "success": true,
  "bookmarks": [
    {
      "date": "2025-10-01",
      "articleId": 42,
      "title": "Economic Survey 2024-25: Key Highlights",
      "slug": "2025-10-01/economic-survey-2024-25",
      "publishDate": "2025-10-01"
    },
    {
      "date": "2025-10-03",
      "articleId": 43,
      "title": "India-US Strategic Partnership",
      "slug": "2025-10-03/india-us-strategic-partnership",
      "publishDate": "2025-10-03"
    }
  ],
  "count": 2,
  "fortnight": "1st Fortnight",
  "month": 10,
  "year": 2025
}
```

**Empty Response**:
```json
{
  "success": true,
  "bookmarks": [],
  "count": 0,
  "fortnight": "1st Fortnight",
  "month": 10,
  "year": 2025
}
```

---

#### Endpoint 3: Check if Article is Bookmarked

**Endpoint**: `GET /api/users/:userId/bookmarks/check?articleId=42`

**Purpose**: Check if a specific article is bookmarked (to set button state on page load)

**Backend Logic**:

```javascript
app.get('/api/users/:userId/bookmarks/check', async (req, res) => {
  const { userId } = req.params;
  const { articleId } = req.query;

  if (!articleId) {
    return res.status(400).json({
      success: false,
      message: 'Missing articleId parameter'
    });
  }

  try {
    const result = await db.query(
      'SELECT id FROM public_interactions WHERE user_id = $1 AND article_id = $2 AND action_type = $3',
      [userId, articleId, 'bookmark']
    );

    return res.json({
      success: true,
      isBookmarked: result.rows.length > 0
    });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
});
```

**Success Response**:
```json
{
  "success": true,
  "isBookmarked": true
}
```

### Article Linking: Bookmarks to Articles Page

#### Current Frontend Implementation

**File**: `user_dashboard_testbed.html` (lines 1582-1711)

Bookmarked article titles are rendered as clickable links:

```javascript
// Generate bookmark link in table
html += `
  <a href="/articles/${bookmark.article_id}"
     class="bookmark-article-link"
     data-article-id="${bookmark.article_id}"
     data-article-slug="${bookmark.slug}"
     style="color: #3498db; text-decoration: none; font-weight: 600;">
    ${bookmark.title}
  </a>
`;
```

**Required Update**: Change click handler to navigate to articles page:

```javascript
// Attach event listeners for article links
document.querySelectorAll('.bookmark-article-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const articleId = this.dataset.articleId;

    // Navigate to articles page with article ID
    window.location.href = `/articles.html?id=${articleId}`;
  });
});
```

#### Articles Page Integration

**File**: `articles.html` (or backend route handler)

The articles page should support loading by ID:

```javascript
// Parse URL parameter
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('id');

if (articleId) {
  // Fetch article from backend
  fetch(`/api/articles/${articleId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        renderArticle(data.article);
      } else {
        showError('Article not found');
      }
    });
}
```

**Supported URL Formats**:
- Query parameter: `https://samyakgyan.com/articles.html?id=42`
- Clean URL (optional): `https://samyakgyan.com/articles/2025-10-01/article-slug`

### Frontend Integration Checklist

**What Frontend Already Has (Complete)**:
- ✅ Bookmark button in `scripts/buttons.js`
- ✅ Dashboard view in `user_dashboard_testbed.html`
- ✅ Month dropdown and fortnight chips
- ✅ Visual design (same as Notes Dashboard)
- ✅ Dummy data for testing

**What Backend Needs to Implement**:
- ❌ `POST /api/articles/interact` with toggle logic
- ❌ `GET /api/users/:userId/bookmarks` endpoint
- ❌ `GET /api/users/:userId/bookmarks/check` endpoint
- ❌ Articles page support for `?id=42` parameter

**Frontend Updates After Backend is Ready**:
1. Uncomment lines 24-45 in `scripts/buttons.js` (enable API calls)
2. Replace dummy data with API call in `user_dashboard_testbed.html` (lines 1617-1632)
3. Update article link handler to navigate to actual articles page (line 1691-1699)

### Security Considerations

1. **User Authentication**: Verify `userId` belongs to authenticated user
2. **SQL Injection**: Use parameterized queries (`$1`, `$2` in PostgreSQL)
3. **Rate Limiting**: Prevent bookmark toggle abuse
4. **Input Validation**: Validate `articleId`, `userId`, `month`, `year`, `fortnight`
5. **Foreign Key Constraints**: Ensure `article_id` exists before inserting bookmark

---

## 📊 READING INSIGHTS ANALYTICS

### Overview

The Reading Insights section tracks user reading behavior and provides analytics on article completion rates, unread articles, and community comparisons.

**Dashboard Location**: User Dashboard → Reading Insights

**Key Features**:
1. Completion percentage with success messages
2. Article titles as clickable hyperlinks (auto-mark as read)
3. Estimated read time display
4. Community average comparison

### Database Requirements

#### 1. Add Estimated Read Time Column

```sql
-- Add column to articles table
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS estimated_read_minutes INT;

-- Populate based on word count (200 words per minute average)
UPDATE articles
SET estimated_read_minutes = CEIL(total_word_count / 200.0);
```

#### 2. Ensure User Article Reads Tracking

The `public_interactions` table already tracks when users mark articles as "read" using `action_type = 'read'`.

**Required Indexes**:
```sql
-- Index for fortnight filtering
CREATE INDEX IF NOT EXISTS idx_public_interactions_date
ON public_interactions(user_id, action_type, created_at);

-- Index for community stats calculation
CREATE INDEX IF NOT EXISTS idx_public_interactions_stats
ON public_interactions(action_type, created_at, user_id, article_id);
```

### Reading Insights API Endpoints

#### Endpoint: Get User Reading Analytics

**Endpoint**: `GET /api/users/:userId/analytics/reading`

**Query Parameters**:
- `month`: Format "2025-10" (rolling 12-month window)
- `fortnight`: "0" (1st: days 1-15) or "1" (2nd: days 16-end)
- `language`: "en" or "hi" (optional, defaults to "en")

**Example Request**:
```
GET /api/users/123456789/analytics/reading?month=2025-10&fortnight=0&language=en
```

**Backend Logic**:

```javascript
app.get('/api/users/:userId/analytics/reading', async (req, res) => {
  const { userId } = req.params;
  const { month, fortnight, language = 'en' } = req.query;

  if (!month || fortnight === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters: month, fortnight'
    });
  }

  try {
    // Parse month (format: "2025-10")
    const [yearStr, monthStr] = month.split('-');
    const yearNum = parseInt(yearStr);
    const monthNum = parseInt(monthStr);
    const fortnightIndex = parseInt(fortnight);

    // Calculate fortnight date range
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    const fortnightRanges = [
      { start: 1, end: 15 },
      { start: 16, end: daysInMonth }
    ];
    const range = fortnightRanges[fortnightIndex];

    const startDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(range.start).padStart(2, '0')}`;
    const endDate = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(range.end).padStart(2, '0')}`;

    // Query 1: Get total published articles in this fortnight
    const publishedQuery = `
      SELECT COUNT(*) as total
      FROM articles
      WHERE language = $1
        AND publish_date >= $2
        AND publish_date <= $3
    `;
    const publishedResult = await db.query(publishedQuery, [language, startDate, endDate]);
    const totalPublished = parseInt(publishedResult.rows[0].total);

    // Query 2: Get user's read articles in this fortnight
    const readQuery = `
      SELECT COUNT(DISTINCT pi.article_id) as total
      FROM public_interactions pi
      JOIN articles a ON pi.article_id = a.article_id
      WHERE pi.user_id = $1
        AND pi.action_type = 'read'
        AND a.publish_date >= $2
        AND a.publish_date <= $3
        AND a.language = $4
    `;
    const readResult = await db.query(readQuery, [userId, startDate, endDate, language]);
    const totalRead = parseInt(readResult.rows[0].total);

    // Calculate completion percentage
    const completionPercentage = totalPublished > 0
      ? Math.round((totalRead / totalPublished) * 100)
      : 0;

    // Query 3: Get unread articles
    const unreadQuery = `
      SELECT
        a.article_id,
        a.title,
        a.slug,
        a.publish_date,
        a.estimated_read_minutes
      FROM articles a
      WHERE a.language = $1
        AND a.publish_date >= $2
        AND a.publish_date <= $3
        AND NOT EXISTS (
          SELECT 1 FROM public_interactions pi
          WHERE pi.user_id = $4
            AND pi.article_id = a.article_id
            AND pi.action_type = 'read'
        )
      ORDER BY a.publish_date ASC
    `;
    const unreadResult = await db.query(unreadQuery, [language, startDate, endDate, userId]);

    // Query 4: Calculate community average
    const communityQuery = `
      SELECT AVG(user_completion) as community_avg
      FROM (
        SELECT
          pi.user_id,
          (COUNT(DISTINCT pi.article_id)::FLOAT / $1::FLOAT * 100) as user_completion
        FROM public_interactions pi
        JOIN articles a ON pi.article_id = a.article_id
        WHERE pi.action_type = 'read'
          AND a.publish_date >= $2
          AND a.publish_date <= $3
          AND a.language = $4
        GROUP BY pi.user_id
      ) AS user_stats
    `;
    const communityResult = await db.query(communityQuery, [totalPublished, startDate, endDate, language]);
    const communityAvg = communityResult.rows[0].community_avg
      ? Math.round(parseFloat(communityResult.rows[0].community_avg))
      : 0;

    // Format unread articles
    const unreadArticles = unreadResult.rows.map(row => ({
      article_id: row.article_id,
      title: row.title,
      slug: row.slug,
      publish_date: row.publish_date,
      estimated_read_minutes: row.estimated_read_minutes || 5
    }));

    return res.json({
      success: true,
      total_published: totalPublished,
      total_read: totalRead,
      completion_percentage: completionPercentage,
      unread_articles: unreadArticles,
      community_stats: {
        average_completion_percentage: communityAvg
      }
    });

  } catch (error) {
    console.error('Error fetching reading analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
});
```

**Success Response**:
```json
{
  "success": true,
  "total_published": 25,
  "total_read": 18,
  "completion_percentage": 72,
  "unread_articles": [
    {
      "article_id": 123,
      "title": "India's Semiconductor Policy: Challenges Ahead",
      "slug": "india-semiconductor-policy-2025",
      "publish_date": "2025-10-12",
      "estimated_read_minutes": 8
    },
    {
      "article_id": 124,
      "title": "Supreme Court Verdict on Article 370: Analysis",
      "slug": "supreme-court-article-370-analysis",
      "publish_date": "2025-10-14",
      "estimated_read_minutes": 12
    }
  ],
  "community_stats": {
    "average_completion_percentage": 45
  }
}
```

---

#### Endpoint: Mark Article as Read

**Endpoint**: `POST /api/users/:userId/articles/:articleId/mark-read`

**Purpose**: Mark article as read when user clicks article link from Reading Insights

**Request Body**: None required

**Backend Logic**:

```javascript
app.post('/api/users/:userId/articles/:articleId/mark-read', async (req, res) => {
  const { userId, articleId } = req.params;

  try {
    // Insert read interaction (use ON CONFLICT to prevent duplicates)
    await db.query(
      `INSERT INTO public_interactions (user_id, article_id, action_type)
       VALUES ($1, $2, 'read')
       ON CONFLICT (user_id, article_id, action_type) DO NOTHING`,
      [userId, articleId]
    );

    return res.json({
      success: true,
      article_id: parseInt(articleId),
      read_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error marking article as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }
});
```

**Success Response**:
```json
{
  "success": true,
  "article_id": 123,
  "read_at": "2025-10-14T10:30:00Z"
}
```

### Frontend Display Requirements

#### 1. Percentage Display with Completion Threshold

**Current State**: `18 / 25 Articles Read`

**Required State**: `18 / 25 Articles Read (72%)`

**Success Message (>80% Completion)**:
```
"Hats off to your endeavor! Hope Samyak Gyan aids in the Endeavor"
```

**Implementation**:
```javascript
const completionPercentage = Math.round((totalRead / totalPublished) * 100);
const displayText = `${totalRead} / ${totalPublished} Articles Read (${completionPercentage}%)`;

if (completionPercentage > 80) {
  showMessage("Hats off to your endeavor! Hope Samyak Gyan aids in the Endeavor");
}
```

---

#### 2. Article Titles as Hyperlinks with Zero-Friction Navigation

**Requirements**:
- Real article titles (not generic)
- Clickable hyperlinks
- Opens article in **new tab**
- Auto-marks article as **read** when clicked
- **Auto-scrolls** to specific article (if multiple published same day)
- **Auto-expands** article content (clicks arrow automatically)
- **Zero friction** reading experience

**URL Format**:
```
/articles.html?id=123&autoScroll=true&autoExpand=true
```

**Frontend Implementation (Reading Insights Dashboard)**:
```javascript
unreadArticles.forEach(article => {
  const link = document.createElement('a');
  link.href = `/articles.html?id=${article.article_id}&autoScroll=true&autoExpand=true`;
  link.target = '_blank'; // Open in new tab
  link.textContent = article.title;

  link.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      // Step 1: Mark as read immediately
      await fetch(`/api/users/${userId}/articles/${article.article_id}/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Step 2: Open article in new tab with auto-scroll and auto-expand
      window.open(link.href, '_blank');

      // Step 3: Refresh reading insights data (optional, async)
      setTimeout(() => loadReadingInsights(), 500);

    } catch (error) {
      console.error('Error marking article as read:', error);
      // Still open article even if mark-as-read fails
      window.open(link.href, '_blank');
    }
  });
});
```

**Frontend Implementation (articles.html page)**:
```javascript
// Add this to articles.html page load
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const autoScroll = urlParams.get('autoScroll') === 'true';
  const autoExpand = urlParams.get('autoExpand') === 'true';

  if (articleId && autoScroll) {
    // Find the article element by ID
    const articleElement = document.querySelector(`[data-article-id="${articleId}"]`);

    if (articleElement) {
      // Auto-scroll to the article
      setTimeout(() => {
        articleElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Highlight article briefly for visual feedback
        articleElement.style.backgroundColor = '#fff3cd';
        setTimeout(() => {
          articleElement.style.backgroundColor = '';
        }, 2000);

      }, 300);

      // Auto-expand article content (click the arrow/expand button)
      if (autoExpand) {
        setTimeout(() => {
          const expandButton = articleElement.querySelector('.expand-arrow, .read-more-btn');
          if (expandButton && !expandButton.classList.contains('expanded')) {
            expandButton.click();
          }
        }, 800);
      }
    }
  }
});
```

**Benefits**:
1. **Zero friction**: User clicks → article opens → content visible (no additional clicks)
2. **Precise navigation**: Scrolls to exact article even if 10 articles published same day
3. **Auto-expand**: Content immediately readable (no need to find/click arrow)
4. **Immediate tracking**: Article marked as read before navigation
5. **New tab**: Doesn't lose Reading Insights context

---

#### 3. Estimated Read Time Display

**Display Format**: `[Article Title] · ~8 min read`

**Frontend Implementation**:
```javascript
const displayTitle = `${article.title} · ~${article.estimated_read_minutes} min read`;
```

---

#### 4. Community Average Comparison

**Display Format**: `You: 72% | Community Avg: 45%`

**Success Message (≥50% Read)**:
```
"You are truly a reader!! Hope Samyak Gyan helps in broadening the Knowledge"
```

**Frontend Implementation**:
```javascript
const comparisonText = `You: ${userPercentage}% | Community Avg: ${communityAvg}%`;

if (userPercentage >= 50) {
  showMessage("You are truly a reader!! Hope Samyak Gyan helps in broadening the Knowledge");
}
```

---

#### 5. Empty State Messages

**When All Articles Read**:
```
🎉 All caught up! You've read everything published this fortnight
```

**Implementation**:
```javascript
if (unreadArticles.length === 0 && totalPublished > 0) {
  showEmptyState("🎉 All caught up! You've read everything published this fortnight");
}
```

### Success Messages - Complete List

1. **High Completion Rate (>80%)**:
   - Message: "Hats off to your endeavor! Hope Samyak Gyan aids in the Endeavor"
   - Trigger: `completion_percentage > 80`

2. **Active Reader (≥50%)**:
   - Message: "You are truly a reader!! Hope Samyak Gyan helps in broadening the Knowledge"
   - Trigger: `completion_percentage >= 50`

3. **All Caught Up**:
   - Message: "🎉 All caught up! You've read everything published this fortnight"
   - Trigger: `unread_articles.length === 0 AND total_published > 0`

### Testing Checklist

**Backend Testing**:
- [ ] `estimated_read_minutes` calculated correctly (word_count / 200)
- [ ] Fortnight date range calculation handles leap years
- [ ] Community average calculation excludes users with 0 reads
- [ ] Unread articles query excludes read articles correctly
- [ ] Mark-as-read endpoint prevents duplicates
- [ ] API returns proper error codes

**Frontend Testing**:
- [ ] Percentage displays correctly: "18 / 25 (72%)"
- [ ] Community comparison shows: "You: 72% | Community Avg: 45%"
- [ ] Article titles are clickable and open in new tab
- [ ] Clicking article marks it as read and updates dashboard
- [ ] Success message appears when completion > 80%
- [ ] Reader encouragement appears when completion ≥ 50%
- [ ] Empty state appears when all articles read

---

## 📊 TESTING CHECKLIST

### Core Features Testing

**Backend Developer Must Test**:

- [ ] Telegram hash verification works
- [ ] Duplicate user registration is handled
- [ ] Referral code is always unique (8 characters)
- [ ] 20% highlight limit is enforced correctly
- [ ] Telegram bot messages are sent
- [ ] Date filtering works for notes download
- [ ] Trial expiry calculation is accurate
- [ ] Public interaction counts are correct
- [ ] API returns proper error codes (400, 401, 404, 500)
- [ ] All endpoints return consistent JSON format
- [ ] CORS is configured correctly
- [ ] Rate limiting works
- [ ] SQL injection is prevented
- [ ] HTTPS redirects HTTP

### Bookmarks System Testing

**Backend Testing**:
- [ ] Bookmark toggle (add/remove) works correctly
- [ ] Bookmark DELETE when exists, INSERT when doesn't exist
- [ ] `GET /api/users/:userId/bookmarks` returns correct fortnight data
- [ ] Fortnight calculation handles leap years (Feb has 29 days in 2024)
- [ ] Empty fortnights return empty array (not error)
- [ ] `GET /api/users/:userId/bookmarks/check` returns boolean correctly
- [ ] Foreign key constraint prevents bookmarking non-existent articles
- [ ] Rate limiting prevents bookmark toggle spam

**Frontend Testing**:
- [ ] Bookmark button toggles state (Bookmark ↔ Bookmarked)
- [ ] Bookmarked articles appear in dashboard by month/fortnight
- [ ] Empty fortnights show "No bookmarked articles" message
- [ ] Month dropdown switches bookmarks correctly
- [ ] Fortnight chips toggle between 1st and 2nd fortnight
- [ ] Clicking bookmark title navigates to articles page
- [ ] Articles page loads correctly from URL `?id=42`

### Reading Insights Analytics Testing

**Backend Testing**:
- [ ] `estimated_read_minutes` calculated correctly (word_count / 200)
- [ ] Fortnight date range calculation handles different month lengths
- [ ] Community average excludes users with 0 reads
- [ ] Unread articles query excludes already-read articles
- [ ] `POST /api/users/:userId/articles/:articleId/mark-read` prevents duplicates
- [ ] Community average calculation performs well with large datasets
- [ ] Completion percentage rounds correctly (no decimals)

**Frontend Testing**:
- [ ] Percentage displays: "18 / 25 Articles Read (72%)"
- [ ] Community comparison: "You: 72% | Community Avg: 45%"
- [ ] Article titles are clickable hyperlinks
- [ ] Clicking article opens in new tab
- [ ] Clicking article marks it as read automatically
- [ ] Unread list updates after marking article as read
- [ ] Success message appears when completion > 80%
- [ ] Reader encouragement appears when completion ≥ 50%
- [ ] Empty state: "🎉 All caught up!" when all articles read
- [ ] Estimated read time displays: "~8 min read"

---

## ⏱️ TIME SPENT ANALYTICS

### 🎯 OVERVIEW

**Purpose:** Track and visualize user engagement across the platform to help users monitor their learning consistency.

**Key Features:**
- Privacy-first tracking (no URLs logged, no granular event data)
- Self-comparison only (no community benchmarks)
- Universal tracking across all pages
- Idle detection (pauses when user inactive)
- Midnight session splitting (automatic daily snapshots)
- Line + dot hybrid visualization with mesh background

**Privacy Philosophy:**
- Only track **total time per day** (no page-level data)
- No third-party analytics (GAFA-free)
- User can view their own data only
- Optional opt-out toggle (Phase 2)

---

### 📊 DATABASE SCHEMA

#### Table: `daily_time_spent`

```sql
CREATE TABLE IF NOT EXISTS daily_time_spent (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  total_time_seconds INT DEFAULT 0,
  is_frozen BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes for performance
CREATE INDEX idx_daily_time_spent_user_date ON daily_time_spent(user_id, date);
CREATE INDEX idx_daily_time_spent_frozen ON daily_time_spent(user_id, date) WHERE is_frozen = FALSE;
```

**Field Descriptions:**
- `user_id`: Telegram user ID (TEXT, matches users table)
- `date`: Date in YYYY-MM-DD format (DATE)
- `total_time_seconds`: Accumulated time in seconds for that day (INT)
- `is_frozen`: TRUE once day is complete (prevents further updates) (BOOLEAN)
- `last_updated`: Timestamp of last update (TIMESTAMP)

**Unique Constraint:** `(user_id, date)` ensures one row per user per day

---

### 🔌 API ENDPOINTS

#### 1. Track Engagement (UPSERT)

**Endpoint:** `POST /api/track-engagement`

**Purpose:** Receives time spent data from frontend and merges with existing data

**Request Body:**
```json
{
  "userId": "123456789",
  "date": "2025-02-15",
  "timeSpentSeconds": 3600
}
```

**Backend Logic:**
```javascript
// Pseudocode
async function trackEngagement(req, res) {
  const { userId, date, timeSpentSeconds } = req.body;

  // Validate input
  if (!userId || !date || timeSpentSeconds === undefined) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields"
    });
  }

  // UPSERT pattern (merge with existing data)
  const result = await db.query(`
    INSERT INTO daily_time_spent (user_id, date, total_time_seconds, last_updated)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (user_id, date)
    DO UPDATE SET
      total_time_seconds = daily_time_spent.total_time_seconds + EXCLUDED.total_time_seconds,
      last_updated = NOW()
    WHERE daily_time_spent.is_frozen = FALSE
    RETURNING total_time_seconds
  `, [userId, date, timeSpentSeconds]);

  // Return updated total
  return res.json({
    success: true,
    date: date,
    totalSeconds: result.rows[0]?.total_time_seconds || timeSpentSeconds
  });
}
```

**Key Points:**
- Use `ON CONFLICT ... DO UPDATE` to merge data (UPSERT)
- Only update if `is_frozen = FALSE` (don't update past days)
- Return updated `totalSeconds` so frontend can sync
- Accept small inaccuracies for multi-device users (<1% cases)

**Response:**
```json
{
  "success": true,
  "date": "2025-02-15",
  "totalSeconds": 7200
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid date format"
}
```

---

#### 2. Get Time Spent Analytics

**Endpoint:** `GET /api/users/:userId/analytics?stat=time&month=YYYY-MM&fortnight=1`

**Purpose:** Returns time spent data for dashboard visualization

**Query Parameters:**
- `stat=time` (required): Identifies this as time spent request
- `month=YYYY-MM` (required): Month in YYYY-MM format (e.g., "2025-02")
- `fortnight=1|2` (required): 1 = days 1-15, 2 = days 16-end

**Example Request:**
```
GET /api/users/123456789/analytics?stat=time&month=2025-02&fortnight=1
```

**Backend Logic:**
```javascript
async function getTimeSpentAnalytics(req, res) {
  const { userId } = req.params;
  const { month, fortnight } = req.query;

  // Parse month and determine date range
  const [year, monthNum] = month.split('-').map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  let startDay, endDay;
  if (fortnight === '1') {
    startDay = 1;
    endDay = 15;
  } else {
    startDay = 16;
    endDay = daysInMonth;
  }

  const startDate = `${year}-${monthNum.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;
  const endDate = `${year}-${monthNum.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`;

  // Fetch data from database
  const result = await db.query(`
    SELECT
      EXTRACT(DAY FROM date) AS day,
      ROUND(total_time_seconds / 60.0) AS minutes
    FROM daily_time_spent
    WHERE user_id = $1
      AND date >= $2
      AND date <= $3
    ORDER BY date ASC
  `, [userId, startDate, endDate]);

  // Fill missing days with 0 minutes
  const dataMap = {};
  result.rows.forEach(row => {
    dataMap[row.day] = row.minutes;
  });

  const days = [];
  for (let day = startDay; day <= endDay; day++) {
    days.push({
      day: day,
      minutes: dataMap[day] || 0
    });
  }

  // Calculate statistics
  const totalMinutes = days.reduce((sum, d) => sum + d.minutes, 0);
  const activeDays = days.filter(d => d.minutes > 0).length;

  // Calculate longest streak
  let longestStreak = 0;
  let currentStreak = 0;
  days.forEach(d => {
    if (d.minutes > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  // Check if fortnight is frozen (all days in the past)
  const today = new Date();
  const lastDayOfFortnight = new Date(year, monthNum - 1, endDay);
  const isFrozen = lastDayOfFortnight < today;

  return res.json({
    success: true,
    stat: "time",
    month: month,
    fortnight: parseInt(fortnight),
    data: {
      days: days,
      isFrozen: isFrozen,
      totalMinutes: totalMinutes,
      activeDays: activeDays,
      longestStreak: longestStreak
    }
  });
}
```

**Response Format:**
```json
{
  "success": true,
  "stat": "time",
  "month": "2025-02",
  "fortnight": 1,
  "data": {
    "days": [
      { "day": 1, "minutes": 125 },
      { "day": 2, "minutes": 98 },
      { "day": 3, "minutes": 142 },
      { "day": 4, "minutes": 88 },
      { "day": 5, "minutes": 0 },
      ...
    ],
    "isFrozen": true,
    "totalMinutes": 1814,
    "activeDays": 14,
    "longestStreak": 7
  }
}
```

**Field Descriptions:**
- `days`: Array of all days in fortnight with time spent (minutes)
- `isFrozen`: TRUE if fortnight is complete (all dates in past), FALSE if ongoing
- `totalMinutes`: Sum of all minutes in fortnight
- `activeDays`: Number of days with minutes > 0
- `longestStreak`: Longest consecutive days with activity

---

### ⚙️ CRON JOBS

#### 1. Daily Snapshot (11:59 PM)

**Purpose:** Freeze yesterday's data to prevent further updates

**Schedule:** Every day at 11:59 PM server time

**Logic:**
```javascript
// Run at 23:59 every day
const cronJob = schedule.scheduleJob('59 23 * * *', async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split('T')[0];

  await db.query(`
    UPDATE daily_time_spent
    SET is_frozen = TRUE
    WHERE date = $1
      AND is_frozen = FALSE
  `, [yesterdayDate]);

  console.log(`[Cron] Froze time spent data for ${yesterdayDate}`);
});
```

**Why This Matters:**
- Prevents users from retroactively updating past days
- Ensures historical data integrity
- Improves dashboard performance (no need to check date boundaries)

---

#### 2. Fortnight Snapshot (Optional - Phase 2)

**Purpose:** Pre-aggregate fortnight statistics for faster dashboard loads

**Schedule:** Runs on 1st and 16th of each month at midnight

**Logic:**
```javascript
// Run at midnight on 1st and 16th of every month
const fortnightCron = schedule.scheduleJob('0 0 1,16 * *', async () => {
  // Pre-calculate fortnight stats for all users
  // Store in `fortnight_stats` table (optional optimization)
  console.log('[Cron] Calculating fortnight stats...');
});
```

**Note:** This is optional. Dashboard API can calculate on-demand initially.

---

### 🎨 FRONTEND INTEGRATION

#### Universal Tracking Script

**File:** `scripts/engagement-tracker.js`

**Include on ALL pages:**
```html
<!-- Include AFTER user authentication check -->
<script src="/scripts/engagement-tracker.js"></script>
```

**Pages to Include:**
- homepage.html
- articles.html
- ethics_essays_poll.html
- user_dashboard_testbed.html
- profile.html
- landing.html

**How It Works:**
1. Script detects user ID from page context (`DEMO_USER.user_id` or `window.currentUserId`)
2. Starts tracking immediately on page load
3. Pauses when user idle (100s desktop, 130s mobile)
4. Saves to localStorage every 30 seconds
5. Sends to API every 6 hours + on page unload
6. Checks for midnight every 60 seconds (splits sessions)

**Event Listeners:**
- `mousemove`, `keydown`, `scroll` (throttled to 100ms)
- `touchstart`, `touchmove`, `touchend` (mobile)
- `visibilitychange` (tab switching)
- `beforeunload` (page close/refresh)

**localStorage Structure:**
```json
{
  "date": "2025-02-15",
  "startTime": 1708012800000,
  "accumulatedSeconds": 3600,
  "lastActive": 1708016400000,
  "lastSendTime": 1708014000000
}
```

---

#### Dashboard Visualization

**File:** `user_dashboard_testbed.html`

**Visualization Type:** Line + dot hybrid with D3.js

**Design Elements:**
- **Mesh Background:** 20px grid, 0.14 opacity, black color
- **Colors:**
  - Orange (#fc7306): Above average days
  - Blue (#3b82f6): Below average days
  - Gray (#6b7280): Average line (dotted)
- **Y-axis:** Dynamic scaling (starts below minimum, not at zero)
- **X-axis:** All days labeled (1, 2, 3, ..., 15 or 16-31)
- **Tooltip:** Color-matched to dot, shows date + minutes
- **Legend:** Horizontal layout (Below Avg, Above Avg, Average line)

**Stats Panel (Top):**
- **Total Time:** "30 hrs 14 min"
- **Active Days:** "14/15"
- **Longest Streak:** "7 days"

**Privacy Notice:**
- Only shown if `isFrozen = false` (ongoing fortnight)
- Text: "ℹ️ Approximate Data. Data might change if Ongoing fortnight/Month."

**Empty State:**
- Shown when no data exists for fortnight
- Message: "No Data Available. Start exploring articles to see your engagement analytics!"

---

### 🔒 PRIVACY & SECURITY

**What We Track:**
- ✅ Total time spent per day (seconds)
- ✅ Date of activity (YYYY-MM-DD)

**What We DON'T Track:**
- ❌ Page URLs visited
- ❌ Mouse coordinates / click positions
- ❌ Scroll depth per article
- ❌ Section-level engagement
- ❌ IP addresses (beyond rate limiting)
- ❌ Third-party analytics (Google, Facebook, etc.)

**Security Measures:**
- Rate limiting on API endpoint (max 10 requests/minute per user)
- Input validation (date format, seconds range)
- SQL injection prevention (parameterized queries)
- CORS restrictions (only allow your domain)
- HTTPS only (no HTTP tracking)

**GDPR Compliance:**
- User owns their data (can request deletion)
- No data sharing with third parties
- Opt-out toggle (Phase 2 feature)
- Clear privacy notice in dashboard

---

### 📊 TESTING CHECKLIST

**Backend Testing:**
- [ ] `POST /api/track-engagement` accepts valid data
- [ ] UPSERT merges data correctly (no duplicates)
- [ ] `is_frozen = TRUE` prevents updates to past days
- [ ] `GET /api/users/:userId/analytics?stat=time` returns correct fortnight data
- [ ] Fortnight calculation handles Feb (28/29 days), 30-day, 31-day months
- [ ] Ongoing fortnight returns `isFrozen: false`
- [ ] Past fortnight returns `isFrozen: true`
- [ ] Longest streak calculation handles zero days correctly
- [ ] Empty fortnights return all days with 0 minutes (not error)
- [ ] Cron job runs at 11:59 PM and freezes yesterday's data
- [ ] Rate limiting prevents API spam
- [ ] Invalid date formats return 400 error

**Frontend Testing:**
- [ ] `engagement-tracker.js` loads on all pages
- [ ] Script detects user ID from `DEMO_USER` or `window.currentUserId`
- [ ] Timer starts on page load
- [ ] Timer pauses when user idle (100s desktop, 130s mobile)
- [ ] Timer resumes when user returns from idle
- [ ] localStorage persists session across page refreshes
- [ ] Data sends to API every 6 hours automatically
- [ ] Data sends on page unload (`beforeunload` event)
- [ ] Midnight check detects date change (every 60s)
- [ ] Yesterday's data sent automatically at midnight
- [ ] New session starts after midnight with 0 seconds
- [ ] Dashboard loads Time Spent visualization correctly
- [ ] All 5 fortnight scenarios render (Feb 28-day, 30-day, 31-day, ongoing, 1st fortnight)
- [ ] Stats panel shows correct Total Time, Active Days, Longest Streak
- [ ] Graph renders with mesh background, orange/blue dots, average line
- [ ] Tooltip shows correct date and minutes on hover
- [ ] Legend displays correctly (horizontal layout)
- [ ] Privacy notice appears only for ongoing fortnights
- [ ] Empty state appears when no data exists
- [ ] Month dropdown switches fortnights correctly
- [ ] Fortnight chips toggle between 1st and 2nd

**Performance Testing:**
- [ ] API responds in < 200ms for analytics endpoint
- [ ] localStorage size stays < 1KB per user
- [ ] Throttled events (scroll, mousemove) don't cause lag
- [ ] D3.js chart renders in < 500ms
- [ ] No memory leaks after long sessions (4+ hours)

**Edge Cases:**
- [ ] Leap year (Feb 29) handled correctly in fortnight calculation
- [ ] Multi-device usage accepted (small data inaccuracy OK)
- [ ] Session spanning midnight splits correctly into two days
- [ ] User closes browser mid-session (data saved via `beforeunload`)
- [ ] Network error during API send (data retained in localStorage for retry)
- [ ] Very long sessions (8+ hours) tracked accurately
- [ ] User switches tabs frequently (visibilitychange events work)
- [ ] Mobile device rotation detected (touch events continue working)

---

## 🗳️ TRACKING PREFERENCE POLL

### 🎯 OVERVIEW

**Purpose:** Allow users to vote on whether Samyak Gyan should continue tracking time spent or disable tracking entirely.

**Key Features:**
- Binary choice poll (YES, DO NOT TRACK vs Continue TO TRACK)
- One vote per user (tied to Telegram user_id)
- Real-time vote count display
- Progress bar showing votes towards 10,000 goal
- Displayed only in Time Spent Analytics dashboard

**Business Decision:** If 10,000 votes are collected and majority votes "DO NOT TRACK", tracking feature will be disabled.

---

### 📊 DATABASE SCHEMA

#### Table: `tracking_poll_votes`

```sql
CREATE TABLE IF NOT EXISTS tracking_poll_votes (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  vote_choice TEXT CHECK(vote_choice IN ('no_track', 'continue_track')) NOT NULL,
  voted_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_tracking_poll_user ON tracking_poll_votes(user_id);
CREATE INDEX idx_tracking_poll_choice ON tracking_poll_votes(vote_choice);
```

**Field Descriptions:**
- `user_id`: Telegram user ID (TEXT, unique - one vote per user)
- `vote_choice`: User's choice (`'no_track'` or `'continue_track'`)
- `voted_at`: Timestamp of when vote was cast

**Unique Constraint:** `user_id` ensures one vote per user (no duplicate voting)

---

### 🔌 API ENDPOINTS

#### 1. Get Poll Results

**Endpoint:** `GET /api/poll/tracking-preference`

**Purpose:** Returns current poll vote counts and user's voting status

**Query Parameters:** None (user identified via session/auth)

**Backend Logic:**
```javascript
async function getTrackingPollResults(req, res) {
  const userId = req.session.userId || req.query.userId; // Get from session/auth

  // Get vote counts
  const noTrackCount = await db.query(`
    SELECT COUNT(*) as count
    FROM tracking_poll_votes
    WHERE vote_choice = 'no_track'
  `);

  const continueTrackCount = await db.query(`
    SELECT COUNT(*) as count
    FROM tracking_poll_votes
    WHERE vote_choice = 'continue_track'
  `);

  // Check if user has voted
  const userVote = await db.query(`
    SELECT vote_choice
    FROM tracking_poll_votes
    WHERE user_id = $1
  `, [userId]);

  return res.json({
    success: true,
    noTrack: parseInt(noTrackCount.rows[0].count),
    continueTrack: parseInt(continueTrackCount.rows[0].count),
    userVoted: userVote.rows.length > 0 ? userVote.rows[0].vote_choice : null
  });
}
```

**Response Format:**
```json
{
  "success": true,
  "noTrack": 1247,
  "continueTrack": 5823,
  "userVoted": null
}
```

**Field Descriptions:**
- `noTrack`: Number of votes for "YES, DO NOT TRACK"
- `continueTrack`: Number of votes for "Continue TO TRACK"
- `userVoted`: `null` (not voted) | `"no_track"` | `"continue_track"`

---

#### 2. Cast Vote

**Endpoint:** `POST /api/poll/tracking-preference/vote`

**Purpose:** Records user's vote (one vote per user)

**Request Body:**
```json
{
  "userId": "123456789",
  "vote": "no_track"
}
```

**Backend Logic:**
```javascript
async function castTrackingPollVote(req, res) {
  const { userId, vote } = req.body;

  // Validate input
  if (!userId || !vote) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields"
    });
  }

  if (vote !== 'no_track' && vote !== 'continue_track') {
    return res.status(400).json({
      success: false,
      error: "Invalid vote choice"
    });
  }

  // Check if user has already voted
  const existingVote = await db.query(`
    SELECT id FROM tracking_poll_votes
    WHERE user_id = $1
  `, [userId]);

  if (existingVote.rows.length > 0) {
    return res.status(400).json({
      success: false,
      error: "User has already voted"
    });
  }

  // Insert vote
  await db.query(`
    INSERT INTO tracking_poll_votes (user_id, vote_choice)
    VALUES ($1, $2)
  `, [userId, vote]);

  // Get updated counts
  const noTrackCount = await db.query(`
    SELECT COUNT(*) as count
    FROM tracking_poll_votes
    WHERE vote_choice = 'no_track'
  `);

  const continueTrackCount = await db.query(`
    SELECT COUNT(*) as count
    FROM tracking_poll_votes
    WHERE vote_choice = 'continue_track'
  `);

  return res.json({
    success: true,
    message: "Vote recorded successfully",
    noTrack: parseInt(noTrackCount.rows[0].count),
    continueTrack: parseInt(continueTrackCount.rows[0].count),
    userVoted: vote
  });
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "noTrack": 1248,
  "continueTrack": 5823,
  "userVoted": "no_track"
}
```

**Response (Already Voted):**
```json
{
  "success": false,
  "error": "User has already voted"
}
```

---

### 🎨 FRONTEND INTEGRATION

**Location:** `user_dashboard_testbed.html` - Time Spent Analytics section

**Components:**

1. **Privacy Policy Dropdown** (collapsible)
   - Explains tracking policy
   - Lists what is NOT tracked (GAFA-free)
   - Clarifies data storage (Telegram user_id only)

2. **Poll Interface**
   - Title: "We are adding this Poll. Please Vote if You Care"
   - Question: "Do you want Samyak Gyan to NOT TRACK your usage (Time Spent)?"
   - Two buttons:
     - Red button: "YES, DO NOT TRACK"
     - Green button: "Continue TO TRACK my usage (Time Spent)"

3. **Real-time Results Display**
   - Vote counts for each option
   - Progress bar (towards 10,000 votes)
   - Total votes count
   - Footer: "*10,000 Votes required for Samyak Gyan"

4. **Voting Logic**
   - User can vote only once
   - After voting, buttons are disabled
   - Voted button shows active state (colored background)
   - Vote stored in localStorage + backend

---

### 📊 TESTING CHECKLIST

**Backend Testing:**
- [ ] `GET /api/poll/tracking-preference` returns correct vote counts
- [ ] `POST /api/poll/tracking-preference/vote` accepts valid votes
- [ ] Duplicate voting is prevented (unique user_id constraint)
- [ ] Invalid vote choices are rejected (not 'no_track' or 'continue_track')
- [ ] Vote counts update correctly after each vote
- [ ] User's voting status is returned correctly
- [ ] Rate limiting prevents vote spam

**Frontend Testing:**
- [ ] Poll loads with current vote counts on page load
- [ ] Privacy policy dropdown opens/closes correctly
- [ ] Arrow rotates when dropdown is toggled
- [ ] Vote buttons are clickable when user hasn't voted
- [ ] Clicking "YES, DO NOT TRACK" records vote and disables buttons
- [ ] Clicking "Continue TO TRACK" records vote and disables buttons
- [ ] Voted button shows colored background (red/green)
- [ ] Progress bar updates correctly after vote
- [ ] Total vote count displays with comma separators (1,247 not 1247)
- [ ] Progress bar reaches 100% at 10,000 votes
- [ ] "Already voted" alert appears if user tries to vote twice
- [ ] localStorage persists vote across page refreshes

**Edge Cases:**
- [ ] User tries to vote twice (alert + API rejection)
- [ ] User votes, refreshes page (vote state persists)
- [ ] Multiple users vote simultaneously (no race conditions)
- [ ] Poll reaches 10,000 votes (UI shows completion)
- [ ] Network error during vote (user can retry)

---

### 🔐 SECURITY & PRIVACY

**Voting Security:**
- One vote per Telegram user_id (enforced by database unique constraint)
- No IP-based voting (would violate privacy)
- Votes are anonymous (only user_id stored, no personal data)
- No vote changing (once voted, decision is final)

**Data Retention:**
- Votes stored indefinitely for decision-making
- No personal information stored (only Telegram user_id)
- User can request vote deletion (GDPR compliance)

**Business Logic:**
- If 10,000 votes collected AND majority votes "NO TRACK":
  - Disable tracking feature platform-wide
  - Remove `engagement-tracker.js` from all pages
  - Display notice: "Tracking disabled by community vote"
- If majority votes "Continue TRACK":
  - Keep tracking feature enabled
  - Thank users for participation

---

## 🔍 SEO OPTIMIZATION & SERVER-SIDE RENDERING

### 🎯 CRITICAL REQUIREMENT

**WHY THIS MATTERS:**
Google's crawler (Googlebot) fetches HTML directly from your server. If your content is only rendered by client-side JavaScript, Google will see empty `<div>` containers and **will NOT index your articles properly**.

**CURRENT PROBLEM:**
```html
<!-- What Google crawler sees NOW (client-side JavaScript rendering): -->
<div id="articles-container"></div>
<!-- EMPTY! No content for Google to index ❌ -->
```

**REQUIRED SOLUTION:**
```html
<!-- What Google crawler MUST see (server-side rendering): -->
<div id="articles-container">
  <div class="article-tile">
    <h2 class="article-title">Digital Public Infrastructure in India</h2>
    <div class="tags">#Governance #DigitalIndia #CurrentAffairs</div>
    <div class="publish_date">18 July 2025</div>
    <div class="content-area">
      <span class="question">✦ What is Digital Public Infrastructure (DPI)?</span>
      <p class="answer">DPI refers to foundational systems like Aadhaar, UPI...</p>
    </div>
  </div>
</div>
<!-- COMPLETE CONTENT! Google can index everything ✅ -->
```

---

### 📊 TWO-LAYER RENDERING ARCHITECTURE

Your backend MUST implement **Server-Side Rendering (SSR)** while keeping the existing frontend JavaScript for interactivity.

#### **Layer 1: Server-Side Rendering (For SEO)**

**What the server does:**
1. Receives request: `GET /2025-10-18/india-semiconductor-policy`
2. Queries database for article data
3. Generates complete HTML with all content populated
4. Sends fully-rendered HTML to browser
5. Google crawler sees complete content ✅

**Example Backend Code (Node.js + EJS):**

```javascript
// Backend Route: /upsc-current-affairs/YYYY-MM-DD/:article-slug
app.get('/upsc-current-affairs/:date/:slug', async (req, res) => {
  const { date, slug } = req.params;

  // 1. Query database for article
  const article = await db.query(`
    SELECT a.*,
           array_agg(json_build_object(
             'question', q.question_text,
             'answer', q.answer_text
           )) as content
    FROM articles a
    LEFT JOIN article_questions q ON a.id = q.article_id
    WHERE a.publish_date = $1 AND a.slug = $2
    GROUP BY a.id
  `, [date, slug]);

  if (!article) {
    return res.status(404).send('Article not found');
  }

  // 2. Render HTML template with article data
  res.render('articles', {
    articles: [article], // Pass to template
    pageTitle: article.title,
    metaDescription: article.prelude_body,
    canonicalUrl: `https://www.samyak-gyan.com/upsc-current-affairs/${date}/${slug}`
  });
});

// Also handle date-only URLs (show all articles for that date)
app.get('/upsc-current-affairs/:date', async (req, res) => {
  const { date } = req.params;

  // Query all articles for this date
  const articles = await db.query(`
    SELECT * FROM articles
    WHERE publish_date = $1
    ORDER BY created_at DESC
  `, [date]);

  res.render('articles', {
    articles: articles.rows,
    pageTitle: `UPSC Current Affairs - ${date}`,
    metaDescription: `Read all current affairs articles published on ${date} for UPSC preparation`,
    canonicalUrl: `https://www.samyak-gyan.com/upsc-current-affairs/${date}`
  });
});
```

**EJS Template (articles.ejs):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO Meta Tags (CRITICAL) -->
  <title><%= pageTitle %> | Samyak Gyan</title>
  <meta name="description" content="<%= metaDescription %>">
  <link rel="canonical" href="<%= canonicalUrl %>">

  <!-- Open Graph (for social sharing) -->
  <meta property="og:title" content="<%= pageTitle %>">
  <meta property="og:description" content="<%= metaDescription %>">
  <meta property="og:url" content="<%= canonicalUrl %>">
  <meta property="og:type" content="article">

  <!-- Structured Data (JSON-LD for Google) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "<%= articles[0].title %>",
    "datePublished": "<%= articles[0].publish_date %>",
    "author": {
      "@type": "Organization",
      "name": "Samyak Gyan"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Samyak Gyan",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.samyak-gyan.com/logo.png"
      }
    }
  }
  </script>

  <link rel="stylesheet" href="/styles/articles.css">
</head>
<body>

<div id="articles-container">
  <% articles.forEach(article => { %>
  <div class="article-tile" data-article-id="<%= article.id %>">

    <!-- Source Ribbon -->
    <div class="source-ribbon" style="background-color: <%= getSourceColor(article.source_ribbon) %>">
      <%= article.source_ribbon %>
    </div>

    <!-- Title -->
    <h1 class="article-title"><%= article.title %></h1>

    <!-- Tags -->
    <div class="tags"><%= article.hashtags %></div>

    <!-- Publish Date -->
    <div class="article-date"><%= formatDate(article.publish_date) %></div>

    <!-- Prelude -->
    <div class="prelude-section">
      <span class="prelude-title"><%= article.prelude_title %></span>
      <span class="prelude-body"><%= article.prelude_body %></span>
    </div>

    <!-- Main Content (Q&A) -->
    <div class="content-area">
      <% article.content.forEach(qna => { %>
        <span class="question"><%= qna.question %></span>
        <p class="answer"><%= qna.answer %></p>
      <% }); %>
    </div>

    <!-- End Ribbons (Mindmap, Prelims) -->
    <div class="end-content-ribbons">
      <% article.endRibbons.forEach(ribbon => { %>
        <div class="end-content-ribbon-item" style="background-color: <%= ribbon.color %>">
          <%= ribbon.label %>
        </div>
      <% }); %>
    </div>

  </div>
  <% }); %>
</div>

<!-- Frontend JavaScript (Layer 2: Adds interactivity) -->
<script src="/scripts/articles.js"></script>
<script src="/scripts/buttons.js"></script>

</body>
</html>
```

---

#### **Layer 2: Client-Side JavaScript (For Interactivity)**

**What the frontend JavaScript does:**
1. Page loads with complete HTML from server (SEO ✅)
2. JavaScript enhances the page with:
   - Expand/collapse animations
   - Highlighting functionality
   - Button interactions (mark as read, bookmark, vote)
   - URL updates (history.replaceState)
   - Dynamic modals (summary notes)

**Your existing frontend code stays exactly as is!** It just enhances the server-rendered content.

**Example Enhancement:**

```javascript
// articles.js - Progressive Enhancement
document.addEventListener('DOMContentLoaded', () => {
  // Server already rendered content, now add interactivity

  // 1. Add expand/collapse functionality
  document.querySelectorAll('.article-tile').forEach(tile => {
    const arrow = tile.querySelector('.main-arrow-btn');
    const content = tile.querySelector('.content-area');

    arrow.addEventListener('click', () => {
      tile.classList.toggle('expanded');
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
  });

  // 2. Initialize highlighting (your existing code)
  initializeHighlighting();

  // 3. Initialize buttons (your existing code)
  window.reinitializeButtons();
});
```

---

### 🗺️ XML SITEMAP GENERATION

**Purpose:** Tell Google about all pages on your website for faster indexing.

**Implementation:**

#### **Endpoint: GET /sitemap.xml**

```javascript
app.get('/sitemap.xml', async (req, res) => {
  // 1. Fetch all published articles
  const articles = await db.query(`
    SELECT slug, publish_date, updated_at
    FROM articles
    WHERE status = 'published'
    ORDER BY publish_date DESC
  `);

  // 2. Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Homepage -->
  <url>
    <loc>https://www.samyak-gyan.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Main Sections -->
  <url>
    <loc>https://www.samyak-gyan.com/current-affairs</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.samyak-gyan.com/ethics</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.samyak-gyan.com/essays</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

  // 3. Add all articles
  articles.forEach(article => {
    const date = formatDateISO(article.publish_date); // "2025-10-18"
    xml += `
  <url>
    <loc>https://www.samyak-gyan.com/upsc-current-affairs/${date}/${article.slug}</loc>
    <lastmod>${article.updated_at || article.publish_date}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  // 4. Send XML response
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Helper: Format date to YYYY-MM-DD
function formatDateISO(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}
```

**After Deployment:**
1. Visit Google Search Console
2. Add property: `https://www.samyak-gyan.com`
3. Submit sitemap: `https://www.samyak-gyan.com/sitemap.xml`
4. Google crawls and indexes all your articles ✅

---

### 📄 ROBOTS.TXT

**Purpose:** Tell search engines which pages to crawl/ignore.

**File:** `/public/robots.txt`

```txt
# Samyak Gyan - robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

# Sitemap
Sitemap: https://www.samyak-gyan.com/sitemap.xml
```

**What this does:**
- ✅ Allow crawling: All public pages (articles, homepage, etc.)
- ❌ Block crawling: API endpoints, admin panel, user dashboards
- 🗺️ Submit sitemap: Direct Google to sitemap.xml

---

### 🏷️ META TAGS & STRUCTURED DATA

**REQUIRED for every article page:**

#### **1. Basic Meta Tags**

```html
<head>
  <title>India's Semiconductor Policy: Challenges Ahead | Samyak Gyan</title>
  <meta name="description" content="Analysis of India's semiconductor manufacturing goals, challenges in attracting global investment, and strategies for self-reliance in chip production.">
  <meta name="keywords" content="India semiconductor, chip manufacturing, UPSC current affairs, electronics policy, Make in India">
  <link rel="canonical" href="https://www.samyak-gyan.com/upsc-current-affairs/2025-10-18/india-semiconductor-policy-challenges-ahead">
</head>
```

#### **2. Open Graph Tags (Social Media)**

```html
<meta property="og:title" content="India's Semiconductor Policy: Challenges Ahead">
<meta property="og:description" content="Analysis of India's semiconductor manufacturing goals...">
<meta property="og:url" content="https://www.samyak-gyan.com/upsc-current-affairs/2025-10-18/india-semiconductor-policy-challenges-ahead">
<meta property="og:type" content="article">
<meta property="og:image" content="https://www.samyak-gyan.com/images/semiconductor-thumbnail.jpg">
<meta property="article:published_time" content="2025-10-18T00:00:00Z">
<meta property="article:section" content="UPSC Current Affairs">
<meta property="article:tag" content="Semiconductor">
<meta property="article:tag" content="UPSC">
```

#### **3. Structured Data (JSON-LD)**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "India's Semiconductor Policy: Challenges Ahead",
  "description": "Analysis of India's semiconductor manufacturing goals...",
  "image": "https://www.samyak-gyan.com/images/semiconductor-thumbnail.jpg",
  "datePublished": "2025-10-18T00:00:00Z",
  "dateModified": "2025-10-18T00:00:00Z",
  "author": {
    "@type": "Organization",
    "name": "Samyak Gyan"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Samyak Gyan",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.samyak-gyan.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.samyak-gyan.com/upsc-current-affairs/2025-10-18/india-semiconductor-policy-challenges-ahead"
  }
}
</script>
```

**Benefits:**
- Google shows rich snippets in search results
- Better click-through rates (CTR)
- Social media platforms display beautiful preview cards
- Google Knowledge Graph integration

---

### 📚 DATABASE SCHEMA ADDITIONS FOR SEO

**Add to `articles` table:**

```sql
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Index for fast slug lookups
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_publish_date ON articles(publish_date);
```

**Why these fields matter:**

| Field | Purpose | Example |
|-------|---------|---------|
| `meta_title` | SEO title (max 70 chars) | "India Semiconductor Policy - UPSC 2025" |
| `meta_description` | Search result snippet (max 160 chars) | "Complete analysis for UPSC Mains GS3..." |
| `meta_keywords` | Search keywords | "semiconductor, UPSC, current affairs" |
| `og_image_url` | Social media preview image | "/images/semiconductor-thumb.jpg" |
| `canonical_url` | Prevent duplicate content | Full article URL |
| `slug` | URL-friendly identifier | "india-semiconductor-policy-2025" |

---

### 🎨 ADMIN PANEL REQUIREMENTS FOR SEO

**When building the admin panel for article uploads, include these SEO fields:**

#### **Article Upload Form**

```html
<form id="article-upload-form" method="POST" action="/admin/articles/create">

  <!-- Basic Content -->
  <input type="text" name="title" placeholder="Article Title" required>
  <textarea name="content" placeholder="Article content..." required></textarea>
  <input type="date" name="publish_date" required>

  <!-- VOTING CONTROL (for editorials/important articles) -->
  <fieldset>
    <legend>Community Voting</legend>
    <label>
      <input type="checkbox" name="is_votable" value="true" checked>
      Allow community voting on this article
    </label>
    <small>
      ℹ️ Uncheck for important editorials that should ALWAYS be included in magazine.
      Editorials with voting disabled won't appear in Top 5 rankings.
    </small>
  </fieldset>

  <!-- SEO FIELDS (CRITICAL) -->
  <fieldset>
    <legend>SEO Optimization</legend>

    <label>Meta Title (max 70 characters):</label>
    <input type="text" name="meta_title" maxlength="70"
           placeholder="India's Semiconductor Policy - UPSC Current Affairs">
    <small id="meta-title-counter">0/70</small>

    <label>Meta Description (max 160 characters):</label>
    <textarea name="meta_description" maxlength="160" rows="3"
              placeholder="Complete analysis of India's semiconductor manufacturing goals..."></textarea>
    <small id="meta-desc-counter">0/160</small>

    <label>Keywords (comma-separated):</label>
    <input type="text" name="meta_keywords"
           placeholder="semiconductor, UPSC, India, manufacturing, current affairs">

    <label>URL Slug (auto-generated, editable):</label>
    <input type="text" name="slug" id="slug-input"
           placeholder="india-semiconductor-policy-challenges-ahead">

    <label>Open Graph Image (optional):</label>
    <input type="file" name="og_image" accept="image/*">
  </fieldset>

  <button type="submit">Publish Article</button>
</form>

<script>
// Auto-generate slug from title
document.querySelector('[name="title"]').addEventListener('input', (e) => {
  const slug = e.target.value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  document.getElementById('slug-input').value = slug;
});

// Character counters
document.querySelector('[name="meta_title"]').addEventListener('input', (e) => {
  document.getElementById('meta-title-counter').textContent = `${e.target.value.length}/70`;
});

document.querySelector('[name="meta_description"]').addEventListener('input', (e) => {
  document.getElementById('meta-desc-counter').textContent = `${e.target.value.length}/160`;
});
</script>
```

#### **Backend Handler (Admin Panel)**

```javascript
app.post('/admin/articles/create', authenticateAdmin, async (req, res) => {
  const {
    title,
    content,
    publish_date,
    meta_title,
    meta_description,
    meta_keywords,
    slug,
    is_votable
  } = req.body;

  // 1. Validate slug uniqueness
  const existingSlug = await db.query('SELECT id FROM articles WHERE slug = $1', [slug]);
  if (existingSlug.rows.length > 0) {
    return res.status(400).json({ error: 'Slug already exists' });
  }

  // 2. Insert article with SEO fields + voting control
  const result = await db.query(`
    INSERT INTO articles (
      title, content, publish_date,
      meta_title, meta_description, meta_keywords,
      slug, canonical_url, status,
      is_votable, total_votes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'published', $9, 0)
    RETURNING id, slug, publish_date
  `, [
    title,
    content,
    publish_date,
    meta_title || title, // Fallback to title
    meta_description || content.substring(0, 160),
    meta_keywords,
    slug,
    `https://www.samyak-gyan.com/upsc-current-affairs/${formatDateISO(publish_date)}/${slug}`,
    is_votable === 'true' ? true : false  // Checkbox value → boolean
  ]);

  // 3. Regenerate sitemap.xml
  await regenerateSitemap();

  res.json({
    success: true,
    message: 'Article published with SEO optimization',
    article: result.rows[0]
  });
});
```

---

### 🚀 HTML SITEMAP (Footer)

**Purpose:** User-friendly site navigation in footer (NOT the same as XML sitemap).

**File:** `components/footer.html`

```html
<footer class="site-footer">
  <div class="footer-container">

    <!-- Column 1: Content -->
    <div class="footer-column">
      <h4>Content</h4>
      <ul>
        <li><a href="/current-affairs">Current Affairs</a></li>
        <li><a href="/ethics">Ethics</a></li>
        <li><a href="/essays">Essays</a></li>
        <li><a href="/archive">Archives</a></li>
      </ul>
    </div>

    <!-- Column 2: Platform -->
    <div class="footer-column">
      <h4>Platform</h4>
      <ul>
        <li><a href="/how-to-use">How to Use</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/referral">Referral Program</a></li>
      </ul>
    </div>

    <!-- Column 3: Support -->
    <div class="footer-column">
      <h4>Support</h4>
      <ul>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/contact">Contact Us</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
      </ul>
    </div>

    <!-- Column 4: Company -->
    <div class="footer-column">
      <h4>Company</h4>
      <ul>
        <li><a href="/about">About Samyak Gyan</a></li>
        <li><a href="/vision">Vision & Mission</a></li>
        <li><a href="/sitemap">Sitemap</a></li>
      </ul>
    </div>

  </div>

  <!-- Copyright -->
  <div class="footer-bottom">
    <p>&copy; 2025 Samyak Gyan. All Rights Reserved.</p>
    <p>Privacy-First UPSC Preparation Platform by Deepanshu Anand</p>
  </div>
</footer>
```

**Include in every page:**

```html
<!-- In articles.ejs, homepage.ejs, etc. -->
<%- include('components/footer') %>
```

---

### 📊 SEO BEST PRACTICES CHECKLIST

**Backend Developer MUST implement:**

- [ ] **Server-Side Rendering (SSR)** for all article pages
- [ ] **XML Sitemap** at `/sitemap.xml` (auto-regenerates on new article)
- [ ] **robots.txt** at `/robots.txt`
- [ ] **Meta tags** for every article (title, description, keywords)
- [ ] **Open Graph tags** for social sharing
- [ ] **Structured Data (JSON-LD)** for rich snippets
- [ ] **Canonical URLs** to prevent duplicate content
- [ ] **Clean URL structure** (`/upsc-current-affairs/YYYY-MM-DD/article-slug`)
- [ ] **Database fields** for SEO metadata (meta_title, meta_description, slug)
- [ ] **Admin panel SEO fields** for article uploads
- [ ] **HTML sitemap** in footer for user navigation
- [ ] **Fast page load times** (optimize images, enable compression)
- [ ] **Mobile-responsive** rendering (already done in frontend)
- [ ] **HTTPS** enabled (SSL certificate)
- [ ] **Submit sitemap to Google Search Console** after deployment

---

### 🎯 EXPECTED GOOGLE SEARCH RESULTS

**When properly implemented, your articles will appear like this:**

```
India's Semiconductor Policy: Challenges Ahead | Samyak Gyan
www.samyak-gyan.com › upsc-current-affairs › 2025-10-18 › india-semiconductor...
Oct 18, 2025 — Complete analysis of India's semiconductor manufacturing goals,
challenges in attracting global investment, and strategies for self-reliance...

#CurrentAffairs #UPSC #Semiconductor #India
```

**Key Elements Google Shows:**
1. ✅ **Title** from `<title>` tag
2. ✅ **URL** showing clean date + slug structure
3. ✅ **Date** from publish_date
4. ✅ **Description** from meta description
5. ✅ **Hashtags** from article content
6. ✅ **Site name** from Open Graph tags

---

### 🔍 HOW GOOGLE WILL CRAWL YOUR WEBSITE

**Step-by-Step Process:**

1. **You submit sitemap** to Google Search Console:
   ```
   https://www.samyak-gyan.com/sitemap.xml
   ```

2. **Google reads sitemap** and finds all your article URLs:
   ```
   https://www.samyak-gyan.com/upsc-current-affairs/2025-10-18/india-semiconductor-policy
   https://www.samyak-gyan.com/upsc-current-affairs/2025-10-18/supreme-court-verdict-article-370
   (and hundreds more...)
   ```

3. **Googlebot visits each URL** and requests the HTML

4. **Your server sends COMPLETE HTML** (server-side rendered):
   ```html
   <html>
     <head>
       <title>India's Semiconductor Policy | Samyak Gyan</title>
       <meta name="description" content="Complete analysis...">
     </head>
     <body>
       <article>
         <h1>India's Semiconductor Policy: Challenges Ahead</h1>
         <p>Full article content here...</p>
       </article>
     </body>
   </html>
   ```

5. **Google indexes** the content:
   - Title: "India's Semiconductor Policy"
   - Keywords: semiconductor, India, UPSC, manufacturing, current affairs
   - Content: All Q&A text
   - URL: /upsc-current-affairs/2025-10-18/india-semiconductor-policy
   - Category: UPSC Current Affairs (SEO boost!)

6. **User searches** "India semiconductor policy UPSC 2025"

7. **Google shows your article** in search results ✅

8. **User clicks** and visits your website 🎉

---

### ⚠️ COMMON SEO MISTAKES TO AVOID

| Mistake | Impact | Solution |
|---------|--------|----------|
| Client-side only rendering | Google sees empty page | Implement SSR |
| Missing meta descriptions | Poor click-through rate | Add 160-char description |
| Duplicate content | Google penalty | Use canonical URLs |
| Slow page load (>3 seconds) | Lower ranking | Optimize images, enable gzip |
| No sitemap | Delayed indexing | Generate sitemap.xml |
| Broken links (404 errors) | Lower trust score | Monitor & fix regularly |
| No HTTPS | Security warning | Enable SSL certificate |
| Missing alt text on images | Lost image search traffic | Add alt="" to all <img> |
| Poor mobile experience | Mobile ranking penalty | Responsive design (done ✅) |

---

### 📈 PERFORMANCE OPTIMIZATION

**Backend MUST ensure fast page loads:**

```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Cache static assets
app.use('/styles', express.static('public/styles', {
  maxAge: '1y', // Cache CSS for 1 year
  immutable: true
}));

app.use('/scripts', express.static('public/scripts', {
  maxAge: '1y'
}));

// Set proper cache headers for articles
app.get('/:date/:slug', async (req, res) => {
  // ... fetch article ...

  // Cache article pages for 1 hour
  res.set('Cache-Control', 'public, max-age=3600');
  res.render('articles', { article });
});
```

**Google PageSpeed recommendations:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Total Blocking Time (TBT): < 200ms

---

### 🎯 FINAL IMPLEMENTATION SUMMARY

**What backend developer needs to build:**

1. **Server-Side Rendering Engine**
   - EJS/Pug/Handlebars template system
   - Renders complete HTML with article content
   - Sends to browser AND Google crawler

2. **SEO Metadata System**
   - Database fields for meta_title, meta_description, slug
   - Admin panel fields for SEO input
   - Auto-generation of canonical URLs

3. **Sitemap Generator**
   - Endpoint: GET /sitemap.xml
   - Auto-updates when articles published
   - Includes all public pages

4. **URL Routing**
   - Route: `/upsc-current-affairs/:date/:slug` → specific article page
   - Route: `/upsc-current-affairs/:date` → all articles for that date
   - Clean URLs (no query parameters)
   - SEO-optimized with category keyword
   - Proper 404 handling

5. **Performance Optimization**
   - Compression middleware
   - Static asset caching
   - Image optimization

**Frontend stays exactly as is!** JavaScript adds interactivity to server-rendered content.

---

**END OF SEO OPTIMIZATION SECTION**

---

## 📞 SUPPORT & CONTACT

**Project Owner**: Deepanshu Anand
**Frontend Status**: ✅ 95% Complete
**Backend Status**: ⏳ Awaiting Development
**Documentation Version**: 2.0
**Last Updated**: October 2025

---

## 🎯 READY FOR BACKEND DEVELOPMENT

**This document contains EVERYTHING your backend developer needs:**

✅ Complete database schema (PostgreSQL) - 10 tables + SEO fields
✅ All API endpoints with full code examples
  - Core endpoints (13): Authentication, articles, highlights, summaries, notes download
  - **Bookmarks endpoints (3)**: Toggle, retrieve by fortnight, check status
  - **Reading Insights endpoints (2)**: Analytics, mark-as-read
  - **SEO endpoints (2)**: Sitemap.xml generation, robots.txt
✅ Business logic specifications (trial, referral, subscription)
✅ External integration guides (Telegram, Bhashini, Razorpay)
✅ Security requirements & best practices
✅ **SEO Optimization & Server-Side Rendering** (CRITICAL for Google indexing)
✅ Comprehensive testing checklist (40+ test cases)
✅ Deployment instructions

**New Features Added (October 2025)**:
- 📚 **Bookmarks System**: Save articles for later, organized by month/fortnight
- 📊 **Reading Insights**: Track completion %, community comparison, unread articles
- 🔍 **SEO Optimization**: Server-side rendering, meta tags, sitemap.xml, structured data

**Next Steps**:
1. Share this document with backend developer
2. Set up PostgreSQL database (run schema migrations)
3. Build API endpoints (estimated 2-3 weeks with new features)
4. Test with frontend (use existing dummy data as reference)
5. Deploy to production
6. **Launch!** 🚀

---

**© 2025 Deepanshu Anand - All Rights Reserved**
