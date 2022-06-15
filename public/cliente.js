const ws = new WebSocket("ws://" + location.host);
let msg;
let chat;
let instruction;
let but; //botão de buscar partida
let confirmField;
let username; // nome do usuário
let foe_username; // nome do oponente
let myMatch; //id da partida do usuário
let myId; //id do usuario
//inicializar barcos
var B1 = []//[`1`, `1`, `1`, `1`, `1`]
var B2 = []//[`1`, `1`, `1`, `1`]
var B3 = []//[`1`, `1`, `1`, `1`]
var B4 = []//[`1`, `1`, `1`]
var B5 = []//[`1`, `1`, `1`]
var B6 = []//[`1`, `1`, `1`]
var B7 = []//[`1`, `1`]
var B8 = []//[`1`, `1`]
var B9 = []//[`1`, `1`]
var B10 = []//[`1`]
var B11 = []//[`1`]
var B12 = []//[`1`]
var B13 = []//[`1`]
//fim dos barcos

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
        but.innerText = 'Aguardando outro jogador'
        but.removeAttribute('onClick')
    } else if (json.type == 'gameStart') {
        myMatch = json.matchId
        myId = json.playerId
        foe_username = json.foe

        alert('Game start!')
        but.remove()
        planningBoard()
        instruction.innerHTML = '<strong>Posicione o porta-aviões!<strong>'
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

function findLobby() {
    // verifica se o campo de texto da mensagem está vazio
    if (username.value == "") {
        alert("Por favor, digite um nome de usuário!");
        username.focus();
        return;
    }

    ws.send(JSON.stringify({
        type: 'findLobby',
        username: username.value
    }));
}

// Função para enviar mensagem que é executada quando se aperta Enter no campo de texto da mensagem
function pressionouTecla(event) {
    if (event.keyCode == 13) { // 13 é o código para a tecla Enter
        send(); // Envia a mensagem
    }
}

function planningBoard() {
    var board = document.getElementById('planningBoard')
    for (let row = 0; row < 10; row++) {
        var current_row = document.createElement('div')
        current_row.setAttribute('class', 'board-row')
        for (let col = 0; col < 10; col++) {
            var current_cell = document.createElement('div')
            current_cell.setAttribute('class', 'cell')
            current_cell.setAttribute('onClick', `placeShip(${row}, ${col})`)
            current_row.appendChild(current_cell)
        }
        board.appendChild(current_row)
    }
}

function generateBoards() {
    var myBoard = document.getElementById('myBoard')
    myBoard.innerHTML = '<p>Minha esquadra</p>'
    var foeBoard = document.getElementById('foeBoard')
    foeBoard.innerHTML = '<p id="foeBoardTitle">Esquadra do adversário</p>'
    for (let index = 0; index < 2; index++) {
        for (let row = 0; row < 10; row++) {
            var current_row = document.createElement('div')
            current_row.setAttribute('class', 'board-row')
            for (let col = 0; col < 10; col++) {
                var current_cell = document.createElement('div')
                if (index == 0) {
                    current_cell.setAttribute('class', 'my-cell')
                } else {
                    current_cell.setAttribute('class', 'foe-cell')
                    current_cell.setAttribute('onClick', `shoot(${row}, ${col})`)
                }
                current_row.appendChild(current_cell)
            }
            if (index == 0) {
                myBoard.appendChild(current_row)
            } else {
                foeBoard.appendChild(current_row)
            }
        }
    }
    var fbt = document.getElementById('foeBoardTitle')
    fbt.innerHTML += `: <strong>${foe_username}</strong>`
}

function placeShip(x, y){
    if(B1.length < 5){
        markBoard(x, y, 'cell', '1')
        B1.push('1')
        if(B1.length == 5){
            instruction.innerHTML = '<strong>Posicione o primeiro Encouraçado<strong>'
        }
    } else if (B2.length < 4) {
        markBoard(x, y, 'cell', '2')
        B2.push('1')
        if(B2.length == 4){
            instruction.innerHTML = '<strong>Posicione o segundo Encouraçado<strong>'
        }
    } else if (B3.length < 4) {
        markBoard(x, y, 'cell', '3')
        B3.push('1')
        if(B3.length == 4){
            instruction.innerHTML = '<strong>Posicione o primeiro hidroavião<strong>'
        }
    } else if (B4.length < 3) {
        markBoard(x, y, 'cell', '4')
        B4.push('1')
        if(B4.length == 3){
            instruction.innerHTML = '<strong>Posicione o segundo hidroavião<strong>'
        }
    } else if (B5.length < 3) {
        markBoard(x, y, 'cell', '5')
        B5.push('1')
        if(B5.length == 3){
            instruction.innerHTML = '<strong>Posicione o terceiro hidroavião<strong>'
        }
    } else if (B6.length < 3) {
        markBoard(x, y, 'cell', '6')
        B6.push('1')
        if(B6.length == 3){
            instruction.innerHTML = '<strong>Posicione o primeiro crusador<strong>'
        }
    } else if (B7.length < 2) {
        markBoard(x, y, 'cell', '7')
        B7.push('1')
        if(B7.length == 2){
            instruction.innerHTML = '<strong>Posicione o segundo crusador<strong>'
        }
    } else if (B8.length < 2) {
        markBoard(x, y, 'cell', '8')
        B8.push('1')
        if(B8.length == 2){
            instruction.innerHTML = '<strong>Posicione o terceiro crusador<strong>'
        }
    } else if (B9.length < 2) {
        markBoard(x, y, 'cell', '9')
        B9.push('1')
        if(B9.length == 2){
            instruction.innerHTML = '<strong>Posicione o primeiro submarino<strong>'
        }
    } else if (B10.length < 1) {
        markBoard(x, y, 'cell', '10')
        B10.push('1')
        instruction.innerHTML = '<strong>Posicione o segundo submarino<strong>'
    } else if (B11.length < 1) {
        markBoard(x, y, 'cell', '11')
        B11.push('1')
        instruction.innerHTML = '<strong>Posicione o terceiro submarino<strong>'
    } else if (B12.length < 1) {
        markBoard(x, y, 'cell', '12')
        B12.push('1')
        instruction.innerHTML = '<strong>Posicione o quarto submarino<strong>'
    } else if (B13.length < 1) {
        markBoard(x, y, 'cell', '13')
        B13.push('1')
        instruction.innerHTML = '<strong>Todos os barcos foram colocados<strong>'
        var confirmButton = document.createElement('button')
        confirmButton.setAttribute('onClick', 'finishPlacement()')
        confirmButton.innerHTML = 'Confirmar'
        confirmField.appendChild(confirmButton)
    } else {
        alert('Todos os barcos foram colocados')
    }
}

function finishPlacement(){
    var board = document.getElementById('planningBoard')
    board.innerHTML = ''
    generateBoards()
}

function shoot(x, y) {
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

function verifyPos(targerS)              //Verificar oq acerto prov vai ficar dentro da func shoot(tbm podia
{                                        //colocar markboard dentro dela pra personalizar a cor dos locais
    switch (targerS)                      //por ex: vermelho-acerto / azul mais forte-agua)
    {
        case `0`:
            alert(`Agua`)
            return `A`
        case `1`:
            alert(`BOOM!`)
            reduceHP(B1)
            return `X`
        case `2`:
            alert(`BOOM!`)
            reduceHP(B2)
            return `X`
        case `3`:
            alert(`BOOM!`)
            reduceHP(B3)
            return `X`
        case `4`:
            alert(`BOOM!`)
            reduceHP(B4)
            return `X`
        case `5`:
            alert(`BOOM!`)
            reduceHP(B5)
            return `X`
        case `6`:
            alert(`BOOM!`)
            reduceHP(B6)
            return `X`
        case `7`:
            alert(`BOOM!`)
            reduceHP(B7)
            return `X`
        case `8`:
            alert(`BOOM!`)
            reduceHP(B8)
            return `X`
        case `9`:
            alert(`BOOM!`)
            reduceHP(B9)
            return `X`
        case `10`:
            alert(`BOOM!`)
            reduceHP(B10)
            return `X`
        case `11`:
            alert(`BOOM!`)
            reduceHP(B11)
            return `X`
        case `12`:
            alert(`BOOM!`)
            reduceHP(B12)
            return `X`
        case `13`:
            alert(`BOOM!`)
            reduceHP(B13)
            return `X`
        //ADICIONAR CASO DE ACERTAR LOCAL JA MARCADO COM X OU A? OU BLOQUEAR DISSO ACONTECER?
    }
}

function reduceHP(shipID)  //diminui vida do barco e checa se afundou
{
    let y = 0
    let z = 0
    for (let x = 0; x < shipID.lenght; x++) {
        if (shipID[x] == `1` && y == 0) {
            shipID[x] = `0`
            y = 1
        }
        else if (shipID[x] == `1` && y == 1) {
            z = 1
        }
    }
    if (y == 1 && z == 0) {
        sinkShip(shipID.lenght)
    }
}

function sinkShip(tamBarco) //manda mensagem de qual barco afundou
{
    switch (tamBarco) {
        case `5`:
            alert(`Voce afundou o Porta-aviões!`)
            break
        case `4`:
            alert(`Voce afundou um Encouraçado!`)
        case `3`:
            alert(`Voce afundou um Hidro Hidroavião!`)
        case `2`:
            alert(`Voce afundou um Hidro Cruzador!`)
        case `1`:
            alert(`Voce afundou um submarino!`)
    }
}

function markBoard(x, y, typeCell, text = '') {
    var cells = document.getElementsByClassName(typeCell)
    var cell = cells[x * 10 + y]
    cell.style.background = '#529086';
    if(typeCell == 'cell'){
        cell.removeAttribute('onClick')
        cell.innerHTML = text
    }
}

window.addEventListener('load', (e) => {
    console.log('load')
    username = document.getElementById('username');
    msg = document.getElementById('message');
    chat = document.getElementById('chat');
    instruction = document.getElementById('instruction');
    confirmField = document.getElementById('confirmField');
    but = document.getElementById('find')
});

