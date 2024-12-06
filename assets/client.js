export const socket = new WebSocket("http://localhost:8000");

const display = document.querySelector('#wrapper');

socket.addEventListener("open", (event) => {
    console.log("Connected.");
    let myID = 1;

    console.log("My ID is: " + event.data)
    /*console.log(localStorage.getItem("playerID"));
    if (!localStorage.getItem("playerID")) {
        console.log("New ID added!");
        localStorage.setItem("playerID", myID);
    }
    console.log(localStorage.getItem("playerID"));

    myID++;*/
});

socket.addEventListener("message", (event) => {
    console.log(event.data);
    socket.send(event.data);
});

socket.addEventListener("close", (event) => {
    console.log("Disconnected");
});