var button_unico = document.getElementById("unica");
var button_mensal = document.getElementById("mensal");
var p_mensal_info = document.getElementById("mensal-info");
var button_10 = document.getElementById("b10");
var button_50 = document.getElementById("b50");
var button_100 = document.getElementById("b100");
var button_outro = document.getElementById("bOutro");
var div_custom_amount = document.getElementById("div-custom-amount");
var div_error = document.getElementById("div-error");
var div_link = document.getElementById("div-link");
var amount_input = document.getElementById("custom-amount-input");
var button_doar = document.getElementById("submit");

var amount = 0.00; //final amount
var useCustomAmount = false;
var customAmount = "";
var customAmountInput = null;
var frequency = "U";
var errorMsg = "";
var submitted = false;
var payLink = null;
var aPayLink = null;
var title = "Contribua com nosso projeto";
var logo = "https://cdn.jsdelivr.net/gh/r-martins/doacao-pagseguro@0.1.0/src/assets/pagseguro-contribua.png";

button_mensal.onclick = () => {
    if (frequency != "M"){
        button_mensal.classList.add("active");
        button_unico.classList.remove("active");  
        p_mensal_info.style.display = 'block';
        frequency = "M";
        restart();
    }
}

button_unico.onclick = () => {
    if (frequency != "U"){
        button_unico.classList.add("active");
        button_mensal.classList.remove("active");  
        p_mensal_info.style.display = 'none';
        frequency = "U";
        restart();        
    }
}

button_10.onclick = () => {
    if (amount != 10.00){
        button_10.classList.add("active");
        button_50.classList.remove("active");
        button_100.classList.remove("active");
        button_outro.classList.remove("active");  
    
        div_custom_amount.classList.add("hide");
        amount = 10.00;
        restart();
    }
}

button_50.onclick = () => {
    if (amount != 50.00){
        button_50.classList.add("active");
        button_10.classList.remove("active");
        button_100.classList.remove("active");
        button_outro.classList.remove("active");  
    
        div_custom_amount.classList.add("hide");
        amount = 50.00;
        restart();
    }
}

button_100.onclick = () => {
    if (amount != 100){
        button_100.classList.add("active");
        button_50.classList.remove("active");
        button_10.classList.remove("active");
        button_outro.classList.remove("active");  
        
        div_custom_amount.classList.add("hide");
        amount = 100.00;
        restart();
    }
}

button_outro.onclick = () => {
    button_outro.classList.add("active");
    button_50.classList.remove("active");
    button_100.classList.remove("active");
    button_10.classList.remove("active");  

    div_custom_amount.classList.remove("hide");
    amount = 0.00;
    amount_input.value = '';
    restart();
}

String.prototype.reverse = function(){
    return this.split('').reverse().join(''); 
}

String.prototype.brlToFloat = function(){
    return parseFloat(this.replace(".",'').replace(",",".").replace("R$ ",''));
};
  
function mascaraMoeda(campo,evento){
    var tecla = (!evento) ? window.event.keyCode : evento.which;
    var valorTexto = campo.value.replace(/[^\d]+/gi,'');
    var valorInt = valorTexto.length > 0 ? parseInt(valorTexto) : 0;
    var valor  =  valorInt.toString().reverse();
    var resultado  = "";
    var mascara = "##.###.###,##".reverse();

    switch (valor.length){
        case 1:
            valor += '0';
        case 2:
            valor += '0';
        break;
    }

    for (var x=0, y=0; x<mascara.length && y<valor.length;) {
        if (mascara.charAt(x) != '#') {
            resultado += mascara.charAt(x);
            x++;
        } else {
            resultado += valor.charAt(y);
            y++;
            x++;
        }
    }

    campo.value = valorInt > 0 ? "R$ " + resultado.reverse() : "" ;
    amount = campo.value.brlToFloat();
}

amount_input.addEventListener('keyup', (event) => {
    mascaraMoeda(amount_input, event);
    restart();
})

function setUseCustom() {
    useCustomAmount = true;
    div_custom_amount.style.display = "block";
}
async function handleSubmit() {
    submitted = true
    errorMsg = ''
    payLink = ''
    let formData = new FormData()
    formData.append('amount', amount)
    formData.append('frequency', frequency)
    formData.append('receiverEmail', document.getElementById('doar-pagseguro').dataset.receiveremail)

    let rotas = ['https://ws.ricardomartins.net.br/pspro/v7/donate/new']
    
    const promises = rotas.map(url => fetch('https://ws.ricardomartins.net.br/pspro/v7/donate/new', {
        method: 'POST',
        body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                throw Error(data.error.message);// + ' (err:' + data.error.code + ')');
            }
            if (data.redirectTo) {
                payLink = data.redirectTo;
            }
        })
        .catch((err) => {
            console.log(err);
            submitted = false;
            errorMsg = err.message;
        })
    );
    

    // aqui eu espero a resposta da promise
    const response = await Promise.all(promises);

    if(response) {
        return response;
    }
}

function updateAmount(newAmount){
    amount.value = newAmount
}

function restart() {
    div_link.style.display = 'none';
    button_doar.style.display = 'block';
}

function doar() {
    let promise = handleSubmit();
    promise.then(response => {
        //Mensagem de erro
        div_error.innerText = errorMsg;
        //Link para acesso
        div_link.getElementsByTagName("a")[0].href = payLink;

        div_link.style.display = payLink == '' ? 'none' : 'block';
        button_doar.style.display = payLink == '' ? 'block' : 'none';

        console.log("ERRO NOVO: " + errorMsg);
        console.log(response);
    })
}

button_doar.onclick = doar;