

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
        <p id="points">0p</p>
    `
    quizNav.appendChild(pointsCon);
}

export function renderRanking (parentElement, rightAnswer) {

    let title = document.createElement("h3");
    let score = document.createElement("h1");
    score.classList.add("score");

    let answer = player.latestAnswer;

    if (answer === rightAnswer) {
        parentElement.style.backgroundColor = "var(--success)";
        title.textContent = "You're Right!";
        title.classList.add("correct");
    } else {
        parentElement.style.backgroundColor = "var(--error)";
        title.textContent = "Wrong Answer!";
        title.classList.add("wrong");
    }

    parentElement.appendChild(title);
    parentElement.appendChild(score);

    // score.textContent = isCorrect ? "+80 Points" : "-50 Points";

    renderScoreBoard(parentElement);

    if (isCorrect) {
        startConfetti();
    }
}