/**
 * ENGAGEMENT TRACKER - Universal Time Spent Tracking
 *
 * PURPOSE:
 * Tracks user engagement across ALL pages of the platform
 * Privacy-first: Only tracks total time spent per day (no URLs, no granular data)
 *
 * USAGE:
 * Include this script on ALL pages:
 * <script src="/scripts/engagement-tracker.js"></script>
 *
 * FEATURES:
 * - Idle detection (pauses timer when user is inactive)
 * - localStorage persistence (survives page refreshes)
 * - Auto-send every 6 hours + on page unload
 * - Midnight reset detection (splits sessions across days)
 * - Mobile-friendly (touch events, device detection)
 *
 * DATA FLOW:
 * Page Activity → Timer → localStorage → API (every 6 hours) → Database → Dashboard
 *
 * BACKEND INTEGRATION:
 * POST /api/track-engagement
 * Request: { userId, date, timeSpentSeconds }
 * Response: { success: true, totalSeconds: 3600 }
 */

(function() {
  'use strict';

  // ==================== CONFIGURATION ====================

  const CONFIG = {
    // Idle timeout (milliseconds)
    IDLE_TIMEOUT_DESKTOP: 100000,  // 100 seconds (90-120s range)
    IDLE_TIMEOUT_MOBILE: 130000,   // 130 seconds (120-150s range)

    // Send interval (milliseconds)
    SEND_INTERVAL: 21600000,       // 6 hours

    // Auto-save interval (milliseconds)
    SAVE_INTERVAL: 30000,          // 30 seconds

    // Event throttle (milliseconds)
    THROTTLE_DELAY: 100,           // 100ms

    // Midnight check interval (milliseconds)
    MIDNIGHT_CHECK_INTERVAL: 60000, // 60 seconds

    // localStorage key prefix
    STORAGE_KEY_PREFIX: 'engagement_session_',

    // API endpoint
    API_ENDPOINT: '/api/track-engagement'
  };

  // ==================== GLOBAL STATE ====================

  let state = {
    userId: null,                 // User ID (from page context)
    currentDate: null,            // Current date (YYYY-MM-DD)
    sessionStartTime: null,       // Session start timestamp
    accumulatedSeconds: 0,        // Total seconds for current day
    lastActivityTime: null,       // Last activity timestamp
    isIdle: false,                // Is user currently idle?
    idleTimeout: null,            // Idle timeout reference
    sendInterval: null,           // Send interval reference
    saveInterval: null,           // Save interval reference
    midnightCheckInterval: null,  // Midnight check interval reference
    lastSendTime: null,           // Last API send timestamp
    isMobile: false               // Is mobile device?
  };

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Detect if device is mobile
   */
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || window.innerWidth < 768;
  }

  /**
   * Get current date in YYYY-MM-DD format
   */
  function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Get current timestamp in milliseconds
   */
  function getTimestamp() {
    return Date.now();
  }

  /**
   * Get localStorage key for current user
   */
  function getStorageKey() {
    return `${CONFIG.STORAGE_KEY_PREFIX}${state.userId}`;
  }

  /**
   * Save session to localStorage
   */
  function saveSessionToStorage() {
    if (!state.userId) return;

    const sessionData = {
      date: state.currentDate,
      startTime: state.sessionStartTime,
      accumulatedSeconds: state.accumulatedSeconds,
      lastActive: state.lastActivityTime,
      lastSendTime: state.lastSendTime
    };

    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(sessionData));
      console.log('[Engagement Tracker] Session saved to localStorage:', sessionData);
    } catch (e) {
      console.error('[Engagement Tracker] Failed to save to localStorage:', e);
    }
  }

  /**
   * Load session from localStorage
   */
  function loadSessionFromStorage() {
    if (!state.userId) return null;

    try {
      const data = localStorage.getItem(getStorageKey());
      if (data) {
        const sessionData = JSON.parse(data);
        console.log('[Engagement Tracker] Session loaded from localStorage:', sessionData);
        return sessionData;
      }
    } catch (e) {
      console.error('[Engagement Tracker] Failed to load from localStorage:', e);
    }

    return null;
  }

  /**
   * Clear session from localStorage
   */
  function clearSessionFromStorage() {
    if (!state.userId) return;

    try {
      localStorage.removeItem(getStorageKey());
      console.log('[Engagement Tracker] Session cleared from localStorage');
    } catch (e) {
      console.error('[Engagement Tracker] Failed to clear localStorage:', e);
    }
  }

  // ==================== TRACKING LOGIC ====================

  /**
   * Start tracking session
   */
  function startSession() {
    const currentDate = getCurrentDate();
    const savedSession = loadSessionFromStorage();

    // Check if saved session is from today
    if (savedSession && savedSession.date === currentDate) {
      // Continue existing session
      state.currentDate = savedSession.date;
      state.sessionStartTime = savedSession.startTime;
      state.accumulatedSeconds = savedSession.accumulatedSeconds || 0;
      state.lastSendTime = savedSession.lastSendTime || getTimestamp();
      console.log('[Engagement Tracker] Resuming session from:', state.accumulatedSeconds, 'seconds');
    } else {
      // Start new session
      state.currentDate = currentDate;
      state.sessionStartTime = getTimestamp();
      state.accumulatedSeconds = 0;
      state.lastSendTime = getTimestamp();
      console.log('[Engagement Tracker] Starting new session');

      // If saved session is from yesterday, send it before starting new session
      if (savedSession && savedSession.date !== currentDate) {
        console.log('[Engagement Tracker] Detected date change. Sending yesterday\'s data...');
        sendDataToAPI(savedSession.date, savedSession.accumulatedSeconds);
        clearSessionFromStorage();
      }
    }

    state.lastActivityTime = getTimestamp();
    state.isIdle = false;

    // Start intervals
    startIdleTimer();
    startSaveInterval();
    startSendInterval();
    startMidnightCheck();
  }

  /**
   * Update accumulated time
   */
  function updateAccumulatedTime() {
    if (state.isIdle || !state.lastActivityTime) return;

    const now = getTimestamp();
    const elapsedSeconds = Math.floor((now - state.lastActivityTime) / 1000);

    if (elapsedSeconds > 0) {
      state.accumulatedSeconds += elapsedSeconds;
      state.lastActivityTime = now;
      console.log('[Engagement Tracker] Updated time:', state.accumulatedSeconds, 'seconds');
    }
  }

  /**
   * Handle user activity
   */
  function handleActivity() {
    const now = getTimestamp();

    // If was idle, resume tracking
    if (state.isIdle) {
      console.log('[Engagement Tracker] User active again. Resuming tracking...');
      state.isIdle = false;
      state.lastActivityTime = now;
    } else {
      // Update accumulated time before resetting activity time
      updateAccumulatedTime();
    }

    // Reset idle timer
    resetIdleTimer();
  }

  /**
   * Handle user going idle
   */
  function handleIdle() {
    if (state.isIdle) return;

    console.log('[Engagement Tracker] User idle. Pausing tracking...');
    updateAccumulatedTime(); // Save time before going idle
    state.isIdle = true;
  }

  // ==================== IDLE DETECTION ====================

  /**
   * Start idle timer
   */
  function startIdleTimer() {
    const timeout = state.isMobile
      ? CONFIG.IDLE_TIMEOUT_MOBILE
      : CONFIG.IDLE_TIMEOUT_DESKTOP;

    state.idleTimeout = setTimeout(handleIdle, timeout);
  }

  /**
   * Reset idle timer
   */
  function resetIdleTimer() {
    if (state.idleTimeout) {
      clearTimeout(state.idleTimeout);
    }
    startIdleTimer();
  }

  // ==================== EVENT LISTENERS ====================

  /**
   * Throttle function (prevents excessive calls)
   */
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    const throttledActivity = throttle(handleActivity, CONFIG.THROTTLE_DELAY);

    // Mouse events
    document.addEventListener('mousemove', throttledActivity, { passive: true });
    document.addEventListener('mousedown', handleActivity, { passive: true });
    document.addEventListener('click', handleActivity, { passive: true });

    // Keyboard events
    document.addEventListener('keydown', handleActivity, { passive: true });
    document.addEventListener('keypress', handleActivity, { passive: true });

    // Scroll events (throttled)
    document.addEventListener('scroll', throttledActivity, { passive: true });

    // Touch events (mobile)
    document.addEventListener('touchstart', handleActivity, { passive: true });
    document.addEventListener('touchmove', throttledActivity, { passive: true });
    document.addEventListener('touchend', handleActivity, { passive: true });

    // Visibility change (tab switching)
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        console.log('[Engagement Tracker] Tab hidden');
        updateAccumulatedTime();
        saveSessionToStorage();
      } else {
        console.log('[Engagement Tracker] Tab visible');
        handleActivity();
      }
    });

    // Page unload (save and send data)
    window.addEventListener('beforeunload', function() {
      console.log('[Engagement Tracker] Page unloading. Saving data...');
      updateAccumulatedTime();
      saveSessionToStorage();

      // Send data using sendBeacon (more reliable for unload)
      if (state.accumulatedSeconds > 0) {
        sendDataToAPI(state.currentDate, state.accumulatedSeconds, true);
      }
    });

    console.log('[Engagement Tracker] Event listeners registered');
  }

  // ==================== AUTO-SAVE ====================

  /**
   * Start auto-save interval
   */
  function startSaveInterval() {
    state.saveInterval = setInterval(() => {
      updateAccumulatedTime();
      saveSessionToStorage();
    }, CONFIG.SAVE_INTERVAL);

    console.log('[Engagement Tracker] Auto-save interval started (every 30s)');
  }

  // ==================== API COMMUNICATION ====================

  /**
   * Send data to API
   */
  function sendDataToAPI(date, seconds, useBeacon = false) {
    if (!state.userId || seconds === 0) return;

    const payload = {
      userId: state.userId,
      date: date,
      timeSpentSeconds: seconds
    };

    console.log('[Engagement Tracker] Sending data to API:', payload);

    // Use sendBeacon for page unload (more reliable)
    if (useBeacon && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(CONFIG.API_ENDPOINT, blob);
      console.log('[Engagement Tracker] Data sent via sendBeacon');
      return;
    }

    // Regular fetch for periodic sends
    fetch(CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      console.log('[Engagement Tracker] API response:', data);

      // Update accumulated time from server response
      if (data.success && data.totalSeconds !== undefined) {
        state.accumulatedSeconds = data.totalSeconds;
        saveSessionToStorage();
      }
    })
    .catch(error => {
      console.error('[Engagement Tracker] API error:', error);
      // Don't reset data on error - will retry next interval
    });
  }

  /**
   * Start send interval (every 6 hours)
   */
  function startSendInterval() {
    state.sendInterval = setInterval(() => {
      updateAccumulatedTime();

      if (state.accumulatedSeconds > 0) {
        sendDataToAPI(state.currentDate, state.accumulatedSeconds);
        state.lastSendTime = getTimestamp();
        saveSessionToStorage();
      }
    }, CONFIG.SEND_INTERVAL);

    console.log('[Engagement Tracker] Send interval started (every 6 hours)');
  }

  // ==================== MIDNIGHT DETECTION ====================

  /**
   * Check for midnight (date change)
   */
  function checkMidnight() {
    const currentDate = getCurrentDate();

    if (currentDate !== state.currentDate) {
      console.log('[Engagement Tracker] Date changed! Sending yesterday\'s data...');

      // Send yesterday's data
      const yesterdayDate = state.currentDate;
      const yesterdaySeconds = state.accumulatedSeconds;

      if (yesterdaySeconds > 0) {
        sendDataToAPI(yesterdayDate, yesterdaySeconds);
      }

      // Reset for today
      state.currentDate = currentDate;
      state.accumulatedSeconds = 0;
      state.sessionStartTime = getTimestamp();
      state.lastActivityTime = getTimestamp();
      state.lastSendTime = getTimestamp();

      // Save new session
      saveSessionToStorage();

      console.log('[Engagement Tracker] Started new session for:', currentDate);
    }
  }

  /**
   * Start midnight check interval (every 60 seconds)
   */
  function startMidnightCheck() {
    state.midnightCheckInterval = setInterval(checkMidnight, CONFIG.MIDNIGHT_CHECK_INTERVAL);
    console.log('[Engagement Tracker] Midnight check started (every 60s)');
  }

  // ==================== INITIALIZATION ====================

  /**
   * Initialize engagement tracker
   */
  function init() {
    console.log('=== ENGAGEMENT TRACKER INITIALIZING ===');

    // Detect mobile
    state.isMobile = isMobileDevice();
    console.log('[Engagement Tracker] Device type:', state.isMobile ? 'Mobile' : 'Desktop');

    // Get user ID from page context
    // TODO: BACKEND INTEGRATION - Get user ID from server-rendered page or API
    // For now, check for DEMO_USER or window.currentUserId
    if (typeof DEMO_USER !== 'undefined' && DEMO_USER.user_id) {
      state.userId = DEMO_USER.user_id;
    } else if (typeof window.currentUserId !== 'undefined') {
      state.userId = window.currentUserId;
    } else {
      console.warn('[Engagement Tracker] User ID not found. Tracking disabled.');
      return;
    }

    console.log('[Engagement Tracker] User ID:', state.userId);

    // Start session
    startSession();

    // Setup event listeners
    setupEventListeners();

    console.log('=== ENGAGEMENT TRACKER READY ===');
  }

  // ==================== AUTO-START ====================

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
