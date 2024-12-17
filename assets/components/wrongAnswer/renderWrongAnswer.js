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
renderQuizNav(wrapper);
export function renderWrongAnswer (parentElement){
    let title = document.createElement("h3");
    title.textContent = "Wrong Answer!"
    title.classList.add("wrong");
    parentElement.appendChild(title);

    let score = document.createElement("h1");
    score.textContent = "0 Points"
    score.classList.add("score");
    parentElement.appendChild(score);

    renderScoreBoard(wrapper);
}

/* VIKTIGT!!! MÅSTE HITTA ARRAY MED SPELARE FÖR ATT FIXA SCOREBOARDEN!
DETTA ÄR BARA EN TEST:*/
let player = [
    {emoji: "🥵", name: "Johan", score:"1233"},
    {emoji: "😎", name: "Esmir", score:"1232"},
    {emoji: "👴🏼", name: "Theo", score:"1231"},
    {emoji: "🤭", name: "Johanna", score:"1230"},
    
];


//scoreboard
async function renderScoreBoard (parentElement){
    
    let correctAnswer = document.createElement("p");
    correctAnswer.innerHTML = `<p>is the correct answer!</p>`; // lägg till backtic literals här med rätt fråga som text ${}
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
    
    
    /* AVKOMMENTERA DETTA SEN MÅSTE LOOPA DESSA SEN FÖR ATT FÅ SCOREBOARD*/
    player.forEach(player => {
        let listItem = document.createElement("li");
        listItem.classList.add("listItem");
        listItem.innerHTML = `
        <span>${player.emoji} ${player.name}</span> 
        <span>${player.score}</span>
      `;
    ol.appendChild(listItem);
    });
 
    

    let currentPlacement = document.createElement("h4");
    currentPlacement.textContent = `You're in ... place just ... points behind ...`;  //använda <br>?
    currentPlacement.classList.add("currentPlacement");
    parentElement.appendChild(currentPlacement);
}
