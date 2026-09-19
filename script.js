const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextRoundBtn = document.getElementById('next-round-btn');

const timerDisplay = document.getElementById('timer');
const playerScoreDisplay = document.getElementById('player-score');
const rivalScoreDisplay = document.getElementById('rival-score');
const currentRecipeName = document.getElementById('current-recipe-name');

const stepCut = document.getElementById('step-cut');
const stepCook = document.getElementById('step-cook');
const stepPlate = document.getElementById('step-plate');

const btnCut = document.getElementById('btn-station-cut');
const btnCook = document.getElementById('btn-station-cook');
const btnPlate = document.getElementById('btn-station-plate');

const resultTitle = document.getElementById('result-title');
const feedbackText = document.getElementById('feedback-text');

// Lista de pratos exigidos pelo programa
const recipes = [
    { name: "Risoto de Cogumelos", cutsNeeded: 3, cooksNeeded: 3 },
    { name: "Filé ao Poivre com Batatas", cutsNeeded: 4, cooksNeeded: 4 },
    { name: "Strogonoff de Frango Rápido", cutsNeeded: 2, cooksNeeded: 3 },
    { name: "Salmão Grelhado com Aspargos", cutsNeeded: 2, cooksNeeded: 2 }
];

let currentRecipe = {};
let currentStep = 'cut'; // 'cut', 'cook', 'plate'
let actionProgress = 0;
let targetActions = 3;

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

    // Resetar etapas
    currentStep = 'cut';
    actionProgress = 0;
    targetActions = currentRecipe.cutsNeeded;
    
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
            endRound("Tempo esgotado! Os pratos foram interrompidos.");
        }
    }, 1000);

    // IA do Oponente (rival simulando o ritmo na bancada ao lado)
    rivalInterval = setInterval(() => {
        rivalProgress += Math.random() * 1.5;
        // Se o rival completar o prato antes
        if (rivalProgress >= 15) {
            rivalScore += 100;
            rivalProgress = 0;
            // Mostra um aviso rápido visual se quiser, ou deixa disputado
        }
    }, 1000);
}

// Função executada quando o jogador clica na estação ativa de trabalho
function progressAction(stationType) {
    if (stationType !== currentStep) return;

    actionProgress++;

    // Feedback visual dinâmico no botão
    if (currentStep === 'cut') {
        btnCut.textContent = `🔪 Cortando... (${actionProgress}/${targetActions})`;
    } else if (currentStep === 'cook') {
        btnCook.textContent = `🔥 Cozinhando... (${actionProgress}/${targetActions})`;
    }

    // Verifica se concluiu a etapa atual
    if (actionProgress >= targetActions) {
        if (currentStep === 'cut') {
            currentStep = 'cook';
            actionProgress = 0;
            targetActions = currentRecipe.cooksNeeded;
            btnCut.textContent = `🔪 Estação de Corte (Pronto!)`;
        } else if (currentStep === 'cook') {
            currentStep = 'plate';
            btnCook.textContent = `🔥 Fogão / Grelha (Pronto!)`;
        } else if (currentStep === 'plate') {
            // Prato finalizado e entregue na passagem!
            finishDishSuccessfully();
            return;
        }
        updateUIState();
    }
}

function updateUIState() {
    // Gerencia ativação dos botões conforme a etapa
    btnCut.disabled = currentStep !== 'cut';
    btnCook.disabled = currentStep !== 'cook';
    btnPlate.disabled = currentStep !== 'plate';

    // Atualiza badges visuais do topo
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
    }

    if(currentStep === 'plate') {
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

    resultTitle.textContent = "✨ Prato Entregue com Sucesso!";
    feedbackText.textContent = `Os jurados provaram o seu ${currentRecipe.name}. "Excelente cozimento e técnica impecável!", disse o chef. Você marcou pontos importantes!`;
}

function endRound(reason) {
    clearInterval(timerInterval);
    clearInterval(rivalInterval);

    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    resultTitle.textContent = "⚠️ Bancada Paralisada!";
    feedbackText.textContent = `${reason} O rival conseguiu entregar mais pratos e levou vantagem na rodada.`;
    
    rivalScore += 100;
    rivalScoreDisplay.textContent = rivalScore;
}
