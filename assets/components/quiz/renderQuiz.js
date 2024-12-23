import { ws } from "../../index.js";
// deno run -A --watch server.js

export function renderQuizNav (parentElement) {
    parentElement.innerHTML = ``;

    let player = JSON.parse( localStorage.getItem("player") );

    let quizNav = document.createElement("div");
    quizNav.id = "quizNav";
    parentElement.appendChild(quizNav);

    quizNav.innerHTML = `
        <div class="homeButtonContainer">
            <img src="/static/media/icons/back.svg" class="homeButton">
        </div>
        <div class="pointsCon">
            <h4>${player.emoji}</h4>
            <p id="points">0p</p>
        </div>
    `

    const homeButtonContainer = parentElement.querySelector(".homeButtonContainer");
    homeButtonContainer.addEventListener("click", () => {
        const wrapper = document.querySelector("#wrapper");
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.innerHTML = `
            <div class="middlePopup">
                <img src="/static/media/icons/close.svg" class="closeButton">
                <h3 class="leaveTitle">Leave Quiz?</h3>
                <div class="leaveOptionsContainer">
                    <div class="leaveQuizYes">
                        <p>Yes</p>
                    </div>
                    <div class="leaveQuizNo">
                        <p>No</p>
                    </div>
                </div>
            </div>
        `;
        wrapper.appendChild(overlay);
    
        overlay.addEventListener("click", () => overlay.remove());
        const popup = overlay.querySelector(".middlePopup");
        popup.addEventListener("click", (event) => event.stopPropagation());
        const closeButton = overlay.querySelector(".closeButton");
        closeButton.addEventListener("click", () => overlay.remove());
    
        overlay.querySelector(".leaveQuizYes").addEventListener("click", () => {
            wrapper.innerHTML = "";
            renderStart(wrapper);
        });
        overlay.querySelector(".leaveQuizNo").addEventListener("click", () => overlay.remove());
    });
}

export function renderQuizHeader (parentElement, data) {
    let game = data.game;
    let header = document.createElement("div");
    let genre = game.genre.charAt(0).toUpperCase() + game.genre.slice(1);
    header.id = "quizHeader";
    parentElement.appendChild(header);

    let headerText = document.createElement("div");
    headerText.innerHTML = `
        <h1>${game.century}´s <br> ${genre}</h1>
    `;
    header.appendChild(headerText);
}

export function renderQuizCounter (parentElement, question) {
    let counterCon = document.createElement("div");
    counterCon.id = "counterCon";
    parentElement.appendChild(counterCon);
    
    counterCon.innerHTML = `
        <img class="gif" src="/static/media/images/vinyl.gif"/>
        <h2>Quiz starts in</h2>
        <h1 id="countdownNumber">3</h1>
    `

    // För att testa
    let questionData = {
        question: "We don’t need no education, we don’t need no thought control...",
        options: [
            "No dark sarcasm in the classroom.",
            "No fear, no pain.",
            "Just leave us alone.",
            "Just give us something to sing.",
        ],
        correct: "No dark sarcasm in the classroom.",
    };

    // Ska räkna ner till 1 och sen kommer frågan 

    let countdownNumber = counterCon.querySelector("#countdownNumber");
    let countdownValue = 3;

    let countdownInterval = setInterval(() => {
        countdownNumber.textContent = countdownValue;
        countdownValue--;

        if (countdownValue < 0) {
            renderQuizQuestion(wrapper, question);
            clearInterval(countdownInterval);
            counterCon.remove();
        }
    }, 1000);
}


export function renderQuizQuestion (parentElement, question) {
    question = question.question;

    console.log(question);
    const quizContent = document.createElement("div");
    quizContent.id = "quizContent";
    parentElement.appendChild(quizContent);

    // sålänge
    quizContent.innerHTML = ` 
        <div id="questionProgress">
            <p>1 / 20</p>
        </div>
        <div id="questionText">
            <p>${question.question}</p>
        </div>
        <div id="progressBarContainer">
            <div id="progressBar"></div>
        </div>
        <div id="optionsContainer">
            <button class="optionButton"><p>${question.options[0]}</p></button>
            <button class="optionButton"><p>${question.options[1]}</p></button>
            <button class="optionButton"><p>${question.options[2]}</p></button>
            <button class="optionButton"><p>${question.options[3]}</p></button>
        </div>
    `;

    const progressBar = quizContent.querySelector("#progressBar");
    progressBar.style.width = "100%";
    progressBar.offsetWidth;
    setTimeout(() => {
        progressBar.style.width = "0%";
    }, 0);

    //-------------------------TIMER END EVENT----------------------------------
    progressBar.addEventListener('transitionend', () => {
        if (progressBar.style.width === "0%") {
            eventTriggered = true;
            let player = JSON.parse( localStorage.getItem("player") );
            let code = localStorage.getItem("code");
            let data = {player, code};
            ws.send(JSON.stringify({ event: "timeIsUp", data }));
        }
    });

    const optionButtons = quizContent.querySelectorAll(".optionButton");
    let eventTriggered = false;

    optionButtons.forEach(button => {
        button.addEventListener("click", function giveAnswer (event) {
        if (eventTriggered) return;

        optionButtons.forEach(button => button.classList.remove("clickedOptionButton"));

        button.classList.add("clickedOptionButton");

        let prog = document.getElementById("progressBar");

        let computedWidth = getComputedStyle(prog).width;
        let timeLeft = computedWidth.replace("px", "");

        let player = JSON.parse( localStorage.getItem("player") );

        let answer = event.currentTarget.textContent;

        let question = document.getElementById("questionText").textContent;

        let data = { 
            code: localStorage.getItem("code"), 
            player: player, 
            answer: answer, 
            question: question,
            timeLeft: timeLeft
        }
        
        eventTriggered = true;

        ws.send(JSON.stringify({ event: "answerGiven", data }));
            /*
            const selectedOption = questionData.options[index];
            const correctAnswer = selectedOption === questionData.correct;

            if (correctAnswer) {
                console.log("Correct!");
            } else {
                console.log("Wrong answer!");
            }
            */

        });
    });
}