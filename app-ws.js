const WebSocket = require('ws');
const uuid = require('uuid');

const SITUACAO_ANDAMENTO = 1;
const SITUACAO_FINALIZADA = 2;

let clients = [];
let game_matches = new Map();
let waiting_queue = [];
 
function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}
 
function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    const json = JSON.parse(data);

    if (json.type == 'findLobby') {
        waiting_queue.push({
            name: json.username,
            websocket: ws
        });
        if(waiting_queue.length >= 2){
            var user1 = waiting_queue.shift()
            var user2 = waiting_queue.shift()
            let id  = uuid.v4();
            game_matches.set(id, {
                player1: {
                    username: user1.name,
                    websocket: user1.websocket,
                    myBoard: [],
                    foeBoard: []
                },
                player2: {
                    username: user2.name,
                    websocket: user2.websocket,
                    myBoard: [],
                    foeBoard: []
                },
                status: SITUACAO_ANDAMENTO,
	            winner: -1,
	            turn: 1
            })
            console.log(`Nome do player1: ${game_matches.get(id).player1.username}`)
            console.log(`Nome do player1: ${game_matches.get(id).player2.username}`)
            game_matches.get(id).player1.websocket.send(JSON.stringify({
                type: 'gameStart',
                foe: game_matches.get(id).player2.username,
                matchId: String(id),
                playerId: 1
            }))
            game_matches.get(id).player2.websocket.send(JSON.stringify({
                type: 'gameStart',
                foe: game_matches.get(id).player1.username,
                matchId: String(id),
                playerId: 2
            }))
        } else {
            ws.send(JSON.stringify({
                type: 'lobbyWaiting',
            }))
        }
    } else if (json.type == 'message'){
        game_matches.get(json.matchId).player1.websocket.send(JSON.stringify({
            type: 'broadcast',
            username: json.username,
            message: json.message
        }));
        game_matches.get(json.matchId).player2.websocket.send(JSON.stringify({
            type: 'broadcast',
            username: json.username,
            message: json.message
        }));
    } else if (json.type == 'shoot'){
        //if(game_matches.get(json.matchId).turn == json.playerId){
            if(json.playerId == 1){
                game_matches.get(json.matchId).player2.websocket.send(JSON.stringify({
                    type: 'bombed',
                    posX: json.posX,
                    posY: json.posY
                }));
            } else {
                game_matches.get(json.matchId).player1.websocket.send(JSON.stringify({
                    type: 'bombed',
                    posX: json.posX,
                    posY: json.posY
                }));
            }
        //}
    }

    ws.send(JSON.stringify({
        type: 'confirmation',
        data: 'Recebido'
    }));

    
    //console.log('streaming to', clients.length, 'clients');
    /*
    for (const client of clients) {
        console.log('envio?', data.toString());
        client.send(JSON.stringify({
            type: 'broadcast',
            username: json.username,
            message: json.message
        }));
    }
    */
}

function onClose(ws, reasonCode, description) {
    console.log(`onClose: ${reasonCode} - ${description}`);
    const index = clients.indexOf(ws);
    if (index > -1) {
        clients.splice(index, 1);
    }
}
 
function onConnection(ws, req) {
    clients.push(ws);
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    ws.on('close', (reasonCode, description) => onClose(ws, reasonCode, description));
    ws.send(JSON.stringify({
        type: 'connection',
        data: 'Bem vindo'
    }))
    console.log(`onConnection`);
}
 
module.exports = (server) => {
    const wss = new WebSocket.Server({
        server
    });
 
    wss.on('connection', onConnection);
 
    console.log(`App Web Socket Server is running!`);
    return wss;
}