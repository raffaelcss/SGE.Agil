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
        
        objTurmaAtual.Meses.find(element => element.Nome == mesAtual)["Alunos"] = getObjMes(mesAtual)["Alunos"];
    }

    //Caso não exista adiciona
    if (!possuiMesAtual){
        objTurmaAtual.Meses.push(getObjMes(mesAtual));
    }

    return objTurmaAtual;
}

function getObjMes(mesAtual){
    var subObj = { 
        Nome: mesAtual,
        Qtd_alunos: 0,
    };

    if (!subObj.Alunos) { 
        subObj.Alunos = [];
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
        let encontrado = subObj.Alunos.find(element => element.RA == tr.getElementsByTagName("td")[1].innerText);
        if (typeof encontrado == "undefined"){
            subObj.Alunos.push(getObjAluno(tr));
        }
    });

    return subObj;
}

function getObjAluno(tr){
    var subObj = { 
        RA: tr.children[1].innerText,
        Nome: tr.children[2].innerText,
        Situacao: tr.children[3].innerText,
        Qtd_dias_lancados: 0,
        Qtd_faltas: 0,
        Qtd_faltas_consecutivas: 0
    };

    if (!subObj.Datas) { 
        subObj.Datas = [];
    }

    var tdArrayAllDatas = document.getElementById("ctl24_pnlHorarios").getElementsByClassName("EduTableFreqHeader")[0].getElementsByTagName("td");

    //Adicionando todos os horários
    Array.from(tdArrayAllDatas).forEach(td => {
        let encontrado = subObj.Datas.find(element => element.Data == td.innerText);
        if (typeof encontrado == "undefined"){
            subObj.Datas.push(getObjData(td));
        }
    });

    return subObj
}

function getObjData(td){
    var subObj = { 
        Data: td.innerText,
        Qtd_horarios: 0,
    };
    if (!subObj.Horarios) { 
        subObj.Horarios = [];
    }

    var tdArrayAllHorarios = document.getElementById("ctl24_pnlHorarios").getElementsByClassName("EduTableFreqHeader")[1].getElementsByTagName("td");

    Array.from(tdArrayAllHorarios).forEach(td => {
        let encontrado = subObj.Horarios.find(element => element.Horario == td.innerText);
        if (typeof encontrado == "undefined"){
            subObj.Horarios.push(getObjHorario(td,false));
        }
    });

    return subObj
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
