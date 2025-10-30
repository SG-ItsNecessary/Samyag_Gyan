// ================================================
// ARTICLE ACCESS CONTROL SYSTEM
// ================================================
// Checks subscription status before allowing article access
// Blocks expired trial users without active subscription
// Shows "Subscribe Now" popup for unauthorized access

/**
 * Check if user has access to specific article type
 * @param {String} articleType - 'news', 'editorial', 'ethics', 'essay'
 * @returns {Promise<Object>} - { hasAccess: boolean, reason: string }
 */
async function checkArticleAccess(articleType) {
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    return {
      hasAccess: false,
      reason: 'not_logged_in',
      message: 'Please login to access articles'
    };
  }

  try {
    // Fetch user status from backend
    const response = await fetch(`http://localhost:3000/api/users/${userId}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user status');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to check access');
    }

    const status = data.status;

    // Determine required subscription based on article type
    let requiredSubscription;

    if (articleType === 'news' || articleType === 'editorial') {
      requiredSubscription = 'current_affairs';
    } else if (articleType === 'ethics' || articleType === 'essay') {
      requiredSubscription = 'ethics_essays';
    } else {
      return {
        hasAccess: false,
        reason: 'invalid_article_type',
        message: 'Invalid article type'
      };
    }

    // Check 1: Is trial active?
    if (status.trial_active) {
      console.log('✅ Access granted: Trial active');
      return {
        hasAccess: true,
        reason: 'trial_active',
        message: 'Trial access granted'
      };
    }

    // Check 2: Is subscription active?
    if (status.subscription_active) {
      // Check if user has required subscription
      const userSubscriptions = status.subscribed_topics || [];

      // Check if user has the required subscription
      // Note: subscribed_topics returns array like ['current-affairs'] or ['ethics-essay']
      // But we need to check against subscription packages

      // For now, if subscription is active, grant access to everything
      // TODO: Later implement package-based access when you have subscription packages
      console.log('✅ Access granted: Subscription active');
      return {
        hasAccess: true,
        reason: 'subscription_active',
        message: 'Subscription access granted'
      };
    }

    // Check 3: Trial expired + no subscription
    console.log('❌ Access denied: Trial expired, no active subscription');
    return {
      hasAccess: false,
      reason: 'trial_expired',
      message: 'Your trial has ended. Please subscribe to continue.',
      trialEndDate: status.trial_end_date
    };

  } catch (error) {
    console.error('Access control error:', error);
    return {
      hasAccess: false,
      reason: 'error',
      message: 'Failed to verify access. Please ensure backend is running.'
    };
  }
}

/**
 * Show subscription popup when access is denied
 * @param {String} reason - Reason for denial
 * @param {String} message - Message to display
 * @param {String} articleType - Type of article user tried to access
 */
function showSubscriptionPopup(reason, message, articleType) {
  // Check if popup already exists
  let popup = document.getElementById('access-denied-popup');

  if (!popup) {
    // Create popup
    popup = document.createElement('div');
    popup.id = 'access-denied-popup';
    popup.className = 'access-denied-overlay';
    document.body.appendChild(popup);
  }

  // Determine subscription package needed
  let packageName, packagePrice, packageFeatures;

  if (articleType === 'news' || articleType === 'editorial') {
    packageName = 'Current Affairs';
    packagePrice = '₹99/month';
    packageFeatures = [
      'Daily news articles',
      'In-depth editorial analysis',
      'Keyword highlighting',
      'Downloadable notes',
      'Summary generation'
    ];
  } else if (articleType === 'ethics' || articleType === 'essay') {
    packageName = 'Ethics & Essays';
    packagePrice = 'TBD'; // You'll set this later
    packageFeatures = [
      'Weekly ethics case studies',
      'Essay writing practice',
      'GS4 preparation',
      'Model answers',
      'Personalized notes'
    ];
  }

  popup.innerHTML = `
    <div class="access-denied-box">
      <button class="access-denied-close" onclick="closeSubscriptionPopup()">×</button>

      <div class="access-denied-icon">🔒</div>

      <h2 class="access-denied-title">${reason === 'not_logged_in' ? 'Login Required' : 'Subscription Required'}</h2>

      <p class="access-denied-message">${message}</p>

      ${reason !== 'not_logged_in' ? `
        <div class="access-denied-package">
          <h3>Subscribe to ${packageName}</h3>
          <div class="access-denied-price">${packagePrice}</div>
          <ul class="access-denied-features">
            ${packageFeatures.map(feature => `<li>✓ ${feature}</li>`).join('')}
          </ul>
        </div>

        <button class="access-denied-btn" onclick="window.location.href='/pricing'">
          Subscribe Now
        </button>

        <p class="access-denied-note">
          Or refer 3 friends to get 15 days free trial extension!
          <a href="/user_dashboard_testbed.html" style="color: #fc7306; text-decoration: underline;">See Referral Details</a>
        </p>
      ` : `
        <button class="access-denied-btn" onclick="window.location.href='/profile-mock.html'">
          Login to Continue
        </button>
      `}
    </div>
  `;

  popup.style.display = 'flex';
}

/**
 * Close subscription popup
 */
function closeSubscriptionPopup() {
  const popup = document.getElementById('access-denied-popup');
  if (popup) {
    popup.style.display = 'none';
  }
}

/**
 * Main access control check before loading article
 * Call this BEFORE loading any article content
 * @param {String} articleType - Type of article to load
 * @returns {Promise<Boolean>} - True if access granted, false if denied
 */
async function verifyAndLoadArticle(articleType) {
  console.log(`🔒 Checking access for article type: ${articleType}`);

  const accessResult = await checkArticleAccess(articleType);

  if (accessResult.hasAccess) {
    console.log('✅ Access granted, loading article...');
    return true;
  } else {
    console.log('❌ Access denied:', accessResult.reason);
    showSubscriptionPopup(accessResult.reason, accessResult.message, articleType);
    return false;
  }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.checkArticleAccess = checkArticleAccess;
  window.showSubscriptionPopup = showSubscriptionPopup;
  window.closeSubscriptionPopup = closeSubscriptionPopup;
  window.verifyAndLoadArticle = verifyAndLoadArticle;
}
