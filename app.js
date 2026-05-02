// ============================================================
// 🎓 ADVANCED LEARNING PLATFORM - ENHANCED VERSION
// ============================================================

// === APP STATE MANAGER ===
class AppState {
  constructor() {
    this.state = {
      darkMode: localStorage.getItem('darkMode') !== 'false',
      language: localStorage.getItem('language') || 'fr',
      volume: localStorage.getItem('volume') || 0.5,
      focusMode: localStorage.getItem('focusMode') === 'true'
    };
  }
  save() {
    Object.entries(this.state).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }
  get(key) { return this.state[key]; }
  set(key, value) { this.state[key] = value; this.save(); }
}

const appState = new AppState();

// === DEBOUNCE UTILITY ===
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

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

// === ENHANCED SEARCH WITH DEBOUNCE ===
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');

const debouncedFilter = debounce((query) => {
  filterCards(query);
}, 200);

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    clearSearch();
    return;
  }
  debouncedFilter(query);
});

function filterCards(query) {
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

// === KEYBOARD SHORTCUTS ===
const shortcuts = {
  '/': () => searchInput.focus(),
  'Escape': () => {
    searchInput.blur();
    searchInput.value = '';
    clearSearch();
  },
  '?': () => showShortcutsModal(),
  'd': () => appState.set('darkMode', !appState.get('darkMode')), // Toggle dark mode
  'f': () => appState.set('focusMode', !appState.get('focusMode')) // Toggle focus mode
};

document.addEventListener('keydown', (e) => {
  if (document.activeElement === searchInput && e.key !== 'Escape') return;
  
  const shortcut = shortcuts[e.key];
  if (shortcut && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    shortcut();
  }
});

function showShortcutsModal() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:10000;';
  modal.innerHTML = `
    <div style="background:#1e2435;padding:30px;border-radius:12px;color:#e2e8f0;max-width:400px;max-height:80vh;overflow-y:auto;">
      <h2>⌨️ Raccourcis Clavier</h2>
      <div style="margin-top:20px;font-size:13px;line-height:2;">
        <div><strong>/</strong> - Chercher</div>
        <div><strong>Échap</strong> - Fermer la recherche</div>
        <div><strong>D</strong> - Mode sombre</div>
        <div><strong>F</strong> - Mode focus</div>
        <div><strong>?</strong> - Raccourcis</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="margin-top:20px;padding:8px 16px;background:#60a5fa;color:white;border:none;border-radius:6px;cursor:pointer;">Fermer</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// === CODE SYNTAX HIGHLIGHT (ENHANCED) ===
function colorizeCode() {
  const codeBlocks = document.querySelectorAll('.example pre code');
  codeBlocks.forEach(block => {
    let html = block.innerHTML;

    // HTML comments
    html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span>$1</span>');
    // SQL comments
    html = html.replace(/(--.*)/g, '<span>$1</span>');
    // PHP comments
    html = html.replace(/(\/\/.*)/g, '<span>$1</span>');

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

// ============================================================
// QUIZ DATA (100+ Questions)
// ============================================================
const quizData = {
  html: [
    { q: "Quelle balise définit la racine d'un document HTML ?", opts: ["<root>","<html>","<body>","<head>"], ans: 1 },
    { q: "Quel attribut lie un <label> à un champ de formulaire ?", opts: ["name","id","for","class"], ans: 2 },
    { q: "Quelle balise crée une liste ordonnée ?", opts: ["<ul>","<li>","<ol>","<dl>"], ans: 2 },
    { q: "Quel attribut définit l'adresse d'un lien hypertexte ?", opts: ["src","href","link","url"], ans: 1 },
    { q: "Quelle balise intègre une image dans une page HTML ?", opts: ["<picture>","<photo>","<img>","<image>"], ans: 2 },
    { q: "L'événement qui se déclenche au clic s'appelle ?", opts: ["onhover","onclick","onfocus","onkey"], ans: 1 },
    { q: "Quelle balise crée un formulaire HTML ?", opts: ["<input>","<fieldset>","<form>","<data>"], ans: 2 },
    { q: "Quel type d'<input> crée un bouton radio ?", opts: ["checkbox","button","select","radio"], ans: 3 },
    { q: "Quelle balise définit le pied de page d'une section ?", opts: ["<bottom>","<footer>","<end>","<aside>"], ans: 1 },
    { q: "Quel élément HTML5 définit le contenu principal du document ?", opts: ["<body>","<section>","<main>","<article>"], ans: 2 },
    { q: "Quelle balise HTML permet d'intégrer une vidéo ?", opts: ["<media>","<movie>","<video>","<embed>"], ans: 2 },
    { q: "L'attribut 'hidden' sert à :", opts: ["Cacher un texte","Renseigner la visibilité d'un élément","Créer un champ caché","Désactiver un bouton"], ans: 1 },
    { q: "Quel élément HTML5 définit un en-tête ou un groupe de liens de navigation ?", opts: ["<nav>","<menu>","<header>","<top>"], ans: 0 },
    { q: "Quelle balise crée un paragraphe ?", opts: ["<text>","<para>","<p>","<content>"], ans: 2 },
    { q: "Quel attribut rend un champ de formulaire obligatoire ?", opts: ["mandatory","required","needed","must"], ans: 1 },
    { q: "La balise <meta> dans le <head> :", opts: ["Crée un menu","Fournit des métadonnées","Ajoute une classe CSS","Change la langue"], ans: 1 },
    { q: "Quelle balise crée une liste non ordonnée ?", opts: ["<ol>","<ul>","<li>","<list>"], ans: 1 },
    { q: "Quel attribut spécifie le type MIME du fichier utilisé par <link> ?", opts: ["type","format","mime","content-type"], ans: 0 },
    { q: "Quelle balise HTML5 représente l'en-tête d'une section ?", opts: ["<header>","<head>","<top>","<title>"], ans: 0 },
    { q: "Quel élément HTML crée un bouton cliquable ?", opts: ["<btn>","<click>","<button>","<input type='button'>"], ans: 2 }
  ],
  css: [
    { q: "Quelle propriété CSS change la couleur du texte ?", opts: ["background-color","text-color","color","font-color"], ans: 2 },
    { q: "Comment cibler un élément avec id='titre' en CSS ?", opts: [".titre","%titre","*titre","#titre"], ans: 3 },
    { q: "Quelle valeur de position sort l'élément du flux normal et se positionne par rapport au parent ?", opts: ["relative","static","fixed","absolute"], ans: 3 },
    { q: "La propriété 'border-radius' permet de :", opts: ["Épaissir la bordure","Arrondir les coins","Colorer la bordure","Supprimer la bordure"], ans: 1 },
    { q: "Quelle propriété fusionne les bordures d'un tableau ?", opts: ["table-layout","border-style","border-collapse","border-merge"], ans: 2 },
    { q: "La fonction CSS transform: rotate() :", opts: ["Déplace l'élément","Fait pivoter l'élément","Agrandit l'élément","Incline l'élément"], ans: 1 },
    { q: "Quel sélecteur CSS cible les liens au survol de la souris ?", opts: ["a:focus","a:click","a:hover","a:active"], ans: 2 },
    { q: "La propriété 'opacity' définit :", opts: ["La transparence","La couleur","La taille","La position"], ans: 0 },
    { q: "Quelle propriété définit la police d'écriture ?", opts: ["text-family","font","font-type","font-family"], ans: 3 },
    { q: "La propriété 'display: flex' :", opts: ["Cache l'élément","Active le modèle de boîte flexible","Crée un bloc","Change la couleur"], ans: 1 },
    { q: "Comment cibler une classe 'active' en CSS ?", opts: ["#active","[active]",".active","*active"], ans: 2 },
    { q: "Quelle propriété CSS crée une ombre autour d'un élément ?", opts: ["box-outline","shadow","box-shadow","element-shadow"], ans: 2 },
    { q: "Quelle propriété définit la largeur d'un élément ?", opts: ["size","length","width","max-width"], ans: 2 },
    { q: "La propriété 'position: relative' :", opts: ["Fixe l'élément à la fenêtre","Le positionne par rapport au parent normal","Retire l'élément du flux","Positionne par rapport au body"], ans: 1 },
    { q: "Quelle propriété définit la hauteur minimum d'un élément ?", opts: ["max-height","min-height","height","auto-height"], ans: 1 },
    { q: "Quel sélecteur CSS cible le premier enfant ?", opts: ["first","first-child",":nth-child(1)",":first"], ans: 1 },
    { q: "La propriété 'margin' :", opts: ["Ajoute une bordure","Crée de l'espace externe","Ajoute du remplissage interne","Change la couleur"], ans: 1 },
    { q: "Quelle propriété CSS ajoute du remplissage interne ?", opts: ["margin","border","padding","space"], ans: 2 },
    { q: "Comment centrer le texte horizontalement en CSS ?", opts: ["align: center","center","text-align: center","text-center"], ans: 2 },
    { q: "La propriété 'z-index' :", opts: ["Redimensionne l'élément","Définit la profondeur (ordre d'empilement)","Ajoute une bordure","Change la couleur"], ans: 1 }
  ],
  js: [
    { q: "Comment déclarer une variable constante en JavaScript ?", opts: ["var","let","const","fixed"], ans: 2 },
    { q: "Quelle méthode retourne la longueur d'une chaîne ?", opts: ["ch.size()","ch.count()","ch.length","ch.len()"], ans: 2 },
    { q: "Que retourne isNaN('hello') ?", opts: ["false","NaN","hello","true"], ans: 3 },
    { q: "Quelle méthode JS affiche une boîte de dialogue avec zone de saisie ?", opts: ["confirm()","alert()","prompt()","input()"], ans: 2 },
    { q: "parseInt('42.7', 10) retourne :", opts: ["42.7","'42'","42","43"], ans: 2 },
    { q: "Quelle méthode retourne la position d'un élément HTML par son id ?", opts: ["getElement()","querySelector()","getElementById()","findById()"], ans: 2 },
    { q: "Que fait la méthode Math.random() ?", opts: ["Un entier entre 0 et 10","Un réel aléatoire dans [0,1[","Un entier aléatoire","Un réel entre 0 et 100"], ans: 1 },
    { q: "Quelle propriété JS modifie le contenu HTML d'un élément ?", opts: ["textContent","innerText","innerHTML","content"], ans: 2 },
    { q: "La méthode ch.toUpperCase() :", opts: ["Met en minuscule","Supprime les espaces","Met en majuscule","Inverse la chaîne"], ans: 2 },
    { q: "L'opérateur % en JS calcule :", opts: ["La division","La puissance","Le modulo (reste)","La racine"], ans: 2 },
    { q: "Qu'affiche console.log('5' + 3) ?", opts: ["8","'8'","'53'","Error"], ans: 2 },
    { q: "Quelle méthode retourne le dernier caractère d'une chaîne ?", opts: ["ch.last()","ch[ch.length-1]","ch.end()","ch.substring(-1)"], ans: 1 },
    { q: "La boucle 'for' en JavaScript :", opts: ["Exécute une condition","Répète un bloc de code","Crée une fonction","Modifie un objet"], ans: 1 },
    { q: "Que retourne typeof 'hello' ?", opts: ["'string'","'text'","'char'","string"], ans: 0 },
    { q: "Quelle méthode retourne un tableau des clés d'un objet ?", opts: ["Object.keys()","Object.values()","Object.entries()","keys()"], ans: 0 },
    { q: "La fonction Math.floor(4.9) retourne :", opts: ["5","4.9","4","ceil"], ans: 2 },
    { q: "Quelle méthode ajoute une fonction à un événement ?", opts: ["event.add()","on()","addEventListener()","bind()"], ans: 2 },
    { q: "Que fait arr.push() en JavaScript ?", opts: ["Supprime le premier élément","Ajoute un élément à la fin","Supprime le dernier élément","Trie le tableau"], ans: 1 },
    { q: "L'opérateur === en JavaScript :", opts: ["Vérifie l'égalité","Vérifie l'égalité stricte","Assigne une valeur","Compare les types"], ans: 1 },
    { q: "Quelle méthode retourne la position d'une chaîne dans une autre ?", opts: ["search()","find()","indexOf()","locate()"], ans: 2 }
  ],
  php: [
    { q: "Comment afficher du texte en PHP ?", opts: ["print_r","display","echo","console.log"], ans: 2 },
    { q: "Quelle superglobale PHP contient les données d'un formulaire POST ?", opts: ["$_REQUEST","$_SESSION","$_POST","$_FORM"], ans: 2 },
    { q: "Comment concatener deux chaînes en PHP ?", opts: ["+","&",".","||"], ans: 2 },
    { q: "Quelle fonction vérifie si une variable est définie en PHP ?", opts: ["defined()","exists()","isset()","is_set()"], ans: 2 },
    { q: "Quel type de données est 'array' en PHP ?", opts: ["Chaîne","Tableau","Nombre","Booléen"], ans: 1 },
    { q: "Quelle fonction retourne la longueur d'une chaîne PHP ?", opts: ["length()","count()","size()","strlen()"], ans: 3 },
    { q: "L'opérateur de transtypage (int) en PHP :", opts: ["Convertit en réel","Convertit en entier","Convertit en booléen","Convertit en chaîne"], ans: 1 },
    { q: "Quelle fonction PHP établit une connexion à MySQL ?", opts: ["mysql_open()","db_connect()","mysql_connect()","connect_db()"], ans: 2 },
    { q: "La fonction rand() en PHP :", opts: ["Arrondit un nombre","Retourne la racine","Retourne un nombre aléatoire","Calcule la valeur absolue"], ans: 2 },
    { q: "require() en PHP sert à :", opts: ["Vérifier une condition","Inclure un fichier PHP","Créer un tableau","Envoyer une requête SQL"], ans: 1 },
    { q: "Quelle superglobale contient les informations de la requête HTTP ?", opts: ["$_GET","$_SERVER","$_REQUEST","$_HTTP"], ans: 1 },
    { q: "Que fait la fonction trim() en PHP ?", opts: ["Raccourcit une chaîne","Supprime les espaces avant et après","Convertit en majuscule","Compte les caractères"], ans: 1 },
    { q: "Comment déclarer une constante en PHP ?", opts: ["const NOM = valeur;","define('NOM', valeur);","$CONST NOM = valeur;","CONST NOM = valeur;"], ans: 1 },
    { q: "Quelle fonction PHP compte les éléments d'un tableau ?", opts: ["size()","length()","count()","total()"], ans: 2 },
    { q: "Quelle fonction convertit une chaîne en entier ?", opts: ["intval()","int()","toInt()","convert()"], ans: 0 },
    { q: "Quelle superglobale contient les variables de session ?", opts: ["$_SESSION","$_COOKIE","$_SERVER","$_GLOBAL"], ans: 0 },
    { q: "Que fait la fonction explode() en PHP ?", opts: ["Crée un array","Divise une chaîne selon un séparateur","Supprime les espaces","Joint les éléments"], ans: 1 },
    { q: "Quelle fonction retourne la valeur absolue d'un nombre ?", opts: ["abs()","absolute()","fabs()","mod()"], ans: 0 },
    { q: "Comment exécuter une requête SQL en PHP ?", opts: ["query()","execute()","mysqli_query()","sql()"], ans: 2 },
    { q: "Quelle fonction PHP retourne la date actuelle ?", opts: ["now()","time()","date()","current_time()"], ans: 2 }
  ],
  sql: [
    { q: "Quelle commande SQL récupère des données d'une table ?", opts: ["GET","FETCH","SELECT","READ"], ans: 2 },
    { q: "Quelle contrainte interdit une valeur nulle dans une colonne ?", opts: ["UNIQUE","NOT NULL","CHECK","DEFAULT"], ans: 1 },
    { q: "Quelle clause SQL filtre les lignes selon une condition ?", opts: ["HAVING","WHERE","FILTER","CONDITION"], ans: 1 },
    { q: "Que fait la fonction AVG() ?", opts: ["Le maximum","La somme","La moyenne","Le minimum"], ans: 2 },
    { q: "Quelle commande modifie des enregistrements existants ?", opts: ["MODIFY","ALTER","CHANGE","UPDATE"], ans: 3 },
    { q: "Quelle contrainte définit la clé primaire d'une table ?", opts: ["UNIQUE KEY","FOREIGN KEY","PRIMARY KEY","INDEX"], ans: 2 },
    { q: "Quel opérateur SQL recherche selon un motif ?", opts: ["MATCH","FIND","LIKE","CONTAINS"], ans: 2 },
    { q: "Quelle commande crée une nouvelle table ?", opts: ["ADD TABLE","NEW TABLE","BUILD TABLE","CREATE TABLE"], ans: 3 },
    { q: "La clause ORDER BY sert à :", opts: ["Grouper les résultats","Filtrer les résultats","Trier les résultats","Compter les résultats"], ans: 2 },
    { q: "Quelle commande supprime des lignes d'une table ?", opts: ["REMOVE","DROP","DELETE FROM","ERASE"], ans: 2 },
    { q: "Quelle fonction SQL retourne le nombre de lignes ?", opts: ["LENGTH()","COUNT()","SUM()","TOTAL()"], ans: 1 },
    { q: "La clause GROUP BY sert à :", opts: ["Grouper par condition","Trier les lignes","Grouper les résultats","Limiter les résultats"], ans: 2 },
    { q: "Quel type de données SQL stocke une date ?", opts: ["TEXT","DATE","DATETIME","TIMESTAMP"], ans: 1 },
    { q: "Quelle fonction retourne la valeur maximale ?", opts: ["MAX()","MAXIMUM()","HIGHEST()","TOP()"], ans: 0 },
    { q: "Quelle clé établit une relation entre deux tables ?", opts: ["UNIQUE KEY","PRIMARY KEY","FOREIGN KEY","INDEX KEY"], ans: 2 },
    { q: "Quelle commande insère des données dans une table ?", opts: ["ADD","PUSH","INSERT INTO","PUT"], ans: 2 },
    { q: "La clause DISTINCT :", opts: ["Crée un index","Supprime les doublons","Limite les résultats","Trie les données"], ans: 1 },
    { q: "Quelle clause retourne seulement les N premiers résultats ?", opts: ["FIRST","TOP N","LIMIT","FETCH"], ans: 2 },
    { q: "Quelle fonction retourne la longueur d'une chaîne SQL ?", opts: ["SIZE()","LENGTH()","STRLEN()","LEN()"], ans: 1 },
    { q: "Quel type de données SQL stocke du texte de 255 caractères max ?", opts: ["TEXT","VARCHAR(255)","CHAR(255)","STRING"], ans: 1 }
  ]
};

// ============================================================
// QUIZ LOGIC
// ============================================================
let quizState = { subject: null, questions: [], current: 0, score: 0, answers: [] };

document.querySelectorAll('.quiz-subject-btn').forEach(btn => {
  btn.addEventListener('click', () => startQuiz(btn.dataset.subject));
});

function startQuiz(subject) {
  // Record study session for streak
  if (typeof studyStreak !== 'undefined') {
    studyStreak.recordSession();
  }
  quizState.subject = subject;
  quizState.questions = [...quizData[subject]].sort(() => Math.random() - 0.5).slice(0, 10);
  quizState.current = 0;
  quizState.score = 0;
  quizState.answers = [];
  document.getElementById('quiz-selector').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-game').style.display = 'block';
  renderQuestion();
}

function renderQuestion() {
  const q = quizState.questions[quizState.current];
  const total = quizState.questions.length;
  document.getElementById('quiz-progress').textContent = `Question ${quizState.current + 1}/${total}`;
  document.getElementById('quiz-score-live').textContent = `Score: ${quizState.score}`;
  document.getElementById('quiz-progress-fill').style.width = ((quizState.current / total) * 100) + '%';
  document.getElementById('quiz-question').textContent = q.q;
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-feedback').className = '';
  document.getElementById('quiz-next-row').style.display = 'none';
  const opts = document.getElementById('quiz-options');
  opts.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i));
    opts.appendChild(btn);
  });
}

function selectAnswer(idx) {
  const q = quizState.questions[quizState.current];
  const btns = document.querySelectorAll('.quiz-option-btn');
  btns.forEach(b => b.disabled = true);
  btns[q.ans].classList.add('correct');
  const fb = document.getElementById('quiz-feedback');
  if (idx === q.ans) {
    quizState.score++;
    fb.textContent = '✅ Bonne réponse !';
    fb.className = 'correct';
  } else {
    btns[idx].classList.add('wrong');
    fb.textContent = `❌ La bonne réponse était : ${q.opts[q.ans]}`;
    fb.className = 'wrong';
  }
  quizState.answers.push(idx === q.ans);
  document.getElementById('quiz-next-row').style.display = 'block';
}

document.getElementById('quiz-next-btn').addEventListener('click', () => {
  quizState.current++;
  if (quizState.current >= quizState.questions.length) {
    showQuizResult();
  } else {
    renderQuestion();
  }
});

function showQuizResult() {
  document.getElementById('quiz-game').style.display = 'none';
  const result = document.getElementById('quiz-result');
  result.style.display = 'block';
  const score = quizState.score;
  const total = quizState.questions.length;
  const pct = Math.round((score / total) * 100);
  document.getElementById('result-emoji').textContent = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';
  document.getElementById('result-title').textContent = pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien joué !' : 'Continue à réviser !';
  document.getElementById('result-score-text').textContent = `Tu as obtenu ${score}/${total} (${pct}%)`;
  // Record performance for analytics
  if (typeof perfTracker !== 'undefined' && quizState.subject) {
    perfTracker.recordScore(quizState.subject, score, total);
  }
}

document.getElementById('quiz-restart-btn').addEventListener('click', () => {
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-selector').style.display = 'block';
});

// ============================================================
// FLASHCARDS DATA
// ============================================================
const flashcardData = [
  { subject:'html', front:'Quelle balise définit le titre d\'une page visible dans l\'onglet ?', back:'La balise <title> placée dans le <head>', code:'<title>Mon Site</title>' },
  { subject:'html', front:'Comment intégrer une feuille de style externe ?', back:'Avec la balise <link> dans le <head>', code:'<link rel="stylesheet" href="style.css">' },
  { subject:'html', front:'Quelle balise crée un formulaire HTML ?', back:'La balise <form> avec les attributs action et method', code:'<form action="page.php" method="POST">' },
  { subject:'html', front:'Quelle balise affiche une image ?', back:'La balise <img> avec les attributs src et alt', code:'<img src="photo.jpg" alt="Description">' },
  { subject:'html', front:'Quel attribut lie un label à un champ ?', back:'L\'attribut for du label doit correspondre à l\'id du champ', code:'<label for="nom">Nom</label>\n<input id="nom" type="text">' },
  { subject:'html', front:'Comment créer une liste ordonnée ?', back:'La balise <ol> avec des éléments <li> à l\'intérieur', code:'<ol>\n  <li>Premier</li>\n  <li>Deuxième</li>\n</ol>' },
  { subject:'css', front:'Comment changer la couleur de fond d\'un élément ?', back:'La propriété background-color en CSS', code:'body { background-color: #1a1a2e; }' },
  { subject:'css', front:'Comment cibler un élément par son id en CSS ?', back:'On utilise le symbole # suivi du nom de l\'id', code:'#titre { color: blue; }' },
  { subject:'css', front:'Quelle est la différence entre margin et padding ?', back:'margin = espace extérieur à l\'élément. padding = espace intérieur entre le contenu et la bordure.', code:'.box { margin: 20px; padding: 10px; }' },
  { subject:'css', front:'Comment arrondir les coins d\'une boîte ?', back:'La propriété border-radius', code:'.carte { border-radius: 10px; }' },
  { subject:'css', front:'Comment appliquer une transition CSS ?', back:'La propriété transition avec la propriété cible et la durée', code:'.btn { transition: background-color 0.3s; }' },
  { subject:'css', front:'Quelle propriété transforme (rotation) un élément ?', back:'La propriété transform avec la fonction rotate()', code:'.icone { transform: rotate(45deg); }' },
  { subject:'js', front:'Comment déclarer une variable constante ?', back:'Le mot-clé const — sa valeur ne peut pas être réaffectée', code:'const PI = 3.14;' },
  { subject:'js', front:'Comment récupérer un élément HTML par son id ?', back:'La méthode document.getElementById()', code:'const el = document.getElementById("titre");' },
  { subject:'js', front:'Comment modifier le texte d\'un élément HTML ?', back:'La propriété innerHTML ou textContent de l\'élément', code:'document.getElementById("msg").innerHTML = "Bonjour!";' },
  { subject:'js', front:'Que fait Math.round(4.7) ?', back:'Retourne l\'entier le plus proche : 5', code:'Math.round(4.7)  // => 5\nMath.round(4.3)  // => 4' },
  { subject:'js', front:'Comment convertir une chaîne en entier ?', back:'La fonction parseInt() ou Number()', code:'parseInt("42")   // => 42\nNumber("3.14")  // => 3.14' },
  { subject:'js', front:'Comment créer une fonction en JavaScript ?', back:'Avec le mot-clé function suivi du nom et des paramètres', code:'function additionner(a, b) {\n  return a + b;\n}' },
  { subject:'php', front:'Comment afficher du contenu en PHP ?', back:'L\'instruction echo (ou print)', code:'<?php echo "Bonjour !"; ?>' },
  { subject:'php', front:'Comment inclure un fichier PHP dans un autre ?', back:'L\'instruction require() arrête si le fichier est absent', code:'<?php require("header.php"); ?>' },
  { subject:'php', front:'Comment récupérer les données d\'un formulaire POST ?', back:'La variable superglobale $_POST avec le nom du champ', code:'$nom = $_POST["nom"]; // champ name="nom"' },
  { subject:'php', front:'Quelle est la différence entre == et === en PHP ?', back:'== compare les valeurs. === compare valeurs ET types (stricte)', code:'"5" == 5   // true\n"5" === 5  // false' },
  { subject:'php', front:'Comment connecter PHP à MySQL ?', back:'La fonction mysql_connect() ou mysqli_connect()', code:'mysql_connect("localhost","user","pass");\nmysql_select_db("mabase");' },
  { subject:'php', front:'Comment compter les éléments d\'un tableau PHP ?', back:'La fonction count()', code:'$t = array(1,2,3);\necho count($t); // 3' },
  { subject:'sql', front:'Quelle commande sélectionne toutes les lignes d\'une table ?', back:'SELECT * FROM nom_table', code:'SELECT * FROM eleves;' },
  { subject:'sql', front:'Comment insérer une ligne dans une table SQL ?', back:'INSERT INTO avec la liste des colonnes et des valeurs', code:'INSERT INTO eleves(nom, age)\nVALUES ("Ali", 18);' },
  { subject:'sql', front:'Quelle est la différence entre WHERE et HAVING ?', back:'WHERE filtre avant le groupement. HAVING filtre après GROUP BY.', code:'SELECT classe, AVG(note)\nFROM notes\nGROUP BY classe\nHAVING AVG(note) > 10;' },
  { subject:'sql', front:'Qu\'est-ce qu\'une clé étrangère (FOREIGN KEY) ?', back:'Une clé étrangère référence la clé primaire d\'une autre table pour assurer l\'intégrité référentielle.', code:'FOREIGN KEY (id_classe) REFERENCES classes(id)' },
  { subject:'sql', front:'Comment modifier des données existantes ?', back:'La commande UPDATE avec SET et WHERE', code:'UPDATE eleves\nSET note = 18\nWHERE id = 5;' },
  { subject:'sql', front:'Que fait la contrainte NOT NULL ?', back:'Elle interdit qu\'une colonne contienne une valeur nulle', code:'CREATE TABLE eleves (\n  nom VARCHAR(50) NOT NULL\n);' }
];

// ============================================================
// FLASHCARDS LOGIC
// ============================================================
let fcState = { cards: [], index: 0, flipped: false, ratings: { bad:0, ok:0, good:0 } };

function initFlashcards() {
  const subject = document.getElementById('fc-subject').value;
  fcState.cards = subject === 'all' ? [...flashcardData] : flashcardData.filter(c => c.subject === subject);
  fcState.index = 0;
  fcState.flipped = false;
  fcState.ratings = { bad:0, ok:0, good:0 };
  updateFC();
}

function updateFC() {
  const card = fcState.cards[fcState.index];
  document.getElementById('flashcard').classList.remove('flipped');
  fcState.flipped = false;
  setTimeout(() => {
    document.getElementById('fc-front-text').textContent = card.front;
    document.getElementById('fc-back-text').textContent = card.back;
    const codeEl = document.getElementById('fc-code-text');
    if (card.code) { codeEl.textContent = card.code; codeEl.style.display = 'block'; }
    else { codeEl.style.display = 'none'; }
    const tagEl = document.getElementById('fc-subject-tag');
    const labels = { html:'HTML5', css:'CSS3', js:'JavaScript', php:'PHP', sql:'SQL' };
    tagEl.textContent = labels[card.subject] || card.subject.toUpperCase();
  }, 100);
  document.getElementById('fc-counter').textContent = `${fcState.index + 1} / ${fcState.cards.length}`;
  document.getElementById('fc-count-bad').textContent = fcState.ratings.bad;
  document.getElementById('fc-count-ok').textContent = fcState.ratings.ok;
  document.getElementById('fc-count-good').textContent = fcState.ratings.good;
}

document.getElementById('flashcard').addEventListener('click', () => {
  fcState.flipped = !fcState.flipped;
  document.getElementById('flashcard').classList.toggle('flipped', fcState.flipped);
});
document.getElementById('fc-next').addEventListener('click', () => {
  fcState.index = (fcState.index + 1) % fcState.cards.length;
  updateFC();
});
document.getElementById('fc-prev').addEventListener('click', () => {
  fcState.index = (fcState.index - 1 + fcState.cards.length) % fcState.cards.length;
  updateFC();
});
document.getElementById('fc-shuffle').addEventListener('click', () => {
  fcState.cards.sort(() => Math.random() - 0.5);
  fcState.index = 0;
  updateFC();
});
document.getElementById('fc-subject').addEventListener('change', initFlashcards);
['bad','ok','good'].forEach(r => {
  document.getElementById('fc-' + r).addEventListener('click', () => {
    fcState.ratings[r]++;
    fcState.index = (fcState.index + 1) % fcState.cards.length;
    updateFC();
  });
});
initFlashcards();

// ============================================================
// CHALLENGE DATA
// ============================================================
const challenges = [
  { title:'SELECT simple', lang:'SQL', desc:'Écris une requête pour afficher tous les élèves de la table "eleves".', hints:'💡 Utilise SELECT * FROM pour tout sélectionner.', expected:'SELECT * FROM eleves;', keywords:['select','from','eleves'] },
  { title:'Filtrer avec WHERE', lang:'SQL', desc:'Sélectionne les élèves dont l\'age est supérieur à 17 dans la table "eleves".', hints:'💡 Ajoute une clause WHERE après FROM.', expected:'SELECT * FROM eleves WHERE age > 17;', keywords:['select','from','eleves','where','age','>','17'] },
  { title:'Créer une table', lang:'SQL', desc:'Crée une table "produits" avec les colonnes: id (INT, clé primaire) et nom (VARCHAR 100, NOT NULL).', hints:'💡 Utilise CREATE TABLE avec PRIMARY KEY et NOT NULL.', expected:'CREATE TABLE produits (\n  id INT PRIMARY KEY,\n  nom VARCHAR(100) NOT NULL\n);', keywords:['create','table','produits','int','primary','key','varchar','not null'] },
  { title:'Balise de formulaire HTML', lang:'HTML', desc:'Écris un champ de saisie de type email avec l\'id "mail" et le placeholder "Votre email".', hints:'💡 Utilise la balise <input> avec les bons attributs.', expected:'<input type="email" id="mail" placeholder="Votre email">', keywords:['input','type','email','id','mail','placeholder'] },
  { title:'Lien hypertexte', lang:'HTML', desc:'Crée un lien vers "https://example.com" qui s\'ouvre dans un nouvel onglet avec le texte "Visiter".', hints:'💡 Utilise la balise <a> avec href et target="_blank".', expected:'<a href="https://example.com" target="_blank">Visiter</a>', keywords:['<a','href','example','target','_blank','visiter','</a>'] },
  { title:'Style CSS d\'un titre', lang:'CSS', desc:'Écris une règle CSS pour que tous les <h1> aient une couleur rouge et une taille de 32px.', hints:'💡 Sélecteur de balise + propriétés color et font-size.', expected:'h1 { color: red; font-size: 32px; }', keywords:['h1','color','red','font-size','32'] },
  { title:'Bordure arrondie CSS', lang:'CSS', desc:'Ajoute des coins arrondis de 10px à la classe ".carte" et une ombre de boîte légère.', hints:'💡 Utilise border-radius et box-shadow.', expected:'.carte { border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }', keywords:['carte','border-radius','10','box-shadow'] },
  { title:'Fonction JavaScript', lang:'JS', desc:'Écris une fonction "multiplier" qui prend deux paramètres a et b, et retourne leur produit.', hints:'💡 Utilise le mot-clé function et return.', expected:'function multiplier(a, b) {\n  return a * b;\n}', keywords:['function','multiplier','return','a','b','*'] },
  { title:'Modifier innerHTML', lang:'JS', desc:'Écris du code JS pour mettre "Bonjour !" dans l\'élément avec l\'id "message".', hints:'💡 Utilise getElementById() et la propriété innerHTML.', expected:'document.getElementById("message").innerHTML = "Bonjour !";', keywords:['getelementbyid','message','innerhtml','bonjour'] },
  { title:'Affichage PHP', lang:'PHP', desc:'Écris un script PHP qui affiche "Bienvenue en STI!" avec echo.', hints:'💡 N\'oublie pas les balises d\'ouverture et fermeture PHP.', expected:'<?php\necho "Bienvenue en STI!";\n?>', keywords:['<?php','echo','bienvenue','sti'] },
  { title:'Récupérer $_POST', lang:'PHP', desc:'Récupère la valeur du champ "prenom" d\'un formulaire POST et stocke-la dans $p.', hints:'💡 Utilise la superglobale $_POST avec le nom du champ.', expected:'$p = $_POST["prenom"];', keywords:['$_post','prenom','$p'] },
  { title:'INSERT INTO SQL', lang:'SQL', desc:'Insère un élève de nom "Sami" et d\'age 17 dans la table "eleves".', hints:'💡 Utilise INSERT INTO ... VALUES (...).', expected:'INSERT INTO eleves (nom, age) VALUES ("Sami", 17);', keywords:['insert','into','eleves','values','sami','17'] }
];

let chState = { index: 0 };

function renderChallenge() {
  const ch = challenges[chState.index];
  document.getElementById('ch-title').textContent = ch.title;
  document.getElementById('ch-desc').textContent = ch.desc;
  document.getElementById('ch-hints').textContent = ch.hints;
  document.getElementById('ch-lang-tag').textContent = ch.lang;
  document.getElementById('ch-counter').textContent = `${chState.index + 1}/${challenges.length}`;
  document.getElementById('ch-editor').value = '';
  document.getElementById('ch-result').textContent = '';
  document.getElementById('ch-result').className = 'ch-result';
  document.getElementById('ch-expected').style.display = 'none';
  document.getElementById('ch-reveal-btn').textContent = 'Afficher la solution';
}

document.getElementById('ch-verify-btn').addEventListener('click', () => {
  const ch = challenges[chState.index];
  const userCode = document.getElementById('ch-editor').value.trim().toLowerCase();
  const matched = ch.keywords.filter(kw => userCode.includes(kw.toLowerCase()));
  const score = matched.length / ch.keywords.length;
  const resultEl = document.getElementById('ch-result');
  if (score >= 0.9) {
    resultEl.textContent = '✅ Parfait ! Tu as toutes les clés de la bonne réponse.';
    resultEl.className = 'ch-result correct';
  } else if (score >= 0.5) {
    resultEl.textContent = `⚠️ Presque ! Il manque encore quelques éléments. (${matched.length}/${ch.keywords.length} éléments détectés)`;
    resultEl.className = 'ch-result partial';
  } else {
    resultEl.textContent = `❌ Essaie encore. Regarde les indices ! (${matched.length}/${ch.keywords.length} éléments)`;
    resultEl.className = 'ch-result wrong';
  }
});

document.getElementById('ch-reveal-btn').addEventListener('click', () => {
  const expEl = document.getElementById('ch-expected');
  const ch = challenges[chState.index];
  if (expEl.style.display === 'none') {
    expEl.textContent = ch.expected;
    expEl.style.display = 'block';
    document.getElementById('ch-reveal-btn').textContent = 'Cacher';
  } else {
    expEl.style.display = 'none';
    document.getElementById('ch-reveal-btn').textContent = 'Afficher la solution';
  }
});

document.getElementById('ch-next-btn').addEventListener('click', () => {
  chState.index = (chState.index + 1) % challenges.length;
  renderChallenge();
});
document.getElementById('ch-prev-btn').addEventListener('click', () => {
  chState.index = (chState.index - 1 + challenges.length) % challenges.length;
  renderChallenge();
});
renderChallenge();

// ============================================================
// AI EXPLAINER
// ============================================================
document.querySelectorAll('.ai-quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('ai-input').value = btn.dataset.q;
    document.getElementById('ai-input').focus();
  });
});

document.getElementById('ai-send-btn').addEventListener('click', sendAIQuestion);
document.getElementById('ai-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) sendAIQuestion();
});

async function sendAIQuestion() {
  const input = document.getElementById('ai-input');
  const question = input.value.trim();
  if (!question) return;

  const btn = document.getElementById('ai-send-btn');
  const sendText = document.getElementById('ai-send-text');
  const spinner = document.getElementById('ai-spinner');
  btn.disabled = true;
  sendText.style.display = 'none';
  spinner.style.display = 'inline';

  const responseArea = document.getElementById('ai-response-area');
  const responseText = document.getElementById('ai-response-text');
  responseArea.style.display = 'none';

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": "YOUR_ANTHROPIC_API_KEY_HERE",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `Tu es un professeur de STI (Systèmes et Technologies de l'Informatique) pour les élèves tunisiens de 4ème année (Bac Sciences de l'Informatique). Tu expliques en français de manière simple, claire et adaptée au programme officiel tunisien. Tu couvres HTML5, CSS3, JavaScript, PHP et SQL. Tes explications sont courtes (max 300 mots), pédagogiques, avec des exemples de code concrets. Utilise des emojis pour rendre les explications vivantes.`,
        messages: [{ role: "user", content: question }]
      })
    });
    const data = await response.json();
    const text = data.content?.map(c => c.text || '').join('') || 'Erreur de réponse.';

    responseArea.style.display = 'block';
    responseText.textContent = text;

    // Save to history
    const historyEl = document.getElementById('ai-history');
    const item = document.createElement('div');
    item.className = 'ai-history-item';
    item.innerHTML = `<div class="ai-history-q">❓ ${question}</div><div class="ai-history-a">${text}</div>`;
    historyEl.prepend(item);
    if (historyEl.children.length > 5) historyEl.removeChild(historyEl.lastChild);

    input.value = '';
  } catch (err) {
    document.getElementById('ai-response-area').style.display = 'block';
    document.getElementById('ai-response-text').textContent = '⚠️ Erreur de connexion. Vérifie ta connexion internet et réessaie.';
  } finally {
    btn.disabled = false;
    sendText.style.display = 'inline';
    spinner.style.display = 'none';
  }
}

document.getElementById('ai-copy-btn').addEventListener('click', () => {
  const text = document.getElementById('ai-response-text').textContent;
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('ai-copy-btn').textContent = '✅ Copié!';
    setTimeout(() => document.getElementById('ai-copy-btn').textContent = '📋 Copier', 2000);
  });
});

// ============================================================
// 🔥 FEATURE 1: STUDY STREAK TRACKER - Gamification
// ============================================================
class StudyStreak {
  constructor() {
    this.load();
  }
  load() {
    const saved = localStorage.getItem('studyStreak');
    if (saved) {
      Object.assign(this, JSON.parse(saved));
    } else {
      this.currentStreak = 0;
      this.lastStudyDate = null;
      this.bestStreak = 0;
      this.totalSessions = 0;
    }
  }
  save() {
    localStorage.setItem('studyStreak', JSON.stringify(this));
  }
  recordSession() {
    const today = new Date().toDateString();
    if (this.lastStudyDate === today) return; // Already counted today
    
    if (this.lastStudyDate === new Date(Date.now() - 86400000).toDateString()) {
      this.currentStreak++;
    } else if (this.lastStudyDate !== today) {
      this.currentStreak = 1;
    }
    this.lastStudyDate = today;
    this.totalSessions++;
    if (this.currentStreak > this.bestStreak) this.bestStreak = this.currentStreak;
    this.save();
    this.showNotification();
  }
  showNotification() {
    const msg = `🔥 Série: ${this.currentStreak} jour${this.currentStreak > 1 ? 's' : ''} | Record: ${this.bestStreak}`;
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#ff6b6b;color:white;padding:15px 20px;border-radius:8px;z-index:9999;animation:slideIn 0.3s ease-out;font-weight:bold;';
    notification.textContent = msg;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}

const studyStreak = new StudyStreak();

// ============================================================
// 📊 FEATURE 2: PERFORMANCE DASHBOARD
// ============================================================
class PerformanceTracker {
  constructor() {
    this.load();
  }
  load() {
    const saved = localStorage.getItem('perfStats');
    this.stats = saved ? JSON.parse(saved) : { html:[], css:[], js:[], php:[], sql:[] };
  }
  save() {
    localStorage.setItem('perfStats', JSON.stringify(this.stats));
  }
  recordScore(subject, score, total) {
    if (!this.stats[subject]) this.stats[subject] = [];
    this.stats[subject].push({ score, total, date: new Date().toISOString(), percentage: Math.round((score/total)*100) });
    this.save();
  }
  getStats(subject) {
    const data = this.stats[subject] || [];
    if (data.length === 0) return null;
    const avg = Math.round(data.reduce((s,d) => s + d.percentage, 0) / data.length);
    const recent = data.slice(-5);
    return { average: avg, total: data.length, recent, trend: recent[recent.length-1].percentage - recent[0].percentage };
  }
}

const perfTracker = new PerformanceTracker();

// ============================================================
// 💾 FEATURE 3: BOOKMARK IMPORTANT CONCEPTS
// ============================================================
class Bookmarks {
  constructor() {
    this.load();
  }
  load() {
    const saved = localStorage.getItem('bookmarks');
    this.items = saved ? JSON.parse(saved) : [];
  }
  save() {
    localStorage.setItem('bookmarks', JSON.stringify(this.items));
  }
  add(title, content, subject) {
    const item = { id: Date.now(), title, content, subject, saved: new Date().toLocaleString() };
    this.items.unshift(item);
    this.save();
    this.showToast(`⭐ "${title}" ajouté aux favoris!`);
  }
  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  }
  getBySubject(subject) {
    return this.items.filter(i => i.subject === subject);
  }
  showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:20px;left:20px;background:#4CAF50;color:white;padding:12px 16px;border-radius:4px;z-index:9999;';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }
}

const bookmarks = new Bookmarks();

// ============================================================
// 📢 FEATURE 4: SMART STUDY REMINDERS
// ============================================================
class StudyReminder {
  constructor() {
    this.reminderTime = localStorage.getItem('reminderTime') || '20:00';
    this.enabled = localStorage.getItem('reminderEnabled') !== 'false';
    this.init();
  }
  init() {
    setInterval(() => this.check(), 60000); // Check every minute
  }
  check() {
    if (!this.enabled) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = hours + ':' + minutes;
    if (currentTime === this.reminderTime) {
      this.notify();
    }
  }
  notify() {
    if (Notification.permission === 'granted') {
      new Notification('📚 Rappel STI', {
        body: 'Il est temps d\'étudier! Révise une leçon ou fais un quiz.',
        icon: '📚'
      });
    }
  }
  setTime(time) {
    this.reminderTime = time;
    localStorage.setItem('reminderTime', time);
  }
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('reminderEnabled', this.enabled);
  }
}

const reminder = new StudyReminder();

// ============================================================
// 📈 FEATURE 5: QUICK STATS DISPLAY (Add to each tab)
// ============================================================
function initStatsDisplay() {
  const subjects = ['html', 'css', 'js', 'php', 'sql'];
  subjects.forEach(subject => {
    const stats = perfTracker.getStats(subject);
    const tabBtn = document.querySelector(`[data-tab="${subject}"]`);
    if (tabBtn && stats) {
      const badge = document.createElement('span');
      badge.style.cssText = 'display:inline-block;background:#4CAF50;color:white;padding:2px 6px;border-radius:10px;font-size:11px;margin-left:5px;font-weight:bold;';
      badge.textContent = `${stats.average}%`;
      tabBtn.appendChild(badge);
    }
  });
}

// Initialize on page load
window.addEventListener('load', () => {
  initStatsDisplay();
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
});

// ============================================================
// ✨ FEATURE 6: CODE COPY & SYNTAX HIGHLIGHTING
// ============================================================
class CodeManager {
  constructor() {
    this.init();
  }
  init() {
    this.highlightCode();
  }
  highlightCode() {
    const codeBlocks = document.querySelectorAll('.example pre code');
    codeBlocks.forEach(block => {
      let html = block.innerHTML;
      
      html = html.replace(/(&lt;[^&]*&gt;)/g, '<span>$1</span>');
      const jsKeywords = /\b(function|const|let|var|return|if|else|for|while|do|switch|case|break|continue)\b/g;
      html = html.replace(jsKeywords, '<span>$1</span>');
      const phpKeywords = /\b(echo|if|else|function|return|class|public|private|protected|static)\b/g;
      html = html.replace(phpKeywords, '<span style="color:#aab4d4">$1</span>');
      const sqlKeywords = /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|JOIN|GROUP|ORDER|BY)\b/gi;
      html = html.replace(sqlKeywords, '<span>$1</span>');
      
      block.innerHTML = html;
    });
  }
}

const codeManager = new CodeManager();

// ============================================================
// 🎯 FEATURE 7: DIFFICULTY SELECTOR & SMART QUIZZES
// ============================================================
class QuizDifficultyManager {
  constructor() {
    this.difficulty = localStorage.getItem('quizDifficulty') || 'normal';
  }
  setDifficulty(level) {
    this.difficulty = level;
    localStorage.setItem('quizDifficulty', level);
  }
  filterQuestions(questions) {
    if (this.difficulty === 'easy') return questions.slice(0, Math.ceil(questions.length * 0.3));
    if (this.difficulty === 'hard') return questions.slice(Math.floor(questions.length * 0.6));
    return questions;
  }
}

const quizDifficulty = new QuizDifficultyManager();

// ============================================================
// 📱 FEATURE 8: OFFLINE MODE & PWA SUPPORT
// ============================================================
class OfflineManager {
  constructor() {
    this.init();
  }
  init() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW ready'));
    }
  }
  isOnline() {
    return navigator.onLine;
  }
}

const offlineManager = new OfflineManager();

// ============================================================
// 🤖 FEATURE 9: INTELLIGENT LEARNING PATH (SPACED REPETITION)
// ============================================================
class LearningPath {
  constructor() {
    this.load();
  }
  load() {
    const saved = localStorage.getItem('learningPath');
    this.path = saved ? JSON.parse(saved) : {};
  }
  save() {
    localStorage.setItem('learningPath', JSON.stringify(this.path));
  }
  getNextTopicToReview() {
    const now = Date.now();
    let needsReview = null;
    
    Object.entries(this.path).forEach(([topic, data]) => {
      if (!data.lastReview) {
        needsReview = topic;
        return;
      }
      const daysSinceReview = (now - new Date(data.lastReview)) / (1000 * 60 * 60 * 24);
      const reviewInterval = data.mastered ? 30 : data.score < 0.6 ? 1 : 3;
      
      if (daysSinceReview > reviewInterval) {
        needsReview = topic;
      }
    });
    return needsReview;
  }
  markAsReviewed(topic, score) {
    if (!this.path[topic]) this.path[topic] = {};
    this.path[topic].lastReview = new Date().toISOString();
    this.path[topic].score = score;
    this.path[topic].mastered = score >= 0.8;
    this.save();
  }
}

const learningPath = new LearningPath();

// ============================================================
// 📊 FEATURE 10: ADVANCED ANALYTICS & REPORTING
// ============================================================
class AnalyticsEngine {
  constructor() {
    this.load();
  }
  load() {
    const saved = localStorage.getItem('analytics');
    this.data = saved ? JSON.parse(saved) : { sessions: [], totalTime: 0, lastActive: null };
  }
  save() {
    localStorage.setItem('analytics', JSON.stringify(this.data));
  }
  startSession() {
    this.currentSession = {
      startTime: Date.now(),
      activities: [],
      subjectTime: {}
    };
  }
  logActivity(type, subject, duration) {
    if (!this.currentSession) this.startSession();
    
    this.currentSession.activities.push({ type, subject, timestamp: Date.now(), duration });
    this.currentSession.subjectTime[subject] = (this.currentSession.subjectTime[subject] || 0) + duration;
  }
  endSession() {
    if (!this.currentSession) return;
    
    const sessionDuration = Date.now() - this.currentSession.startTime;
    this.currentSession.duration = sessionDuration;
    this.data.sessions.push(this.currentSession);
    this.data.totalTime += sessionDuration;
    this.data.lastActive = new Date().toISOString();
    this.save();
    this.currentSession = null;
  }
  getReport() {
    const totalSessions = this.data.sessions.length;
    const avgSessionTime = totalSessions > 0 ? this.data.totalTime / totalSessions / 60000 : 0;
    const subjectStats = {};
    
    this.data.sessions.forEach(session => {
      Object.entries(session.subjectTime).forEach(([subject, time]) => {
        if (!subjectStats[subject]) subjectStats[subject] = 0;
        subjectStats[subject] += time;
      });
    });
    
    return {
      totalSessions,
      totalTimeMinutes: Math.round(this.data.totalTime / 60000),
      avgSessionMinutes: Math.round(avgSessionTime),
      subjectStats: Object.entries(subjectStats).map(([subject, time]) => ({
        subject,
        timeMinutes: Math.round(time / 60000)
      }))
    };
  }
}

const analytics = new AnalyticsEngine();
analytics.startSession();

// ============================================================
// 💡 FEATURE 11: LEARNING TIPS & MOTIVATION
// ============================================================
const motivationalTips = [
  "💪 Chaque question résolue te rapproche de la maîtrise!",
  "🎯 Fixe-toi un objectif de 30 minutes d'étude par jour.",
  "📈 Tes progrès s'accumulent chaque jour - continue!",
  "🔥 Ta série d'étude augmente - ne l'abandonne pas!",
  "✨ Les meilleurs étudiants révisent régulièrement.",
  "🚀 La persistance est la clé du succès académique.",
  "⭐ Tu progresses plus vite que tu ne le penses!",
  "🎓 Apprendre peu chaque jour, c'est la vraie victoire.",
];

function showMotivationalTip() {
  const tip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
  const notif = document.createElement('div');
  notif.style.cssText = 'position:fixed;bottom:100px;right:20px;background:linear-gradient(135deg,#60a5fa,#3b82f6);color:white;padding:16px 20px;border-radius:8px;z-index:9999;max-width:300px;animation:slideIn 0.3s ease-out;';
  notif.textContent = tip;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 4000);
}

// ============================================================
// 🌐 FEATURE 12: SETTINGS PANEL
// ============================================================
function createSettingsPanel() {
  const settings = document.createElement('div');
  settings.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#1e2435;border:1px solid #2e3650;border-radius:8px;padding:20px;color:#e2e8f0;z-index:9998;max-width:300px;';
  settings.innerHTML = `
    <div style="margin-bottom:15px;">
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
        <input type="checkbox" id="darkModeToggle" ${appState.get('darkMode') ? 'checked' : ''}>
        <span>🌙 Mode sombre</span>
      </label>
    </div>
    <div style="margin-bottom:15px;">
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
        <input type="checkbox" id="focusModeToggle" ${appState.get('focusMode') ? 'checked' : ''}>
        <span>🎯 Mode focus</span>
      </label>
    </div>
    <div style="margin-bottom:15px;">
      <label>Difficulté: 
        <select id="difficultySelect">
          <option value="easy">Facile</option>
          <option value="normal" selected>Normal</option>
          <option value="hard">Difficile</option>
        </select>
      </label>
    </div>
    <button onclick="showMotivationalTip()" style="width:100%;padding:8px;background:#60a5fa;border:none;border-radius:4px;color:white;cursor:pointer;">💡 Conseil motivant</button>
  `;
  document.body.appendChild(settings);
  
  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    appState.set('darkMode', e.target.checked);
    document.documentElement.style.filter = e.target.checked ? '' : 'invert(1)';
  });
  
  document.getElementById('focusModeToggle').addEventListener('change', (e) => {
    appState.set('focusMode', e.target.checked);
    document.body.style.opacity = e.target.checked ? '1' : '1';
  });
  
  document.getElementById('difficultySelect').addEventListener('change', (e) => {
    quizDifficulty.setDifficulty(e.target.value);
  });
}

// Show settings button
window.addEventListener('load', () => {
  const settingsBtn = document.createElement('button');
  settingsBtn.textContent = '⚙️';
  settingsBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;width:50px;height:50px;border-radius:50%;background:#60a5fa;color:white;border:none;font-size:24px;cursor:pointer;z-index:9997;';
  settingsBtn.addEventListener('click', () => {
    if (document.querySelector('[style*="position:fixed"][style*="bottom:20px"][style*="right:20px"]')) {
      document.querySelector('[style*="position:fixed"][style*="bottom:20px"][style*="right:20px"]').remove();
    } else {
      createSettingsPanel();
    }
  });
  document.body.appendChild(settingsBtn);
  
  if (Math.random() > 0.7) showMotivationalTip();
});

