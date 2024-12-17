import { socket } from "../../logic/client.js";

export function renderLobby (parentElement) {
    parentElement.innerHTML = ``;

    let player = JSON.parse( localStorage.getItem("player") );

    if (player.name == "") {
        renderNameCard();
    } 

    console.log(JSON.parse(localStorage.getItem("player")));
}

async function renderNameCard() {
    let gameCode = localStorage.getItem("gameCode");
    let gameJoined = await (await fetch(`/api/test?code=${gameCode}`)).json();
    console.log(gameJoined);

    const body = document.querySelector("body");

    const overlay = document.createElement("div");
    overlay.classList.add('overlay');

    overlay.innerHTML = `
                        <div>
                            <h2>Joining ${gameJoined.century}'s ${gameJoined.genre} Quiz</h2>
                            <h3>Name</h2>
                        </div>

                        <div id="cardJoin">
                            <p>Enter your display name here!</p>
                            <p id="error"></p>
                            <input id="name" placeholder="eg. 'Theo'">
                        </div>`;

    body.appendChild(overlay);

    document.getElementById("name").addEventListener("keydown", enterName);
}

async function enterName(event) {
    if (event.type == "keydown" && event.key === "Enter" || event.type == "click" && event.currentTarget == document.getElementById("joinBtn")) {
        let player = JSON.parse(localStorage.getItem("player"));
        let newName = document.getElementById("name").value;
        let code = localStorage.getItem("gameCode");

        if (newName.length < 1) {
            let error = document.getElementById("error");
            error.style.color = "red";
            error.textContent = "Enter a name!";
            return;
        }

        let requestBody = {code: code, player: player, name: newName};

        let options = { method: "PATCH", headers: { "Content-Type": "application/json"}, body: JSON.stringify(requestBody) };

        let response = await ( await fetch('/api/test', options) ).json();

        socket.send(JSON.stringify("updateUI"));
        console.log(response);
    }
}

export function updateLobby () {
    console.log("Uuuh hej huhuh updating lobby!!! XDD");
}