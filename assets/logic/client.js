import { updateLobby } from "../components/lobby/renderLobby.js";

export const socket = new WebSocket("http://localhost:8000");

socket.addEventListener("open", (event) => {
    console.log("Connected.");

    
});

socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    switch(message.event) {
        case "updateLobby":
            console.log("Updating UI..");
            updateLobby();
            break;
        
    }
    console.log(event.data);
    socket.send(event.data);

});

socket.addEventListener("close", (event) => {
    console.log("Disconnected");
});