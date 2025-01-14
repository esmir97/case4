import { getWebSocket } from "../../index.js";
import * as common from '../common/common.js';

// deno run -A --watch server.js


export function renderQuizHeader (parentElement, data) {

    let wrapper = document.getElementById("wrapper");
    let confetti = document.getElementById("confetti");

    if (wrapper.style.backgroundColor == 'var(--success)' || wrapper.style.backgroundColor == 'var(--error)') {
        wrapper.style.backgroundColor = '';
    }

    if (confetti) {
        confetti.remove();
    }

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

export function renderQuizCounter (parentElement, data) {
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
            console.log(data);
            renderQuizQuestion(wrapper, data);
            clearInterval(countdownInterval);
            counterCon.remove();
        }
    }, 1000);
}


export function renderQuizQuestion (parentElement, data) {
    const ws = getWebSocket();
    console.log(data);
    let question = data.question;
    let questionIndex = data.questionIndex;
    console.log(question);
    console.log(questionIndex);

    const quizContent = document.createElement("div");
    quizContent.id = "quizContent";
    parentElement.appendChild(quizContent);

    
        for (let i = question.options.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
    
            [question.options[i], question.options[randomIndex]] = [question.options[randomIndex], question.options[i]];
        }
        
    

    // sålänge
    quizContent.innerHTML = ` 
        <div id="questionProgress">
            <p>${questionIndex + 1} / 20</p>
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
        <div class="quizInfoText">
            <p><b>Remember</b>: One pick, no take-backs!</p>
            <p>Speed is key: the faster you lock it in, the more points you get!<p>
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