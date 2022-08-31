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

    var possuiContextoAtual = false;
    var contextoAtual = document.getElementById("ctl03_ctl42").getElementsByTagName("span")[0].innerText;


    //Verifica se já existe o contexto atual e atualiza suas turmas
    if (typeof objAllContextosFaltas.Contextos.find(element => element.Nome == contextoAtual) != "undefined"){
        possuiContextoAtual = true;
        objAllContextosFaltas.Contextos.find(element => element.Nome == contextoAtual)["UcsTurmas"] = getObjContextoFaltas(contextoAtual)["UcsTurmas"];
    }

    //Caso não exista adiciona
    if (!possuiContextoAtual){
        objAllContextosFaltas.Contextos.push(getObjContextoFaltas(contextoAtual));
    }
    
    localStorage['SGE-Ágil-Faltas-Consecutivas'] = objToJSON(objAllContextosFaltas);
    
    return objAllContextosFaltas;
}

function getObjContextoFaltas(contextoAtual){
    var subObj = { 
        Nome: contextoAtual,
        Qtd_ucs_turmas: 0,
    };
    if (!subObj.UcsTurmas) { 
        subObj.UcsTurmas = [];
    }

    var ucTurmaAtual = document.getElementById("ctl24_EduTurmasProfFiltroSelecionado1_xrpContextoEducacional_lbTurmaDisc").innerText;

   //Adicionando contexto atual
   subObj.UcsTurmas.push(getObjUcTurma(ucTurmaAtual));

    return subObj;
}

function getObjUcTurma(ucTurmaAtual)
{
    var subObj = { 
        Nome: ucTurmaAtual,
        Qtd_meses: 0,
    };
    if (!subObj.Meses) { 
        subObj.Meses = [];
    }

    var mesAtual = document.getElementById("ctl24_xcbEtapaFaltas_I").value;

   //Adicionando mes atual
   subObj.Meses.push(getObjMes(mesAtual));

    return subObj;
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
