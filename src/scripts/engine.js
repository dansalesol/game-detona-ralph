const state = {
    view:{
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        level: document.querySelector("#level"),
        backgroundSong: document.querySelector("#play-botton"),
        gameOverMessage: document.createElement("div"),

    },
    values:{
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        remainingLives: 3, 
        gameInProgress: true,
        timerId: null,
        intervalIds: [],
        currentGameLevel: 0,
    },
    actions: {
        countDownTimerId: setInterval(countDown, 1000),
    },
};

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;
    
    if(state.values.currentTime <= 0) {
        gameOver();
    }
}

function playSound(audioName) {
    if(!this.loop) { 
        let audio = new Audio(`./src/audios/${audioName}.m4a`);
        audio.volume = 0.2;
        audio.play();
    }    
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function gameOver() {
    playSound("game-over");
    state.values.gameInProgress = false;
    clearInterval(state.actions.countDownTimerId);
    state.values.intervalIds.forEach(intervalId => { 
        clearInterval(intervalId)
    });
    state.view.gameOverMessage.textContent = "Game Over! O seu resultado foi: " + state.values.result;
    state.view.gameOverMessage.classList.add("game-over-message");
    document.body.appendChild(state.view.gameOverMessage);
}

function moveEnemy() {
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.values.intervalIds.push(state.values.timerId);
}

function incrementGameLevel() {
    state.values.gameVelocity -= 1;
    moveEnemy();
    state.values.currentGameLevel++;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if(state.values.gameInProgress) {
                if(square.id === state.values.hitPosition) {
                    state.values.result++;
                    state.view.score.textContent = state.values.result;
                    state.values.hitPosition = null;
                    state.values.currentTime += 1;
                    playSound("hit");
                    if(!(state.values.result % 20)) {  
                        incrementGameLevel();
                        state.view.level.textContent = state.values.currentGameLevel;
                    }
                    if (!(state.values.result % 30)) {
                        state.values.remainingLives++;
                        state.view.lives.textContent = state.values.remainingLives;
                    }    
                } else {
                    playSound("buzz");
                    state.values.remainingLives--;
                    state.view.lives.textContent = state.values.remainingLives;
                    if(state.values.remainingLives <= 0) {
                        gameOver();
                    }
                }
            }    
        });
    });
}

function initialize() {
    moveEnemy();
    addListenerHitBox();
}

initialize();