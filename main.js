const grid = document.querySelector('.grid');
const maxScoreSpan = document.querySelector('.record span');

const record = localStorage.getItem('record');

// Gera os quadrados do jogo e do background
for (let i = 0; i < 99; i++) {
    grid.innerHTML += `<div></div>`;
    document.querySelector('.board').innerHTML += `<div></div>`;
}

document.addEventListener('DOMContentLoaded', () => {
    const squares = grid.children;
    const scoreDisplay = document.querySelector('.score span');
    const startBtn = document.querySelector('.start');

    const width = 10;
    let currentIndex = 0; 
    let appleIndex = 0;
    let currentSnake = [2,1,0];

    let direction = 1;
    let score = 0;
    let speed = 0.9;
    let intervalTime = 0;
    let interval = 0;

    let endGame;
    let endGameInterval;

    if(localStorage.getItem('record') == null) {
        localStorage.setItem('record', 0);
    } else {
        maxScoreSpan.innerHTML = record;
    }

    // Restata todas as configurações do jogo
    function startGame() {
        currentSnake.forEach(index => squares[index].classList.remove('snake'));
        squares[appleIndex].classList.remove('apple');
        clearInterval(interval);
        score = 0;
        randomApple();
        direction = 1;
        scoreDisplay.innerText = score;
        intervalTime = 1000;
        currentSnake = [2,1,0]; // Esse array vai salvar a localização dos elementos da cobra
        currentIndex = 0;
        currentSnake.forEach(index => squares[index].classList.add('snake'));
        interval = setInterval(moveOutcomes, intervalTime);
        document.querySelector('.gameover').style.display = 'none';
        verifyGameOver();
    }

    
    // Move a cobra na direção escolhida e gera maçãs
    function moveOutcomes() {

    if (
        (currentSnake[0] + width >= (width * width) && direction === width ) || 
        (currentSnake[0] % width === width -1 && direction === 1) || 
        (currentSnake[0] % width === 0 && direction === -1) || 
        (currentSnake[0] - width < 0 && direction === -width) ||  
        squares[currentSnake[0] + direction].classList.contains('snake')
    ) {
        return clearInterval(interval);
    }

    // Move a cobra e troca seus indices
    const tail = currentSnake.pop(); 
    squares[tail].classList.remove('snake');
    currentSnake.unshift(currentSnake[0] + direction); 

    // Se a maçã for comida
    if(squares[currentSnake[0]].classList.contains('apple')) {
        squares[currentSnake[0]].classList.remove('apple');
        squares[tail].classList.add('snake');
        currentSnake.push(tail);
        randomApple();
        score++;
        scoreDisplay.textContent = score;
        clearInterval(interval);
        intervalTime = intervalTime * speed;

        // Faz a função ativar a si mesma aumentando a velocidade
        interval = setInterval(moveOutcomes, intervalTime);
    }
        endGame = true;
        squares[currentSnake[0]].classList.add('snake');
    }

    // Gera a maçã aleatoriamente aonde não tenha a cobra
    function randomApple() {
        do{
            appleIndex = Math.floor(Math.random() * squares.length);
        } while (squares[appleIndex].classList.contains('snake')) {
            squares[appleIndex].classList.add('apple');
        }
    }



    // Capta os cliques das setas teclado
    function control(e) {
        squares[currentIndex].classList.remove('snake');

        if (e.keyCode === 39) {
            direction = 1; // Se for precionado a seta direita no teclado
        } else if (e.keyCode === 38) {
            direction = -width; // Se for precionado a seta pra cima no teclado
        } else if (e.keyCode === 37) {
            direction = -1; // Se for precionado a seta esquerda no teclado
        } else if (e.keyCode === 40) {
            direction = +width; // Se for precionado a seta pra baixo no teclado
        }

    }

    document.addEventListener('keyup', control);
    startBtn.addEventListener('click', startGame);

    // Funciona como um callback quando o jogo acaba
    const verifyGameOver = () => {
       endGameInterval = setInterval(() => {
        if(!endGame) {
            changeRecord();
            startBtn.innerHTML = 'Reniciar Jogo';
            document.querySelector('.gameover').style.display = 'flex';
            clearInterval(endGameInterval);
        }
        endGame = false;
        }, intervalTime);
    };

    // Modifica o record máximo em local
    const changeRecord = () => {
        if(score > record) {
            localStorage.setItem('record', score);
            maxScoreSpan.innerHTML = score;
        }
    }
})