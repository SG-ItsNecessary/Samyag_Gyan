// Get all action buttons and the Mark as Read button
const markReadBtn = document.getElementById('markReadBtn');
const allActionBtns = document.querySelectorAll('.action-btn');
const readText = markReadBtn.querySelector('.read-text');
const readIcon = markReadBtn.querySelector('.read-icon');
const readTicks = document.getElementById('readTicks');

// Individual button elements
const voteBtn = document.getElementById('voteBtn');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const reminderBtn = document.getElementById('reminderBtn');
const summaryBtn = document.getElementById('summaryBtn');
const summaryModal = document.getElementById('summaryModal');
const summarySaveBtn = document.getElementById('summarySaveBtn');
const summaryCloseBtn = summaryModal.querySelector('.close-btn');
const bookmarkTextSpan = document.getElementById('bookmarkText');
const shareBtn = document.getElementById('shareBtn');

// New elements for summary word count
const summaryTextBox = document.getElementById('unicode-textbox');
const wordCountSpan = document.getElementById('wordCount');
const wordCountInfo = document.querySelector('.word-count-info');
const MAX_WORDS = 100;

// Helper function to toggle a button's visual state and text
const toggleButton = (btn, text, defaultText, activeText) => {
    const isClicked = btn.classList.toggle(text);
    btn.querySelector('span').textContent = isClicked ? activeText : defaultText;
};

// Function to update the word count display and enforce the limit
const updateWordCount = () => {
    // Split the text into an array of words, handling multiple spaces and newlines
    const words = summaryTextBox.value.trim().split(/\s+/).filter(word => word.length > 0);
    const currentWords = words.length;

    // Update the word count display
    wordCountSpan.textContent = `${currentWords}/${MAX_WORDS} words`;

    // Check if the word count exceeds the limit
    if (currentWords > MAX_WORDS) {
        // Apply a visual error state
        wordCountInfo.classList.add('error');
        // Trim the text to the max word limit and update the textbox value
        summaryTextBox.value = words.slice(0, MAX_WORDS).join(' ');
    } else {
        // Remove the visual error state if within the limit
        wordCountInfo.classList.remove('error');
    }
};

// --- Mark as Read button logic (now a one-time click) ---
const handleMarkRead = () => {
    markReadBtn.classList.add('read-done');
    readText.textContent = 'Marked as Read';
    readTicks.classList.add('visible');
readIcon.innerHTML = `<path d="M12 21V7"/><path d="m16 12 2 2 4-4"/><path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"/>`;
    // Enable all other action buttons
    allActionBtns.forEach(button => {
        button.classList.add('enabled');
    });

    // Remove the event listener to prevent further clicks
    markReadBtn.removeEventListener('click', handleMarkRead);
};

markReadBtn.addEventListener('click', handleMarkRead);

// Individual button click handlers
voteBtn.addEventListener('click', () => {
    if (voteBtn.classList.contains('enabled')) {
        toggleButton(voteBtn, 'voted', 'Magazine Worthy ??', 'Magazine Worthy !!');
    }
});

bookmarkBtn.addEventListener('click', () => {
    if (bookmarkBtn.classList.contains('enabled')) {
        const isCurrentlySaved = bookmarkBtn.classList.toggle('saved');
        
        if (isCurrentlySaved) {
            bookmarkTextSpan.textContent = 'Bookmarked';
        } else {
            bookmarkTextSpan.textContent = 'Bookmark';
        }
    }
});



// Summary button logic
summaryBtn.addEventListener('click', () => {
    if (summaryBtn.classList.contains('enabled')) {
        summaryModal.classList.add('visible');
        updateWordCount(); // Update the count when the modal is opened
    }
});

summarySaveBtn.addEventListener('click', () => {
    if (summaryTextBox.value.trim() !== '') {
        summaryBtn.classList.add('summarized');
    }
    summaryModal.classList.remove('visible');
});

summaryCloseBtn.addEventListener('click', () => {
    summaryModal.classList.remove('visible');
});

// Event listener for real-time word counting as the user types
summaryTextBox.addEventListener('input', updateWordCount);

// Set date for summary modal
const today = new Date();
const formattedDate = today.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
});
document.getElementById('noteDate').textContent = formattedDate;

// --- Share Button Logic ---
shareBtn.addEventListener('click', () => {
    // Get the current URL and page title
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    // Construct the Telegram share URL
    const telegramShareUrl = `https://t.me/share/url?url=${url}&text=${title}`;

    // Open the sharing dialog in a new tab/window
    window.open(telegramShareUrl, '_blank');
});
