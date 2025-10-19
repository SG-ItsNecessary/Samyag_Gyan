/**
 * ============================================
 * Article Page JavaScript (API-driven)
 * ============================================
 * 
 * PURPOSE:
 * - Populate "Latest Upload" button with the newest article's date.
 * - Populate "Recent Uploads" buttons with the past 3 articles.
 * - Render a calendar that highlights dates with published articles.
 * - On button click (latest, recent, or calendar date), redirect
 *   user to the correct URL:  /YYYY/MM/DD
 * 
 * HOW IT WORKS:
 * - Fetches data from backend API endpoints (to be built by developer).
 * - Fills UI elements with publish dates from database.
 * - Handles user interaction (clicks → redirect).
 * 
 * REQUIRED API ENDPOINTS (examples):
 * - GET /api/articles/latest        → newest article
 * - GET /api/articles/recent?limit=3 → 3 most recent articles
 * - GET /api/articles/calendar-dates → all dates with articles
 * 
 * NOTE:
 * - Currently uses placeholder API calls (fetch stubs).
 * - Developer must connect these functions to real API.
 * 
 * ============================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // ================================
    // BUTTON REFERENCES
    // ================================
    const latestUploadBtn = document.getElementById('latest-upload-btn');
    const saffronBtn = document.getElementById('saffron-btn');
    const whiteBtn = document.getElementById('white-btn');
    const greenBtn = document.getElementById('green-btn');

    // ================================
    // API FETCH FUNCTIONS (PLACEHOLDERS)
    // Developer should replace with real fetch() calls to backend
    // ================================
    
    // Fetch latest article
    const fetchLatestArticle = async () => {
        // Example response (to be replaced by real API call)
        return { date: '2025-08-25', title: 'Content for August 25' };
    };

    // Fetch past 3 articles
    const fetchRecentArticles = async () => {
        return [
            { date: '2025-08-25', title: 'Content for August 25' },
            { date: '2025-08-22', title: 'Content for August 22' },
            { date: '2025-08-18', title: 'Content for August 18' }
        ];
    };

    // Fetch all dates that have content (for calendar highlighting)
    const fetchContentDates = async () => {
        return [
            '2025-08-01',
            '2025-08-05',
            '2025-08-12',
            '2025-08-18',
            '2025-08-22',
            '2025-08-25'
        ];
    };

    // ================================
    // HELPERS
    // ================================
    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    const goToDatePage = (dateStr) => {
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        // Navigate to SEO-optimized URL: /upsc-current-affairs/YYYY-MM-DD
        window.location.href = `/upsc-current-affairs/${year}-${month}-${day}`;
    };

    // ================================
    // RENDERING LATEST + RECENT UPLOADS
    // ================================
    const renderUploads = async () => {
        // Latest upload
        const latest = await fetchLatestArticle();
        if (latest) {
            latestUploadBtn.textContent = formatDate(latest.date);
            latestUploadBtn.onclick = () => goToDatePage(latest.date);
        }

        // Past 3 uploads
        const recents = await fetchRecentArticles();
        if (recents.length >= 3) {
            saffronBtn.textContent = formatDate(recents[0].date);
            saffronBtn.onclick = () => goToDatePage(recents[0].date);

            whiteBtn.textContent = formatDate(recents[1].date);
            whiteBtn.onclick = () => goToDatePage(recents[1].date);

            greenBtn.textContent = formatDate(recents[2].date);
            greenBtn.onclick = () => goToDatePage(recents[2].date);
        }
    };

    renderUploads();

    // ================================
    // CALENDAR LOGIC
    // ================================
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYearEl = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    let currentDate = new Date();
    let contentDates = [];

    const renderCalendar = async (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        // fetch dates only once (could be optimized later)
        contentDates = await fetchContentDates();

        // Render header
        currentMonthYearEl.textContent = `${date.toLocaleString('en-US',{month:'long'})} ${year}`;
        calendarGrid.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Empty cells for alignment
        for (let i = 0; i < firstDay.getDay(); i++) {
            calendarGrid.appendChild(document.createElement('div'));
        }

        // Actual day cells
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.textContent = d;

            const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

            if (contentDates.includes(fullDate)) {
                dayCell.classList.add('day-active');
                dayCell.onclick = () => goToDatePage(fullDate);
            }

            calendarGrid.appendChild(dayCell);
        }
    };

    // Calendar navigation
    prevMonthBtn.onclick = () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    };

    nextMonthBtn.onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    };

    renderCalendar(currentDate); // initial load
});
