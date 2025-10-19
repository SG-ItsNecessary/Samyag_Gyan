// ==================== ETHICS & ESSAY BUTTONS (STANDALONE - NO CONDITIONALITY) ====================
// Only Summary and Share buttons - both work immediately with NO dependencies

const MAX_WORDS = 150;

// ==================== SUMMARY BUTTON HANDLER ====================
document.addEventListener('click', function(e) {
    const summaryBtn = e.target.closest('[data-action="summary"]');

    if (summaryBtn) {
        e.preventDefault();
        e.stopPropagation();

        const buttonRow = summaryBtn.closest('.button-row');
        const articleId = buttonRow?.dataset.articleId;

        if (!articleId) {
            console.error('❌ Article ID not found');
            return;
        }

        console.log('📝 Summary button clicked for article:', articleId);
        openSummaryModal(articleId, buttonRow);
    }
});

// ==================== SHARE BUTTON HANDLER ====================
document.addEventListener('click', function(e) {
    const shareBtn = e.target.closest('[data-action="share"]');

    if (shareBtn) {
        e.preventDefault();
        e.stopPropagation();

        const buttonRow = shareBtn.closest('.button-row');
        const articleId = buttonRow?.dataset.articleId;

        console.log('📤 Share button clicked for article:', articleId);

        // Get current URL and page title
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);

        // Construct Telegram share URL
        const telegramShareUrl = `https://t.me/share/url?url=${url}&text=${title}`;

        // Open sharing dialog
        window.open(telegramShareUrl, '_blank');
        console.log('✅ Telegram share window opened');
    }
});

// ==================== SUMMARY MODAL CREATION ====================
function openSummaryModal(articleId, buttonRow) {
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
            <div class="header-left">My Summary</div>
            <div id="noteDate" class="header-center">${formattedDate}</div>
            <div class="header-right">
                <div class="word-count-info">
                    <span id="wordCount">0/150 words</span>
                </div>
                <button class="close-btn">&times;</button>
            </div>
        </div>
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
        <div class="summary-actions">
            <button class="summary-save-chip-btn" id="summarySaveBtn">Save Notes</button>
        </div>
        <div class="summary-footer">
            When you click on <button class="get-notes-label" disabled>Get Your Notes</button> Button (Bottom of Page), Your Notes here will be part of Downloaded Notes along with your highlights
        </div>
    `;

    // Append modal to body
    document.body.appendChild(summaryModal);

    // Store article ID in modal
    summaryModal.dataset.currentArticleId = articleId;

    // Get elements
    const summaryTextBox = document.getElementById('unicode-textbox');
    const wordCountSpan = document.getElementById('wordCount');
    const wordCountInfo = document.querySelector('.word-count-info');

    // TODO: BACKEND - Load existing summary if available
    // GET /api/ethics-essays/summary?articleId={articleId}
    const savedSummary = localStorage.getItem(`ethics-essay-summary-${articleId}`) || '';
    summaryTextBox.value = savedSummary;

    // Show modal
    summaryModal.classList.add('visible');
    summaryTextBox.focus();
    updateWordCount();

    console.log('✅ Summary modal opened');

    // ==================== WORD COUNT UPDATE ====================
    function updateWordCount() {
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

    // ==================== REAL-TIME WORD COUNTING ====================
    summaryTextBox.addEventListener('input', updateWordCount);

    // ==================== SAVE BUTTON ====================
    const saveBtn = document.getElementById('summarySaveBtn');
    saveBtn.addEventListener('click', () => {
        const summaryText = summaryTextBox.value.trim();

        if (summaryText === '') {
            alert('Please write something before saving!');
            return;
        }

        // Mark summary button as completed (green background)
        const summaryBtn = buttonRow.querySelector('[data-action="summary"]');
        if (summaryBtn) {
            summaryBtn.classList.add('summarized');
        }

        // TODO: BACKEND - Save summary to database
        // POST /api/ethics-essays/save-summary
        // Body: { articleId: articleId, summary: summaryText }
        localStorage.setItem(`ethics-essay-summary-${articleId}`, summaryText);

        console.log('💾 Summary saved for article:', articleId);
        console.log('📝 Summary text:', summaryText.substring(0, 50) + '...');

        // Close modal
        summaryModal.classList.remove('visible');
        setTimeout(() => summaryModal.remove(), 300);
    });

    // ==================== CLOSE BUTTON ====================
    const closeBtn = summaryModal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        summaryModal.classList.remove('visible');
        setTimeout(() => summaryModal.remove(), 300);
    });

    // ==================== CLOSE ON OUTSIDE CLICK ====================
    summaryModal.addEventListener('click', (e) => {
        if (e.target === summaryModal) {
            summaryModal.classList.remove('visible');
            setTimeout(() => summaryModal.remove(), 300);
        }
    });
}

// ==================== ADD CSS STYLES ====================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
/* ==================== BUTTON ROW STYLES ==================== */
.button-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    padding: 10px;
    z-index: 1000;
}

/* ==================== ACTION BUTTON (SUMMARY) ==================== */
.action-btn {
    background-color: transparent;
    border: 2px solid #e74c3c;
    color: #e74c3c;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    white-space: nowrap;
    transition: all 0.3s ease;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
}

.action-btn:hover {
    border-color: #c0392b;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
}

.action-btn:active {
    transform: scale(0.98);
}

/* Summary button when text is saved */
.action-btn.summarized {
    background-color: rgba(46, 204, 113, 0.1);
    border-color: #2ecc71;
    color: #2ecc71;
}

.action-btn.summarized:hover {
    border-color: #27ae60;
}

/* SVG Icon Styling */
.action-btn svg {
    height: 24px;
    width: 24px;
}

.action-btn .icon-path {
    fill: #e74c3c;
    stroke: #e74c3c;
    stroke-width: 2;
    transition: fill 0.3s, stroke 0.3s;
}

.action-btn.summarized .icon-path {
    fill: #2ecc71;
    stroke: #2ecc71;
}

/* ==================== SHARE BUTTON STYLES ==================== */
.share-btn-wrapper {
    position: relative;
    display: inline-block;
}

.share-btn {
    background-color: rgba(36, 161, 222, 0.1);
    color: #24A1DE;
    border: 2px solid #24A1DE;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 8px;
}

.share-btn:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
}

.share-btn:active {
    transform: scale(0.98);
}

.telegram-icon {
    width: 24px;
    height: 24px;
    display: block;
}

/* Tooltip for Share button */
.share-btn .tooltip {
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    background-color: #fdfdfc;
    color: #24A1DE;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: normal;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: 1px solid #e0e0e0;
    z-index: 10;
}

.share-btn .tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #fdfdfc transparent transparent transparent;
}

.share-btn:hover .tooltip {
    opacity: 1;
    visibility: visible;
    bottom: 110%;
}

/* ==================== SUMMARY MODAL ==================== */
.summary-container {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    background-color: #fdfae6;
    border: 2px solid #94a3b8;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 2000;
    flex-direction: column;
    overflow: hidden;
}

.summary-container.visible {
    display: flex;
}

/* ==================== IMPROVED SUMMARY HEADER ==================== */
.summary-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    background-color: #f0f9ff;
    color: #1f2937;
    font-weight: bold;
    font-size: 1rem;
    padding: 0.75rem 1rem;
    border-bottom: 2px solid #94a3b8;
}

.header-left {
    justify-self: start;
}

.header-center {
    justify-self: center;
    font-size: 0.9rem;
    color: #64748b;
    font-weight: normal;
}

.header-right {
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.summary-header .word-count-info {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: normal;
}

.summary-header .word-count-info.error {
    color: #e74c3c;
    font-weight: bold;
}

.summary-header .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: #e74c3c;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;
}

.summary-header .close-btn:hover {
    background: rgba(239, 68, 68, 0.1);
}

/* ==================== TEXTAREA ==================== */
textarea.summary-body {
    flex-grow: 1;
    min-height: 200px;
    padding: 1rem;
    font-size: 0.95rem;
    line-height: 1.5rem;
    resize: none;
    border: none;
    outline: none;
    background-image: repeating-linear-gradient(
        to bottom, transparent, transparent 22px, #e2e8f0 23px
    );
    background-position: 0 14px;
}

/* ==================== SAVE BUTTON (CHIP DESIGN) ==================== */
.summary-actions {
    padding: 1rem;
    display: flex;
    justify-content: center;
    border-top: 1px solid #e2e8f0;
}

.summary-save-chip-btn {
    background: #fc7306;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(252, 115, 6, 0.3);
}

.summary-save-chip-btn:hover {
    background: #e45e00;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(252, 115, 6, 0.4);
}

.summary-save-chip-btn:active {
    transform: translateY(0);
}

/* ==================== FOOTER (GET YOUR NOTES LABEL) ==================== */
.summary-footer {
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-radius: 0 0 6px 6px;
    font-size: 0.9rem;
    color: #64748b;
    text-align: center;
    border-top: 1px solid #e2e8f0;
}

.get-notes-label {
    display: inline-block;
    padding: 0.3rem 0.6rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    margin: 0 0.25rem;
    cursor: not-allowed;
    opacity: 0.9;
}
`;
document.head.appendChild(styleSheet);

console.log('✅ Ethics & Essay standalone buttons initialized');
console.log('📋 Features: Summary (always active), Share (always active)');
console.log('🔓 NO conditionality - all buttons work immediately');
