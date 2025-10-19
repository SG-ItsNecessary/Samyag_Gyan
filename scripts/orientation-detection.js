/**
 * Mobile Orientation Detection Script
 * Displays a message when user is in portrait mode on mobile
 * After "Got it" clicked: Shows faint reminder instead
 * RESETS on landscape: Full dialog appears again on next portrait
 * Excludes: Profile Creation and Landing Pages
 * Privacy-safe: No tracking, no cookies, no GAFA
 */

// Track acknowledgment only for current portrait session (NOT persistent)
let portraitAcknowledged = false;

function checkOrientation() {
    // Safeguard: Skip if page has 'no-rotate-warning' class
    if (document.body.classList.contains('no-rotate-warning')) {
        return;
    }

    const rotateMsg = document.getElementById('rotate-message');
    const rotateReminder = document.getElementById('rotate-reminder');
    if (!rotateMsg || !rotateReminder) {
        console.log('⚠️ Rotate elements not found');
        return; // Safeguard if elements are missing
    }

    // Show message only in portrait mode on mobile devices
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    console.log('📱 Orientation Check:', { isPortrait, isMobile, portraitAcknowledged });

    if (isPortrait && isMobile) {
        if (portraitAcknowledged) {
            // User already clicked "Got it" in THIS portrait session - show faint reminder
            rotateMsg.style.display = 'none';
            rotateReminder.style.display = 'block';
            console.log('💡 Showing faint reminder');
        } else {
            // Fresh portrait mode - show full dialog
            rotateMsg.style.display = 'block';
            rotateReminder.style.display = 'none';
            console.log('📢 Showing full dialog');
        }
    } else {
        // Landscape or desktop - hide both AND RESET
        rotateMsg.style.display = 'none';
        rotateReminder.style.display = 'none';
        portraitAcknowledged = false; // RESET! Next portrait will show full dialog again
        console.log('🌄 Landscape - hiding all and resetting');
    }
}

// Handle "Got it" button click - using event delegation for reliability
function setupGotItHandler() {
    const gotItBtn = document.getElementById('rotate-got-it');

    if (gotItBtn) {
        console.log('✅ Got it button found, attaching handler');
        gotItBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('🔘 Got it clicked!');

            // Mark as acknowledged for THIS portrait session only
            portraitAcknowledged = true;

            // Hide main dialog immediately
            const rotateMsg = document.getElementById('rotate-message');
            if (rotateMsg) {
                rotateMsg.style.display = 'none';
                console.log('✅ Main dialog hidden');
            }

            // Show faint reminder if still in portrait
            checkOrientation();
        });
    } else {
        console.log('❌ Got it button not found');
    }
}

// Run when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM loaded - setting up orientation detection');
        setupGotItHandler();
        checkOrientation();
    });
} else {
    // DOM already loaded
    console.log('📄 DOM already loaded - setting up immediately');
    setupGotItHandler();
    checkOrientation();
}

// Continuous detection on resize / orientation change
window.addEventListener('resize', function() {
    console.log('📏 Window resized');
    checkOrientation();
});

window.addEventListener('orientationchange', function() {
    console.log('🔄 Orientation changed');
    checkOrientation();
});
