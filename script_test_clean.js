/**
 * ========================================
 * PURE TEXTHIGHLIGHTER.JS TEST SCRIPT
 * ========================================
 *
 * NO CUSTOM UI - Library defaults only
 * Purpose: See how library actually works
 *
 * Features Testing:
 * 1. Immediate highlighting (library default)
 * 2. Default yellow color
 * 3. Click-to-remove (library default)
 * 4. Serialization/persistence
 * ========================================
 */

console.log('🧪 TextHighlighter.js Test Script Loading...');

window.addEventListener('DOMContentLoaded', function() {

  let highlighter = null;

  // Wait for content to be fully rendered
  setTimeout(function() {

    console.log('📦 Initializing TextHighlighter.js...');

    // Get the main articles container
    const container = document.getElementById('articles-container');

    if (!container) {
      console.error('❌ #articles-container not found!');
      return;
    }

    // Check if library loaded
    if (typeof TextHighlighter === 'undefined') {
      console.error('❌ TextHighlighter library not loaded! Check CDN.');
      return;
    }

    // Initialize TextHighlighter with DEFAULT settings
    try {
      highlighter = new TextHighlighter(container, {
        color: '#ffff66',  // Default yellow
        highlightedClass: 'highlighted',
        contextClass: 'highlighter-context',
        onRemoveHighlight: function(highlight) {
          console.log('🗑️ Highlight removed:', highlight);
          saveHighlights();
        },
        onAfterHighlight: function(range, highlights) {
          console.log('✅ Text highlighted:', highlights.length, 'segments');
          console.log('📊 Highlighted text:', highlights.map(h => h.textContent).join(' | '));
          saveHighlights();
        }
      });

      console.log('✅ TextHighlighter initialized successfully!');
      console.log('📝 Library is ready. Select any text to highlight.');

      // Load any saved highlights
      loadHighlights();

    } catch(err) {
      console.error('❌ Error initializing TextHighlighter:', err);
    }

    // ==================== PERSISTENCE ====================

    function saveHighlights() {
      if (!highlighter) return;

      try {
        const serialized = highlighter.serializeHighlights();
        const articleId = document.getElementById('article-meta')?.getAttribute('data-article-id') || 'default';

        localStorage.setItem(`highlights_test_${articleId}`, serialized);
        console.log('💾 Highlights saved to localStorage');
        console.log('📦 Serialized data:', serialized);

      } catch(err) {
        console.error('❌ Error saving highlights:', err);
      }
    }

    function loadHighlights() {
      if (!highlighter) return;

      try {
        const articleId = document.getElementById('article-meta')?.getAttribute('data-article-id') || 'default';
        const serialized = localStorage.getItem(`highlights_test_${articleId}`);

        if (serialized) {
          highlighter.deserializeHighlights(serialized);
          console.log('📂 Highlights restored from localStorage');
          console.log('📦 Restored data:', serialized);
        } else {
          console.log('ℹ️ No saved highlights found');
        }

      } catch(err) {
        console.error('❌ Error loading highlights:', err);
      }
    }

    // ==================== GLOBAL HELPERS ====================

    // Clear all highlights
    window.clearAllHighlights = function() {
      if (highlighter) {
        highlighter.removeHighlights();
        const articleId = document.getElementById('article-meta')?.getAttribute('data-article-id') || 'default';
        localStorage.removeItem(`highlights_test_${articleId}`);
        console.log('🧹 All highlights cleared');
        return true;
      }
      console.warn('⚠️ Highlighter not initialized');
      return false;
    };

    // Get all highlights
    window.getAllHighlights = function() {
      if (highlighter) {
        const highlights = container.querySelectorAll('.highlighted');
        console.log('📊 Total highlights:', highlights.length);
        highlights.forEach((h, i) => {
          console.log(`  ${i + 1}. "${h.textContent}"`);
        });
        return highlights;
      }
      console.warn('⚠️ Highlighter not initialized');
      return [];
    };

    // Export highlights as text
    window.exportHighlights = function() {
      if (highlighter) {
        const highlights = container.querySelectorAll('.highlighted');
        const texts = Array.from(highlights).map(h => h.textContent.trim());
        const output = texts.join('\n\n');
        console.log('📤 Exported highlights:');
        console.log(output);
        return output;
      }
      console.warn('⚠️ Highlighter not initialized');
      return '';
    };

    console.log('📖 Test Commands Available:');
    console.log('  • clearAllHighlights() - Remove all highlights');
    console.log('  • getAllHighlights() - List all highlights');
    console.log('  • exportHighlights() - Export as text');

  }, 300); // Wait 300ms for DOM to be ready

});

console.log('🎯 Test script loaded. Waiting for DOMContentLoaded...');
