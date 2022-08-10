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
        var igual = false;
        obj1.Turmas.forEach(element2 => {
            if (element.Nome === element2.Nome)
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
        obj1.Turmas.forEach(t_ant => {  
            if ((t_ant.Nome === t_nova.Nome) && (t_ant.Qtd_ucs !== t_nova.Qtd_ucs)) {
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

function Json_UC(uc, turma){
    var inicio_text = uc.children[0].innerHTML.indexOf('>');
    var subObj = { 
        Nome: uc.children[0].innerHTML.substring(inicio_text+1),
        Turma: turma
    };

    return subObj;
}

function Json_Turmas(turma, is_archived = false){
    var subObj = { 
        Nome: turma.children[0].children[1].innerHTML,
        Qtd_ucs: turma.children[2].children.length,
        Is_archived: is_archived
    };

    if (!subObj.Ucs) { 
        subObj.Ucs = [];
    }

    Array.from(turma.children[2].children).forEach(element => {
        subObj.Ucs.push(Json_UC(element, subObj.Nome));
    })

    return subObj;
}

function Json_Principal(ul_pai){
    var subObj = { 
        Nome: "Turmas",
        Qtd_turmas: ul_pai.children.length,    
    };
    if (!subObj.Turmas) { 
        subObj.Turmas = [];
    }

    Array.from(ul_pai.children).forEach(element => {
        let is_archived = element.classList.contains("archived");
        // console.log(is_archived);
        subObj.Turmas.push(Json_Turmas(element, is_archived));
    })

    return objToJSON(subObj);
}

//Deve ser executado para montar a lista de turmas independete de usar as features de aviso e de arquivar
if (document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina")){

    //Busca turmas atuais
    var turmas_atuais = Json_Principal(document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina"));

    //Buscar Json com turmas iniciais
    if (typeof localStorage['SGE-Ágil-Turmas_atuais'] == "undefined"){
        //Salva as novas turmas no Local Storage
        localStorage['SGE-Ágil-Turmas_atuais'] = turmas_atuais;
    } 
    var turmas_antigas = localStorage['SGE-Ágil-Turmas_atuais'] || turmas_atuais;
}
