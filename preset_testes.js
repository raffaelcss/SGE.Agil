function Setar_Testes(){
    var aulas_marcadas = document.getElementsByClassName("dxWeb_edtCheckBoxChecked_Edu");

    if (aulas_marcadas.length > 0){
        var id_aulas = [];

        Array.from(aulas_marcadas).forEach(element => {
            id_aulas.push(element.id);
            element.click();
        })

        setCookie("Plano_aula_seguinte",JSON.stringify(id_aulas),24);
        //Lança a primeira aula
        Aulas_seq_assistida();
    } else {
        alert('Você deve selecionar pelo menos uma aula!\nVocê pode marcar mais de um dia se quiser ツ');
    }
}

function criarModal(){
    const pai = document.getElementsByTagName("body")[0];

    const dialog = document.createElement("dialog");
    dialog.id = "dialogPreset";

    const innerHTML = "<h1>Criar Preset de provas</h1>/n<p>Testando</p>";

    dialog.innerHTML = innerHTML;

    pai.appendChild(dialog);
}

criarModal();