import { renderStart } from "../home/renderHome.js";
import { ws } from "../../index.js";

// Hanterar hur Popups Stängs
export function handlePopup() {
    const overlay = document.querySelector(".overlay");
    const popup = overlay.querySelector(".middlePopup");

    popup.addEventListener("click", (event) => event.stopPropagation());
    overlay.addEventListener("click", () => overlay.remove());
    overlay.querySelector(".closeButton").addEventListener("click", () => overlay.remove());

    // Om Popup innehåller "no knapp"
    if (document.querySelector(".leaveQuizNo")) {
        overlay.querySelector(".leaveQuizNo").addEventListener("click", () => overlay.remove());
    };
};

// Rendera Home Popup
export function homePopup(parentElement) {
    const wrapper = document.querySelector("#wrapper");
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.innerHTML = `
        <div class="middlePopup">
            <img src="/static/media/icons/close.svg" class="closeButton">
            <h3 class="leaveTitle">Leave Quiz?</h3>
            <div class="leaveOptionsContainer">
                <div class="leaveQuizYes">
                    <p>Yes</p>
                </div>
                <div class="leaveQuizNo">
                    <p>No</p>
                </div>
            </div>
        </div>
    `;
    wrapper.appendChild(overlay);

    handlePopup();

    overlay.querySelector(".leaveQuizYes").addEventListener("click", () => {
        let player = JSON.parse( localStorage.getItem("player") );
        ws.send(JSON.stringify({ event: "playerLeft", data: { code: localStorage.getItem("code"), player: player }}));
        wrapper.innerHTML = "";
        renderStart(wrapper);
    });
    ;
};

function endGame (data) {
    let code = data.code;
    console.log("ENDING GAME " + code);
    let wrapper = document.getElementById("wrapper");

    localStorage.clear();
    renderStart(wrapper);
}