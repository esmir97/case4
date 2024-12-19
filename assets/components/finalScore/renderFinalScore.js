
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

// CONFETTI

function startConfetti() {
    // Globals
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
        var delta = 16; // fixed delta
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