// Définition des 9 styles avec leurs descriptions
const styleResults = {
    'MAX_POP': { name: "Kitsch & Couleur (Post-Moderne)", desc: "Cool Kid Tik Tok, anti-minimalisme 🌈✨" },
    'MAX_TH': { name: "Théatral rétro", desc: "Atelier d'artiste ou Maison-Musée 🕯️🔮" },
    'BOHO_J': { name: "Jungle Bohème", desc: "Plantes 🌴🌿" },
    'MCM': { name: "MCM", desc: "Mid Century Modern 🥃🛋️" },
    'LUXE_70': { name: "Luxe 70s", desc: "Le Salon des 70's 🍑🎶" },
    'COTT': { name: "Cottagecore", desc: "La Maison de Campagne de ta grand-mère 🧺🎀" },
    'JAP': { name: "Japandi", desc: "Zen et naturel 🧘‍♀️🪵" },
    'LOFT': { name: "Loft", desc: "Branché dans ton hangar 🧱🏙️" },
    'RIEN': { name: "Nothing", desc: "Pratique avant esthétique 🛒📦" }
};

let questions = []; 
let currentQuestionIndex = 0;
let scores = {};

// --- Logique de chargement des données JSON ---
async function loadQuizData() {
    try {
        const response = await fetch('quiz-data.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        questions = await response.json();
        
        // Initialiser les scores une fois les données chargées
        initScores();
        // Ne PAS appeler renderQuestion ici, on attend le clic sur Start
    } catch (error) {
        console.error("Erreur lors du chargement des données du quiz:", error);
        document.getElementById('quiz-content').innerHTML = "<p>Désolé, impossible de charger le quiz. (Erreur JSON)</p>";
    }
}

// --- Fonctions de Logique du Quiz ---

function initScores() {
    Object.keys(styleResults).forEach(key => {
        scores[key] = 0;
    });
}

// Nouvelle fonction pour démarrer le quiz après le clic
function startQuiz() {
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('quiz-content').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = '';
    
    if (currentQuestionIndex < questions.length) {
        const q = questions[currentQuestionIndex];
        
        // Création du titre de la question
        const title = document.createElement('h3');
        title.className = 'question-title';
        title.textContent = q.question; 
        quizContent.appendChild(title);
        
        // Ajout des boutons de réponse
        q.options.forEach((option) => {
            const button = document.createElement('button');
            button.className = 'answer-option';
            button.textContent = option.text;
            button.onclick = () => handleAnswer(option.scores);
            quizContent.appendChild(button);
        });
        
    } else {
        showResult();
    }
}

function handleAnswer(answerScores) {
    // 1. Ajouter les points aux styles ciblés
    for (const styleCode in answerScores) {
        if (scores.hasOwnProperty(styleCode)) {
            scores[styleCode] += answerScores[styleCode];
        }
    }
    
    // 2. Passer à la question suivante
    currentQuestionIndex++;
    renderQuestion();
}

// ... (Début de showResult inchangé) ...

function showResult() {
    const quizContent = document.getElementById('quiz-content');
    const resultContainer = document.getElementById('result-container');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    // Référencez le conteneur du widget/lien
    const pinterestContainer = document.getElementById('pinterest-frame-container'); // On garde le même ID de conteneur
    
    // ... (Logique pour trouver le winningStyleCode) ...
    
    const winningStyle = styleResults[winningStyleCode];
    
    // Afficher le résultat
    resultTitle.textContent = winningStyle.name;
    resultDescription.textContent = winningStyle.desc;

    // -----------------------------------------------------------------
    // NOUVEAU : Préparation de l'élément du Widget Pinterest
    // -----------------------------------------------------------------
    pinterestContainer.innerHTML = ''; // Nettoyer
    
    // Titre Brutaliste
    const frameTitle = document.createElement('h3');
    frameTitle.textContent = "INSPIRATION PINTEREST";
    frameTitle.className = 'pinterest-frame-title';
    pinterestContainer.appendChild(frameTitle);

    // 1. Créer l'élément de widget Pinterest (un lien <a>)
    const pinterestWidget = document.createElement('a');
    pinterestWidget.href = winningStyle.pinterestLink;
    pinterestWidget.target = "_blank"; // S'ouvrira en externe si le widget ne charge pas
    
    // CRITIQUE : L'attribut à transformer. Même si c'est une recherche, on force 'embedPin'
    pinterestWidget.setAttribute('data-pin-do', 'embedPin');
    
    // 2. Tentez de l'ajouter
    pinterestContainer.appendChild(pinterestWidget);
    
    // 3. Demander au script Pinterest de transformer l'élément
    // Cette fonction est CRITIQUE après injection dynamique
    if (window.PinUtils && window.PinUtils.build) {
        window.PinUtils.build();
    } else {
        // En cas d'échec de chargement du script, utilisez un bouton de secours brut
        pinterestWidget.className = "pinterest-button"; 
        pinterestWidget.textContent = "VOIR LA PLANCHE PINTEREST (Widget non chargé)";
    }

    // Rendre visible la page de résultat
    quizContent.classList.add('hidden');
    resultContainer.classList.remove('hidden');
}

// ... (Le reste du script est inchangé) ...

// Lancement du chargement des données et mise en place de l'écouteur de clic
function initQuiz() {
    loadQuizData(); 
    
    // Attache l'événement de clic au bouton DÉMARRER
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', startQuiz);
    }
}

initQuiz();