export function renderCorrectAnswer (parentElement){
    
    let title = document.createElement("h3");
    title.textContent = "You're Right!"
    title.classList.add("correct");
    parentElement.appendChild(title);

    let score = document.createElement("h1");
    score.textContent = "+80 Points"
    score.classList.add("score");
    parentElement.appendChild(score);

    renderScoreBoard(wrapper);
    startConfetti();  //anropar confetti funktionen
}

let players = [
  { emoji: "🤓", name: "Dumbledork", score: 1850 },
  { emoji: "🔥", name: "HotShot", score: 1700 },
  { emoji: "🎵", name: "Melody", score: 1650 },
];

//scoreboard
async function renderScoreBoard (parentElement){
    
    let correctAnswer = document.createElement("p");
    correctAnswer.innerHTML = `<p>is the correct answer!</p>`; //lägg till backtic literals här med rätt fråga som text ${}
    correctAnswer.classList.add("correctAnswer");
    parentElement.appendChild(correctAnswer);

    let scoreboard = document.createElement("h4");
    scoreboard.textContent = "Scoreboard";
    scoreboard.classList.add("scoreboard");
    parentElement.appendChild(scoreboard);

    //Skapar en oderList
    let ol = document.createElement("ol");
   // ol.textContent = "Scoreboard"; //kan ha texten scoreboard här med men vet ej?
    parentElement.appendChild(ol);
    //För varje spelare skapas en li element med strukturen: player emoji & namn samt dess score


    // VIKTIGT!!!! AVKOMMENTERA detta sen! måste koppla till vår ARRAY!!!
      players.forEach(player => {
          let listItem = document.createElement("li");
          listItem.classList.add("listItem");
          listItem.innerHTML = `
            <span>${player.emoji} ${player.name}</span> 
            <span>${player.score}</span>
          `;

        ol.appendChild(listItem);
      });


    let currentPlacement = document.createElement("h4");
    currentPlacement.innerHTML = `You're in ... place just ... point behind ...`;   //använda <br>?
                                
    currentPlacement.classList.add("currentPlacement");
    parentElement.appendChild(currentPlacement);
}
//renderCorrectAnswer(wrapper);

// CONFETTI
export function startConfetti() {
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
    container.style.zIndex = '9999';
  
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