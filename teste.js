const elmRequest = document.createElement("input");
const elmGetAll = document.createElement("input");

elmRequest.type = "button";
elmRequest.id = "request";
elmRequest.value = "request";

elmGetAll.type = "button";
elmGetAll.id = "getAll";
elmGetAll.value = "getAll";


elmRequest.onclick = () => {
    request();
}

elmGetAll.onclick = () => {
    getAll();
}

function request() {
    chrome.permissions.request({
        origins: ["https://portaldoaluno6.fiemg.com.br/Corpore.Net/*"]
    }, (granted) => {
        console.log(granted);
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
document.getElementById("Dark_on").addEventListener("change", refreshDarkMode);
document.getElementById("SGE_on").addEventListener("change", refreshCssBasic);






document.getElementsByTagName("body")[0].insertAdjacentElement('afterend', elmRequest);
document.getElementsByTagName("body")[0].insertAdjacentElement('afterend', elmGetAll);

