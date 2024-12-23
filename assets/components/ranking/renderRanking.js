// Nav

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
        startConfetti();
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