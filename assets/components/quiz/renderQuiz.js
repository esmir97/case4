// deno run -A --watch server.js

export function renderQuizNav (parentElement) {
    parentElement.innerHTML = ``;

    let quizNav = document.createElement("div");
    quizNav.id = "quizNav";
    parentElement.appendChild(quizNav);

    quizNav.innerHTML = `
        <div class="homeButtonContainer">
            <img src="/static/media/icons/back.svg" class="homeButton">
        </div>
        <div class="pointsCon">
            <h4>🤓</h4>
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

export function renderQuizHeader (parentElement, /* year and genre */) {
    let header = document.createElement("div");
    header.id = "quizHeader";
    parentElement.appendChild(header);

    let headerText = document.createElement("div");
    headerText.innerHTML = `
        <h1>Year <br> Genre</h1>
    `;
    header.appendChild(headerText);
}

export function renderQuizCounter (parentElement) {
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
            renderQuizQuestion(wrapper);
            clearInterval(countdownInterval);
            counterCon.remove();
        }
    }, 1000);
}


export function renderQuizQuestion (parentElement) {
    const quizContent = document.createElement("div");
    quizContent.id = "quizContent";
    parentElement.appendChild(quizContent);

    // sålänge
    quizContent.innerHTML = ` 
        <div id="questionProgress">
            <p>1 / 20</p>
        </div>
        <div id="questionText">
            <p>We don’t need no education, we don’t need no thought control...We don’t need no education, we don’t need no thought control...</p>
        </div>
        <div id="progressBarContainer">
            <div id="progressBar"></div>
        </div>
        <div id="optionsContainer">
            <button class="optionButton"><p>No dark sarcasm in the classroom.</p></button>
            <button class="optionButton"><p>No fear, no pain.</p></button>
            <button class="optionButton"><p>Just leave us alone.</p></button>
            <button class="optionButton"><p>Just give us something to sing.</p></button>
        </div>
    `;

    const progressBar = quizContent.querySelector("#progressBar");
    progressBar.style.width = "100%";
    progressBar.offsetWidth;
    setTimeout(() => {
        progressBar.style.width = "0%";
    }, 0);

    const optionButtons = quizContent.querySelectorAll(".optionButton");
    optionButtons.forEach(button => {
        button.addEventListener("click", () => {

        optionButtons.forEach(button => button.classList.remove("clickedOptionButton"));

        button.classList.add("clickedOptionButton");
            
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