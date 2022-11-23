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

    var ativAtual = 0;

    function addAtividade(){
        let tbody = document.getElementById("tbody-ativ");
        if (!tbody){
            return;
        }
        let trs = tbody.getElementsByClassName("tr-atividade");
        let atividadeHTML ="";

        Array.from(trs).forEach(tr => {
            atividadeHTML += `
                <tr class="tr-atividade">
                    ${tr.innerHTML}
                </tr>
            `;
        });

        atividadeHTML += `
            <tr class="tr-atividade">
                <td>Avaliação ${ativAtual+1}:</td>
                <td>
                    <select name="select">
                        <option value=0 selected>Valor 1</option>
                        <option value=1>Valor 2</option>
                        <option value=2>Valor 3</option>
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
        ativAtual++;

        if (ativAtual < 5){
            //Botão
            atividadeHTML += `
                <tr class="tr-botao">
                    <td colspan="4">
                        <button id="btn-add-atividade" style="margin: auto;border: 1px solid #747474;color: #747474;border-radius: 10px;text-rendering: geometricPrecision;">+</button>
                    </td>
                </tr>
            `;
        }
        
        //Add
        tbody.innerHTML = atividadeHTML;

        if (ativAtual < 5){
            let btn_atv = document.getElementById("btn-add-atividade");
            if (btn_atv){
                btn_atv.addEventListener("click", ()=>{
                    addAtividade();
                });
            }
        }
        
    }
    
    const innerHTML = `
        <h1 style="text-align: center;">Criar modelo de avaliações</h1>
        <div style="display: flex;justify-content: space-evenly;margin: 0px 150px;">
            <h2 style="margin: 0px;">Nome do modelo:</h2>
            <input type="text" style="width: 180px;">
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
            <tbody id="tbody-ativ" style="">           
                
            </tbody>
        </table>
        <div style="display: flex;justify-content: space-evenly;">
            <button id="salvar-modelo">Salvar</button>
            <button id="cancelar-modelo">Cancelar</button>
        </div>
    `;

    dialog.innerHTML = innerHTML;

    pai.appendChild(dialog);

    //Botões
    let cancelBtn = document.getElementById("cancelar-modelo");
    if (cancelBtn){
        cancelBtn.addEventListener("click", ()=>{
            document.getElementById("dialogPreset").close();
        })
    }

    //Add atividade 1
    addAtividade();
}

let bt = document.createElement("button");
bt.innerText = "Teste";
bt.id = "teste";
bt.addEventListener("click", ()=>{
    criarModal();
});
document.getElementsByTagName("body")[0].appendChild(bt);
