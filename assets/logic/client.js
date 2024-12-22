import { playerJoined } from "./../components/lobby/renderLobby.js";
import { playerLeft } from "./../components/lobby/renderLobby.js";
import { playerChangedName } from "./../components/lobby/renderLobby.js";
import { renderLobby } from "./../components/lobby/renderLobby.js";
import { renderQuizNav } from "../components/quiz/renderQuiz.js";
import { renderQuizHeader } from "../components/quiz/renderQuiz.js";
import { renderQuizCounter } from "../components/quiz/renderQuiz.js";
import { someoneLeft } from "./../components/lobby/renderLobby.js";
import { youWereKicked } from "./../components/lobby/renderLobby.js";
import { renderStart } from "../components/home/renderHome.js";

export let game;

export function establishWebsocket () {
    const socket = new WebSocket("ws://localhost:8000");

    socket.addEventListener("open", (event) => {
        console.log("Connected.");        
    });
    
    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        let wrapper = document.querySelector("#wrapper");

        switch(message.event) {
            case "playerJoined":
                playerJoined(message);
                console.log(message);
                break;
            
            case "playerLeft":
                                //playerLeft(socket, id)
                console.log("PLAYER LEFT");
                console.log(message.data);
                break;
    
            case "playerChangedName":
                playerChangedName(message);
                break;

            case "createGame":
                console.log(JSON.parse(message));
                socket.send(JSON.stringify(socket, message.genre, message.century));
                break;
            
            case "gameCreated":
                console.log(message.event);
                renderLobby(document.getElementById("wrapper"), message.data);
                break;

            case "renderLobby":
                renderLobby(document.getElementById("wrapper"), message.data);
                console.log("IM JOINING")
                //joinGame(socket, code)
                break;
            case "changeName":
                //changeName(socket, id, newName)
                break;

            case "gotGame":
                game = message.data;
                break;

            case "startedGame":
                renderQuizNav(wrapper);
                renderQuizHeader(wrapper);
                renderQuizCounter(wrapper);
                break;

            case "youWereKicked":
                youWereKicked();
                break;
            
            case "someoneLeft":
                someoneLeft(message);
                break;

            case "endGame":
                localStorage.clear();
                renderStart(wrapper);
                break;
        }
        //socket.send(event.data);
    
    });
    
    socket.addEventListener("close", (event) => {
        console.log("Disconnected");
    });

    return socket;

}
