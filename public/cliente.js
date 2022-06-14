const ws = new WebSocket("ws://" + location.host);
let msg;
let chat;
let username; // nome do usuário
let myChat; //id da partida do usuário
let myId; //id do usuario

ws.onmessage = (event) => {        
    console.log(event.data);
    const json = JSON.parse(event.data);
    console.log('json', json);
    if (json.type == 'broadcast') {
        // cria a mensagem na tela.
        const divMensagemLinha = document.createElement("DIV");
        const divMensagemNomePessoa = document.createElement("DIV");
        const divMensagemConteudo = document.createElement("DIV");
        
        divMensagemNomePessoa.className = "nome-pessoa";
        
        if (json.username == username.value) {
            divMensagemLinha.className = "mensagem-usuario";
            divMensagemNomePessoa.innerHTML = "Você: ";
        } else {
            divMensagemLinha.className = "mensagem-outro";
            divMensagemNomePessoa.innerHTML = `${json.username}: `;
        } 

        divMensagemConteudo.innerHTML = json.message;

        divMensagemLinha.appendChild(divMensagemNomePessoa);
        divMensagemLinha.appendChild(divMensagemConteudo);
        
        chat.appendChild(divMensagemLinha);        
    } else if (json.type == 'lobbyWaiting') {
        alert('Aguardando outro jogador!')
    } else if (json.type == 'gameStart') {
        myMatch = json.matchId
        myId = json.playerId
        alert('Game start!')
    } else if (json.type == 'bombed') {
        alert(`Bombardeado na posição [${json.posX}, ${json.posY}]!`)
        markBoard(json.posX, json.posY, 'my-cell')
    }
}

// Função para enviar mensagem que é executada quando se clica no botão
function send() {
    // verifica se o campo de texto da mensagem está vazio
    if (username.value == "") {
        alert("Por favor, digite um nome de usuário!");
        username.focus();
        return;
    }

    // verifica se a mensagem está vazia
    if (msg.value == "") {
        alert("Por favor, digite uma mensagem!");
        msg.focus();
        return;
    }

    // Envia o texto digitado para o servidor pelo WebSocket (Um objeto convertido para string)
    ws.send(JSON.stringify({
        type: 'message', 
        matchId: myMatch,
        username: username.value,
        message: msg.value
    }));

    // Limpa o campo de texto da mensagem
    msg.value = '';
    // foca no campo de texto da mensagem para digitar a próxima
    msg.focus();
}

function findLobby(){
    ws.send(JSON.stringify({
        type: 'findLobby'
    }));
}

// Função para enviar mensagem que é executada quando se aperta Enter no campo de texto da mensagem
function pressionouTecla(event) {
    if (event.keyCode == 13) { // 13 é o código para a tecla Enter
        send(); // Envia a mensagem
    }
}

function generateBoard(){
    var myBoard = document.getElementById('myBoard')
    var foeBoard = document.getElementById('foeBoard')
    for (let index = 0; index < 2; index++) {
        for (let row = 0; row < 10; row++) {
            var current_row = document.createElement('div')
            current_row.setAttribute('class','board-row')
            for (let col = 0; col < 10; col++) {
                var current_cell = document.createElement('div')
                if(index == 0){
                    current_cell.setAttribute('class','my-cell')
                } else {
                    current_cell.setAttribute('class','foe-cell')
                    current_cell.setAttribute('onClick', `shoot(${row}, ${col})`)
                }
                current_row.appendChild(current_cell)
            }
            if(index == 0){
                myBoard.appendChild(current_row)
            } else {
                foeBoard.appendChild(current_row)
            }
        }
    }
}

function shoot(x, y){
    alert(`Atirou na posição [${x}, ${y}]!`)
    markBoard(x, y, 'foe-cell')

    ws.send(JSON.stringify({
        type: 'shoot', 
        matchId: myMatch,
        playerId: myId,
        posX: x,
        posY: y
    }));
}

function markBoard(x, y, typeCell){
    var cells = document.getElementsByClassName(typeCell)
    var cell = cells[x*10+y]
    cell.style.background = '#529086';
}

function colocarBarcos(){
    var form = document.getElementById('form')
    var instruction = document.getElementById('instruction')
    instruction.innerText = "Coloque as posições do porta-aviões"
    for (let index = 0; index < 5; index++) {
        var current_field = document.createElement('input')
    }
}

window.addEventListener('load', (e) => {
    console.log('load')
    username = document.getElementById('username');
    msg = document.getElementById('message');
    chat = document.getElementById('chat');
});

