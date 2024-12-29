import { renderStart } from "../home/renderHome.js";
import { ws } from "../../index.js";

// Hanterar hur Popups Stängs
export function handlePopup() {
    const overlay = document.querySelector(".overlay");
    const popup = overlay.querySelector(".middlePopup");

    popup.addEventListener("click", (event) => event.stopPropagation());
    overlay.addEventListener("click", () => overlay.remove());
    overlay.querySelector(".closeButton").addEventListener("click", () => overlay.remove());

    // Om Popup innehåller "no knapp"
    if (document.querySelector(".leaveQuizNo")) {
        overlay.querySelector(".leaveQuizNo").addEventListener("click", () => overlay.remove());
    };
};

// Rendera Home Popup
export function homePopup(parentElement) {
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

    handlePopup();

    overlay.querySelector(".leaveQuizYes").addEventListener("click", () => {
        let player = JSON.parse( localStorage.getItem("player") );
        ws.send(JSON.stringify({ event: "playerLeft", data: { code: localStorage.getItem("code"), player: player }}));
        wrapper.innerHTML = "";
        renderStart(wrapper);
    });
    ;
};

function endGame (data) {
    let code = data.code;
    console.log("ENDING GAME " + code);
    let wrapper = document.getElementById("wrapper");

    localStorage.clear();
    renderStart(wrapper);
}

// Renderar Quiz och Finalscore Nav
export function renderQuizNav (parentElement, data) {
    parentElement.innerHTML = ``;
    let game = data.game;
    let playerLocalStorage = JSON.parse( localStorage.getItem("player") );

    let player = game.players.find( (playerObj) => {
      return playerObj.id == playerLocalStorage.id;
    });

    let quizNav = document.createElement("div");
    quizNav.id = "quizNav";
    parentElement.appendChild(quizNav);

    quizNav.innerHTML = `
        <div class="homeButtonContainer">
            <img src="/static/media/icons/back.svg" class="homeButton">
        </div>
        <div class="pointsCon">
            <h4>${player.emoji}</h4>
            <p id="points">${player.points}p</p>
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
            ws.send(JSON.stringify({ event: "playerLeft", data: { code: localStorage.getItem("code"), player: player }}));
            renderStart(wrapper);
        });
        overlay.querySelector(".leaveQuizNo").addEventListener("click", () => overlay.remove());
    });
}

// CONFETTI

export function startConfetti() {

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
      container.id = 'confetti';
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