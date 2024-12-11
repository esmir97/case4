export const socket = new WebSocket("http://localhost:8000");

const display = document.querySelector('#wrapper');

socket.addEventListener("open", (event) => {
    console.log("Connected.");
});

socket.addEventListener("message", (event) => {
    console.log(event.data);
    socket.send(event.data);
});

socket.addEventListener("close", (event) => {
    console.log("Disconnected");
});