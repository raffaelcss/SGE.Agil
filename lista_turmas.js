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
                console.log(t_ant.Qtd_ucs);
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

function Json_Turmas(turma){
    var subObj = { 
        Nome: turma.children[0].children[1].innerHTML,
        Qtd_ucs: turma.children[2].children.length,    
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
        subObj.Turmas.push(Json_Turmas(element));
    })

    return objToJSON(subObj);
}

function get_texto_alert_novos(obj, is_new){
    let saida = '';
    let qtd_ucs_total = 0;
    obj.forEach(element => {
        let inicio_text = 0;
        let Nome_curto = element.Nome.substring(inicio_text+1);
        const INIT_POS_TURMA = 3;
        for (var i = 0; i < INIT_POS_TURMA; i++){
            inicio_text = Nome_curto.indexOf('-');
            Nome_curto = Nome_curto.substring(inicio_text+1);
        }
        if (Nome_curto.length > 45){
            Nome_curto = Nome_curto.replace('&nbsp;','').substring(0,45);
            Nome_curto += '..';
        }
        
        saida += is_new ? '☀ ' : '▼ ';
        saida += Nome_curto;
        saida += '\n';
        let qtd_ucs_add = element.Ucs.length;
        element.Ucs.forEach(element2 => {
            saida += qtd_ucs_add <= 1 ? '└─→ ' : '├─→ ';
            qtd_ucs_add--;
            qtd_ucs_total++;
            let nome_curto_uc = element2.Nome;
            if (nome_curto_uc.length > 45){
                nome_curto_uc = nome_curto_uc.substring(0,45);
                nome_curto_uc += '..';
            }
            saida += nome_curto_uc;
            saida += '\n';
        })
    })

    return [saida, qtd_ucs_total];
}

function Ligar_aviso_new(){
    //console.log("Aviso ligado!");
    if (document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina")){
        let turmas_antigas = localStorage['SGE-Ágil-Turmas_atuais'];
        let turmas_atuais = Json_Principal(document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina"));
        let turmas_novas = Turmas_novas(turmas_antigas, turmas_atuais);
        let ucs_novas    = UCs_novas(turmas_antigas, turmas_atuais);

        //mensagens sobre turmas e ucs novas
        let str_turm_nova = get_texto_alert_novos(turmas_novas, true);
        let str_uc_nova = get_texto_alert_novos(ucs_novas, false);
        let qtd_ucs_novas_total = str_turm_nova[1] + str_uc_nova[1];

        // console.log(turmas_novas);
        // console.log(ucs_novas);
        

        let msg_confirm = 'Você possui ';
        if (turmas_novas.length >0){
            msg_confirm += `${turmas_novas.length} turma${turmas_novas.length > 1 ? "s" : ""} nova${turmas_novas.length > 1 ? "s" : ""}`;
        }
        if (turmas_novas.length >0 && ucs_novas.length >0){
            msg_confirm += ' e ';    
        }
        if (ucs_novas.length > 0) {
            msg_confirm += `${qtd_ucs_novas_total} unidade${qtd_ucs_novas_total > 1 ? "s" : ""} curricular${qtd_ucs_novas_total > 1 ? "es" : ""} nova${qtd_ucs_novas_total > 1 ? "s" : ""}`;
        }

        msg_confirm += '\n\n';
        msg_confirm += str_turm_nova[0];
        msg_confirm += '\n';
        msg_confirm += str_uc_nova[0];

        if (turmas_novas.length >0 || ucs_novas.length >0){
            var cont = 1000;
            function espera_SgeAgil(){
                setTimeout(() => {
                    if (document.getElementById("css_basico") || cont <= 0){         //Verifica se o css básico do SGE.Ágil já foi lançado, sinal que a página está carregada
                        setTimeout(() => {          //Tempo para o CSS carregar e a página abrir tbm
                            if (confirm(msg_confirm)){
                                //Salva as novas turmas no Local Storage
                                localStorage['SGE-Ágil-Turmas_atuais'] = turmas_atuais;
                            }
                        }, 800);
                        
                    } else {
                        cont--;
                        console.log("Debug: Esperando página carregar: " + (1000 - cont)*2 + "ms corridos")
                        espera_SgeAgil();
                    }
                }, 2);   
            }        
            //Recursividade boba, nem sei se precisaria, mais para o caso de internet lenta demorar carregar os css's da extenção
            espera_SgeAgil(); 
        }
    }
}

function Desligar_aviso_new(){
    //console.log("Aviso Desligado!");
}
