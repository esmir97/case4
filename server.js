import { serveDir, serveFile } from "jsr:@std/http/file-server";

let _state = {
    games: [
        
    ]
}

let connections = {};
let connectionID = 1;
let myID;

const testData = await Deno.readTextFile("./database.json");



function getRandomEmoji() {
    const emojis = [
        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", 
        "😍", "😘", "😗", "😙", "😚", "😋", "😜", "😝", "😛", "🤑", "🤗", "🤔", "🤭", 
        "🤫", "🤐", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", 
        "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😵", "🤯", "🤠", "😎", "🤓", 
        "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", 
        "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", 
        "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", 
        "👾", "🤖", "🫠", "👶", "👦", "👧", "👨", "👩", "👴", "👵", "🧑", "👨‍🦱", 
        "👩‍🦱", "👨‍🦳", "👩‍🦳", "👨‍🦲", "👩‍🦲", "🧔", "👱‍♂️", "👱‍♀️", "🧓", 
        "👩‍⚕️", "👨‍⚕️", "👩‍🏫", "👨‍🏫", "👩‍🍳", "👨‍🍳", "👩‍🔧", "👨‍🔧", "👩‍🏭", 
        "👨‍🏭", "👩‍💼", "👨‍💼", "👩‍🔬", "👨‍🔬", "👩‍💻", "👨‍💻", "👩‍🎤", "👨‍🎤", 
        "👩‍🎨", "👨‍🎨", "👩‍✈️", "👨‍✈️", "👩‍🚀", "👨‍🚀", "👩‍🚒", "👨‍🚒", "🧕", 
        "👳‍♂️", "👳‍♀️", "👲", "🧔‍♂️", "🧔‍♀️", "🤴", "👸", "👼", "🤰", "🤱", "👩‍🍼", 
        "👨‍🍼", "🧑‍🍼", "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", 
        "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🦄", "🐔", "🐧", "🐦", 
        "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", 
        "🦋", "🐌", "🐞", "🦗", "🦂", "🕷️", "🐢", "🐍", "🦎", "🐙", "🦑", "🦐", "🦞", 
        "🐡", "🐠", "🐟", "🦈", "🐳", "🐋", "🐬"
      ];
    
      return emojis[Math.floor(Math.random() * emojis.length)];
}

function generateGameCode (n = 6) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < n; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    let codeDupeCheck = [];
    codeDupeCheck = _state.games.find( (game) => {
        return game.code == result;
    })

    if (codeDupeCheck) {
        return generateGameCode();
    } else {
        return result;
    }
}

function getQuestionsForGame(genre, century) { //Randomises an array with 20 questions depending on genre/century
    let questions = JSON.parse(testData);
    
    let questionsToChooseFrom = [];
    let chosenQuestions = [];
    console.log(century);
    if (typeof century != 'string') {
        century = century.toString();
        console.log("'Century' value is not a string! :)")
    }
    
    
    if (century != "mixed") {
        genre = genre.toLowerCase();

        for (let question of questions[genre][century]) {
            questionsToChooseFrom.push(question);
        }
        
    } else {
        let questionGenre = testData[genre];

        for (let century in questionGenre) {
            for (let question of century) {
                questionsToChooseFrom.push(question);
            }
        }
    }

    for (let i = 0; i < 20; i++) {
        chosenQuestions.push(questionsToChooseFrom[Math.floor( Math.random() * questionsToChooseFrom.length )]);
    }
    
    return chosenQuestions;
}

function generateConnectionID() {
    return `conn-${Date.now()}-${connectionID}`;
}

function send(socket, event, data) {
    socket.send(JSON.stringify({ event, data }));
}

function broadcast(event, data) {
    let game = _state.games.find( (game) => {
        return data.code == game.code;
    });

    for (let player of game.players) {
        if (player.connection && player.connection.readyState === WebSocket.OPEN) {
            console.log("Sending to " + player.id);
            send(player.connection, event, data);
        } else {
            console.log("Player connection not found for player ID: " + player.id);
        }
    }
}


async function handleHTTPRequest (request) { //Säger till vad som ska hända när vi använder vanlig HTTP

    const pathname = new URL(request.url).pathname;

    if (pathname.startsWith('/static')) {
        return serveDir(request, {
            fsRoot: 'assets',
            urlRoot: 'static'
        });
    }

    if (pathname == '/api/test') {
        
        const options = {
            headers: { "Content-Type": "application/json"}
        }
/*
        if (request.method == 'GET') { //GET entire game obj with gameCode
            const GETdata = await request;
            let code = GETdata.url.slice(GETdata.url.length - 6);

            let game = _state.games.find( (game) => {
                return game.code == code;
            });
            
            if (game) {
                
                return new Response(JSON.stringify(game), options);

            } else {
                return new Response(JSON.stringify("Game doesn't exist"))
            }

        }

        /*if (request.method == 'POST') {
            
                    
            return new Response(JSON.stringify(response), options);

            } else if (POSTdata.code) { // Join Game
                
                    return new Response(JSON.stringify(filteredGame), options);
                } else {
                    return new Response(JSON.stringify("game doesn't exist"), options);
                }
    
            } else {
                console.log("good job with the codes bozo");
                return new Response(JSON.stringify({ error: "wrong keys in rqst" }), options);
            }
            
        }*/
    
/*
        if (request.method == 'PATCH') {

        }

        if (request.method == 'DELETE') {
            //När en spelare lämnar ett spel/blir kickad, kör en DELETE på den spelaren från deras lobby
            
        }*/
    }
    return serveFile(request, './index.html');
}




function handleWebSocket (request) { //Säger vad som ska hända på serversidan med vår connection när vi använder WebSockets
    const { socket, response } = Deno.upgradeWebSocket(request);
    myID = generateConnectionID();
    connections[myID] = socket;
    connectionID++;
    
    socket.addEventListener("open", (event) => {
        console.log("CONNECTIOOOOOOOOOOOOONS");
        console.log(connections);

        console.log(`Connection ${myID} connected.`);
        
        console.log("CONNECTION ID IS NOW: " + connectionID);
    });

    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);

        switch(message.event) {

            case "playerLeft":
                playerLeft(message);
                break;
    
            case "changeName":
                console.log(message);
                changeName(socket, message.data.code, message.data.player, message.data.newName);
                break;

            case "createGame":
                console.log("DATA HEEEERE<----------------------");
                console.log(message.data);
                createGame(socket, message.data.genre, message.data.century, message.data.name);
                break;
            
            case "joinGame":
                joinGame(socket, message.data);
                break;
            case "changeName":
                //changeName(socket, id, newName)
                break;
            case "getGame":
                getGame(socket, message.data);
                break;
        }
    });
    
    socket.addEventListener("close", (event) => {
        console.log(`Connection ${myID} disconnected.`);
        console.log(myID);

        let indexGame = null;
        let indexPlayer = null;
        let i = 0;
        
        for (let game of _state.games) {
            let k = 0;
            for (let player of game.players) {

                if (player.connection == connections[myID]) {
                    indexGame = i;
                    indexPlayer = k;
                }
                console.log("playerID: " + player.id);
                console.log("myID: " +  myID)
                k++;
            }
            i++;
        }

        //_state.games[indexGame].players.splice(indexPlayer, 1);


        /*
        for (const game of _state.games) {
            const playerIndex = game.players.findIndex(player => player.id == myID);
            console.log("INDALOOP")
            console.log(myID);
            console.log(game.players);
            if (playerIndex !== -1) { // Player found in this game
                const player = game.players[playerIndex];
                console.log(`Removing player ${player.name} from game ${game.code}`);
                
                // Remove the player from the game
                game.players.splice(playerIndex, 1);
                
                // Broadcast updated lobby state to remaining players
                broadcast("playerLeft", { 
                    code: game.code, 
                    players: game.players,
                    playerID: myID
                });
                
                break; // Exit loop since the player has been found and removed
            }
        }*/
        
        delete connections[myID];
    });
    if(_state.games.length > 0) console.log(_state.games[0].players);
    return response;
}

function handleRequest (request) { 
    if (request.headers.get("upgrade") == "websocket") {
        return handleWebSocket(request);
    } else {
        return handleHTTPRequest(request);
    }
}

function getGame (socket, code) {
    let foundGame = _state.games.forEach( (game) => {
        return game.code == code;
    });

    send(socket, {event: "gotGame", data: code});

    return JSON.stringify(foundGame);
}

async function createGame (socket, genre, century, name) {
                      
    let newCode = generateGameCode();
    let questions = getQuestionsForGame(genre, century);
    console.log("century: " + century);

    let newPlayerID = generateConnectionID();

    let players = [
        {
            name: name,
            id: generateConnectionID(),
            connection: socket,
            role: "admin",
            points: 0,
            emoji: getRandomEmoji()
        }
    ]

    let response = {
        code: newCode,
        genre: genre,
        century: century,
        questions: questions,
        players: players
    };

    _state.games.push(response);

    socket.send(JSON.stringify({event: "gameCreated", data: response}));
    
    

    return JSON.stringify(response);
}

function changeName (socket, code, playerData, newName) {
    let game = _state.games.find( (game) => {
        return game.code == code;
    });

    console.log(code);

    let playerToPatch = game.players.find( (player) => {
        return playerData.id == player.id;
    });

    playerToPatch.name = newName;

    broadcast("playerChangedName", {code: code, player: playerToPatch});
    
}

function joinGame (socket, code) {
                    
    let newPlayer = {
        name: "",
        id: generateConnectionID(),
        connection: socket,
        role: "player",
        points: 0,
        emoji: getRandomEmoji()
    }
    
    let filteredGame = _state.games.find( (game) => {
        return game.code == code;
    } );

    if (filteredGame) {       
        filteredGame.players.push(newPlayer);
        socket.send(JSON.stringify({event: "renderLobby", data: filteredGame}));
        broadcast("playerJoined", {code: code, id: newPlayer.id, game: filteredGame});

    } else {
        console.log("Error: Game for code not found " + code);
    }
    

    return JSON.stringify(filteredGame);
}
    /*
function cleanupConnections() {
    for (const game of _state.games) {
        game.players = game.players.filter(player => {
            if (player.connection && player.connection.readyState === WebSocket.OPEN) {
                return true; // Keep valid connections
            } else {
                console.log(`Removing stale connection for player ID: ${player.id}`);
                return false; // Remove stale connections
            }
        });
    }
}
setInterval(cleanupConnections, 30000);
*/

Deno.serve(handleRequest);