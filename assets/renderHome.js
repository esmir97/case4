export function renderStart (parentElement) {
    const buttonNew = document.createElement("button");
    buttonNew.textContent = "New Game";
    buttonNew.id = "buttonNew";
    parentElement.appendChild(buttonNew);
    buttonNew.addEventListener("click", createNewGame);

    const buttonJoin = document.createElement("button");
    buttonJoin.textContent = "Join Game";
    buttonJoin.id = "buttonJoin";
    parentElement.appendChild(buttonJoin);
    buttonJoin.addEventListener("click", joinGame);

    const input = document.createElement("input");
    input.id = "joinInput";
    parentElement.appendChild(input);
}

async function createNewGame (event) {
    //let newCode = generateGameCode(6);

    let options = { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify("code") };

    await fetch("/api/test", options);
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