//Requisita acesso ao Host
chrome.permissions.request({
    permissions: "storage"
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