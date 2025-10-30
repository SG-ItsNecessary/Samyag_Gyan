/**
 * Subscriber Stats Collection
 * Fetches total subscribers and 24h growth from backend
 * Stores in localStorage for homepage credibility display
 */

// ============================================
// FETCH SUBSCRIBER STATS
// ============================================

/**
 * Fetches subscriber statistics from backend
 * Stores in localStorage for future use
 * @returns {Promise<Object>} Stats data or null on error
 */
async function fetchSubscriberStats() {
  console.log('📊 Fetching subscriber stats...');

  try {
    const response = await fetch('http://localhost:3000/api/stats/subscribers', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      const stats = result.data;

      console.log('✅ Subscriber stats received:');
      console.log(`   Total Subscribers: ${stats.total_subscribers}`);
      console.log(`   New (24h): ${stats.new_subscribers_24h}`);
      console.log(`   Growth: ${stats.growth_percentage_24h}%`);

      // Store in localStorage
      localStorage.setItem('subscriber_stats', JSON.stringify(stats));
      localStorage.setItem('subscriber_stats_timestamp', stats.timestamp);

      return stats;
    } else {
      throw new Error(result.message || 'Failed to fetch stats');
    }
  } catch (error) {
    console.error('❌ Error fetching subscriber stats:', error);
    return null;
  }
}

/**
 * Gets subscriber stats from localStorage (cached)
 * @returns {Object|null} Cached stats or null if not available
 */
function getCachedSubscriberStats() {
  try {
    const cached = localStorage.getItem('subscriber_stats');

    if (cached) {
      const stats = JSON.parse(cached);
      console.log('📦 Using cached subscriber stats:', stats);
      return stats;
    }

    return null;
  } catch (error) {
    console.error('❌ Error reading cached stats:', error);
    return null;
  }
}

/**
 * Checks if cached stats are still fresh (< 1 hour old)
 * @returns {boolean} True if cache is fresh, false otherwise
 */
function isCacheFresh() {
  const timestamp = localStorage.getItem('subscriber_stats_timestamp');

  if (!timestamp) return false;

  const cachedTime = new Date(timestamp);
  const now = new Date();
  const diffMinutes = (now - cachedTime) / 1000 / 60;

  // Cache is fresh if less than 60 minutes old
  return diffMinutes < 60;
}

/**
 * Gets subscriber stats (cached or fresh)
 * Uses cache if fresh, otherwise fetches new data
 * @returns {Promise<Object>} Stats data
 */
async function getSubscriberStats() {
  // Check cache first
  if (isCacheFresh()) {
    console.log('✅ Using fresh cached stats');
    return getCachedSubscriberStats();
  }

  // Cache is stale or doesn't exist - fetch fresh data
  console.log('🔄 Cache stale or missing - fetching fresh stats');
  return await fetchSubscriberStats();
}

// ============================================
// DISPLAY SUBSCRIBER STATS (Optional)
// ============================================

/**
 * Updates DOM elements with subscriber stats
 * Call this function after stats are loaded
 * @param {Object} stats - Stats data object
 */
function displaySubscriberStats(stats) {
  if (!stats) {
    console.warn('⚠️ No stats available to display');
    return;
  }

  // Update total subscribers display
  const totalEl = document.getElementById('total-subscribers');
  if (totalEl) {
    totalEl.textContent = formatNumber(stats.total_subscribers);
  }

  // Update 24h growth display
  const growthEl = document.getElementById('growth-24h');
  if (growthEl) {
    const sign = stats.new_subscribers_24h > 0 ? '+' : '';
    growthEl.textContent = `${sign}${stats.new_subscribers_24h}`;
  }

  // Update growth percentage display
  const percentEl = document.getElementById('growth-percentage');
  if (percentEl) {
    percentEl.textContent = `${stats.growth_percentage_24h}%`;
  }

  console.log('✅ Subscriber stats displayed in UI');
}

/**
 * Formats number with commas (e.g., 1234 -> 1,234)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ============================================
// AUTO-INITIALIZE ON PAGE LOAD
// ============================================

/**
 * Initializes subscriber stats collection on page load
 * Fetches stats and optionally displays them
 */
async function initializeSubscriberStats() {
  console.log('🚀 Initializing subscriber stats collection...');

  const stats = await getSubscriberStats();

  if (stats) {
    // Try to display stats if DOM elements exist
    displaySubscriberStats(stats);
  }
}

// Auto-run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSubscriberStats);
} else {
  initializeSubscriberStats();
}

// ============================================
// EXPOSE FUNCTIONS GLOBALLY (For Manual Use)
// ============================================

window.subscriberStats = {
  fetch: fetchSubscriberStats,
  get: getSubscriberStats,
  getCached: getCachedSubscriberStats,
  display: displaySubscriberStats,
  isCacheFresh: isCacheFresh
};
