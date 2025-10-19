# Complete URL Structure & Access Control Documentation

**Project:** Samyak Gyan
**Date:** October 2025
**Version:** 1.0
**Status:** Implementation Ready

---

## 🎯 OVERVIEW

This document outlines the complete URL routing structure for all article types and the subscription-based access control system.

**Key Design Decisions:**
- ✅ Same frontend (articles.html) for all article types
- ✅ Different URL patterns for SEO optimization
- ✅ Subscription-based access control
- ✅ Hidden archive pages (editorial, ethics, essay) without navigation buttons
- ✅ Dynamic "View All..." messages based on article type

---

## 📋 FINALIZED URL STRUCTURE

### 1. Current Affairs - News Articles

**URL Pattern:**
```
/upsc-current-affairs/:date/:slug
```

**Examples:**
```
/upsc-current-affairs/2025-10-18/india-semiconductor-policy
/upsc-current-affairs/2025-10-18/supreme-court-article-370-verdict
```

**Access Requirement:** `current_affairs` subscription

**Backend Route:**
```javascript
app.get('/upsc-current-affairs/:date/:slug', authenticateUser, async (req, res) => {
  const { date, slug } = req.params;
  const user = req.user;

  // Check subscription access
  if (!hasAccess(user, 'current_affairs')) {
    return res.redirect('/pricing?message=subscribe-current-affairs');
  }

  // Fetch article
  const article = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'news'
    AND publish_date = $1
    AND slug = $2
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

// Date-only view (all articles for specific date)
app.get('/upsc-current-affairs/:date', authenticateUser, async (req, res) => {
  const { date } = req.params;
  const user = req.user;

  if (!hasAccess(user, 'current_affairs')) {
    return res.redirect('/pricing?message=subscribe-current-affairs');
  }

  const articles = await db.query(`
    SELECT * FROM articles
    WHERE DATE(publish_date) = $1
    AND article_type IN ('news', 'editorial')
    ORDER BY created_at DESC
  `, [date]);

  res.render('articles', {
    articles: articles.rows,
    pageTitle: `UPSC Current Affairs - ${date}`,
    metaDescription: `All current affairs articles published on ${date}`
  });
});
```

---

### 2. Current Affairs - Editorial Articles

**URL Pattern:**
```
/upsc-current-affairs/editorial/:date/:slug
```

**Examples:**
```
/upsc-current-affairs/editorial/2025-10-18/climate-change-policy-analysis
/upsc-current-affairs/editorial/2025-10-18/india-china-border-tensions
```

**Access Requirement:** `current_affairs` subscription (same as news)

**Special Features:**
- Archive page at `/upsc-current-affairs/editorial/` (no nav button - hidden)
- "View All Editorials →" message at bottom of editorial articles

**Backend Routes:**
```javascript
// Specific editorial article
app.get('/upsc-current-affairs/editorial/:date/:slug', authenticateUser, async (req, res) => {
  const { date, slug } = req.params;
  const user = req.user;

  // Editorials require current_affairs subscription (same as news)
  if (!hasAccess(user, 'current_affairs')) {
    return res.redirect('/pricing?message=subscribe-current-affairs');
  }

  const article = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'editorial'
    AND publish_date = $1
    AND slug = $2
  `, [date, slug]);

  if (!article.rows[0]) {
    return res.status(404).render('404');
  }

  res.render('articles', {
    articles: [article.rows[0]],
    pageTitle: article.rows[0].meta_title || article.rows[0].title,
    metaDescription: article.rows[0].meta_description,
    canonicalUrl: `https://www.samyak-gyan.com/upsc-current-affairs/editorial/${date}/${slug}`
  });
});

// Editorial archive page (ALL editorials) - Hidden feature!
app.get('/upsc-current-affairs/editorial/', authenticateUser, async (req, res) => {
  const user = req.user;

  if (!hasAccess(user, 'current_affairs')) {
    return res.redirect('/pricing?message=subscribe-current-affairs');
  }

  const editorials = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'editorial'
    ORDER BY publish_date DESC
    LIMIT 100
  `);

  res.render('editorial-archive', {
    articles: editorials.rows,
    pageTitle: 'UPSC Editorial Analysis - Archive',
    metaDescription: 'Browse all editorial analyses for UPSC Mains preparation'
  });
});

// Editorials for specific date
app.get('/upsc-current-affairs/editorial/:date', authenticateUser, async (req, res) => {
  const { date } = req.params;
  const user = req.user;

  if (!hasAccess(user, 'current_affairs')) {
    return res.redirect('/pricing?message=subscribe-current-affairs');
  }

  const editorials = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'editorial'
    AND DATE(publish_date) = $1
    ORDER BY created_at DESC
  `, [date]);

  res.render('editorial-archive', {
    articles: editorials.rows,
    pageTitle: `UPSC Editorials - ${date}`,
    metaDescription: `Editorial analysis for ${date}`
  });
});
```

---

### 3. Ethics Case Studies (GS4)

**URL Pattern:**
```
/upsc-ethics-case-study/:date/:slug
```

**Examples:**
```
/upsc-ethics-case-study/2025-10-18/civil-servant-corruption-dilemma
/upsc-ethics-case-study/2025-10-18/whistleblower-ethical-analysis
```

**Access Requirement:** `ethics_essays` subscription

**Special Features:**
- Archive page at `/upsc-ethics-case-study/` (hidden feature)
- "View All Ethics Case Studies →" message at bottom

**Backend Routes:**
```javascript
// Specific ethics case study
app.get('/upsc-ethics-case-study/:date/:slug', authenticateUser, async (req, res) => {
  const { date, slug } = req.params;
  const user = req.user;

  // Ethics requires ethics_essays subscription
  if (!hasAccess(user, 'ethics_essays')) {
    return res.redirect('/pricing?message=subscribe-ethics-essays');
  }

  const article = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'ethics'
    AND publish_date = $1
    AND slug = $2
  `, [date, slug]);

  if (!article.rows[0]) {
    return res.status(404).render('404');
  }

  res.render('articles', {
    articles: [article.rows[0]],
    pageTitle: article.rows[0].meta_title || article.rows[0].title,
    metaDescription: article.rows[0].meta_description,
    canonicalUrl: `https://www.samyak-gyan.com/upsc-ethics-case-study/${date}/${slug}`
  });
});

// Ethics archive page (all case studies)
app.get('/upsc-ethics-case-study/', authenticateUser, async (req, res) => {
  const user = req.user;

  if (!hasAccess(user, 'ethics_essays')) {
    return res.redirect('/pricing?message=subscribe-ethics-essays');
  }

  const ethics = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'ethics'
    ORDER BY publish_date DESC
    LIMIT 100
  `);

  res.render('ethics-archive', {
    articles: ethics.rows,
    pageTitle: 'UPSC Ethics Case Studies (GS4) - Archive',
    metaDescription: 'Practice ethics case studies for UPSC GS4 preparation'
  });
});

// Ethics for specific date
app.get('/upsc-ethics-case-study/:date', authenticateUser, async (req, res) => {
  const { date } = req.params;
  const user = req.user;

  if (!hasAccess(user, 'ethics_essays')) {
    return res.redirect('/pricing?message=subscribe-ethics-essays');
  }

  const ethics = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'ethics'
    AND DATE(publish_date) = $1
    ORDER BY created_at DESC
  `, [date]);

  res.render('ethics-archive', {
    articles: ethics.rows,
    pageTitle: `UPSC Ethics - ${date}`,
    metaDescription: `Ethics case studies for ${date}`
  });
});
```

---

### 4. Essays

**URL Pattern:**
```
/upsc-essay/:date/:slug
```

**Examples:**
```
/upsc-essay/2025-10-18/technology-and-society-upsc-2025
/upsc-essay/2025-10-18/democracy-challenges-modern-world
```

**Access Requirement:** `ethics_essays` subscription

**Special Features:**
- Archive page at `/upsc-essay/` (hidden feature)
- "View All Essays →" message at bottom

**Backend Routes:**
```javascript
// Specific essay
app.get('/upsc-essay/:date/:slug', authenticateUser, async (req, res) => {
  const { date, slug } = req.params;
  const user = req.user;

  // Essays require ethics_essays subscription
  if (!hasAccess(user, 'ethics_essays')) {
    return res.redirect('/pricing?message=subscribe-ethics-essays');
  }

  const article = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'essay'
    AND publish_date = $1
    AND slug = $2
  `, [date, slug]);

  if (!article.rows[0]) {
    return res.status(404).render('404');
  }

  res.render('articles', {
    articles: [article.rows[0]],
    pageTitle: article.rows[0].meta_title || article.rows[0].title,
    metaDescription: article.rows[0].meta_description,
    canonicalUrl: `https://www.samyak-gyan.com/upsc-essay/${date}/${slug}`
  });
});

// Essay archive page (all essays)
app.get('/upsc-essay/', authenticateUser, async (req, res) => {
  const user = req.user;

  if (!hasAccess(user, 'ethics_essays')) {
    return res.redirect('/pricing?message=subscribe-ethics-essays');
  }

  const essays = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'essay'
    ORDER BY publish_date DESC
    LIMIT 100
  `);

  res.render('essay-archive', {
    articles: essays.rows,
    pageTitle: 'UPSC Essay Analysis - Archive',
    metaDescription: 'Read essay analyses for UPSC Mains preparation'
  });
});

// Essays for specific date
app.get('/upsc-essay/:date', authenticateUser, async (req, res) => {
  const { date} = req.params;
  const user = req.user;

  if (!hasAccess(user, 'ethics_essays')) {
    return res.redirect('/pricing?message=subscribe-ethics-essays');
  }

  const essays = await db.query(`
    SELECT * FROM articles
    WHERE article_type = 'essay'
    AND DATE(publish_date) = $1
    ORDER BY created_at DESC
  `, [date]);

  res.render('essay-archive', {
    articles: essays.rows,
    pageTitle: `UPSC Essays - ${date}`,
    metaDescription: `Essay analyses for ${date}`
  });
});
```

---

## 🔐 SUBSCRIPTION & ACCESS CONTROL SYSTEM

### Pricing Structure

**Package 1: Current Affairs (₹99/month)**
- **Includes:**
  - All news articles
  - All editorial articles
- **Database value:** `current_affairs`

**Package 2: Ethics + Essays (Separate pricing TBD)**
- **Includes:**
  - All ethics case studies
  - All essay analyses
- **Database value:** `ethics_essays`

**Package 3: Complete Bundle (Discounted)**
- **Includes:** Everything (current affairs + editorials + ethics + essays)
- **Database value:** `current_affairs,ethics_essays`

---

### Database Schema Updates

```sql
-- 1. Add article_type column to articles table
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS article_type VARCHAR(20) DEFAULT 'news';

-- Possible values: 'news', 'editorial', 'ethics', 'essay'

-- 2. Add subscription_required column
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS subscription_required VARCHAR(50) DEFAULT 'current_affairs';

-- Possible values: 'current_affairs' or 'ethics_essays'

-- 3. Update users table for subscription tracking
ALTER TABLE users
ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(100);

-- Possible values: 'current_affairs', 'ethics_essays', or 'current_affairs,ethics_essays'

ALTER TABLE users
ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMP;

-- 4. Create indexes for fast lookups
CREATE INDEX idx_articles_type ON articles(article_type);
CREATE INDEX idx_articles_subscription ON articles(subscription_required);
CREATE INDEX idx_users_subscription ON users(subscription_type);

-- 5. Update existing articles (migration)
UPDATE articles SET article_type = 'news' WHERE article_type IS NULL;
UPDATE articles SET subscription_required = 'current_affairs' WHERE subscription_required IS NULL;
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

/**
 * Example usage in route
 */
app.get('/upsc-current-affairs/:date/:slug', authenticateUser, async (req, res) => {
  // Access control check
  if (!hasAccess(req.user, 'current_affairs')) {
    return res.redirect('/pricing?message=subscribe-current-affairs');
  }

  // User has access, fetch and render article
  // ... article rendering code
});
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
        /upsc-current-affairs/2025-10-18/article-slug
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
 */
function updateURLPreview() {
  const type = document.getElementById('article-type-select').value;
  const date = document.getElementById('publish-date').value || '2025-10-18';
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
      url = `/upsc-current-affairs/editorial/${date}/${slug}`;
      subscription = 'current_affairs';
      subscriptionText = 'Requires: Current Affairs subscription (includes editorials)';
      break;
    case 'ethics':
      url = `/upsc-ethics-case-study/${date}/${slug}`;
      subscription = 'ethics_essays';
      subscriptionText = 'Requires: Ethics + Essays subscription';
      break;
    case 'essay':
      url = `/upsc-essay/${date}/${slug}`;
      subscription = 'ethics_essays';
      subscriptionText = 'Requires: Ethics + Essays subscription';
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
        canonicalUrl = `https://www.samyak-gyan.com/upsc-current-affairs/editorial/${date}/${slug}`;
        break;
      case 'ethics':
        canonicalUrl = `https://www.samyak-gyan.com/upsc-ethics-case-study/${date}/${slug}`;
        break;
      case 'essay':
        canonicalUrl = `https://www.samyak-gyan.com/upsc-essay/${date}/${slug}`;
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

  <!-- Archive Pages (Hidden Features - SEO Gold!) -->
  <url>
    <loc>https://www.samyak-gyan.com/upsc-current-affairs/editorial/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.samyak-gyan.com/upsc-ethics-case-study/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.samyak-gyan.com/upsc-essay/</loc>
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
      switch(article.article_type) {
        case 'news':
          url = `https://www.samyak-gyan.com/upsc-current-affairs/${date}/${article.slug}`;
          break;
        case 'editorial':
          url = `https://www.samyak-gyan.com/upsc-current-affairs/editorial/${date}/${article.slug}`;
          break;
        case 'ethics':
          url = `https://www.samyak-gyan.com/upsc-ethics-case-study/${date}/${article.slug}`;
          break;
        case 'essay':
          url = `https://www.samyak-gyan.com/upsc-essay/${date}/${article.slug}`;
          break;
        default:
          url = null; // Skip if invalid type
      }

      if (url) {
        xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${article.updated_at ? new Date(article.updated_at).toISOString().split('T')[0] : date}</lastmod>
    <changefreq>never</changefreq>
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
  // This is called automatically after article creation
  // Sitemap is generated on-the-fly, so no action needed
  // Just log for audit trail
  console.log('[SITEMAP] Sitemap regenerated at', new Date().toISOString());
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Backend Developer Must Complete:

**1. Database Updates:**
- [ ] Add `article_type` column to articles table
- [ ] Add `subscription_required` column to articles table
- [ ] Add `subscription_type` and `subscription_expiry` to users table
- [ ] Create indexes for performance
- [ ] Run migration scripts

**2. Backend Routes (Total: 16 routes):**
- [ ] GET `/upsc-current-affairs/:date/:slug` (news article)
- [ ] GET `/upsc-current-affairs/:date` (all articles for date)
- [ ] GET `/upsc-current-affairs/editorial/:date/:slug` (editorial article)
- [ ] GET `/upsc-current-affairs/editorial/:date` (editorials for date)
- [ ] GET `/upsc-current-affairs/editorial/` (all editorials archive)
- [ ] GET `/upsc-ethics-case-study/:date/:slug` (ethics article)
- [ ] GET `/upsc-ethics-case-study/:date` (ethics for date)
- [ ] GET `/upsc-ethics-case-study/` (all ethics archive)
- [ ] GET `/upsc-essay/:date/:slug` (essay article)
- [ ] GET `/upsc-essay/:date` (essays for date)
- [ ] GET `/upsc-essay/` (all essays archive)
- [ ] GET `/sitemap.xml` (updated for all article types)
- [ ] POST `/admin/articles/create` (with article type logic)

**3. Middleware:**
- [ ] `authenticateUser()` function
- [ ] `hasAccess(user, subscription)` helper
- [ ] `authenticateAdmin()` for admin panel

**4. Admin Panel:**
- [ ] Article upload form with type dropdown
- [ ] Dynamic URL preview (JavaScript)
- [ ] Subscription requirement auto-fill
- [ ] Character counters for SEO fields

**5. Templates (EJS/Pug/Handlebars):**
- [ ] `articles.ejs` (same for all types)
- [ ] `editorial-archive.ejs`
- [ ] `ethics-archive.ejs`
- [ ] `essay-archive.ejs`

### Frontend Already Complete ✅:
- ✅ Dynamic URL generation in script.js
- ✅ URL parsing for all patterns
- ✅ Archive link messages (editorial, ethics, essay)
- ✅ Article type field added to dummy data
- ✅ `updateURLForArticle()` function supports all types

---

## 🎯 TESTING CHECKLIST

**After implementation, test these scenarios:**

1. [ ] Create news article → Verify URL: `/upsc-current-affairs/2025-10-18/slug`
2. [ ] Create editorial → Verify URL: `/upsc-current-affairs/editorial/2025-10-18/slug`
3. [ ] Create ethics → Verify URL: `/upsc-ethics-case-study/2025-10-18/slug`
4. [ ] Create essay → Verify URL: `/upsc-essay/2025-10-18/slug`
5. [ ] Visit editorial archive → `/upsc-current-affairs/editorial/` (should work)
6. [ ] Visit ethics archive → `/upsc-ethics-case-study/` (should work)
7. [ ] Visit essay archive → `/upsc-essay/` (should work)
8. [ ] Expand editorial article → Check for "View All Editorials →" message
9. [ ] Expand ethics article → Check for "View All Ethics Case Studies →" message
10. [ ] Expand essay article → Check for "View All Essays →" message
11. [ ] Test access control: current_affairs user can access news + editorials
12. [ ] Test access control: ethics_essays user can access ethics + essays
13. [ ] Test access control: Deny access to wrong subscription type
14. [ ] Verify sitemap.xml includes all article types with correct URLs
15. [ ] Test admin panel dropdown → URL preview updates correctly

---

**END OF DOCUMENTATION**

© 2025 Deepanshu Anand - All Rights Reserved
