/*
 * DAILY NOTES DOWNLOAD BUTTON - FRONTEND LOGIC
 *
 * PURPOSE: Downloads user's daily notes including highlights, summaries, and interactions
 * LOCATION: articles.html (fixed at bottom-center)
 * BACKEND ENDPOINT: GET /api/users/:userId/notes/:date
 *
 * BACKEND INTEGRATION NOTES:
 * 1. API must respond with plain text (Content-Type: text/plain)
 * 2. Response headers must include: Content-Disposition: attachment; filename="..."
 * 3. Backend aggregates data from multiple tables:
 *    - public_interactions (read, vote, bookmark, summary actions)
 *    - highlights (user's highlighted text per question)
 *    - summaries (user's written summaries)
 * 4. Output format documented in BACKEND_COMPLETE.md lines 715-780
 *
 * DATA FLOW:
 * User clicks → Fetch userId from auth → Call API with today's date →
 * Backend compiles notes → Frontend downloads .txt file
 */

document.getElementById('downloadNotesBtn').addEventListener('click', async () => {
    try {
        // Step 1: Get user ID dynamically from authentication system
        // Check multiple sources for userId
        let userId = null;

        // Option 1: From user-info div (set by auth.js displayUserInfo function)
        const userInfoDiv = document.getElementById('user-info');
        if (userInfoDiv && userInfoDiv.dataset.userId) {
            userId = userInfoDiv.dataset.userId;
        }

        // Option 2: From localStorage (backup if div not found)
        if (!userId) {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                try {
                    const userData = JSON.parse(currentUser);
                    userId = userData.id || userData.user_id;
                } catch (e) {
                    console.warn('Could not parse user data from localStorage');
                }
            }
        }

        // Option 3: Fallback - check if user is logged in via Telegram
        if (!userId && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
            userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
        }

        // Validation: userId must exist
        if (!userId) {
            console.error('❌ User ID not found. User may not be authenticated.');
            alert('Please log in to download your notes.');
            return;
        }

        console.log('📥 Downloading notes for user:', userId);

        // Step 2: Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().slice(0, 10);
        console.log('📅 Date:', today);

        // Step 3: Construct API endpoint URL
        // Backend endpoint documented in BACKEND_COMPLETE.md line 1290
        const apiUrl = `/api/users/${userId}/notes/${today}`;
        console.log('🔗 API URL:', apiUrl);

        // Step 4: Fetch notes from backend
        const response = await fetch(apiUrl);

        // Step 5: Handle HTTP errors
        if (!response.ok) {
            if (response.status === 404) {
                console.warn('⚠️ No notes found for today');
                alert('No highlights or summaries found for today. Start reading articles to create your daily notes!');
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Step 6: Get plain text response
        // Backend returns plain text, NOT JSON
        const notesText = await response.text();
        console.log('✅ Notes received, length:', notesText.length, 'characters');

        // Step 7: Create downloadable file
        const blob = new Blob([notesText], { type: 'text/plain; charset=utf-8' });
        const url = URL.createObjectURL(blob);

        // Step 8: Create temporary download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `SamyakGyan_Notes_${today}.txt`;
        a.style.display = 'none';

        // Step 9: Trigger download
        document.body.appendChild(a);
        a.click();

        // Step 10: Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('✅ Download complete!');

    } catch (error) {
        console.error('❌ Download failed:', error);

        // User-friendly error message
        if (error.message.includes('Failed to fetch')) {
            alert('Network error: Could not connect to server. Please check your internet connection.');
        } else {
            alert('Failed to download notes. Please try again later.');
        }
    }
});

// Optional: Show button only when articles are loaded
// Uncomment if you want button to appear after articles render
/*
document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-container');
    const downloadButton = document.querySelector('.download-button-container');

    if (articlesContainer && downloadButton) {
        // Check if articles are loaded
        const observer = new MutationObserver(() => {
            const articleCount = articlesContainer.querySelectorAll('.article-tile').length;
            if (articleCount > 0) {
                downloadButton.style.display = 'block';
                observer.disconnect();
            }
        });

        observer.observe(articlesContainer, { childList: true, subtree: true });
    }
});
*/