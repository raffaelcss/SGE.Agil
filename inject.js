function refreshCssBasic(){
    let sgeOn = getBoolCookie("SGE.Agil_ON");
    if (sgeOn){
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
    let sgeDark = getBoolCookie("SGE.Agil_Dark");
    if (sgeDark){
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

refreshCssBasic();
refreshDarkMode();
