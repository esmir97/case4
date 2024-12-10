export function renderStart (parentElement) {
    let header = document.createElement("header");
    parentElement.appendChild(header);

    /*const buttonNew = document.createElement("button");
    buttonNew.textContent = "New Game";
    buttonNew.id = "buttonNew";
    header.appendChild(buttonNew);
    buttonNew.addEventListener("click", newGameCard);*/

    let main = document.createElement("main");
    parentElement.appendChild(main);
    renderGenres(main);

    const input = document.createElement("input");
    input.id = "joinInput";
    header.appendChild(input);

    const buttonPin = document.createElement("button");
    buttonPin.textContent = "Enter Pin";
    buttonPin.id = "buttonPin";
    header.appendChild(buttonPin);
    //buttonPin.addEventListener("click" ); renderJoinCard

    
}

function renderGenres (parentElement) {
    const allGenres = ["pop", "rock", "christmas", "r&b", "hiphop", "jazz", "pop", "country", "folk"];

    for (let genre of allGenres) {
        const div = document.createElement("div");
        div.id = genre;
        div.classList.add("genre");
        div.innerHTML = `
                        <div class="genreImg">
                            <img src="/static/images/${genre}.jpg">
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
        let genre = event.currentTarget.id.replace("name", "");
        let century = document.getElementById("century").value;
        
        if (century == null) {
            century = "mixed";
        }

        let gameParams = {
            genre: genre,
            century: century
        };
        
        let options = { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify(gameParams) };
        
        
        let rqst = await fetch("/api/test", options);
        let response = await rqst.json();

        console.log(response);
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
                            <input id="name${event.currentTarget.id}" placeholder="eg. 'Theo'">
                        </div>`;

    overlay.addEventListener("click", (event) => {
        overlay.remove();
    })

    body.appendChild(overlay);

    document.getElementById("card").addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.getElementById("name" + event.currentTarget.id).addEventListener("keydown", createNewGame);
}

async function joinGame(event) {
    let code = document.getElementById("joinInput").value;

    if (code.length === 6) {
        await fetch(`/api/test?${code}`);

    } else {
        let error = document.createElement("p");
        error.style.color = red;
        error.textContent = "Invalid code. Code must be 6 characters long."
        document.querySelector("body").appendChild(error);
    }
}