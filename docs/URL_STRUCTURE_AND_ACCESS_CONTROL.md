# Complete URL Structure & Access Control Documentation

**Project:** Samyak Gyan
**Date:** January 2025
**Version:** 2.0 (UPDATED)
**Status:** Implementation Ready

---

## 🎯 OVERVIEW

This document outlines the complete URL routing structure for all article types and the subscription-based access control system.

**Key Design Decisions:**
- ✅ Same frontend (articles.html) for all article types
- ✅ Different URL patterns for SEO optimization
- ✅ Subscription-based access control
- ✅ **Cleaner URLs**: `/upsc-editorials/` instead of `/upsc-current-affairs/editorial/`
- ✅ **Smart date strategy**: Dates for news/editorials, NO dates for ethics/essays
- ✅ **Combined landing page**: `/upsc-ethics-essays` for both ethics and essays
- ✅ **Pagination**: `/upsc-ethics-essays/page-1` for archived content
- ✅ **Dynamic URL updates**: URL changes when tile opens (Option A behavior)

---

## 📋 FINALIZED URL STRUCTURE

### 1. Current Affairs - News Articles

**Date Page URL (Mixed Content):**
```
/upsc-current-affairs/2025-01-18
```
- Shows: 3-5 news articles + 1-2 editorial articles (all tiles collapsed)
- User sees all content for that specific date

**Individual News Article URL:**
```
/upsc-current-affairs/:date/:slug
```

**Examples:**
```
/upsc-current-affairs/2025-01-18/india-semiconductor-policy
/upsc-current-affairs/2025-01-18/supreme-court-article-370-verdict
```

**Access Requirement:** `current_affairs` subscription

**User Flow:**
1. User clicks date "January 18, 2025" on calendar
2. Page loads at: `/upsc-current-affairs/2025-01-18`
3. User sees 5 tiles (3 news + 2 editorials) - all collapsed
4. User clicks NEWS tile
5. **URL updates to**: `/upsc-current-affairs/2025-01-18/news-slug` (using `history.pushState()`)
6. **Page URL stays**: `/upsc-current-affairs/2025-01-18` (Option A behavior ✅)
7. Tile expands, content shows
8. Back button returns to `/upsc-current-affairs/2025-01-18` with all tiles collapsed

**Backend Route:**
```javascript
// Date page - shows all articles for specific date
app.get('/upsc-current-affairs/:date', authenticateUser, async (req, res) => {
  const { date } = req.params;
  const user = req.user;

  // Check subscription access
  if (!hasAccess(user, 'current_affairs')) {
    return res.redirect('/pricing?message=subscribe-current-affairs');
  }

  // Fetch all articles for this date (news + editorials)
  const articles = await db.query(`
    SELECT * FROM articles
    WHERE DATE(publish_date) = $1
    AND article_type IN ('news', 'editorial')
    AND status = 'published'
    ORDER BY
      CASE WHEN article_type = 'news' THEN 1 ELSE 2 END,
      created_at DESC
  `, [date]);

  res.render('articles', {
    articles: articles.rows,
    pageTitle: `UPSC Current Affairs - ${formatDate(date)}`,
    metaDescription: `Current affairs and editorial analysis for ${formatDate(date)}`,
    canonicalUrl: `https://www.samyak-gyan.com/upsc-current-affairs/${date}`
  });
});

// Individual news article
app.get('/upsc-current-affairs/:date/:slug', authenticateUser, async (req, res) => {
  const { date, slug } = req.params;
  const user = req.user;

  if (!hasAccess(user, 'current_affairs')) {
    return res.redirect('/pricing?message=subscribe-current-affairs');
  }

  const article = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'news'
    AND DATE(publish_date) = $1
    AND slug = $2
    AND status = 'published'
  `, [date, slug]);

  if (!article.rows[0]) {
    return res.status(404).render('404');
  }

  res.render('articles', {
    articles: [article.rows[0]],
    pageTitle: article.rows[0].meta_title || article.rows[0].title,
    metaDescription: article.rows[0].meta_description,
    canonicalUrl: `https://www.samyak-gyan.com/upsc-current-affairs/${date}/${slug}`
  });
});
```

---

### 2. Current Affairs - Editorial Articles

**Individual Editorial Article URL:**
```
/upsc-editorials/:date/:slug
```

**Examples:**
```
/upsc-editorials/2025-01-18/climate-change-policy-analysis
/upsc-editorials/2025-01-18/india-china-border-tensions
```

**Access Requirement:** `current_affairs` subscription (same as news)

**Key Change from v1.0:**
- ✅ **OLD:** `/upsc-current-affairs/editorial/:date/:slug`
- ✅ **NEW:** `/upsc-editorials/:date/:slug` (cleaner, shorter!)

**User Flow:**
1. User on date page: `/upsc-current-affairs/2025-01-18`
2. User clicks EDITORIAL tile
3. **URL updates to**: `/upsc-editorials/2025-01-18/editorial-slug` (using `history.pushState()`)
4. **Page stays at**: `/upsc-current-affairs/2025-01-18` (Option A behavior ✅)
5. Tile expands, editorial content shows
6. Back button returns to date page with all tiles collapsed

**Backend Route:**
```javascript
// Individual editorial article
app.get('/upsc-editorials/:date/:slug', authenticateUser, async (req, res) => {
  const { date, slug } = req.params;
  const user = req.user;

  // Editorials require current_affairs subscription (same as news)
  if (!hasAccess(user, 'current_affairs')) {
    return res.redirect('/pricing?message=subscribe-current-affairs');
  }

  const article = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'editorial'
    AND DATE(publish_date) = $1
    AND slug = $2
    AND status = 'published'
  `, [date, slug]);

  if (!article.rows[0]) {
    return res.status(404).render('404');
  }

  res.render('articles', {
    articles: [article.rows[0]],
    pageTitle: article.rows[0].meta_title || article.rows[0].title,
    metaDescription: article.rows[0].meta_description,
    canonicalUrl: `https://www.samyak-gyan.com/upsc-editorials/${date}/${slug}`
  });
});
```

**Why Date in Editorial URLs?**
- ✅ Editorials are time-sensitive (linked to current news events)
- ✅ Shows freshness in Google search results
- ✅ Users know it's recent analysis, not old content
- ✅ Better CTR (Click-Through Rate)

---

### 3. Ethics & Essays - Combined Landing Page

**Landing Page URL (Latest Sunday's Content):**
```
/upsc-ethics-essays
```
- Shows: 5-10 tiles (mix of ethics case studies + essays from most recent Sunday)
- All tiles collapsed
- Upload schedule: Every Sunday

**Pagination URLs (Previous Sundays):**
```
/upsc-ethics-essays/page-1    ← Previous Sunday
/upsc-ethics-essays/page-2    ← 2 Sundays ago
/upsc-ethics-essays/page-3    ← 3 Sundays ago
```

**Access Requirement:** `ethics_essays` subscription

**User Flow:**
1. User clicks "Ethics & Essays" in navigation
2. Page loads at: `/upsc-ethics-essays`
3. User sees 7 tiles (4 ethics + 3 essays from latest Sunday) - all collapsed
4. User scrolls to bottom, clicks "Load Previous Sunday" button
5. **URL updates to**: `/upsc-ethics-essays/page-1` (using `history.pushState()`)
6. Previous Sunday's 6 articles load and append below current ones
7. User clicks "Load Previous Sunday" again
8. **URL updates to**: `/upsc-ethics-essays/page-2`
9. Even older Sunday's articles load below

**Why Page Numbers, Not Dates?**
- ✅ Simpler to implement
- ✅ Users understand "page 1, page 2" intuitively
- ✅ Content is timeless (ethics/essays don't expire)
- ✅ SEO-friendly (standard pagination pattern)
- ✅ No need to calculate which Sunday date

**Backend Routes:**
```javascript
// Landing page - latest Sunday's content
app.get('/upsc-ethics-essays', authenticateUser, async (req, res) => {
  const user = req.user;

  if (!hasAccess(user, 'ethics_essays')) {
    return res.redirect('/pricing?message=subscribe-ethics-essays');
  }

  // Get most recent Sunday's articles
  const latestSunday = await db.query(`
    SELECT DISTINCT DATE(publish_date) as sunday_date
    FROM articles
    WHERE article_type IN ('ethics', 'essay')
    AND EXTRACT(DOW FROM publish_date) = 0  -- Sunday = 0
    AND status = 'published'
    ORDER BY sunday_date DESC
    LIMIT 1
  `);

  const sundayDate = latestSunday.rows[0]?.sunday_date;

  const articles = await db.query(`
    SELECT * FROM articles
    WHERE article_type IN ('ethics', 'essay')
    AND DATE(publish_date) = $1
    AND status = 'published'
    ORDER BY
      CASE WHEN article_type = 'ethics' THEN 1 ELSE 2 END,
      created_at ASC
  `, [sundayDate]);

  res.render('ethics-essays', {
    articles: articles.rows,
    pageTitle: 'UPSC Ethics & Essays - Weekly Practice',
    metaDescription: 'Practice ethics case studies and essay writing for UPSC Mains preparation',
    canonicalUrl: 'https://www.samyak-gyan.com/upsc-ethics-essays',
    currentPage: 0
  });
});

// Pagination - previous Sundays
app.get('/upsc-ethics-essays/page-:pageNum', authenticateUser, async (req, res) => {
  const { pageNum } = req.params;
  const user = req.user;
  const page = parseInt(pageNum);

  if (!hasAccess(user, 'ethics_essays')) {
    return res.redirect('/pricing?message=subscribe-ethics-essays');
  }

  // Get Sunday dates ordered by recency
  const sundays = await db.query(`
    SELECT DISTINCT DATE(publish_date) as sunday_date
    FROM articles
    WHERE article_type IN ('ethics', 'essay')
    AND EXTRACT(DOW FROM publish_date) = 0  -- Sunday
    AND status = 'published'
    ORDER BY sunday_date DESC
    LIMIT 10 OFFSET $1
  `, [page]);

  if (sundays.rows.length === 0) {
    return res.status(404).render('404', { message: 'No more articles available' });
  }

  const sundayDate = sundays.rows[0].sunday_date;

  const articles = await db.query(`
    SELECT * FROM articles
    WHERE article_type IN ('ethics', 'essay')
    AND DATE(publish_date) = $1
    AND status = 'published'
    ORDER BY
      CASE WHEN article_type = 'ethics' THEN 1 ELSE 2 END,
      created_at ASC
  `, [sundayDate]);

  res.render('ethics-essays', {
    articles: articles.rows,
    pageTitle: `UPSC Ethics & Essays - Page ${page}`,
    metaDescription: 'Archive of ethics case studies and essay analyses',
    canonicalUrl: `https://www.samyak-gyan.com/upsc-ethics-essays/page-${page}`,
    currentPage: page
  });
});
```

---

### 4. Ethics Case Studies (GS4)

**Individual Ethics Article URL:**
```
/upsc-ethics/:slug
```

**Examples:**
```
/upsc-ethics/whistleblower-dilemma-case-study
/upsc-ethics/civil-servant-corruption-ethical-analysis
/upsc-ethics/bureaucratic-neutrality-case
```

**Access Requirement:** `ethics_essays` subscription

**Key Change from v1.0:**
- ✅ **OLD:** `/upsc-ethics-case-study/:date/:slug`
- ✅ **NEW:** `/upsc-ethics/:slug` (NO DATE - timeless content!)

**User Flow:**
1. User on `/upsc-ethics-essays` (landing page)
2. User clicks ETHICS tile
3. **URL updates to**: `/upsc-ethics/whistleblower-dilemma` (using `history.pushState()`)
4. **Page stays at**: `/upsc-ethics-essays` (Option A behavior ✅)
5. Tile expands, ethics case study shows
6. Back button returns to landing page with all tiles collapsed

**Why NO Date in URL?**
- ✅ Ethics case studies are **TIMELESS**
- ✅ "Whistleblower dilemma" is relevant in 2025, 2026, 2030
- ✅ URL doesn't look "old" after 6 months
- ✅ Better long-term Google ranking
- ✅ Cleaner, more shareable URLs

**Backend Route:**
```javascript
// Individual ethics case study
app.get('/upsc-ethics/:slug', authenticateUser, async (req, res) => {
  const { slug } = req.params;
  const user = req.user;

  if (!hasAccess(user, 'ethics_essays')) {
    return res.redirect('/pricing?message=subscribe-ethics-essays');
  }

  const article = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'ethics'
    AND slug = $1
    AND status = 'published'
  `, [slug]);

  if (!article.rows[0]) {
    return res.status(404).render('404');
  }

  res.render('articles', {
    articles: [article.rows[0]],
    pageTitle: article.rows[0].meta_title || article.rows[0].title,
    metaDescription: article.rows[0].meta_description,
    canonicalUrl: `https://www.samyak-gyan.com/upsc-ethics/${slug}`
  });
});
```

---

### 5. Essays

**Individual Essay Article URL:**
```
/upsc-essays/:slug
```

**Examples:**
```
/upsc-essays/technology-and-society-upsc-2025
/upsc-essays/democracy-challenges-modern-world
/upsc-essays/india-demographic-dividend-analysis
```

**Access Requirement:** `ethics_essays` subscription

**Key Change from v1.0:**
- ✅ **OLD:** `/upsc-essay/:date/:slug`
- ✅ **NEW:** `/upsc-essays/:slug` (NO DATE - timeless content!)

**User Flow:**
1. User on `/upsc-ethics-essays/page-1` (archived content)
2. User clicks ESSAY tile
3. **URL updates to**: `/upsc-essays/climate-change-cooperation` (using `history.pushState()`)
4. **Page stays at**: `/upsc-ethics-essays/page-1` (Option A behavior ✅)
5. Tile expands, essay analysis shows
6. Back button returns to page-1 with all tiles collapsed

**Why NO Date in URL?**
- ✅ Essay analyses are **EVERGREEN**
- ✅ "Technology and Society" topic remains relevant for years
- ✅ URL stays fresh-looking indefinitely
- ✅ Better SEO for long-tail keywords
- ✅ Professional, clean URLs

**Backend Route:**
```javascript
// Individual essay analysis
app.get('/upsc-essays/:slug', authenticateUser, async (req, res) => {
  const { slug } = req.params;
  const user = req.user;

  if (!hasAccess(user, 'ethics_essays')) {
    return res.redirect('/pricing?message=subscribe-ethics-essays');
  }

  const article = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'essay'
    AND slug = $1
    AND status = 'published'
  `, [slug]);

  if (!article.rows[0]) {
    return res.status(404).render('404');
  }

  res.render('articles', {
    articles: [article.rows[0]],
    pageTitle: article.rows[0].meta_title || article.rows[0].title,
    metaDescription: article.rows[0].meta_description,
    canonicalUrl: `https://www.samyak-gyan.com/upsc-essays/${slug}`
  });
});
```

---

## 🔐 SUBSCRIPTION & ACCESS CONTROL SYSTEM

### Pricing Structure

**Package 1: Current Affairs (₹99/month)**
- **Includes:**
  - All news articles (`/upsc-current-affairs/...`)
  - All editorial articles (`/upsc-editorials/...`)
- **Database value:** `current_affairs`

**Package 2: Ethics + Essays (Separate pricing TBD)**
- **Includes:**
  - All ethics case studies (`/upsc-ethics/...`)
  - All essay analyses (`/upsc-essays/...`)
- **Database value:** `ethics_essays`

**Package 3: Complete Bundle (Discounted)**
- **Includes:** Everything (current affairs + editorials + ethics + essays)
- **Database value:** `current_affairs,ethics_essays`

---

### Database Schema Updates

```sql
-- 1. Add article_type column to articles table (if not exists)
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS article_type VARCHAR(20) DEFAULT 'news';

-- Possible values: 'news', 'editorial', 'ethics', 'essay'

-- 2. Add subscription_required column
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS subscription_required VARCHAR(50) DEFAULT 'current_affairs';

-- Possible values: 'current_affairs' or 'ethics_essays'

-- 3. Add slug column (UNIQUE - no date needed for ethics/essays!)
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- 4. Add canonical_url column
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(500);

-- 5. Add status column
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';

-- Possible values: 'draft', 'published', 'archived'

-- 6. Update users table for subscription tracking
ALTER TABLE users
ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(100);

-- Possible values: 'current_affairs', 'ethics_essays', or 'current_affairs,ethics_essays'

ALTER TABLE users
ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMP;

-- 7. Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_articles_type ON articles(article_type);
CREATE INDEX IF NOT EXISTS idx_articles_subscription ON articles(subscription_required);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_type);

-- 8. Create index for Sunday queries (ethics/essays)
CREATE INDEX IF NOT EXISTS idx_articles_sunday ON articles(publish_date)
WHERE EXTRACT(DOW FROM publish_date) = 0;
```

---

### Access Control Middleware

```javascript
/**
 * Middleware: Authenticate user
 * Checks if user is logged in via Telegram OAuth
 */
function authenticateUser(req, res, next) {
  const userId = req.session.userId;

  if (!userId) {
    return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
  }

  // Fetch user from database
  db.query('SELECT * FROM users WHERE user_id = $1', [userId])
    .then(result => {
      if (!result.rows[0]) {
        return res.redirect('/login');
      }

      req.user = result.rows[0];
      next();
    })
    .catch(err => {
      console.error('Auth error:', err);
      res.status(500).send('Server error');
    });
}

/**
 * Helper: Check if user has access to specific content type
 * @param {Object} user - User object from database
 * @param {String} requiredSubscription - 'current_affairs' or 'ethics_essays'
 * @returns {Boolean} - True if user has access
 */
function hasAccess(user, requiredSubscription) {
  // Check if trial period active
  if (user.trial_expiry && new Date(user.trial_expiry) > new Date()) {
    return true; // Trial users have access to everything
  }

  // Check if subscription expired
  if (user.subscription_expiry && new Date(user.subscription_expiry) < new Date()) {
    return false; // Subscription expired
  }

  // Check if user has required subscription
  const userSubs = user.subscription_type ? user.subscription_type.split(',') : [];

  return userSubs.includes(requiredSubscription);
}
```

---

## 🎨 ADMIN PANEL: ARTICLE UPLOAD FORM

### HTML Form with Dynamic URL Preview

```html
<form id="article-upload-form" method="POST" action="/admin/articles/create">

  <!-- Basic Article Fields -->
  <div class="form-group">
    <label>Article Title:</label>
    <input type="text" name="title" id="article-title" placeholder="Enter article title" required>
  </div>

  <div class="form-group">
    <label>Content:</label>
    <textarea name="content" rows="15" placeholder="Article content..." required></textarea>
  </div>

  <div class="form-group">
    <label>Publish Date:</label>
    <input type="date" name="publish_date" id="publish-date" required>
  </div>

  <!-- Article Type Selection (CRITICAL!) -->
  <fieldset style="border: 2px solid #fc7306; padding: 1.5rem; margin: 1.5rem 0; border-radius: 8px;">
    <legend style="font-weight: bold; color: #fc7306; font-size: 1.1rem;">Article Category</legend>

    <div class="form-group">
      <label>Select Article Type:</label>
      <select name="article_type" id="article-type-select" required style="font-size: 1rem; padding: 0.5rem;">
        <option value="news">Current Affairs - News</option>
        <option value="editorial">Current Affairs - Editorial</option>
        <option value="ethics">Ethics Case Study (GS4)</option>
        <option value="essay">Essay Analysis</option>
      </select>
    </div>

    <!-- Auto-filled based on article type -->
    <input type="hidden" name="subscription_required" id="subscription-required" value="current_affairs">

    <!-- URL Preview Box -->
    <div style="margin-top: 1.5rem; padding: 1.5rem; background: #f3f4f6; border-radius: 8px; border-left: 4px solid #fc7306;">
      <strong style="display: block; margin-bottom: 0.5rem;">📌 Generated URL Preview:</strong>
      <p id="url-preview-text" style="color: #fc7306; font-family: 'Courier New', monospace; font-size: 1rem; margin: 0.5rem 0; word-break: break-all;">
        /upsc-current-affairs/2025-01-18/article-slug
      </p>
      <small style="color: #6b7280; display: block; margin-top: 0.5rem;">
        ✓ URL updates automatically based on article type and date
      </small>
      <small id="subscription-message" style="color: #059669; display: block; margin-top: 0.25rem;">
        Requires: Current Affairs subscription
      </small>
    </div>
  </fieldset>

  <!-- SEO Fields -->
  <fieldset style="border: 1px solid #d1d5db; padding: 1rem; margin: 1rem 0; border-radius: 4px;">
    <legend style="font-weight: 600;">SEO Optimization</legend>

    <div class="form-group">
      <label>Meta Title (max 70 characters):</label>
      <input type="text" name="meta_title" id="meta-title" maxlength="70">
      <small id="meta-title-counter" style="color: #6b7280;">0/70</small>
    </div>

    <div class="form-group">
      <label>Meta Description (max 160 characters):</label>
      <textarea name="meta_description" id="meta-description" maxlength="160" rows="3"></textarea>
      <small id="meta-desc-counter" style="color: #6b7280;">0/160</small>
    </div>

    <div class="form-group">
      <label>Keywords (comma-separated):</label>
      <input type="text" name="meta_keywords" placeholder="upsc, current affairs, editorial, india">
    </div>

    <div class="form-group">
      <label>URL Slug (auto-generated, editable):</label>
      <input type="text" name="slug" id="slug-input" required>
    </div>
  </fieldset>

  <!-- Submit Button -->
  <button type="submit" style="background: #fc7306; color: white; padding: 1rem 3rem; font-size: 1.1rem; border: none; border-radius: 4px; cursor: pointer;">
    Publish Article
  </button>
</form>

<script>
// ========================================
// AUTO-UPDATE URL PREVIEW & SUBSCRIPTION
// ========================================

document.getElementById('article-type-select').addEventListener('change', updateURLPreview);
document.getElementById('publish-date').addEventListener('change', updateURLPreview);
document.getElementById('article-title').addEventListener('input', updateSlugAndURL);
document.getElementById('slug-input').addEventListener('input', updateURLPreview);

/**
 * Generate slug from title
 */
function updateSlugAndURL(e) {
  const title = e.target.value;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  document.getElementById('slug-input').value = slug;
  updateURLPreview();
}

/**
 * Update URL preview based on article type, date, and slug
 * NEW LOGIC: Ethics and Essays do NOT include date in URL!
 */
function updateURLPreview() {
  const type = document.getElementById('article-type-select').value;
  const date = document.getElementById('publish-date').value || '2025-01-18';
  const slug = document.getElementById('slug-input').value || 'article-slug';

  const subscriptionField = document.getElementById('subscription-required');
  const urlPreview = document.getElementById('url-preview-text');
  const subscriptionMessage = document.getElementById('subscription-message');

  let url, subscription, subscriptionText;

  switch(type) {
    case 'news':
      url = `/upsc-current-affairs/${date}/${slug}`;
      subscription = 'current_affairs';
      subscriptionText = 'Requires: Current Affairs subscription';
      break;
    case 'editorial':
      url = `/upsc-editorials/${date}/${slug}`;
      subscription = 'current_affairs';
      subscriptionText = 'Requires: Current Affairs subscription (includes editorials)';
      break;
    case 'ethics':
      url = `/upsc-ethics/${slug}`;  // NO DATE!
      subscription = 'ethics_essays';
      subscriptionText = 'Requires: Ethics + Essays subscription | NO DATE in URL (timeless content)';
      break;
    case 'essay':
      url = `/upsc-essays/${slug}`;  // NO DATE!
      subscription = 'ethics_essays';
      subscriptionText = 'Requires: Ethics + Essays subscription | NO DATE in URL (timeless content)';
      break;
  }

  urlPreview.textContent = url;
  subscriptionField.value = subscription;
  subscriptionMessage.textContent = subscriptionText;
}

// Initialize on page load
updateURLPreview();

// ========================================
// CHARACTER COUNTERS
// ========================================

document.getElementById('meta-title').addEventListener('input', e => {
  document.getElementById('meta-title-counter').textContent = `${e.target.value.length}/70`;
});

document.getElementById('meta-description').addEventListener('input', e => {
  document.getElementById('meta-desc-counter').textContent = `${e.target.value.length}/160`;
});
</script>

<style>
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
}
</style>
```

---

### Backend: Article Creation Handler

```javascript
app.post('/admin/articles/create', authenticateAdmin, async (req, res) => {
  const {
    title,
    content,
    publish_date,
    article_type,
    subscription_required,
    meta_title,
    meta_description,
    meta_keywords,
    slug
  } = req.body;

  try {
    // 1. Validate slug uniqueness
    const existingSlug = await db.query(
      'SELECT id FROM articles WHERE slug = $1',
      [slug]
    );

    if (existingSlug.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Slug already exists',
        message: 'Please use a different title or manually edit the slug'
      });
    }

    // 2. Generate canonical URL based on article type
    const date = new Date(publish_date).toISOString().split('T')[0]; // YYYY-MM-DD format

    let canonicalUrl;
    switch(article_type) {
      case 'news':
        canonicalUrl = `https://www.samyak-gyan.com/upsc-current-affairs/${date}/${slug}`;
        break;
      case 'editorial':
        canonicalUrl = `https://www.samyak-gyan.com/upsc-editorials/${date}/${slug}`;
        break;
      case 'ethics':
        canonicalUrl = `https://www.samyak-gyan.com/upsc-ethics/${slug}`;  // NO DATE!
        break;
      case 'essay':
        canonicalUrl = `https://www.samyak-gyan.com/upsc-essays/${slug}`;  // NO DATE!
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid article type'
        });
    }

    // 3. Insert article into database
    const result = await db.query(`
      INSERT INTO articles (
        title, content, publish_date, article_type, subscription_required,
        meta_title, meta_description, meta_keywords,
        slug, canonical_url, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'published', NOW())
      RETURNING id, slug, article_type, canonical_url, publish_date
    `, [
      title,
      content,
      publish_date,
      article_type,
      subscription_required,
      meta_title || title, // Fallback to title if meta_title empty
      meta_description || content.substring(0, 160), // Fallback to first 160 chars
      meta_keywords,
      slug,
      canonicalUrl
    ]);

    // 4. Regenerate sitemap.xml (important for SEO!)
    await regenerateSitemap();

    // 5. Log admin action
    await db.query(`
      INSERT INTO admin_logs (admin_id, action, details, created_at)
      VALUES ($1, 'article_created', $2, NOW())
    `, [req.user.id, JSON.stringify({ article_id: result.rows[0].id, title, article_type })]);

    // 6. Send success response
    res.json({
      success: true,
      message: 'Article published successfully!',
      article: result.rows[0],
      url: canonicalUrl
    });

  } catch (error) {
    console.error('Article creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Failed to create article. Please try again.'
    });
  }
});
```

---

## 📊 SITEMAP.XML GENERATION

### Updated Sitemap Generator for All Article Types

```javascript
app.get('/sitemap.xml', async (req, res) => {
  try {
    // Fetch all published articles
    const articles = await db.query(`
      SELECT slug, publish_date, article_type, updated_at
      FROM articles
      WHERE status = 'published'
      ORDER BY publish_date DESC
    `);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Homepage -->
  <url>
    <loc>https://www.samyak-gyan.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Ethics & Essays Landing Page -->
  <url>
    <loc>https://www.samyak-gyan.com/upsc-ethics-essays</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Static Pages -->
  <url>
    <loc>https://www.samyak-gyan.com/pricing</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.samyak-gyan.com/how-to-use</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

    // Add all articles with correct URL based on type
    articles.rows.forEach(article => {
      const date = new Date(article.publish_date).toISOString().split('T')[0]; // YYYY-MM-DD

      let url;
      let changefreq;

      switch(article.article_type) {
        case 'news':
          url = `https://www.samyak-gyan.com/upsc-current-affairs/${date}/${article.slug}`;
          changefreq = 'never';  // News articles don't change
          break;
        case 'editorial':
          url = `https://www.samyak-gyan.com/upsc-editorials/${date}/${article.slug}`;
          changefreq = 'never';  // Editorials don't change
          break;
        case 'ethics':
          url = `https://www.samyak-gyan.com/upsc-ethics/${article.slug}`;  // NO DATE
          changefreq = 'monthly';  // Evergreen content, may update
          break;
        case 'essay':
          url = `https://www.samyak-gyan.com/upsc-essays/${article.slug}`;  // NO DATE
          changefreq = 'monthly';  // Evergreen content, may update
          break;
        default:
          url = null; // Skip if invalid type
      }

      if (url) {
        xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${article.updated_at ? new Date(article.updated_at).toISOString().split('T')[0] : date}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    });

    xml += `
</urlset>`;

    // Set correct headers
    res.header('Content-Type', 'application/xml');
    res.send(xml);

  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

/**
 * Helper: Regenerate sitemap (called after new article published)
 */
async function regenerateSitemap() {
  // Sitemap is generated on-the-fly, so no action needed
  // Just log for audit trail
  console.log('[SITEMAP] Sitemap regenerated at', new Date().toISOString());
}
```

---

## 📋 COMPLETE URL STRUCTURE SUMMARY

### Current Affairs Section:
```
Date Page (Mixed):   /upsc-current-affairs/2025-01-18
                     (Shows 3-5 news + 1-2 editorials, all collapsed)

News Article:        /upsc-current-affairs/2025-01-18/article-slug
Editorial Article:   /upsc-editorials/2025-01-18/article-slug
```

### Ethics & Essays Section:
```
Landing Page:        /upsc-ethics-essays
                     (Latest Sunday's 5-10 articles)

Previous Sunday:     /upsc-ethics-essays/page-1
2 Sundays Ago:       /upsc-ethics-essays/page-2
3 Sundays Ago:       /upsc-ethics-essays/page-3

Ethics Article:      /upsc-ethics/article-slug (NO DATE - timeless!)
Essay Article:       /upsc-essays/article-slug (NO DATE - timeless!)
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Backend Developer Must Complete:

**1. Database Updates:**
- [ ] Add `article_type` column to articles table
- [ ] Add `subscription_required` column
- [ ] Add `slug` column (UNIQUE constraint)
- [ ] Add `canonical_url` column
- [ ] Add `status` column
- [ ] Add subscription columns to users table
- [ ] Create all indexes
- [ ] Create Sunday index for ethics/essays queries

**2. Backend Routes (Total: 10 routes):**
- [ ] GET `/upsc-current-affairs/:date` (date page - mixed news + editorials)
- [ ] GET `/upsc-current-affairs/:date/:slug` (individual news article)
- [ ] GET `/upsc-editorials/:date/:slug` (individual editorial)
- [ ] GET `/upsc-ethics-essays` (landing page - latest Sunday)
- [ ] GET `/upsc-ethics-essays/page-:pageNum` (pagination - previous Sundays)
- [ ] GET `/upsc-ethics/:slug` (individual ethics case study - NO DATE)
- [ ] GET `/upsc-essays/:slug` (individual essay - NO DATE)
- [ ] GET `/sitemap.xml` (updated for new URL structure)
- [ ] POST `/admin/articles/create` (with new URL logic)

**3. Middleware:**
- [ ] `authenticateUser()` function
- [ ] `hasAccess(user, subscription)` helper
- [ ] `authenticateAdmin()` for admin panel

**4. Admin Panel:**
- [ ] Article upload form with type dropdown
- [ ] Dynamic URL preview (shows date for news/editorials, NO date for ethics/essays)
- [ ] Subscription requirement auto-fill
- [ ] Character counters for SEO fields

**5. Frontend JavaScript:**
- [ ] Update `history.pushState()` logic for tile opening
- [ ] Detect article type and build correct URL
- [ ] Handle pagination for `/upsc-ethics-essays/page-X`
- [ ] Implement "Load Previous Sunday" button

---

## 🎯 TESTING CHECKLIST

**After implementation, test these scenarios:**

1. [ ] Create news article → Verify URL: `/upsc-current-affairs/2025-01-18/slug`
2. [ ] Create editorial → Verify URL: `/upsc-editorials/2025-01-18/slug`
3. [ ] Create ethics → Verify URL: `/upsc-ethics/slug` (NO DATE!)
4. [ ] Create essay → Verify URL: `/upsc-essays/slug` (NO DATE!)
5. [ ] Visit date page → See mixed news + editorials (all collapsed)
6. [ ] Open news tile → URL updates to `/upsc-current-affairs/2025-01-18/slug`
7. [ ] Open editorial tile → URL updates to `/upsc-editorials/2025-01-18/slug`
8. [ ] Press back button → Return to date page with all tiles collapsed
9. [ ] Visit `/upsc-ethics-essays` → See latest Sunday's 5-10 articles
10. [ ] Open ethics tile → URL updates to `/upsc-ethics/slug`
11. [ ] Open essay tile → URL updates to `/upsc-essays/slug`
12. [ ] Click "Load Previous Sunday" → URL updates to `/upsc-ethics-essays/page-1`
13. [ ] Click again → URL updates to `/upsc-ethics-essays/page-2`
14. [ ] Test access control: current_affairs user can access news + editorials
15. [ ] Test access control: ethics_essays user can access ethics + essays
16. [ ] Verify sitemap.xml includes all article types with correct URLs
17. [ ] Test admin panel → URL preview shows/hides date correctly

---

## 🚀 SEO BENEFITS OF NEW STRUCTURE

### ✅ **Cleaner URLs = Better UX & SEO**
- `/upsc-editorials/` vs `/upsc-current-affairs/editorial/` (shorter!)
- `/upsc-ethics/slug` vs `/upsc-ethics-case-study/2025-01-18/slug` (much cleaner!)

### ✅ **Smart Date Strategy**
- News + Editorials: Include date (shows freshness)
- Ethics + Essays: NO date (evergreen, timeless)

### ✅ **Clear Content Hierarchy**
```
/upsc-current-affairs/    ← Category 1
/upsc-editorials/         ← Category 2
/upsc-ethics/             ← Category 3
/upsc-essays/             ← Category 4
/upsc-ethics-essays/      ← Combined landing
```

### ✅ **Standard Pagination**
- `/upsc-ethics-essays/page-1`, `/page-2`, etc.
- Google crawls and indexes automatically

### ✅ **Unique, Shareable URLs**
- Each article gets its own clean URL
- Perfect for social sharing, bookmarking

---

**END OF DOCUMENTATION**

© 2025 Deepanshu Anand - All Rights Reserved
