import { serveDir, serveFile } from "jsr:@std/http/file-server";

let _state = {
    games: [
        {
            "code": 0,
            "genre": "poop",
            "century": "lol",
            "questions": [
                {
                    "question": "What was the original name of Pink Floyd?",
                    "options": ["The Pink Floyd Sound", "Sigma 6", "The Tea Set", "All of the above"],
                    "correct": "All of the above"
                }
            ]
        }
    ]
}



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

    //Create for-loop to fill questions-array in newGame, also put database.json in assets to have constant access
    
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
            //Alla "Join game" ska ske via GET, kolla strängen som skickas med, om denna finns i servern, connecta, annars ge user-error

            const gameCode = await request.json();

            let filteredGame = _state.games.filter( (game) => {
                return game.code == gameCode;
            } );

            if (filteredGame) {
                return new Response("hejsan!!!!!", options);
            }

            return new Response(JSON.stringify(dataToSave), options);
        }

        if (request.method == 'POST') {
            console.log("we're deeper");

            const POSTstring = await request.json();
            console.log(POSTstring);

            if (POSTstring == "code") {                                     //POST-rqst med strängen "code" skapas ett nytt game och koden returneras
                                                                            
                let newCode = generateGameCode();
                

                return new Response(JSON.stringify(newCode), options);      
            } else {
                console.log("good job with the codes bozo");
                return new Response(JSON.stringify({ newCode }), options);
            }
        }

        if (request.method == 'DELETE') {
            

            //När en spelare lämnar ett spel/blir kickad, kör en DELETE på den spelaren från deras lobby
        }
    }

    return serveFile(request, './index.html');
}

let lobbies = 
[/*
    {
        "gameCode": XXXX,
        "connectedPlayers": [
            {
                "playerID": 139,
                "moderator": true
            },
            {
                "playerID": 29,
                "moderator": false
            }
        ]
    }*/
];

let connections = {};
let connectionID = 1;

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