const totalPanels = 3;
var panelAtual = 1;
var panelAnterior = 0;

const tempoSeg = 4100;

var intervalo = setInterval(() => {
    mudarTabs();
    mudarPaineis();
}, tempoSeg);

function mudarPaineis(){
    //Oculta anterior
    document.getElementById("footer-panel-" + panelAnterior).setAttribute("aria-hidden", true);
    //Exibe atual
    document.getElementById("footer-panel-" + panelAtual).setAttribute("aria-hidden", false);
    //Atualiza valores
    panelAnterior = panelAtual;
    panelAtual++;
    if (panelAtual >= totalPanels){
        panelAtual = 0;
    }
}

function mudarTabs(){
    //Oculta anterior
    document.getElementById("footer-tab-" + panelAnterior).setAttribute("aria-selected", false);
    document.getElementById("footer-tab-" + panelAnterior).setAttribute("tabindex", -1);
    //Exibe atual
    document.getElementById("footer-tab-" + panelAtual).setAttribute("aria-selected", true);
    document.getElementById("footer-tab-" + panelAnterior).setAttribute("tabindex", 0);
}

function clickBotao() {
    let numero = parseInt(this.id.substring(11));
    panelAtual = numero;
    clearInterval(intervalo);
    intervalo = setInterval(() => {
        mudarTabs();
        mudarPaineis();
    }, tempoSeg);
    
    //muda
    mudarTabs();
    mudarPaineis();
}

setTimeout(()=> {
    Array.from(document.getElementsByTagName("button")).forEach(element => {
        console.log("teste");
        element.onclick = clickBotao;
    });
},500);

