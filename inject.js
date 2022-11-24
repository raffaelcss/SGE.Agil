function refreshCssBasic(direto){
    if (direto || (document.getElementById("SGE_on") ? document.getElementById("SGE_on").checked : false)){
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

console.log("inject.js");

refreshCssBasic(true);
refreshDarkMode();
