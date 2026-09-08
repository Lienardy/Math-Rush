let score = 0;
let combo = 0;
let gameOver = false;
let time = 30;
let timer;
let lastGameMode = "";
let currentDuration = 30;

let player1Score = 0;
let player2Score = 0;
let versusRunning = false;


const bgMusic =
    document.getElementById("bgMusic");


const homeScreen =
    document.getElementById("homeScreen");

const soloMenu =
    document.getElementById("soloMenu");

const gameScreen =
    document.getElementById("gameScreen");

const versusMenu =
    document.getElementById("versusMenu");

const versusScreen =
    document.getElementById("versusScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const leaderboardScreen =
    document.getElementById("leaderboardScreen");


const btnSolo =
    document.getElementById("btnSolo");

const btnVersus =
    document.getElementById("btnVersus");

const btn30 =
    document.getElementById("btn30");

const btn60 =
    document.getElementById("btn60");

const btnVersusStart =
    document.getElementById("btnVersusStart");

const backFromSolo =
    document.getElementById("backFromSolo");

const backFromVersus =
    document.getElementById("backFromVersus");

const backToHome =
    document.getElementById("backToHome");

const backToHomeFromGameOver =
    document.getElementById(
        "backToHomeFromGameOver"
    );


const scoreElement =
    document.getElementById("score");

const timerElement =
    document.getElementById("timer");

const comboElement =
    document.getElementById("combo");

const questionElement =
    document.getElementById("question");

const choicesElement =
    document.getElementById("choices");

const bonusMessage =
    document.getElementById("bonusMessage");

const finalScore =
    document.getElementById("finalScore");

const playerName =
    document.getElementById("playerName");

const saveScore =
    document.getElementById("saveScore");

const soloSaveArea =
    document.getElementById("soloSaveArea");

const playAgain =
    document.getElementById("playAgain");


const homeLeaderboard30 =
    document.getElementById(
        "homeLeaderboard30"
    );

const homeLeaderboard60 =
    document.getElementById(
        "homeLeaderboard60"
    );


const gameLeaderboardList =
    document.getElementById(
        "gameLeaderboardList"
    );

const gameLeaderboardTitle =
    document.getElementById(
        "gameLeaderboardTitle"
    );


const leaderboard =
    document.getElementById("leaderboard");


const player1ScoreElement =
    document.getElementById(
        "player1Score"
    );

const player2ScoreElement =
    document.getElementById(
        "player2Score"
    );

const player1Question =
    document.getElementById(
        "player1Question"
    );

const player2Question =
    document.getElementById(
        "player2Question"
    );

const player1Choices =
    document.getElementById(
        "player1Choices"
    );

const player2Choices =
    document.getElementById(
        "player2Choices"
    );


function hideAllScreens() {

    homeScreen.style.display = "none";

    soloMenu.style.display = "none";

    gameScreen.style.display = "none";

    versusMenu.style.display = "none";

    versusScreen.style.display = "none";

    gameOverScreen.style.display = "none";

    leaderboardScreen.style.display = "none";
}


function playMusic() {

    if (!bgMusic) {
        return;
    }

    bgMusic.currentTime = 0;

    bgMusic.play().catch(() => {});
}


function stopMusic() {

    if (!bgMusic) {
        return;
    }

    bgMusic.pause();

    bgMusic.currentTime = 0;
}


function showHome() {

    clearInterval(timer);

    versusRunning = false;

    stopMusic();

    hideAllScreens();

    homeScreen.style.display = "flex";

    showHomeLeaderboards();
}


btnSolo.addEventListener("click", () => {

    playMusic();

    hideAllScreens();

    soloMenu.style.display = "flex";
});


btnVersus.addEventListener("click", () => {

    playMusic();

    hideAllScreens();

    versusMenu.style.display = "flex";
});


backFromSolo.addEventListener("click", () => {

    showHome();
});


backFromVersus.addEventListener("click", () => {

    showHome();
});


backToHome.addEventListener("click", () => {

    showHome();
});


backToHomeFromGameOver.addEventListener(
    "click",
    () => {

        showHome();
    }
);


function generateQuestion() {

    let number1;
    let number2;
    let operator;

    const operators = [
        "+",
        "*",
        "-",
        "/"
    ];


    operator =
        operators[
            Math.floor(
                Math.random() *
                operators.length
            )
        ];


    if (operator === "/") {

        number2 =
            Math.floor(
                Math.random() * 10
            ) + 1;


        const result =
            Math.floor(
                Math.random() * 10
            ) + 1;


        number1 =
            number2 * result;

    } else {

        number1 =
            Math.floor(
                Math.random() * 50
            ) + 1;


        number2 =
            Math.floor(
                Math.random() * 50
            ) + 1;
    }


    let answer;


    if (operator === "+") {

        answer =
            number1 + number2;

    } else if (operator === "*") {

        answer =
            number1 * number2;

    } else if (operator === "-") {

        answer =
            number1 - number2;

    } else {

        answer =
            number1 / number2;
    }


    let wrongAnswer1;


    do {

        wrongAnswer1 =
            answer +
            Math.floor(
                Math.random() * 40
            ) +
            1 -
            Math.floor(
                Math.random() * 40
            ) -
            1;

    } while (
        wrongAnswer1 === answer ||
        wrongAnswer1 < 0
    );


    let wrongAnswer2;


    do {

        wrongAnswer2 =
            answer +
            Math.floor(
                Math.random() * 40
            ) +
            1 -
            Math.floor(
                Math.random() * 40
            ) -
            1;

    } while (
        wrongAnswer2 === answer ||
        wrongAnswer2 === wrongAnswer1 ||
        wrongAnswer2 < 0
    );


    const choices = [
        answer,
        wrongAnswer1,
        wrongAnswer2
    ];


    choices.sort(
        () => Math.random() - 0.5
    );


    return {
        number1,
        number2,
        operator,
        answer,
        choices
    };
}


function showQuestion(question) {

    choicesElement.innerHTML = "";


    questionElement.textContent =
        `${question.number1} ${question.operator} ${question.number2} = ?`;


    question.choices.forEach(choice => {

        const button =
            document.createElement(
                "button"
            );


        button.textContent = choice;


        button.addEventListener(
            "click",
            () => {

                if (gameOver) {
                    return;
                }


                const buttons =
                    choicesElement.querySelectorAll(
                        "button"
                    );


                buttons.forEach(btn => {
                    btn.disabled = true;
                });


                if (choice === question.answer) {

                    button.classList.add(
                        "correct"
                    );


                    combo++;


                    if (combo >= 10) {

                        score += 3;


                        if (combo === 10) {

                            showBonus(
                                "⚡ COMBO 10! +3 SCORE"
                            );
                        }

                    } else if (combo >= 5) {

                        score += 2;


                        if (combo === 5) {

                            showBonus(
                                "🔥 COMBO 5! +2 SCORE"
                            );
                        }

                    } else {

                        score += 1;
                    }


                    scoreElement.textContent =
                        `Score: ${score}`;


                    updateCombo();


                    setTimeout(() => {

                        if (!gameOver) {

                            showQuestion(
                                generateQuestion()
                            );
                        }

                    }, 100);

                } else {

                    button.classList.add(
                        "wrong"
                    );


                    score =
                        Math.max(
                            0,
                            score - 1
                        );


                    combo = 0;


                    scoreElement.textContent =
                        `Score: ${score}`;


                    comboElement.textContent =
                        "🔥 Combo: 0";


                    setTimeout(() => {

                        if (!gameOver) {

                            showQuestion(
                                generateQuestion()
                            );
                        }

                    }, 500);
                }
            }
        );


        choicesElement.appendChild(
            button
        );
    });
}


function startGame(duration) {

    clearInterval(timer);


    lastGameMode = "solo";

    currentDuration = duration;


    score = 0;

    combo = 0;

    time = duration;

    gameOver = false;


    timerElement.classList.remove(
        "warning"
    );


    hideAllScreens();

    gameScreen.style.display =
        "flex";


    if (bgMusic && bgMusic.paused) {

        bgMusic.play().catch(() => {});
    }


    soloSaveArea.style.display =
        "none";


    scoreElement.textContent =
        "Score: 0";


    timerElement.textContent =
        `Time: ${time}`;


    comboElement.textContent =
        "🔥 Combo: 0";


    bonusMessage.classList.remove(
        "show"
    );


    bonusMessage.textContent = "";


    showQuestion(
        generateQuestion()
    );


    showGameLeaderboard();


    timer = setInterval(() => {

        time--;


        timerElement.textContent =
            `Time: ${time}`;


        if (time <= 5 && time > 0) {

            timerElement.classList.add(
                "warning"
            );


            if (navigator.vibrate) {

                navigator.vibrate(150);
            }

        } else {

            timerElement.classList.remove(
                "warning"
            );
        }


        if (time <= 0) {

            clearInterval(timer);


            timerElement.classList.remove(
                "warning"
            );


            gameOver = true;


            stopMusic();


            gameScreen.style.display =
                "none";


            gameOverScreen.style.display =
                "flex";


            soloSaveArea.style.display =
                "flex";


            finalScore.textContent =
                `Score: ${score}`;
        }

    }, 1000);
}


btn30.addEventListener(
    "click",
    () => {

        startGame(30);
    }
);


btn60.addEventListener(
    "click",
    () => {

        startGame(60);
    }
);


function getStorageKey() {

    if (currentDuration === 30) {

        return "scores30";
    }

    return "scores60";
}


saveScore.addEventListener(
    "click",
    () => {

        const name =
            playerName.value.trim();


        if (name === "") {
            return;
        }


        const storageKey =
            getStorageKey();


        let scores =
            JSON.parse(
                localStorage.getItem(
                    storageKey
                )
            ) || [];


        scores.push({
            name: name,
            score: score
        });


        scores.sort(
            (a, b) =>
                b.score - a.score
        );


        scores =
            scores.slice(0, 10);


        localStorage.setItem(
            storageKey,
            JSON.stringify(scores)
        );


        playerName.value = "";


        showLeaderboard();
    }
);


function getScores(duration) {

    const key =
        duration === 30
            ? "scores30"
            : "scores60";


    return JSON.parse(
        localStorage.getItem(key)
    ) || [];
}


function showHomeLeaderboards() {

    homeLeaderboard30.innerHTML = "";

    homeLeaderboard60.innerHTML = "";


    const scores30 =
        getScores(30);


    const scores60 =
        getScores(60);


    scores30
        .slice(0, 5)
        .forEach(
            player => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    `${player.name} - ${player.score}`;


                homeLeaderboard30.appendChild(
                    li
                );
            }
        );


    scores60
        .slice(0, 5)
        .forEach(
            player => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    `${player.name} - ${player.score}`;


                homeLeaderboard60.appendChild(
                    li
                );
            }
        );
}


function showGameLeaderboard() {

    gameLeaderboardList.innerHTML = "";


    const scores =
        getScores(currentDuration);


    gameLeaderboardTitle.textContent =
        currentDuration === 30
            ? "🏆 30 SEC LEADERBOARD"
            : "⚡ 60 SEC LEADERBOARD";


    scores
        .slice(0, 5)
        .forEach(
            player => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    `${player.name} - ${player.score}`;


                gameLeaderboardList.appendChild(
                    li
                );
            }
        );
}


function showLeaderboard() {

    hideAllScreens();


    leaderboardScreen.style.display =
        "flex";


    leaderboard.innerHTML = "";


    const scores =
        getScores(currentDuration);


    scores.forEach(
        player => {

            const li =
                document.createElement(
                    "li"
                );


            li.textContent =
                `${player.name} - ${player.score}`;


            leaderboard.appendChild(
                li
            );
        }
    );
}


playAgain.addEventListener(
    "click",
    () => {

        if (lastGameMode === "solo") {

            hideAllScreens();

            soloMenu.style.display =
                "flex";

            return;
        }


        if (lastGameMode === "versus") {

            startVersusGame();
        }
    }
);


btnVersusStart.addEventListener(
    "click",
    () => {

        startVersusGame();
    }
);


function startVersusGame() {

    clearInterval(timer);


    lastGameMode = "versus";


    player1Score = 0;

    player2Score = 0;


    versusRunning = true;


    hideAllScreens();


    versusScreen.style.display =
        "flex";


    soloSaveArea.style.display =
        "none";


    playMusic();


    player1ScoreElement.textContent =
        "Score: 0";


    player2ScoreElement.textContent =
        "Score: 0";


    showVersusQuestion(
        generateQuestion()
    );
}


function showVersusQuestion(question) {

    player1Question.textContent =
        `${question.number1} ${question.operator} ${question.number2} = ?`;


    player2Question.textContent =
        `${question.number1} ${question.operator} ${question.number2} = ?`;


    player1Choices.innerHTML = "";

    player2Choices.innerHTML = "";


    let answered = false;


    function checkAnswer(
        choice,
        player,
        clickedButton
    ) {

        if (
            !versusRunning ||
            answered
        ) {

            return;
        }


        answered = true;


        const buttons1 =
            player1Choices.querySelectorAll(
                "button"
            );


        const buttons2 =
            player2Choices.querySelectorAll(
                "button"
            );


        buttons1.forEach(button => {

            button.disabled = true;

        });


        buttons2.forEach(button => {

            button.disabled = true;

        });


        const isCorrect =
            choice === question.answer;


        if (isCorrect) {

            clickedButton.classList.add(
                "correct"
            );


            if (player === 1) {

                player1Score++;


                player1ScoreElement.textContent =
                    `Score: ${player1Score}`;

            } else {

                player2Score++;


                player2ScoreElement.textContent =
                    `Score: ${player2Score}`;
            }


        } else {

            clickedButton.classList.add(
                "wrong"
            );


            const allButtons = [
                ...buttons1,
                ...buttons2
            ];


            allButtons.forEach(button => {

                if (
                    Number(button.textContent) ===
                    question.answer
                ) {

                    button.classList.add(
                        "show-correct"
                    );

                }

            });


            if (player === 1) {

                player2Score++;


                player2ScoreElement.textContent =
                    `Score: ${player2Score}`;

            } else {

                player1Score++;


                player1ScoreElement.textContent =
                    `Score: ${player1Score}`;
            }
        }


        setTimeout(() => {

            if (!versusRunning) {
                return;
            }


            if (
                player1Score >= 10 ||
                player2Score >= 10
            ) {

                endVersusGame();

                return;
            }


            showVersusQuestion(
                generateQuestion()
            );

        }, 700);
    }


    question.choices.forEach(choice => {

        const button1 =
            document.createElement(
                "button"
            );


        button1.textContent = choice;


        button1.addEventListener(
            "click",
            () => {

                checkAnswer(
                    choice,
                    1,
                    button1
                );

            }
        );


        player1Choices.appendChild(
            button1
        );


        const button2 =
            document.createElement(
                "button"
            );


        button2.textContent = choice;


        button2.addEventListener(
            "click",
            () => {

                checkAnswer(
                    choice,
                    2,
                    button2
                );

            }
        );


        player2Choices.appendChild(
            button2
        );

    });
}


function updateCombo() {

    comboElement.textContent =
        `🔥 Combo: ${combo}`;


    if (
        combo > 0 &&
        combo % 5 === 0
    ) {

        time += 3;


        timerElement.textContent =
            `Time: ${time}`;


        showBonus(
            `🔥 COMBO ${combo}! +3 SECONDS`
        );
    }
}


function showBonus(message) {

    bonusMessage.textContent =
        message;


    bonusMessage.classList.remove(
        "show"
    );


    void bonusMessage.offsetWidth;


    bonusMessage.classList.add(
        "show"
    );


    setTimeout(() => {

        bonusMessage.classList.remove(
            "show"
        );

    }, 1000);
}


function endVersusGame() {

    versusRunning = false;


    stopMusic();


    versusScreen.style.display =
        "none";


    gameOverScreen.style.display =
        "flex";


    soloSaveArea.style.display =
        "none";


    if (player1Score >= 10) {

        finalScore.textContent =
            `PLAYER 1 WINS! ${player1Score} - ${player2Score}`;

    } else {

        finalScore.textContent =
            `PLAYER 2 WINS! ${player2Score} - ${player1Score}`;
    }
}


showHome();
