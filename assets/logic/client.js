import { playerJoined } from "./../components/lobby/renderLobby.js";
import { playerLeft } from "./../components/lobby/renderLobby.js";
import { playerChangedName } from "./../components/lobby/renderLobby.js";
import { renderLobby } from "./../components/lobby/renderLobby.js";
import { renderQuizNav } from "../components/common/common.js";
import { renderQuizHeader } from "../components/quiz/renderQuiz.js";
import { renderQuizCounter } from "../components/quiz/renderQuiz.js";
import { someoneLeft } from "./../components/lobby/renderLobby.js";
import { youWereKicked } from "./../components/lobby/renderLobby.js";
import { renderStart } from "../components/home/renderHome.js";
import { answerChecked } from "./helpers.js";
import { endRound } from "./helpers.js";
import { renderFinalScore } from "../components/finalScore/renderFinalScore.js";

export let game;
let wsInstance;

export async function establishWebsocket () {
    const response = await fetch("/api/get-ip");
    console.log(response);
    const serverIP = await response.text();
    const trimmedIP = serverIP.trim();
    const socket = new WebSocket(`ws://${trimmedIP}:8000`);

    socket.addEventListener("open", (event) => {
        console.log("Connected.");        
    });
    
    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        let wrapper = document.querySelector("#wrapper");

        switch(message.event) {
            case "playerJoined":
                playerJoined(message);
                break;
            
            case "playerLeft":
                                //playerLeft(socket, id)
                console.log("PLAYER LEFT");
                break;
    
            case "playerChangedName":
                playerChangedName(message);
                break;

            case "createGame": //Not used
                socket.send(JSON.stringify(socket, message.genre, message.century));
                break;
            
            case "gameCreated":
                renderLobby(document.getElementById("wrapper"), message.data);
                break;

            case "renderLobby":
                renderLobby(document.getElementById("wrapper"), message.data);
                //joinGame(socket, code)
                break;
            case "changeName":
                //changeName(socket, id, newName)
                break;

            case "gotGame": //Not used
                game = message.data;
                break;

            case "startedGame":
                renderQuizNav(wrapper, message.data);
                renderQuizHeader(wrapper, message.data);
                renderQuizCounter(wrapper, message.data);
                break;

            case "youWereKicked":
                youWereKicked();
                break;
            
            case "someoneLeft":
                someoneLeft(message);
                break;

            case "endGame":
                renderFinalScore(wrapper, message.data);
                break;

            case "answerChecked":
                answerChecked(message.data);
                break;

            case "endRound":
                endRound(message.data);
                break;

            case "connection":
                localStorage.setItem("id", message.data);
                break;

            case "quitGame":
                renderStart(wrapper);
                break;
        }    
    });
    
    socket.addEventListener("close", (event) => {
        console.log("Disconnected");
    });

    wsInstance = socket;

    return socket;

}

export function getWebSocket() {
    if (!wsInstance) {
        throw new Error("WebSocket is not initialized. Call initializeWebSocket first.");
    }
    return wsInstance;
}