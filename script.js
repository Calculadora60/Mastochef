const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextRoundBtn = document.getElementById('next-round-btn');

const timerDisplay = document.getElementById('timer');
const playerScoreDisplay = document.getElementById('player-score');
const rivalScoreDisplay = document.getElementById('rival-score');
const currentRecipeName = document.getElementById('current-recipe-name');
const progressBar = document.getElementById('progress-bar');

const stepCut = document.getElementById('step-cut');
const stepCook = document.getElementById('step-cook');
const stepPlate = document.getElementById('step-plate');

const btnCut = document.getElementById('btn-station-cut');
const btnCook = document.getElementById('btn-station-cook');
const btnPlate = document.getElementById('btn-station-plate');

const cutLabel = document.getElementById('cut-label');
const cookLabel = document.getElementById('cook-label');

const resultTitle = document.getElementById('result-title');
const feedbackText = document.getElementById('feedback-text');

// Receita com métodos de preparo reais da culinária
const recipes = [
    { 
        name: "Risoto de Cogumelos", 
        cutMethod: "Picar Brunoise", 
        cookMethod: "Refogar em fogo alto", 
        cutsNeeded: 4, 
        cooksNeeded: 4 
    },
    { 
        name: "Filé ao Poivre com Batatas", 
        cutMethod: "Fatiar medalhões", 
        cookMethod: "Selar na frigideira", 
        cutsNeeded: 5, 
        cooksNeeded: 5 
    },
    { 
        name: "Strogonoff de Frango Rápido", 
        cutMethod: "Cortar em cubos", 
        cookMethod: "Flambar com conhaque", 
        cutsNeeded: 3, 
        cooksNeeded: 4 
    },
    { 
        name: "Salmão Grelhado com Aspargos", 
        cutMethod: "Limpar e aparar", 
        cookMethod: "Grelhar com azeite", 
        cutsNeeded: 3, 
        cooksNeeded: 3 
    }
];

let currentRecipe = {};
let currentStep = 'cut'; // 'cut', 'cook', 'plate'
let actionProgress = 0;
let targetActions = 3;
let totalActionsRequired = 1;
let currentTotalDone = 0;

let timeLeft = 45;
let timerInterval;
let rivalInterval;

let playerScore = 0;
let rivalScore = 0;
let rivalProgress = 0;

startBtn.addEventListener('click', startBattle);
nextRoundBtn.addEventListener('click', startBattle);

function startBattle() {
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    timeLeft = 45;
    timerDisplay.textContent = timeLeft;
    
    // Escolher prato aleatório
    currentRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    currentRecipeName.textContent = currentRecipe.name;

    // Atualizar os textos dos métodos de preparo específicos da receita
    cutLabel.textContent = currentRecipe.cutMethod;
    cookLabel.textContent = currentRecipe.cookMethod;

    // Resetar etapas e progresso
    currentStep = 'cut';
    actionProgress = 0;
    targetActions = currentRecipe.cutsNeeded;
    totalActionsRequired = currentRecipe.cutsNeeded + currentRecipe.cooksNeeded + 1; // +1 para empratar
    currentTotalDone = 0;
    
    rivalProgress = 0;

    updateUIState();
    startTimers();
}

function startTimers() {
    clearInterval(timerInterval);
    clearInterval(rivalInterval);

    // Relógio principal da partida
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endRound("O tempo esgotado pelos jurados! Prato interrompido.");
        }
    }, 1000);

    // IA do Oponente (competitividade)
    rivalInterval = setInterval(() => {
        rivalProgress += 0.8;
        if (rivalProgress >= totalActionsRequired) {
            rivalScore += 100;
            rivalScoreDisplay.textContent = rivalScore;
            rivalProgress = 0;
        }
    }, 1000);
}

// Mecânica principal de clique nas estações
function progressAction(stationType) {
    if (stationType !== currentStep) return;

    actionProgress++;
    currentTotalDone++;
    updateProgressBar();

    // Feedback dinâmico no botão
    if (currentStep === 'cut') {
        btnCut.textContent = `🔪 ${currentRecipe.cutMethod} (${actionProgress}/${targetActions})`;
    } else if (currentStep === 'cook') {
        btnCook.textContent = `🔥 ${currentRecipe.cookMethod} (${actionProgress}/${targetActions})`;
    }

    // Avança de etapa
    if (actionProgress >= targetActions) {
        if (currentStep === 'cut') {
            currentStep = 'cook';
            actionProgress = 0;
            targetActions = currentRecipe.cooksNeeded;
            btnCut.innerHTML = `🔪 ${currentRecipe.cutMethod} <span style="color:#4caf50;">(Feito)</span>`;
        } else if (currentStep === 'cook') {
            currentStep = 'plate';
            btnCook.innerHTML = `🔥 ${currentRecipe.cookMethod} <span style="color:#4caf50;">(Feito)</span>`;
        } else if (currentStep === 'plate') {
            finishDishSuccessfully();
            return;
        }
        updateUIState();
    }
}

function updateProgressBar() {
    let percent = (currentTotalDone / totalActionsRequired) * 100;
    if (percent > 100) percent = 100;
    progressBar.style.width = percent + '%';
}

function updateUIState() {
    btnCut.disabled = currentStep !== 'cut';
    btnCook.disabled = currentStep !== 'cook';
    btnPlate.disabled = currentStep !== 'plate';

    if (currentStep === 'cut') {
        stepCut.className = "badge active";
        stepCook.className = "badge";
        stepPlate.className = "badge";
    } else if (currentStep === 'cook') {
        stepCut.className = "badge done";
        stepCook.className = "badge active";
        stepPlate.className = "badge";
    } else if (currentStep === 'plate') {
        stepCut.className = "badge done";
        stepCook.className = "badge done";
        stepPlate.className = "badge active";
        btnPlate.textContent = "🍽️ Clique para Empratar e Servir!";
    }
}

function finishDishSuccessfully() {
    clearInterval(timerInterval);
    clearInterval(rivalInterval);

    playerScore += 150;
    playerScoreDisplay.textContent = playerScore;

    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    resultTitle.textContent = "✨ Prato Entregue com Excelência!";
    feedbackText.textContent = `Os jurados provaram o seu ${currentRecipe.name}. A técnica de ${currentRecipe.cutMethod.toLowerCase()} e o ponto de ${currentRecipe.cookMethod.toLowerCase()} impressionaram a bancada!`;
}

function endRound(reason) {
    clearInterval(timerInterval);
    clearInterval(rivalInterval);

    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    resultTitle.textContent = "⚠️ Bancada Lenta!";
    feedbackText.textContent = `${reason} O rival foi mais rápido na execução e levou vantagem.`;
    
    rivalScore += 100;
    rivalScoreDisplay.textContent = rivalScore;
}
