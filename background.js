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

chrome.contextMenus.create({
  id: "sge_context",
  title: "SGE Ágil",
  contexts: ["page"]
});

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
    chrome.tabs.create({url:'https://www2.fiemg.com.br/Corpore.Net/Login.aspx'}, ()=>{});
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
              try {
                chrome.action.setPopup({popup:"index.html", tabId: tab[0].id},()=>{});
                chrome.action.openPopup();
              } catch (error) {
                console.log("Erro ao abrir popup. code: " + error);
              }
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
}

//Atualiza valor do Index da pág do SGE
chrome.tabs.onCreated.addListener(getSGEIndex);
chrome.tabs.onDetached.addListener(getSGEIndex);
chrome.tabs.onMoved.addListener(getSGEIndex);
chrome.tabs.onRemoved.addListener(getSGEIndex);
getSGEIndex();

