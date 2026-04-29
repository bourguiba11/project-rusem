// === TAB NAVIGATION ===
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');

    // Clear search on tab switch
    document.getElementById('searchInput').value = '';
    clearSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// === SEARCH ===
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    clearSearch();
    return;
  }
  filterCards(query);
});

function filterCards(query) {
  // Only search the active panel
  const activePanel = document.querySelector('.tab-panel.active');
  const cards = activePanel.querySelectorAll('.card');
  let visible = 0;

  cards.forEach(card => {
    const searchData = (card.dataset.search || '').toLowerCase();
    const cardText = card.innerText.toLowerCase();
    const match = searchData.includes(query) || cardText.includes(query);
    card.classList.toggle('hidden-by-search', !match);
    if (match) visible++;
  });

  // Show/hide group titles based on visible cards
  const groups = activePanel.querySelectorAll('.card-group');
  groups.forEach(group => {
    const visibleInGroup = group.querySelectorAll('.card:not(.hidden-by-search)').length;
    group.style.display = visibleInGroup === 0 ? 'none' : '';
  });

  searchCount.textContent = visible + ' résultat' + (visible !== 1 ? 's' : '');
}

function clearSearch() {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(c => c.classList.remove('hidden-by-search'));

  const allGroups = document.querySelectorAll('.card-group');
  allGroups.forEach(g => g.style.display = '');

  searchCount.textContent = '';
}

// === BACK TO TOP BUTTON ===
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 300);
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === KEYBOARD SHORTCUT: Focus search with / ===
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === 'Escape') {
    searchInput.blur();
    searchInput.value = '';
    clearSearch();
  }
});

// === CODE SYNTAX HIGHLIGHT (simple) ===
// Apply basic color classes to code blocks
function colorizeCode() {
  const codeBlocks = document.querySelectorAll('.example pre code');
  codeBlocks.forEach(block => {
    let html = block.innerHTML;

    // HTML comments
    html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color:#6a9955">$1</span>');
    // SQL comments
    html = html.replace(/(--.*)/g, '<span style="color:#6a9955">$1</span>');
    // PHP comments
    html = html.replace(/(\/\/.*)/g, '<span style="color:#6a9955">$1</span>');

    // Strings (double quotes)
    html = html.replace(/"([^"<]*)"/g, '<span style="color:#ce9178">"$1"</span>');
    // Strings (single quotes)
    html = html.replace(/'([^'<]*)'/g, '<span style="color:#ce9178">\'$1\'</span>');

    // HTML tags
    html = html.replace(/(&lt;\/?[\w!]+)/g, '<span style="color:#4ec9b0">$1</span>');
    html = html.replace(/(&gt;)/g, '<span style="color:#4ec9b0">$1</span>');

    // JS/PHP keywords
    const keywords = ['let', 'const', 'var', 'function', 'return', 'if', 'else',
      'for', 'while', 'new', 'true', 'false', 'null', 'typeof',
      'echo', 'require', 'isset', 'die', 'while', 'foreach',
      'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES',
      'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER',
      'DROP', 'AND', 'OR', 'NOT', 'ORDER', 'BY', 'GROUP',
      'HAVING', 'JOIN', 'ON', 'DISTINCT', 'AS', 'ASC', 'DESC',
      'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT',
      'NOT NULL', 'DEFAULT', 'UNIQUE', 'CHECK'
    ];

    keywords.forEach(kw => {
      const regex = new RegExp('\\b(' + kw + ')\\b', 'g');
      html = html.replace(regex, '<span style="color:#569cd6">$1</span>');
    });

    block.innerHTML = html;
  });
}

// Run after DOM is ready
window.addEventListener('load', colorizeCode);
