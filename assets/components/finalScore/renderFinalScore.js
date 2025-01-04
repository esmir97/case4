import * as common from "../common/common.js";
import { getOrdinalSuffix } from "../ranking/renderRanking.js";
import { renderEnding } from "../ending/ending.js";
import { renderStart } from "../home/renderHome.js";
import { getWebSocket } from "../../logic/client.js";


export function renderFinalScore (parentElement, data) {
    const ws = getWebSocket();

    // Header
    let code = data.code;
    let game = data.game;

    parentElement.innerHTML = ``;
    let header = document.createElement("div");
    header.id = "finalHeader";
    parentElement.appendChild(header);

    header.innerHTML = `
        <div class="homeButtonContainer">
            <img src="/static/media/icons/back.svg" class="homeButton">
        </div>
        <h1>FINAL SCORE</h1>
    `;

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
            ws.send(JSON.stringify({ event: "playerLeft", data: { code: localStorage.getItem("code"), player: player }}));
            renderStart(wrapper);
        });
        overlay.querySelector(".leaveQuizNo").addEventListener("click", () => overlay.remove());
    });

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
        
        if (!game.players[i - 1]) {
          break;
        }

        if (i === 1) {
            podiumDiv.classList.add("first");
        } else if (i === 2) {
            podiumDiv.classList.add("second");
        } else if (i === 3) {
            podiumDiv.classList.add("third");
        }
    
        podiumDiv.innerHTML = `
            <p class="podiumEmoji">${game.players[i - 1].emoji}</p>
            <p>${game.players[i - 1].name}</p>
            <p>${game.players[i - 1].points}</p>
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

    game.players.forEach((player, index) => {
        let finalListItem = document.createElement("div");
        finalListItem.classList.add("finalListItem");
        finalListItem.innerHTML = `
            <p>${index + 1}.</p>
            <p>${player.emoji}</p> 
            <p>${player.name}</p>
            <p>${player.points}</p>
        `;

        finalListContainer.appendChild(finalListItem);
    });
    
    // Final Placement

    let playerID = localStorage.getItem("id");
    let playerIndex = game.players.findIndex( (player) => {
      return player.id == playerID;
    })

    let playerPosition = getOrdinalSuffix(playerIndex + 1);

    let finalPlacement = document.createElement("h4");
    finalPlacement.innerHTML = `Good Job! <br class="break"> You finished in ${playerPosition} place`;
                                
    finalPlacement.classList.add("finalPlacement");
    parentElement.appendChild(finalPlacement);

    // Next Button

    let nextButton = document.createElement("button");
    nextButton.id = "nextButton";
    nextButton.innerHTML = `
        <p>Back to Home</p>
        
    `; // <img class="nextIcon" src="/static/media/icons/next.svg"/>
    parentElement.appendChild(nextButton);

    common.startConfetti();

    nextButton.addEventListener("click", () => {
      let wrapper = document.getElementById("wrapper");
      renderStart(wrapper);
    });
}

// CONFETTI

function startConfetti() {

    var random = Math.random,
      cos = Math.cos,
      sin = Math.sin,
      PI = Math.PI,
      PI2 = PI * 2,
      timer = undefined,
      frame = undefined,
      confetti = [];
  
    var particles = 10,
      spread = 40,
      sizeMin = 3,
      sizeMax = 12 - sizeMin,
      eccentricity = 10,
      deviation = 100,
      dxThetaMin = -.1,
      dxThetaMax = -dxThetaMin - dxThetaMin,
      dyMin = .13,
      dyMax = .18,
      dThetaMin = .4,
      dThetaMax = .7 - dThetaMin;
  
    var colorThemes = [
      function() {
        return color(200 * random() | 0, 200 * random() | 0, 200 * random() | 0);
      },
      function() {
        var black = 200 * random() | 0;
        return color(200, black, black);
      }
    ];
  
    function color(r, g, b) {
      return 'rgb(' + r + ',' + g + ',' + b + ', 0.6)';
    }
  
    function interpolation(a, b, t) {
      return (1 - cos(PI * t)) / 2 * (b - a) + a;
    }
  
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '0';
    container.style.overflow = 'visible';
    container.style.zIndex = '1';
  
    function Confetto(theme) {
      this.frame = 0;
      this.outer = document.createElement('div');
      this.inner = document.createElement('div');
      this.outer.appendChild(this.inner);
  
      var outerStyle = this.outer.style,
        innerStyle = this.inner.style;
      outerStyle.position = 'absolute';
      outerStyle.width = (sizeMin + sizeMax * random()) + 'px';
      outerStyle.height = (sizeMin + sizeMax * random()) + 'px';
      innerStyle.width = '100%';
      innerStyle.height = '100%';
      innerStyle.backgroundColor = theme();
  
      this.x = window.innerWidth * random();
      this.y = -deviation;
      this.dx = sin(dxThetaMin + dxThetaMax * random());
      this.dy = dyMin + dyMax * random();
  
      this.update = function(height, delta) {
        this.frame += delta;
        this.x += this.dx * delta;
        this.y += this.dy * delta;
        outerStyle.left = this.x + 'px';
        outerStyle.top = this.y + 'px';
        return this.y > height + deviation;
      };
    }
  
    function poof() {
      document.body.appendChild(container);
      var theme = colorThemes[0];
      (function addConfetto() {
        var confetto = new Confetto(theme);
        confetti.push(confetto);
        container.appendChild(confetto.outer);
        timer = setTimeout(addConfetto, spread * random());
      })(0);
  
      requestAnimationFrame(function loop(timestamp) {
        var delta = 16;
        var height = window.innerHeight;
  
        for (var i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }
  
        if (timer || confetti.length) requestAnimationFrame(loop);
        else document.body.removeChild(container);
      });
    }
  
    poof();
  }