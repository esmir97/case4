export function renderLobby (parentElement) {
    parentElement.innerHTML = ``;

    let player = JSON.parse( localStorage.getItem("player") );

    if (player.name == "") {
        renderNameCard();
    }

    console.log(JSON.parse(localStorage.getItem("player")));

    const joinName = document.createElement("input");
    joinName.id = "joinName";
    joinName.placeholder = "Name";
    joinName.addEventListener("keydown", console.log("lol"));
}

function renderNameCard() {
console.log("hej");
    const body = document.querySelector("body");

    const overlay = document.createElement("div");
    overlay.classList.add('overlay');

    overlay.innerHTML = 
                        `<div id="cardJoin">
                            <h3>Name</h2>
                            <p>Enter your display name here!</p>
                            <p id="error"></p>
                            <input id="name" placeholder="eg. 'Theo'">
                        </div>`;

    body.appendChild(overlay);

    document.getElementById("name").addEventListener("keydown", enterName);
}

async function enterName(event) {
    if (event.key === "Enter") {
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

        let response = await fetch('/api/test', options);

        console.log(response);
        //Skicka gamecode och nytt playername och playerobj
    }
}