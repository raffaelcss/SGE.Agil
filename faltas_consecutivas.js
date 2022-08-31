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
    
    localStorage['SGE-Ágil-Faltas-Consecutivas'] = objToJSON(objAllContextosFaltas);
    
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

    //Contar contextos
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
            
            objMesAtual.Alunos.find(element => element.RA == raAtual)["Datas"] = getObjAluno(objMesAtual, tr)["Datas"];
        }
        //Caso não exista adiciona
        if (!possuiAlunoAtual){
            objMesAtual.Alunos.push(getObjAluno(objMesAtual, tr));
        }
    });

    return objMesAtual;
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
            
            objAlunoAtual.Datas.find(element => element.Data == dataAtual)["Horarios"] = getObjData(objAlunoAtual, td)["Horarios"];
        }
        //Caso não exista adiciona
        if (!possuiDataAtual){
            objAlunoAtual.Datas.push(getObjData(objAlunoAtual, td));
        }
    });

    return objAlunoAtual;
}

function getObjData(objAlunoAtual, td){
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

    Array.from(tdArrayAllHorarios).forEach(td => {
        //pega o horario a ser comparada
        var horarioAtual = td.innerText;

        //pega a ausencia do aluno no horario atual
        var ausencia = false;

        var possuiHorarioAtual = false;
        //Verifica se já existe o horario atual e o substitui
        if (typeof objDataAtual.Horarios.find(element => element.Horario == horarioAtual) != "undefined"){
            possuiHorarioAtual = true;
            
            objDataAtual.Horarios.find(element => element.Horario == horarioAtual) = getObjHorario(td, ausencia);
        }
        //Caso não exista adiciona
        if (!possuiHorarioAtual){
            objDataAtual.Horarios.push(getObjHorario(td, ausencia));
        }
    });

    return objDataAtual;
}

function getObjHorario(td, ausencia){
    var subObj = { 
        Horario: td.innerText,
        Ausencia: ausencia
    };

    return subObj;
}


//A ser executado na página

console.log("Contexto atual: ");
var contextoObtido = objToJSON(getAllContextosFaltas());
console.log(contextoObtido);
