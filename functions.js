function Change_menu_apare(){
  if (ckbox_on.checked){
    //Deixar sub-menu normal
    document.getElementById("sub-menu").classList.remove("disable");
    //Reabilitar clique
    document.querySelectorAll("input").forEach((element) => {
      if (element.type == "checkbox") {
          element.disabled = false;
      }
    })
  } else {
    //Deixar sub-menu cinza
    document.getElementById("sub-menu").classList.add("disable");
    //Impedir clique
    document.querySelectorAll("input").forEach((element) => {
        if (element.type == "checkbox" && element.id != "SGE_on") {
            element.disabled = true;
        }
    })
  } 
}

//////////////////////////      Variaveis      ///////////////////////////
var ckbox_on = document.getElementById('SGE_on');

var ckbox_pes = document.getElementById('Pes_on');
var ckbox_dark = document.getElementById('Dark_on');
var ckbox_plan_aula = document.getElementById('Plan_aula_on');
var ckbox_aviso_new = document.getElementById('Aviso_new_on');
var ckbox_arq_turma = document.getElementById('Arq_turma_on');
var ckbox_aviso_faltas = document.getElementById('Aviso_faltas_on');

var limite_faltas = document.getElementById("Limite_faltas");


/////////////////////    Retornando valores originais     ////////////////////////////
//Antes tinha deixado após os eventos onchange

//Primeiro acesso. Definindo padrões quando a pessoa baixar
valores_iniciais();


ckbox_pes.checked = (localStorage['SGE-Ágil-Pes']==='true') ? true : false;
ckbox_dark.checked = (localStorage['SGE-Ágil-Dark']==='true') ? true : false;
ckbox_plan_aula.checked = (localStorage['SGE-Ágil-Plan-aula']==='true') ? true : false;
ckbox_aviso_new.checked = (localStorage['SGE-Ágil-Aviso-new']==='true') ? true : false;
ckbox_arq_turma.checked = (localStorage['SGE-Ágil-Arq-turma']==='true') ? true : false;
ckbox_aviso_faltas.checked = (localStorage['SGE-Ágil-Aviso-faltas']==='true') ? true : false;

ckbox_on.checked = (localStorage['SGE-Ágil-ON']==='true') ? true : false;

limite_faltas.value = localStorage['SGE-Ágil-Limite-Faltas'] || 15;
bnt_diminui_falta = document.getElementById("diminui-falta");
bnt_aumenta_falta = document.getElementById("aumenta-falta");

//Alterando aparẽncia do menu (Antes estava somente no onchange do SGE_On mas exigia que os eventos viessem antes do load dos valores fazendo com que a cada clique no icone da extenção executasse todas as funções novamente)
Change_menu_apare();


///////////////////////////////    Eventos   ////////////////////////////////

//Buscar versao atraves de um componente oculto na página
var version_text;
function getVersion(){
  if (document.getElementById("ver_hide") && document.getElementById("subver_hide"))
    return [document.getElementById("Mver_hide").innerHTML,document.getElementById("ver_hide").innerHTML, document.getElementById("subver_hide").innerHTML];
}
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript(
    {
      target: {tabId: tabs[0].id, allFrames: true},
      func: getVersion,
    },
    (injectionResults) => {
      if (injectionResults.length > 0) {
        document.getElementById("version_info").innerHTML = "versão: " + injectionResults[0]["result"][0] + '.' + injectionResults[0]["result"][1] + '.' + injectionResults[0]["result"][2];
      }
      
    });
});

//Limite Faltas change
limite_faltas.onchange = () => {
  if (limite_faltas.value < 5){
    limite_faltas.value = 5;
  } else if (limite_faltas.value > 30){
    limite_faltas.value =30;
  }

  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_LimiteFaltas", Math.max(Math.min(limite_faltas.value, 30),5) ,43800],
    });
  });
  //Salvando opção na memória. Não pode usar cookies pois é extenção
  localStorage['SGE-Ágil-Limite-Faltas'] = limite_faltas.value;
}
limite_faltas.onkeydown = () => {
  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_LimiteFaltas", Math.max(Math.min(limite_faltas.value, 30),5) ,43800],
    });
  });
  //Salvando opção na memória. Não pode usar cookies pois é extenção
  localStorage['SGE-Ágil-Limite-Faltas'] = limite_faltas.value;
}

//Botoes alterar limite faltas
bnt_diminui_falta.onclick = () => {
  if (!bnt_diminui_falta.disabled){
    limite_faltas.value = parseInt(limite_faltas.value) - 5;
    limite_faltas.onchange();
  }
}
bnt_aumenta_falta.onclick = () => {
  if (!bnt_aumenta_falta.disabled){
    limite_faltas.value = parseInt(limite_faltas.value) + 5;
    limite_faltas.onchange();
  }
}


//SGE ON
ckbox_on.onchange = () => {
  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_ON", ckbox_on.checked ? true : false,43800],
    });
    //Executando script para ativar ou desativar tudo automaticamente
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: ckbox_on.checked ? Ligar_Auto_send : Desligar_Auto_send,
    });
  });
  //Salvando opção na memória. Não pode usar cookies pois é extenção
  localStorage['SGE-Ágil-ON'] = ckbox_on.checked;
  //Mudando aparẽncia do menu
  Change_menu_apare();
}
//Switch de pesquisa
ckbox_pes.onchange = () => {
  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_Pes", ckbox_pes.checked ? true : false ,43800],
    });
    //Executando script para ativar ou desativar tudo automaticamente
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: ckbox_pes.checked ? Ligar_pesquisa_send : Desligar_pesquisa_send,
    });
  });
  //Salvando opção na memória. Não pode usar cookies pois é extenção
  localStorage['SGE-Ágil-Pes'] = ckbox_pes.checked;
}

//Switch de dark_mode
ckbox_dark.onchange = () => {
  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_Dark", ckbox_dark.checked ? true : false ,43800],
    });
    //Executando script para ativar ou desativar tudo automaticamente
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: ckbox_dark.checked ? Ligar_dark_send : Desligar_dark_send,
    });
  });
  //Salvando opção na memória. Não pode usar cookies pois é extenção
  localStorage['SGE-Ágil-Dark'] = ckbox_dark.checked;
}

//Switch de plano de aula assistido
ckbox_plan_aula.onchange = () => {
  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_Plan_aula", ckbox_plan_aula.checked ? true : false ,43800],
    });
    //Executando script para ativar ou desativar tudo automaticamente
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: ckbox_plan_aula.checked ? Ligar_plan_aula_send : Desligar_plan_aula_send,
    });
  });
  //Salvando opção na memória. Não pode usar cookies pois é extenção
  localStorage['SGE-Ágil-Plan-aula'] = ckbox_plan_aula.checked;
}

//Switch de aviso de novas Ucs e Turmas
ckbox_aviso_new.onchange = () => {
  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_Aviso_new", ckbox_aviso_new.checked ? true : false ,43800],
    });
    //Executando script para ativar ou desativar tudo automaticamente
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: ckbox_aviso_new.checked ? Ligar_aviso_new_send : Desligar_aviso_new_send,
    });
  });
  //Salvando opção na memória. Não pode usar cookies pois é extenção
  localStorage['SGE-Ágil-Aviso-new'] = ckbox_aviso_new.checked;
}

//Switch ligar opção arquivar turmas
ckbox_arq_turma.onchange = () => {
  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_Arq_turma", ckbox_arq_turma.checked ? true : false ,43800],
    });
    //Executando script para ativar ou desativar tudo automaticamente
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: ckbox_arq_turma.checked ? Ligar_arq_turma_send : Desligar_arq_turma_send,
    });
  });
  //Salvando opção na memória. Não pode usar cookies pois é extenção
  localStorage['SGE-Ágil-Arq-turma'] = ckbox_arq_turma.checked;
}

//Switch de aviso de alunos faltosos
ckbox_aviso_faltas.onchange = () => {
  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_Aviso_faltas", ckbox_aviso_faltas.checked ? true : false ,43800],
    });
    //Executando script para ativar ou desativar tudo automaticamente
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: ckbox_aviso_faltas.checked ? Ligar_aviso_faltas_send : Desligar_aviso_faltas_send,
    });
  });
  //Salvando opção na memória. Não pode usar cookies pois é extenção
  localStorage['SGE-Ágil-Aviso-faltas'] = ckbox_aviso_faltas.checked;

  if (ckbox_aviso_faltas.checked) {
    limite_faltas.disabled = false;
    bnt_aumenta_falta.disabled = false;
    bnt_diminui_falta.disabled = false;
    bnt_aumenta_falta.classList.remove("disable_span");
    bnt_diminui_falta.classList.remove("disable_span");
  } else {
    limite_faltas.disabled = true;
    bnt_aumenta_falta.disabled = true;
    bnt_diminui_falta.disabled = true;
    bnt_aumenta_falta.classList.add("disable_span");
    bnt_diminui_falta.classList.add("disable_span");
  }
}

///////////////// Funções a serem executadas no escopo da página ///////////////////
//Tamanho do Pop-up
document.getElementsByTagName("body")[0].style.height = document.getElementsByTagName("body")[0].clientHeight + 19 + "px";
function valores_iniciais() {
  //Valores iniciais
  let init_pes      = true;
  let init_dark     = false;
  let init_plan     = true;
  let init_aviso    = true;
  let init_arq      = true;
  let init_aviso_faltas    = true;

  let init_SGE      = true;


  if (!localStorage['SGE-Ágil-Pes']){
      localStorage['SGE-Ágil-Pes']        = init_pes ? 'true' : 'false';
  }
  if (!localStorage['SGE-Ágil-Dark']){
    localStorage['SGE-Ágil-Dark']        = init_dark ? 'true' : 'false';
  }
  if (!localStorage['SGE-Ágil-Plan-aula']){
    localStorage['SGE-Ágil-Plan-aula']        = init_plan ? 'true' : 'false';
  }
  if (!localStorage['SGE-Ágil-Aviso-new']){
    localStorage['SGE-Ágil-Aviso-new']        = init_aviso ? 'true' : 'false';
  }
  if (!localStorage['SGE-Ágil-Arq-turma']){
    localStorage['SGE-Ágil-Arq-turma']        = init_arq ? 'true' : 'false';
  }
  if (!localStorage['SGE-Ágil-Aviso-faltas']){
    localStorage['SGE-Ágil-Aviso-faltas']        = init_aviso_faltas ? 'true' : 'false';
  }

  if (!localStorage['SGE-Ágil-ON']){
    localStorage['SGE-Ágil-ON']        = init_SGE ? 'true' : 'false';
  }
}
function setCookie(name,value,hours) {
  var expires = "";
  if (hours) {
      var date = new Date();
      date.setTime(date.getTime() + (hours*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "false") + expires + "; path=/";
  //console.log("cookie criado");
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function eraseCookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//Arrumar Limite Faltas
ckbox_aviso_faltas.onchange();

// Funçoes Send
function Ligar_Auto_send() {
  Ligar_Auto();
}
function Desligar_Auto_send() {
  Desligar_Auto();
}

function Ligar_pesquisa_send() {
  Ligar_pesquisa();
}
function Desligar_pesquisa_send() {
  Desligar_pesquisa();
}

function Ligar_dark_send(){
  Ligar_darkMode();
}
function Desligar_dark_send(){
  Desligar_darkMode();
}

function Ligar_plan_aula_send(){
  Ligar_planAula();
}
function Desligar_plan_aula_send(){
  Desligar_planAula();
}

function Ligar_aviso_new_send(){
  Ligar_aviso_new();
}
function Desligar_aviso_new_send(){
  Desligar_aviso_new();
}

function Ligar_arq_turma_send(){
  Ligar_arq_turma();
}
function Desligar_arq_turma_send(){
  Desligar_arq_turma();
}

function Ligar_aviso_faltas_send(){
  Ligar_aviso_faltas();
}
function Desligar_aviso_faltas_send(){
  Desligar_aviso_faltas();
}