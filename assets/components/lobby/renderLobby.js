import { getWebSocket } from "../../index.js";
import { game } from "../../logic/client.js";
import { handlePopup } from "../common/common.js";
import { renderStart } from "../home/renderHome.js";
import * as common from "../common/common.js";
import { renderPlayers } from "../../logic/helpers.js";
 
let globalGame;

export async function renderLobby(parentElement, game) {
    // Fetch and parse the player and game details
    const ws = getWebSocket();

    localStorage.setItem("code", game.code);
    localStorage.setItem("player", JSON.stringify(game.players[game.players.length - 1]));
    globalGame = game;
    let player = JSON.parse(localStorage.getItem("player"));

    // Redirect if the player name is missing
    if (player.name === "") {
        renderNameCard();
    }

    parentElement.innerHTML = `
        <div class="homeButtonContainer">
            <img src="/static/media/icons/back.svg" class="homeButton">
        </div>
        <h2 class="joinTitle">Join Quiz</h2>
        <div class="joinOptions">
            <div class="gameCodePreview">
                <p class="gameCode">${game.code}</p>
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

    // Set quiz details title
    let quizDetailsTitle = parentElement.querySelector(".quizDetailsTitle");
    if (["00", "10", "20"].includes(game.century)) {
        quizDetailsTitle.textContent = "20" + game.century + "´s " + game.genre + " Quiz";
    } else if (game.century == 'mixed') {
        quizDetailsTitle.textContent = "All Time " + game.genre + " Quiz";
    } else {
        quizDetailsTitle.textContent = game.century + "´s " + game.genre + " Quiz";
    }

    // Home Button Behaviour
    const homeButtonContainer = parentElement.querySelector(".homeButtonContainer");
    homeButtonContainer.addEventListener("click", common.homePopup);
    
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
        common.handlePopup();
    });

    // Rendera alla spelare
    renderPlayers(parentElement, player, game);

    //Understa delen
    if (player.name == "") {
        renderNameCard();
    }

    if (player.role === "admin") {
        let startQuizButton = document.createElement("div");
        startQuizButton.classList.add("startQuizButton");
        startQuizButton.innerHTML = `
            <p class="p-bold">Start Quiz</p>
            <img src="/static/media/icons/next.svg" class="startQuizArrow">
        `;
        parentElement.appendChild(startQuizButton);
        startQuizButton.addEventListener("click", (event) => {
            ws.send(JSON.stringify({ event: "startGame", data: game.code }));
        });

    } else {
        let startQuizButton = document.createElement("div");
        startQuizButton.classList.add("waitingForHostButton");
        startQuizButton.innerHTML = `
            <p class="p-bold">Waiting for host to start</p>
        `;
        parentElement.appendChild(startQuizButton);
    };
}

async function renderNameCard() {
    const ws = getWebSocket();
    let code = localStorage.getItem("code");
    ws.send(JSON.stringify({ event: "getGame", data: code }));

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
    const ws = getWebSocket();
    if (event.type == "keydown" && event.key === "Enter" || event.type == "click" && event.currentTarget == document.getElementById("joinBtn")) {
        let player = JSON.parse(localStorage.getItem("player"));
        let newName = document.getElementById("name").value;
        let code = localStorage.getItem("code");

        ws.send(JSON.stringify({ event: "changeName", data: { code: code, player: player, newName: newName } }));

        if (newName.length < 1) {
            let error = document.getElementById("error");
            error.style.color = "red";
            error.textContent = "Enter a name!";
            return;
        }

        document.querySelector(".overlay").remove();
    }
}

export async function playerJoined(message) {
    let game = message.data.game;

    let newPlayer = game.players.find((player) => {
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

export async function playerLeft(message) {
    console.log("player left");
}

export async function playerChangedName(message) {
    let player = message.data.player;

    let nodeListPlayers = document.querySelectorAll(".playerLobby");

    nodeListPlayers.forEach((ele) => {

        if (ele.id === player.id) {
            let p = ele.querySelector("p");
            p.textContent = `${player.emoji} ${player.name}`;
        }
    })
}

export function updateLobby() {
    console.log("Uuuh hej huhuh updating lobby!!! XDD");
}

export function youWereKicked () {
    localStorage.clear();
    renderStart(document.getElementById("wrapper"), true);
}
    
export function someoneLeft (data) {
    let code = data.data.code;
    let id = data.data.playerID;

    if(document.getElementById(id)) document.getElementById(id).remove();
    
    console.log("Player " + id + " left the game.");
}