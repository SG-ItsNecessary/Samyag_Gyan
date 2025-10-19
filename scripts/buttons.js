// ==================== CENTRALIZED INTERACTION LOGGING ====================
/**
 * Centralized logging function for all button interactions
 * Aligned with backend database schema: public_interactions table
 *
 * @param {string} articleId - Unique article identifier
 * @param {string} userId - Current user identifier (Telegram ID)
 * @param {string} actionType - Database action_type: 'read', 'magazine_worthy', 'bookmark', 'summary'
 */
function logInteraction(articleId, userId, actionType) {
    const timestamp = new Date().toISOString();

    console.log(`📊 INTERACTION LOG:`, {
        userId: userId,
        articleId: articleId,
        actionType: actionType,
        timestamp: timestamp
    });

    // TODO (Backend Integration): Uncomment when backend API is ready
    // Endpoint: POST /api/articles/interact
    // Database: public_interactions table
    /*
    fetch('/api/articles/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: userId,
            articleId: articleId,
            actionType: actionType
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Interaction saved to database:', data);
        } else {
            console.error('❌ Failed to save interaction:', data.message);
        }
    })
    .catch(err => {
        console.error('❌ Network error saving interaction:', err);
        // TODO: Implement retry queue for failed interactions
    });
    */
}

// ==================== GET USER ID FROM AUTH ====================
/**
 * Get current user ID from authentication system
 * Falls back to userId from article container data attribute
 */
function getUserId(articlePanel) {
    // First try to get from localStorage (set by auth.js)
    const authUserId = localStorage.getItem('userId');
    if (authUserId) return authUserId;

    // Fall back to data attribute on article panel
    const dataUserId = articlePanel?.dataset.userId;
    if (dataUserId) return dataUserId;

    // Last resort fallback
    return 'guest-user';
}

// ==================== ARTICLE BUTTONS INITIALIZATION ====================
/**
 * Initialize buttons for all article panels
 * Handles visibility, dependency management, and interaction logging
 */
function initializeArticleButtons() {
    // Logs how many article panels exist to confirm correct initialization timing.
    const panels = document.querySelectorAll('.article-panel');
    console.log(`🔍 Found ${panels.length} article panels`);

    if (panels.length === 0) {
        console.error('❌ NO ARTICLE PANELS FOUND! Articles may not be rendered yet.');
        return;
    }

    panels.forEach(articlePanel => {
        const buttonRow = articlePanel.querySelector('.button-row');
        if (!buttonRow) {
            console.warn('⚠️ Button row not found in article panel:', articlePanel);
            return;
        }

        // Get article and user IDs
        const articleId = articlePanel.dataset.articleId || 'unknown-article';
        const userId = getUserId(articlePanel);

        // Get button elements
        const markReadBtn = buttonRow.querySelector('.read-button');
        const voteBtn = buttonRow.querySelector('[data-action="vote"]');
        const bookmarkBtn = buttonRow.querySelector('[data-action="bookmark"]');
        const summaryBtn = buttonRow.querySelector('[data-action="summary"]');
        const shareBtn = buttonRow.querySelector('[data-action="share"]');

        const dependentButtons = [voteBtn, bookmarkBtn, summaryBtn, shareBtn].filter(Boolean);

        // Initially, button row is hidden (CSS: display: none)
        // Arrow click handler in script.js already toggles visibility

        // ==================== MARK AS READ BUTTON ====================
        if (markReadBtn) {
            markReadBtn.addEventListener('click', function(e) {
                e.stopPropagation();

                // Prevent multiple clicks
                if (markReadBtn.classList.contains('read-done')) {
                    console.log('⏸️ Mark as Read already clicked for:', articleId);
                    return;
                }

                console.log('📘 Article marked as read:', articleId, 'by user:', userId);

                // ==================== UPDATE UI ====================
                // Update button appearance
                markReadBtn.classList.add('read-done');
                markReadBtn.classList.add('active');
                markReadBtn.disabled = true;

                const readText = markReadBtn.querySelector('.read-text');
                if (readText) readText.textContent = 'Read ✓';

                const readIcon = markReadBtn.querySelector('.read-icon');
                if (readIcon) {
                    readIcon.innerHTML = `<path d="M12 21V7"/><path d="m16 12 2 2 4-4"/><path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"/>`;
                }

                const ticks = buttonRow.querySelector('.ticks');
                if (ticks) ticks.classList.add('visible');

                // ==================== SHOW READ STATUS INDICATOR ====================
                // Add class to tile to show green checkmark badge + tricolor border
                articlePanel.classList.add('read-completed');
                console.log('✅ Read status indicator activated for article:', articleId);

                // Enable all dependent buttons
                console.log(`🔓 Unlocking ${dependentButtons.length} dependent buttons...`);
                dependentButtons.forEach(btn => {
                    if (btn) {
                        btn.classList.add('enabled');
                        btn.classList.remove('disabled');
                        btn.disabled = false;
                        console.log('  ✓ Enabled:', btn.id || btn.dataset.action);
                    }
                });

                // Save to database: action_type = 'read'
                logInteraction(articleId, userId, 'read');
            });
        }

        // ==================== VOTE BUTTON ====================
        if (voteBtn) {
            // Check if this article is voteable (editorials are not voteable)
            const isVoteable = voteBtn.dataset.isVoteable !== 'false';

            if (!isVoteable) {
                // Permanently disable vote button for editorials
                voteBtn.classList.add('disabled-permanently');
                voteBtn.style.opacity = '0.5';
                voteBtn.style.cursor = 'not-allowed';
                console.log('📰 Vote button permanently disabled (editorial article):', articleId);
            }

            voteBtn.addEventListener('click', function(e) {
                e.stopPropagation();

                // Check if permanently disabled (editorial)
                if (!isVoteable) {
                    console.log('🚫 Cannot vote on editorial articles');
                    return;
                }

                // Only work if enabled (after marking as read)
                if (!voteBtn.classList.contains('enabled')) {
                    console.log('🔒 Vote button disabled - mark article as read first');
                    if (window.showDialog) {
                        window.showDialog('dialog-read-first');
                    }
                    return;
                }

                // Toggle voted state
                const isVoted = voteBtn.classList.toggle('voted');
                const voteText = voteBtn.querySelector('span');
                if (voteText) {
                    voteText.textContent = isVoted ? 'Voted ✓' : 'Magazine Worthy??';
                }

                console.log('🗳️ Vote toggled:', isVoted ? 'VOTED' : 'UNVOTED', 'for article:', articleId);

                // Save to database: action_type = 'magazine_worthy'
                logInteraction(articleId, userId, 'magazine_worthy');
            });
        }

        // ==================== BOOKMARK BUTTON ====================
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', function(e) {
                e.stopPropagation();

                // Only work if enabled
                if (!bookmarkBtn.classList.contains('enabled')) {
                    console.log('🔒 Bookmark button disabled - mark article as read first');
                    if (window.showDialog) {
                        window.showDialog('dialog-read-first');
                    }
                    return;
                }

                // Toggle bookmarked state
                const isBookmarked = bookmarkBtn.classList.toggle('saved');
                const bookmarkText = bookmarkBtn.querySelector('span');
                if (bookmarkText) {
                    bookmarkText.textContent = isBookmarked ? 'Bookmarked' : 'Bookmark';
                }

                console.log('🔖 Bookmark toggled:', isBookmarked ? 'SAVED' : 'REMOVED', 'for article:', articleId);

                // Save to database: action_type = 'bookmark'
                // Note: Backend should handle toggle logic (insert if not exists, delete if exists)
                logInteraction(articleId, userId, 'bookmark');
            });
        }

        // ==================== SUMMARY BUTTON ====================
        if (summaryBtn) {
            summaryBtn.addEventListener('click', function(e) {
                e.stopPropagation();

                // Only work if enabled
                if (!summaryBtn.classList.contains('enabled')) {
                    console.log('🔒 Summary button disabled - mark article as read first');
                    if (window.showDialog) {
                        window.showDialog('dialog-read-first');
                    }
                    return;
                }

                console.log('📝 Opening summary modal for article:', articleId);

                // Open summary modal below the article panel
                openSummaryModal(articleId, userId, articlePanel);

                // Save to database: action_type = 'summary'
                logInteraction(articleId, userId, 'summary');
            });
        }

        // ==================== SHARE BUTTON ====================
        if (shareBtn) {
            shareBtn.addEventListener('click', function(e) {
                e.stopPropagation();

                console.log('📤 Share button clicked for article:', articleId);

                // Get current URL and page title
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);

                // Construct Telegram share URL
                const telegramShareUrl = `https://t.me/share/url?url=${url}&text=${title}`;

                // Open sharing dialog
                window.open(telegramShareUrl, '_blank');

                // Note: Share action is NOT stored in database per backend schema
                // Only client-side Telegram share functionality
                // No logInteraction call needed
            });
        }
    });
}

// ==================== SUMMARY MODAL ====================
const MAX_WORDS = 150;

function openSummaryModal(articleId, userId, articlePanel) {
    // Remove any existing summary modals first
    const existingModal = document.getElementById('summaryModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create new modal
    const summaryModal = document.createElement('div');
    summaryModal.id = 'summaryModal';
    summaryModal.className = 'summary-container';

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    summaryModal.innerHTML = `
        <div class="summary-header">
            <div>My Summary</div>
            <div id="noteDate">${formattedDate}</div>
            <div class="word-count-info">
                <span id="wordCount">0/150 words</span>
            </div>
            <button class="close-btn">&times;</button>
        </div>
        <div class="summary-body-wrapper">
            <textarea
                id="unicode-textbox"
                class="summary-body"
                placeholder="अपने विचारों को अपनी भाषा में संक्षेपित करें।
सभी भारतीय लिपियों और हर भाषा (यहाँ तक कि हिंग्लिश भी) का उपयोग नोट्स में किया जा सकता है।
समय बचाने के लिए, संक्षेपण के लिए Voice Typing / AI टूल्स का उपयोग करें।

Summarize your thoughts in your language. Every Bharatiya Script and every Language (even Hinglish) can be used in notes.
Use Voice Typing and AI tools to save time to summarize.."
                spellcheck="false"
            ></textarea>
            <button class="save-btn" id="summarySaveBtn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-8.69"/>
                    <path d="M22 4L12 14.01l-3-3"/>
                </svg>
            </button>
        </div>
        <div class="summary-footer">
            When you Click on <button class="get-notes-label" disabled>Get Your Notes</button> Button (Bottom of Page), Your Notes here will be part of Downloaded Notes
        </div>
    `;

    // Insert summary modal BELOW the article panel
    articlePanel.parentNode.insertBefore(summaryModal, articlePanel.nextSibling);

    // Store current article ID and user ID in modal
    summaryModal.dataset.currentArticleId = articleId;
    summaryModal.dataset.currentUserId = userId;
    summaryModal.classList.add('visible');

    // Update word count
    updateWordCount();
}

function updateWordCount() {
    const summaryTextBox = document.getElementById('unicode-textbox');
    const wordCountSpan = document.getElementById('wordCount');
    const wordCountInfo = document.querySelector('.word-count-info');

    if (!summaryTextBox || !wordCountSpan) return;

    const words = summaryTextBox.value.trim().split(/\s+/).filter(word => word.length > 0);
    const currentWords = words.length;

    wordCountSpan.textContent = `${currentWords}/${MAX_WORDS} words`;

    if (currentWords > MAX_WORDS) {
        wordCountInfo.classList.add('error');
        summaryTextBox.value = words.slice(0, MAX_WORDS).join(' ');
    } else {
        wordCountInfo.classList.remove('error');
    }
}

// ==================== SUMMARY MODAL EVENT LISTENERS ====================
document.addEventListener('click', function(e) {
    // Summary Save Button
    if (e.target.closest('#summarySaveBtn')) {
        const summaryModal = document.getElementById('summaryModal');
        const summaryTextBox = document.getElementById('unicode-textbox');
        const articleId = summaryModal?.dataset.currentArticleId;
        const userId = summaryModal?.dataset.currentUserId;

        if (summaryTextBox && summaryTextBox.value.trim() !== '' && articleId) {
            // Mark summary button as completed
            const articlePanel = document.querySelector(`[data-article-id="${articleId}"]`);
            const summaryBtn = articlePanel?.querySelector('[data-action="summary"]');
            if (summaryBtn) {
                summaryBtn.classList.add('summarized');
            }

            // TODO (Backend Integration): Save summary text to database
            // Endpoint: POST /api/articles/summary
            // Database: summaries table
            /*
            fetch('/api/articles/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    articleId: articleId,
                    summaryText: summaryTextBox.value.trim()
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log('✅ Summary saved to database:', data.id);
                }
            })
            .catch(err => console.error('❌ Error saving summary:', err));
            */
        }

        if (summaryModal) {
            summaryModal.classList.remove('visible');
        }
    }

    // Summary Close Button
    if (e.target.closest('.summary-container .close-btn')) {
        const summaryModal = document.getElementById('summaryModal');
        if (summaryModal) {
            summaryModal.classList.remove('visible');
        }
    }
});

// Real-time word counting
document.addEventListener('input', function(e) {
    if (e.target.id === 'unicode-textbox') {
        updateWordCount();
    }
});

// ==================== INFO ICON DIALOG SYSTEM ====================
/**
 * Info icon click handler - triggers proper dialogs
 * Works on all devices (mobile, tablet, desktop)
 */
document.addEventListener('click', function(e) {
    const clickedInfo = e.target.closest('.info-container');

    if (clickedInfo) {
        e.stopPropagation();

        // Get dialog target from data attribute
        const dialogTarget = clickedInfo.dataset.target;

        // Map old targets to new dialog IDs
        const dialogMap = {
            'read-info': 'dialog-read',
            'vote-info': 'dialog-vote',
            'vote-editorial-disabled-info': 'dialog-vote',
            'bookmark-info': 'dialog-bookmark',
            'summary-info': 'dialog-summary'
        };

        const dialogId = dialogMap[dialogTarget];

        if (dialogId && window.showDialog) {
            window.showDialog(dialogId);
            console.log(`ℹ️ Dialog opened: ${dialogId}`);
        }
    }
});

// ==================== INITIALIZE MANUALLY AFTER ARTICLES RENDER ====================
// This guarantees that button logic is initialized after dynamic articles exist in DOM.
// Prevents "dead buttons" issue seen earlier.
console.log('📦 buttons.js loaded – awaiting manual initialization (reinitializeButtons)...');
// No auto-init here – script.js will call window.reinitializeButtons() after renderArticles()

// Export the initialization function for manual triggering
window.reinitializeButtons = initializeArticleButtons;

// Export vote info icon updater for use in script.js
window.updateVoteInfoIcon = updateVoteInfoIcon;
