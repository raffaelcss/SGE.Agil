////////////////////////////////////////////////////////////////////
///////////////////////    Versionamento    ////////////////////////
////////////////////////////////////////////////////////////////////

var newMversion     = 0;
var newversion      = 4;
var newsubversion   = 1;



var oldMVersion;
var oldversion;

function receber_cookies(){
     //Valores iniciais
    let init_pes      = true;
    let init_dark     = false;
    let init_plan     = true;
    let init_aviso    = true;
    let init_arq      = true;
    let init_faltas   = true;

    let init_SGE      = true;

    SGE_Agil_ON = getBoolCookie("SGE.Agil_ON", init_SGE);
    SGE_Agil_ON_Pes = getBoolCookie("SGE.Agil_Pes", init_pes);
    SGE_Agil_ON_Dark = getBoolCookie("SGE.Agil_Dark", init_dark);
    SGE_Agil_ON_Plan_aula = getBoolCookie("SGE.Agil_Plan_aula", init_plan);
    SGE_Agil_ON_Aviso_new = getBoolCookie("SGE.Agil_Aviso_new", init_aviso);
    SGE_Agil_ON_Arq_turma = getBoolCookie("SGE.Agil_Arq_turma", init_arq);
    SGE_Agil_ON_Aviso_faltas = getBoolCookie("SGE.Agil_Aviso_faltas", init_faltas);

    // console.log("SGE AGIL = " + SGE_Agil_ON);
    // console.log("SGE Pes = " + SGE_Agil_ON_Pes);
    // console.log("SGE Dark = " + SGE_Agil_ON_Dark);
    // console.log("SGE Plano = " + SGE_Agil_ON_Plan_aula);
    // console.log("SGE Aviso = " + SGE_Agil_ON_Aviso_new);
    // console.log("SGE Arq. = " + SGE_Agil_ON_Arq_turma);
    // console.log (getCookie("SGE.Agil_Aviso_new"));
    
}

function Ligar_Auto(){
    receber_cookies();
    //CSS básico
    var css_basico;
    if (!document.getElementById("css_basico")){
        css_basico = document.createElement('link');
        css_basico.id = "css_basico";
        css_basico.type = "text/css";
        css_basico.href = chrome.runtime.getURL('SGE_Agil_basic.css');
        css_basico.rel = "stylesheet";
        document.querySelector("head").appendChild(css_basico);
        //console.log("CSS Básico adicionado");
    }

    //Funções
    if (SGE_Agil_ON_Pes) {Ligar_pesquisa()};            //Barra de pesquisa
    if (SGE_Agil_ON_Dark) {Ligar_darkMode()};           //Dark Mode
    //if (SGE_Agil_ON_Freq) {Ligar_Freq()};             //Freq assistida
    if (SGE_Agil_ON_Plan_aula){                         //Plano de aula assistido
        Ligar_planAula();        
        //Verifica se tem aula a lançar
        Aulas_seq_assistida();
    }
    if (SGE_Agil_ON_Arq_turma) {Ligar_arq_turma()};     //Opção de arquivar turmas //Tem de ser antes do aviso por conta da propiedade IsArchived
    if (SGE_Agil_ON_Aviso_new) {Ligar_aviso_new()};     //Aviso novas Turmas e novas UCs
    if (SGE_Agil_ON_Aviso_faltas) {Ligar_aviso_faltas()};     //Aviso alunos faltosos


    //mudar icon professor
    if (document.getElementById("ctl09_ctl00_accordionMenuAccordionItems0_Header_RMWImage1")){
        document.getElementById("ctl09_ctl00_accordionMenuAccordionItems0_Header_RMWImage1").src = chrome.runtime.getURL('icons/mn_Professor.gif');
    }
    //mudar logo sesi-senai
    if (document.getElementsByClassName("login-logo").length > 0){
        document.getElementsByClassName("login-logo")[0].src = chrome.runtime.getURL('icons/sesi-senai.png');
    }
    if (document.getElementsByClassName("grey").length > 0){
        document.getElementsByClassName("grey")[0].src = chrome.runtime.getURL('icons/sesi-senai.png');
    }
    //Imagem promocional
    if (document.querySelectorAll("img").length > 0){
        //console.log("teste tem");
        document.querySelectorAll("img")[0].height = document.querySelectorAll("img")[0].height < 22 ? "0px": document.querySelectorAll("img")[0].height;
    }
    //Mudar raios
    if (document.getElementById("ctl24_ximgCopSugEtapa")){
        document.getElementById("ctl24_ximgCopSugEtapa").src = chrome.runtime.getURL('icons/btRaio_amarelo.gif');
        document.getElementById("ctl24_ximgCopSugPeriodo").src = chrome.runtime.getURL('icons/btRaio_azul.gif');
    }
}
function Desligar_Auto(){
    receber_cookies();
    //CSS básico
    var css_basico;
    if (document.getElementById("css_basico")){
        css_basico = document.getElementById("css_basico");
        css_basico.parentNode.removeChild(css_basico);
    }

    //Funções
    Desligar_pesquisa();                                //Barra de pesquisa
    Desligar_darkMode();                                //Dark Mode
    Desligar_planAula();                                //Plano de aula assistido
    //Desligar_Freq())};                                  //Freq assistida
    Desligar_aviso_new();                               //Aviso novas turmas e Ucs
    Desligar_arq_turma();                               //Arquivar turmas
    Desligar_aviso_faltas();                            //Aviso alunos faltosos

    //mudar icon professor
    if (document.getElementById("ctl09_ctl00_accordionMenuAccordionItems0_Header_RMWImage1")){
        document.getElementById("ctl09_ctl00_accordionMenuAccordionItems0_Header_RMWImage1").src = "Source/Edu-Educacional/Images/mn_Professor.gif";
    }
    //mudar logo sesi-senai
    if (document.getElementsByClassName("login-logo").length > 0){
        document.getElementsByClassName("login-logo")[0].src = "Nova_Tela_Login/img/logo.png";
    }
    if (document.getElementsByClassName("grey").length > 0){
        document.getElementsByClassName("grey")[0].src = "Nova_Tela_Login/img/logo.png";
    }
    //Mudar raios
    if (document.getElementById("ctl24_ximgCopSugEtapa")){
        document.getElementById("ctl24_ximgCopSugEtapa").src = "Source/Edu-Educacional/Images/btRaio_amarelo.gif";
        document.getElementById("ctl24_ximgCopSugPeriodo").src = "Source/Edu-Educacional/Images/btRaio_azul.gif";
    }
}

var SGE_Agil_ON;
var SGE_Agil_ON_Pes;
var SGE_Agil_ON_Dark;
var SGE_Agil_ON_Plan_aula;
var SGE_Agil_ON_Aviso_new;
var SGE_Agil_ON_Arq_turma;
var SGE_Agil_ON_Aviso_faltas;



var newMver_hide = document.createElement("span");
newMver_hide.id = "Mver_hide";
newMver_hide.style.display = 'none';
var newver_hide = document.createElement("span");
newver_hide.id = "ver_hide";
newver_hide.style.display = 'none';
var newsubver_hide = document.createElement("span");
newsubver_hide.id = "subver_hide";
newsubver_hide.style.display = 'none';

document.getElementsByTagName("body")[0].appendChild(newMver_hide);
document.getElementsByTagName("body")[0].appendChild(newver_hide);
document.getElementsByTagName("body")[0].appendChild(newsubver_hide);


/////////////////     Código a ser executado no início da página, acesso aos cookies     ////////////////////
receber_cookies();

oldMversion = getCookie("SGE.Agil_Mversion") || 0;
oldversion  = getCookie("SGE.Agil_version") || 0;



document.getElementById("Mver_hide").innerHTML = newMversion;
document.getElementById("ver_hide").innerHTML = newversion;
document.getElementById("subver_hide").innerHTML = newsubversion;


if ((newMversion > oldMversion) || (newversion > oldversion)) {
    setTimeout(() => {          //Tempo para o CSS carregar e a página abrir tbm
        alert(`Nova versão do SGE.Ágil instalada!\nVersão atual: ${newMversion}.${newversion}.${newsubversion}`);
        setCookie("SGE.Agil_Mversion", newMversion, 43800);
        setCookie("SGE.Agil_version", newversion, 43800);
    }, 800);
}

// console.clear();
console.log(`Debug:SGE.Ágil 0.${newversion}.${newsubversion} run!`);
console.log(SGE_Agil_ON ? `SGE.Ágil 0.${newversion}.${newsubversion} ON!` : `SGE.Ágil 0.${newversion}.${newsubversion} OFF!`);

/////////////////////           Ligando e desligando Funções             /////////////////////
if (SGE_Agil_ON){
    Ligar_Auto();
} else {
    Desligar_Auto();
}


////////   Funções estão todas em arquivos separados e são adicionadas primeiro   /////////////////////

//Criar Setas
if (document.getElementsByClassName("ExpanderCell").length > 0){
    //Setas
    var seta1 = document.createElement("div");
    var seta2 = document.createElement("div");
    seta1.classList.add("seta");
    seta1.parentElement = document.getElementsByClassName("ExpanderCell")[0];
    seta1.style.left = '-14px';
    seta1.style.top = '5px';
    seta2.classList.add("seta");
    seta2.parentElement = document.getElementsByClassName("ExpanderCell")[0];
    seta2.style.left = '-8px';
    seta2.style.top = '-4px';
    document.getElementsByClassName("ExpanderCell")[0].appendChild(seta1);
    document.getElementsByClassName("ExpanderCell")[0].appendChild(seta2);
}

//Primeira linha da aula no plano de aula
// Por enquanto desativado, cria a classe mas não é usada
if (document.getElementById("ctl24_xgvPlanoAula_DXMainTable")){
    if (document.getElementById("ctl24_xgvPlanoAula_DXMainTable").children.length > 0){
        var aulas = document.getElementById("ctl24_xgvPlanoAula_DXMainTable").children[0].children;
        if (aulas.length > 0){
            var ultimo = "";
            Array.from(aulas).forEach(element => {
                if (typeof element.children[2] != "undefined"){
                    if ((element.children[2].innerHTML !== ultimo) && ultimo !== "") {
                        ultimo = element.children[2].innerHTML;
                        element.classList.add("primeira_aula");
                    }
                    if (ultimo === ""){
                        ultimo = "Data";
                    }
                }
            })
        }
    }
}