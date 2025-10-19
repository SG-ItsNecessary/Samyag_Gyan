/**
 * ============================================
 * Samyak Gyan - Authentication & Session Management
 * ============================================
 *
 * This file handles all user authentication, session management,
 * and login state persistence across the website.
 *
 * Features:
 * - Check if user is logged in
 * - Redirect to landing page if not logged in
 * - Get user data from localStorage
 * - Logout functionality
 * - Trial status checking
 *
 * Usage:
 * Include this file in every page that requires authentication:
 * <script src="scripts/auth.js"></script>
 *
 * Then call: requireAuth(); in your page's script
 * ============================================
 */

// ==================== TESTING MODE ====================
// Set this to TRUE to bypass login (for design/testing)
// Set to FALSE before production launch
const TESTING_MODE = true;  // ← Change to false when done testing

// ==================== CONSTANTS ====================
const AUTH_CONFIG = {
    LANDING_PAGE: 'landing.html',
    PROFILE_PAGE: 'profile.html',
    HOMEPAGE: 'homepage.html',
    LOGIN_REQUIRED_PAGES: ['homepage.html', 'articles.html', 'index.html']
};

// ==================== CORE AUTH FUNCTIONS ====================

/**
 * Check if user is currently logged in
 * @returns {boolean} True if user is logged in
 */
function isUserLoggedIn() {
    const telegramUser = localStorage.getItem('telegram_user');
    const userId = localStorage.getItem('user_id');

    return !!(telegramUser && userId);
}

/**
 * Get current user's ID
 * @returns {string|null} User ID or null if not logged in
 */
function getUserId() {
    return localStorage.getItem('user_id');
}

/**
 * Get full user data from localStorage
 * @returns {Object|null} User object or null if not logged in
 */
function getUserData() {
    const userJson = localStorage.getItem('telegram_user');
    if (!userJson) return null;

    try {
        return JSON.parse(userJson);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

/**
 * Get user's referral code
 * @returns {string|null} Referral code or null
 */
function getReferralCode() {
    return localStorage.getItem('referral_code');
}

/**
 * Get user's trial end date
 * @returns {string|null} Trial end date (YYYY-MM-DD) or null
 */
function getTrialEndDate() {
    return localStorage.getItem('trial_end');
}

/**
 * Check if user's trial is still active
 * @returns {boolean} True if trial is active
 */
function isTrialActive() {
    const trialEnd = getTrialEndDate();
    if (!trialEnd) return false;

    const endDate = new Date(trialEnd);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight

    return endDate >= today;
}

/**
 * Get days remaining in trial
 * @returns {number} Number of days remaining (0 if expired)
 */
function getTrialDaysRemaining() {
    const trialEnd = getTrialEndDate();
    if (!trialEnd) return 0;

    const endDate = new Date(trialEnd);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
}

// ==================== PAGE PROTECTION ====================

/**
 * Require authentication for current page
 * Redirects to landing page if user is not logged in
 * Call this function on page load for protected pages
 */
function requireAuth() {
    // TESTING MODE: Skip authentication check
    if (TESTING_MODE) {
        console.log('⚠️ TESTING MODE: Authentication bypassed');
        return true;
    }

    if (!isUserLoggedIn()) {
        console.log('User not logged in. Redirecting to landing page...');
        window.location.href = AUTH_CONFIG.LANDING_PAGE;
        return false;
    }
    return true;
}

/**
 * Redirect to homepage if user is already logged in
 * Use this on landing and profile pages
 */
function redirectIfLoggedIn() {
    if (isUserLoggedIn()) {
        console.log('User already logged in. Redirecting to homepage...');
        window.location.href = AUTH_CONFIG.HOMEPAGE;
        return true;
    }
    return false;
}

// ==================== LOGOUT ====================

/**
 * Log out the current user
 * Clears all user data from localStorage and redirects to landing page
 */
function logout() {
    // Clear all user-related data
    localStorage.removeItem('telegram_user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('referral_code');
    localStorage.removeItem('trial_end');
    localStorage.removeItem('subscription_status');

    console.log('User logged out successfully');

    // Redirect to landing page
    window.location.href = AUTH_CONFIG.LANDING_PAGE;
}

// ==================== USER DISPLAY ====================

/**
 * Get user's display name (first name or username)
 * @returns {string} Display name or 'User'
 */
function getUserDisplayName() {
    const userData = getUserData();
    if (!userData) return 'User';

    return userData.first_name || userData.username || 'User';
}

/**
 * Display user info in a specific element
 * @param {string} elementId - ID of the element to display user info
 */
function displayUserInfo(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID '${elementId}' not found`);
        return;
    }

    const userData = getUserData();
    if (!userData) {
        element.innerHTML = '<a href="' + AUTH_CONFIG.LANDING_PAGE + '">Login</a>';
        return;
    }

    const displayName = getUserDisplayName();
    const photoUrl = userData.photo_url;

    let html = '<div class="user-profile">';

    if (photoUrl) {
        html += `<img src="${photoUrl}" alt="${displayName}" class="user-avatar" style="width: 32px; height: 32px; border-radius: 50%; vertical-align: middle; margin-right: 8px;">`;
    }

    html += `<span class="user-name">${displayName}</span>`;
    html += `<button onclick="logout()" style="margin-left: 10px; padding: 4px 12px; cursor: pointer;">Logout</button>`;
    html += '</div>';

    element.innerHTML = html;
}

// ==================== SUBSCRIPTION STATUS ====================

/**
 * Check user's subscription status from backend
 * @returns {Promise<Object>} User status object
 */
async function checkSubscriptionStatus() {
    const userId = getUserId();
    if (!userId) {
        throw new Error('User not logged in');
    }

    try {
        const response = await fetch(`/api/users/${userId}/status`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Update localStorage with latest status
        if (data.trial_end) {
            localStorage.setItem('trial_end', data.trial_end);
        }
        if (data.subscription_status) {
            localStorage.setItem('subscription_status', data.subscription_status);
        }

        return data;
    } catch (error) {
        console.error('Error checking subscription status:', error);
        throw error;
    }
}

/**
 * Show trial expiry warning if needed
 * Call this on page load to show warnings
 */
async function showTrialWarningIfNeeded() {
    if (!isUserLoggedIn()) return;

    const daysRemaining = getTrialDaysRemaining();

    // Show warning if 3 days or less remaining
    if (daysRemaining > 0 && daysRemaining <= 3) {
        const message = `⚠️ Your free trial expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}. Subscribe to continue learning!`;
        console.warn(message);

        // You can show this in a banner/modal
        // For now, just log it
    } else if (daysRemaining === 0) {
        const message = '⚠️ Your free trial has expired. Subscribe to continue accessing content.';
        console.warn(message);

        // Optionally redirect to subscription page
        // window.location.href = 'subscribe.html';
    }
}

// ==================== GLOBAL VARIABLE ====================

/**
 * Global variable for current user ID
 * Use this in your API calls: CURRENT_USER_ID
 */
let CURRENT_USER_ID = getUserId();

// Update CURRENT_USER_ID when user logs in
window.addEventListener('storage', (e) => {
    if (e.key === 'user_id') {
        CURRENT_USER_ID = e.newValue;
    }
});

// ==================== AUTO-INITIALIZATION ====================

/**
 * Automatically run on script load
 */
(function initAuth() {
    // Set global user ID
    CURRENT_USER_ID = getUserId();

    // Log current auth status (for debugging)
    if (isUserLoggedIn()) {
        console.log('✓ User authenticated:', getUserDisplayName());
        console.log('User ID:', CURRENT_USER_ID);
        console.log('Trial days remaining:', getTrialDaysRemaining());
    } else {
        console.log('✗ User not authenticated');
    }
})();

// ==================== EXPORT FOR USE IN OTHER FILES ====================
// These functions are available globally
console.log('✓ Auth.js loaded successfully');
