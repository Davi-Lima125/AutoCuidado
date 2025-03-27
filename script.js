// Armazena os intervalos para evitar execuções duplicadas
let intervalosAtivos = {};

function salvarBarras() {
    let barras = [];
    document.querySelectorAll(".progress-container").forEach((progressBar, index) => {
        let nome = document.querySelectorAll("h3")[index].textContent;
        let tempo = parseInt(progressBar.dataset.intervalo);
        let valor = parseInt(progressBar.value);
        let inicio = parseInt(progressBar.dataset.inicio);

        barras.push({ nome, tempo, valor, inicio });
    });
    localStorage.setItem("barras", JSON.stringify(barras));
}

function carregarBarras() {
    let barras = JSON.parse(localStorage.getItem("barras")) || [];
    let agora = Date.now();

    barras.forEach((barra) => {
        let tempoPassado = (agora - barra.inicio) / 1000; // Tempo decorrido em segundos
        let decrementos = Math.floor(tempoPassado / barra.tempo); // Quantidade de decrementos ocorridos
        let novoValor = Math.max(0, barra.valor - decrementos * 10); // Ajusta corretamente

        let novoInicio = agora - (tempoPassado % barra.tempo) * 1000;

        addBar(novoValor, barra.tempo, barra.nome, novoInicio);
    });
}

function addBar(valor = 100, tempo = 1, nomebarra = "", inicio = Date.now()) {
    let progressBar = document.createElement("progress");
    progressBar.value = valor;
    progressBar.max = 100;
    progressBar.classList.add("progress-container");

    let increaseButton = document.createElement("button");
    increaseButton.innerText = "+10%";
    increaseButton.onclick = function () {
        if (progressBar.value < progressBar.max) {
            progressBar.value += 10;
            progressBar.dataset.inicio = Date.now();
            salvarBarras();
        }
    };

    let diminuirProgresso = document.createElement("button");
    diminuirProgresso.innerText = "-10%";
    diminuirProgresso.onclick = function () {
        if (progressBar.value > 0) {
            progressBar.value -= 10;
            progressBar.dataset.inicio = Date.now();
            salvarBarras();
        }
    };

    let decrementojs = parseInt(document.getElementById("decrementojs").value) || 10;

    let nomeBarraElemento = document.createElement("h3");
    nomeBarraElemento.textContent = nomebarra || document.getElementById("nomebarra").value;

    let inputsegundos = document.getElementById("inputsegundos").value;
    let intervalo = inputsegundos ? parseInt(inputsegundos * 60) : tempo;

    progressBar.dataset.intervalo = intervalo;
    progressBar.dataset.inicio = inicio;

    function iniciarDecremento() {
        return setInterval(() => {
            let agora = Date.now();
            let tempoDecorrido = (agora - parseInt(progressBar.dataset.inicio)) / 1000;
            let decrementosNecessarios = Math.floor(tempoDecorrido / intervalo);
            let novoValor = Math.max(0, progressBar.value - decrementosNecessarios * decrementojs);

            if (progressBar.value !== novoValor) {
                progressBar.value = novoValor;
                progressBar.dataset.inicio = agora;
                salvarBarras();
            }

            if (progressBar.value <= 0) {
                clearInterval(intervalosAtivos[progressBar.dataset.id]);
            }
        }, intervalo * 1000);
    }

    let barraID = Date.now() + Math.random();
    progressBar.dataset.id = barraID;
    intervalosAtivos[barraID] = iniciarDecremento();

    let removeButton = document.createElement("button");
    removeButton.innerText = "Remover";
    removeButton.onclick = function () {
        clearInterval(intervalosAtivos[progressBar.dataset.id]);
        delete intervalosAtivos[progressBar.dataset.id];

        progressBar.remove();
        increaseButton.remove();
        removeButton.remove();
        diminuirProgresso.remove();
        nomeBarraElemento.remove();
        salvarBarras();
    };

    let container = document.getElementById("container");
    container.appendChild(nomeBarraElemento);
    container.appendChild(progressBar);
    container.appendChild(removeButton);
    container.appendChild(increaseButton);
    container.appendChild(diminuirProgresso);

    salvarBarras();
}

document.addEventListener("DOMContentLoaded", carregarBarras);
