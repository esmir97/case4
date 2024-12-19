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

    let finalPlayers = [
        { emoji: "🤓", name: "Dumbledork", score: 1850 },
        { emoji: "🔥", name: "HotShot", score: 1700 },
        { emoji: "🎵", name: "Melody", score: 1650 },
        { emoji: "💪", name: "Muscle", score: 1600 },
        { emoji: "⚡", name: "Spark", score: 1550 },
        { emoji: "🎨", name: "Artist", score: 1500 },
        { emoji: "🚀", name: "Rocket", score: 1450 },
        { emoji: "👑", name: "Royalty", score: 1400 },
    ];

    let finalScoreboard = document.createElement("div");
    finalScoreboard.id = "finalScoreboard";
    parentElement.appendChild(finalScoreboard);

    let finalScoreboardTitle = document.createElement("h3");
    finalScoreboardTitle.textContent = "Scoreboard";
    finalScoreboard.appendChild(finalScoreboardTitle);

    let finalListContainer = document.createElement("ol");
    finalScoreboard.appendChild(finalListContainer);

    finalPlayers.forEach((player, index) => {
        let finalListItem = document.createElement("div");
        finalListItem.classList.add("finalListItem");
        finalListItem.innerHTML = `
            <p>${index + 1}.</p>
            <p>${player.emoji}</p> 
            <p>${player.name}</p>
            <p>${player.score}</p>
        `;

        finalListContainer.appendChild(finalListItem);
    });
    
    // Final Placement

    let finalPlacement = document.createElement("h4");
    finalPlacement.innerHTML = `Good Job! <br class="break"> You finished in ...`;
                                
    finalPlacement.classList.add("finalPlacement");
    parentElement.appendChild(finalPlacement);

    // Next Button

    let nextButton = document.createElement("button");
    nextButton.id = "nextButton";
    nextButton.innerHTML = `
        <p>Next</p>
        <img class="nextIcon" src="/static/media/icons/next.svg"/>
    `;
    parentElement.appendChild(nextButton);

    startConfetti()
}