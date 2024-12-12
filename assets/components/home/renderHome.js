import { renderLobby } from "./../lobby/renderLobby.js";

export function renderStart (parentElement) {
    let header = document.createElement("header");
    parentElement.appendChild(header);

    let main = document.createElement("main");
    parentElement.appendChild(main);
    renderGenres(main);

    const joinCode = document.createElement("input");
    joinCode.id = "joinCode";
    joinCode.placeholder = "Enter Pin";
    header.appendChild(joinCode);
    joinCode.addEventListener("keydown", joinGame);

    const buttonQR = document.createElement("button");
    buttonQR.textContent = "QR";
    buttonQR.id = "buttonQR";
    header.appendChild(buttonQR);
    //buttonPin.addEventListener("click" ); QR-code function
}

function renderGenres (parentElement) {
    const allGenres = ["pop", "rock", "christmas", "r&b", "hiphop", "jazz", "pop", "country", "folk"];

    for (let genre of allGenres) {
        const div = document.createElement("div");
        div.id = genre;
        div.classList.add("genre");
        div.innerHTML = `
                        <div class="genreImg">
                            <img src="/static/media/images/${genre}.jpg">
                        </div>
                        <div class="genreText">
                            <h3>${genre}</h3>
                        </div>
        `;
        div.addEventListener("click", newGameCard);
        parentElement.appendChild(div);
    }
}

async function createNewGame (event) {

    if (event.key == "Enter") {
        let genre = event.currentTarget.className;
        let century = document.getElementById("century").value;
        
        if (century == null) {
            century = "mixed";
        }

        let gameParams = {
            name: document.getElementById("name").value,
            genre: genre,
            century: century
        };
        
        let options = { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify(gameParams) };
        
        
        let rqst = await fetch("/api/test", options);
        let response = await rqst.json();

        console.log(response);

        let player = JSON.stringify(response.players[response.players.length - 1]);

        //------------------SETTING VALUES IN LOCALSTORAGE FOR EASY ACCESS LATER------------------
        localStorage.setItem("gameCode", response.code);
        localStorage.setItem("player", player);

        const wrapper = document.getElementById("wrapper");
        document.querySelector(".overlay").remove();
        renderLobby(wrapper);
    }
}


async function newGameCard(event) {
    event.stopPropagation();
    console.log(event.currentTarget.id);
    const body = document.querySelector("body");

    const overlay = document.createElement("div");
    overlay.classList.add('overlay');

    overlay.innerHTML = 
                        `<div id="card">
                            <h2>Choose Year</h2>
                            <select id="century">
                                <option value="70">1970s</option>
                                <option value="80">1980s</option>
                                <option value="90">1990s</option>
                                <option value="00">2000s</option>
                                <option value="10">2010s</option>
                                <option value="20">2020s</option>
                            </select>

                            <button id="mixedQuestions">Mixed Questions</button>
                            <h3>Name</h2>
                            <input id="name" class="${event.currentTarget.id}" placeholder="eg. 'Theo'">
                        </div>`;

    overlay.addEventListener("click", (event) => {
        overlay.remove();
    })

    body.appendChild(overlay);

    document.getElementById("card").addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.getElementById("name").addEventListener("keydown", createNewGame);
}

async function joinGame(event) {

    if (event.key === "Enter") {
        let code = document.getElementById("joinCode").value;

        if (code.length !== 6) renderError("wrapper", "Code needs to be 6 characters long");
        
        let options = { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify({"code": code}) };

        let response = await( await fetch(`/api/test`, options) ).json();
        console.log(response);
        if (response == "game doesn't exist") {
            
            renderError("wrapper", "No game with that code exists");

        } else {
            let player = JSON.stringify(response.players[response.players.length - 1]);
            console.log(response);

            //------------------SETTING VALUES IN LOCALSTORAGE FOR EASY ACCESS LATER------------------
            localStorage.setItem("gameCode", response.code);
            localStorage.setItem("player", player);

            renderLobby(document.getElementById("wrapper"));
        }

        
    }
    return;
}

function renderError(parentElementID, msg) {

    const parent = document.getElementById(parentElementID);
    const errorBox = document.getElementById("errorBox");

    if (!errorBox) {
        const errorBox = document.createElement("div");
        errorBox.id = "errorBox";
        errorBox.innerHTML = `<p style="color: red;">${msg}</p>`;
        parent.prepend(errorBox);

    } else {
        errorBox.innerHTML = `<p style="color: red;">${msg}</p>`;
    }
}