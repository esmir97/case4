import { startConfetti } from "../correctAnswer/renderCorrectAnswer.js";

export function renderFinalScore (parentElement) {
    // Header
    let header = document.createElement("h1");
    header.textContent = "FINAL SCORE";
    header.classList.add("scoreHeader");
    parentElement.appendChild(header);

    // Podium
    // Ska ändras till rätt spelare 
    let podiumContainer = document.createElement("div");
    podiumContainer.id = "podiumContainer";

    let crown = document.createElement("img");
    crown.id = "crown";
    crown.src = "/static/media/icons/crown.svg";
    podiumContainer.appendChild(crown);

    for (let i = 1; i <= 3; i++) {
        let podiumDiv = document.createElement("div");
        podiumDiv.classList.add("podiumDiv");
        
        if (i === 1) {
            podiumDiv.classList.add("first");
        } else if (i === 2) {
            podiumDiv.classList.add("second");
        } else {
            podiumDiv.classList.add("third");
        }
    
        podiumDiv.innerHTML = `
            <p class="podiumEmoji">🤓</p>
            <p>Dumbledork</p>
            <p>1850</p>
            <div class="position position-${i}">
                <h4>${i}</h4>
            </div>
        `;

        podiumContainer.appendChild(podiumDiv);
    }

    parentElement.appendChild(podiumContainer);

    // Scoreboard

    let scoreBoard = document.createElement("div");
    scoreBoard.id = "scoreBoard";
    parentElement.appendChild(scoreBoard);

    // Final placement

    let finalPlacement = document.createElement("div");
    finalPlacement.id = "finalPlacement";
    finalPlacement.innerHTML = `
        <p>Good Job!</p>
        <p>You finished in ... place!</p>
    `;
    parentElement.appendChild(finalPlacement);

    let nextButton = document.createElement("button");
    nextButton.id = "nextButton";
    nextButton.innerHTML = `
        <p>Next</p>
        <img class="nextIcon" src="/static/media/icons/nextWhite.png"/>
    `;
    parentElement.appendChild(nextButton);

    startConfetti()
}