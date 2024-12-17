// deno run -A --watch server.js

export function renderQuizNav (parentElement) {
    let quizNav = document.createElement("div");
    quizNav.id = "quizNav";
    parentElement.appendChild(quizNav);

    let exitButton = document.createElement("button");
    quizNav.appendChild(exitButton);
    // exitButton.addEventListener... 

    // sålänge
    let pointsCon = document.createElement("div");
    pointsCon.innerHTML = `
        <h4>🤓</h4>
        <p id="points">235p</p>
    `
    quizNav.appendChild(pointsCon);
}

export function renderQuizHeader (parentElement) {
    let header = document.createElement("div");
    header.id = "quizHeader";
    parentElement.appendChild(header);

    let headerText = document.createElement("h1");
    headerText.textContent = "Finish the lyrics!"; // sålänge 
    header.appendChild(headerText);
}

/*

export function renderQuizCounter (parentElement) {
    const counterCon = document.createElement("div");
    counterCon.id = "counterCon";
    parentElement.appendChild(counterCon);
    
    counterCon.innerHTML = `
        <img class="gif" src="/static/media/images/vinyl.gif"/>
        <h2>Quiz starts in</h2>
        <h1 id="countdownNumber">3</h1>
    `

    // För att testa
    const questionData = {
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

    const countdownNumber = counterCon.querySelector("#countdownNumber");
    let countdownValue = 3;

    const countdownInterval = setInterval(() => {
        countdownNumber.textContent = countdownValue;
        countdownValue--;

        if (countdownValue < 0) {
            clearInterval(countdownInterval);
            counterCon.remove();
        }
    }, 1000);

}

*/

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
            <p>We don’t need no education, we don’t need no thought control...</p>
        </div>
        <div id="progressBarContainer">
            <div id="progressBar"></div>
        </div>
        <div id="optionsContainer">
            <button class="optionButton">No dark sarcasm in the classroom.</button>
            <button class="optionButton">No fear, no pain.</button>
            <button class="optionButton">Just leave us alone.</button>
            <button class="optionButton">Just give us something to sing.</button>
        </div>
    `;

    const progressBar = quizContent.querySelector("#progressBar");
    progressBar.style.transition = "width 20s linear";
    progressBar.style.width = "100%";
    setTimeout(() => {
        progressBar.style.width = "0%";
    }, 0);

    /*
    const optionButtons = quizContent.querySelectorAll(".optionButton");
    optionButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const selectedOption = questionData.options[index];
            const isCorrect = selectedOption === questionData.correct;

            if (isCorrect) {
                console.log("Correct!");
            } else {
                console.log("Wrong answer!");
            }
        });
    });
    */
}