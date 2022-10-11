var cbAulasGeminadas = document.getElementById("checkAulasGeminadas");

var aulaGeminadaCookie = getBoolCookie("SGE.Agil_aulaGeminada",false);

function inverter() {
    //Desmarcando aulas geminadas
    cbAulasGeminadas.checked = false;
    //Invertendo
    allCheckBox.forEach(cb => {
        cb.click();
    })
    //Voltando aulas geminadas
    cbAulasGeminadas.checked = aulaGeminadaCookie;
}

if (cbAulasGeminadas != null){
    cbAulasGeminadas.checked = aulaGeminadaCookie;
    //Evento click no checkbox aulas geminadas
    cbAulasGeminadas.addEventListener("click",() => {
        //Mudando informação
        aulaGeminadaCookie = cbAulasGeminadas.checked;
        //Salvando no Cookie
        setCookie("SGE.Agil_aulaGeminada",aulaGeminadaCookie,1400);
    });

    //Criar botão inverter falta
    let tdInverter = document.createElement("td");
    tdInverter.id = "td-inverter";

    let divBtnInverter = document.getElementById("ctl24_xbtSalvar").cloneNode(true);
    divBtnInverter.id = "btn-inverter";

    divBtnInverter.children[0].id="ctl24_xbtInverter_CD";
    divBtnInverter.getElementsByTagName("span")[0].innerText = "Inverter Frequência";

    let trPai = document.getElementById("ctl24_xbtSalvar").parentNode.parentNode;

    tdInverter.appendChild(divBtnInverter);
    trPai.appendChild(tdInverter);

    //Pegando todos os checkboxs
    let allInputs = document.getElementsByTagName("input");
    var allCheckBox = [];
    Array.from(allInputs).forEach(input => {
        if (input.type == "checkbox" && input.id != "checkAulasGeminadas" && input.id != "ctl24_chkLiberarFrequencia") {
            allCheckBox.push(input);
        }
    });
    
    //Adicionando função ao botão
    divBtnInverter.addEventListener("click",inverter);

}