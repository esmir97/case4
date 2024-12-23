
export function renderEnding (parentElement) {
    parentElement.innerHTML = "";

    let container = document.createElement("div");
    container.classList.add("endingContainer");

    container.innerHTML = `
        <h2 class="endingTitle">Want to Play Again?</h2>
        <h4 class="h4-bold">Our Most Popular Quizzes:</h4>
        <p class="infoText">Wait for the moderator to start a new quiz!</p>
        <div class="popularContainer"></div>
        <div class="divider"></div>
        <div class="homeButtonWrap">
            <p>Home</p>
        </div>
    `;
    parentElement.appendChild(container);

    // Rendera rekommenderade quiz
    let quizContainer = document.querySelector(".popularContainer");
    let suggestedGenres = ["Country", "Hiphop", "Jazz", "Pop"];
    renderGenresEnding(quizContainer, suggestedGenres);
    

    // Hemknapp 
    let homeButton = document.querySelector(".homeButtonWrap");
    homeButton.addEventListener("click", () => {
        // Funktioner för hemknappen
    });
};

function renderGenresEnding(parentElement, allGenres) {
    for (let genre of allGenres) {
        const div = document.createElement("div");
        div.id = genre;
        div.classList.add("genre");
        div.innerHTML = `
            <div class="genreImg">
                <img src="/static/media/images/${genre}.jpg">
            </div>
            <div class="genreText">
                <p class="p-bold">${genre}</p>
            </div>
        `;
        parentElement.appendChild(div);
    }
}