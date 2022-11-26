async function checkIsPinned(){
  let userSettings = await chrome.action.getUserSettings();
  if(userSettings.isOnToolbar == false){
    chrome.tabs.query({highlighted: true, currentWindow: true}, (tab) => {
      chrome.action.setPopup({popup:'pin.html', tabId: tab[0].id},()=>{});
      chrome.action.openPopup();
      chrome.action.setPopup({popup:'', tabId: tab[0].id},()=>{});
    });
  }
}

//Executado quando instala a extensão

chrome.runtime.onInstalled.addListener(() => {
  // default state goes here
  // this runs ONE TIME ONLY (unless the user reinstalls your extension)
  // checkIsPinned();
});

//Suprime o erro caso já exista um contextMenu, pois só tem que criar um quando instala
chrome.contextMenus.create({
  id: "sge_context",
  title: "SGE Ágil",
  contexts: ["page"]
}, () => chrome.runtime.lastError);

function contextClick(info, tab) {
  const { menuItemId } = info;

  if (menuItemId === 'sge_context') {
    if (tab.status == 'complete'){
      if (tab.url.indexOf('fiemg.com.br') != -1 && tab.url.indexOf('Corpore') != -1){
        // do something
        click();
      }
    }
  }
}

chrome.contextMenus.onClicked.addListener(contextClick);


//Verifica aba por aba e define se irá ativar o popUp ou clique
// chrome.tabs.onUpdated.addListener((tabIdObt, changeInfo, tab) => {
//   if (changeInfo.status == 'complete'){
//     let caminhoPopup = "";
//     //Define qual a palavra deve conter a URL para que ative a extenção. Ex: fiemg
//     if (tab.url.indexOf('fiemg.com.br') != -1 && tab.url.indexOf('Corpore') != -1){
//       console.log('SGE.Ágil Enable!');
//       caminhoPopup = "index.html";
//     }
//     else{
//       console.log('SGE.Ágil Disable!');
//       caminhoPopup = "";
//     }
//     //Ativa ou desativa o popUp
//     chrome.action.setPopup({popup:caminhoPopup, tabId: tabIdObt},()=>{});
//   }
// });

function click() {
  console.log("Window: " + windowSGE);
  console.log("Tab Id: " + tabSGE);
  if (tabSGE <= 0){
    //chrome.tabs.create({url:'https://www2.fiemg.com.br/Corpore.Net/Login.aspx'}, ()=>{});
    //v0.6.2
    chrome.tabs.create({url:'https://www.fiemg.com.br/pd'}, ()=>{});
  } else {
    try {
      chrome.tabs.highlight({tabs: tabSGE, windowId: windowSGE}, () => {});
    } catch (error) {
      console.log("Erro ao selecionar aba. error: " + error);
    }
  }
  let count = 1000;
  function esperaPagEAbrePopup() { 
    setTimeout(()=>{
      chrome.tabs.query({highlighted: true, currentWindow: true}, (tab) => {
        if (tab.length > 0){
          if (tab[0].status == 'complete' || count <= 0){
            if (tab[0].url.indexOf('fiemg.com.br') != -1 && tab[0].url.indexOf('Corpore') != -1){
              console.log(tab[0]);
              // try {
              //   chrome.action.setPopup({popup:"index.html", tabId: tab[0].id},()=>{});
              //   chrome.action.openPopup();
              // } catch (error) {
              //   console.log("Erro ao abrir popup. code: " + error);
              // }
              
              //Abre Popup comum ou o de Host
              abrePopup(tab[0], false);
            }
          } else {
            console.log("tentando.. " + (1000 - count)*20 + "ms decorridos");
            count--;
            esperaPagEAbrePopup();
          }
        }
      })
    },20);
  }
  esperaPagEAbrePopup();
}

//Ir para o SGE quando clicar
chrome.action.onClicked.addListener(click);

var tabSGE  = 0;
var windowSGE = 0;
function getSGEIndex(){
  tabSGE = 0;
  windowSGE = 0;
  chrome.tabs.query({url:'*://www2.fiemg.com.br/Corpore.Net/*'} ,(tab) => {
    if(tab.length > 0){
      tabSGE = tab[0].index;
      windowSGE = tab[0].windowId;
    }
  });
  if (tabSGE == 0){
    chrome.tabs.query({url:'*://prados101.fiemg.com.br/Corpore.Net/*'} ,(tab) => {
      if(tab.length > 0){
        tabSGE = tab[0].index;
        windowSGE = tab[0].windowId;
      }
    }); 
  }
  //v0.6.2
  if (tabSGE == 0){
    chrome.tabs.query({url:'*://portaldoaluno6.fiemg.com.br/Corpore.Net/*'} ,(tab) => {
      if(tab.length > 0){
        tabSGE = tab[0].index;
        windowSGE = tab[0].windowId;
      }
    }); 
  }
}

//Atualiza valor do Index da pág do SGE
chrome.tabs.onCreated.addListener(getSGEIndex);
//v0.6.2 getSGEIndex in onUpdate
chrome.tabs.onUpdated.addListener(getSGEIndex);
chrome.tabs.onDetached.addListener(getSGEIndex);
chrome.tabs.onMoved.addListener(getSGEIndex);
chrome.tabs.onRemoved.addListener(getSGEIndex);
getSGEIndex();

console.log(chrome.permissions.getAll());

js = ["SGE_Agil_cookies.js", "barraDePesquisa.js", "Dark_mode.js", "assistenteFrequencia.js", "plano_aula_assistido.js", "lista_turmas.js", "arquivar_turmas.js", "aviso_novas_turmas.js", "faltas_consecutivas.js", "xlsx.style.min.js","planilhas_notas.js", "script.js"];

function addScript(tab){
  console.log("Adicionando scripts");
  Array.from(js).forEach(element => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [element]
    });
  });
  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   files: ["inject.js"]
  // });
}

// chrome.action.onClicked.addListener((tab) => {
//   addScript(tab);
// });

function abrePopup(tab, abrirApenasHost){
  //Pega link do site
  let newHost = tab.url.substring(0,tab.url.lastIndexOf("/")) + "/*";
  console.log(newHost);

  let matches = ["http://www2.fiemg.com.br/Corpore.Net/","https://www2.fiemg.com.br/Corpore.Net/","http://prados101.fiemg.com.br/Corpore.Net","https://prados101.fiemg.com.br/Corpore.Net/"];
  
  //Verifica se tem permissão Host no site
  chrome.permissions.contains(
    {
      origins: [newHost]
    },
    (retorno) => {
      let hostOficial = false;
      //Verifica se é algum dos hosts oficiais
      Array.from(matches).forEach(host => {
        if (tab.url.indexOf(host) >= 0){
          hostOficial = true;
        }
      });
      //Não tem o Host (Solicitar)
      if (!retorno){
        //caso não tenha solicite (Abre popup new Host)
        try {
          chrome.action.setPopup({popup:"index.html?host=" + newHost, tabId: tab.id},()=>{});
          chrome.action.openPopup();
        } catch (error) {
          console.log("Erro ao abrir popup. code: " + error);
        }
      } else {
        if (!hostOficial) {
          //Caso possua Host, mas não oficial, add scripts
          addScript(tab);
        }
        //onUpdate não precisa abrir o popup normal, apenas no click
        if (!abrirApenasHost){
          //Abre o popup normal
          try {
            chrome.action.setPopup({popup:"index.html", tabId: tab.id},()=>{});
            chrome.action.openPopup();
          } catch (error) {
            console.log("Erro ao abrir popup. code: " + error);
          }
        }
      }
      console.log("A url: " + newHost + " possui host: " + retorno);
      console.log("Host oficial: " + hostOficial);
    }
  )
}

var tentativas = 1000;

function injetaScripts(tab){
  if (tab.status == 'complete'){
    if (tab.url.indexOf('fiemg.com.br') != -1 && tab.url.indexOf('Corpore') != -1){
      //Abre Popup caso não possua Host
      abrePopup(tab, true);
    }
  } else {
    tentativas--;
    if (tentativas >= 0){
      injetaScripts(tab);
    }
  }
}

chrome.tabs.onUpdated.addListener((tabId, ci, tab) => {
  tentativas = 1000;
  injetaScripts(tab);
});