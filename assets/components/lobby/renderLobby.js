import { socket } from "../../logic/client.js";

export async function renderLobby (parentElement) {

    parentElement.innerHTML = "";



    // Övre delen
    let title = document.createElement("h2");
    title.textContent = "Join Quiz";
    title.classList.add("title");
    parentElement.appendChild(title);

    let joinOptions = document.createElement("div");
    joinOptions.classList.add("joinOptions");
    parentElement.appendChild(joinOptions);

    const joinCode = document.createElement("div");
    joinCode.classList.add("gameCodePreview");
    let gameCode = localStorage.getItem("gameCode");
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
    let gameJoined = await (await fetch(`/api/test?code=${gameCode}`)).json();
    console.log(gameJoined);

    let quizDetails = document.createElement("h3");
    quizDetails.classList.add = "quizDetailsTitle";

    if (gameJoined.century == "00" || gameJoined.century == "10" || gameJoined.century == "20") {
        quizDetails.textContent = "20" + gameJoined.century + "´s " + gameJoined.genre + " Quiz";
    } else {
        quizDetails.textContent = + gameJoined.century + "´s " + gameJoined.genre + " Quiz";
    }
    parentElement.appendChild(quizDetails);


    let player = JSON.parse(localStorage.getItem("player"));

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

        let requestBody = { code: code, player: player, name: newName };

        let options = { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestBody) };

        let response = await (await fetch('/api/test', options)).json();

        socket.send(JSON.stringify("updateUI"));
        console.log(response);
    }
}

export function updateLobby () {
    console.log("Uuuh hej huhuh updating lobby!!! XDD");
}