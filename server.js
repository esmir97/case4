import { serveDir, serveFile } from "jsr:@std/http/file-server";

let _state = {
    games: [
        
    ]
}

let connections = {};
let connectionID = 1;

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

        questionsToChooseFrom = [...requestedQuestions];
        
    } else {
        let questionGenre = questions[genre];

        for (let centuryKey in questionGenre) {
            questionsToChooseFrom.push(...questionGenre[centuryKey])
        }
    }

    let questionPool = [...questionsToChooseFrom];

    while (chosenQuestions.length < 20 && questionPool.length > 0) {

        let randomIndex = Math.floor(Math.random() * questionPool.length);
        let [selectedQuestion] = questionPool.splice(randomIndex, 1);
        chosenQuestions.push(selectedQuestion);
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
    let myID = connectionID;
    connections[myID] = socket;
    connectionID++;
    
    socket.addEventListener("open", (event) => {
        console.log(`Connection ${myID} connected.`);
        send(socket, "connection", myID);
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
                console.log("ID HERE");
                console.log(message.data.playerID);
                createGame(socket, message.data.genre, message.data.century, message.data.name, message.data.playerID);
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
                startGame(message.data);
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

            case "continueQuiz":
                continueQuiz(message.data);
                break;
        }
    });
    
    socket.addEventListener("close", (event) => {
        console.log(`Connection ${myID} disconnected.`);
        console.log(myID);
        handleDisconnect(socket);
        
        
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

async function createGame (socket, genre, century, name, playerID) {
                      
    let newCode = generateGameCode();
    let questions = getQuestionsForGame(genre, century);


    let players = [
        {
            name: name,
            id: playerID,
            connection: socket,
            role: "admin",
            points: 0,
            emoji: getRandomEmoji(),
            answerGiven: false,
            timeIsUp: false
        }
    ]

    let playerName = players[0].name;

    if (playerName == "Sebbe" || playerName == "sebbe") {
        players[0].emoji = "🐶";
    }

    let response = {
        code: newCode,
        genre: genre,
        century: century,
        questions: questions,
        players: players,
        questionIndex: 0
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

    if (playerToPatch.name == "Sebbe" || playerToPatch.name == "sebbe") {
        playerToPatch.emoji = "🐶";
    }
    console.log("patching");
    console.log(playerToPatch);
    broadcast("playerChangedName", {code: code, player: playerToPatch});
    
}

function joinGame (socket, data) {
    let code = data.code;
    let playerID = data.playerID
    console.log("ID IS HERE");
    console.log(playerID);
                    
    let newPlayer = {
        name: "",
        id: playerID,
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

function startGame(code) {
    let foundGame = _state.games.find( (game) => {
        return game.code == code;
    });

    if (foundGame) {
        broadcast("startedGame", {code: foundGame.code, game: foundGame, question: foundGame.questions[foundGame.questionIndex], questionIndex: foundGame.questionIndex});
    } else {
        return;
    }   
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

        broadcast("quitGame", {code: code});
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
    let answerCheck = false;

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
        pointsEarned = Math.floor(timeLeft);
        answerCheck = true;
    }
    playerInState.points += pointsEarned;

    sortPlayers(game.players);

    send(socket, "answerChecked", {answerGiven: answerCheck, pointsEarned: pointsEarned});
    if (checkNumberOfAnswers(game)){
        broadcast("endRound", {code: game.code, game: game, question: questionAnswered});

        if (game.questionIndex < 19) {
            setTimeout(() => { 
                for (let player of game.players) {
                    player.answerGiven = false;
                    player.timeIsUp = false;
                }
    
                game.questionIndex++;
                continueQuiz(game.code);
                console.log("sending question number" + game.questionIndex);
              }, 10000);
        } else {
            broadcast("endGame", {code: game.code, game: game});
        }
    } 

}

function sortPlayers (playerArray) {
    return playerArray.sort(sortNumbers);
}

function sortNumbers (a, b) {
    return b.points - a.points;
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
        broadcast("endRound", {code: game.code, game: game, question: game.questions[game.questionIndex]});

        if (game.questionIndex < 19) {
            setTimeout(() => { 
                for (let player of game.players) {
                    player.answerGiven = false;
                    player.timeIsUp = false;
                }
    
                game.questionIndex++;
                continueQuiz(game.code);
                console.log("sending question");
              }, 10000);
        } else {
            broadcast("endGame", {code: game.code, game: game});
        }
    }
}

function handleDisconnect (socket) {
    let gameFound = null;
    let playerFound = null;
    console.log("REMOVING PLAYER ");
    console.log(socket);
    for (const game of _state.games) {
        const playerIndex = game.players.findIndex(player => player.connection === socket);

        if (playerIndex !== -1) {
            gameFound = game;
            playerFound = game.players[playerIndex];
            
            game.players.splice(playerIndex, 1);
            break;
        }
    }

    if (gameFound && playerFound) {
        console.log(`Player ${playerFound.id} removed from game ${gameFound.code}.`);

        broadcast("someoneLeft", { code: gameFound.code, playerID: playerFound.id });

        if (playerFound.role === "admin") {
            console.log(`Admin disconnected. Ending game ${gameFound.code}.`);
            broadcast("quitGame", { code: gameFound.code });
            
            const gameIndex = _state.games.indexOf(gameFound);
            _state.games.splice(gameIndex, 1);
        }
    } else {
        console.log(`Connection ${connectionID} disconnected but no associated game/player found.`);
    }
}

function continueQuiz (code) {
    startGame(code);
    console.log(code);
}

Deno.serve(handleRequest);