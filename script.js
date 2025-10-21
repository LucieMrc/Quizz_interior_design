// Définition des 9 styles avec leurs descriptions
const styleResults = {
    'MAX_POP': { 
        name: "Kitsch & Couleur (Post-Moderne)", 
        desc: "Cool Kid Tik Tok, anti-minimalisme 🌈✨",
        pinterestLink: "https://assets.pinterest.com/ext/embed.html?id=351912466721586"
 },
    'MAX_TH': { 
        name: "Théatral rétro", 
        desc: "Atelier d'artiste ou Maison-Musée 🕯️🔮",
        pinterestLink: "https://assets.pinterest.com/ext/embed.html?id=128423026873370658"
     },
    'BOHO_J': { 
        name: "Jungle Bohème", 
        desc: "Plantes 🌴🌿", 
        pinterestLink: "https://assets.pinterest.com/ext/embed.html?id=55591376643897316"
     },
    'MCM': { 
        name: "MCM", 
        desc: "Mid Century Modern 🥃🛋️",
        pinterestLink: "https://assets.pinterest.com/ext/embed.html?id=703756188683334"
    },
    'LUXE_70': { 
        name: "Luxe 70s", 
        desc: "Le Salon des 70's 🍑🎶",
        pinterestLink: "https://assets.pinterest.com/ext/embed.html?id=338121884554982914"
    },
    'COTT': { 
        name: "Cottagecore", 
        desc: "La Maison de Campagne de ta grand-mère 🧺🎀",
        pinterestLink: "https://assets.pinterest.com/ext/embed.html?id=128423026866319002"
    },
    'JAP': { 
        name: "Japandi", 
        desc: "Zen et naturel 🧘‍♀️🪵",
        pinterestLink: "https://assets.pinterest.com/ext/embed.html?id=1688918606073033"
    },
    'LOFT': { 
        name: "Loft", 
        desc: "Branché dans ton hangar 🧱🏙️",
        pinterestLink: "https://assets.pinterest.com/ext/embed.html?id=1618549863808456"
    },
    'RIEN': { 
        name: "Nothing", 
        desc: "Pratique avant esthétique 🛒📦",
        pinterestLink: "https://assets.pinterest.com/ext/embed.html?id=461126449369882215"
    }
};

let questions = []; 
let currentQuestionIndex = 0;
let scores = {};
let maxTotalScore = 0; // Déclaration globale de la variable

// --- Fonctions de Logique du Quiz ---

function initScores() {
    Object.keys(styleResults).forEach(key => {
        scores[key] = 0;
    });
}

// Fonction pour calculer le score total maximum possible
function calculateMaxScore() {
    maxTotalScore = 0;
    questions.forEach(q => {
        let maxOptionScore = 0;
        q.options.forEach(option => {
            const optionMax = Math.max(...Object.values(option.scores));
            if (optionMax > maxOptionScore) {
                maxOptionScore = optionMax;
            }
        });
        maxTotalScore += maxOptionScore;
    });
}

// --- Logique de chargement des données JSON ---
async function loadQuizData() {
    try {
        const response = await fetch('quiz-data.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        questions = await response.json();
        
        calculateMaxScore(); // Appel du calcul du max
        initScores();
        
    } catch (error) {
        console.error("Erreur lors du chargement des données du quiz:", error);
        document.getElementById('quiz-content').innerHTML = "<p>Désolé, impossible de charger le quiz. (Erreur JSON)</p>";
    }
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
    const resultPercentages = document.getElementById('result-percentages'); // Référence au nouveau conteneur

    // -----------------------------------------------------------
    // 1. Calcul du classement et des pourcentages
    // -----------------------------------------------------------

    // Créer un tableau triable
    const sortedScores = [];
    for (const styleCode in scores) {
        // Le pourcentage est calculé par rapport au score total maximum possible
        const percentage = maxTotalScore > 0 ? ((scores[styleCode] / maxTotalScore) * 100).toFixed(0) : 0;
        
        sortedScores.push({
            code: styleCode,
            score: scores[styleCode],
            percentage: parseInt(percentage) // Convertir en entier
        });
    }

    // Trier par score (descendant)
    sortedScores.sort((a, b) => b.score - a.score);

    const topStyle = sortedScores[0];
    const winningStyle = styleResults[topStyle.code];

    // -----------------------------------------------------------
    // 2. Affichage des 3 meilleurs résultats
    // -----------------------------------------------------------

    // 1. Titre principal (Gagnant)
    resultTitle.textContent = `${winningStyle.name}`;
    resultDescription.textContent = winningStyle.desc;

    // 2. Construction de la chaîne de pourcentage des 3 meilleurs
    let percentageText = `Votre style est à **${topStyle.percentage}%** ${winningStyle.name}.`;
    
    if (sortedScores.length > 1) {
        const secondStyle = sortedScores[1];
        percentageText += `<br> Suivi par **${styleResults[secondStyle.code].name}** à ${secondStyle.percentage}%.`;
    }
    if (sortedScores.length > 2) {
        const thirdStyle = sortedScores[2];
        percentageText += ` Et **${styleResults[thirdStyle.code].name}** à ${thirdStyle.percentage}%.`;
    }
    
    resultPercentages.innerHTML = percentageText; // Injection dans le nouveau conteneur

    // -----------------------------------------------------------
    // 3. Affichage de l'iFrame Pinterest (inchangé)
    // -----------------------------------------------------------
    pinterestFrameContainer.innerHTML = ''; 

    // Titre Brutaliste
    const frameTitle = document.createElement('h3');
    frameTitle.textContent = "INSPIRATION VISUELLE";
    frameTitle.className = 'pinterest-frame-title';
    pinterestFrameContainer.appendChild(frameTitle);
    
    // Création de l'élément iFrame
    const pinterestFrame = document.createElement('iframe');
    pinterestFrame.src = winningStyle.pinterestLink;
    pinterestFrame.title = "Planche d'inspiration pour le style " + winningStyle.name;
    pinterestFrame.width = "100%";
    pinterestFrame.height = "400"; 
    pinterestFrame.setAttribute('frameborder', '0'); 
    pinterestFrame.className = 'pinterest-iframe'; 
    
    pinterestFrameContainer.appendChild(pinterestFrame);
        
    // Rendre visible la page de résultat
    quizContent.classList.add('hidden');
    resultContainer.classList.remove('hidden');
}

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