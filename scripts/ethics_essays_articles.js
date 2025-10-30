const articles = [
  {
    "title": "War and Energy: Global Economic Stability",
    "article_type": "ethics", // ✅ ETHICS article
    "hashtags": "#Ethics #Essay #Geopolitics",
    "source_ribbon": "the-hindu",
    "secondary_ribbon": "Ethics",
    "publish_date": "19 October 2025",
    "prelude_title": "What do you understand by war and energy?",
    "prelude_body": "The relationship between war and energy is fundamentally one of causation and consequence, where energy resources—particularly crude oil—are both a frequent source of conflict and the immediate casualty of conflict.",
    "content": [
      {
        "main_question_id": 901,
        "main_answer_id": 1001,
        "article_id": 9,
        "language": "en",
        "question": "✦ How does conflict in oil-producing regions immediately and directly impact the global economy?",
        "answer": "Any conflict—whether internal instability, civil strife, or international war—in oil-producing regions has a direct and immediate impact on crude oil supply. Since crude oil is foundational to modern industrial economies, powering both production and transportation, any such disruption can severely affect global commerce. Maritime shipping of crude oil is particularly sensitive, given that finished goods and raw materials alike rely on petroleum-powered transport. Therefore, disruption in oil-producing areas or strategic sea lanes, such as those in the Middle East, can paralyze the flow of crude oil. The recent escalation between Iran and Israel has revived fears of a dual threat—disruption in oil production and in maritime oil transshipment routes critical to Asian and European economies."
      },
      {
        "main_question_id": 902,
        "main_answer_id": 1002,
        "article_id": 9,
        "language": "en",
        "question": "✦ How did the economic impact of U.S. tariffs temporarily suppress crude oil prices despite rising geopolitical conflict?",
        "answer": "Despite the looming specter of conflict, crude oil prices dropped from $71.53 in February to $62.52 by June 1, 2025. This decline was largely driven by the imposition of U.S. tariffs on imports from major trade partners including Japan, India, South Korea, China, and the European Union. These tariffs led to a fall in global trade volumes, which in turn reduced industrial output. Lower output translated into diminished demand for crude oil—both for manufacturing and shipping—contributing to a decrease in prices. Thus, while geopolitical conflict was rising, economic slowdown induced by trade protectionism temporarily suppressed oil demand, pulling prices down."
      },
      {
        "main_question_id": 903,
        "main_answer_id": 1003,
        "article_id": 9,
        "language": "en",
        "question": "✦ Given Iran's reduced production, how does its geographic location and the actions of allied groups like the Houthis still elevate global oil market volatility?",
        "answer": "Though Iran is not a dominant player in the current global oil market due to international sanctions, its geographic location remains pivotal. It sits astride the Strait of Hormuz, a vital artery through which a fifth of the world's oil passes. Any disruption here could panic the markets. Iran's current production has halved from 3.3 to 1.6 million barrels per day, yet its strategic position allows it to influence global shipping indirectly. Allied actors like the Houthis in Yemen amplify this threat by targeting Saudi oil infrastructure and disrupting Red Sea shipping lanes. In recent weeks, the Houthis have even dared to engage the advanced U.S. Navy in the Red Sea, escalating the perception of threat. These asymmetric pressures raise uncertainty in maritime transit, even when physical oil volumes are unaffected. The psychological and logistical risks converge to elevate market volatility."
      }
    ],
    "endRibbons": []
  },
  {
    "title": "OPEC+ Fragmentation and Strategic Petroleum Reserves",
    "article_type": "essay", // ✅ ESSAY article
    "hashtags": "#Ethics #Essay #Energy",
    "source_ribbon": "indian-express",
    "secondary_ribbon": "Essay",
    "publish_date": "19 October 2025",
    "prelude_title": "What do you understand by war and energy?",
    "prelude_body": "The relationship between war and energy is fundamentally one of causation and consequence, where energy resources—particularly crude oil—are both a frequent source of conflict and the immediate casualty of conflict.",
    "content": [
      {
        "main_question_id": 904,
        "main_answer_id": 1004,
        "article_id": 10,
        "language": "en",
        "question": "✦ What are the conflicting production incentives within the OPEC+ structure that fragment the cartel's control and limit its ability to stabilize global oil prices?",
        "answer": "OPEC and its extended group, OPEC+, exercise considerable influence over global oil pricing by controlling production volumes. Many OPEC nations have economies heavily reliant on oil exports and, in times of price drops, resort to production cuts to artificially elevate prices and protect national revenues. In contrast, non-OPEC producers like Russia and Iran, often under sanctions or with separate geopolitical considerations, act unilaterally and sometimes increase output to meet fiscal needs. This fragmented control limits the cartel's ability to stabilize prices, making the market vulnerable to conflicting production incentives during times of tension or economic slowdown."
      },
      {
        "main_question_id": 905,
        "main_answer_id": 1005,
        "article_id": 10,
        "language": "en",
        "question": "✦ How does India's significantly lower Strategic Petroleum Reserve (SPR) capacity compare to its major Asian counterparts and expose it to a strategic disadvantage?",
        "answer": "Asia houses the world's largest oil importers—China, India, Japan, and South Korea—all of whom have limited domestic oil production and are vulnerable to supply shocks. Their energy security strategies hinge on robust Strategic Petroleum Reserves (SPRs), which differ significantly across countries. Japan maintains about 470 million barrels—240 days of import cover—while China holds roughly 400 million barrels for 90 days, and South Korea about 214 million barrels for up to 100 days. India, by contrast, holds just 39 million barrels, covering a mere 13–15 days. While India benefits from geographic proximity to West Asia and discounted Russian imports, this advantage is offset by its minimal buffer capacity. In a prolonged crisis, this could place India at a significant strategic disadvantage."
      },
      {
        "main_question_id": 906,
        "main_answer_id": 1006,
        "article_id": 10,
        "language": "en",
        "question": "✦ Despite its energy independence, why must the United States maintain a substantial naval presence and seek renewed global collaboration to counter asymmetric threats to key international sea lanes?",
        "answer": "The United States enjoys a unique geopolitical insulation due to its massive domestic production, shale oil boom, and secure continental positioning. Now a net exporter, the U.S. is both the world's largest producer and one of its largest consumers, enabling strategic autonomy in oil policy. In contrast, Europe remains exposed. Having cut Russian imports, it now relies on West Asian and American oil, making it acutely sensitive to West Asian instability. Asian economies, despite their storage reserves, remain logistically dependent on stable sea lanes. Meanwhile, oil-producing nations in OPEC+ continue to wield disproportionate influence despite fragmented alignment. The resulting configuration is an asymmetric oil order—where supply chains are tightly interdependent, but shock absorbers like SPRs, geography, and naval guarantees vary widely. Any disruption—or even the perceived possibility of disruption—in oil production or maritime flow drives up crude oil prices globally. The U.S. Navy's role in securing these sea lanes has been essential for decades, but now faces unprecedented challenges from non-state actors like the Houthis, necessitating renewed global collaboration to maintain maritime security and stabilize energy markets."
      }
    ],
    "endRibbons": []
  }
];

const sourceMap = { "the-hindu": "The Hindu", "indian-express": "Indian Express", "both": "Both (IE + TH)", "pib-other": "PIB / Other" };

const source_ribbon = { "the-hindu": "#009688", "indian-express": "#8BC34A", "both": "#2196F3", "pib-other": "#D32F2F" };

function renderEthicsEssayArticles() {
  const container = document.getElementById('articles-container');
  container.innerHTML = '';

  articles.forEach((article) => {
    const tile = document.createElement('div');
    tile.classList.add('article-tile');
    tile.classList.add('article-panel'); // For button logic selector
    tile.dataset.expanded = 'false';
    tile.dataset.articleId = article.article_id || article.title; // For interaction logging
    tile.dataset.userId = 'current-user'; // Will be replaced by actual userId from auth

    const leftRibbon = document.createElement('div');
    leftRibbon.className = 'source-ribbon';
    leftRibbon.textContent = sourceMap[article.source_ribbon] || "Source"; //  Correct property name
    leftRibbon.style.backgroundColor = source_ribbon[article.source_ribbon] || "#666"; //  Correct property name

    const usabilityRibbon = document.createElement('div');
    usabilityRibbon.className = 'usability-ribbon';
    usabilityRibbon.textContent = article.secondary_ribbon || ""; // Correct property name

    const title = document.createElement('div');
    title.className = 'article-title';
    title.textContent = article.title;

    const tags = document.createElement('div');
    tags.className = 'tags';
    tags.textContent = article.hashtags; //  Correct property name

    const dateBlock = document.createElement('div');
    dateBlock.className = 'article-date';
    dateBlock.textContent = article.publish_date || ""; //  Correct property name
    dateBlock.style.display = 'none';

    const preludeWrap = document.createElement('div');
    preludeWrap.className = 'prelude-section';
    preludeWrap.innerHTML = `
      <span class="prelude-title">${article.prelude_title || 'Why should I read it?'}</span>
      <span class="prelude-body">${article.prelude_body || ''}</span>
    `; // ✅ Correct property names
    preludeWrap.style.display = 'none';

    const contentArea = document.createElement('div');
    contentArea.className = 'content-area highlight-zone';
    contentArea.style.display = 'none';

    // ==================== MAIN CONTENT Q&A ====================
    article.content.forEach((qna) => {
      const q = document.createElement('span');
      q.className = 'question';
      q.dataset.main_question_id = qna.main_question_id;
      q.dataset.article_id = qna.article_id;
      q.dataset.language = qna.language || 'en';
      q.textContent = qna.question;

      const a = document.createElement('p');
      a.className = 'answer';
      a.dataset.main_answer_id = qna.main_answer_id;
      a.dataset.main_question_id = qna.main_question_id;
      a.dataset.article_id = qna.article_id;
      a.dataset.language = qna.language || 'en';
      a.textContent = qna.answer;

      contentArea.appendChild(q);
      contentArea.appendChild(a);
    });

    const endRibbonZone = document.createElement('div');
    endRibbonZone.className = 'end-content-ribbons';
    endRibbonZone.style.display = 'none';

    const subContentBox = document.createElement('div');
    subContentBox.className = 'sub-tile';
    subContentBox.style.display = 'none';

    article.endRibbons.forEach((r) => {
      // Skip Mindmaps and Prelims pointer buttons for Ethics & Essay articles
      if (r.type === 'mindmap' || r.type === 'prelims') {
        return; // Skip this ribbon
      }

      const ribbon = document.createElement('div');
      ribbon.className = 'end-content-ribbon-item';
      ribbon.textContent = r.label;
      ribbon.style.backgroundColor = r.color;

      ribbon.addEventListener('click', () => {
        subContentBox.innerHTML = '';
        if (r.type === 'mindmap') {
          openFloatingViewer(r.src);
        } else if (r.type === 'prelims') {
          const wrapper = document.createElement('div');
          wrapper.className = 'prelims-content-wrapper';
          r.content.forEach((qna) => {
            const q = document.createElement('div');
            q.className = 'prelims-question';
            q.dataset.prelims_question_id = qna.prelims_question_id;
            q.dataset.article_id = qna.article_id;
            q.dataset.language = qna.language || 'en';
            q.textContent = qna.q;

            const a = document.createElement('div');
            a.className = 'prelims-answer';
            a.dataset.prelims_answer_id = qna.prelims_answer_id;
            a.dataset.prelims_question_id = qna.prelims_question_id;
            a.dataset.article_id = qna.article_id;
            a.dataset.language = qna.language || 'en';
            a.textContent = qna.a;

            wrapper.appendChild(q);
            wrapper.appendChild(a);
          });
          subContentBox.appendChild(wrapper);
          subContentBox.style.display = 'block';
        }
      });
      endRibbonZone.appendChild(ribbon);
    });

    const arrowContainer = document.createElement('div');
    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'main-arrow-btn';
    arrowBtn.innerHTML = '<div class="css-arrow"></div>';

    arrowBtn.addEventListener('click', () => {
      const isExpanded = tile.classList.contains('expanded');
      document.querySelectorAll('.article-tile').forEach((t) => {
        t.classList.remove('expanded');
        t.dataset.expanded = 'false';
        t.querySelector('.content-area').style.display = 'none';
        t.querySelector('.sub-tile').style.display = 'none';
        t.querySelector('.end-content-ribbons').style.display = 'none';
        t.querySelector('.prelude-section').style.display = 'none';
        t.querySelector('.article-date').style.display = 'none';
        t.querySelector('.main-arrow-btn').classList.remove('rotated');
        // Hide button row when collapsing
        if (t.querySelector('.button-row')) {
          t.querySelector('.button-row').style.display = 'none';
        }
        // Hide archive button when collapsing
        if (t.querySelector('.archive-btn-left')) {
          t.querySelector('.archive-btn-left').style.display = 'none';
        }
        // Close any open summary modals when collapsing
        const summaryModal = document.getElementById('summaryModal');
        if (summaryModal) {
          summaryModal.classList.remove('visible');
        }
      });

      if (!isExpanded) {
        tile.classList.add('expanded');
        tile.dataset.expanded = 'true';
        contentArea.style.display = 'block';
        endRibbonZone.style.display = 'flex';
        preludeWrap.style.display = 'block';
        dateBlock.style.display = 'block';
        arrowBtn.classList.add('rotated');
        updateURLForArticle(article.title, article.publish_date, article.article_type || 'news'); // ✅ Pass article type
        showTileTooltip();
        // Show button row when expanding
        buttonRow.style.display = 'flex';
        // Show archive button when expanding (if exists)
        if (tile.querySelector('.archive-btn-left')) {
          tile.querySelector('.archive-btn-left').style.display = 'block';
        }
      }
    });

    arrowContainer.className = 'arrow-container';
    arrowContainer.appendChild(arrowBtn);

    tile.appendChild(leftRibbon);
    tile.appendChild(usabilityRibbon);
    tile.appendChild(title);
    tile.appendChild(tags);
    tile.appendChild(dateBlock);
    tile.appendChild(preludeWrap);
    tile.appendChild(contentArea);
    tile.appendChild(endRibbonZone);
    tile.appendChild(subContentBox);

    // Read button removed for Ethics & Essay articles (weekly content, no read tracking needed)

    const separator = document.createElement('hr');
    separator.className = 'tile-separator';
    tile.appendChild(separator);

    // ==================== BUTTON ROW (SUMMARY + SHARE ONLY) ====================
    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';
    buttonRow.style.display = 'none'; // Hidden by default, shown when tile expands
    buttonRow.dataset.articleId = article.article_id || article.title;

    buttonRow.innerHTML = `
      <!-- Summary Button -->
      <button class="action-btn" id="summaryBtn-${article.article_id || article.title}" data-action="summary" title="Write your own summary notes for this article">
        <svg viewBox="0 0 24 24">
          <path class="icon-path" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <path class="icon-path" d="M14 2v6h6M8 15h8M8 11h8M8 19h8"/>
        </svg>
        <span>Summary</span>
      </button>

      <!-- Share Button -->
      <div class="share-btn-wrapper">
        <button class="share-btn" id="shareBtn-${article.article_id || article.title}" data-action="share" title="Share this article on Telegram with your peers">
          <svg class="telegram-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512" xml:space="preserve">
            <circle style="fill:#47B0D3;" cx="256" cy="256" r="256"/>
            <path style="fill:#3298BA;" d="M34.133,256c0-135.648,105.508-246.636,238.933-255.421C267.424,0.208,261.737,0,256,0
              C114.615,0,0,114.615,0,256s114.615,256,256,256c5.737,0,11.424-0.208,17.067-0.579C139.642,502.636,34.133,391.648,34.133,256z"/>
            <path style="fill:#E5E5E5;" d="M380.263,109.054c-2.486-1.69-5.676-1.946-8.399-0.679L96.777,236.433
              c-4.833,2.251-7.887,7.172-7.766,12.501c0.117,5.226,3.28,9.92,8.065,12.015l253.613,110.457c8.468,3.849,18.439-2.21,18.983-11.453
              l14.314-243.341C384.161,113.614,382.748,110.742,380.263,109.054z"/>
            <polygon style="fill:#CCCCCC;" points="171.631,293.421 188.772,408 379.168,108.432 "/>
            <path style="fill:#FFFFFF;" d="M371.866,108.375L96.777,236.433c-4.737,2.205-7.826,7.121-7.769,12.345
              c0.058,5.233,3.276,10.074,8.067,12.171l74.557,32.471l207.536-184.988C376.882,107.33,374.203,107.287,371.866,108.375z"/>
            <polygon style="fill:#E5E5E5;" points="211.418,310.749 188.772,408 379.168,108.432 "/>
            <path style="fill:#FFFFFF;" d="M380.263,109.054c-0.351-0.239-0.72-0.442-1.095-0.622l-167.75,202.317l139.27,60.657
              c8.468,3.849,18.439-2.21,18.983-11.453l14.314-243.341C384.161,113.614,382.748,110.742,380.263,109.054z"/>
          </svg>
          <span class="share-text">Share</span>
          <span class="tooltip">Share & Discuss with Peers !!!</span>
        </button>
      </div>
    `;

    tile.appendChild(buttonRow);

    // ==================== DYNAMIC ARCHIVE BUTTON + ARROW ROW ====================
    // Create wrapper that holds archive button (left) and arrow (right)
    const topControlsRow = document.createElement('div');
    topControlsRow.className = 'top-controls-row';
    topControlsRow.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    `;

    // Add archive button based on article type (left side)
    const articleType = article.article_type || 'news';
    const archiveBtnLeft = document.createElement('div');
    archiveBtnLeft.className = 'archive-btn-left';
    archiveBtnLeft.style.display = 'none'; // Hidden by default, shown when expanded

    if (articleType === 'editorial') {
      archiveBtnLeft.innerHTML = `
        <a href="/upsc-editorials/"
           target="_blank"
           rel="noopener noreferrer"
           class="chip-btn"
           style="
             background-color: #fc7306;
             color: #ffffff;
             border: 2px solid #fcd7b6;
             border-radius: 9999px;
             padding: 5px 14px;
             font-size: 9px;
             font-weight: 700;
             cursor: pointer;
             text-decoration: none;
             display: inline-block;
             box-shadow: 0 2px 6px rgba(0,0,0,0.08);
             transition: all 0.25s ease;
           "
           onmouseover="this.style.backgroundColor='#ff8b33'; this.style.boxShadow='0 4px 10px rgba(0,0,0,0.15)';"
           onmouseout="this.style.backgroundColor='#fc7306'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.08)';"
           onmousedown="this.style.backgroundColor='#e45e00';"
           onmouseup="this.style.backgroundColor='#ff8b33';">
          All Editorials on SG
        </a>
      `;
    } else if (articleType === 'ethics') {
      archiveBtnLeft.innerHTML = `
        <a href="/upsc-ethics/"
           target="_blank"
           rel="noopener noreferrer"
           class="chip-btn"
           style="
             background-color: #fc7306;
             color: #ffffff;
             border: 2px solid #fcd7b6;
             border-radius: 9999px;
             padding: 5px 14px;
             font-size: 9px;
             font-weight: 700;
             cursor: pointer;
             text-decoration: none;
             display: inline-block;
             box-shadow: 0 2px 6px rgba(0,0,0,0.08);
             transition: all 0.25s ease;
           "
           onmouseover="this.style.backgroundColor='#ff8b33'; this.style.boxShadow='0 4px 10px rgba(0,0,0,0.15)';"
           onmouseout="this.style.backgroundColor='#fc7306'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.08)';"
           onmousedown="this.style.backgroundColor='#e45e00';"
           onmouseup="this.style.backgroundColor='#ff8b33';">
          All Ethics on SG
        </a>
      `;
    } else if (articleType === 'essay') {
      archiveBtnLeft.innerHTML = `
        <a href="/upsc-essays/"
           target="_blank"
           rel="noopener noreferrer"
           class="chip-btn"
           style="
             background-color: #fc7306;
             color: #ffffff;
             border: 2px solid #fcd7b6;
             border-radius: 9999px;
             padding: 5px 14px;
             font-size: 9px;
             font-weight: 700;
             cursor: pointer;
             text-decoration: none;
             display: inline-block;
             box-shadow: 0 2px 6px rgba(0,0,0,0.08);
             transition: all 0.25s ease;
           "
           onmouseover="this.style.backgroundColor='#ff8b33'; this.style.boxShadow='0 4px 10px rgba(0,0,0,0.15)';"
           onmouseout="this.style.backgroundColor='#fc7306'; this.style.boxShadow='0 2px 6px rgba(0,0,0,0.08)';"
           onmousedown="this.style.backgroundColor='#e45e00';"
           onmouseup="this.style.backgroundColor='#ff8b33';">
          All Essays on SG
        </a>
      `;
    }
    // News articles: NO archive button (default current affairs view)

    // Assemble the row: archive button (left) + arrow container (right)
    if (articleType !== 'news') {
      topControlsRow.appendChild(archiveBtnLeft);
    }
    topControlsRow.appendChild(arrowContainer);

    tile.appendChild(topControlsRow);

    container.appendChild(tile);
  });
} // End of renderArticles() function

// DUPLICATE CODE REMOVED - Lines 402-574 were orphaned code causing "article is not defined" error

// -----------------------------
// Clean URL: convert title to slug
// -----------------------------
function slugifyTitle(title) {
  return title.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")  // replace non-alphanumerics with "-"
              .replace(/^-+|-+$/g, "");     // trim leading/trailing "-"
}

// -----------------------------
// Convert human-readable date to ISO format (YYYY-MM-DD)
// -----------------------------
function convertDateToISO(dateString) {
  // Converts "18 July 2025" → "2025-07-18"
  const months = {
    'january': '01', 'february': '02', 'march': '03', 'april': '04',
    'may': '05', 'june': '06', 'july': '07', 'august': '08',
    'september': '09', 'october': '10', 'november': '11', 'december': '12'
  };

  const parts = dateString.trim().split(' ');
  const day = parts[0].padStart(2, '0');
  const month = months[parts[1].toLowerCase()];
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

// -----------------------------
// Update URL when a tile/article is opened
// -----------------------------
function updateURLForArticle(title, publishDate, articleType = 'news') {
  const slug = slugifyTitle(title);
  // Convert "18 July 2025" to "2025-07-18" for clean, SEO-friendly URLs
  const isoDate = convertDateToISO(publishDate);

  // SEO-optimized URL structure based on article type (v2.0)
  let newPath;
  switch(articleType) {
    case 'editorial':
      newPath = `/upsc-editorials/${isoDate}/${slug}`;  // ✅ Updated: cleaner URL
      break;
    case 'ethics':
      newPath = `/upsc-ethics/${slug}`;  // ✅ Updated: NO DATE (timeless content)
      break;
    case 'essay':
      newPath = `/upsc-essays/${slug}`;  // ✅ Updated: NO DATE (timeless content) + plural
      break;
    case 'news':
    default:
      newPath = `/upsc-current-affairs/${isoDate}/${slug}`;
      break;
  }

  history.replaceState(null, "", newPath);
}

// -----------------------------
// Get publish Date and slug from URL
// -----------------------------
function getArticleDataFromURL() {
  // Example pathnames (v2.0):
  // "/upsc-current-affairs/2025-08-25" → all articles for date
  // "/upsc-current-affairs/2025-08-25/article-slug" → specific news article
  // "/upsc-editorials/2025-08-25/article-slug" → specific editorial (NEW!)
  // "/upsc-editorials/" → all editorials archive
  // "/upsc-ethics/article-slug" → specific ethics (NO DATE - NEW!)
  // "/upsc-ethics/" → all ethics archive
  // "/upsc-essays/article-slug" → specific essay (NO DATE - NEW!)
  // "/upsc-essays/" → all essays archive

  const pathParts = window.location.pathname.split("/").filter(Boolean);

  // Handle Current Affairs (News only)
  if (pathParts[0] === 'upsc-current-affairs') {
    if (pathParts.length === 2) {
      return { articleType: 'news', publishDate: pathParts[1], slug: null };
    } else if (pathParts.length >= 3) {
      return { articleType: 'news', publishDate: pathParts[1], slug: pathParts[2] };
    }
  }

  // Handle Editorials (separate category now - v2.0)
  if (pathParts[0] === 'upsc-editorials') {
    if (pathParts.length === 1) {
      // Archive page: /upsc-editorials/
      return { articleType: 'editorial', publishDate: null, slug: null, isArchive: true };
    } else if (pathParts.length === 2) {
      // Date page: /upsc-editorials/2025-01-18
      return { articleType: 'editorial', publishDate: pathParts[1], slug: null };
    } else if (pathParts.length >= 3) {
      // Specific article: /upsc-editorials/2025-01-18/article-slug
      return { articleType: 'editorial', publishDate: pathParts[1], slug: pathParts[2] };
    }
  }

  // Handle Ethics (NO DATE - v2.0)
  if (pathParts[0] === 'upsc-ethics') {
    if (pathParts.length === 1) {
      // Archive page: /upsc-ethics/
      return { articleType: 'ethics', publishDate: null, slug: null, isArchive: true };
    } else if (pathParts.length >= 2) {
      // Specific article: /upsc-ethics/article-slug (NO DATE!)
      return { articleType: 'ethics', publishDate: null, slug: pathParts[1] };
    }
  }

  // Handle Essays (NO DATE - v2.0)
  if (pathParts[0] === 'upsc-essays') {
    if (pathParts.length === 1) {
      // Archive page: /upsc-essays/
      return { articleType: 'essay', publishDate: null, slug: null, isArchive: true };
    } else if (pathParts.length >= 2) {
      // Specific article: /upsc-essays/article-slug (NO DATE!)
      return { articleType: 'essay', publishDate: null, slug: pathParts[1] };
    }
  }

  return null;
}

// -----------------------------
// Usage example
// -----------------------------
const articleData = getArticleDataFromURL();
if (articleData) {
  console.log("Publish Date:", articleData.publishDate);
  console.log("Slug:", articleData.slug);
}


window.onload = function () {
  // ================================
  // DATE-BASED URL HANDLING
  // ================================
  // Check if coming from homepage with date parameter (legacy fallback)
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get('date'); // e.g., "2025-08-25"

  if (dateParam) {
    // Update URL to SEO-optimized structure (remove query param)
    history.replaceState(null, '', `/upsc-current-affairs/${dateParam}`);
  }

  let selectedRange = null;
  let paletteElement = null;
  let paletteTimeout = null; // ⬅️ Track the auto-hide timeout


  function createHighlightPalette(x, y) {
    // Remove existing palette
    if (paletteElement) paletteElement.remove();
    clearTimeout(paletteTimeout); // ⬅️ Clear any previous timeout


    // Create palette
    const colors = ['#ffff66', '#a2faa3', '#9df2ff', '#ffb3ba'];
    paletteElement = document.createElement('div');
    paletteElement.className = 'highlight-palette';


    // Tick button (needs access in color-btn onclick)
    const tickButton = document.createElement('button');
    tickButton.textContent = '✓✓';
    tickButton.className = 'tick-btn';
    tickButton.style.display = 'none';


    tickButton.onclick = function () {
      paletteElement.remove();
      selectedRange = null;
      clearTimeout(paletteTimeout); // ⬅️ Stop timer if ticked
    };


    // Add color buttons
    colors.forEach(color => {
      const button = document.createElement('button');
      button.className = 'color-btn';
      button.style.backgroundColor = color;


      button.onclick = function () {
        if (!selectedRange) return;


        const span = document.createElement('span');
        span.className = 'custom-highlight';
        span.style.backgroundColor = color;
        span.textContent = selectedRange.toString();


        selectedRange.deleteContents();
        selectedRange.insertNode(span);


        tickButton.style.display = 'inline-block';
        clearTimeout(paletteTimeout); // ⬅️ Cancel auto-hide on color select
      };


      paletteElement.appendChild(button);
    });


    paletteElement.appendChild(tickButton);
    document.body.appendChild(paletteElement);


   {
  const isMobile = window.innerWidth <= 767; // You can tweak this threshold if needed
  const offsetY = isMobile ? 110 : 75;       // 110 for mobile, 75 for larger screens


  paletteElement.style.position = 'absolute';
  paletteElement.style.top = `${y + offsetY}px`; // Adaptive offset below the selection
  paletteElement.style.left = `${x}px`;
  paletteElement.style.transform = 'translateX(0)';
}


    // ⏲️ Auto-hide after 5 seconds if no interaction
    paletteTimeout = setTimeout(() => {
      if (paletteElement) {
        paletteElement.remove();
        paletteElement = null;
        selectedRange = null;
        window.getSelection()?.removeAllRanges(); // Clear selection
      }
    }, 5000);
  }


  document.addEventListener('selectionchange', function () {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;


    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();


    selectedRange = range.cloneRange();
    createHighlightPalette(rect.left + window.scrollX, rect.top + window.scrollY - 50);
  });
// --- Step 1: Render hardcoded data immediately ---
  // renderArticles(sampleArticles);

  // --- Step 2: Try to fetch from backend API ---
  fetch('/api/articles')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        renderArticles(data);
      } else {
        console.warn("API returned empty list, keeping fallback data.");
      }
    })
    .catch(err => {
      console.error("API fetch failed, using fallback data:", err);
    });


  // Optional article render logic
  renderEthicsEssayArticles();

  // NOTE: For Ethics & Essay, buttons are handled by ethics_essays_buttons.js
  // No need to call reinitializeButtons() - buttons work via event delegation
  console.log('✅ Articles rendered - buttons ready (event delegation)');


  const articleData = getArticleDataFromURL();
  if (articleData && articleData.slug) {
    setTimeout(() => {
      const tiles = document.querySelectorAll(".article-tile");
      tiles.forEach(tile => {
        const title = tile.querySelector(".article-title")?.textContent || "";
        if (slugifyTitle(title) === articleData.slug) {
          tile.querySelector(".main-arrow-btn")?.click();
        }
      });
    }, 100);
  }
};
function openFloatingViewer(src) {
  const viewer = document.getElementById("floating-image-viewer");
  const image = document.getElementById("floating-image");



  image.src = src;
  image.classList.remove("zoomed"); // Reset zoom
  viewer.classList.remove("hidden");
}


// Close button (×) functionality
document.getElementById("close-floating-image")?.addEventListener("click", () => {
  const viewer = document.getElementById("floating-image-viewer");
  viewer.classList.add("hidden");
});
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("close-floating-image");
  const viewer = document.getElementById("floating-image-viewer");


  if (closeBtn && viewer) {
    closeBtn.addEventListener("click", () => {
      viewer.classList.add("hidden");
    });
  }
});
// ========== Block Ctrl+C, Ctrl+S, Ctrl+P ==========


document.addEventListener('DOMContentLoaded', () => {
  // Block Ctrl+C / Ctrl+S / Ctrl+P
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && ['c', 's', 'p'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);


  // Block right-click context menu everywhere
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });


  // Block long-press on mobile (by canceling touchstart + disabling callout)
  document.body.addEventListener('touchstart', function (e) {
    if (e.target.tagName === 'IMG' || e.target.closest('.no-long-press')) {
      e.preventDefault();
    }
  }, { passive: false });


  // Optional: Disable selection and dragging of images
  document.querySelectorAll('img, .no-save').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.style.userSelect = 'none';
    img.style.pointerEvents = 'none';
  });
});


// ✅ Zoom toggle on image click
// Note: Ethics & Essay articles don't have floating images, so skip this
const floatingImage = document.getElementById("floating-image");
if (floatingImage) {
  floatingImage.addEventListener("click", function () {
    this.classList.toggle("zoomed");
  });
  floatingImage.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    alert("⚠️ This image is meant to aid your absorption of the issue. Downloading may not help. Nevertheless Samyag Gyan will be available each fortnight with all relevant Mindmaps.");
  });
}

// ========== Security Features JS ==========

// 1. ❌ Block Ctrl+C, Ctrl+S, Ctrl+P (copy, save, print)
document.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && ['c', 's', 'p'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
});


// 2. ❌ Disable right-click on desktop
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});


// 3. ❌ Block long-press menu on mobile (which usually opens text copy options)
document.addEventListener('touchstart', function (e) {
  if (e.targetTouches.length > 1) return; // allow pinch-zoom
  this._longPressTimer = setTimeout(function () {
    e.preventDefault(); // block long-press context menu
  }, 500);
}, { passive: false });


document.addEventListener('touchend', function () {
  clearTimeout(this._longPressTimer);
});
//Homepage tile tooltip (Edits ReQuired)
function showTileTooltip() {
  const tooltip = document.getElementById('tile-tooltip');
  const overlay = document.getElementById('tile-overlay');

  if (!tooltip || !overlay) return;

  tooltip.style.display = 'block';
  overlay.style.display = 'block';

  setTimeout(() => {
    tooltip.style.display = 'none';
    overlay.style.display = 'none';
  }, 2000); // Show for 2 seconds
}

window.addEventListener('load', showTileTooltip);

// ==================== Save Highlight ====================
function saveHighlightToBackend(userId, articleId, language, questionType, questionId, answerId, highlightedText) {
  fetch('/api/save-highlight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      article_id: articleId,
      language: language,             // 'en' or 'hi' depending on user
      question_type: questionType,    // 'mains' or 'prelims'
      question_id: questionId,        // Exact backend question ID
      answer_id: answerId || null,    // Exact backend answer ID if applicable
      highlighted_text: highlightedText
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("✅ Highlight saved:", data.highlight_id);
      // Optionally: show visual tick animation
    } else {
      console.error("❌ Save failed:", data.message);
      alert("Failed to save highlight.");
    }
  })
  .catch(err => {
    console.error("❌ Error:", err);
    alert("Error saving highlight.");
  });
}

// ==================== Handle Text Selection ====================
document.addEventListener('mouseup', function (event) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  // Determine the allowed parent (paragraph inside question/answer)
  const allowedParent = selection.anchorNode?.parentElement?.closest(
    '.highlight-zone p, .prelims-answer p'
  );
  if (!allowedParent) return;

  // Check word boundaries
  const range = selection.getRangeAt(0);
  const preChar = range.startOffset > 0 ? range.startContainer.textContent[range.startOffset - 1] : ' ';
  const postChar = range.endOffset < range.endContainer.textContent.length
    ? range.endContainer.textContent[range.endOffset]
    : ' ';
  if (!/\s/.test(preChar) || !/\s/.test(postChar)) return;

  // Get article_id and language from hidden meta div
  const articleMetaDiv = document.getElementById('article-meta');
  const articleId = articleMetaDiv?.getAttribute('data-article-id');
  const language = articleMetaDiv?.getAttribute('data-language') || 'en';

  // Determine question type and IDs
  let questionType, questionId = null, answerId = null;

  // Look specifically for backend-driven attributes
  const mainsQuestionEl = allowedParent.closest('.highlight-zone')?.querySelector('[data-main_question_id]');
  const prelimsQuestionEl = allowedParent.closest('.prelims-subtile')?.querySelector('[data-prelims_question_id]');

  if (mainsQuestionEl) {
    questionType = 'mains';
    questionId = mainsQuestionEl.getAttribute('data-main_question_id');     // backend main_question_id
    answerId = allowedParent.getAttribute('data-main_answer_id') || null;   // backend main_answer_id
  } else if (prelimsQuestionEl) {
    questionType = 'prelims';
    questionId = prelimsQuestionEl.getAttribute('data-prelims_question_id'); // backend prelims_question_id
    answerId = allowedParent.getAttribute('data-prelims_answer_id') || null;  // backend prelims_answer_id
  }

  if (!questionId) return; // Safety: must have a valid question ID

  // Optional debug
  console.log({
    articleId,
    language,
    questionType,
    questionId,
    answerId,
    highlightedText: selectedText
  });

  // Send highlight to backend
  saveHighlightToBackend(
    CURRENT_USER_ID,   // Global variable (Telegram user ID)
    articleId,
    language,
    questionType,
    questionId,
    answerId,
    selectedText
  );
});