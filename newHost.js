const urlParams = new URLSearchParams(window.location.search);
const hostParam = urlParams.get('host');
console.log("Host: " + hostParam);

var btnHost = document.getElementById("aceitar-host");
var btnFechar = document.getElementById("fechar-host");

function modoNewHost(hasNewHost){
    let cbSGEON = document.getElementById("SGE_on");
    let divPrincipal = document.getElementsByClassName("menu-principal");
    let divHost = document.getElementsByClassName("host");
    if (hasNewHost){
        //Exibe menu de opçoes
        if (divHost.length > 0){
            divHost[0].classList.remove("host-hidden");
        }
        //Bloqueia switch principal
        cbSGEON.setAttribute("disabled","");
        if (divPrincipal.length > 0){
            divPrincipal[0].classList.add("disable");
        }
    } else {
        //Oculta menu de opçoes
        if (divHost.length > 0){
            divHost[0].classList.add("host-hidden");
        }
        //Desbloqueia switch principal
        cbSGEON.removeAttribute("disabled");
        if (divPrincipal.length > 0){
            divPrincipal[0].classList.remove("disable");
        }
    }
}

//Modo Host caso tenha GET param
modoNewHost(hostParam);

function request() {
    //Desabilita segundo clique
    btnHost.removeEventListener("click",request);
    btnHost.classList.add("disable");
    //Requisita acesso ao Host
    chrome.permissions.request({
        origins: [hostParam]
    }, (granted) => {
        //Devolve clique
        btnHost.addEventListener("click",request);
        btnHost.classList.remove("disable");
        if (granted){
            //Caso aceite recarrega a página
            chrome.tabs.query({highlighted: true, currentWindow: true}, (tab) => {});
            //Volta o menu
            modoNewHost(false);
            //Envia mensagem para o backgorund ativar os scripts, infelizmente dar um reload
            //na pag não funciona pois onUpdate não pega esse evento
            chrome.runtime.sendMessage({
                name: 'sendNewHost',
                message: "Ativar Scripts"
            });
        } else {
            //Caso não exibe mensagem
            let hostMessage = document.getElementById("host-message");
            hostMessage.innerText = "Infelizmente não foi possível habilitar o SGE Ágil. Tente novamente.";
            let btnAceitar = document.getElementById("aceitar-host");

            btnAceitar.classList.add("oculto");
            btnFechar.classList.remove("oculto");
            
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


if (btnHost){
    btnHost.addEventListener("click",request);
}


if (btnFechar){
    btnFechar.addEventListener("click",()=>{
        window.close();
    });
}

