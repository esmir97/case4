import { renderLobby } from "./../lobby/renderLobby.js";

export function renderStart (parentElement) {

    // Övre delen
    let title = document.createElement("h2");
    title.textContent = "Join Quiz";
    title.classList.add("title");
    parentElement.appendChild(title);

    let joinOptions = document.createElement("div");
    joinOptions.classList.add("joinOptions");
    parentElement.appendChild(joinOptions);
    
    const joinCode = document.createElement("input");
    joinCode.id = "joinCode";
    joinCode.classList.add("codeOption");
    joinCode.placeholder = "Enter Pin";
    joinOptions.appendChild(joinCode);
    joinCode.addEventListener("keydown", joinGame);
    
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
    // Titel och Pil
    let popularTitleSection = document.createElement("div");
    popularTitleSection.classList.add("popularTitleSection");
    popularTitleSection.innerHTML = `
        <h3 class="popularTitel">Popular Right Now</h3>
        <img src="/static/media/icons/next2.svg" class="arrow">
    `;
    parentElement.appendChild(popularTitleSection);
    
    let popularSection = document.createElement("div");
    popularSection.classList.add("popularSection");
    parentElement.appendChild(popularSection);
    renderGenres(popularSection);



    // Nedre delen
    // Titel
    let allGenresTitel = document.createElement("h3");
    allGenresTitel.textContent = "All Genres";
    allGenresTitel.classList.add("allGenresTitel");
    parentElement.appendChild(allGenresTitel);

    let allGenresContainer = document.createElement("div");
    allGenresContainer.classList.add("allGenresContainer");
    parentElement.appendChild(allGenresContainer);    
    renderGenres(allGenresContainer);
    
}

function renderGenres (parentElement) {
    const allGenres = ["Pop", "Rock", "Christmas", "R&B", "Hiphop", "Jazz", "Country", "Folk"];

    for (let genre of allGenres) {
        const div = document.createElement("div");
        div.id = genre;
        div.classList.add("genre");
        div.innerHTML = `
                        <div class="genreImg">
                            <img src="/static/media/images/${genre}.jpg">
                        </div>
                        <div class="genreText">
                            <p class="p-bold">${genre}</p>
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
    let body = document.querySelector("body");

    let startGamePopup = document.createElement("div");
    startGamePopup.classList.add("overlay");
   
    startGamePopup.innerHTML = 
        `<div id="card" class="popup">
            <h3>80s Rock</h3>
            <p class="amountOfQuestions">20 Questions</p>
            <h4>Choose year</h4>
            <select id="century">
                <option value="70">1970s</option>
                <option value="80">1980s</option>
                <option value="90">1990s</option>
                <option value="00">2000s</option>
                <option value="10">2010s</option>
                <option value="20">2020s</option>
            </select>
            <p>or</p>
            <p class="mixedQuestionsButton">Mixed Questions</p>
            <div class="line"></div>
            <h4>Name</h4>
            <input id="name" type="text" placeholder="eg. theo">
            <div class="line"></div>
            <p>Start Quiz</p>
        </div>`;

    startGamePopup.addEventListener("click", (event) => {
        startGamePopup.remove();
    })

    body.appendChild(startGamePopup);

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