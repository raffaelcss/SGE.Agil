function getUsuario(){
    if (document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_ctl00_xrpContextoEducacional_lbUsuario")){
        let user = "" + document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_ctl00_xrpContextoEducacional_lbUsuario").innerText;

        setCookie("SGE.Agil_User", user, 43800);
        return user;
    } else {
        let user = getCookie("SGE.Agil_User", "");
        if (user != ""){
            return getCookie("SGE.Agil_User", "");
        }
        //Volta para guia inicial caso não tenha usuario
        window.location.replace(window.location.origin + window.location.pathname);
    }
}

function objToJSON(obj){
    return JSON.stringify(obj);
}

function JSONToobj(json_string){
    return JSON.parse(json_string);
}

function Turmas_novas(json1, json2){
    //JSON1 Salvo no LocalStorage
    //JSON2 Atual    
    var obj1 = JSONToobj(json1);
    var obj2 = JSONToobj(json2);
    
    var novas = [];
    obj2.Turmas.forEach(element => {
        //Pega o nome de todas as UC do objeto principal
        let nomeUCs = [];
        Array.from(element.Ucs).forEach(uc => {
            nomeUCs.push(uc.Nome);
        });
        var igual = false;
        obj1.Turmas.forEach(element2 => {
            //Pega o nome de todas as UC do objeto principal
            let nomeUCsComparados = [];
            Array.from(element2.Ucs).forEach(uc2 => {
                nomeUCsComparados.push(uc2.Nome);
            });
            //Verifica se pelo menos uma UC é igual
            let mesmaTurma = false;
            nomeUCs.forEach(nomeUcNova => {
                nomeUCsComparados.forEach(nomeUCantiga => {
                    //Se pelo menos uma UC tiver o mesmo nome é a mesma turma (As UCs possuem o código específico da turma)
                    if (nomeUcNova == nomeUCantiga){
                        mesmaTurma = true;
                    }
                });
            });
            //Compara o Nome da Turma e o nome da primeira UC, para evitar erro de turmas com mesmo nome
            if (element.Nome === element2.Nome && mesmaTurma)
                igual = true;
        })
        if (!igual){
            novas.push(element);
        }
    })

    return novas;
}

function UCs_novas(json1, json2){
    //JSON1 Salvo no LocalStorage
    //JSON2 Atual    
    var obj1 = JSONToobj(json1);
    var obj2 = JSONToobj(json2);
    
    var novas = [];
    obj2.Turmas.forEach(t_nova => {     
        //Pega o nome de todas as UC do objeto principal
        let nomeUCs = [];
        Array.from(t_nova.Ucs).forEach(uc => {
            nomeUCs.push(uc.Nome);
        });
        obj1.Turmas.forEach(t_ant => {
            //Pega o nome de todas as UC do objeto principal
            let nomeUCsComparados = [];
            Array.from(t_ant.Ucs).forEach(uc2 => {
                nomeUCsComparados.push(uc2.Nome);
            });
            //Verifica se pelo menos uma UC é igual
            let mesmaTurma = false;
            nomeUCs.forEach(nomeUcNova => {
                nomeUCsComparados.forEach(nomeUCantiga => {
                    //Se pelo menos uma UC tiver o mesmo nome é a mesma turma (As UCs possuem o código específico da turma)
                    if (nomeUcNova == nomeUCantiga){
                        mesmaTurma = true;
                    }
                });
            });
            //Compara o Nome da Turma e o nome da primeira UC, para evitar erro de turmas com mesmo nome
            if ((t_ant.Nome === t_nova.Nome) && mesmaTurma && (t_ant.Qtd_ucs !== t_nova.Qtd_ucs)) {
                novas.push(t_ant);
                t_nova.Ucs.forEach(uc_nova => {
                    var igual = false;
                    t_ant.Ucs.forEach(uc_ant => {
                        if (uc_ant.Nome === uc_nova.Nome)
                            igual = true;
                    })
                    if (!igual){
                        //console.log("Add");
                        novas[novas.length - 1].Ucs.push(uc_nova);
                    }
                })
                // console.log(t_ant.Qtd_ucs);
                novas[novas.length - 1].Ucs.splice(0,t_ant.Qtd_ucs); 
            }
        }) 
    })

    return novas;
}

function getObjUC(uc, turma){
    //var inicio_text = uc.children[0].innerHTML.indexOf('>');
    var subObj = { 
        Nome: uc.children[0].innerText,
        Turma: turma
    };

    return subObj;
}

function getObjTurma(turma, is_archived = false){
    var subObj = { 
        Nome: turma.children[0].children[1].innerHTML,
        Qtd_ucs: turma.children[2].children.length,
        Is_archived: is_archived
    };

    if (!subObj.Ucs) { 
        subObj.Ucs = [];
    }

    Array.from(turma.children[2].children).forEach(element => {
        subObj.Ucs.push(getObjUC(element, subObj.Nome));
    })

    return subObj;
}

function getTurmasJSON(json, nomeContexto){
    let objTemp = JSONToobj(json);

    let objTurmTemp = {};

    Array.from(objTemp.Contextos).forEach(contexto => {
        if (contexto.Nome == nomeContexto){
            objTurmTemp = contexto;
        }
    });

    return objToJSON(objTurmTemp);
}

function getObjContextoEducacional(){
    //Local onde encontra as turmas no html
    let ul_pai = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina");
    var subObj = { 
        //Pega contexto educacional
        Nome: document.getElementById("ctl03_ctl42").getElementsByTagName("span")[0].innerText,
        Qtd_turmas: ul_pai.children.length,    
    }
    if (!subObj.Turmas) { 
        subObj.Turmas = [];
    }

    Array.from(ul_pai.children).forEach(element => {
        let is_archived = element.classList.contains("archived");
        // console.log(is_archived);
        subObj.Turmas.push(getObjTurma(element, is_archived));
    })

    return subObj;
}

function getAllContextos(){
    var objContextoPadrao = { 
        Nome: "Contextos",
        Qtd_contextos: 0,    
    };
    if (!objContextoPadrao.Contextos) { 
        objContextoPadrao.Contextos = [];
    }

    let user = getUsuario();
    //Corrigindo pré multi-user
    if (typeof localStorage['SGE-Ágil-Turmas_atuais'] != "undefined"){
        if (typeof user != "undefined"){
            //Setando novo multi-user
            localStorage['SGE-Ágil-Turmas_atuais-' + user] = localStorage['SGE-Ágil-Turmas_atuais'];
            //Removendo anterior
            localStorage.removeItem("SGE-Ágil-Turmas_atuais");
        }
    }

    //Busca contextos salvos, anteriormente chamados apenas de turmas
    var objContextos;

    if (typeof localStorage['SGE-Ágil-Turmas_atuais-' + user] == "undefined"){
        objContextos = objContextoPadrao;
    } else {
        objContextos = JSONToobj(localStorage['SGE-Ágil-Turmas_atuais-' + user]);
    }

    //Verifica se está com o JSON antigo e o atualiza para o novo 0.3.1
    if(typeof objContextos.Contextos == "undefined"){
        objContextos = objContextoPadrao;
    }

    var possuiContextoAtual = false;
    var contextoAtual = document.getElementById("ctl03_ctl42").getElementsByTagName("span")[0].innerText;
    //Verifica se já possui o contexto atual e atualiza
    Array.from(objContextos.Contextos).forEach(contexto => {
        if (contexto.Nome == contextoAtual){
            possuiContextoAtual = true;
            objContextos.Contextos.find(element => element.Nome == contexto.Nome)["Turmas"] = getObjContextoEducacional()["Turmas"];
            //legado
            // contexto = getObjContextoEducacional();
        }
    });
    //Caso não haja o contexto atual, adiciona-o;
    let novosContextos = false;
    if(!possuiContextoAtual){
        objContextos.Contextos.push(getObjContextoEducacional());
        novosContextos = true;
    }

    //Atualiza Qtd_contextos
    objContextos.Qtd_contextos = objContextos.Contextos.length;

    if (novosContextos) {
        //Salva na memória
        localStorage['SGE-Ágil-Turmas_atuais-' + user] = objToJSON(objContextos);
    }

    return objContextos;
}

function atualizaArchivedStatus(turmAntObj, turmAtuaisObj){
    turmAntObj.Turmas.forEach(element_antigo => {  
        turmAtuaisObj.Turmas.forEach(element_atual => {
            if (element_antigo.Nome == element_atual.Nome){
                element_atual.Is_archived = element_antigo.Is_archived;
                //console.log(element_antigo.Is_archived);
            }
        });
    });
}

//Deve ser executado para montar a lista de turmas independete de usar as features de aviso e de arquivar
if (document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina")){

    //Busca contextos atuais
    var contextosExistentes = getAllContextos();
    //console.log(objToJSON(contextosExistentes));
    var contextoAtual = document.getElementById("ctl03_ctl42").getElementsByTagName("span")[0].innerText;

    //Busca turmas atuais (legado)
    // var turmasAtuaisJSON = objToJSON(getObjContextoEducacional());

    //Busca turmas atuais (novo) a partir do contexto
    var turmasAtuaisJSON = objToJSON(getObjContextoEducacional());

    // console.log("Contextos educacionais: ");
    // console.log(objToJSON(contextosExistentes));

    let user = getUsuario();

    //Buscar Json com turmas iniciais
    if (typeof localStorage['SGE-Ágil-Turmas_atuais-' + user] == "undefined"){
        //Salva as novas turmas no Local Storage
        localStorage['SGE-Ágil-Turmas_atuais-' + user] = objToJSON(contextosExistentes);
    }

    // retirado o (|| turmasAtuaisJSON) pois já é feito no if anterior
    var contextosAntigosJSON = localStorage['SGE-Ágil-Turmas_atuais-' + user]; //|| turmasAtuaisJSON;

    var turmasAntigasJSON = getTurmasJSON(contextosAntigosJSON, contextoAtual);

    // console.log("Turmas antigas: ");
    // console.log(turmasAntigasJSON);

    var turmAntigasObj;
    var turmAtuaisObj;
    try {
        turmAntigasObj = JSONToobj(turmasAntigasJSON);
        turmAtuaisObj = JSONToobj(turmasAtuaisJSON);
    } catch (e) {
        turmAntigasObj = {};
        turmAtuaisObj = {};
    }
    //Atualiza o status de Is_archived de cada turma no JSON
    atualizaArchivedStatus(turmAntigasObj, turmAtuaisObj);
    turmasAtuaisJSON = objToJSON(turmAtuaisObj);
    // console.log("TURMAS:")
    // console.log(turmasAtuaisJSON);

    // console.log("Contextos antes:");
    // console.log(objToJSON(contextosExistentes));
    //Atualiza o status de Is_archived de cada turma no JSON
    atualizaArchivedStatus(turmAtuaisObj, contextosExistentes.Contextos.find(element => element.Nome == contextoAtual));

    // console.log("Contextos depois:");
    // console.log(objToJSON(contextosExistentes));

}
