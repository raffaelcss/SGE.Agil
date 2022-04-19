//////////////////////////      Variaveis      ///////////////////////////
var ckbox_on = document.getElementById('SGE_on');

var ckbox_pes = document.getElementById('Pes_on');
var ckbox_dark = document.getElementById('Dark_on');
var ckbox_plan_aula = document.getElementById('Plan_aula_on');


///////////////////////////////    Eventos   ////////////////////////////////

//SGE ON
ckbox_on.onchange = () => {
  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_ON", ckbox_on.checked ? true : false,8760],
    });
    //Executando script para ativar ou desativar tudo automaticamente
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: ckbox_on.checked ? Ligar_Auto_send : Desligar_Auto_send,
    });
  });
  //Salvando opção na memória. Não pode usar cookies pois é extenção
  localStorage['SGE-Ágil-ON'] = ckbox_on.checked;
  //Alterando aparência do menu
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
//Switch de pesquisa
ckbox_pes.onchange = () => {
  //Saindo do escopo da extensão e indo para o da página
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Executando script SetCookie
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: setCookie,
      args: ["SGE.Agil_Pes", ckbox_pes.checked ? true : false ,8760],
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
      args: ["SGE.Agil_Dark", ckbox_dark.checked ? true : false ,8760],
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
      args: ["SGE.Agil_Plan_aula", ckbox_plan_aula.checked ? true : false ,8760],
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


/////////////////////    Retornando valores originais     ////////////////////////////

ckbox_pes.checked = (localStorage['SGE-Ágil-Pes']==='true') ? true : false;
ckbox_dark.checked = (localStorage['SGE-Ágil-Dark']==='true') ? true : false;
ckbox_plan_aula.checked = (localStorage['SGE-Ágil-Plan-aula']==='true') ? true : false;

ckbox_on.checked = (localStorage['SGE-Ágil-ON']==='true') ? true : false;
ckbox_on.onchange(); //Aplicar alterações assim que abrir a página








///////////////// Funções a serem executadas no escopo da página ///////////////////
function setCookie(name,value,hours) {
  var expires = "";
  if (hours) {
      var date = new Date();
      date.setTime(date.getTime() + (hours*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
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

// Funçoes Send
function Ligar_pesquisa_send() {
  Ligar_pesquisa();
}
function Desligar_pesquisa_send() {
  Desligar_pesquisa();
}

function Ligar_Auto_send() {
  Ligar_Auto();
}
function Desligar_Auto_send() {
  Desligar_Auto();
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