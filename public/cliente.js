const ws = new WebSocket("ws://" + location.host);
let msg;
let chat;
let username; // nome do usuário
let foe_username; // nome do oponente
let myMatch; //id da partida do usuário
let myId; //id do usuario
//inicializar barcos
var B1 = [`1`,`1`,`1`,`1`,`1`]
var B2 = [`1`,`1`,`1`,`1`]
var B3 = [`1`,`1`,`1`,`1`]
var B4 = [`1`,`1`,`1`]
var B5 = [`1`,`1`,`1`]
var B6 = [`1`,`1`,`1`]
var B7 = [`1`,`1`]
var B8 = [`1`,`1`]
var B9 = [`1`,`1`]
var B10 = [`1`]
var B11 = [`1`]
var B12 = [`1`]
var B13 = [`1`]
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
    } else if (json.type == 'gameStart') {
        myMatch = json.matchId
        myId = json.playerId

        var fbt = document.getElementById('foeBoardTitle')
        foe_username = json.foe
        fbt.innerHTML += `: <strong>${foe_username}</strong>`
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

function verifyPos(targerS)              //Verificar oq acerto prov vai ficar dentro da func shoot(tbm podia
{                                        //colocar markboard dentro dela pra personalizar a cor dos locais
    switch(targerS)                      //por ex: vermelho-acerto / azul mais forte-agua)
    {
        case`0`:
        alert(`Agua`)
        return `A`
        case`1`:
        alert(`BOOM!`)
        //reduceHP(1)
        return `X`
        case`2`:
        alert(`BOOM!`)
        //reduceHP(2)
        return `X`
        case`3`:
        alert(`BOOM!`)
        //reduceHP(3)
        return `X`
        case`4`:
        alert(`BOOM!`)
        //reduceHP(4)
        return `X`
        case`5`:
        alert(`BOOM!`)
        //reduceHP(5)
        return `X`
        case`6`:
        alert(`BOOM!`)
        //reduceHP(6)
        return `X`
        case`7`:
        alert(`BOOM!`)
        //reduceHP(7)
        return `X`
        case`8`:
        alert(`BOOM!`)
        //reduceHP8)
        return `X`
        case`9`:
        alert(`BOOM!`)
        //reduceHP(9)
        return `X`
        case`10`:
        alert(`BOOM!`)
        //reduceHP(10)
        return `X`
        case`11`:
        alert(`BOOM!`)
        //reduceHP(11)
        return `X`
        case`12`:
        alert(`BOOM!`)
        //reduceHP(12)
        return `X`
        case`13`:
        alert(`BOOM!`)
        //reduceHP(13)
        return `X`
        //ADICIONAR CASO DE ACERTAR LOCAL JA MARCADO COM X OU A? OU BLOQUEAR DISSO ACONTECER?
    }
}

function reduceHP(shipID)  //se iniciar todos os barcos como B+numero talvez de pra evitar outro switch
{
//  var bAcertado=B+shipID
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

