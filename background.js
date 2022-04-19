//Impede que o menu da extenção apareceça em outros sites quando você clicar

//Descomentar para ativar função ↴
//chrome.action.disable();
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete'){
    console.log(tab.url);
    //Define qual a palavra deve conter a URL para que ative a extenção. Ex: fiemg
    if (tab.url.indexOf('fiemg.com.br') != -1 && tab.url.indexOf('Corpore') != -1){
      console.log('SGE.Ágil Enable!');
      chrome.action.enable(tabId);
    }
    else{
      console.log('SGE.Ágil Disable!');
      //chrome.action.disable(tabId);
    }
  }
});
/////////////////////////////////////////////////////////////////////////////