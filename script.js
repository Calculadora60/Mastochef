const startScreen = document.getElementById('start-screen');
const marketScreen = document.getElementById('market-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const confirmMarketBtn = document.getElementById('confirm-market-btn');
const nextRoundBtn = document.getElementById('next-round-btn');

const roundIndicator = document.getElementById('round-indicator');
const marketThemeTitle = document.getElementById('market-theme-title');
const ingredientsGrid = document.getElementById('ingredients-grid');
const timerDisplay = document.getElementById('timer');
const playerScoreDisplay = document.getElementById('player-score');

const rival1Info = document.getElementById('rival-1-info');
const rival2Info = document.getElementById('rival-2-info');

const currentPhaseTitle = document.getElementById('current-phase-title');
const phaseInstruction = document.getElementById('phase-instruction');

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

// Base de dados expandida com várias receitas e ingredientes falsos/certos
const challengesList = [
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
    },
    {
        theme: "Frutos do Mar Frescos",
        correct: ["Salmão", "Limão", "Aspargos"],
        pool: ["Salmão", "Limão", "Aspargos", "Chocolate", "Carne Bovina", "Farinha"]
    },
    {
        theme: "Comida Conforto de Inverno",
        correct: ["Frango", "Cebola", "Caldo de Galinha"],
        pool: ["Frango", "Cebola", "Caldo de Galinha", "Morango", "Massa", "Sorvete"]
    }
];

let currentRound = 1;
const maxRounds = 3;

let currentChallenge = {};
let selectedMarketItems = [];

let timeLeft = 45;
let timerInterval;
let rivalInterval;
let playerScore = 0;

// NPCs Concorrentes
let rivals = [
    { name: "Chef Henrique", score: 0 },
    { name: "Chef Ana", score: 0 }
];

// Mini-games states
let cutPosition = 0;
let cutDirection = 2.5;
let cutInterval = null;

let cookPosition = 0;
let cookDirection = 3;
let cookInterval = null;

startBtn.addEventListener('click', startSeason);
confirmMarketBtn.addEventListener('click', startCookingPhase);
nextRoundBtn.addEventListener('click', handleNextRound);

actionBtnCut.addEventListener('click', evaluateCut);
actionBtnCook.addEventListener('click', evaluateCook);
actionBtnPlate.addEventListener('click', evaluatePlate);

function startSeason() {
    currentRound = 1;
    playerScore = 0;
    rivals[0].score = 0;
    rivals[1].score = 0;
    playerScoreDisplay.textContent = playerScore;
    
    startScreen.classList.add('hidden');
    openMarket();
}

function openMarket() {
    resultScreen.classList.add('hidden');
    marketScreen.classList.remove('hidden');

    roundIndicator.textContent = `Rodada ${currentRound} de ${maxRounds}`;
    selectedMarketItems = [];
    confirmMarketBtn.disabled = true;

    // Sorteia um desafio aleatório da lista grande
    currentChallenge = challengesList[Math.floor(Math.random() * challengesList.length)];
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

    timeLeft = 45;
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

    // Os NPCs pontuam com base no desempenho aleatório simulado a cada segundos
    rivalInterval = setInterval(() => {
        rivals[0].score += Math.floor(Math.random() * 25) + 10;
        rivals[1].score += Math.floor(Math.random() * 25) + 10;
        
        rival1Info.textContent = `👤 ${rivals[0].name}: ${rivals[0].score} pts`;
        rival2Info.textContent = `👤 ${rivals[1].name}: ${rivals[1].score} pts`;
    }, 3000);
}

// --- FASE 1: CORTE ---
function setupCutPhase() {
    currentPhaseTitle.textContent = "Etapa 1/3: Estação de Corte";
    phaseInstruction.textContent = "Clique em 'Cortar' na faixa verde!";
    
    minigameCut.classList.remove('hidden');
    minigameCook.classList.add('hidden');
    minigamePlate.classList.add('hidden');

    cutPosition = 0;
    clearInterval(cutInterval);
    
    cutInterval = setInterval(() => {
        cutPosition += cutDirection;
        if (cutPosition >= 95 || cutPosition <= 0) cutDirection *= -1;
        timingCursor.style.left = cutPosition + '%';
    }, 15);
}

function evaluateCut() {
    clearInterval(cutInterval);
    if (cutPosition >= 45 && cutPosition <= 60) {
        playerScore += 70;
    } else {
        playerScore += 20;
    }
    playerScoreDisplay.textContent = playerScore;
    setupCookPhase();
}

// --- FASE 2: COCÇÃO ---
function setupCookPhase() {
    currentPhaseTitle.textContent = "Etapa 2/3: Fogão & Cocção";
    phaseInstruction.textContent = "Clique em 'Tirar do Fogo' na zona verde!";

    minigameCut.classList.add('hidden');
    minigameCook.classList.remove('hidden');

    cookPosition = 0;
    clearInterval(cookInterval);

    cookInterval = setInterval(() => {
        cookPosition += cookDirection;
        if (cookPosition >= 95 || cookPosition <= 0) cookDirection *= -1;
        tempIndicator.style.left = cookPosition + '%';
    }, 15);
}

function evaluateCook() {
    clearInterval(cookInterval);
    if (cookPosition >= 60 && cookPosition <= 80) {
        playerScore += 90;
    } else {
        playerScore += 30;
    }
    playerScoreDisplay.textContent = playerScore;
    setupPlatePhase();
}

// --- FASE 3: EMPRATAMENTO ---
function setupPlatePhase() {
    currentPhaseTitle.textContent = "Etapa 3/3: Passagem (Empratamento)";
    phaseInstruction.textContent = "Finalize o prato rapidamente!";

    minigameCook.classList.add('hidden');
    minigamePlate.classList.remove('hidden');
}

function evaluatePlate() {
    playerScore += 80;
    playerScoreDisplay.textContent = playerScore;
    finishAndEvaluateDish();
}

function finishAndEvaluateDish() {
    stopAllTimers();

    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    let correctCount = 0;
    currentChallenge.correct.forEach(item => {
        if (selectedMarketItems.includes(item)) correctCount++;
    });

    let marketBonus = correctCount * 50;
    playerScore += marketBonus;
    playerScoreDisplay.textContent = playerScore;

    if (correctCount === 3) {
        resultTitle.textContent = `🏆 Fim da Rodada ${currentRound} - Prato Excepcional!`;
        feedbackText.textContent = `Os jurados provaram o ${currentChallenge.theme}. Bônus máximo de mercado por acertar os ingredientes perfeitos!`;
    } else {
        resultTitle.textContent = `⚠️ Fim da Rodada ${currentRound} - Críticas dos Chefs`;
        feedbackText.textContent = `Você errou alguns ingredientes no mercado. Os jurados fizeram ressalvas severas sobre a combinação de sabores.`;
    }

    checkRoundEnd();
}

function endRoundByTimeout() {
    stopAllTimers();

    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    resultTitle.textContent = `⏰ O Tempo Esgotou na Rodada ${currentRound}!`;
    feedbackText.textContent = "Você não conseguiu entregar todos os processos a tempo e perdeu pontos valiosos para os rivais.";

    checkRoundEnd();
}

function stopAllTimers() {
    clearInterval(timerInterval);
    clearInterval(rivalInterval);
    clearInterval(cutInterval);
    clearInterval(cookInterval);
}

function checkRoundEnd() {
    if (currentRound < maxRounds) {
        nextRoundBtn.textContent = "Ir para a Próxima Prova";
    } else {
        nextRoundBtn.textContent = "Ver Resultado Final da Temporada";
    }
}

function handleNextRound() {
    if (currentRound < maxRounds) {
        currentRound++;
        openMarket();
    } else {
        showFinalWinner();
    }
}

function showFinalWinner() {
    marketScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    // Descobrir quem venceu
    let maxRivalScore = Math.max(rivals[0].score, rivals[1].score);

    if (playerScore > maxRivalScore) {
        resultTitle.textContent = "👑 VOCÊ É O NOVO MASTERCHEF!";
        feedbackText.textContent = `Parabéns! Sua pontuação final foi de ${playerScore} pontos. Você superou os chefs rivais e conquistou o troféu da temporada!`;
    } else {
        resultTitle.textContent = "❌ Você foi Eliminado da Competição!";
        feedbackText.textContent = `Sua pontuação final (${playerScore} pts) não foi suficiente contra os concorrentes. Mais sorte na próxima temporada!`;
    }

    nextRoundBtn.textContent = "Jogar Nova Temporada";
    nextRoundBtn.onclick = startSeason;
}
