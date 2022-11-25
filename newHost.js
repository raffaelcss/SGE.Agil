const urlParams = new URLSearchParams(window.location.search);
const hostParam = urlParams.get('host');
console.log("Host: " + hostParam);

if (!hostParam){
    let divHost = document.getElementsByClassName("host")[0];
    divHost.classList.add("host-hidden");

    ////////FECHAR o MENU
}

function request() {
    //Requisita acesso ao Host
    chrome.permissions.request({
        origins: [hostParam]
    }, (retorno) => {
        if (retorno){
            //Caso aceite recarrega a página
            chrome.tabs.query({highlighted: true, currentWindow: true}, (tab) => {
                chrome.tabs.reload(tab.id);
            });
        } else {
            //Caso não exibe mensagem
        }
    });
}

function getAll() {
    chrome.permissions.getAll((permissions) => {
        console.log(permissions);
    });
}

function refreshCssBasic(){
    if (document.getElementById("SGE_on").checked){
        console.log("checked");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.insertCSS(
            {
                target: {tabId: tabs[0].id},
                files: ["SGE_Agil_basic.css"],
            }, 
            function() {
                if (chrome.runtime.lastError) {
                    console.log('There was an error injecting css : \n' + chrome.runtime.lastError.message);
                }
            });
        }); 
        //Retorna Dark Mode
        refreshDarkMode();      
    } else {
        console.log("unchecked");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.removeCSS(
            {
                target: {tabId: tabs[0].id},
                files: ["SGE_Agil_basic.css"],
            }, 
            function() {
                if (chrome.runtime.lastError) {
                    console.log('There was an error injecting css : \n' + chrome.runtime.lastError.message);
                }
            });
        });
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.removeCSS(
            {
                target: {tabId: tabs[0].id},
                files: ["dark_mode.css"],
            }, 
            function() {
                if (chrome.runtime.lastError) {
                    console.log('There was an error injecting css : \n' + chrome.runtime.lastError.message);
                }
            });
        });
    }
}
function refreshDarkMode(){
    if (document.getElementById("Dark_on").checked){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.insertCSS(
            {
                target: {tabId: tabs[0].id},
                files: ["dark_mode.css"],
            }, 
            function() {
                if (chrome.runtime.lastError) {
                    console.log('There was an error injecting css : \n' + chrome.runtime.lastError.message);
                }
            });
        });       
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.removeCSS(
            {
                target: {tabId: tabs[0].id},
                files: ["dark_mode.css"],
            }, 
            function() {
                if (chrome.runtime.lastError) {
                    console.log('There was an error injecting css : \n' + chrome.runtime.lastError.message);
                }
            });
        });
    }
}



//Changes
// document.getElementById("Dark_on").addEventListener("change", refreshDarkMode);
// document.getElementById("SGE_on").addEventListener("change", refreshCssBasic);

//Host

let btnHost = document.getElementById("aceitar-host");
if (btnHost){
    btnHost.addEventListener("click",request);
}


document.getElementsByTagName("body")[0].insertAdjacentElement('afterend', elmRequest);
document.getElementsByTagName("body")[0].insertAdjacentElement('afterend', elmGetAll);

