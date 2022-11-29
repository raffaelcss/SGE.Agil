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

    const btnIncluir = document.getElementById("ctl24_eduToolBarXGrid_xbtIncluir");

    const dialog = document.createElement("dialog");
    dialog.id = "dialogPreset";

    let nomesEtapas = [];
    let etapaAtual = 0;
    
    //Clica em incluir
    btnIncluir.click();
    let tentativas = 1000;
    function aguardaFormAvaliacao(){
        setTimeout(()=> {
            let objAbrirEtapas = document.getElementById("ctl24_xgvAvaliacao_DXPEForm_efnew_xcbEtapa_I");
            let nomeEtapaAtual = "ctl24_xgvAvaliacao_DXPEForm_efnew_xcbEtapa_DDD_L_LBI" + etapaAtual + "T2";
            let objEtapaAtual = document.getElementById(nomeEtapaAtual);
            if (objAbrirEtapas || tentativas <= 0){
                setTimeout(()=>{
                    //Exibe etapas
                    objAbrirEtapas.dispatchEvent(new MouseEvent('mousedown'));

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
                        let selecteds = [];

                        Array.from(trs).forEach(tr => {
                            atividadeHTML += `
                                <tr class="tr-atividade">
                                    ${tr.innerHTML}
                                </tr>
                            `;
                            //Selecionando correta
                            selecteds.push(tr.children[1].children[0].value);
                        });

                        function optionsEtapas(etapas, val){
                            if (!etapas){
                                return "";
                            }
                            if (etapas.length <= 0){
                                return "";
                            }
                            let html = "";
                            for(let i=0; i < etapas.length; i++){
                                html += "<option value="+i+" " + (i==val ? "selected" : "") + ">" + etapas[i] + "</option>\n";
                            };
                            return html;
                        }

                        atividadeHTML += `
                            <tr class="tr-atividade">
                                <td>Avaliação ${ativAtual+1}:</td>
                                <td>
                                    <select name="select">
                                        ${optionsEtapas(nomesEtapas)}
                                    </select>
                                </td>
                                <td>
                                    <input type="text" class="edtAtividade">
                                </td>
                                <td>
                                    <input type="text" class="edtValor" value="0,00">
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

                        //Seleciona a etapa correta das atv anteriores ao add nova atv
                        trs = tbody.getElementsByClassName("tr-atividade");
                        for(let i=0; i < selecteds.length; i++){
                            trs[i].children[1].children[0].value = selecteds[i];
                        }

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

                    setTimeout(()=>{
                        //Fecha menu
                        document.getElementById("ctl24_xgvAvaliacao_DXPEForm_efnew_DXCBtn1").click();
                    },500);

                    //Abre modal
                    document.getElementById("dialogPreset").showModal();
                },350);
            } else {
                tentativas--;
                aguardaFormAvaliacao();
                console.log("tentativa: " + (1000-tentativas) + "/1000");
            }
        },10);
    }
    aguardaFormAvaliacao();
}

let bt = document.createElement("button");
bt.innerText = "Teste";
bt.id = "teste";
bt.addEventListener("click", ()=>{
    criarModal();
});
document.getElementsByTagName("body")[0].appendChild(bt);
