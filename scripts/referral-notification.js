/**
 * Referral Notification System
 * Shows toast-style notifications when friends join via referral
 */

// ============================================
// NOTIFICATION CONTAINER SETUP
// ============================================

function getNotificationContainer() {
  let container = document.getElementById('referral-notification-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'referral-notification-container';
    container.className = 'referral-notification-container';
    document.body.appendChild(container);
  }

  return container;
}

// ============================================
// SHOW REFERRAL NOTIFICATION
// ============================================

/**
 * Shows a referral notification toast
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.icon - Emoji icon (default: 🎉)
 * @param {string} options.type - Type: 'success', 'info', 'reward' (default: 'success')
 * @param {number} options.duration - Duration in ms (default: 5000)
 */
function showReferralNotification(options = {}) {
  const {
    title = 'Referral Success!',
    message = 'A friend joined via your link',
    icon = '🎉',
    type = 'success',
    duration = 5000
  } = options;

  console.log('🔔 Showing referral notification:', { title, message, type });

  const container = getNotificationContainer();

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `referral-notification ${type}`;
  notification.innerHTML = `
    <div class="referral-notification-icon">${icon}</div>
    <div class="referral-notification-content">
      <div class="referral-notification-title">${title}</div>
      <div class="referral-notification-message">${message}</div>
    </div>
    <button class="referral-notification-close">×</button>
  `;

  // Add to container
  container.appendChild(notification);

  // Close button handler
  const closeBtn = notification.querySelector('.referral-notification-close');
  closeBtn.addEventListener('click', () => {
    removeNotification(notification);
  });

  // Click anywhere on notification to close
  notification.addEventListener('click', (e) => {
    if (e.target !== closeBtn) {
      removeNotification(notification);
    }
  });

  // Auto-remove after duration
  setTimeout(() => {
    removeNotification(notification);
  }, duration);
}

/**
 * Removes notification with animation
 */
function removeNotification(notification) {
  if (!notification || !notification.parentElement) return;

  notification.style.animation = 'fadeOut 0.3s ease forwards';

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 300);
}

// ============================================
// SPECIFIC NOTIFICATION TYPES
// ============================================

/**
 * Shows notification for first referral (7 days reward)
 */
function showFirstReferralNotification() {
  showReferralNotification({
    title: 'First Referral! 🎉',
    message: 'Your friend joined! You got 7 days of trial extension.',
    icon: '🎉',
    type: 'reward',
    duration: 5000
  });
}

/**
 * Shows notification for third referral (30 days reward)
 */
function showThirdReferralNotification() {
  showReferralNotification({
    title: 'Amazing! 3 Referrals! 🎊',
    message: 'You helped SG reach 3 friends! Enjoy a full 30-day free trial.',
    icon: '🎊',
    type: 'reward',
    duration: 6000
  });
}

/**
 * Shows notification for general referral (2nd, 4th, etc.)
 */
function showGeneralReferralNotification(count) {
  showReferralNotification({
    title: `${count} Friends Joined!`,
    message: 'Thanks for spreading the word about Samyak Gyan!',
    icon: '🙌',
    type: 'success',
    duration: 4000
  });
}

/**
 * Shows notification with custom referral count update
 */
function showReferralCountUpdate(count) {
  const friendText = count === 1 ? 'friend' : 'friends';

  showReferralNotification({
    title: 'Referral Update',
    message: `You've referred ${count} ${friendText} so far. Keep it up!`,
    icon: '📊',
    type: 'info',
    duration: 4000
  });
}

// ============================================
// CHECK FOR PENDING NOTIFICATIONS
// ============================================

/**
 * Checks for pending referral notifications from backend
 * Called on dashboard load
 */
async function checkPendingReferralNotifications() {
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    console.log('⚠️ No user ID - skipping referral notification check');
    return;
  }

  try {
    console.log('🔍 Checking for pending referral notifications...');

    // Check if there's a pending notification flag
    const showReferralNotif = localStorage.getItem('show_referral_notification');
    const referralCount = parseInt(localStorage.getItem('referral_count') || '0', 10);

    if (showReferralNotif === 'true') {
      console.log('✅ Found pending referral notification:', referralCount);

      // Show appropriate notification based on count
      if (referralCount === 1) {
        showFirstReferralNotification();
      } else if (referralCount === 3) {
        showThirdReferralNotification();
      } else {
        showGeneralReferralNotification(referralCount);
      }

      // Clear flags
      localStorage.removeItem('show_referral_notification');
      localStorage.removeItem('referral_count');
    }

    // Also fetch latest referral count from backend
    const response = await fetch(`http://localhost:3000/api/referrals/stats/${userId}`);
    const data = await response.json();

    if (data.success) {
      const currentCount = data.total_referrals || 0;
      console.log(`📊 Current referral count: ${currentCount}`);

      // Update dashboard display if element exists
      const countElement = document.getElementById('referral-count-display');
      if (countElement) {
        const friendText = currentCount === 1 ? 'friend' : 'friends';
        countElement.textContent = `${currentCount} ${friendText}`;
      }
    }
  } catch (error) {
    console.error('❌ Error checking referral notifications:', error);
  }
}

// ============================================
// AUTO-INITIALIZE ON PAGE LOAD
// ============================================

// Check for pending notifications when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkPendingReferralNotifications);
} else {
  checkPendingReferralNotifications();
}

// ============================================
// MANUAL TRIGGER (For Testing)
// ============================================

// Expose functions globally for testing
window.testReferralNotification = {
  first: showFirstReferralNotification,
  third: showThirdReferralNotification,
  general: showGeneralReferralNotification,
  count: showReferralCountUpdate,
  custom: showReferralNotification
};
