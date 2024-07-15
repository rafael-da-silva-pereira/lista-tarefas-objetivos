//Variáveis necessárias para iniciar o CRUD em nosso localStorage.
let contador = 0;
let input = document.getElementById("inputTarefa");
let btnAdd = document.getElementById("btn-add");
let main = document.getElementById("areaLista");

// Carrega as tarefas do localStorage ao iniciar
window.onload = function () {
    carregarTarefas();
};

function addTarefa() {
    let valorInput = input.value;

    if (valorInput !== "" && valorInput !== null && valorInput !== undefined) {
        // Cria um novo objeto de tarefa
        let novaTarefa = {
            id: contador++,
            nome: valorInput,
            concluida: false
        };

        // Salva a nova tarefa no localStorage
        salvarTarefa(novaTarefa);

        // Adiciona a tarefa na lista
        renderizarTarefa(novaTarefa);

        input.value = "";
        input.focus();
    }
}

//A função deletar(id) 
function deletar(id) {

    // Remove a tarefa do localStorage chama a função removerTarefa(id)
    removerTarefa(id);

    // Remove a tarefa da lista
    var tarefa = document.getElementById(id);
    tarefa.remove();
}

//A função marcarTarefa(id)
function marcarTarefa(id) {
    // Obtém a tarefa do localStorage
    let tarefa = obterTarefa(id);

    // Altera o status da tarefa
    tarefa.concluida = !tarefa.concluida;

    // Salva a tarefa atualizada no localStorage
    salvarTarefa(tarefa);

    // Atualiza a visualização da tarefa na lista
    let item = document.getElementById(id);
    let icone = document.getElementById("icone_" + id);

    if (tarefa.concluida) {
        item.classList.add("clicado");
        icone.classList.remove("mdi-circle-outline");
        icone.classList.add("mdi-check-circle");
    } else {
        item.classList.remove("clicado");
        icone.classList.remove("mdi-check-circle");
        icone.classList.add("mdi-circle-outline");
    }
}

// Funções para gerenciar as tarefas no localStorage
function salvarTarefa(tarefa) {
    let tarefas = obterTarefas();
    tarefas[tarefa.id] = tarefa;
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

//Objetivo: Remover uma tarefa do localStorage com base em seu ID.
function removerTarefa(id) {
    let tarefas = obterTarefas();
    delete tarefas[id];
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function obterTarefa(id) {
    let tarefas = obterTarefas();
    return tarefas[id];
}

function obterTarefas() {
    let tarefas = JSON.parse(localStorage.getItem("tarefas")) || {};
    return tarefas;
}

// Função para renderizar as tarefas na lista uma por vez por isso tarefa e não tarefas no parâmetro
function renderizarTarefa(tarefa) {
    let novoItem = `<div id="${tarefa.id}" class="item ${tarefa.concluida ? 'clicado' : ''}">
        <div onclick="marcarTarefa(${tarefa.id})" class="item-icone">
            <i id="icone_${tarefa.id}" class="mdi ${tarefa.concluida ? 'mdi-check-circle' : 'mdi-circle-outline'}"></i>
        </div>
        <div onclick="marcarTarefa(${tarefa.id})" class="item-nome">
            ${tarefa.nome}
        </div>
        <div class="item-botao">
            <button onclick="deletar(${tarefa.id})" class="delete"><i class="mdi mdi-delete"></i> Deletar</button>
        </div>
    </div>`;

    main.innerHTML += novoItem;
}

// Carrega as tarefas do localStorage e renderiza na lista
function carregarTarefas() {
    let tarefas = obterTarefas();

    for (let id in tarefas) {
        renderizarTarefa(tarefas[id]);
    }
}

input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        btnAdd.click();
    }
});

let timerInterval;
let tempoTotal = 0;
let tempoPausado = 0; // Variável para armazenar o tempo quando pausado
let pausado = false; // Flag para controlar se o timer está pausado

function ativarContagem() {
    // Obter o tempo definido pelo usuário
    let inputTempo = document.getElementById('quantidadeTempo').value;
    let partesTempo = inputTempo.split(':');
    let horas = parseInt(partesTempo[0]);
    let minutos = parseInt(partesTempo[1]);

    // Converter horas e minutos para segundos
    tempoTotal = horas * 3600 + minutos * 60;

    // Atualizar o contador a cada segundo
    timerInterval = setInterval(atualizarTempo, 1000);

    // Desativar input de tempo enquanto o timer está ativo
    document.getElementById('quantidadeTempo').disabled = true;

    document.getElementById('começou').textContent = 'Vamos nessa!'
}

// function pararContagem() {
//     clearInterval(timerInterval);
//     document.getElementById('começou').textContent = 'Parou a atividade!'
// }

function pararContagem() {
    if (!pausado) {
        // Se não estiver pausado, pausar o timer
        clearInterval(timerInterval);
        tempoPausado = tempoTotal;
        pausado = true;
        document.getElementById('stopButton').textContent = 'Resume';
    } else {
        // Se estiver pausado, retomar o timer
        pausado = false;
        document.getElementById('stopButton').textContent = 'Pause';
        timerInterval = setInterval(atualizarTempo, 1000);
    }
}

function limparTempo() {
    clearInterval(timerInterval);
    tempoTotal = 0;
    document.getElementById('quantidadeTempo').disabled = false;
    document.getElementById('quantidadeTempo').value = '';
    document.getElementById('tempo').textContent = '00:00:00';
    document.getElementById('começou').textContent = '';
}

function atualizarTempo() {
    if (tempoTotal <= 0) {
        clearInterval(timerInterval);
        //alert('Tempo esgotado!');
        document.getElementById('quantidadeTempo').disabled = false;
    } else {
        tempoTotal--;
        let horas = Math.floor(tempoTotal / 3600);
        let minutos = Math.floor((tempoTotal % 3600) / 60);
        let segundos = tempoTotal % 60;

        // Formatar para hh:mm:ss
        let tempoFormatado =
            (horas < 10 ? '0' : '') + horas + ':' +
            (minutos < 10 ? '0' : '') + minutos + ':' +
            (segundos < 10 ? '0' : '') + segundos;

        document.getElementById('tempo').textContent = tempoFormatado;
    }
}