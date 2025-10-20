// Définition des 9 styles avec leurs descriptions
const styleResults = {
    'MAX_POP': { 
        name: "Kitsch & Couleur (Post-Moderne)", 
        desc: "Cool Kid Tik Tok, anti-minimalisme 🌈✨",
        pinterestLink: "https://fr.pinterest.com/pin/351912466721586/"
 },
    'MAX_TH': { 
        name: "Théatral rétro", 
        desc: "Atelier d'artiste ou Maison-Musée 🕯️🔮",
        pinterestLink: "https://fr.pinterest.com/pin/128423026873370658/"
     },
    'BOHO_J': { 
        name: "Jungle Bohème", 
        desc: "Plantes 🌴🌿", 
        pinterestLink: "https://fr.pinterest.com/pin/128423026865702713/"
     },
    'MCM': { 
        name: "MCM", 
        desc: "Mid Century Modern 🥃🛋️",
        pinterestLink: "https://fr.pinterest.com/pin/703756188683334/"
    },
    'LUXE_70': { 
        name: "Luxe 70s", 
        desc: "Le Salon des 70's 🍑🎶",
        pinterestLink: "https://fr.pinterest.com/pin/338121884554982914/"
    },
    'COTT': { 
        name: "Cottagecore", 
        desc: "La Maison de Campagne de ta grand-mère 🧺🎀",
        pinterestLink: "https://fr.pinterest.com/pin/128423026866319002/"
    },
    'JAP': { 
        name: "Japandi", 
        desc: "Zen et naturel 🧘‍♀️🪵",
        pinterestLink: "https://fr.pinterest.com/pin/78461218502829385/"
    },
    'LOFT': { 
        name: "Loft", 
        desc: "Branché dans ton hangar 🧱🏙️",
        pinterestLink: "https://fr.pinterest.com/pin/2181499816357566/"
    },
    'RIEN': { 
        name: "Nothing", 
        desc: "Pratique avant esthétique 🛒📦",
        pinterestLink: "https://fr.pinterest.com/pin/461126449369882215/"
    }
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
function showResult() {
    const quizContent = document.getElementById('quiz-content');
    const resultContainer = document.getElementById('result-container');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const pinterestFrameContainer = document.getElementById('pinterest-frame-container'); 
    
    // Trouver le style avec le score le plus élevé
    let maxScore = -1;
    // 🛑 CORRECTION ICI : DÉCLARER LA VARIABLE
    let winningStyleCode = 'RIEN'; // On lui donne une valeur par défaut sûre

    for (const styleCode in scores) {
        if (scores[styleCode] > maxScore) {
            maxScore = scores[styleCode];
            // 🛑 L'affectation est correcte, mais la déclaration doit être faite au-dessus
            winningStyleCode = styleCode; 
        } else if (scores[styleCode] === maxScore && styleCode === 'RIEN') {
            winningStyleCode = styleCode; 
        }
    }
    
    // 🛑 Maintenant, la variable est définie et peut être utilisée ici (à l'ancienne ligne 138)
    const winningStyle = styleResults[winningStyleCode];
    
    // Afficher le résultat
    resultTitle.textContent = winningStyle.name;
    resultDescription.textContent = winningStyle.desc;

    // -----------------------------------------------------------------
    // NOUVEAU : Création de l'iframe qui a fonctionné pour vous
    // -----------------------------------------------------------------
    pinterestFrameContainer.innerHTML = ''; // Nettoyer
    
    // 1. Titre Brutaliste
    const frameTitle = document.createElement('h3');
    frameTitle.textContent = "INSPIRATION VISUELLE";
    frameTitle.className = 'pinterest-frame-title';
    pinterestFrameContainer.appendChild(frameTitle);
    
    // 2. Création de l'élément iFrame
    const pinterestFrame = document.createElement('iframe');
    pinterestFrame.src = winningStyle.pinterestLink;
    pinterestFrame.title = "Planche d'inspiration pour le style " + winningStyle.name;
    pinterestFrame.width = "100%";
    pinterestFrame.height = "400"; // Hauteur fixe
    // Les styles de bordure seront appliqués par le CSS pour la propreté, mais on laisse le strict minimum ici
    pinterestFrame.setAttribute('frameborder', '0'); 
    pinterestFrame.className = 'pinterest-iframe'; // Classe pour le style CSS
    
    pinterestFrameContainer.appendChild(pinterestFrame);
    
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