/**
 * Welcome Popup - Shows after login or profile creation
 * Shows "Welcome Back" + user name
 * Auto-dismisses after 4 seconds or manual close
 */

// ============================================
// SHOW WELCOME POPUP
// ============================================

/**
 * Shows welcome popup with user's name
 * @param {string} userName - User's name to display
 * @param {boolean} isNewUser - True if new registration, false if returning user
 */
function showWelcomePopup(userName, isNewUser = false) {
  console.log('👋 Showing welcome popup for:', userName, isNewUser ? '(New User)' : '(Returning User)');

  // Get or create overlay
  let overlay = document.getElementById('welcome-overlay');

  if (!overlay) {
    // Create overlay if doesn't exist
    overlay = document.createElement('div');
    overlay.id = 'welcome-overlay';
    overlay.className = 'welcome-overlay';
    overlay.innerHTML = `
      <div class="welcome-box">
        <button class="welcome-close" id="welcome-close-btn">×</button>
        <div class="welcome-icon">👋</div>
        <h2 class="welcome-title" id="welcome-title">Welcome Back!</h2>
        <div class="welcome-user-name" id="welcome-user-name">${userName}</div>
        <p class="welcome-subtitle" id="welcome-subtitle">
          Great to have you back on Samyak Gyan!
        </p>
        <p class="welcome-message" id="welcome-message">
          Continue your UPSC preparation journey with the latest current affairs and ethical insights.
        </p>
        <button class="welcome-btn" id="welcome-get-started">Get Started</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Add event listeners
    document.getElementById('welcome-close-btn').addEventListener('click', closeWelcomePopup);
    document.getElementById('welcome-get-started').addEventListener('click', closeWelcomePopup);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeWelcomePopup();
      }
    });
  } else {
    // Update existing overlay
    document.getElementById('welcome-user-name').textContent = userName;
  }

  // Update content based on user type
  if (isNewUser) {
    document.getElementById('welcome-title').textContent = 'Welcome to Samyak Gyan!';
    document.getElementById('welcome-subtitle').textContent = 'Your UPSC preparation journey starts here!';
    document.getElementById('welcome-message').textContent = 'Explore in-depth current affairs, ethical case studies, and essay guidance. Start your 15-day free trial now!';
    document.getElementById('welcome-icon').textContent = '🎉';
  } else {
    document.getElementById('welcome-title').textContent = 'Welcome Back!';
    document.getElementById('welcome-subtitle').textContent = 'Great to have you back on Samyak Gyan!';
    document.getElementById('welcome-message').textContent = 'Continue your UPSC preparation journey with the latest current affairs and ethical insights.';
    document.getElementById('welcome-icon').textContent = '👋';
  }

  // Show popup
  overlay.classList.add('show');

  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    if (overlay.classList.contains('show')) {
      closeWelcomePopup();
    }
  }, 4000);
}

/**
 * Closes welcome popup with animation
 */
function closeWelcomePopup() {
  const overlay = document.getElementById('welcome-overlay');
  const box = overlay.querySelector('.welcome-box');

  if (overlay && overlay.classList.contains('show')) {
    console.log('👋 Closing welcome popup');

    // Add fade-out animation
    overlay.classList.add('fade-out');
    box.classList.add('fade-out');

    // Remove after animation completes
    setTimeout(() => {
      overlay.classList.remove('show', 'fade-out');
      box.classList.remove('fade-out');
    }, 300);
  }
}

// ============================================
// CHECK IF SHOULD SHOW WELCOME POPUP
// ============================================

/**
 * Checks if welcome popup should be shown
 * Only shows if 'show_welcome' flag is in localStorage
 */
function checkAndShowWelcomePopup() {
  const showWelcome = localStorage.getItem('show_welcome');
  const userName = localStorage.getItem('user_name');
  const isNewUser = localStorage.getItem('is_new_user') === 'true';

  console.log('🔍 Check welcome popup:', { showWelcome, userName, isNewUser });

  if (showWelcome === 'true' && userName) {
    // Show popup
    showWelcomePopup(userName, isNewUser);

    // Clear flags so it doesn't show again
    localStorage.removeItem('show_welcome');
    localStorage.removeItem('is_new_user');
  }
}

// ============================================
// AUTO-INITIALIZE ON PAGE LOAD
// ============================================

// Check if welcome popup should be shown when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAndShowWelcomePopup);
} else {
  checkAndShowWelcomePopup();
}
