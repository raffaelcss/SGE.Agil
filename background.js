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
    chrome.tabs.create({url:'https://www.fiemg.com.br/pd'}, (tab)=>{
      console.log("tab criada");
    });
    let count2 = 1000;
    function esperaPagNova() { 
      setTimeout(()=>{
        chrome.tabs.query({highlighted: true, currentWindow: true}, (tab) => {
          if (tab.length > 0){
            if (tab[0].status == 'complete' || count2 <= 0){
              if (tab[0].url.indexOf('fiemg.com.br') != -1 && tab[0].url.indexOf('Corpore') != -1){
                //Abre Popup se e somente si já tiver o Host, caso contrário o onUpdate abre a
                //solicitação de host
                //console.log("Abre popup dentro do click, pag nova");
                //abrePopup(tab[0], false, true);
              }
            } else {
              console.log("tentando.. " + (1000 - count2)*20 + "ms decorridos");
              console.log(tab[0]);
              count2--;
              esperaPagNova();
            }
          }
        });
      },20);
    }
    esperaPagNova();
    //Testando para evitar de tentar injetar scripts e abrir popup duas vezes
    return;
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
              console.log(tab[0].id);
              // try {
              //   chrome.action.setPopup({popup:"index.html", tabId: tab[0].id},()=>{});
              //   chrome.action.openPopup();
              // } catch (error) {
              //   console.log("Erro ao abrir popup. code: " + error);
              // }
              
              //Abre Popup comum ou o de Host
              console.log("Abre popup dentro do click, pag velha");
              //abrePopup(tab[0], false);
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
  //v0.7.0
  if (tabSGE == 0){
    chrome.tabs.query({url:'*://*.fiemg.com.br/Corpore.Net/*'} ,(tab) => {
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

js_to_inject = ["SGE_Agil_cookies.js", "barraDePesquisa.js", "Dark_mode.js", "assistenteFrequencia.js", "plano_aula_assistido.js", "lista_turmas.js", "arquivar_turmas.js", "aviso_novas_turmas.js", "faltas_consecutivas.js", "xlsx.style.min.js","planilhas_notas.js", "script.js"];

function addScript(tab){
  console.log("Adicionando scripts");
  //Legado v0.6.2
  // Array.from(js).forEach(element => {
  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     files: [element]
  //   });
  // });

  chrome.scripting.getRegisteredContentScripts(
    {
      ids:["js-injetado-sge-agil"]
    },(returned_scripts)=>{
      //Verifica se o script já foi injetado, caso não, insira
      if (returned_scripts.length <= 0){
        //teste novo metodo de inserção de script v0.6.4
        let newHost = tab.url.substring(0,tab.url.lastIndexOf("/")) + "/*";
        console.log("Matches: " + newHost);
        chrome.scripting.registerContentScripts(
          [{
            id: "js-injetado-sge-agil",
            js: js_to_inject,
            matches: [newHost] 
          }],
          ()=>{
            chrome.scripting.getRegisteredContentScripts({},(returned_scripts)=>{
              console.log(returned_scripts);
            });
          }
        );
      }
    }
  );
}

var timeAbriuSolcitacao = false;

function abrePopup(tab, abrirApenasHost, abrirApenasNormal){
  //Pega link do site
  let newHost = tab.url.substring(0,tab.url.lastIndexOf("/")) + "/*";
  console.log(newHost);

  let matches = ["http://www2.fiemg.com.br/Corpore.Net/",
    "https://www2.fiemg.com.br/Corpore.Net/",
    "http://prados101.fiemg.com.br/Corpore.Net",
    "https://prados101.fiemg.com.br/Corpore.Net/"    
  ];
  
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
      if (!retorno && !abrirApenasNormal){
        //caso não tenha solicite (Abre popup new Host)
        try {
          chrome.action.setPopup(
            {popup:"index.html?host=" + newHost, tabId: tab.id},
            ()=>{
              
            }
          );
          if (newHost.indexOf("chrome-extension") == -1){
            //Verificar se pág ja existe, pois está criando 2 ou 3 pag
            let qtd = 0;
            chrome.tabs.query({url:'chrome-extension://*/index.html?host=*'} ,(tab2) => {
              qtd = tab2.length;
              console.log("Quantidade de chrome-extensions: " + qtd);
              //Verifica se não abriu uma página recentemente, o metodo query não funciona bem
              //Pois são executados várias requisições antes mesmo da pág ficar visível ao query
              if(qtd <= 0 && !timeAbriuSolcitacao){
                setTimeout(()=>{
                  chrome.tabs.create({url:"newHost.html?host=" + newHost}, (tab)=>{
                    console.log("tab criada");
                  });
                },1500);
                timeAbriuSolcitacao = true;
                console.log("bloqueando novas pag de Host");
                setTimeout(()=>{
                  timeAbriuSolcitacao = false;
                  console.log("liberando novas pag de Host");
                },3000);
              }
            });
          }
          // chrome.action.openPopup();
        } catch (error) {
          console.log("Erro ao abrir popup. code: " + error);
        }
      } else {
        if (!hostOficial && retorno) {
          //Caso possua Host, mas não oficial, add scripts
          addScript(tab);
        }
        //onUpdate não precisa abrir o popup normal, apenas no click
        if (!abrirApenasHost && retorno){
          //Abre o popup normal caso possua host
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
      console.log("Abrir somente Host: " + abrirApenasHost);
      console.log("Abrir somente Normal: " + abrirApenasNormal);
    }
  )
}

var tentativas = 1000;

function injetaScripts(tab){
  if (tab.status != 'complete'){
    if (tab.url.indexOf('fiemg.com.br') != -1 && tab.url.indexOf('Corpore') != -1){
      //Abre Popup caso não possua Host e somente se não possuir
      console.log("abrindo popUp pois nao possui host")
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
  console.log("chamando update: " + tab.url);
  injetaScripts(tab);
});

//Receber mensagens do newHost.js para ativar os scripts assim que aceitar o Host
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.name === 'sendNewHost') {
    console.log("Mensagem do newHost recebida, injetando scripts.");
    tentativas = 1000;
    chrome.tabs.query({highlighted: true, currentWindow: true}, (tab) => {
      if (tab.length > 0){
        if (tab[0].status == 'complete' || count <= 0){
          if (tab[0].url.indexOf('fiemg.com.br') != -1 && tab[0].url.indexOf('Corpore') != -1){
            console.log("Injetando scripts após aceitar o HOST");
            //Caso possua Host, mas não oficial, add scripts e depois recarrega a página
            ////////////////// NÃO ALTERAR //////////////////
            addScript(tab[0]);
            chrome.tabs.reload(tab[0].id);
          }
        }
      }
    });
  }
});