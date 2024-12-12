import { serveDir, serveFile } from "jsr:@std/http/file-server";

let _state = {
    games: [
        
    ]
}

let connections = {};
let connectionID = 1;

let dataToSave = [];

const testData = await Deno.readTextFile("./database.json");


if (testData != "") {
    dataToSave = JSON.parse(testData);
}

//Använd inte, behövs inte längre
async function addGameToState (code) {
    let newGame = {
        code: code,
        genre: "X",
        century: "Y",
        questions: []
    }
    
    let questions = Deno.readTextFile(database.json);

    _state[entity].push();
}

function generateGameCode (n = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < n; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    let codeDupeCheck = _state.games.find( (game) => {
        return game.id == result;
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

        if (request.method == 'GET') {
            //  Use-case: TBD
        }

        if (request.method == 'POST') {
            console.log("76");
            const POSTdata = await request.json();

            if (POSTdata.genre) { //Create Game
                            console.log("80");                                                  
                let newCode = generateGameCode();
                
                let questions = getQuestionsForGame(POSTdata.genre, POSTdata.century);

                let players = [
                    {
                        name: POSTdata.name,
                        id: connectionID,
                        role: "admin",
                        points: 0
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
                console.log(_state.games);
                
                return new Response(JSON.stringify(response), options); 

            } else if (POSTdata.code) { // Join Game
                console.log("108")
                let code = POSTdata.code;
console.log(POSTdata.code);
                let newPlayer = {
                    name: "",
                    id: connectionID,
                    role: "player",
                    points: 0
                }  

                let filteredGame = null;
                filteredGame = _state.games.find( (game) => {
                    if (game.code == code) {
                        game.players.push(newPlayer);
                        return true;
                    }
                } );
    console.log(filteredGame);
                if (filteredGame !== null) {            
                    return new Response(JSON.stringify(filteredGame), options);
                } else {
                    return new Response("post error cuuh", options);
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
    console.log(game);
            let playerToPatch = game.players.find( (player) => {
                return PATCHdata.player.id == player.id;
            });

            playerToPatch.name = PATCHdata.name;

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
        console.log("genre:")

        let questionsGenre = questions[genre];
        console.log(questionsGenre);
        let questionCentury = questionsGenre[century];

        for (let question of questionCentury) {
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




function handleWebSocket (request) { //Säger vad som ska hända på serversidan med vår connection när vi använder WebSockets
    const { socket, response } = Deno.upgradeWebSocket(request);

    let myID = connectionID;
    
    connectionID++;
    socket.addEventListener("open", (event) => {
        console.log(`Connection ${myID} connected.`);
        socket.send(myID);
        connections[myID] = socket;
        console.log(connections);
    });

    socket.addEventListener("message", (event) => {
        console.log(event.data);
    });
    
    socket.addEventListener("close", (event) => {
        console.log(`Connection ${myID} disconnected.`);
        delete connections[myID];
    });
    
    return response;
}

function handleRequest (request) { //Använder denna som mellanhand, är det HTTP eller WS? Transferar till rätt funktion beroende på protokoll.
    if (request.headers.get("upgrade") == "websocket") {
        return handleWebSocket(request);
    } else {
        return handleHTTPRequest(request);
    }
}

Deno.serve(handleRequest);