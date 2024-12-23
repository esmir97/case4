import * as common from "../common/common.js";

// Nav

let parentElement = document.querySelector("#wrapper");
common.renderQuizNav(parentElement);

export function renderRanking (parentElement, game) { /*rightAnswer*/
  let answer = localStorage.getItem("answerGiven");

  console.log(answer);
  console.log(answer == "true");
  console.log(answer == "false");

    parentElement.innerHTML = ``;
    
    // Text

    let topContainer = document.createElement("div");
    topContainer.id = "topContainer";
    parentElement.appendChild(topContainer);

    let title = document.createElement("h3");
    title.classList.add("rankingTitle");
    let score = document.createElement("h1");
    score.classList.add("rankingScore");
    topContainer.appendChild(title);
    topContainer.appendChild(score);

    // let answer = player.latestAnswer;

    if (answer == "true") { /*rightAnswer*/
        parentElement.style.backgroundColor = "var(--success)";
        title.textContent = "You're Right!";
        title.classList.add("correct");
        score.textContent = "+80 Points"
        common.startConfetti();
    } else {
        parentElement.style.backgroundColor = "var(--error)";
        title.textContent = "Wrong Answer!";
        title.classList.add("wrong");
        score.textContent = "0 Points"
    }

    let correctAnswer = document.createElement("h4");
    correctAnswer.innerHTML = `blablabla <br class="break"> is the correct answer!` //lägg till backtic literals här med rätt fråga som text ${}
    correctAnswer.classList.add("correctAnswer");
    parentElement.appendChild(correctAnswer);

    // Scoreboard

    let players = [
        { emoji: "🤓", name: "Dumbledork", score: 1850 },
        { emoji: "🔥", name: "HotShot", score: 1700 },
        { emoji: "🎵", name: "Melody", score: 1650 },
    ];

    let scoreboard = document.createElement("div");
    scoreboard.id = "scoreboard";
    parentElement.appendChild(scoreboard);

    let scoreBoardTitle = document.createElement("h3");
    scoreBoardTitle.textContent = "Scoreboard";
    scoreboard.appendChild(scoreBoardTitle);

    let listCon = document.createElement("ol");
    scoreboard.appendChild(listCon);

    players.forEach((player, index) => {
        let listItem = document.createElement("div");
        listItem.classList.add("listItem");
        listItem.innerHTML = `
            <p>${index + 1}.</p>
            <p>${player.emoji}</p> 
            <p>${player.name}</p>
            <p>${player.score}</p>
        `;

      listCon.appendChild(listItem);
    });

    let currentPlacement = document.createElement("h4");
    currentPlacement.innerHTML = `You're in ... place <br class="break"> only ... point behind ...`;   //använda <br>?
                                
    currentPlacement.classList.add("currentPlacement");
    parentElement.appendChild(currentPlacement);
}