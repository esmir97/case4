export const socket = new WebSocket("http://localhost:8000");

function send(socket, event, data) {
    socket.send(JSON.stringify({ event, data }));
  }

socket.addEventListener("open", (event) => {
    console.log("Connected.");

    
});

socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    switch(message.event) {
        case "updateUI":
            console.log("Updating UI..");
            break;
        
    }
    console.log(event.data);
    socket.send(event.data);

});

socket.addEventListener("close", (event) => {
    console.log("Disconnected");
});