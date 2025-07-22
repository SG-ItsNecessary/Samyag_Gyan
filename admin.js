// === Admin Preview Data (Dummy Sample) ===
const sampleTile = {
  id: "tile-preview",
  title: "The Role of Visual Breaks in Long-Form Reading",
  prelude: "This admin-side preview shows how optional images or mindmaps help break monotony.",
  intro: "When users scroll through dense paragraphs, even a small visual break like a mindmap or side image improves readability and retention.",
  source: "Indian Express",
  from: "Explained",
  usability: "Mains",
  date: "17 July 2025",
  tags: ["#UX", "#Memory", "#Design"],
  mindmapHindi: "mindmap-hindi-preview.jpg",
  mindmapEnglish: "mindmap-eng-preview.jpg",
  summary: "Breaks improve reading experience. Optional images are helpful in long articles.",
  language: "English",
  questions: [
    {
      q: "Why do visual breaks matter?",
      a: "They reduce fatigue and help anchor attention."
    },
    {
      q: "Where should images be placed ideally?",
      a: "Near dense sections or long paragraphs for relief."
    }
  ],
  prelims: [
    {
      q: "Key visual design term?",
      a: "Cognitive load"
    },
    {
      q: "Purpose of side images?",
      a: "To aid in knowledge recall"
    }
  ]
};

// === Render Admin Tile Preview ===
function renderAdminPreview() {
  const container = document.getElementById("preview");

  const tile = document.createElement("div");
  tile.className = "tile";
  tile.id = sampleTile.id;

  tile.innerHTML = `
    <div class="ribbon">${sampleTile.source}</div>
    <h2>${sampleTile.title}</h2>
    <p class="prelude"><em>${sampleTile.prelude}</em></p>
    <p class="intro">${sampleTile.intro}</p>

    <div class="extra-ribbons">
      <span class="extra-ribbon">${sampleTile.from}</span>
      <span class="extra-ribbon">${sampleTile.usability}</span>
    </div>

    <div class="content">
      ${sampleTile.questions.map(q =>
        `<p><strong>✦ ${q.q}</strong><br>${q.a}</p>`
      ).join("")}

      <div><strong>🖼️ Mindmap:</strong><br>
        Hindi: ${sampleTile.mindmapHindi}<br>
        English: ${sampleTile.mindmapEnglish}
      </div>

      <div><strong>✍️ Summary:</strong><br>
        ${sampleTile.summary}
      </div>

      <div><strong>📝 Prelims:</strong><br>
        ${sampleTile.prelims.map(p =>
          `<p><strong>${p.q}</strong><br>${p.a}</p>`
        ).join("")}
      </div>
    </div>

    <button class="toggle-btn" onclick="toggleTile('${sampleTile.id}')">Toggle</button>
  `;

  container.appendChild(tile);
}

// === Collapse / Expand ===
function toggleTile(tileId) {
  const tile = document.getElementById(tileId);
  tile.classList.toggle("expanded");
}

// === Run on Load ===
window.addEventListener("DOMContentLoaded", renderAdminPreview);