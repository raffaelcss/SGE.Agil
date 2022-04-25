// var equals = function (object1, object2) {
//     // Realiza a verificação das propriedades dos objetos.
//     var prop1 = Object.getOwnPropertyNames(object1);
//     var prop2 = Object.getOwnPropertyNames(object1);

//     // Realiza a verificação se ambos objetos possuem o mesmo número de 
//     // propriedades. Caso contrário, já retorna dizendo que são diferentes.
//     if(prop1.length !== prop2.length)
//         return false;

//     // Aqui, está sendo verificado se o objeto possui alguma propriedade.
//     // Será usado quando for chamada a função na sua forma recursiva,
//     // para verificar valores literais.
//     if(prop1.length === 0)
//         if(object1 === object2)
//             return true;
//         else
//             return false;

//     // Se forem iguais, realiza uma iteração por todas as propriedades.
//     for(var i = 0; i < prop1.length; i++) {
//     // Guarda o valor da propriedade atual na variável "prop".
//         var prop = prop1[i];

//     // Aqui está o pulo do gato.
//     // Verifica se o valor e o tipo das duas propriedades são iguais.
//     // Se sim, somente pula para a próxima iteração. Caso contrário,
//     // podem ser duas coisas: ou são realmente distintos, ou é um objeto,
//     // que, ao comparar as referências, retorna sempre falso.
//     // Para ter certeza da informação, é chamada a mesma função de forma
//     // recursiva, mandando, por parâmetro, os dois objetos que ficou a dúvida.
//     // Se forem iguais, ou se tiverem mais algum objeto internamente, 
//     // a função continuará a ser chamada recursivamente, até chegar ao
//     // ponto de ser um valor literal. Ou, então, retornará falso, pois não
//     // são iguais.
//     // Caso sejam iguais, a função só continuará para a próxima iteração.
//     // Caso contrário, a função já informa que não são dois objetos iguais.
//         if(object1[prop] !== object2[prop]){
//             if(equals(object1[prop], object2[prop]))
//                 continue;
//             else
//                 return false;
//         }
//     }
//     // Se chegou até aqui e aguentou todas as verificações...
//     // Os objetos são iguais!
//     return true;
// }


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
    obj2.Turmas.forEach(t_ant => {
        obj1.Turmas.forEach(t_nova => {
            if ((t_ant.Nome === t_nova.Nome) && (t_ant.Qtd_ucs !== t_nova.Qtd_ucs)) {
                t_nova.Ucs.forEach(uc_nova => {
                    var igual = false;
                    t_ant.Ucs.forEach(uc_ant => {
                        if (uc_ant.Nome === uc_nova.Nome)
                            igual = true;
                    })
                    if (!igual){
                        novas.push(uc_nova);
                    }
                })
            }
        }) 
    })

    return novas;
}

//Reorganizar o Json das Ucs novas para separalos por turmas
function reorg_ucs_novas(json){
    var obj = json;

    var turmas = {
        Nome: "Ucs novas"
    };
    //Pegando as turmas
    obj.forEach(uc => {
        var igual = false;
        var turma_temp = {
            Nome: uc.Turma,
            Ucs: {
                Nome: "Ucs"
            }
        };
        try {
            turmas.Turmas.forEach(tur => {
                if (uc.Turma === tur)
                    igual = true;
            })
        }
        catch (e){
            turmas.Turmas.push(turma_temp);
        }
        if (!igual){
            turmas.Turmas.push(turma_temp);
        }
    })

    //Separando por turmas
    console.log(turmas);
    // turmas.Turmas.forEach(tur_ => {
    //     obj.forEach(uc_=> {
    //         if (uc_.Turma === tur_.Nome)
    //             tur_.Ucs.push(uc_);
    //     })
    // })

    return turmas;
}


function objToJSON(obj){
    return JSON.stringify(obj);
}

function JSONToobj(json_string){
    return JSON.parse(json_string);
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

let turmas_antigas = localStorage['SGE-Ágil-Turmas_atuais'];

let turmas_atuais = Json_Principal(document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina"));

let turmas_novas = Turmas_novas(turmas_antigas, turmas_atuais);
let ucs_novas    = UCs_novas(turmas_antigas, turmas_atuais);

console.log(turmas_novas);
console.log(ucs_novas);

console.log("UCs reorganizadas:");
console.log(reorg_ucs_novas(ucs_novas));

let alerta_turmas = "";
let alerta_ucs = "";

turmas_novas.forEach(element => {
    alerta_turmas += '* '
    alerta_turmas += element.Nome;
    alerta_turmas += '\n';
})

ucs_novas.forEach(element => {
    alerta_ucs += '* '
    alerta_ucs += element.Nome;
    alerta_ucs += '\n';
})


//mensagens
if (turmas_novas.length > 0) {
    alert(`Você possui ${turmas_novas.length} turma${turmas_novas.length > 1 ? "s" : ""} nova${turmas_novas.length > 1 ? "s" : ""}.

${alerta_turmas}`)
}

if (ucs_novas.length > 0) {
    alert(`Você possui ${ucs_novas.length} turma${ucs_novas.length > 1 ? "s" : ""} nova${ucs_novas.length > 1 ? "s" : ""}.

${alerta_ucs}`)
}


//localStorage['SGE-Ágil-Turmas_atuais'] = turmas_atuais;
