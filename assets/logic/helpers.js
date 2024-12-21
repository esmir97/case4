import * as common from "../components/common/common.js";
import { ws } from "../index.js";

export function renderPlayers(parentElement, player, game) {
    let playerContainer = document.createElement("div");
        playerContainer.id = "playerContainer";
        parentElement.appendChild(playerContainer);
        //let game = await (await fetch(`/api/test?code=${gameCode}`)).json();
    
        game.players.forEach((player) => {
            const div = document.createElement("div");
            const p = document.createElement("p");
            p.textContent = `${player.emoji} ${player.name}`;
            div.classList.add("playerLobby");
            div.id = `${player.id}`;
    
            div.appendChild(p);
            playerContainer.appendChild(div);
        });
    
        playerContainer.addEventListener("click", (event) => {
    
            let clickedElement = event.target.closest(".playerLobby");
            if (player.role === "admin" && clickedElement) {
                const playerId = clickedElement.id;
                const playerName = clickedElement.querySelector("p").textContent.split(" ").slice(1).join(" ");
    
                if (player.role === "admin" && playerId === player.id) {
                    console.log("You cannot kick yourself!");
                    return; 
                }
    
                const overlay = document.createElement("div");
                overlay.classList.add("overlay");
                overlay.innerHTML = `
                    <div class="middlePopup">
                        <img src="/static/media/icons/close.svg" class="closeButton">
                        <h3 class="leaveTitle">Kick: "${playerName}"?</h3>
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
    
                common.handlePopup();
                
    
                overlay.querySelector(".leaveQuizYes").addEventListener("click", () => {
                    const playerElement = document.getElementById(playerId);
                    if (playerElement) {
                        ws.send(JSON.stringify({ event: "kickPlayer", data: {code: localStorage.getItem("code"), id: playerId }}));
                    }
    
                    console.log(`Player "${playerName}" with ID ${playerId} has been kicked.`);
    
                    // Kick player Function here
    
                    wrapper.removeChild(overlay);
                });
            }
        });
};