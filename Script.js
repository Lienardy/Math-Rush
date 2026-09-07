let score = 0;
let combo = 0;
let gameOver = false;
let time = 30;
let timer;



const gameLeaderboardList =
    document.getElementById("gameLeaderboardList");

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


const finalScore =
    document.getElementById("finalScore");

const playerName =
    document.getElementById("playerName");

const saveScore =
    document.getElementById("saveScore");

const soloSaveArea =
    document.getElementById("soloSaveArea");


const leaderboard =
    document.getElementById("leaderboard");

const homeLeaderboard =
    document.getElementById("homeLeaderboard");


const playAgain =
    document.getElementById("playAgain");


const player1ScoreElement =
    document.getElementById("player1Score");

const player2ScoreElement =
    document.getElementById("player2Score");

const player1Question =
    document.getElementById("player1Question");

const player2Question =
    document.getElementById("player2Question");

const player1Choices =
    document.getElementById("player1Choices");

const player2Choices =
    document.getElementById("player2Choices");


let player1Score = 0;
let player2Score = 0;
let versusRunning = false;


function hideAllScreens() {

    homeScreen.style.display = "none";

    soloMenu.style.display = "none";

    gameScreen.style.display = "none";

    versusMenu.style.display = "none";

    versusScreen.style.display = "none";

    gameOverScreen.style.display = "none";

    leaderboardScreen.style.display = "none";
}


function showHome() {

    clearInterval(timer);

    versusRunning = false;

    hideAllScreens();

    homeScreen.style.display = "flex";

    showHomeLeaderboard();
}


btnSolo.addEventListener("click", () => {

    hideAllScreens();

    soloMenu.style.display = "flex";

});


btnVersus.addEventListener("click", () => {

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
            ) + 1 -
            Math.floor(
                Math.random() * 40
            ) - 1;

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
            ) + 1 -
            Math.floor(
                Math.random() * 40
            ) - 1;

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


    question.choices.forEach(
        (choice) => {

            const button =
                document.createElement("button");


            button.textContent =
                choice;


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


                    buttons.forEach(
                        (button) => {

                            button.disabled = true;

                        }
                    );


                    if (
                        choice === question.answer
                    ) {

                        score++;

                        combo++;


                        scoreElement.textContent =
                            `Score: ${score}`;


                        comboElement.textContent =
                            `🔥 Combo: ${combo}`;


                        setTimeout(
                            () => {

                                if (!gameOver) {

                                    showQuestion(
                                        generateQuestion()
                                    );

                                }

                            },
                            100

                        );

                    } else {

                        score =
                            Math.max(
                                0,
                                score - 1
                            );


                        combo = 0;


                        scoreElement.textContent =
                            `Score: ${score}`;


                        comboElement.textContent =
                            `🔥 Combo: ${combo}`;


                        setTimeout(
                            () => {

                                if (!gameOver) {

                                    showQuestion(
                                        generateQuestion()
                                    );

                                }

                            },
                            500

                        );

                    }

                }
            );


            choicesElement.appendChild(
                button
            );

        }
    );
}


function startGame(duration) {

    clearInterval(timer);


    score = 0;

    combo = 0;

    time = duration;

    gameOver = false;


    hideAllScreens();


    gameScreen.style.display =
        "block";


    soloSaveArea.style.display =
        "block";


    scoreElement.textContent =
        "Score: 0";


    comboElement.textContent =
        "🔥 Combo: 0";


    timerElement.textContent =
        `Time: ${time}`;


    showQuestion(
        generateQuestion()
        
    );
    showGameLeaderboard();


    timer = setInterval(
        () => {

            time--;


            timerElement.textContent =
                `Time: ${time}`;


            if (time <= 0) {

                clearInterval(timer);

                gameOver = true;


                gameScreen.style.display =
                    "none";


                gameOverScreen.style.display =
                    "block";


                soloSaveArea.style.display =
                    "block";


                finalScore.textContent =
                    `Score: ${score}`;

            }

        },
        1000
    );
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


saveScore.addEventListener(
    "click",
    () => {

        const name =
            playerName.value.trim();


        if (name === "") {
            return;
        }


        let scores =
            JSON.parse(
                localStorage.getItem("scores")
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
            "scores",
            JSON.stringify(scores)
        );


        showLeaderboard();

    }
);

function showGameLeaderboard() {

    gameLeaderboardList.innerHTML = "";

    const scores =
        JSON.parse(
            localStorage.getItem("scores")
        ) || [];

    scores
        .slice(0, 5)
        .forEach((player) => {

            const li =
                document.createElement("li");

            li.textContent =
                `${player.name} - ${player.score}`;

            gameLeaderboardList.appendChild(li);

        });
}

function showLeaderboard() {

    hideAllScreens();


    leaderboardScreen.style.display =
        "block";


    leaderboard.innerHTML = "";


    const scores =
        JSON.parse(
            localStorage.getItem("scores")
        ) || [];


    scores.forEach(
        (player) => {

            const li =
                document.createElement("li");


            li.textContent =
                `${player.name} - ${player.score}`;


            leaderboard.appendChild(
                li
            );

        }
    );
}


btnVersusStart.addEventListener(
    "click",
    () => {

        startVersusGame();

    }
);


function startVersusGame() {

    clearInterval(timer);


    player1Score = 0;

    player2Score = 0;

    versusRunning = true;


    hideAllScreens();


    versusScreen.style.display =
        "flex";


    soloSaveArea.style.display =
        "none";


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
        player
    ) {

        if (
            !versusRunning ||
            answered
        ) {
            return;
        }


        answered = true;


        if (
            choice === question.answer
        ) {

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


        if (
            player1Score >= 10 ||
            player2Score >= 10
        ) {

            endVersusGame();

            return;
        }


        setTimeout(
            () => {

                if (versusRunning) {

                    showVersusQuestion(
                        generateQuestion()
                    );

                }

            },
            300
        );
    }


    question.choices.forEach(
        (choice) => {


            const button1 =
                document.createElement(
                    "button"
                );


            button1.textContent =
                choice;


            button1.addEventListener(
                "click",
                () => {

                    checkAnswer(
                        choice,
                        1
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


            button2.textContent =
                choice;


            button2.addEventListener(
                "click",
                () => {

                    checkAnswer(
                        choice,
                        2
                    );

                }
            );


            player2Choices.appendChild(
                button2
            );

        }
    );
}


function endVersusGame() {

    versusRunning = false;


    versusScreen.style.display =
        "none";


    gameOverScreen.style.display =
        "block";


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


function showHomeLeaderboard() {

    homeLeaderboard.innerHTML = "";


    const scores =
        JSON.parse(
            localStorage.getItem("scores")
        ) || [];


    scores
        .slice(0, 5)
        .forEach(
            (player) => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    `${player.name} - ${player.score}`;


                homeLeaderboard.appendChild(
                    li
                );

            }
        );
}


playAgain.addEventListener(
    "click",
    () => {

        playerName.value = "";

        showHome();

    }
);


showHome();