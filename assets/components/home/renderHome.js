import { renderLobby } from "./../lobby/renderLobby.js";
import { ws } from "../../index.js";

export function renderStart(parentElement) {

    parentElement.innerHTML = `
        <h2 class="title">Join Quiz</h2>
        <div class="joinOptions">
            <input id="joinCode" class="codeOption" placeholder="Enter Pin">
            <p class="details">or</p>
            <div id="buttonQR" class="qrButton">
                <img src="/static/media/icons/QrCode.svg" class="qr">
            </div>
        </div>
        <div class="divider"></div>

        <div class="popularTitleSection">
            <h3 class="popularTitel">Popular Right Now</h3>
            <img src="/static/media/icons/nextPink.svg" class="arrow">
        </div>
        <div class="popularSection"></div>

        <h3 class="allGenresTitel">All Genres</h3>
        <div class="allGenresContainer"></div>
        <p class="details creatorText">Made by Malmö University Students</p>
    `;

    const joinCode = parentElement.querySelector("#joinCode");
    joinCode.addEventListener("keydown", joinGame);

    const popularSection = parentElement.querySelector(".popularSection");
    renderGenres(popularSection);

    const allGenresContainer = parentElement.querySelector(".allGenresContainer");
    renderGenres(allGenresContainer);
}

function renderGenres(parentElement) {
    const allGenres = ["Best of decades", "R&B", "Rock", "Country", "Hiphop", "Jazz", "Pop", "Folk"];

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

async function createNewGame(event) {

    if (event.type == "click") {
        let genre = event.currentTarget.id;
        // let century = document.getElementById("century").value;
        let centuryFull = document.getElementById("slider").value;
        let century = centuryFull.slice(2);

        console.log(genre, century);
        
        
        if (century == null) {
            century = "mixed";
        }

        let gameParams = {
            name: document.getElementById("name").value,
            genre: genre,
            century: century
        };

        if (gameParams.name === "") {
            window.alert("You need to enter name before creating a new game.");
            return;
        } 
        
        //let options = { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify(gameParams) };
        
        //let rqst = await fetch("/api/test", options);

        //let response = await rqst.json();

        ws.send(JSON.stringify( {event: "createGame", data: gameParams})); //gameParams is obj

        /*
        let player = JSON.stringify(response.players[response.players.length - 1]);

        //------------------SETTING VALUES IN LOCALSTORAGE FOR EASY ACCESS LATER------------------
        localStorage.setItem("gameCode", response.code);
        localStorage.setItem("player", player);

        const wrapper = document.getElementById("wrapper");
        document.querySelector(".popup").remove();
        renderLobby(wrapper);*/
    }
    return;
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
                <p id="selected-decade">1990s</p>
                <input id="slider" type="range" min="1960" max="2020" step="10" value="1990">
            </div>
            <p class="orText">or</p>
            <div class="mixedQuestionsButton">
                <p>Mixed Questions</p>
            </div>
            <div class="line"></div>
            <h4 class="h4-bold">Name *</h4>
            <input id="name" type="text" placeholder="eg. Theo" class="name-input">
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
            output.style.visibility = "hidden";
        } else {
            output.style.visibility = "visible";
        }
        
    });

    
    // Start button click handler
    startButton.addEventListener("click", () => {
        if (nameInput.value.trim().length === 0) {
            nameInput.classList.add("error");
            nameInput.placeholder = "Name is required"; // Optional for better UX
        } else {
            let decade = null;
            nameInput.classList.remove("error");
            const genre = startButton.id;
            let mixedQuestions = document.querySelector(".mixedQuestionsButton");

            if (mixedQuestions.classList.contains("clickedButton")) {
                decade = 'mixed';
            } else {
                decade = slider.value.slice(2);
            }

            ws.send(JSON.stringify( {event: "createGame", data: {genre: genre, century: decade, name: nameInput.value}}));
                                // Retrieve the genre from the startButton's ID
             // Pass as an object
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
        let inputField = document.querySelector("#joinCode");

        if (code.length !== 6) renderError("wrapper", "Code needs to be 6 characters long");
        
        let options = { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify({"code": code}) };
        ws.send(JSON.stringify( {event: "joinGame", data: code})); //gameParams is obj

        //let response = await( await fetch(`/api/test`, options) ).json();
        //console.log(response);
        /*if (response == "game doesn't exist") {
            
            renderError("wrapper", "No game with that code exists");

        } else {
            let player = JSON.stringify(response.players[response.players.length - 1]);            

            renderLobby(document.getElementById("wrapper"));
        }*/

        
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