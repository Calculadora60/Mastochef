// Elementos da DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const cookBtn = document.getElementById('cook-btn');
const restartBtn = document.getElementById('restart-btn');
const missionText = document.getElementById('mission-text');
const ingredientsGrid = document.getElementById('ingredients-grid');
const timerDisplay = document.getElementById('timer');
const resultTitle = document.getElementById('result-title');
const feedbackText = document.getElementById('feedback-text');

// Dados do Jogo
const challenges = [
    {
        theme: "Faça uma Massa Italiana de respeito!",
        target: ["Massa", "Tomate", "Manjericão"]
    },
    {
        theme: "O Desafio da Sobremesa: Faça um Doce!",
        target: ["Chocolate", "Morango", "Leite Condensado"]
    },
    {
        theme: "Prato Principal Rústico e Sofisticado!",
        target: ["Carne Bovina", "Batata", "Alecrim"]
    }
];

const allIngredients = [
    { id: 1, name: "Massa" },
    { id: 2, name: "Tomate" },
    { id: 3, name: "Manjericão" },
    { id: 4, name: "Chocolate" },
    { id: 5, name: "Morango" },
    { id: 6, name: "Leite Condensado" },
    { id: 7, name: "Carne Bovina" },
    { id: 8, name: "Batata" },
    { id: 9, name: "Alecrim" },
    { id: 10, name: "Alho" },
    { id: 11, name: "Peixe" },
    { id: 12, name: "Pimenta" }
];

let currentChallenge = {};
let selectedIngredients = [];
let timeLeft = 30;
let timerInterval;

// Event Listeners
startBtn.addEventListener('click', startGame);
cookBtn.addEventListener('click', evaluateDish);
restartBtn.addEventListener('click', resetGame);

function startGame() {
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    selectedIngredients = [];
    timeLeft = 30;
    timerDisplay.textContent = timeLeft;

    // Escolher um desafio aleatório
    currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    missionText.textContent = `Missão: ${currentChallenge.theme}`;

    renderIngredients();
    startTimer();
}

function renderIngredients() {
    ingredientsGrid.innerHTML = '';
    // Embaralhar ingredientes para dificultar
    const shuffled = [...allIngredients].sort(() => 0.5 - Math.random());

    shuffled.forEach(ing => {
        const card = document.div;
        const cardEl = document.createElement('div');
        cardEl.classList.add('ingredient-card');
        cardEl.textContent = ing.name;
        cardEl.dataset.name = ing.name;

        cardEl.addEventListener('click', () => toggleIngredient(cardEl, ing.name));
        ingredientsGrid.appendChild(cardEl);
    });
}

function toggleIngredient(cardEl, name) {
    if (cardEl.classList.contains('selected')) {
        cardEl.classList.remove('selected');
        selectedIngredients = selectedIngredients.filter(item => item !== name);
    } else {
        if (selectedIngredients.length < 3) {
            cardEl.classList.add('selected');
            selectedIngredients.push(name);
        }
    }

    // Habilita o botão de cozinhar apenas se tiver escolhido exatamente 3
    cookBtn.disabled = selectedIngredients.length !== 3;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("O tempo acabou! Vamos ver o que deu para entregar...");
            evaluateDish();
        }
    }, 1000);
}

function evaluateDish() {
    clearInterval(timerInterval);
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    // Verificar quantos ingredientes batem com o alvo
    let matches = 0;
    currentChallenge.target.forEach(targetItem => {
        if (selectedIngredients.includes(targetItem)) {
            matches++;
        }
    });

    // Dar feedback baseado no acerto
    if (matches === 3) {
        resultTitle.textContent = "🏆 Prato Perfeito!";
        feedbackText.textContent = "Os chefs aplaudiram de pé! Os sabores estão equilibrados, o ponto está impecável e você entendeu perfeitamente a proposta da caixa misteriosa.";
    } else if (matches === 2) {
        resultTitle.textContent = "🥈 Bom Trabalho, mas...";
        feedbackText.textContent = "O chef Jacquin gostou da sua ousadia, mas sentiu falta de harmonia em um dos elementos. Passou, mas por pouco!";
    } else {
        resultTitle.textContent = "❌ Desastre na Cozinha!";
        feedbackText.textContent = "O chef Fogaça provou e odiou. 'Isso aqui é uma sola de sapato/um insulto à gastronomia!', disse ele. Você foi eliminado.";
    }
}

function resetGame() {
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    missionText.textContent = "Bem-vindo ao provador! Prepare-se para cozinhar.";
}
