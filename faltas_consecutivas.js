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
        Qtd_alunos: 0,
    };
    if (!subObj.Alunos) { 
        subObj.Alunos = [];
    }

    //Caso não tenha a UC atual recebe a padrão
    if (typeof objTurmaAtual == "undefined"){
        objTurmaAtual = subObj;
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
        if (typeof objTurmaAtual.Alunos.find(element => element.RA == raAtual) != "undefined"){
            possuiAlunoAtual = true;
            
            objTurmaAtual.Alunos.find(element => element.RA == raAtual)["Meses"] = getObjAluno(objTurmaAtual, tr)["Meses"];

        }
        //Caso não exista adiciona
        if (!possuiAlunoAtual){
            objTurmaAtual.Alunos.push(getObjAluno(objTurmaAtual, tr));
        }
    });

    //Contar Alunos
    objTurmaAtual.Qtd_alunos = objTurmaAtual.Alunos.length;

    return objTurmaAtual;
}

function getObjAluno(objTurmaAtual, tr){
    var raAtual = tr.getElementsByTagName("td")[1].innerText;
    //pega obj com aluno atual
    var objAlunoAtual = objTurmaAtual.Alunos.find(element => element.RA == raAtual);

    var subObj = { 
        RA: raAtual,
        Nome: tr.getElementsByTagName("td")[2].innerText,
        Situacao: tr.getElementsByTagName("td")[3].innerText,
        ExibirMsg: true,
        Qtd_meses: 0,
        Qtd_dias_lancados: 0,
        Qtd_faltas: 0,
        Qtd_faltas_consecutivas: 0
    };

    if (!subObj.Meses) { 
        subObj.Meses = [];
    }
    if (!subObj.FaltasConsecutivas) { 
        subObj.FaltasConsecutivas = [];
    }

    //Caso não tenha o aluno atual recebe o padrão
    if (typeof objAlunoAtual == "undefined"){
        objAlunoAtual = subObj;
    }

    var mesAtual = document.getElementById("ctl24_xcbEtapaFaltas_I").value;

    var possuiMesAtual = false;
    //Verifica se já existe o mes atual e atualiza seus alunos
    if (typeof objAlunoAtual.Meses.find(element => element.Nome == mesAtual) != "undefined"){
        possuiMesAtual = true;
        
        objAlunoAtual.Meses.find(element => element.Nome == mesAtual)["Dias"] = insertionSort(getObjMes(objAlunoAtual)["Dias"]);
    }

    //Caso não exista adiciona
    if (!possuiMesAtual){
        objAlunoAtual.Meses.push(getObjMes(objAlunoAtual));
    }

    //Contar meses
    objAlunoAtual.Qtd_meses = objAlunoAtual.Meses.length;

    //Contar dias totais e faltas
    let dias_lancados = 0;
    let faltas = 0;
    Array.from(objAlunoAtual.Meses).forEach(mes => {
        dias_lancados += mes.Qtd_dias;
        faltas += mes.Qtd_faltas;
    });
    objAlunoAtual.Qtd_dias_lancados = dias_lancados;
    objAlunoAtual.Qtd_faltas = faltas;

    //Conta faltas consecutivas e guarda as faltas
    let qtdFaltasConsecutivas = 0;
    let arrayFaltasCosecutivas = [];
    Array.from(objAlunoAtual.Meses).forEach(mes => {
        Array.from(mes.Dias).forEach(dia => {
            Array.from(dia.Horarios).forEach(horario => {
                if (horario.Ausencia){
                    qtdFaltasConsecutivas++;
                    arrayFaltasCosecutivas.push(dia.Dia + " " + horario.Horario);
                } else {
                    qtdFaltasConsecutivas = 0;
                    arrayFaltasCosecutivas = [];
                }
            });
        });
    });
    objAlunoAtual.Qtd_faltas_consecutivas = qtdFaltasConsecutivas;
    objAlunoAtual.FaltasConsecutivas = arrayFaltasCosecutivas;

    //Reativar msg caso tenha voltado a aula
    if (!objAlunoAtual.ExibirMsg && objAlunoAtual.Qtd_faltas_consecutivas == 0){
        //Reativa mensagens
        objAlunoAtual.ExibirMsg = true;
    }

    return objAlunoAtual;
}

function insertionSort(vetorObjDias){
    //Obtem vetor com as datas
    var vetorDias = [];
    Array.from(vetorObjDias).forEach(objData => {
        let barraPos = objData.Dia.indexOf("/");
        let dia = parseInt(objData.Dia.substring(0,barraPos));
        let mes = parseInt(objData.Dia.substring(barraPos+1,objData.Dia.length));
        let num = mes*50 + dia;
        vetorDias.push(num);
    });

    var retorno = vetorObjDias;

    //insertionSort
    for (i = 1; i < vetorDias.length; i++){
        
        var aux = vetorDias[i];
        var aux2 = retorno[i];
        var j = i;
        
        while ((j > 0) && (vetorDias[j-1] > aux)){
            vetorDias[j] = vetorDias[j-1];
            vetorObjDias[j] = retorno[j-1];
            j -= 1;
        }
        vetorDias[j] = aux;
        retorno[j] = aux2;
    }

    return retorno;
}

function getObjMes(objAlunoAtual){
    var mesAtual = document.getElementById("ctl24_xcbEtapaFaltas_I").value;
    //pega obj com mes atual
    var objMesAtual = objAlunoAtual.Meses.find(element => element.Nome == mesAtual);

    var subObj = { 
        Nome: mesAtual,
        Qtd_dias: 0,
        Qtd_faltas: 0
    };

    if (!subObj.Dias) { 
        subObj.Dias = [];
    }

    //Caso não tenha o mês atual recebe a padrão
    if (typeof objMesAtual == "undefined"){
        objMesAtual = subObj;
    }

    var tdArrayAllDatas = document.getElementById("ctl24_pnlHorarios").getElementsByClassName("EduTableFreqHeader")[0].getElementsByTagName("td");

    //Adicionando todos os horários
    Array.from(tdArrayAllDatas).forEach(td => {
        //pega a data a ser comparada
        var dataAtual = td.innerText;

        var possuiDataAtual = false;
        //Verifica se já existe a data atual e atualiza seus horarios
        if (typeof objMesAtual.Dias.find(element => element.Dia == dataAtual) != "undefined"){
            possuiDataAtual = true;
            
            objMesAtual.Dias.find(element => element.Dia == dataAtual)["Dias"] = getObjDia(objMesAtual, td, Array.from(tdArrayAllDatas).indexOf(td), objAlunoAtual.RA)["Dias"];
        }
        //Caso não exista adiciona
        if (!possuiDataAtual){
            objMesAtual.Dias.push(getObjDia(objMesAtual, td, Array.from(tdArrayAllDatas).indexOf(td), objAlunoAtual.RA));
        }
    });

    //Contando dias
    objMesAtual.Qtd_dias = objMesAtual.Dias.length;

    //Contando faltas
    let faltas = 0;
    Array.from(objMesAtual.Dias).forEach(dia => {
        faltas += dia.Qtd_faltas;
    });
    objMesAtual.Qtd_faltas = faltas;
    

    return objMesAtual;
}

function getObjDia(objMesAtual, td, hor, raAluno){
    var diaAtual = td.innerText;
    //pega obj com data atual
    var objDiaAtual = objMesAtual.Dias.find(element => element.Dia == diaAtual);

    var subObj = { 
        Dia: td.innerText,
        Qtd_horarios: 0,
        Qtd_faltas: 0
    };
    if (!subObj.Horarios) { 
        subObj.Horarios = [];
    }

    //Caso não tenha a data atual recebe a padrão
    if (typeof objDiaAtual == "undefined"){
        objDiaAtual = subObj;
    }

    var tdArrayAllHorarios = document.getElementById("ctl24_pnlHorarios").getElementsByClassName("EduTableFreqHeader")[1].getElementsByTagName("td");

    //pega o horario a ser comparado
    var horarioAtual = tdArrayAllHorarios[hor].innerText;

    //pega a ausencia do aluno no horario atual
    var ausencia = getAusenciaAlunoHorario(raAluno, hor);

    var possuiHorarioAtual = false;
    //Verifica se já existe o horario atual e atualizar sua ausencia
    if (typeof objDiaAtual.Horarios.find(element => element.Horario == horarioAtual) != "undefined"){
        possuiHorarioAtual = true;
        
        objDiaAtual.Horarios.find(element => element.Horario == horarioAtual)["Ausencia"] = ausencia;
    }
    //Caso não exista adiciona
    if (!possuiHorarioAtual){
        objDiaAtual.Horarios.push(getObjHorario(horarioAtual, ausencia));
    }

    //Contar dias
    objDiaAtual.Qtd_horarios = objDiaAtual.Horarios.length;

    //Contar faltas totais
    let faltasTotais = 0;
    Array.from(objDiaAtual.Horarios).forEach(horario => {
        if (horario.Ausencia) {
            faltasTotais++;
        }
    });
    objDiaAtual.Qtd_faltas = faltasTotais;

    return objDiaAtual;
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

function avisarAlunosSalvarContextos(){
    let avisoGeral = getBoolCookie("SGE.Agil_avisoFaltas", true);
    //Salva JSON
    saveJSONfaltas(getAllContextosFaltas());
    //avisa sobre alunos
    avisoAlunosFaltas(15, avisoGeral);
}

function addFunctionButton(){
    var bnt = document.getElementById("ctl24_xbtSalvar")
    bnt.addEventListener("click", avisarAlunosSalvarContextos, false);
}

function avisoAlunosFaltas(limiteFaltasConsecutivas, avisoGeral){
    let limite = limiteFaltasConsecutivas || 15;
    let contextosModificado = JSONToobj(localStorage['SGE-Ágil-Faltas-Consecutivas']);

    //Verifica cada aluno de cada turma
    Array.from(contextosModificado.Contextos).forEach(contexto => {
        Array.from(contexto.UcsTurmas).forEach(ucTurma => {
            Array.from(ucTurma.Alunos).forEach(aluno => {
                //Verifica aluno
                if (aluno.Situacao == "MATRICULADO" && aluno.Qtd_faltas_consecutivas >= limite && aluno.ExibirMsg && avisoGeral){
                    //Gera aviso
                    let texto = "Aluno(a) " + aluno.Nome + " faltou " + aluno.Qtd_faltas_consecutivas + " aulas consecutivas na UC " + ucTurma.Nome + ".\nAtenção à situação do(a) aluno(a)\nIgnorar (Cancelar) Não mostrar mais (OK)";
                    if (confirm(texto)){
                        //Desativa alertas do aluno até a próxima presença
                        aluno.ExibirMsg = false;
                    }
                }
            });
        });
    });

    //retorna objeto modificado
    return contextosModificado;
}

function Ligar_aviso_faltas(){
    //Setando cookie de aviso
    setCookie("SGE.Agil_avisoFaltas", true, 43800);
    //A ser executado na página
    if (document.getElementById("tbPrincipal")){
        //Adiciona função de gerar JSON ao botão de salvar
        addFunctionButton();
    } else if (document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina")){
        //avisa sobre alunos caso esteja na página principal
        avisoAlunosFaltas(15, avisoGeral);
    }
}

function Desligar_aviso_faltas(){
    //Setando cookie de aviso
    setCookie("SGE.Agil_avisoFaltas", false, 43800);
}


