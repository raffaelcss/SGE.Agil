function getAllContextosFaltas(){
    var objContextoPadraoFaltas = { 
        Nome: "Contextos",
        Qtd_contextos: 0,    
    };
    if (!objContextoPadraoFaltas.Contextos) { 
        objContextoPadraoFaltas.Contextos = [];
    }

    //Busca contextos salvos, anteriormente chamados apenas de turmas
    var objAllContextosFaltas;

    if (typeof localStorage['SGE-Ágil-Faltas-Consecutivas'] == "undefined"){
        objAllContextosFaltas = objContextoPadraoFaltas;
    } else {
        objAllContextosFaltas = JSONToobj(localStorage['SGE-Ágil-Faltas-Consecutivas']);
    }

    var contextoAtual = document.getElementById("ctl03_ctl42").getElementsByTagName("span")[0].innerText;

    var possuiContextoAtual = false;
    //Verifica se já existe o contexto atual e atualiza suas turmas
    if (typeof objAllContextosFaltas.Contextos.find(element => element.Nome == contextoAtual) != "undefined"){
        possuiContextoAtual = true;
        
        objAllContextosFaltas.Contextos.find(element => element.Nome == contextoAtual)["UcsTurmas"] = getObjContextoFaltas(objAllContextosFaltas)["UcsTurmas"];
    }

    //Caso não exista adiciona
    if (!possuiContextoAtual){
        objAllContextosFaltas.Contextos.push(getObjContextoFaltas(objAllContextosFaltas));
    }

    //Contar contextos
    objAllContextosFaltas.Qtd_contextos = objAllContextosFaltas.Contextos.length;    
    
    return objAllContextosFaltas;
}

function getObjContextoFaltas(objAllContextosFaltas){

    var contextoAtual = document.getElementById("ctl03_ctl42").getElementsByTagName("span")[0].innerText;
    //pega obj com contexto atual
    var objContextoAtual = objAllContextosFaltas.Contextos.find(element => element.Nome == contextoAtual);
    
    var subObj = { 
        Nome: contextoAtual,
        Qtd_ucs_turmas: 0,
    };
    if (!subObj.UcsTurmas) { 
        subObj.UcsTurmas = [];
    }

    //Caso não tenha a UC atual recebe a padrão
    if (typeof objContextoAtual == "undefined"){
        objContextoAtual = subObj;
    }

    var ucTurmaAtual = document.getElementById("ctl24_EduTurmasProfFiltroSelecionado1_xrpContextoEducacional_lbTurmaDisc").innerText;

    var possuiTurmaAtual = false;
    //Verifica se já existe a turma atual e atualiza seus meses
    if (typeof objContextoAtual.UcsTurmas.find(element => element.Nome == ucTurmaAtual) != "undefined"){
        possuiTurmaAtual = true;
        
        objContextoAtual.UcsTurmas.find(element => element.Nome == ucTurmaAtual)["Meses"] = getObjUcTurma(objContextoAtual)["Meses"];
    }

    //Caso não exista adiciona
    if (!possuiTurmaAtual){
        objContextoAtual.UcsTurmas.push(getObjUcTurma(objContextoAtual));
    }

    //Contar Turmas
    objContextoAtual.Qtd_ucs_turmas = objContextoAtual.UcsTurmas.length;    


    return objContextoAtual;
}

function getObjUcTurma(objContextoAtual)
{
    var ucTurmaAtual = document.getElementById("ctl24_EduTurmasProfFiltroSelecionado1_xrpContextoEducacional_lbTurmaDisc").innerText;
    //pega obj com turma atual
    var objTurmaAtual = objContextoAtual.UcsTurmas.find(element => element.Nome == ucTurmaAtual);

    var subObj = { 
        Nome: ucTurmaAtual,
        Qtd_meses: 0,
    };
    if (!subObj.Meses) { 
        subObj.Meses = [];
    }

    //Caso não tenha a UC atual recebe a padrão
    if (typeof objTurmaAtual == "undefined"){
        objTurmaAtual = subObj;
    }

    var mesAtual = document.getElementById("ctl24_xcbEtapaFaltas_I").value;

    var possuiMesAtual = false;
    //Verifica se já existe o mes atual e atualiza seus alunos
    if (typeof objTurmaAtual.Meses.find(element => element.Nome == mesAtual) != "undefined"){
        possuiMesAtual = true;
        
        objTurmaAtual.Meses.find(element => element.Nome == mesAtual)["Alunos"] = getObjMes(objTurmaAtual)["Alunos"];
    }

    //Caso não exista adiciona
    if (!possuiMesAtual){
        objTurmaAtual.Meses.push(getObjMes(objTurmaAtual));
    }

     //Contar meses
     objTurmaAtual.Qtd_meses = objTurmaAtual.Meses.length;

    return objTurmaAtual;
}

function getObjMes(objTurmaAtual){
    var mesAtual = document.getElementById("ctl24_xcbEtapaFaltas_I").value;
    //pega obj com mes atual
    var objMesAtual = objTurmaAtual.Meses.find(element => element.Nome == mesAtual);

    var subObj = { 
        Nome: mesAtual,
        Qtd_alunos: 0,
    };

    if (!subObj.Alunos) { 
        subObj.Alunos = [];
    }

    //Caso não tenha o mês atual recebe a padrão
    if (typeof objMesAtual == "undefined"){
        objMesAtual = subObj;
    }

    //Array com o tr de cada aluno porém com cabeçalho
    var trArrayAllAlunosWithCabecalho = document.getElementById("ctl24_ctl06").getElementsByTagName("tr");
    var trArrayAllAlunos = [];
    Array.from(trArrayAllAlunosWithCabecalho).forEach(tr => {
        //Verifica se não é um cabeçalho e adciona no novo array
        if (tr.classList[0] != "EduTableFreqHeader"){
            trArrayAllAlunos.push(tr);
        }
    });

    //Adicionando todos os alunos
    Array.from(trArrayAllAlunos).forEach(tr => {
        //pega o RA do aluno a ser comparado
        var raAtual = tr.getElementsByTagName("td")[1].innerText;

        var possuiAlunoAtual = false;
        //Verifica se já existe o aluno atual e atualiza seus dias
        if (typeof objMesAtual.Alunos.find(element => element.RA == raAtual) != "undefined"){
            possuiAlunoAtual = true;
            
            objMesAtual.Alunos.find(element => element.RA == raAtual)["Datas"] = insertionSort(getObjAluno(objMesAtual, tr)["Datas"]);

        }
        //Caso não exista adiciona
        if (!possuiAlunoAtual){
            objMesAtual.Alunos.push(getObjAluno(objMesAtual, tr));
        }
    });

    //Contar Alunos
    objMesAtual.Qtd_alunos = objMesAtual.Alunos.length;

    return objMesAtual;
}

function insertionSort(vetorObjDatas){
    //Obtem vetor com as datas
    var vetorDatas = [];
    Array.from(vetorObjDatas).forEach(objData => {
        let barraPos = objData.Data.indexOf("/");
        let dia = parseInt(objData.Data.substring(0,barraPos));
        let mes = parseInt(objData.Data.substring(barraPos+1,objData.Data.length));
        let num = mes*50 + dia;
        vetorDatas.push(num);
    });

    var retorno = vetorObjDatas;

    //insertionSort
    for (i = 1; i < vetorDatas.length; i++){
        
        var aux = vetorDatas[i];
        var aux2 = retorno[i];
        var j = i;
        
        while ((j > 0) && (vetorDatas[j-1] > aux)){
            vetorDatas[j] = vetorDatas[j-1];
            vetorObjDatas[j] = retorno[j-1];
            j -= 1;
        }
        vetorDatas[j] = aux;
        retorno[j] = aux2;
    }

    return retorno;
}

function getObjAluno(objMesAtual, tr){
    var raAtual = tr.getElementsByTagName("td")[1].innerText;
    //pega obj com aluno atual
    var objAlunoAtual = objMesAtual.Alunos.find(element => element.RA == raAtual);

    var subObj = { 
        RA: raAtual,
        Nome: tr.getElementsByTagName("td")[2].innerText,
        Situacao: tr.getElementsByTagName("td")[3].innerText,
        Qtd_dias_lancados: 0,
        Qtd_faltas: 0,
        Qtd_faltas_consecutivas: 0
    };

    if (!subObj.Datas) { 
        subObj.Datas = [];
    }

    //Caso não tenha o aluno atual recebe o padrão
    if (typeof objAlunoAtual == "undefined"){
        objAlunoAtual = subObj;
    }

    var tdArrayAllDatas = document.getElementById("ctl24_pnlHorarios").getElementsByClassName("EduTableFreqHeader")[0].getElementsByTagName("td");

    //Adicionando todos os horários
    Array.from(tdArrayAllDatas).forEach(td => {
        //pega a data a ser comparada
        var dataAtual = td.innerText;

        var possuiDataAtual = false;
        //Verifica se já existe a data atual e atualiza seus horarios
        if (typeof objAlunoAtual.Datas.find(element => element.Data == dataAtual) != "undefined"){
            possuiDataAtual = true;
            
            objAlunoAtual.Datas.find(element => element.Data == dataAtual)["Horarios"] = getObjData(objAlunoAtual, td, Array.from(tdArrayAllDatas).indexOf(td))["Horarios"];
        }
        //Caso não exista adiciona
        if (!possuiDataAtual){
            objAlunoAtual.Datas.push(getObjData(objAlunoAtual, td, Array.from(tdArrayAllDatas).indexOf(td) ));
        }
    });

    //Contar dias
    objAlunoAtual.Qtd_dias_lancados = objAlunoAtual.Datas.length;

    //Contar faltas totais e consecutivas
    let faltasTotais = 0;
    let faltasConsecutivas = 0;
    Array.from(objAlunoAtual.Datas).forEach(data => {
        Array.from(data.Horarios).forEach(horario => {
            if (horario.Ausencia) {
                faltasTotais++;
            }
        });
    });
    objAlunoAtual.Qtd_faltas = faltasTotais;

    return objAlunoAtual;
}

function getObjData(objAlunoAtual, td, hor){
    var dataAtual = td.innerText;
    //pega obj com data atual
    var objDataAtual = objAlunoAtual.Datas.find(element => element.Data == dataAtual);

    var subObj = { 
        Data: td.innerText,
        Qtd_horarios: 0,
    };
    if (!subObj.Horarios) { 
        subObj.Horarios = [];
    }

    //Caso não tenha a data atual recebe a padrão
    if (typeof objDataAtual == "undefined"){
        objDataAtual = subObj;
    }

    var tdArrayAllHorarios = document.getElementById("ctl24_pnlHorarios").getElementsByClassName("EduTableFreqHeader")[1].getElementsByTagName("td");

    //pega o horario a ser comparado
    var horarioAtual = tdArrayAllHorarios[hor].innerText;

    //pega a ausencia do aluno no horario atual
    var ausencia = getAusenciaAlunoHorario(objAlunoAtual.RA, hor);

    var possuiHorarioAtual = false;
    //Verifica se já existe o horario atual e atualizar sua ausencia
    if (typeof objDataAtual.Horarios.find(element => element.Horario == horarioAtual) != "undefined"){
        possuiHorarioAtual = true;
        
        objDataAtual.Horarios.find(element => element.Horario == horarioAtual)["Ausencia"] = ausencia;
    }
    //Caso não exista adiciona
    if (!possuiHorarioAtual){
        objDataAtual.Horarios.push(getObjHorario(horarioAtual, ausencia));
    }

    //Contar dias
    objDataAtual.Qtd_horarios = objDataAtual.Horarios.length;

    return objDataAtual;
}

function getObjHorario(horario, ausencia){
    var subObj = { 
        Horario: horario,
        Ausencia: ausencia
    };

    return subObj;
}

function getAusenciaAlunoHorario(RA, hor){
    //Pegando a linha dos RA's
    var listaTrRA = Array.from(document.getElementById("ctl24_ctl06").getElementsByTagName("tr"));
    var listaRAs = [];

    listaTrRA.forEach(tr => {
        if (!tr.classList.contains("EduTableFreqHeader")){
            listaRAs.push(tr.children[1].innerText);
        }
    });

    //Pegando a linha dos Checkbox
    var listaTRCheckbox = Array.from(document.getElementsByClassName("EduTableFreqMain")[1].getElementsByTagName("tr"));
    var listaCheckbox = [];

    listaTRCheckbox.forEach(tr => {
        if (!tr.classList.contains("EduTableFreqHeader")){
            listaCheckbox.push(tr);
        }
    });

    //Pegando Aluno específico

    let posAluno = listaRAs.indexOf(RA);
    if (posAluno < 0){
        return false;
    }

    let ausencia = listaCheckbox[posAluno].children[hor].children[0].checked;
    return ausencia;
}

function saveJSONfaltas(objAllContextosFaltas){

    let json = objToJSON(objAllContextosFaltas);
    localStorage['SGE-Ágil-Faltas-Consecutivas'] = json;

    return json;
}

function funcBotao(){
    saveJSONfaltas(getAllContextosFaltas());
}

function addFunctionButton(){
    var bnt = document.getElementById("ctl24_xbtSalvar")
    bnt.addEventListener("click", funcBotao, false);
}

//A ser executado na página
if (document.getElementById("tbPrincipal")){
    addFunctionButton();
    console.log("Contexto atual: ");
    var contextoObtido = objToJSON(getAllContextosFaltas());
    console.log(contextoObtido);
}

