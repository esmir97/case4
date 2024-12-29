import * as common from "../common/common.js";
import { ws } from "../../index.js"; 

// Nav

export function renderRanking (parentElement, game, questionAnswered) { /*rightAnswer*/
  let answer = localStorage.getItem("answerGiven");
  let pointsEarned = localStorage.getItem("pointsEarned");
  let players = game.players;
  let playerID = JSON.parse( localStorage.getItem("player") ).id;

  console.log(game);

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
        score.textContent = "+" + pointsEarned;
        common.startConfetti();
    } else {
        parentElement.style.backgroundColor = "var(--error)";
        title.textContent = "Wrong Answer!";
        title.classList.add("wrong");
        score.textContent = "0 Points"
    }

    let correctAnswer = document.createElement("h4");
    correctAnswer.innerHTML = `${questionAnswered.correct} <br class="break"> is the correct answer!` //lägg till backtic literals här med rätt fråga som text ${}
    correctAnswer.classList.add("correctAnswer");
    parentElement.appendChild(correctAnswer);

    // Scoreboard

    let scoreboard = document.createElement("div");
    scoreboard.id = "scoreboard";
    parentElement.appendChild(scoreboard);

    let scoreBoardTitle = document.createElement("h3");
    scoreBoardTitle.textContent = "Scoreboard";
    scoreboard.appendChild(scoreBoardTitle);

    let listCon = document.createElement("ol");
    scoreboard.appendChild(listCon);

    for (let i = 0; i < 3 && i < players.length ; i++) {
        let listItem = document.createElement("div");
        listItem.classList.add("listItem");
        listItem.innerHTML = `
            <p>${i + 1}.</p>
            <p>${players[i].emoji}</p> 
            <p>${players[i].name}</p>
            <p>${players[i].points}</p>
        `;

      listCon.appendChild(listItem);
    };

    let pointsBehind = 0;
    let playerAhead = null;

    for (let i = 0; i < players.length; i++) {
      if (players[i].id == playerID && i !== 0) {
        pointsBehind = players[i - 1].points - players[i].points;
        playerAhead = players[i - 1].name;
      }
    }

    let myIndex = players.findIndex((player) => player.id == playerID);

    let myPlaceAndSuffix = getOrdinalSuffix(myIndex + 1);

    let currentPlacement = document.createElement("h4");


    if (myIndex == 0) {
      currentPlacement.innerHTML = `You're in first place!! Good job, keep it up!`;
    } else {
      currentPlacement.innerHTML = `You're in ${myPlaceAndSuffix} place <br class="break"> only ${pointsBehind} points behind ${playerAhead}`;   //använda <br>?
    }
                                
    currentPlacement.classList.add("currentPlacement");
    parentElement.appendChild(currentPlacement);

    /* setTimeout(() => { 
      ws.send(JSON.stringify({ event: "continueQuiz", data: game.code }));
    }, 10000); */
}

export function getOrdinalSuffix(num) {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return `${num}th`;
  }

  switch (lastDigit) {
      case 1:
          return `${num}st`;
      case 2:
          return `${num}nd`;
      case 3:
          return `${num}rd`;
      default:
          return `${num}th`;
  }
}