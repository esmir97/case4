import { serveDir, serveFile } from "jsr:@std/http/file-server";

let _state = {
    games: [
        
    ]
}

let connections = {};
let connectionID = 1;



const testData = await Deno.readTextFile("./database.json");

function generateGameCode (n = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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


async function handleHTTPRequest (request) { //Säger till vad som ska hända när vi använder vanlig HTTP

    const pathname = new URL(request.url).pathname;

    if (pathname.startsWith('/static')) {
        return serveDir(request, {
            fsRoot: 'assets',
            urlRoot: 'static'
        });
    }

    if (pathname == '/api/test') {
        console.log("we're in!!!");
        const options = {
            headers: { "Content-Type": "application/json"}
        }

        if (request.method == 'GET') { //GET entire game obj with gameCode
            const GETdata = await request;
            let code = GETdata.url.slice(GETdata.url.length - 6);

            let game = _state.games.find( (game) => {
                return game.code == code;
            });
            console.log(GETdata.code);
            if (game) {
                console.log("RETURNING");
                return new Response(JSON.stringify(game), options);

            } else {
                return new Response(JSON.stringify("Game doesn't exist"))
            }

        }

        if (request.method == 'POST') {
            console.log("76");
            const POSTdata = await request.json();
            
            if (POSTdata.genre) { //Create Game
                            console.log("80");                                                  
                let newCode = generateGameCode();
                console.log("connectionID: " + connectionID)
                let questions = getQuestionsForGame(POSTdata.genre, POSTdata.century);
                console.log(connections);

                let players = [
                    {
                        name: POSTdata.name,
                        id: connectionID - 1,
                        connection: connections[myID],
                        role: "admin",
                        points: 0,
                    }
                ]

                let response = {
                    code: newCode,
                    genre: POSTdata.genre,
                    century: POSTdata.century,
                    questions: questions,
                    players: players
                };

                _state.games.push(response);
                
                
                return new Response(JSON.stringify(response), options); 

            } else if (POSTdata.code) { // Join Game
                let code = POSTdata.code;
                
                let newPlayer = {
                    name: "",
                    id: connectionID - 1,
                    connection: connections[myID],
                    role: "player",
                    points: 0
                }  
                console.log(newPlayer);
                
                let filteredGame = _state.games.find( (game) => {
                    if (game.code == code) {
                        return true;
                    }
                } );

                if (filteredGame) {       
                    filteredGame.players.push(newPlayer);
                    broadcast("updateLobby", filteredGame.code);
                    return new Response(JSON.stringify(filteredGame), options);
                } else {
                    return new Response(JSON.stringify("game doesn't exist"), options);
                }
    
            } else {
                console.log("good job with the codes bozo");
                return new Response(JSON.stringify({ error: "wrong keys in rqst" }), options);
            }
            
        }

        if (request.method == 'PATCH') {
            const PATCHdata = await request.json();

            let game = _state.games.find( (game) => {
                return game.code == PATCHdata.code;
            });

            let playerToPatch = game.players.find( (player) => {
                return PATCHdata.player.id == player.id;
            });

            playerToPatch.name = PATCHdata.name;

            broadcast("updateLobby", game.code);
            return new Response(JSON.stringify(playerToPatch), options);
        }

        if (request.method == 'DELETE') {
            

            //När en spelare lämnar ett spel/blir kickad, kör en DELETE på den spelaren från deras lobby
        }
    }

    return serveFile(request, './index.html');
}

function getQuestionsForGame(genre, century) { //Randomises an array with 20 questions depending on genre/century
    let questions = JSON.parse(testData);
    let questionsToChooseFrom = [];
    let chosenQuestions = [];
    century = century.toString();
    
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
    
    console.log("it worked!!");
    return chosenQuestions;
}

function send(socket, event, data) {
    console.log(socket, event, data);
    socket.send(JSON.stringify({ event, data }));
  }

function broadcast(event, data) {
    let game = _state.games.find( (game) => {
        return data == game.code;
    });

    console.log("BROADCASTIIIING");
    console.log(game);
    for (const player of game.players) {
        if (player.connection && player.connection.readyState === WebSocket.OPEN) {
            send(player.connection, event, data);
        } else {
            console.log("Player connection not found for player ID: " + player.id);
        }
    }
  }


let myID = null;

function handleWebSocket (request) { //Säger vad som ska hända på serversidan med vår connection när vi använder WebSockets
    const { socket, response } = Deno.upgradeWebSocket(request);

    myID = connectionID;
    connections[myID] = socket;
    connectionID++;
    
    
    socket.addEventListener("open", (event) => {
        console.log(`Connection ${myID} connected.`);
        socket.send(myID);
        console.log(connections);

        console.log(connections[myID]);

    });

    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);

        switch(message.event) {
            case "updateUI":
                broadcast(event, message);
                break;
        }
        console.log(event.data);
        
    });
    
    socket.addEventListener("close", (event) => {
        console.log(`Connection ${myID} disconnected.`);

        _state.games.forEach( (game) => {
            for (let i = 0; i > game.players.length; i++) {
                console.log("myID: " + myID + " , player: " + game.players[i]);
                if (game.players[i].id == myID) {
                    game.players.splice(i, 1);
                    console.log(game.players[i] + " was deleted");
                    broadcast(event, game.code);
                }
            }
        });
        
        delete connections[myID];
    });
    
    return response;
}

function handleRequest (request) { 
    if (request.headers.get("upgrade") == "websocket") {
        return handleWebSocket(request);
    } else {
        return handleHTTPRequest(request);
    }
}

Deno.serve(handleRequest);