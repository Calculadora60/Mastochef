const startScreen = document.getElementById('start-screen');
const marketScreen = document.getElementById('market-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const confirmMarketBtn = document.getElementById('confirm-market-btn');
const nextRoundBtn = document.getElementById('next-round-btn');

const marketThemeTitle = document.getElementById('market-theme-title');
const ingredientsGrid = document.getElementById('ingredients-grid');
const timerDisplay = document.getElementById('timer');
const playerScoreDisplay = document.getElementById('player-score');
const rivalScoreDisplay = document.getElementById('rival-score');

const currentPhaseTitle = document.getElementById('current-phase-title');
const phaseInstruction = document.getElementById('phase-instruction');

// Mini-games elements
const minigameCut = document.getElementById('minigame-cut');
const minigameCook = document.getElementById('minigame-cook');
const minigamePlate = document.getElementById('minigame-plate');

const timingCursor = document.getElementById('timing-cursor');
const actionBtnCut = document.getElementById('action-btn-cut');

const tempIndicator = document.getElementById('temp-indicator');
const actionBtnCook = document.getElementById('action-btn-cook');
const actionBtnPlate = document.getElementById('action-btn-plate');

const resultTitle = document.getElementById('result-title');
const feedbackText = document.getElementById('feedback-text');

// Dados dos Desafios MasterChef
const challenges = [
    {
        theme: "A Grande Massa Italiana",
        correct: ["Massa", "Tomate", "Manjericão"],
        pool: ["Massa", "Tomate", "Manjericão", "Chocolate", "Frango", "Alho"]
    },
    {
        theme: "Sobremesa Sofisticada com Chocolate",
        correct: ["Chocolate", "Morango", "Leite Condensado"],
        pool: ["Chocolate", "Morango", "Leite Condensado", "Batata", "Salmão", "Cebola"]
    },
    {
        theme: "Prato Principal: Carne e Especiarias",
        correct: ["Carne Bovina", "Batata", "Alecrim"],
        pool: ["Carne Bovina", "Batata", "Alecrim", "Massa", "Morango", "Açúcar"]
    }
];

let currentChallenge = {};
let selectedMarketItems = [];

let timeLeft = 50;
let timerInterval;
let rivalInterval;
let playerScore = 0;
let rivalScore = 0;

// Variáveis independentes para os mini-games de movimento
let cutPosition = 0;
let cutDirection = 2;
let cutInterval = null;

let cookPosition = 0;
let cookDirection = 2.5;
let cookInterval = null;

startBtn.addEventListener('click', openMarket);
confirmMarketBtn.addEventListener('click', startCookingPhase);
nextRoundBtn.addEventListener('click', openMarket);

// Ações dos botões dos Mini-games
actionBtnCut.addEventListener('click', evaluateCut);
actionBtnCook.addEventListener('click', evaluateCook);
actionBtnPlate.addEventListener('click', evaluatePlate);

function openMarket() {
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    marketScreen.classList.remove('hidden');

    selectedMarketItems = [];
    confirmMarketBtn.disabled = true;

    currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    marketThemeTitle.textContent = `Desafio: ${currentChallenge.theme}`;

    renderMarketIngredients();
}

function renderMarketIngredients() {
    ingredientsGrid.innerHTML = '';
    const shuffledPool = [...currentChallenge.pool].sort(() => 0.5 - Math.random());

    shuffledPool.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('ingredient-card');
        card.textContent = item;
        card.addEventListener('click', () => toggleMarketItem(card, item));
        ingredientsGrid.appendChild(card);
    });
}

function toggleMarketItem(cardEl, itemName) {
    if (cardEl.classList.contains('selected')) {
        cardEl.classList.remove('selected');
        selectedMarketItems = selectedMarketItems.filter(i => i !== itemName);
    } else {
        if (selectedMarketItems.length < 3) {
            cardEl.classList.add('selected');
            selectedMarketItems.push(itemName);
        }
    }
    confirmMarketBtn.disabled = selectedMarketItems.length !== 3;
}

function startCookingPhase() {
    marketScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    timeLeft = 50;
    timerDisplay.textContent = timeLeft;

    setupCutPhase();
    startTimers();
}

function startTimers() {
    clearInterval(timerInterval);
    clearInterval(rivalInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endRoundByTimeout();
        }
    }, 1000);

    rivalInterval = setInterval(() => {
        rivalScore += 20;
        rivalScoreDisplay.textContent = rivalScore;
    }, 4000);
}

// --- FASE 1: MINI-GAME DE CORTE ---
function setupCutPhase() {
    currentPhaseTitle.textContent = "Etapa 1/3: Estação de Corte";
    phaseInstruction.textContent = "Clique em 'Cortar' quando o cursor estiver na faixa verde!";
    
    minigameCut.classList.remove('hidden');
    minigameCook.classList.add('hidden');
    minigamePlate.classList.add('hidden');

    cutPosition = 0;
    cutDirection = 2;
    clearInterval(cutInterval);
    
    cutInterval = setInterval(() => {
        cutPosition += cutDirection;
        if (cutPosition >= 95 || cutPosition <= 0) {
            cutDirection *= -1;
        }
        timingCursor.style.left = cutPosition + '%';
    }, 20);
}

function evaluateCut() {
    clearInterval(cutInterval);
    // Faixa verde está entre 45% e 60%
    if (cutPosition >= 45 && cutPosition <= 60) {
        playerScore += 50;
        playerScoreDisplay.textContent = playerScore;
    } else {
        playerScore += 10; // Pontuação menor por errar o tempo
        playerScoreDisplay.textContent = playerScore;
    }
    setupCookPhase();
}

// --- FASE 2: MINI-GAME DE COCÇÃO ---
function setupCookPhase() {
    currentPhaseTitle.textContent = "Etapa 2/3: Fogão & Cocção";
    phaseInstruction.textContent = "Clique em 'Tirar do Fogo' na zona verde!";

    minigameCut.classList.add('hidden');
    minigameCook.classList.remove('hidden');

    cookPosition = 0;
    cookDirection = 2.5;
    clearInterval(cookInterval);

    cookInterval = setInterval(() => {
        cookPosition += cookDirection;
        if (cookPosition >= 95 || cookPosition <= 0) {
            cookDirection *= -1;
        }
        tempIndicator.style.left = cookPosition + '%';
    }, 20);
}

function evaluateCook() {
    clearInterval(cookInterval);
    // Zona verde está entre 60% e 80%
    if (cookPosition >= 60 && cookPosition <= 80) {
        playerScore += 70;
        playerScoreDisplay.textContent = playerScore;
    } else {
        playerScore += 15;
        playerScoreDisplay.textContent = playerScore;
    }
    setupPlatePhase();
}

// --- FASE 3: MINI-GAME DE EMPRATAMENTO ---
function setupPlatePhase() {
    currentPhaseTitle.textContent = "Etapa 3/3: Passagem (Empratamento)";
    phaseInstruction.textContent = "Finalize o prato para servir aos jurados!";

    minigameCook.classList.add('hidden');
    minigamePlate.classList.remove('hidden');
}

function evaluatePlate() {
    playerScore += 80;
    playerScoreDisplay.textContent = playerScore;
    finishAndEvaluateDish();
}

function finishAndEvaluateDish() {
    clearInterval(timerInterval);
    clearInterval(rivalInterval);
    clearInterval(cutInterval);
    clearInterval(cookInterval);

    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    let correctCount = 0;
    currentChallenge.correct.forEach(item => {
        if (selectedMarketItems.includes(item)) correctCount++;
    });

    if (correctCount === 3) {
        resultTitle.textContent = "🏆 Prato Digno de MasterChef!";
        feedbackText.textContent = `Os jurados provaram e adoraram! "Os sabores estão perfeitos, a técnica de corte foi limpa e o ponto da proteína impecável", elogiou o chef Jacquin.`;
    } else if (correctCount === 2) {
        resultTitle.textContent = "🥈 Bom, mas faltou harmonia";
        feedbackText.textContent = `O chef Fogaça comentou: "Você acertou quase tudo, mas vacilou em um dos ingredientes da caixa misteriosa. Tem potencial!".`;
    } else {
        resultTitle.textContent = "❌ Desastre na Cozinha!";
        feedbackText.textContent = `Os jurados detestaram. "Isso aqui é um insulto à gastronomia!", disparou a chef Helena. Você errou os ingredientes da prova.`;
    }
}

function endRoundByTimeout() {
    clearInterval(timerInterval);
    clearInterval(rivalInterval);
    clearInterval(cutInterval);
    clearInterval(cookInterval);

    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    resultTitle.textContent = "⏰ O Tempo Esgotou!";
    feedbackText.textContent = "Você não conseguiu entregar todos os processos a tempo. O rival levou a melhor na rodada!";
    rivalScore += 150;
    rivalScoreDisplay.textContent = rivalScore;
}
