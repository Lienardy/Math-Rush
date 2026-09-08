const SUPABASE_URL = "https://zytplmwkwplrddmgqshn.supabase.co";
const SUPABASE_KEY = "sb_publishable_xwADdEri8ioRMQvRyi8Z5g_9LqScOp9";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


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


/* =========================
   AUDIO
========================= */

const bgMusic =
    document.getElementById("bgMusic");


/* =========================
   SCREENS
========================= */

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


/* =========================
   BUTTONS
========================= */

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


/* =========================
   SOLO ELEMENTS
========================= */

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


/* =========================
   LEADERBOARD ELEMENTS
========================= */

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


/* =========================
   VERSUS ELEMENTS
========================= */

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


/* =========================================================
   SUPABASE LEADERBOARD
========================================================= */


/* =========================
   GET ONLINE LEADERBOARD
========================= */

async function getOnlineLeaderboard(
    gameMode
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("leaderboard")
            .select(
                "player_name, score, game_mode, created_at"
            )
            .eq(
                "game_mode",
                gameMode
            )
            .order(
                "score",
                {
                    ascending: false
                }
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            )
            .limit(10);


    if (error) {

        console.error(
            "Gagal mengambil leaderboard:",
            error
        );

        return [];

    }


    return data || [];
}


/* =========================
   SUBMIT ONLINE SCORE
========================= */

async function submitOnlineScore(
    playerName,
    score,
    gameMode
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("leaderboard")
            .insert({

                player_name:
                    playerName,

                score:
                    score,

                game_mode:
                    gameMode

            })
            .select();


    if (error) {

        console.error(
            "Gagal mengirim skor:",
            error
        );

        return false;

    }


    console.log(
        "Skor berhasil dikirim:",
        data
    );


    return true;
}


/* =========================================================
   SCREEN CONTROL
========================================================= */

function hideAllScreens() {

    homeScreen.style.display =
        "none";

    soloMenu.style.display =
        "none";

    gameScreen.style.display =
        "none";

    versusMenu.style.display =
        "none";

    versusScreen.style.display =
        "none";

    gameOverScreen.style.display =
        "none";

    leaderboardScreen.style.display =
        "none";
}


/* =========================================================
   MUSIC
========================================================= */

function playMusic() {

    if (!bgMusic) {
        return;
    }


    bgMusic.currentTime = 0;


    bgMusic
        .play()
        .catch(() => {});

}


function stopMusic() {

    if (!bgMusic) {
        return;
    }


    bgMusic.pause();

    bgMusic.currentTime = 0;

}


/* =========================================================
   HOME
========================================================= */

async function showHome() {

    clearInterval(timer);

    versusRunning = false;

    stopMusic();

    hideAllScreens();

    homeScreen.style.display =
        "flex";


    await showHomeLeaderboards();

}


/* =========================================================
   HOME BUTTONS
========================================================= */

btnSolo.addEventListener(
    "click",
    () => {

        playMusic();

        hideAllScreens();

        soloMenu.style.display =
            "flex";

    }
);


btnVersus.addEventListener(
    "click",
    () => {

        playMusic();

        hideAllScreens();

        versusMenu.style.display =
            "flex";

    }
);


backFromSolo.addEventListener(
    "click",
    () => {

        showHome();

    }
);


backFromVersus.addEventListener(
    "click",
    () => {

        showHome();

    }
);


backToHome.addEventListener(
    "click",
    () => {

        showHome();

    }
);


backToHomeFromGameOver.addEventListener(
    "click",
    () => {

        showHome();

    }
);


/* =========================================================
   QUESTION GENERATOR
========================================================= */

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


    /* =========================
       DIVISION
    ========================= */

    if (
        operator === "/"
    ) {

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


    if (
        operator === "+"
    ) {

        answer =
            number1 + number2;

    } else if (
        operator === "*"
    ) {

        answer =
            number1 * number2;

    } else if (
        operator === "-"
    ) {

        answer =
            number1 - number2;

    } else {

        answer =
            number1 / number2;

    }


    /* =========================
       WRONG ANSWER 1
    ========================= */

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


    /* =========================
       WRONG ANSWER 2
    ========================= */

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
        () =>
            Math.random() - 0.5
    );


    return {

        number1,

        number2,

        operator,

        answer,

        choices

    };

}


/* =========================================================
   SHOW QUESTION
========================================================= */

function showQuestion(
    question
) {

    choicesElement.innerHTML =
        "";


    questionElement.textContent =
        `${question.number1} ${question.operator} ${question.number2} = ?`;


    question.choices.forEach(
        choice => {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                choice;


            button.addEventListener(
                "click",
                () => {

                    if (
                        gameOver
                    ) {

                        return;

                    }


                    const buttons =
                        choicesElement.querySelectorAll(
                            "button"
                        );


                    buttons.forEach(
                        btn => {

                            btn.disabled =
                                true;

                        }
                    );


                    /* =========================
                       CORRECT
                    ========================= */

                    if (
                        choice ===
                        question.answer
                    ) {

                        button.classList.add(
                            "correct"
                        );


                        combo++;


                        if (
                            combo >= 10
                        ) {

                            score += 3;


                            if (
                                combo === 10
                            ) {

                                showBonus(
                                    "⚡ COMBO 10! +3 SCORE"
                                );

                            }

                        } else if (
                            combo >= 5
                        ) {

                            score += 2;


                            if (
                                combo === 5
                            ) {

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


                        setTimeout(
                            () => {

                                if (
                                    !gameOver
                                ) {

                                    showQuestion(
                                        generateQuestion()
                                    );

                                }

                            },
                            100
                        );


                    } else {

                        /* =========================
                           WRONG
                        ========================= */

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


                        setTimeout(
                            () => {

                                if (
                                    !gameOver
                                ) {

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


/* =========================================================
   START SOLO GAME
========================================================= */

function startGame(
    duration
) {

    clearInterval(timer);


    lastGameMode =
        "solo";


    currentDuration =
        duration;


    score = 0;

    combo = 0;

    time =
        duration;

    gameOver =
        false;


    timerElement.classList.remove(
        "warning"
    );


    hideAllScreens();


    gameScreen.style.display =
        "flex";


    if (
        bgMusic &&
        bgMusic.paused
    ) {

        bgMusic
            .play()
            .catch(() => {});

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


    bonusMessage.textContent =
        "";


    showQuestion(
        generateQuestion()
    );


    showGameLeaderboard();


    /* =========================
       TIMER
    ========================= */

    timer =
        setInterval(
            () => {

                time--;


                timerElement.textContent =
                    `Time: ${time}`;


                if (
                    time <= 5 &&
                    time > 0
                ) {

                    timerElement.classList.add(
                        "warning"
                    );


                    if (
                        navigator.vibrate
                    ) {

                        navigator.vibrate(
                            150
                        );

                    }

                } else {

                    timerElement.classList.remove(
                        "warning"
                    );

                }


                if (
                    time <= 0
                ) {

                    clearInterval(timer);


                    timerElement.classList.remove(
                        "warning"
                    );


                    gameOver =
                        true;


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

            },
            1000
        );

}


/* =========================================================
   SOLO BUTTONS
========================================================= */

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


/* =========================================================
   SAVE SCORE TO SUPABASE
========================================================= */

saveScore.addEventListener(
    "click",
    async () => {

        const name =
            playerName.value.trim();


        if (
            name === ""
        ) {

            return;

        }


        /* =========================
           DISABLE BUTTON
        ========================= */

        saveScore.disabled =
            true;


        saveScore.textContent =
            "Saving...";


        /* =========================
           SEND TO SUPABASE
        ========================= */

        const success =
            await submitOnlineScore(
                name,
                score,
                currentDuration
            );


        /* =========================
           ENABLE BUTTON
        ========================= */

        saveScore.disabled =
            false;


        saveScore.textContent =
            "Save Score";


        if (
            !success
        ) {

            alert(
                "Failed to save score. Please check your internet connection and try again."
            );

            return;

        }


        /* =========================
           CLEAR NAME
        ========================= */

        playerName.value =
            "";


        /* =========================
           SHOW ONLINE LEADERBOARD
        ========================= */

        await showLeaderboard();

    }
);

// ==========================================
// SUPABASE REALTIME LEADERBOARD
// ==========================================

let leaderboardRealtimeChannel = null;

function setupLeaderboardRealtime() {
    // Hapus subscription lama jika sudah ada
    if (leaderboardRealtimeChannel) {
        supabaseClient.removeChannel(
            leaderboardRealtimeChannel
        );
    }

    leaderboardRealtimeChannel =
        supabaseClient
            .channel("leaderboard-realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "leaderboard"
                },
                async (payload) => {
                    console.log(
                        "🔥 Score baru masuk:",
                        payload.new
                    );

                    // Update leaderboard berdasarkan screen
                    await refreshVisibleLeaderboards();
                }
            )
            .subscribe((status) => {
                console.log(
                    "Leaderboard Realtime:",
                    status
                );
            });
}


// ==========================================
// REFRESH LEADERBOARD YANG SEDANG TERLIHAT
// ==========================================

async function refreshVisibleLeaderboards() {

    // HOME
    if (
        homeScreen &&
        homeScreen.style.display !== "none"
    ) {
        await showHomeLeaderboards();
    }

    // GAME
    if (
        gameScreen &&
        gameScreen.style.display !== "none"
    ) {
        await showGameLeaderboard();
    }

    // FULL LEADERBOARD
    if (
        leaderboardScreen &&
        leaderboardScreen.style.display !== "none"
    ) {
        await showFullLeaderboard();
    }
}

/* =========================================================
   HOME ONLINE LEADERBOARD
========================================================= */

async function showHomeLeaderboards() {

    homeLeaderboard30.innerHTML =
        "<li>Loading...</li>";


    homeLeaderboard60.innerHTML =
        "<li>Loading...</li>";


    const scores30 =
        await getOnlineLeaderboard(
            30
        );


    const scores60 =
        await getOnlineLeaderboard(
            60
        );


    /* =========================
       30 SECONDS
    ========================= */

    homeLeaderboard30.innerHTML =
        "";


    if (
        scores30.length === 0
    ) {

        const li =
            document.createElement(
                "li"
            );


        li.textContent =
            "No scores yet";


        homeLeaderboard30.appendChild(
            li
        );

    } else {

        scores30
            .slice(0, 5)
            .forEach(
                (
                    player,
                    index
                ) => {

                    const li =
                        document.createElement(
                            "li"
                        );


                    li.textContent =
                        `${index + 1}. ${player.player_name} - ${player.score}`;


                    homeLeaderboard30.appendChild(
                        li
                    );

                }
            );

    }


    /* =========================
       60 SECONDS
    ========================= */

    homeLeaderboard60.innerHTML =
        "";


    if (
        scores60.length === 0
    ) {

        const li =
            document.createElement(
                "li"
            );


        li.textContent =
            "No scores yet";


        homeLeaderboard60.appendChild(
            li
        );

    } else {

        scores60
            .slice(0, 5)
            .forEach(
                (
                    player,
                    index
                ) => {

                    const li =
                        document.createElement(
                            "li"
                        );


                    li.textContent =
                        `${index + 1}. ${player.player_name} - ${player.score}`;


                    homeLeaderboard60.appendChild(
                        li
                    );

                }
            );

    }

}


/* =========================================================
   GAME ONLINE LEADERBOARD
========================================================= */

async function showGameLeaderboard() {

    gameLeaderboardList.innerHTML =
        "<li>Loading...</li>";


    gameLeaderboardTitle.textContent =
        currentDuration === 30
            ? "🏆 30 SEC LEADERBOARD"
            : "⚡ 60 SEC LEADERBOARD";


    const scores =
        await getOnlineLeaderboard(
            currentDuration
        );


    gameLeaderboardList.innerHTML =
        "";


    if (
        scores.length === 0
    ) {

        const li =
            document.createElement(
                "li"
            );


        li.textContent =
            "No scores yet";


        gameLeaderboardList.appendChild(
            li
        );


        return;

    }


    scores
        .slice(0, 5)
        .forEach(
            (
                player,
                index
            ) => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    `${index + 1}. ${player.player_name} - ${player.score}`;


                gameLeaderboardList.appendChild(
                    li
                );

            }
        );

}


/* =========================================================
   FULL LEADERBOARD
========================================================= */

async function showLeaderboard() {

    hideAllScreens();


    leaderboardScreen.style.display =
        "flex";


    leaderboard.innerHTML =
        "<li>Loading...</li>";


    const scores =
        await getOnlineLeaderboard(
            currentDuration
        );


    leaderboard.innerHTML =
        "";


    if (
        scores.length === 0
    ) {

        const li =
            document.createElement(
                "li"
            );


        li.textContent =
            "No scores yet";


        leaderboard.appendChild(
            li
        );


        return;

    }


    scores.forEach(
        (
            player,
            index
        ) => {

            const li =
                document.createElement(
                    "li"
                );


            li.textContent =
                `${index + 1}. ${player.player_name} - ${player.score}`;


            leaderboard.appendChild(
                li
            );

        }
    );

}


/* =========================================================
   PLAY AGAIN
========================================================= */

playAgain.addEventListener(
    "click",
    () => {

        if (
            lastGameMode ===
            "solo"
        ) {

            hideAllScreens();


            soloMenu.style.display =
                "flex";


            return;

        }


        if (
            lastGameMode ===
            "versus"
        ) {

            startVersusGame();

        }

    }
);


/* =========================================================
   VERSUS START
========================================================= */

btnVersusStart.addEventListener(
    "click",
    () => {

        startVersusGame();

    }
);


/* =========================================================
   START VERSUS GAME
========================================================= */

function startVersusGame() {

    clearInterval(timer);


    lastGameMode =
        "versus";


    player1Score =
        0;


    player2Score =
        0;


    versusRunning =
        true;


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


/* =========================================================
   VERSUS QUESTION
========================================================= */

function showVersusQuestion(
    question
) {

    player1Question.textContent =
        `${question.number1} ${question.operator} ${question.number2} = ?`;


    player2Question.textContent =
        `${question.number1} ${question.operator} ${question.number2} = ?`;


    player1Choices.innerHTML =
        "";


    player2Choices.innerHTML =
        "";


    let answered =
        false;


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


        answered =
            true;


        const buttons1 =
            player1Choices.querySelectorAll(
                "button"
            );


        const buttons2 =
            player2Choices.querySelectorAll(
                "button"
            );


        buttons1.forEach(
            button => {

                button.disabled =
                    true;

            }
        );


        buttons2.forEach(
            button => {

                button.disabled =
                    true;

            }
        );


        const isCorrect =
            choice ===
            question.answer;


        /* =========================
           CORRECT
        ========================= */

        if (
            isCorrect
        ) {

            clickedButton.classList.add(
                "correct"
            );


            if (
                player === 1
            ) {

                player1Score++;


                player1ScoreElement.textContent =
                    `Score: ${player1Score}`;

            } else {

                player2Score++;


                player2ScoreElement.textContent =
                    `Score: ${player2Score}`;

            }


        } else {

            /* =========================
               WRONG
            ========================= */

            clickedButton.classList.add(
                "wrong"
            );


            const allButtons = [

                ...buttons1,

                ...buttons2

            ];


            allButtons.forEach(
                button => {

                    if (
                        Number(
                            button.textContent
                        ) ===
                        question.answer
                    ) {

                        button.classList.add(
                            "show-correct"
                        );

                    }

                }
            );


            if (
                player === 1
            ) {

                player2Score++;


                player2ScoreElement.textContent =
                    `Score: ${player2Score}`;

            } else {

                player1Score++;


                player1ScoreElement.textContent =
                    `Score: ${player1Score}`;

            }

        }


        /* =========================
           NEXT QUESTION
        ========================= */

        setTimeout(
            () => {

                if (
                    !versusRunning
                ) {

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

            },
            700
        );

    }


    /* =========================
       CREATE ANSWERS
    ========================= */

    question.choices.forEach(
        choice => {

            /* PLAYER 1 */

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
                        1,
                        button1
                    );

                }
            );


            player1Choices.appendChild(
                button1
            );


            /* PLAYER 2 */

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
                        2,
                        button2
                    );

                }
            );


            player2Choices.appendChild(
                button2
            );

        }
    );

}


/* =========================================================
   COMBO
========================================================= */

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


/* =========================================================
   BONUS MESSAGE
========================================================= */

function showBonus(
    message
) {

    bonusMessage.textContent =
        message;


    bonusMessage.classList.remove(
        "show"
    );


    void bonusMessage.offsetWidth;


    bonusMessage.classList.add(
        "show"
    );


    setTimeout(
        () => {

            bonusMessage.classList.remove(
                "show"
            );

        },
        1000
    );

}


/* =========================================================
   END VERSUS GAME
========================================================= */

function endVersusGame() {

    versusRunning =
        false;


    stopMusic();


    versusScreen.style.display =
        "none";


    gameOverScreen.style.display =
        "flex";


    soloSaveArea.style.display =
        "none";


    if (
        player1Score >= 10
    ) {

        finalScore.textContent =
            `PLAYER 1 WINS! ${player1Score} - ${player2Score}`;

    } else {

        finalScore.textContent =
            `PLAYER 2 WINS! ${player2Score} - ${player1Score}`;

    }

}


/* =========================================================
   START GAME
========================================================= */

showHome();