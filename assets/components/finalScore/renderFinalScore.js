
export function renderFinalScore (parentElement) {
    let header = document.createElement("h1");
    header.textContent = "FINAL SCORE";
    parentElement.appendChild(header);

    let podiumContainer = document.createElement("div");
    podiumContainer.id = "podiumContainer";

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
            <p>🤓</p>
            <p>Dumbledork</p>
            <p>1850</p>
            <p>${i}</p>
        `;

        podiumContainer.appendChild(podiumDiv);
    }

    parentElement.appendChild(podiumContainer);

    // Scoreboard



}