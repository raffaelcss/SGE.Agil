//////////////////////////////////////////////////////////////////////////
////////////////////////////    Constantes    ////////////////////////////
//////////////////////////////////////////////////////////////////////////

const path_to_unarchive = document.createElementNS('http://www.w3.org/2000/svg', "path");
path_to_unarchive.classList.add("path_to_unarchive");
const path_to_archive = document.createElementNS('http://www.w3.org/2000/svg', "path");
path_to_archive.classList.add("path_to_archive");
//Desarquivar
path_to_unarchive.setAttribute('d', 'M 23.28 3.055 L 21.444 0.834 C 21.088 0.384 20.546 0.107 19.926 0.107 L 4.074 0.107 C 3.454 0.107 2.912 0.384 2.542 0.834 L 0.72 3.055 C 0.336 3.503 0.112 4.098 0.112 4.731 L 0.112 21.251 C 0.112 22.703 1.3 23.893 2.754 23.893 L 21.246 23.893 C 22.7 23.893 23.888 22.703 23.888 21.251 L 23.888 4.731 C 23.888 4.098 23.664 3.503 23.28 3.055 Z M 4.392 2.749 L 19.608 2.749 L 20.704 4.071 L 3.308 4.071 L 4.392 2.749 Z M 2.754 21.251 L 2.754 6.714 L 21.246 6.714 L 21.246 21.251 L 2.754 21.251 Z M 17.284 13.982 L 12 19.269 L 6.716 13.982 L 8.578 12.119 L 10.679 14.207 L 10.679 9.357 L 13.32 9.357 L 13.32 14.207 L 15.421 12.106 L 17.284 13.982 Z');
//Arquivar
path_to_archive.setAttribute('d', 'M 21.325 5.187 L 12.065 5.187 L 9.749 2.863 L 2.806 2.863 C 1.531 2.863 0.501 3.909 0.501 5.187 L 0.49 19.132 C 0.49 20.412 1.531 21.458 2.806 21.458 L 21.325 21.458 C 22.598 21.458 23.64 20.412 23.64 19.132 L 23.64 7.512 C 23.64 6.233 22.598 5.187 21.325 5.187 Z M 21.325 19.132 L 2.806 19.132 L 2.806 7.512 L 21.325 7.512 L 21.325 19.132 Z');


var main_container = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos");
var container_turmas = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_CC");
var li_turmas = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina");

var div_turmas_arquivadas;
var container_arquivadas;

//////////////////////////////////////////////////////////////////////////
//////////////////////////////    Funções    /////////////////////////////
//////////////////////////////////////////////////////////////////////////

function insertAfter(newElement, reference) {
    reference.parentNode.insertBefore(newElement, reference.nextSibling);
}

function arq_obj(nome){
    Array.from(turm_local_str["Turmas"]).forEach(element => {
        if (element["Nome"] == nome){
            element["Is_archived"] = !element["Is_archived"];
        }
    })
    //Salvando novo status das turmas
    localStorage['SGE-Ágil-Turmas_atuais'] = objToJSON(turm_local_str);
}

function bnt_arquivar(dono) {
    let inicio_id = dono.id.indexOf('_');
    let tmp = document.getElementById(dono.id.substring(inicio_id+1));
    tmp.classList.toggle("archived");
    arq_obj(tmp.getElementsByClassName("dxnb-ghtext")[0].innerHTML);
}

function quest_bnt_arquivar() {
    let to_arc = this.classList.contains("svg_to_archive");
    if (confirm(`Deseja realmente ${to_arc ? "" : "des"}arquivar essa turma?\nEla poderá ser ${to_arc ? "restaurada" : "arquivada"} a qualquer momento.`)){
        bnt_arquivar(this);
        atualizar_status_turmas();
    }
}

function atualizar_status_turmas() {
    //Removendo div antiga caso exista (Para quando clicar em arquivar turma)
    if (document.getElementById("container_arquivadas")) {
        document.getElementById("container_arquivadas").remove();
    }

    container_arquivadas = container_turmas.cloneNode(true);       //true para clonar os filhos
    container_arquivadas.id = "container_arquivadas";
    container_arquivadas.classList.add("container_arquivadas");
    container_arquivadas.classList.remove("container_hidden");
    if (document.getElementById("checkbox_archived")){
        if (document.getElementById("checkbox_archived").checked == false){
            container_arquivadas.classList.add("container_hidden");
        }
    }

    if (container_arquivadas.children.length > 0) {
        try {
            container_arquivadas.children[0].id = "div_arquivadas";
            container_arquivadas.children[0].classList.add("div_arquivadas");
            
            container_arquivadas.children[1].id = "div_arquivadas_hide";
            container_arquivadas.children[1].classList.add("div_arquivadas_hide");
        }
        catch (e) {
            console.log("Erro 1");
        }
    }

    //Removendo turmas não arquivadas da sessão de arquivadas
    try{
        div_turmas_arquivadas = container_arquivadas.getElementsByClassName("div_arquivadas")[0].children[0].children[0];
    }
    catch (e){
        console.log("Erro 2");
    }
    try {
        for (var i = div_turmas_arquivadas.children.length - 1; i >= 0; i--){
            try{
                if (!div_turmas_arquivadas.children[i].classList.contains("archived")){
                    //Turmas não arquivadas
                    div_turmas_arquivadas.children[i].remove();
                } else {
                    //Mudando icone de arquivar para desarquivar
                    div_turmas_arquivadas.children[i].getElementsByClassName("svg_to_archive")[0].classList.add("svg_to_unarchived");
                    div_turmas_arquivadas.children[i].getElementsByClassName("svg_to_archive")[0].classList.remove("svg_to_archive");
                    //Adicionando função de botão
                    div_turmas_arquivadas.children[i].getElementsByClassName('svg_bnt')[0].addEventListener('click', quest_bnt_arquivar);
                    div_turmas_arquivadas.children[i].getElementsByClassName('svg_bnt')[0].addEventListener('click', refresh_scroll_mainContainer);
                }
            }
            catch (e) {
                console.log("Erro 3");
            }
        }
    }
    catch (e) {
        console.log("Erro 4");
    }
    //Removendo margin bottom errado que fica na ultima turma das arquivadas
    try {
        div_turmas_arquivadas.children[div_turmas_arquivadas.children.length - 1].classList.add("dxnb-last");
    }
    catch (e) {

    }

    //Adicionar div de listras nas turmas arquivadas
    const div_grid = document.createElement("div");
    div_grid.classList.add("grid");
    div_turmas_arquivadas.appendChild(div_grid);

    //Adicionando Div das arquivadas ao main menu
    try {
        main_container.appendChild(container_arquivadas);
    }
    catch (e) {
    
    }
}

//função para adicionar margin laterl no menu principal para quando não houver scroll
function refresh_scroll_mainContainer() {
    if (document.getElementById("MainContainer").clientHeight == document.getElementById("MainContainer").scrollHeight){
        document.getElementById("MainContainer").classList.add("sem-scroll");
    } else {
        document.getElementById("MainContainer").classList.remove("sem-scroll");
    }
}

function add_archived_class() {
    //Adicionando classe archived às turmas com base no JSON salvo em localstorage
    try{
        for (turm of li_turmas.children){
            turm_local_str.Turmas.forEach(element => {
                try {
                    if (element.Nome === turm.children[0].children[1].innerHTML){
                        if (element.Is_archived){
                            turm.classList.add("archived");
                        }
                    }
                }
                catch (e) {
                    console.log("erro ao comparar nome de li_turmas");
                }
            });
        }
    }
    catch (e){
        console.log("erro ao encontrar li_turmas");
    }
}


//////////////////////////////////////////////////////////////////////////
///////////////////////////////    Script   //////////////////////////////
//////////////////////////////////////////////////////////////////////////

if (document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina")){
    //Adicionando Head Switch para exibir Turmas Arquivadas
    const div_head_turmas = document.createElement("div");
    div_head_turmas.id = "div_head_turmas";
    div_head_turmas.classList.add("div_head_turmas");
    //Afiliando cada componente
    try {
        div_head_turmas.appendChild(document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_RMWLabel1"));
    }
    catch (e){

    }
    //Inserindo no menu princpal
    try {
        insertAfter(div_head_turmas, document.getElementById("MainContainer").children[1]);
    }
    catch (e) {

    }

    var turm_local_str = JSONToobj(turmas_antigas);

    add_archived_class();

    //Removendo espaços extras (<BR>)
    Array.from(document.getElementById("MainContainer").getElementsByTagName("br")).forEach((element) => {
        element.remove();
    });
}


function Ligar_arq_turma(){
    
    if (document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina")){

        //Adicionando Switch para exibir Turmas Arquivadas

        const texto_swt_arq = document.createElement("span");
        texto_swt_arq.innerHTML = "Turmas arquivadas";
        texto_swt_arq.id = "texto_swt_arq";
        texto_swt_arq.classList.add("texto_swt_arq");

        const div_bnt_arq = document.createElement("div");
        div_bnt_arq.classList.add("div_bnt_arq");

        const label_bnt_arq = document.createElement("label");
        label_bnt_arq.classList.add("switch");

        const chk_bnt_arq = document.createElement("input");
        chk_bnt_arq.type = "checkbox";
        chk_bnt_arq.id = "checkbox_archived";

        const span_bnt_arq = document.createElement("span");
        span_bnt_arq.classList.add("slider");
        span_bnt_arq.classList.add("round");
        span_bnt_arq.id = "swt_archived";


        //Função do Switch de exibir turmas arquivadas
        chk_bnt_arq.addEventListener('change', () => {
            container_turmas.classList.toggle("container_hidden");
            container_arquivadas.classList.toggle("container_hidden");
            if (document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_RMWLabel1")){
                document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_RMWLabel1").innerText = chk_bnt_arq.checked ? "Desarquive uma turma para acessa-la:" : "Selecione uma turma/disciplina:";
            }
        });
        chk_bnt_arq.addEventListener('change', refresh_scroll_mainContainer);

        //Afiliando cada componente
        try {
        div_head_turmas.appendChild(div_bnt_arq);
            div_bnt_arq.appendChild(texto_swt_arq);
            div_bnt_arq.appendChild(label_bnt_arq);
                label_bnt_arq.appendChild(chk_bnt_arq);
                label_bnt_arq.appendChild(span_bnt_arq);
        }
        catch (e){

        }

        //Readicionando classe archived
        add_archived_class() 

        //////////////////////////////////////////////////////////////////////////
        /////////////    Adicionando botão de arquivar em cada turma   ///////////
        //////////////////////////////////////////////////////////////////////////

        const div_bnt_archive = document.createElement("div");
        div_bnt_archive.classList.add("div_bnt_archive");


        const svg_to_archive = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); //Necessário para diferenciar viewbox de viewBox
        svg_to_archive.classList.add("svg_bnt");
        svg_to_archive.classList.add("svg_to_archive");
        svg_to_archive.setAttribute('focusable', "false");
        svg_to_archive.setAttribute('width', '20');
        svg_to_archive.setAttribute('height', '20');
        // svg_archived.viewBox = '0 0 24 24';
        svg_to_archive.setAttribute("viewBox", '0 0 24 24');

        div_bnt_archive.appendChild(svg_to_archive);
        svg_to_archive.appendChild(path_to_archive);
        svg_to_archive.appendChild(path_to_unarchive);

        Array.from(li_turmas.children).forEach(li => {
            let div_temp = div_bnt_archive.cloneNode(true);
            try {
                div_temp.getElementsByClassName('svg_bnt')[0].id = 'bntToArchive_' + li.id;
                li.appendChild(div_temp);
                div_temp.getElementsByClassName('svg_bnt')[0].addEventListener('click', quest_bnt_arquivar);
                div_temp.getElementsByClassName('svg_bnt')[0].addEventListener('click', refresh_scroll_mainContainer);        
            }
            catch (e) {

            }
        });

        //Realiza a separação das turmas arquivadas
        atualizar_status_turmas();
    }
}

function Desligar_arq_turma(){
    //Reabilita visualização das classes caso esteja oculta
    if (document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_CC")){
        document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_CC").classList.remove("container_hidden");
    }
    //Remover componentes visuais
    Array.from(document.getElementsByClassName("div_bnt_arq")).forEach(element => {
        element.remove();
    });
    Array.from(document.getElementsByClassName("div_bnt_archive")).forEach(element => {
        element.remove();
    });

    //Remover classes archived
    Array.from(document.getElementsByClassName("archived")).forEach(element => {
        element.classList.remove("archived");
    });

    refresh_scroll_mainContainer();
}