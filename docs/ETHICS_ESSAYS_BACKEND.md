# Ethics & Essays - Backend Implementation Guide

## Overview
This document provides complete backend implementation requirements for the Ethics & Essays section. This is **weekly content** (published on Sundays) focused on learning, not engagement tracking.

---

## Key Differences from Current Affairs

### **Current Affairs (Daily):**
- Track reads, votes, bookmarks
- Full user interaction analytics
- High-frequency data collection

### **Ethics & Essays (Weekly):**
- NO read tracking
- NO voting system
- NO bookmarking
- **Only track: Highlights + Summary notes**
- Minimal data collection (learning-focused)

---

## Database Schema

### Table: `ethics_essays_articles`
Stores Ethics & Essay articles

```sql
CREATE TABLE ethics_essays_articles (
  article_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  article_type ENUM('ethics', 'essay') NOT NULL,
  hashtags VARCHAR(500),
  source_ribbon VARCHAR(100),
  secondary_ribbon VARCHAR(200),
  publish_date DATE NOT NULL,
  prelude_title VARCHAR(200),
  prelude_body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Indexing:**
```sql
CREATE INDEX idx_publish_date ON ethics_essays_articles(publish_date);
CREATE INDEX idx_article_type ON ethics_essays_articles(article_type);
```

---

### Table: `ethics_essays_content`
Stores Q&A content for each article

```sql
CREATE TABLE ethics_essays_content (
  content_id INT PRIMARY KEY AUTO_INCREMENT,
  article_id INT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (article_id) REFERENCES ethics_essays_articles(article_id) ON DELETE CASCADE
);
```

---

### Table: `ethics_essays_highlights`
Stores user highlights (NO read tracking, NO votes)

```sql
CREATE TABLE ethics_essays_highlights (
  highlight_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  article_id INT NOT NULL,
  highlighted_text TEXT NOT NULL,
  color VARCHAR(7) DEFAULT '#FFFF00',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES ethics_essays_articles(article_id) ON DELETE CASCADE
);
```

**Indexing:**
```sql
CREATE INDEX idx_user_article ON ethics_essays_highlights(user_id, article_id);
```

---

### Table: `ethics_essays_summaries`
Stores user summary notes

```sql
CREATE TABLE ethics_essays_summaries (
  summary_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  article_id INT NOT NULL,
  summary_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES ethics_essays_articles(article_id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_article (user_id, article_id) -- One summary per user per article
);
```

---

## API Endpoints

### 1. Get Latest Ethics & Essay Articles

**Endpoint:** `GET /api/ethics-essays/latest`

**Description:** Fetch latest Sunday's Ethics & Essay articles (no read status, no vote counts).

**Query Parameters:**
- `limit` (optional, default: 10) - Number of articles to fetch

**Response:**
```json
{
  "success": true,
  "articles": [
    {
      "article_id": 101,
      "title": "Whistleblower Dilemma in Bureaucracy",
      "article_type": "ethics",
      "hashtags": "#Ethics #Governance #UPSC",
      "source_ribbon": "the-hindu",
      "secondary_ribbon": "GS4 Case Study",
      "publish_date": "2025-01-19",
      "prelude_title": "Why should I read it?",
      "prelude_body": "This case study tests ethical decision-making...",
      "content": [
        {
          "content_id": 1001,
          "question": "✦ What is the ethical dilemma?",
          "answer": "A civil servant discovers financial irregularities...",
          "display_order": 1
        },
        {
          "content_id": 1002,
          "question": "✦ What are the stakeholders?",
          "answer": "1. The whistleblower 2. Senior officials 3. Public...",
          "display_order": 2
        }
      ]
    },
    {
      "article_id": 102,
      "title": "India's Demographic Dividend",
      "article_type": "essay",
      "publish_date": "2025-01-19",
      "content": [...]
    }
  ]
}
```

**HTTP Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database error

---

### 2. Save Highlights

**Endpoint:** `POST /api/ethics-essays/save-highlights`

**Description:** Save user's highlighted text for an article.

**Request Headers:**
```
Content-Type: application/json
Cookie: session_token=abc123...
```

**Request Body:**
```json
{
  "userId": 123,
  "articleId": 101,
  "highlights": [
    {
      "text": "Ethical decision-making requires balancing competing values",
      "color": "#FFFF00"
    },
    {
      "text": "Public interest vs organizational loyalty",
      "color": "#90EE90"
    }
  ]
}
```

**Backend Processing:**
1. Verify user authentication
2. Delete existing highlights for this user + article
3. Insert new highlights in batch
4. Return success response

**Response (Success):**
```json
{
  "success": true,
  "message": "Highlights saved successfully",
  "highlightCount": 2
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "User not authenticated"
}
```

**HTTP Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - User not logged in
- `500 Internal Server Error` - Database error

---

### 3. Get User Highlights

**Endpoint:** `GET /api/ethics-essays/highlights?articleId=101`

**Description:** Retrieve user's saved highlights for an article.

**Query Parameters:**
- `articleId` (required) - Article ID

**Request Headers:**
```
Cookie: session_token=abc123...
```

**Response:**
```json
{
  "success": true,
  "highlights": [
    {
      "highlight_id": 5001,
      "text": "Ethical decision-making requires balancing competing values",
      "color": "#FFFF00"
    },
    {
      "highlight_id": 5002,
      "text": "Public interest vs organizational loyalty",
      "color": "#90EE90"
    }
  ]
}
```

**HTTP Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - User not logged in
- `500 Internal Server Error` - Database error

---

### 4. Save Summary Notes

**Endpoint:** `POST /api/ethics-essays/save-summary`

**Description:** Save or update user's summary notes for an article.

**Request Headers:**
```
Content-Type: application/json
Cookie: session_token=abc123...
```

**Request Body:**
```json
{
  "userId": 123,
  "articleId": 101,
  "summary": "Key ethical frameworks:\n1. Deontological approach\n2. Utilitarian perspective\n\nMy analysis: The whistleblower should..."
}
```

**Backend Processing:**
1. Verify user authentication
2. Check if summary exists for this user + article
3. If exists: UPDATE summary_text
4. If not exists: INSERT new row
5. Return success response

**SQL (Upsert):**
```sql
INSERT INTO ethics_essays_summaries (user_id, article_id, summary_text)
VALUES (?, ?, ?)
ON DUPLICATE KEY UPDATE
  summary_text = VALUES(summary_text),
  updated_at = CURRENT_TIMESTAMP;
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Summary saved successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "User not authenticated"
}
```

**HTTP Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - User not logged in
- `500 Internal Server Error` - Database error

---

### 5. Get User Summary

**Endpoint:** `GET /api/ethics-essays/summary?articleId=101`

**Description:** Retrieve user's saved summary notes for an article.

**Query Parameters:**
- `articleId` (required) - Article ID

**Request Headers:**
```
Cookie: session_token=abc123...
```

**Response (Summary Exists):**
```json
{
  "success": true,
  "summary": "Key ethical frameworks:\n1. Deontological approach\n2. Utilitarian perspective\n\nMy analysis: The whistleblower should..."
}
```

**Response (No Summary Saved):**
```json
{
  "success": true,
  "summary": ""
}
```

**HTTP Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - User not logged in
- `500 Internal Server Error` - Database error

---

### 6. Download Notes (Highlights + Summary)

**Endpoint:** `GET /api/ethics-essays/download-notes?articleIds=101,102`

**Description:** Generate and download PDF/text file with user's highlights and summaries.

**Query Parameters:**
- `articleIds` (required) - Comma-separated article IDs
- `format` (optional, default: 'pdf') - 'pdf' or 'txt'

**Request Headers:**
```
Cookie: session_token=abc123...
```

**Backend Processing:**
1. Verify user authentication
2. Fetch article details for given article IDs
3. Fetch user highlights for those articles
4. Fetch user summaries for those articles
5. Generate formatted document (PDF or TXT)
6. Return file download

**Response:**
- **Content-Type:** `application/pdf` (if format=pdf) or `text/plain` (if format=txt)
- **Content-Disposition:** `attachment; filename="Ethics_Essays_Notes_2025-01-19.pdf"`

**HTTP Status Codes:**
- `200 OK` - Success, returns file
- `401 Unauthorized` - User not logged in
- `404 Not Found` - No articles found with given IDs
- `500 Internal Server Error` - File generation error

---

## Notes Format (PDF/TXT)

### **PDF Structure:**
```
=======================================
Samyak Gyan - Ethics & Essay Notes
Downloaded: January 19, 2025
=======================================

ARTICLE 1: Whistleblower Dilemma in Bureaucracy
Published: January 12, 2025
Type: Ethics Case Study

--- YOUR HIGHLIGHTS ---
1. "Ethical decision-making requires balancing competing values"
2. "Public interest vs organizational loyalty"

--- YOUR SUMMARY NOTES ---
Key ethical frameworks:
1. Deontological approach
2. Utilitarian perspective

My analysis: The whistleblower should...

=======================================

ARTICLE 2: India's Demographic Dividend
Published: January 12, 2025
Type: Essay

--- YOUR HIGHLIGHTS ---
1. "Youth population as economic advantage"

--- YOUR SUMMARY NOTES ---
(No summary notes written)

=======================================
```

---

## Comparison with Current Affairs Backend

| Feature | Current Affairs | Ethics & Essays |
|---------|----------------|-----------------|
| **Read Tracking** | ✅ Yes | ❌ No |
| **Voting System** | ✅ Yes | ❌ No |
| **Bookmarking** | ✅ Yes | ❌ No |
| **Highlights** | ✅ Yes | ✅ Yes |
| **Summary Notes** | ✅ Yes | ✅ Yes |
| **Download Notes** | ✅ Yes | ✅ Yes |
| **Frequency** | Daily | Weekly (Sundays) |
| **Data Collection** | High (analytics-driven) | Minimal (learning-focused) |
| **API Calls per User** | ~10-15 per article | ~3-5 per article |

---

## Security Considerations

### 1. Authentication
- All endpoints require valid session token
- Verify `user_id` in session matches request body

### 2. Data Privacy
- Users can only access their own highlights/summaries
- No cross-user data leakage

### 3. SQL Injection Prevention
- Use parameterized queries for all database operations

**Example (Node.js with MySQL):**
```javascript
// BAD (vulnerable)
const query = `SELECT * FROM ethics_essays_highlights WHERE user_id = ${userId}`;

// GOOD (safe)
const query = `SELECT * FROM ethics_essays_highlights WHERE user_id = ?`;
connection.query(query, [userId]);
```

### 4. File Download Security
- Validate article IDs (ensure they exist and user has access)
- Sanitize filenames (prevent path traversal)
- Limit file size (prevent memory overflow)

---

## Testing Checklist

### **Frontend Testing:**
- [ ] Summary button opens modal
- [ ] Summary textarea saves to localStorage (mock)
- [ ] Share button opens Telegram
- [ ] Highlighting works (TextHighlighter.js)
- [ ] Get Your Notes button appears in document flow (not fixed)
- [ ] Get Your Notes matches articles.html appearance

### **Backend Testing:**
- [ ] `GET /api/ethics-essays/latest` returns articles without read/vote data
- [ ] `POST /api/ethics-essays/save-highlights` saves highlights correctly
- [ ] `GET /api/ethics-essays/highlights` retrieves user highlights
- [ ] `POST /api/ethics-essays/save-summary` upserts summary correctly
- [ ] `GET /api/ethics-essays/summary` retrieves user summary
- [ ] `GET /api/ethics-essays/download-notes` generates PDF/TXT correctly
- [ ] Anonymous user cannot access protected endpoints (401)
- [ ] User A cannot see User B's highlights/summaries

---

## Performance Optimization

### **Caching Strategy:**
```
Latest articles (GET /api/ethics-essays/latest):
→ Cache for 1 hour (since weekly content, low update frequency)

User highlights/summaries:
→ NO caching (user-specific, changes frequently)

Download notes:
→ Generate on-demand (no pre-caching, user-specific)
```

### **Database Optimization:**
```sql
-- Index for fast highlight retrieval
CREATE INDEX idx_user_article ON ethics_essays_highlights(user_id, article_id);

-- Index for fast summary retrieval
CREATE INDEX idx_user_summary ON ethics_essays_summaries(user_id, article_id);
```

---

## Deployment Notes

### **Weekly Publish Workflow:**
1. Admin creates new Ethics & Essay articles (Sundays)
2. Articles saved to `ethics_essays_articles` table
3. Content (Q&A) saved to `ethics_essays_content` table
4. Frontend fetches latest articles via `GET /api/ethics-essays/latest`

### **Data Retention:**
- Keep all articles (no auto-deletion)
- Keep user highlights/summaries indefinitely
- Analytics: Track download counts (optional)

---

## Contact & Questions

For backend implementation questions, refer to:
- Frontend file: `ethics_essays_poll.html`
- Article rendering: `scripts/ethics_essays_articles.js`
- Button functionality: `scripts/ethics_essays_buttons.js`
- TODO comments marked with `// TODO: BACKEND`

**Timeline:** Ethics & Essay section should go live after Poll feature (2-3 months).
