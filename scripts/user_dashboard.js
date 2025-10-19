/**
 * USER DASHBOARD ("YOUR JOURNAL") - FRONTEND LOGIC
 *
 * PURPOSE: Manage user profile, analytics display, and subscription status
 * LOCATION: user_dashboard.html
 * BACKEND ENDPOINTS:
 *   - GET /api/users/:userId/dashboard (user profile + subscription)
 *   - GET /api/users/:userId/analytics?stat=reading&month=10&fortnight=1
 *   - PUT /api/users/:userId/profile (update name/language)
 *   - POST /api/users/:userId/subscribe (manage subscription)
 *
 * FEATURES:
 * 1. Personal Info editing (name, language)
 * 2. Account Info display (user ID, join date, subscription status, topic access)
 * 3. Stats button navigation (5 analytics views)
 * 4. Dynamic panel updates (charts/stats based on selections)
 * 5. Month + Fortnight filtering
 *
 * DATA FLOW:
 * Page load → Fetch user data → Display info → User clicks stat button →
 * Fetch analytics → Display chart → User changes month/fortnight → Update chart
 */

// ==================== GLOBAL STATE ====================
let currentUserId = null;
let currentStat = 'reading'; // Default stat view
let currentMonth = null;
let currentFortnight = 1; // Default to 1st fortnight
let isEditMode = false;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 User Dashboard initializing...');

    // Get user ID from authentication
    currentUserId = getUserId();

    if (!currentUserId) {
        console.warn('⚠️ User ID not found. Using demo mode.');
        currentUserId = 'DEMO_USER_123'; // Demo user for testing
    }

    console.log('✅ User ID:', currentUserId);

    // Load user dashboard data
    loadUserDashboard();

    // Initialize event listeners
    initializeStatButtons();
    initializeFortnightChips();
    initializeMonthDropdown();
    initializeEditButton();
});

// ==================== GET USER ID FROM AUTH ====================
function getUserId() {
    // Option 1: From localStorage (set by auth.js)
    const authUserId = localStorage.getItem('userId');
    if (authUserId) return authUserId;

    // Option 2: From currentUser object
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            return userData.id || userData.user_id;
        } catch (e) {
            console.warn('Could not parse user data from localStorage');
        }
    }

    // Option 3: From Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
        return window.Telegram.WebApp.initDataUnsafe.user?.id;
    }

    return null;
}

// ==================== LOAD USER DASHBOARD DATA ====================
async function loadUserDashboard() {
    try {
        console.log('📥 Fetching user dashboard data...');

        // TODO (Backend Integration): Uncomment when API is ready
        // const response = await fetch(`/api/users/${currentUserId}/dashboard`);
        // if (!response.ok) throw new Error('Failed to fetch dashboard data');
        // const data = await response.json();

        // DUMMY DATA for visualization
        const data = {
            userName: 'User Name',
            userId: currentUserId || 'TG_123456',
            dateJoined: '2025-10-10',
            language: 'en',
            subscriptionStatus: 'active', // or 'inactive'
            topicAccess: {
                currentAffairs: true,
                ethicsEssay: false
            }
        };

        // Populate UI with data
        displayUserInfo(data);

        console.log('✅ Dashboard data loaded successfully');

    } catch (error) {
        console.error('❌ Error loading dashboard:', error);
        alert('Failed to load dashboard data. Please try again.');
    }
}

// ==================== DISPLAY USER INFO ====================
function displayUserInfo(data) {
    // Personal Info
    document.getElementById('user-name').value = data.userName;
    document.getElementById('user-language').value = data.language;

    // Account Info
    document.getElementById('user-id').textContent = data.userId;

    // Format date joined
    const dateJoined = new Date(data.dateJoined);
    const formattedDate = dateJoined.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    document.getElementById('date-joined').textContent = formattedDate;

    // Subscription status
    const activeBtn = document.querySelector('.subscription-active');
    const inactiveBtn = document.querySelector('.subscription-inactive');

    if (data.subscriptionStatus === 'active') {
        activeBtn.style.display = 'inline-block';
        inactiveBtn.style.display = 'none';
    } else {
        activeBtn.style.display = 'none';
        inactiveBtn.style.display = 'inline-block';
    }

    // Topic access
    const ethicsChip = document.querySelector('.topic-chip.ethics-essay');
    if (data.topicAccess.ethicsEssay) {
        ethicsChip.classList.remove('inactive');
    } else {
        ethicsChip.classList.add('inactive');
        ethicsChip.title = 'Subscription ended. Click to subscribe.';
    }
}

// ==================== STATS BUTTON NAVIGATION ====================
function initializeStatButtons() {
    const statBtns = document.querySelectorAll('.stat-btn');
    const dynamicChip = document.getElementById('dynamic-chip');

    statBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            statBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update dynamic chip header
            currentStat = btn.dataset.target;
            dynamicChip.textContent = btn.textContent;

            console.log('📊 Stat view changed to:', currentStat);

            // Fetch and display analytics
            if (currentMonth) {
                loadAnalytics();
            }
        });
    });
}

// ==================== FORTNIGHT CHIP TOGGLE ====================
function initializeFortnightChips() {
    const fortnightChips = document.querySelectorAll('.fortnight-chip');

    fortnightChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Only one fortnight active at a time
            fortnightChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            currentFortnight = parseInt(chip.dataset.fortnight);
            console.log('📅 Fortnight changed to:', currentFortnight);

            // Reload analytics if month is selected
            if (currentMonth) {
                loadAnalytics();
            }
        });
    });
}

// ==================== MONTH DROPDOWN ====================
function initializeMonthDropdown() {
    const monthSelect = document.getElementById('month-select');

    monthSelect.addEventListener('change', (e) => {
        currentMonth = parseInt(e.target.value);

        if (currentMonth) {
            console.log('📅 Month changed to:', currentMonth);
            loadAnalytics();
        }
    });
}

// ==================== LOAD ANALYTICS DATA ====================
async function loadAnalytics() {
    try {
        console.log(`📊 Loading ${currentStat} analytics for month ${currentMonth}, fortnight ${currentFortnight}...`);

        // TODO (Backend Integration): Uncomment when API is ready
        // const response = await fetch(`/api/users/${currentUserId}/analytics?stat=${currentStat}&month=${currentMonth}&fortnight=${currentFortnight}`);
        // if (!response.ok) throw new Error('Failed to fetch analytics');
        // const data = await response.json();

        // DUMMY DATA for visualization
        const data = {
            stat: currentStat,
            month: currentMonth,
            fortnight: currentFortnight,
            data: {
                totalArticles: 30,
                readArticles: 22,
                completionRate: 73.3,
                dailyBreakdown: []
            }
        };

        // Display analytics
        displayAnalytics(data);

        console.log('✅ Analytics loaded successfully');

    } catch (error) {
        console.error('❌ Error loading analytics:', error);

        // Show error in chart placeholder
        const chartPlaceholder = document.querySelector('.chart-placeholder');
        chartPlaceholder.innerHTML = `<span style="color: #dc3545;">Failed to load analytics. Please try again.</span>`;
    }
}

// ==================== DISPLAY ANALYTICS ====================
function displayAnalytics(data) {
    const chartPlaceholder = document.querySelector('.chart-placeholder');

    // TODO: Replace with actual chart library (Chart.js, D3.js, etc.)
    // For now, display as text
    chartPlaceholder.innerHTML = `
        <div style="text-align: left; padding: 1rem;">
            <h4>${data.stat.toUpperCase()} Analytics</h4>
            <p><strong>Month:</strong> ${getMonthName(data.month)}</p>
            <p><strong>Fortnight:</strong> ${data.fortnight === 1 ? '1st Half (1-15)' : '2nd Half (16-End)'}</p>
            <hr style="margin: 1rem 0;">
            <p><strong>Total Articles:</strong> ${data.data.totalArticles}</p>
            <p><strong>Read Articles:</strong> ${data.data.readArticles}</p>
            <p><strong>Completion Rate:</strong> ${data.data.completionRate}%</p>
            <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
                📊 Chart visualization will appear here when backend integration is complete
            </p>
        </div>
    `;
}

// ==================== HELPER: GET MONTH NAME ====================
function getMonthName(monthNumber) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || 'Unknown';
}

// ==================== EDIT / SAVE BUTTON ====================
function initializeEditButton() {
    const editBtn = document.getElementById('edit-info');
    const nameInput = document.getElementById('user-name');
    const languageSelect = document.getElementById('user-language');

    editBtn.addEventListener('click', async () => {
        if (!isEditMode) {
            // Enter edit mode
            isEditMode = true;
            nameInput.disabled = false;
            languageSelect.disabled = false;
            editBtn.textContent = 'Save';
            editBtn.style.backgroundColor = '#2ecc71';

            console.log('✏️ Edit mode enabled');

        } else {
            // Save changes
            const newName = nameInput.value.trim();
            const newLanguage = languageSelect.value;

            if (!newName) {
                alert('Name cannot be empty');
                return;
            }

            try {
                console.log('💾 Saving profile changes...');

                // TODO (Backend Integration): Uncomment when API is ready
                // const response = await fetch(`/api/users/${currentUserId}/profile`, {
                //     method: 'PUT',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({
                //         userName: newName,
                //         language: newLanguage
                //     })
                // });
                //
                // if (!response.ok) throw new Error('Failed to update profile');

                // Update localStorage
                const currentUser = localStorage.getItem('currentUser');
                if (currentUser) {
                    const userData = JSON.parse(currentUser);
                    userData.name = newName;
                    userData.language = newLanguage;
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                }

                // Exit edit mode
                isEditMode = false;
                nameInput.disabled = true;
                languageSelect.disabled = true;
                editBtn.textContent = 'Edit / Save';
                editBtn.style.backgroundColor = '#fc7306';

                console.log('✅ Profile updated successfully');

                // TODO: If language changed to Hindi, trigger Bhashini API
                if (newLanguage === 'hi') {
                    console.log('🌐 Hindi selected - Bhashini API integration needed');
                    // translatePageToHindi();
                }

            } catch (error) {
                console.error('❌ Error saving profile:', error);
                alert('Failed to save changes. Please try again.');
            }
        }
    });
}

console.log('✅ user_dashboard.js loaded');
