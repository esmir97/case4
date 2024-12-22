import { serveDir, serveFile } from "jsr:@std/http/file-server";

let _state = {
    games: [
        
    ]
}

let connections = {};
let connectionID = 1;
let questionIndex = 0;
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

    if (typeof century != 'string') {
        century = century.toString();
        console.log("'Century' value is not a string! :)")
    }

    
    if (century != "mixed") {
        if (genre != "Best of decades") genre = genre.toLowerCase();
        
        let requestedQuestions = questions[genre][century];    

        for (let question of requestedQuestions) {
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
        console.log ("Comparing " + game.code + " AND " + data.code)
        return data.code == game.code;
    });

    console.log("HERES DA GAME");
    console.log(event);
    console.log(game);

    for (let player of game.players) {
        if (player.connection && player.connection.readyState === WebSocket.OPEN) {
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

        if (request.method == 'POST') {
            return new Response(JSON.stringify(response), options);
        }
    
        if (request.method == 'PATCH') {

        }

        if (request.method == 'DELETE') {
            
        }
    }

    return serveFile(request, './index.html');
}

function handleWebSocket (request) { //Säger vad som ska hända på serversidan med vår connection när vi använder WebSockets
    const { socket, response } = Deno.upgradeWebSocket(request);
    myID = generateConnectionID();
    console.log("myID CHANGED VALUE, NEW VALUE IS: " + myID);
    connections[myID] = socket;
    connectionID++;
    console.log("CONNECTIONID INCREMENTED: " + connectionID);
    
    socket.addEventListener("open", (event) => {
        console.log(`Connection ${myID} connected.`);
        
    });

    socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);

        switch(message.event) {

            case "playerLeft":
                playerLeft(message);
                break;
    
            case "changeName":
                changeName(socket, message.data.code, message.data.player, message.data.newName);
                break;

            case "createGame":
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

            case "startGame":
                startGame(socket, message.data);
                break;

            case "kickPlayer":
                kickPlayer(message.data);
                break;

            case "answerGiven":
                answerGiven(socket, message.data);
                break;

            case "timeIsUp":
                timeIsUp(message.data);
                break;
        }
    });
    
    socket.addEventListener("close", (event) => {
        console.log(`Connection ${myID} disconnected.`);
        console.log(myID);

        
        
        delete connections[myID];
    });
    /* if(_state.games.length > 0) console.log(_state.games[0].players); */
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

    let players = [
        {
            name: name,
            id: generateConnectionID(),
            connection: socket,
            role: "admin",
            points: 0,
            emoji: getRandomEmoji(),
            answerGiven: false,
            timeIsUp: false
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
        emoji: getRandomEmoji(),
        answerGiven: false,
        timeIsUp: false
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

function startGame(socket, code) {
    let foundGame = _state.games.find( (game) => {
        return game.code == code;
    });
    
    broadcast("startedGame", {code: foundGame.code, game: foundGame, question: foundGame.questions[questionIndex]});
}

function kickPlayer (data) {
    let playerID = data.id;
    let code = data.code;


    let game = _state.games.find( (game) => {
        return game.code == code;
    });

    let kickedPlayer;
    for (let i = 0; i < game.players.length; i++) {
        if (game.players[i].id == playerID) {
            kickedPlayer = game.players[i];
            game.players.splice(i, 1);
        }
    }

    send(kickedPlayer.connection, "youWereKicked", null);
    broadcast("someoneLeft", {code: code, playerID: playerID});
}

function playerLeft (data) {
    let code = data.data.code;
    let player = data.data.player;
    let games = _state.games;
    
    if (player.role === "admin") {
        let gameIndex = games.findIndex( (game) => {
            return game.code == code;
        });

        broadcast("endGame", {code: code});
        games.splice(gameIndex, 1);
    } else {
        let game = games.find( (game) => {
            return game.code == code;
        });

        let playerIndex = game.players.findIndex( (playerToRemove) => {
            return playerToRemove.id == player.id;
        });

        game.players.splice(playerIndex, 1);
        broadcast("someoneLeft", {code: code, playerID: player.id});
    }
}

function answerGiven (socket, data) {
    let code = data.code;
    let player = data.player;
    let answer = data.answer;
    let question = data.question;
    let timeLeft = data.timeLeft;
    let pointsEarned = 0;

    let game = _state.games.find( (game) => {
        return game.code == code;
    });

    let questionAnswered = game.questions.find( (questionObj) => {
        return questionObj.question.trim().toLowerCase() === question.trim().toLowerCase();
    });


    let playerInState = game.players.find( (playerInArray) => {
        return playerInArray.id == player.id;
    });


    playerInState.answerGiven = true;
    if (questionAnswered.correct == answer) {
        pointsEarned = timeLeft;
    }
    playerInState.points += pointsEarned;

    sortPlayers(game.players);
    if (checkNumberOfAnswers(game)) broadcast("endRound", {code: game.code, game: game});

    send(socket, "answerChecked");
}

function sortPlayers (playerArray) {
    playerArray.sort(sortNumbers);
    console.log("AFTER SORT");
    console.log(playerArray);
}

function sortNumbers (a, b) {
    return a.points - b.points;
}

function checkNumberOfAnswers (game) {
    let numberOfPlayers = game.players.length;
    let numberOfAnswers = 0;

    game.players.forEach( (player) => {
        if (player.answerGiven) numberOfAnswers++;
    });

    return numberOfPlayers == numberOfAnswers;
}

function timeIsUp (data) {
    let player = data.player;
    let code = data.code;

    let game = _state.games.find( (game) => {
        return game.code == code;
    });  

    let timeIsUpCounter = 0;
    let numberOfPlayers = game.players.length;

    game.players.forEach( (playerInState) => {
        if (playerInState.id == player.id) {
            playerInState.timeIsUp = true;
        }

        if (playerInState.timeIsUp) timeIsUpCounter++;
    });
    
    if (timeIsUpCounter == numberOfPlayers) {
        questionIndex++;
        broadcast("endRound", {code: game.code, game: game});
    }
    
}

Deno.serve(handleRequest);