import { ws } from "../../index.js";
import { game } from "../../logic/client.js";
import { renderStart } from "../home/renderHome.js";

let globalGame;

export async function renderLobby(parentElement, game) {
   // Fetch and parse the player and game details

localStorage.setItem("code", game.code);
    localStorage.setItem("player", JSON.stringify(game.players[game.players.length - 1]));
    globalGame = game;
    let player = JSON.parse(localStorage.getItem("player"));

    console.log(localStorage.getItem("player"));
    console.log(game);
// Redirect if the player name is missing
if (player.name === "") {
    renderNameCard();
}

console.log(player);

parentElement.innerHTML = `
    <div class="homeButtonContainer">
        <img src="/static/media/icons/back.svg" class="homeButton">
    </div>
    <h2 class="joinTitle">Join Quiz</h2>
    <div class="joinOptions">
        <div class="gameCodePreview">
            <p class="gameCode">${gameCode}</p>
        </div>
        <p class="details">or</p>
        <div id="buttonQR" class="qrButton">
            <img src="/static/media/icons/QrCode.svg" class="qr">
        </div>
    </div>
    <div class="divider"></div>
    <h3 class="quizDetailsTitle"></h3>
    <p class="h4-bold waitingForPlayers">Waiting for players to join...</p>
    <div class="moderatorInfoIconContainer">
        <img src="/static/media/icons/info.svg" class="moderatorInfoIcon">
    </div>
`;

// Fetch game details
let gameJoined = await (await fetch(`/api/test?code=${gameCode}`)).json();
console.log(gameJoined);

// Set quiz details title
let quizDetailsTitle = parentElement.querySelector(".quizDetailsTitle");
if (["00", "10", "20"].includes(gameJoined.century)) {
    quizDetailsTitle.textContent = "20" + gameJoined.century + "´s " + gameJoined.genre + " Quiz";
} else {
    quizDetailsTitle.textContent = gameJoined.century + "´s " + gameJoined.genre + " Quiz";
}

// Add home button overlay behavior
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
        renderStart(wrapper);
    });
    overlay.querySelector(".leaveQuizNo").addEventListener("click", () => overlay.remove());
});

// Add moderator info overlay behavior
const moderatorInfoIconContainer = parentElement.querySelector(".moderatorInfoIconContainer");
moderatorInfoIconContainer.addEventListener("click", () => {
    const wrapper = document.querySelector("#wrapper");
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.innerHTML = `
        <div class="middlePopup">
            <img src="/static/media/icons/close.svg" class="closeButton">
            <h3 class="moderatorInformationTitle">Moderator Information</h3>
            <p class="p">As “Quiz moderator” you can kick players by clicking on them and pressing “yes”.</p>
        </div>
    `;
    wrapper.appendChild(overlay);

    overlay.addEventListener("click", () => overlay.remove());
    const popup = overlay.querySelector(".middlePopup");
    popup.addEventListener("click", (event) => event.stopPropagation());
    const closeButton = overlay.querySelector(".closeButton");
    closeButton.addEventListener("click", () => overlay.remove());
});



    //Understa delen

    let playerContainer = document.createElement("div");
    playerContainer.id = "playerContainer";

    //let game = await (await fetch(`/api/test?code=${gameCode}`)).json();

    game.players.forEach( (player) => {
        const div = document.createElement("div");
        const p = document.createElement("p");
        p.textContent = `${player.emoji} ${player.name}`;
        div.classList.add("playerLobby");
        div.id = `${player.id}`;
        
        div.appendChild(p);
        playerContainer.appendChild(div);
    });

    parentElement.appendChild(playerContainer);

    if (player.name == "") {
        renderNameCard();
    } 

    if (player.role === "admin") {
        let startQuizButton = document.createElement("div");
        startQuizButton.classList.add("startQuizButton");
        startQuizButton.innerHTML = `
            <p class="p-bold">Start Quiz</p>
            <img src="/static/media/icons/next2.svg" class="startQuizArrow">
        `;
        parentElement.appendChild(startQuizButton);
    } else {
        let startQuizButton = document.createElement("div");
        startQuizButton.classList.add("waitingForHostButton");
        startQuizButton.innerHTML = `
            <p class="p-bold">Waiting for host to start</p>
        `;
        parentElement.appendChild(startQuizButton);
    };


    // Add the start/waiting button based on the player's role
    if (player.role === "admin") {
        const startQuizButton = document.createElement("div");
        startQuizButton.classList.add("startQuizButton");
        startQuizButton.innerHTML = `
            <p class="p-bold">Start Quiz</p>
            <img src="/static/media/icons/next.svg" class="startQuizArrow">
        `;
        parentElement.appendChild(startQuizButton);
    } else {
        const waitingForHostButton = document.createElement("div");
        waitingForHostButton.classList.add("waitingForHostButton");
        waitingForHostButton.innerHTML = `
            <p class="p-bold">Waiting for host to start</p>
        `;
        parentElement.appendChild(waitingForHostButton);
    }
}

async function renderNameCard() {
    let code = localStorage.getItem("code");
    ws.send(JSON.stringify( {event: "getGame", data: code}));

    console.log(globalGame);
    //let game = await (await fetch(`/api/test?code=${gameCode}`)).json();

    let wrapper = document.querySelector('#wrapper');
    let overlay = document.createElement("div");
    overlay.classList.add('overlay');

    overlay.innerHTML = `
        <div class="middlePopup">
            <img src="/static/media/icons/close.svg" class="closeButton">
            <h3 class="middlePopupTitle">Joining ${globalGame.century}'s ${globalGame.genre} Quiz</h3>
            <p class="p-bold middlePopupName">Name</p>
            <p id="error"></p>
            <input id="name" placeholder="eg. Theo">
        </div>
    `;

    overlay.addEventListener("click", () => {
        let parentElement = document.querySelector("#wrapper");
        parentElement.innerHTML = ``;
        renderStart(parentElement);
        overlay.remove();
    });

    const popup = overlay.querySelector('.middlePopup');
    popup.addEventListener("click", (event) => {
        event.stopPropagation(); // Stop the click from propagating to the overlay
    });

    const closeButton = overlay.querySelector('.closeButton');
    closeButton.addEventListener("click", () => {
        let parentElement = document.querySelector("#wrapper");
        parentElement.innerHTML = ``;
        renderStart(parentElement);
        overlay.remove();
    });

    wrapper.appendChild(overlay);

    document.getElementById("name").addEventListener("keydown", enterName);
}

async function enterName(event) {
    if (event.type == "keydown" && event.key === "Enter" || event.type == "click" && event.currentTarget == document.getElementById("joinBtn")) {
        let player = JSON.parse(localStorage.getItem("player"));
        let newName = document.getElementById("name").value;
        let code = localStorage.getItem("code");

        ws.send(JSON.stringify( {event: "changeName", data: {code: code, player: player, newName: newName}}));

        if (newName.length < 1) {
            let error = document.getElementById("error");
            error.style.color = "red";
            error.textContent = "Enter a name!";
            return;
        }

        document.querySelector(".overlay").remove();
    }
}

export async function playerJoined (message) {
    let game = message.data.game;

        let newPlayer = game.players.find( (player) => {
        return player.id == message.data.id;
    });
    
    if (document.getElementById(newPlayer.id)) {
        return;
    }
    
    let playerContainer = document.getElementById("playerContainer");

    const div = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = `${newPlayer.emoji} ${newPlayer.name}`;
    div.classList.add("playerLobby");
    div.id = `${newPlayer.id}`;
    
    
    div.appendChild(p);
    playerContainer.appendChild(div);

    console.log("player joined");
    
}

export async function playerLeft (message) {
    console.log("player left");

    console.log(message.data);
}

export async function playerChangedName (message) {
    console.log("changed name");
    console.log(message.data);

    let player = message.data.player;

    let nodeListPlayers = document.querySelectorAll(".playerLobby");

    nodeListPlayers.forEach( (ele) => {
        console.log(ele.querySelector("p").textContent);
        if (ele.id == player.id) {
            let p = ele.querySelector("p");
            p.textContent = `${player.emoji} ${player.name}`;
            console.log("hejsvejs")
        } 
    })
}
export function updateLobby() {
    console.log("Uuuh hej huhuh updating lobby!!! XDD");
}