import { ws } from "../../index.js";
import { game } from "../../logic/client.js";

let globalGame;

export async function renderLobby (parentElement, game) {
    localStorage.setItem("code", game.code);
    localStorage.setItem("player", JSON.stringify(game.players[game.players.length - 1]));
    globalGame = game;
    let player = JSON.parse(localStorage.getItem("player"));

    console.log(localStorage.getItem("player"));
    
    parentElement.innerHTML = "";

    console.log(game);

    // Övre delen
    let title = document.createElement("h2");
    title.textContent = "Join Quiz";
    title.classList.add("joinTitle");
    parentElement.appendChild(title);

    let joinOptions = document.createElement("div");
    joinOptions.classList.add("joinOptions");
    parentElement.appendChild(joinOptions);

    const joinCode = document.createElement("div");
    joinCode.classList.add("gameCodePreview");
    let gameCode = localStorage.getItem("code");
    joinCode.innerHTML = `
        <p class="gameCode">${gameCode}</p>
    `;
    joinOptions.appendChild(joinCode);

    const text = document.createElement("p");
    text.classList.add("details");
    text.textContent = "or";
    joinOptions.appendChild(text);

    const buttonQR = document.createElement("div");
    buttonQR.id = "buttonQR";
    buttonQR.classList.add("qrButton");
    buttonQR.innerHTML = `
        <img src="/static/media/icons/QrCode.svg" class="qr">
    `;
    joinOptions.appendChild(buttonQR);
    //buttonPin.addEventListener("click" ); QR-code function

    const divider = document.createElement("div");
    divider.classList.add("divider");
    parentElement.appendChild(divider);

    // Mellersta delen    
    //let game = await (await fetch(`/api/test?code=${gameCode}`)).json();

    let quizDetails = document.createElement("h3");
    quizDetails.classList.add("quizDetailsTitle");

    if (game.century == "00" || game.century == "10" || game.century == "20") {
        quizDetails.textContent = "20" + game.century + "´s " + game.genre + " Quiz";
    } else {
        quizDetails.textContent = + game.century + "´s " + game.genre + " Quiz";
    }
    parentElement.appendChild(quizDetails);

    let waitingForPlayers = document.createElement("p");
    waitingForPlayers.classList.add("h4-bold");
    waitingForPlayers.classList.add("waitingForPlayers");
    waitingForPlayers.textContent = "Waiting for players to join...";
    parentElement.appendChild(waitingForPlayers);

    let moderatorInfoIconContainer = document.createElement("div");
    moderatorInfoIconContainer.classList.add("moderatorInfoIconContainer");
    moderatorInfoIconContainer.innerHTML = `
        <img src="/static/media/icons/info.svg" class="moderatorInfoIcon">
    `;
    parentElement.appendChild(moderatorInfoIconContainer);

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

    return;
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
        overlay.remove();
    });

    const popup = overlay.querySelector('.middlePopup');
    popup.addEventListener("click", (event) => {
        event.stopPropagation(); // Stop the click from propagating to the overlay
    });

    const closeButton = overlay.querySelector('.closeButton');
    closeButton.addEventListener("click", () => {
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