# Ethics & Essays Poll - Backend Implementation Guide

## Overview
This document provides complete backend implementation requirements for the Ethics & Essays Poll feature. This is a **temporary feature** (2-3 months) designed for marketing and onboarding purposes.

---

## Database Schema

### Table 1: `poll_questions`
Stores poll questions (allows future flexibility if needed)

```sql
CREATE TABLE poll_questions (
  question_id VARCHAR(10) PRIMARY KEY,  -- e.g., 'q1', 'q2', 'q3', 'q4'
  question_text TEXT NOT NULL,
  mindset_text TEXT,
  display_order INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Initial Data:**
```sql
INSERT INTO poll_questions (question_id, question_text, mindset_text, display_order) VALUES
('q1', 'Since UPSC often picks real public events...', 'UPSC often frames Ethics questions...', 1),
('q2', 'When ethics prep gets pushed till after prelims...', 'When Ethics preparation is delayed...', 2),
('q3', 'Do you agree that regularly reflecting on real-world events...', 'Essay and Ethics papers are like co-joined twins...', 3),
('q4', 'For a weekly digest of real-world events...', 'Essay and Ethics reward answers...', 4);
```

---

### Table 2: `poll_options`
Stores options for each question

```sql
CREATE TABLE poll_options (
  option_id INT PRIMARY KEY AUTO_INCREMENT,
  question_id VARCHAR(10),
  option_text TEXT NOT NULL,
  display_order INT,
  FOREIGN KEY (question_id) REFERENCES poll_questions(question_id) ON DELETE CASCADE
);
```

**Initial Data:**
```sql
-- Q1 Options
INSERT INTO poll_options (question_id, option_text, display_order) VALUES
('q1', 'Yes, I have felt this!!', 1),
('q1', 'No, I have not felt this!!', 2),
('q1', 'Not appeared in mains, but felt this in Mock Tests!!', 3);

-- Q2 Options
INSERT INTO poll_options (question_id, option_text, display_order) VALUES
('q2', 'Yes, I have felt that I have potential but feel unprepared!!', 1),
('q2', 'No, I remember the basics and my answers show my true potential!!', 2);

-- Q3 Options
INSERT INTO poll_options (question_id, option_text, display_order) VALUES
('q3', 'Yes, I know this but there is paucity of time to ponder, and prepare accordingly!!', 1),
('q3', 'No, I feel Essay & Ethics Orientation are separated!!', 2);

-- Q4 Options
INSERT INTO poll_options (question_id, option_text, display_order) VALUES
('q4', '~2 articles per week (~30 min)', 1),
('q4', '~5 articles per week + short essays (~1 hour)', 2);
```

---

### Table 3: `poll_responses`
Stores user votes

```sql
CREATE TABLE poll_responses (
  response_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  question_id VARCHAR(10),
  option_id INT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES poll_questions(question_id) ON DELETE CASCADE,
  FOREIGN KEY (option_id) REFERENCES poll_options(option_id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_question (user_id, question_id)  -- Prevents duplicate votes per question
);
```

**Indexing for Performance:**
```sql
CREATE INDEX idx_user_responses ON poll_responses(user_id);
CREATE INDEX idx_question_responses ON poll_responses(question_id);
```

---

## API Endpoints

### 1. Check User Authentication Status

**Endpoint:** `GET /api/user/auth-status`

**Description:** Check if user is logged in before allowing poll interaction.

**Request Headers:**
```
Cookie: session_token=abc123...
```

**Response (Success - Logged In):**
```json
{
  "isLoggedIn": true,
  "userId": 123,
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Response (Not Logged In):**
```json
{
  "isLoggedIn": false
}
```

**HTTP Status Codes:**
- `200 OK` - Request successful (whether logged in or not)

---

### 2. Check if User Has Already Voted

**Endpoint:** `GET /api/polls/user-response`

**Description:** Check if user has already submitted poll responses. If yes, show results immediately instead of voting interface.

**Request Headers:**
```
Cookie: session_token=abc123...
```

**Query Parameters:**
- `userId` (required) - User ID

**Response (Has Not Voted):**
```json
{
  "hasVoted": false
}
```

**Response (Has Already Voted):**
```json
{
  "hasVoted": true,
  "previousResponses": [
    {
      "questionId": "q1",
      "optionText": "Yes, I have felt this!!"
    },
    {
      "questionId": "q2",
      "optionText": "Yes, I have felt that I have potential but feel unprepared!!"
    },
    {
      "questionId": "q3",
      "optionText": "Yes, I know this but there is paucity of time to ponder, and prepare accordingly!!"
    },
    {
      "questionId": "q4",
      "optionText": "~5 articles per week + short essays (~1 hour)"
    }
  ],
  "voteCounts": [
    [10, 3, 7],    // Q1: Option1=10 votes, Option2=3 votes, Option3=7 votes
    [5, 15],       // Q2: Option1=5 votes, Option2=15 votes
    [12, 8],       // Q3: Option1=12 votes, Option2=8 votes
    [4, 10]        // Q4: Option1=4 votes, Option2=10 votes
  ]
}
```

**HTTP Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - User not logged in
- `500 Internal Server Error` - Database error

---

### 3. Submit Poll Responses

**Endpoint:** `POST /api/polls/submit`

**Description:** Save user's poll responses to database and return aggregated vote counts.

**Request Headers:**
```
Content-Type: application/json
Cookie: session_token=abc123...
```

**Request Body:**
```json
{
  "userId": 123,
  "responses": [
    {
      "questionId": "q1",
      "optionText": "Yes, I have felt this!!"
    },
    {
      "questionId": "q2",
      "optionText": "Yes, I have felt that I have potential but feel unprepared!!"
    },
    {
      "questionId": "q3",
      "optionText": "Yes, I know this but there is paucity of time to ponder, and prepare accordingly!!"
    },
    {
      "questionId": "q4",
      "optionText": "~5 articles per week + short essays (~1 hour)"
    }
  ]
}
```

**Backend Processing Steps:**

1. Verify user authentication (check session token)
2. Check if user has already voted (query `poll_responses` table)
3. If already voted, return error (prevent duplicate submissions)
4. For each response:
   - Look up `option_id` from `poll_options` table using `questionId` and `optionText`
   - Insert into `poll_responses` table: `(user_id, question_id, option_id)`
5. Calculate vote counts for all questions:
   ```sql
   SELECT question_id, option_id, COUNT(*) as vote_count
   FROM poll_responses
   WHERE question_id IN ('q1', 'q2', 'q3', 'q4')
   GROUP BY question_id, option_id
   ORDER BY question_id, display_order;
   ```
6. Format vote counts as nested array and return

**Response (Success):**
```json
{
  "success": true,
  "message": "Poll responses saved successfully",
  "voteCounts": [
    [10, 3, 7],    // Q1 vote counts
    [5, 15],       // Q2 vote counts
    [12, 8],       // Q3 vote counts
    [4, 10]        // Q4 vote counts
  ]
}
```

**Response (Already Voted Error):**
```json
{
  "success": false,
  "error": "You have already submitted this poll"
}
```

**Response (Authentication Error):**
```json
{
  "success": false,
  "error": "User not authenticated"
}
```

**Response (Database Error):**
```json
{
  "success": false,
  "error": "Database error occurred"
}
```

**HTTP Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid request body or already voted
- `401 Unauthorized` - User not logged in
- `500 Internal Server Error` - Database error

---

## Backend Logic Details

### Calculating Vote Counts

**SQL Query to Get Vote Counts:**
```sql
-- Get vote counts for all questions
SELECT
  po.question_id,
  po.option_id,
  po.display_order,
  COALESCE(COUNT(pr.response_id), 0) as vote_count
FROM poll_options po
LEFT JOIN poll_responses pr ON po.option_id = pr.option_id
WHERE po.question_id IN ('q1', 'q2', 'q3', 'q4')
GROUP BY po.question_id, po.option_id, po.display_order
ORDER BY po.question_id, po.display_order;
```

**Transform SQL Results into Array Format:**

Input (SQL result):
```
| question_id | option_id | display_order | vote_count |
|-------------|-----------|---------------|------------|
| q1          | 1         | 1             | 10         |
| q1          | 2         | 2             | 3          |
| q1          | 3         | 3             | 7          |
| q2          | 4         | 1             | 5          |
| q2          | 5         | 2             | 15         |
| q3          | 6         | 1             | 12         |
| q3          | 7         | 2             | 8          |
| q4          | 8         | 1             | 4          |
| q4          | 9         | 2             | 10         |
```

Output (JSON array):
```json
[
  [10, 3, 7],   // q1
  [5, 15],      // q2
  [12, 8],      // q3
  [4, 10]       // q4
]
```

**Python/Node.js Example:**
```python
# Python example
def format_vote_counts(sql_results):
    vote_counts = {}
    for row in sql_results:
        qid = row['question_id']
        if qid not in vote_counts:
            vote_counts[qid] = []
        vote_counts[qid].append(row['vote_count'])

    # Return in order: q1, q2, q3, q4
    return [vote_counts['q1'], vote_counts['q2'], vote_counts['q3'], vote_counts['q4']]
```

---

## Security Considerations

### 1. Prevent Vote Manipulation
- **Database Constraint:** `UNIQUE KEY unique_user_question (user_id, question_id)` prevents duplicate votes
- **Backend Validation:** Check if user has already voted before inserting

### 2. Prevent Anonymous Voting
- **Session Validation:** Always verify session token before allowing vote
- **User ID Validation:** Ensure `user_id` in request matches session user

### 3. SQL Injection Prevention
- Use **parameterized queries** for all database operations
- Never concatenate user input directly into SQL strings

**Example (Node.js with MySQL):**
```javascript
// BAD (vulnerable to SQL injection)
const query = `INSERT INTO poll_responses (user_id, question_id, option_id)
               VALUES (${userId}, '${questionId}', ${optionId})`;

// GOOD (safe parameterized query)
const query = `INSERT INTO poll_responses (user_id, question_id, option_id)
               VALUES (?, ?, ?)`;
connection.query(query, [userId, questionId, optionId]);
```

---

## Testing Checklist

### Frontend Testing:
- [ ] Non-logged-in user clicks option → Profile modal appears
- [ ] Logged-in user can select options
- [ ] Submit button disabled until all 4 questions answered
- [ ] Submit button shows "Submitting..." with spinner during save
- [ ] Results appear correctly after successful submit
- [ ] Error message shows if backend fails
- [ ] "Go to Ethics & Essay" button appears after successful submit

### Backend Testing:
- [ ] `GET /api/user/auth-status` returns correct login status
- [ ] `GET /api/polls/user-response` detects if user already voted
- [ ] `POST /api/polls/submit` saves responses correctly
- [ ] Duplicate vote attempt returns error (database constraint works)
- [ ] Vote counts calculated correctly
- [ ] Anonymous user cannot submit (401 Unauthorized)
- [ ] Database transactions rollback on error (all-or-nothing save)

---

## Deployment Notes

### Phase 1: Initial Launch (Current)
- Poll page is main landing page for `/upsc-ethics-essays/` navigation
- Users see poll first, submit, then click "Go to Ethics & Essay"

### Phase 2-3: After 2-3 Months (Future)
- **Remove poll page entirely**
- Update navigation: `/upsc-ethics-essays/` → Direct to latest content page
- **Keep database tables** for analytics (don't delete historical vote data)
- Generate report: "Poll Results Summary" (for internal use)

---

## Analytics Queries (For Internal Use)

### Total Votes per Question:
```sql
SELECT question_id, COUNT(*) as total_votes
FROM poll_responses
GROUP BY question_id;
```

### Most Popular Option per Question:
```sql
SELECT
  pr.question_id,
  po.option_text,
  COUNT(*) as vote_count
FROM poll_responses pr
JOIN poll_options po ON pr.option_id = po.option_id
GROUP BY pr.question_id, po.option_text
HAVING vote_count = (
  SELECT MAX(sub.vote_count)
  FROM (
    SELECT question_id, COUNT(*) as vote_count
    FROM poll_responses
    GROUP BY question_id, option_id
  ) sub
  WHERE sub.question_id = pr.question_id
);
```

### Voting Timeline (When Users Voted):
```sql
SELECT DATE(submitted_at) as vote_date, COUNT(*) as votes_per_day
FROM poll_responses
GROUP BY DATE(submitted_at)
ORDER BY vote_date;
```

---

## Contact & Questions

For backend implementation questions, refer to:
- Frontend file: `ethics_essays_poll.html`
- TODO comments in JavaScript (marked with `// TODO: BACKEND`)
- This documentation

**Timeline:** Poll feature should be live within 2-3 months, then deprecated.
