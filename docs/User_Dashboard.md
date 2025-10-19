# Samyak Gyan: Backend Documentation - Your Journal

## 1. Reading Insight

This document outlines the backend architecture for a new, personalized user dashboard, designed to gamify the user's reading experience and increase engagement. The system leverages existing data to provide a dynamic and intuitive user interface that is adaptable for long-term use.

---

### Part 1: The User Workflow (The "Why")

The user dashboard serves as a central hub for progress tracking and motivation. The core of this feature is to provide a comprehensive, at-a-glance overview of a user's reading habits by:

* **Visualizing Progress:** A donut chart provides a simple visual comparing articles read against total articles published within the selected month and fortnight.
* **Providing a Clear "To-Do" List:** A scrollable list of unread articles offers a clear and actionable path forward. By showing users exactly what they have left to read, the dashboard encourages continuous engagement.
* **Encouraging Long-Term Engagement:** A rolling 12-month window ensures users can always track their progress for the past year. Older months automatically drop off, keeping the view concise and relevant.

The layout is optimized for different screen sizes for a seamless experience on both desktop and mobile.

---

### Part 2: The Technical Workflow (The "How")

The dashboard is powered by a dedicated API endpoint that aggregates and processes data from existing tables to deliver a structured response for the front end.

#### Database & Data Dependencies

The API uses the following data points:

1.  `users` table: `date_of_joining` ensures the first month is included only after the user joined.
2.  `articles` table: `publish_date` and `article_id` are used to count published articles and retrieve titles/slugs.
3.  **Read status data:** The backend queries which articles a specific user has marked as read.

#### API Briefing: The Dashboard API

**Endpoint:** `GET /api/users/:userId/dashboard-data`

**Parameters:**

| Parameter | Description | Values |
| :--- | :--- | :--- |
| `month_index` | The selected month from the 12-month dropdown. | `0` = oldest month, `11` = current month. |
| `fortnight_index` | The selected half of the month. | `0` = first fortnight (1–15), `1` = second fortnight (16–end of month). |

**Logic:**

1.  The API receives `userId`, `month_index`, and `fortnight_index`.
2.  It calculates the `start_date` and `end_date` for the selected month and fortnight automatically.
    * First fortnight is always 1–15.
    * Second fortnight is 16–end of month.
3.  The API counts the total articles published within that period.
4.  Simultaneously, it counts total articles read by the user within the same period.
5.  It retrieves a list of unread articles in that period, including `article_id`, `title`, and `publish_date`.
6.  The API returns all this data as a structured JSON response.

---

### Front-End Implementation & Visualization

#### Layout:

* **Laptop:** Two-column layout with D3.js donut chart on the left and unread articles list on the right.
* **Mobile:** Stacked layout, chart on top and list below.

#### Timeline Logic:

* Users select a month from a 12-month dropdown and a fortnight (first or second).
* The system automatically calculates the exact date range.
* Only the **last 12 months** of data are displayed; older months drop off automatically.

#### Visualization Components:

1.  **Donut Chart:** Shows total published vs. total read articles for the selected month and fortnight.
2.  **Unread Articles List:** Scrollable table with two columns:
    * Article title (hyperlinked)
    * Publish date
    * Sorted from most recent to oldest.

    # Samyak Gyan: Backend Documentation - Part 7: The Community Ranking System

## 2. Voting Pattern: Fostering Critical Engagement

This document details the backend architecture for a new, sophisticated user feature that tracks community voting behavior and provides personalized insights. The system is designed as a direct feedback loop, teaching users to evaluate content and engage more deeply with the platform.

---

### Part 1: The User Workflow (The "Why")

This feature provides users with a dynamic and educational experience by distinguishing between their personal judgment and the community's collective opinion.

* **Live Tracker (The Social Proof):** A real-time, dynamic ranking shows which articles the community finds most valuable within the **selected month and fortnight**. This provides social proof and guides the user to the most important content. *(Front-end note: Opens in a new tab for better exploration.)*
* **Post-Fortnight Evaluation (The Learning Tool):** After a fortnight is complete, the system provides a static, finalized list of articles ranked by overall performance (descending order).
    * **User Feedback:** A dedicated column on the right-hand side indicates whether the user voted for each article.
    * **Purpose:** This list lets the user see which highly-rated content they missed, prompting revisits and reflection.

This two-part system gamifies engagement, rewarding critical thinking and active participation.

---

### Part 2: The Technical Workflow (The "How")

The feature uses a new `votes` table and two distinct API endpoints to handle real-time and retrospective data with separate logic.

### 2.1 Database & Data Dependencies

To track voting behavior, a new table (`votes`) is required. Both APIs also rely on the existing `articles` table for article metadata.

#### New `votes` Table Structure:

| Column | Data Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `vote_id` | `INTEGER` | Unique primary key. | `PRIMARY KEY`, `AUTOINCREMENT` |
| `user_id` | `INTEGER` | The ID of the user who cast the vote. | `FOREIGN KEY (users)` |
| `article_id` | `INTEGER` | The ID of the article being voted on. | `FOREIGN KEY (articles)` |
| `created_at` | `DATETIME` | Timestamp of when the vote was cast. | |

### 2.2 API Briefing: The Two API Endpoints

#### Endpoint 1: Live Community Tracker (Real-Time)

This API powers the front-end's "Tracker" button for the **selected** period.

**Endpoint:** `GET /api/community/ranking`

**Parameters:** *Implicitly accepts* `month_index` and `fortnight_index` *from dashboard state.*

**Logic:**

1.  Determine the **current month and fortnight** based on user selection or server date.
2.  Query the `votes` table for all votes cast on articles published in that month/fortnight.
3.  Aggregate votes by article and return a live-updating list, sorted by vote count (descending).

#### Endpoint 2: Post-Fortnight Evaluation (Retrospective)

This API powers the "missed articles" list, tailored to the specific user for the **previous** period.

**Endpoint:** `GET /api/users/:userId/missed-articles`

**Parameters:** *Path parameter* `:userId`

**Logic (Top 5 Focused):**

1.  **Date Calculation:** Triggered only after a new fortnight begins, it identifies the **previous fortnight**.
2.  **Community Top 5:** Queries the `votes` table to determine the **final top 5 articles** from the previous fortnight based on total vote count.
3.  **User Comparison:** Identifies which of these top 5 articles the specific `:userId` **did not** vote for.
4.  **Data Assembly:** Joins the filtered data with the `articles` table to return the article titles, slugs, and a clear "voted/not voted" flag for the user.

### 2.3 Front-End Implementation

The front end will manage the user experience and display the data from the two APIs.

* **Tracker Button:** Calls `GET /api/community/ranking` to display a live-updating list of articles for the selected month/fortnight.
* **Missed Articles List:** Calls `GET /api/users/:userId/missed-articles` to show the finalized list of top-ranked articles the user missed. Only appears if a previous fortnight has completed.

#### Timeline Logic:

* Users select a month (from the last 12 months) and fortnight (1–15 or 16–end of month).
* All queries automatically calculate the start and end dates for the chosen fortnight.
* Only the **last 12 months** of data are included; older months drop off automatically.

---

## 3. Telegram Authentication & Profile Creation

### Part 1: The User Workflow (The "Why")

The platform uses **Telegram OAuth** for authentication, eliminating traditional email/password flows. This provides:

* **Seamless Login:** Users authenticate via Telegram Bot in one click
* **Verified Identity:** Telegram's authentication ensures real users
* **Rich Profile Data:** Automatic capture of username, name, and language preference
* **Privacy-First Display:** User IDs are masked for security (*****234 format)
* **Instant Trial Activation:** 15-day trial begins immediately upon first login

---

### Part 2: The Technical Workflow (The "How")

#### 3.1 Telegram Authentication Data Structure

When a user logs in via Telegram Bot, the following data is received:

```javascript
{
  username: "@D2313",        // Telegram username (may be null)
  id: 681522234,             // Telegram user ID (9-20 digits, unique)
  first: "Deepanshu",        // First name
  last: "Anand",             // Last name (may be null)
  lang: "en"                 // Language preference (en/hi)
}
```

#### 3.2 Profile Creation Logic

**Display Name:**
- Combine `first + last` → "Deepanshu Anand"
- If `last` is null → Use only `first` → "Deepanshu"

**User ID Display (Security Masking):**
- Database stores FULL Telegram ID: `681522234`
- UI displays masked version: `*****234` (last 3 digits only)
- Implementation:
```javascript
function maskTelegramId(telegramId) {
  const idStr = String(telegramId);
  const lastEight = idStr.slice(-8);
  return '*****' + lastEight.slice(-3); // "*****234"
}
```

**Date Formatting (Indian Standard):**
- Format: DD Month YYYY → "10 October 2025"
- Implementation:
```javascript
function formatIndianDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
```

**Trial Calculation:**
- Trial Start: `date_of_joining` (Telegram auth timestamp)
- Trial End: `date_of_joining + 15 days`
- Example: Joined Oct 10 → Trial ends Oct 25

#### 3.3 Database Schema for Users

```sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(50),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  date_of_joining TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  trial_end_date TIMESTAMP NOT NULL,
  trial_extended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.4 API Endpoint: User Profile

**Endpoint:** `GET /api/users/:userId/profile`

**Response:**
```json
{
  "telegram_id": "681522234",
  "masked_id": "*****234",
  "display_name": "Deepanshu Anand",
  "username": "@D2313",
  "language": "en",
  "date_joined": "10 October 2025",
  "trial_end_date": "25 October 2025",
  "trial_extended": false,
  "subscription_status": {
    "current_affairs": "active",
    "ethics_essay": "inactive"
  }
}
```

---

## 4. Trial Period & Referral System

### Part 1: The User Workflow (The "Why")

The trial system incentivizes user growth through referrals:

* **Initial Trial:** 15 days of full access upon joining
* **Referral Reward:** Additional 15-day extension when 3 referrals complete signup
* **Viral Growth:** Users share referral links via Telegram to extend their trial
* **Automatic Extension:** System auto-detects when 3 referrals complete, no manual action needed

---

### Part 2: The Technical Workflow (The "How")

#### 4.1 Referral System Architecture

**Database Schema:**
```sql
CREATE TABLE referrals (
  referral_id SERIAL PRIMARY KEY,
  referrer_user_id BIGINT NOT NULL,  -- Who sent the invite
  referee_user_id BIGINT,            -- Who joined (null until signup)
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',  -- pending/completed/expired
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (referrer_user_id) REFERENCES users(telegram_id),
  FOREIGN KEY (referee_user_id) REFERENCES users(telegram_id)
);
```

#### 4.2 Referral Link Generation

**Endpoint:** `POST /api/users/:userId/generate-referral`

**Backend Logic:**
```javascript
app.post('/api/users/:userId/generate-referral', async (req, res) => {
  const { userId } = req.params;

  // Generate unique referral code
  const referralCode = generateUniqueCode(); // e.g., "SG-DANAN-X7K2"

  // Store in database
  await db.query(
    'INSERT INTO referrals (referrer_user_id, referral_code) VALUES ($1, $2)',
    [userId, referralCode]
  );

  // Create referral link
  const referralLink = `https://samyakgyan.com/signup?ref=${referralCode}`;

  return res.json({
    success: true,
    referral_link: referralLink
  });
});
```

#### 4.3 Telegram Bot Integration (Sending Referral Links)

**When user clicks "Send Referral Link" button:**
```javascript
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

async function sendReferralLink(telegramId, referralLink) {
  const message = `
🎁 Share Samyak Gyan with your friends!

Your Referral Link:
${referralLink}

Invite 3 friends to extend your trial by 15 days!
  `;

  await bot.sendMessage(telegramId, message);
}
```

#### 4.4 Automatic Trial Extension (Database Trigger)

**PostgreSQL Trigger Function:**
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

  -- If 3 referrals completed and trial not yet extended, extend trial
  IF referral_count >= 3 THEN
    UPDATE users
    SET trial_end_date = trial_end_date + INTERVAL '15 days',
        trial_extended = TRUE
    WHERE telegram_id = NEW.referrer_user_id
      AND trial_extended = FALSE;

    -- Send Telegram notification
    PERFORM pg_notify('referral_reward', NEW.referrer_user_id::text);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER referral_completion_trigger
AFTER UPDATE OF status ON referrals
FOR EACH ROW
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION check_referral_reward();
```

**Node.js Listener (PostgreSQL Notifications):**
```javascript
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect();
client.query('LISTEN referral_reward');

client.on('notification', async (msg) => {
  const telegramId = msg.payload;

  // Send congratulations message via Telegram
  await bot.sendMessage(telegramId, `
🎉 Congratulations! You've successfully referred 3 friends!

Your trial has been extended by 15 days. Keep exploring Samyak Gyan!
  `);
});
```

#### 4.5 API Endpoint: Referral Status

**Endpoint:** `GET /api/users/:userId/referral-status`

**Response:**
```json
{
  "referrals_completed": 2,
  "referrals_needed": 1,
  "trial_extended": false,
  "referral_link": "https://samyakgyan.com/signup?ref=SG-DANAN-X7K2",
  "referrals": [
    {
      "referral_code": "SG-DANAN-X7K2",
      "status": "completed",
      "completed_at": "2025-10-12T14:30:00Z"
    },
    {
      "referral_code": "SG-DANAN-Y8L3",
      "status": "completed",
      "completed_at": "2025-10-13T09:15:00Z"
    },
    {
      "referral_code": "SG-DANAN-Z9M4",
      "status": "pending",
      "completed_at": null
    }
  ]
}
```

---

#### 4.6 Referral Popup Integration ("Help Us Grow !!" Button)

**UI/UX Flow**:

When user clicks the **"Help Us Grow !!"** button in the subscription section, a referral popup appears.

**Popup File**: `referral_popup.html`

**Popup Content Features**:
1. **Headline**: "🎉 Welcome to Samyak Gyan!"
2. **Trial Message**: "✨ You've got a 15-day free access to explore"
3. **Platform Benefits**: Read + Create Notes in 1-Click
4. **Referral Motivation**: "❤️ Find the Platform useful?? → Refer to all friends"
5. **Reward**: "👥 3 friends join → 1 month free access !!"
6. **CTA Button**: "📲 Send Link to My Telegram" (sends referral link via Telegram bot)
7. **Brand Message**: "Samyak Gyan is not spending on ads - Help SG grow!"
8. **Close/Skip**: Darker (×) button with "Skip" text for non-intrusive UX

**Frontend Popup Trigger**:
```javascript
// user_dashboard.html
document.getElementById('extend-trial').addEventListener('click', () => {
  // Show referral popup
  showReferralPopup();
});

function showReferralPopup() {
  const popup = document.getElementById('referral-popup');
  popup.classList.add('show');

  // Track popup view event
  trackAnalyticsEvent('popup_viewed', {
    trial_days_remaining: calculateDaysRemaining()
  });
}
```

**CTA Button Click Handler**:
```javascript
document.getElementById('get-referral-link').addEventListener('click', async () => {
  const userId = getCurrentUserId();

  // Call backend to generate referral link
  const response = await fetch(`/api/users/${userId}/generate-referral`, {
    method: 'POST'
  });

  const data = await response.json();

  if (data.success) {
    // Telegram bot will send link to user
    showSuccessMessage('✅ Link Sent to Telegram');

    // Track referral link generation
    trackAnalyticsEvent('referral_link_generated', {
      referral_code: data.referral_code
    });

    // Update button text
    document.getElementById('get-referral-link').textContent = '✅ Link Sent to Telegram';

    // Close popup after 2 seconds
    setTimeout(() => {
      closeReferralPopup();
    }, 2000);
  }
});
```

**Close/Skip Button Handler**:
```javascript
function closeReferralPopup() {
  const popup = document.getElementById('referral-popup');
  popup.classList.remove('show');

  // Track popup dismissal
  trackAnalyticsEvent('popup_dismissed', {
    dismiss_reason: 'close_button'
  });
}
```

**Analytics Event Tracking**:

**Event 1: Popup Viewed**
```javascript
POST /api/analytics/event
Body: {
  event_type: 'popup_viewed',
  user_id: '681522234',
  trial_days_remaining: 12,
  timestamp: '2025-10-14T10:30:00Z'
}
```

**Event 2: Referral Link Generated**
```javascript
POST /api/analytics/event
Body: {
  event_type: 'referral_link_generated',
  user_id: '681522234',
  referral_code: 'SG-DANAN-X7K2',
  timestamp: '2025-10-14T10:31:00Z'
}
```

**Event 3: Popup Dismissed**
```javascript
POST /api/analytics/event
Body: {
  event_type: 'popup_dismissed',
  user_id: '681522234',
  dismiss_reason: 'close_button' OR 'skip_button',
  timestamp: '2025-10-14T10:31:30Z'
}
```

**Why Track These Events?**
- **Conversion Rate**: popup_viewed → referral_link_generated (target: 40-60%)
- **Abandonment Rate**: popup_viewed → popup_dismissed (identify friction points)
- **A/B Testing**: Test different popup copy/design to optimize conversions
- **User Behavior**: Understand when users are most likely to refer friends

**Backend Analytics Endpoint**:
```javascript
app.post('/api/analytics/event', async (req, res) => {
  const { event_type, user_id, ...event_data } = req.body;

  await db.query(`
    INSERT INTO analytics_events (event_type, user_id, event_data, created_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
  `, [event_type, user_id, JSON.stringify(event_data)]);

  return res.json({ success: true });
});
```

**Database Schema for Analytics**:
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

**Popup CSS (Key Styles)**:
```css
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-overlay.show {
  display: flex;
}

.popup-box {
  background: #fff;
  width: 90%;
  max-width: 520px;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  padding: 1.8rem 2rem;
  text-align: center;
  animation: popupFadeIn 0.4s ease;
}

@keyframes popupFadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.popup-close {
  position: absolute;
  top: 0.6rem;
  right: 0.9rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #333;  /* Darker than default for better visibility */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.popup-button {
  background-color: #1877F2;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.popup-button:hover {
  background-color: #155dbf;
  transform: scale(1.03);
}
```

**Expected User Flow**:
1. User clicks "Help Us Grow !!" button
2. Popup appears with referral instructions
3. User clicks "📲 Send Link to My Telegram"
4. Backend generates unique referral code (e.g., `SG-DANAN-X7K2`)
5. Telegram bot sends message with referral link to user
6. Button changes to "✅ Link Sent to Telegram"
7. Popup closes after 2 seconds
8. User shares link with friends via Telegram
9. When 3 friends signup → Trial auto-extends by 15 days

---

## 5. Subscription State Management

### Part 1: The User Workflow (The "Why")

The platform offers **two independent subscriptions**:

1. **Current Affairs** (Weekday content: Monday-Saturday articles)
2. **Ethics & Essay** (Sunday content: Weekly essays)

Users can subscribe to **one, both, or neither**. The system manages 5 distinct states:

* **State 1:** Trial active → Full access to everything
* **State 2:** Trial expired, no subscriptions → No access
* **State 3:** Trial expired, only Current Affairs active → Access weekday articles only
* **State 4:** Trial expired, only Ethics & Essay active → Access Sunday essays only
* **State 5:** Trial expired, both subscriptions active → Full access

---

### Part 2: The Technical Workflow (The "How")

#### 5.1 Database Schema for Subscriptions

```sql
CREATE TABLE subscriptions (
  subscription_id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  topic VARCHAR(50) NOT NULL,  -- 'current_affairs' or 'ethics_essay'
  status VARCHAR(20) NOT NULL,  -- 'active' or 'inactive'
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  razorpay_subscription_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(telegram_id),
  UNIQUE(user_id, topic)
);
```

#### 5.2 Subscription State Queries

**State 1: Trial Active (Full Access)**
```sql
SELECT
  CASE
    WHEN trial_end_date > CURRENT_TIMESTAMP THEN 'trial_active'
    ELSE 'trial_expired'
  END AS trial_status
FROM users
WHERE telegram_id = $1;
```

**State 2: Trial Expired, No Subscriptions**
```sql
SELECT COUNT(*) AS active_subscriptions
FROM subscriptions
WHERE user_id = $1 AND status = 'active';
-- Result: 0 → No access
```

**State 3: Trial Expired, Only Current Affairs Active**
```sql
SELECT topic, status
FROM subscriptions
WHERE user_id = $1;
-- Result: current_affairs = 'active', ethics_essay = 'inactive' → Weekday access only
```

**State 4: Trial Expired, Only Ethics & Essay Active**
```sql
SELECT topic, status
FROM subscriptions
WHERE user_id = $1;
-- Result: current_affairs = 'inactive', ethics_essay = 'active' → Sunday access only
```

**State 5: Trial Expired, Both Subscriptions Active**
```sql
SELECT topic, status
FROM subscriptions
WHERE user_id = $1;
-- Result: Both 'active' → Full access
```

#### 5.3 UI Display Logic (Dashboard Subscription Blocks)

**Current Affairs Block:**
```javascript
if (trialActive) {
  display: "ACTIVE (Trial Period)";
  button_text: "Subscribe Now";
  button_style: "outline";
} else if (subscriptionStatus.current_affairs === 'active') {
  display: "ACTIVE";
  button_text: "Manage Subscription";
  button_style: "solid";
} else {
  display: "INACTIVE";
  button_text: "Subscribe to Read";
  button_style: "glow-pulse";  // Red glow animation
}
```

**Ethics & Essay Block:**
```javascript
if (trialActive) {
  display: "ACTIVE (Trial Period)";
  button_text: "Subscribe Now";
  button_style: "outline";
} else if (subscriptionStatus.ethics_essay === 'active') {
  display: "ACTIVE";
  button_text: "Manage Subscription";
  button_style: "solid";
} else {
  display: "INACTIVE";
  button_text: "Subscribe to Read";
  button_style: "glow-pulse";  // Red glow animation
}
```

#### 5.4 API Endpoint: Subscription Status

**Endpoint:** `GET /api/users/:userId/subscription-status`

**Response:**
```json
{
  "trial_active": false,
  "trial_end_date": "2025-10-25T23:59:59Z",
  "subscriptions": {
    "current_affairs": {
      "status": "active",
      "start_date": "2025-10-26T00:00:00Z",
      "end_date": "2025-11-26T23:59:59Z",
      "razorpay_subscription_id": "sub_XXXXXXXX"
    },
    "ethics_essay": {
      "status": "inactive",
      "start_date": null,
      "end_date": null,
      "razorpay_subscription_id": null
    }
  }
}
```

---

## 6. Access Control & Redirect Flow

### Part 1: The User Workflow (The "Why")

This feature provides a **non-intrusive, educational UX pattern** when users try to access content without an active subscription:

1. **User Action:** Clicks a date button (weekday article) or "Ethics & Essay" nav button
2. **Backend Check:** System validates subscription status
3. **Redirect Flow (if inactive):**
   - Auto-redirect to dashboard page
   - Auto-scroll to relevant subscription block
   - Button glows with red pulse animation (6 seconds)
   - Overlay message appears: "Subscribe to Read" (2 seconds)
   - User clearly understands they need to subscribe

**Why This is Brilliant UX:**
- Non-blocking (doesn't prevent navigation)
- Educational (teaches users about subscription requirements)
- Non-intrusive (overlay fades quickly)
- Visually engaging (glow animation draws attention)
- Clear call-to-action (Subscribe button is highlighted)

---

### Part 2: The Technical Workflow (The "How")

#### 6.1 Access Control Endpoint

**Endpoint:** `GET /api/users/:userId/check-access`

**Query Parameters:**
- `topic` → "current_affairs" or "ethics_essay"

**Backend Logic:**
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

    // 4. No access - redirect to dashboard with highlight parameter
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

#### 6.2 Frontend Integration: Weekday Date Click

**When user clicks a date button on the calendar:**
```javascript
async function handleDateClick(date) {
  const userId = getCurrentUserId(); // From session/cookie

  // Check access with backend
  const response = await fetch(`/api/users/${userId}/check-access?topic=current_affairs`);
  const data = await response.json();

  if (data.has_access) {
    // Grant access - navigate to articles page
    window.location.href = `/articles.html?date=${date}`;
  } else {
    // Redirect to dashboard with highlight
    window.location.href = data.redirect_url;
  }
}
```

#### 6.3 Frontend Integration: Sunday "Ethics & Essay" Nav Button

**When user clicks "Ethics & Essay" in navigation:**
```javascript
async function handleEthicsEssayClick() {
  const userId = getCurrentUserId();

  const response = await fetch(`/api/users/${userId}/check-access?topic=ethics_essay`);
  const data = await response.json();

  if (data.has_access) {
    window.location.href = '/ethics-essay.html';
  } else {
    window.location.href = data.redirect_url;
  }
}
```

#### 6.4 Dashboard Highlight Flow (Frontend)

**When dashboard loads with `?highlight=current_affairs` or `?highlight=ethics_essay`:**

```javascript
// Check URL for highlight parameter
const urlParams = new URLSearchParams(window.location.search);
const highlightTopic = urlParams.get('highlight');

if (highlightTopic) {
  highlightSubscriptionButton(highlightTopic);

  // Clean up URL
  window.history.replaceState({}, document.title, window.location.pathname);
}

function highlightSubscriptionButton(topic) {
  const button = document.querySelector(`.topic-chip[data-topic="${topic}"]`);

  if (button) {
    // Step 1: Scroll to button
    setTimeout(() => {
      button.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);

    // Step 2: Add glow effect
    setTimeout(() => {
      button.classList.add('glow-pulse');
    }, 800);

    // Step 3: Show overlay message
    setTimeout(() => {
      showOverlayMessage('Subscribe to Read');
    }, 1000);

    // Step 4: Remove glow after 6 seconds
    setTimeout(() => {
      button.classList.remove('glow-pulse');
    }, 7000);
  }
}

function showOverlayMessage(message) {
  const overlay = document.createElement('div');
  overlay.className = 'subscription-overlay';
  overlay.textContent = message;
  document.body.appendChild(overlay);

  // Fade in
  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 10);

  // Fade out and remove
  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 500);
  }, 2000);
}
```

#### 6.5 CSS for Glow Animation & Overlay

**Glow Pulse Animation:**
```css
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 0, 0, 1);
    transform: scale(1.05);
  }
}

.topic-chip.glow-pulse {
  animation: glowPulse 1.5s ease-in-out infinite;
  z-index: 1000;
}
```

**Subscription Overlay:**
```css
.subscription-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.88);
  color: white;
  padding: 1.2rem 2.5rem;
  border-radius: 0.8rem;
  font-size: 1.3rem;
  font-weight: 700;
  z-index: 10001;
  opacity: 0;
  transition: opacity 0.5s ease;
}
```

---

## 7. Rolling 12-Month Analytics Window

### Part 1: The User Workflow (The "Why")

The dashboard provides a **rolling 12-month window** for all analytics:

* **Always Relevant:** Users see only the last 12 months of data
* **Automatic Pruning:** Older months drop off automatically
* **Current Month Badge:** Shows "(Ongoing)" next to current month to indicate incomplete data
* **Consistent Timeline:** All 5 analytics panels (Reading, Voting, Notes, Time, Bookmarked) use the same month dropdown

---

### Part 2: The Technical Workflow (The "How")

#### 7.1 Month Dropdown Population Logic

**Backend Endpoint:** `GET /api/users/:userId/available-months`

**Logic:**
```javascript
app.get('/api/users/:userId/available-months', async (req, res) => {
  const { userId } = req.params;

  // Get user's join date
  const userResult = await db.query(
    'SELECT date_of_joining FROM users WHERE telegram_id = $1',
    [userId]
  );

  const joinDate = new Date(userResult.rows[0].date_of_joining);
  const currentDate = new Date();

  // Calculate 12 months back from current date
  const twelveMonthsAgo = new Date(currentDate);
  twelveMonthsAgo.setMonth(currentDate.getMonth() - 11);

  // Use the later date (join date or 12 months ago)
  const startDate = joinDate > twelveMonthsAgo ? joinDate : twelveMonthsAgo;

  // Generate month list
  const months = [];
  let iterDate = new Date(startDate);

  while (iterDate <= currentDate) {
    const monthKey = `${iterDate.getFullYear()}-${String(iterDate.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = `${iterDate.toLocaleString('en', { month: 'short' })} '${String(iterDate.getFullYear()).slice(-2)}`;

    // Add "(Ongoing)" badge to current month
    const isCurrentMonth = iterDate.getMonth() === currentDate.getMonth() &&
                          iterDate.getFullYear() === currentDate.getFullYear();

    months.push({
      value: monthKey,
      label: isCurrentMonth ? `${monthLabel} (Ongoing)` : monthLabel
    });

    iterDate.setMonth(iterDate.getMonth() + 1);
  }

  return res.json({ months });
});
```

**Response Example:**
```json
{
  "months": [
    { "value": "2024-11", "label": "Nov '24" },
    { "value": "2024-12", "label": "Dec '24" },
    { "value": "2025-01", "label": "Jan '25" },
    { "value": "2025-02", "label": "Feb '25" },
    { "value": "2025-03", "label": "Mar '25" },
    { "value": "2025-04", "label": "Apr '25" },
    { "value": "2025-05", "label": "May '25" },
    { "value": "2025-06", "label": "Jun '25" },
    { "value": "2025-07", "label": "Jul '25" },
    { "value": "2025-08", "label": "Aug '25" },
    { "value": "2025-09", "label": "Sep '25" },
    { "value": "2025-10", "label": "Oct '25 (Ongoing)" }
  ]
}
```

#### 7.2 Fortnight Selection Logic

**Frontend Implementation:**
```javascript
function populateFortnightDropdown(selectedMonth) {
  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const fortnightDropdown = document.getElementById('fortnight-select');
  fortnightDropdown.innerHTML = '';

  // First fortnight (1-15)
  const option1 = document.createElement('option');
  option1.value = '1';
  option1.textContent = '1st (1-15)';

  // Second fortnight (16-end)
  const option2 = document.createElement('option');
  option2.value = '2';
  option2.textContent = '2nd (16-end)';

  fortnightDropdown.appendChild(option1);
  fortnightDropdown.appendChild(option2);

  // If current month, select appropriate fortnight
  if (selectedMonth === currentMonthKey) {
    const currentDay = currentDate.getDate();
    fortnightDropdown.value = currentDay <= 15 ? '1' : '2';
  }
}
```

#### 7.3 Date Range Calculation

**Backend Helper Function:**
```javascript
function calculateDateRange(monthKey, fortnightIndex) {
  const [year, month] = monthKey.split('-').map(Number);

  let startDate, endDate;

  if (fortnightIndex === 1) {
    // First fortnight: 1-15
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month - 1, 15, 23, 59, 59);
  } else {
    // Second fortnight: 16-end of month
    startDate = new Date(year, month - 1, 16);
    endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month
  }

  return { startDate, endDate };
}
```

---

## 8. Complete Analytics Panel Types

The dashboard includes **5 distinct analytics panels**, all using the same rolling 12-month window and fortnight selection:

### 8.1 Reading Insight Panel

**Purpose:** Track reading progress and show unread articles

**Components:**
- Donut chart (articles read vs. total published)
- Unread articles list (scrollable table)

**API Endpoint:** `GET /api/users/:userId/reading-insight`

**Query Parameters:**
- `month` → "2025-10"
- `fortnight` → "1" or "2"

**Response:**
```json
{
  "total_published": 25,
  "total_read": 18,
  "unread_articles": [
    {
      "article_id": 123,
      "title": "India's Foreign Policy in 2025",
      "publish_date": "2025-10-12",
      "slug": "india-foreign-policy-2025"
    }
  ]
}
```

---

### 8.2 Voting Pattern Panel

**Purpose:** Show community rankings and identify missed top-voted articles

**Components:**
- "Tracker" button (opens live community ranking in new tab)
- Missed top-5 articles list (retrospective view)

**API Endpoint 1:** `GET /api/community/ranking` (Live tracker)

**Query Parameters:**
- `month` → "2025-10"
- `fortnight` → "1" or "2"

**Response:**
```json
{
  "rankings": [
    {
      "article_id": 145,
      "title": "Climate Change Policy Analysis",
      "vote_count": 327,
      "rank": 1
    },
    {
      "article_id": 142,
      "title": "Economic Reforms Update",
      "vote_count": 289,
      "rank": 2
    }
  ]
}
```

**API Endpoint 2:** `GET /api/users/:userId/missed-top-articles` (Retrospective)

**Query Parameters:**
- `month` → "2025-10"
- `fortnight` → "1" or "2"

**Response:**
```json
{
  "top_5_articles": [
    {
      "article_id": 145,
      "title": "Climate Change Policy Analysis",
      "vote_count": 327,
      "user_voted": false
    },
    {
      "article_id": 142,
      "title": "Economic Reforms Update",
      "vote_count": 289,
      "user_voted": true
    }
  ]
}
```

---

### 8.3 Notes Panel

**Purpose:** Track note-taking behavior and provide quick access to saved notes

**Components:**
- Donut chart (articles with notes vs. total articles)
- Notes list (scrollable, shows article title + note snippet)

**API Endpoint:** `GET /api/users/:userId/notes-insight`

**Query Parameters:**
- `month` → "2025-10"
- `fortnight` → "1" or "2"

**Response:**
```json
{
  "total_articles": 25,
  "articles_with_notes": 12,
  "notes": [
    {
      "article_id": 123,
      "article_title": "India's Foreign Policy in 2025",
      "note_snippet": "Key points: QUAD alliance, trade agreements...",
      "note_id": 456,
      "created_at": "2025-10-12T14:30:00Z"
    }
  ]
}
```

---

### 8.4 Time Spent Panel

**Purpose:** Visualize time spent reading articles and encourage consistent engagement

**Components:**
- Bar chart (daily time spent in minutes)
- Total time spent (formatted as hours and minutes)

**API Endpoint:** `GET /api/users/:userId/time-insight`

**Query Parameters:**
- `month` → "2025-10"
- `fortnight` → "1" or "2"

**Response:**
```json
{
  "total_minutes": 385,
  "total_hours": "6h 25m",
  "daily_breakdown": [
    { "date": "2025-10-01", "minutes": 45 },
    { "date": "2025-10-02", "minutes": 32 },
    { "date": "2025-10-03", "minutes": 0 },
    { "date": "2025-10-04", "minutes": 58 }
  ]
}
```

---

### 8.5 Bookmarked Articles Panel

**Purpose:** Provide quick access to saved/bookmarked articles

**Components:**
- Count of bookmarked articles
- Scrollable list of bookmarked articles with quick access links

**API Endpoint:** `GET /api/users/:userId/bookmarks-insight`

**Query Parameters:**
- `month` → "2025-10"
- `fortnight` → "1" or "2"

**Response:**
```json
{
  "total_bookmarked": 8,
  "bookmarks": [
    {
      "article_id": 134,
      "title": "Judicial Reforms in India",
      "bookmarked_at": "2025-10-08T16:20:00Z",
      "slug": "judicial-reforms-india"
    },
    {
      "article_id": 127,
      "title": "Digital Economy Growth",
      "bookmarked_at": "2025-10-05T11:45:00Z",
      "slug": "digital-economy-growth"
    }
  ]
}
```

---

## 9. Updated Dashboard API Endpoint (Complete)

**Endpoint:** `GET /api/users/:userId/dashboard-data`

**Query Parameters:**
- `month` → "2025-10"
- `fortnight` → "1" or "2"
- `panel` → "reading" | "voting" | "notes" | "time" | "bookmarks"

**Complete Response Structure:**
```json
{
  "user_profile": {
    "telegram_id": "681522234",
    "masked_id": "*****234",
    "display_name": "Deepanshu Anand",
    "username": "@D2313",
    "language": "en",
    "date_joined": "10 October 2025",
    "trial_end_date": "25 October 2025",
    "trial_active": true,
    "trial_extended": false
  },
  "referral_status": {
    "referrals_completed": 2,
    "referrals_needed": 1,
    "trial_extended": false,
    "referral_link": "https://samyakgyan.com/signup?ref=SG-DANAN-X7K2"
  },
  "subscription_status": {
    "current_affairs": {
      "status": "active",
      "start_date": "2025-10-26T00:00:00Z",
      "end_date": "2025-11-26T23:59:59Z"
    },
    "ethics_essay": {
      "status": "inactive",
      "start_date": null,
      "end_date": null
    }
  },
  "analytics": {
    "reading": {
      "total_published": 25,
      "total_read": 18,
      "unread_articles": [...]
    },
    "voting": {
      "rankings": [...],
      "top_5_missed": [...]
    },
    "notes": {
      "total_articles": 25,
      "articles_with_notes": 12,
      "notes": [...]
    },
    "time": {
      "total_minutes": 385,
      "total_hours": "6h 25m",
      "daily_breakdown": [...]
    },
    "bookmarks": {
      "total_bookmarked": 8,
      "bookmarks": [...]
    }
  },
  "available_months": [
    { "value": "2024-11", "label": "Nov '24" },
    { "value": "2025-10", "label": "Oct '25 (Ongoing)" }
  ]
}
```

---

## 10. Summary: Complete Workflow Integration

### Backend Requirements:

1. **Telegram OAuth Integration** → User authentication and profile creation
2. **Trial Management System** → 15-day initial + 15-day referral extension
3. **Referral Tracking** → Database triggers, Telegram bot messaging
4. **Subscription Management** → Razorpay integration, state tracking
5. **Access Control** → Pre-flight checks before content access
6. **Redirect Flow** → Dynamic URL parameters for dashboard highlighting
7. **Rolling 12-Month Window** → Automatic date calculations, month pruning
8. **5 Analytics Panels** → Reading, Voting, Notes, Time, Bookmarked

### Frontend Requirements:

1. **Telegram Login Button** → OAuth flow initiation
2. **Profile Display** → Masked user ID, formatted dates, trial countdown
3. **Referral Section** → Progress bar, "Send Link" button, Telegram integration
4. **Subscription Blocks** → Two independent blocks with state-based UI
5. **Access Control Logic** → Pre-flight checks on date/nav button clicks
6. **Highlight Flow** → URL parameter detection, auto-scroll, glow animation, overlay
7. **Month/Fortnight Dropdowns** → Dynamic population, "(Ongoing)" badge
8. **5 Analytics Panels** → D3.js charts, scrollable lists, live tracker button

### Key Success Metrics:

- **User Engagement:** Rolling 12-month window keeps users engaged long-term
- **Viral Growth:** Referral system incentivizes sharing
- **Revenue:** Two-subscription model maximizes monetization
- **Retention:** Trial extension rewards active users
- **UX Excellence:** Non-intrusive redirect flow educates users without blocking

---

**END OF DOCUMENTATION**

