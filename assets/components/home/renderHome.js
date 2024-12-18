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
        <img src="/static/media/icons/nextPink.svg" class="arrow">
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
    
    let creatorText = document.createElement("p");
    creatorText.classList.add("details");
    creatorText.classList.add("creatorText");
    creatorText.textContent = "Made by Malmö University Students";
    parentElement.appendChild(creatorText);
}

function renderGenres (parentElement) {
    const allGenres = ["Best of Centurys","Pop", "Rock", "R&B", "Hiphop", "Jazz", "Country", "Folk"];

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

async function createNewGame({ genre }) {
    let centuryLOL = document.getElementById("slider").value;
    let century = centuryLOL.slice(2);

    console.log(genre, century);

    if (century == null) {
        century = "mixed";
    }

    let gameParams = {
        name: document.getElementById("name").value,
        genre: genre,
        century: century,
    };

    let options = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(gameParams) };

    let rqst = await fetch("/api/test", options);
    let response = await rqst.json();

    console.log(response);

    let player = JSON.stringify(response.players[response.players.length - 1]);

    localStorage.setItem("gameCode", response.code);
    localStorage.setItem("player", player);

    const wrapper = document.getElementById("wrapper");
    document.querySelector(".popup").remove();
    renderLobby(wrapper);
}


async function newGameCard(event) {
    event.stopPropagation();
    console.log(event.currentTarget.id);
    
    let wrapper = document.querySelector('#wrapper');
    let startGamePopup = document.createElement("div");
    startGamePopup.classList.add("startOverlay");
   
    startGamePopup.innerHTML = 
        `<div id="card" class="popup">
            <div class="dragClose"></div>
            <h3>${event.currentTarget.id}</h3>
            <p class="amountOfQuestions">20 Questions</p>
            <h4 class="h4-bold">Choose year</h4>
            <div class="slider-container">
                <input id="slider" type="range" min="1960" max="2020" step="10" value="1990">
                <p id="selected-decade">1990s</p>
            </div>
            <p class="orText">or</p>
            <div class="mixedQuestionsButton">
                <p>Mixed Questions</p>
            </div>
            <div class="line"></div>
            <h4 class="h4-bold">Name</h4>
            <input id="name" type="text" placeholder="e.g., Theo" class="name-input">
            <div class="line"></div>
            <div class="startButton" id="${event.currentTarget.id}">
                <p>Start Quiz</p>
            </div>
        </div>`;

    startGamePopup.addEventListener("click", (event) => {
        startGamePopup.remove();
    });

    wrapper.appendChild(startGamePopup);

    const mixedQuestionsButton = document.querySelector(".mixedQuestionsButton");
    const output = document.getElementById('selected-decade');
    const nameInput = document.getElementById('name');
    const startButton = document.querySelector(".startButton");

    document.getElementById("card").addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // Slider
    const slider = document.getElementById('slider');
    slider.addEventListener('input', () => {
        const decade = slider.value;
        output.textContent = formatDecade(decade);
    });
    output.textContent = formatDecade(slider.value);

    mixedQuestionsButton.addEventListener("click", () => {
        mixedQuestionsButton.classList.toggle("clickedButton");

        if (mixedQuestionsButton.classList.contains("clickedButton")) {
            output.style.display = "none";
        } else {
            output.style.display = "block";
        }
    });

    // Start button click handler
    startButton.addEventListener("click", () => {
        if (nameInput.value.trim().length === 0) {
            nameInput.classList.add("error");
            nameInput.placeholder = "Name is required"; // Optional for better UX
        } else {
            nameInput.classList.remove("error");
            const genre = startButton.id; // Retrieve the genre from the startButton's ID
            createNewGame({ genre }); // Pass as an object
        }
    });    
}

function formatDecade(value) {
    const suffix = value.slice(-2) === '60' ? '60s' : value.slice(-2) + 's';
    return `${value.slice(0, -2)}${suffix}`;
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
            console.log(player);

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