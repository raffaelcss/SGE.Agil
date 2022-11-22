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

    const qtdAtividades = 5;

    let nomesEtapas = [];
    let etapaAtual = 0;
    let nomeEtapaAtual = "ctl24_xgvAvaliacao_DXPEForm_efnew_xcbEtapa_DDD_L_LBI" + etapaAtual + "T2";
    console.log(nomeEtapaAtual);
    console.log(document.getElementById(nomeEtapaAtual));
    while (document.getElementById(nomeEtapaAtual)){
        console.log(nomeEtapaAtual);
        nomesEtapas.push(document.getElementById(nomeEtapaAtual).innerText);
        etapaAtual++;
        nomeEtapaAtual = "ctl24_xgvAvaliacao_DXPEForm_efnew_xcbEtapa_DDD_L_LBI" + etapaAtual + "T2";
    }

    console.log(nomesEtapas);

    let atividadeHTML = "";

    for (let i=0; i < qtdAtividades; i++){
        atividadeHTML += `
            <tr>
                <td>Avaliação ${i+1}:</td>
                <td>
                    <select name="select">
                        <option value="valor1">Valor 1</option>
                        <option value="valor2" selected>Valor 2</option>
                        <option value="valor3">Valor 3</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="edtAtividade">
                </td>
                <td>
                    <input type="text" class="edtValor">
                </td>
            </tr>
        `;
    }
    

    const innerHTML = `
    <h1>Criar modelo de avaliações</h1>
    <div>
        <h2>Nome do modelo:</h2>
        <input type="text">
    </div>
    <table id="teste" style="">
        <thead>
            <tr>
                <th>Avaliação</th>
                <th>Etapa</th>
                <th>Nome</th>
                <th>Valor</th>
            </tr>
        </thead>
        <tbody style="">           
            ` + atividadeHTML + `
        </tbody>
    </table>
    <div>
        <button>Salvar</button>
        <button>Cancelar</button>
    </div>
    `;

    dialog.innerHTML = innerHTML;

    pai.appendChild(dialog);
}

let bt = document.createElement("button");
bt.id = "teste";
bt.addEventListener("click", ()=>{
    criarModal();
});
document.getElementsByTagName("body")[0].appendChild(bt);
