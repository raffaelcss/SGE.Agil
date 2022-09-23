//////////////////////////////////////////////////////////////////////////
////////////////////////////    Constantes    ////////////////////////////
//////////////////////////////////////////////////////////////////////////

const img_archive = document.createElement("img");
img_archive.width = 24;
img_archive.height = 24;
img_archive.setAttribute('src', chrome.runtime.getURL('svg/archive-box-bold-svgrepo-com.svg'));
img_archive.classList.add("img_to_archive");

const img_unarchive = document.createElement("img");
img_unarchive.width = 24;
img_unarchive.height = 24;
img_unarchive.setAttribute('src', chrome.runtime.getURL('svg/archive-out-svgrepo-com.svg'));
img_unarchive.classList.add("img_to_unarchive");





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

function arq_obj(liAlvo){
    let nome = liAlvo.getElementsByClassName("dxnb-ghtext")[0].innerHTML;
    let nomePrimeiraUC = liAlvo.getElementsByClassName("dxnb-item")[0].getElementsByClassName("dx-vam")[0].innerText;
    Array.from(turmAntigasObj["Turmas"]).forEach(element => {
        let primeiraUCelement = element.Ucs[0].Nome;
        // console.log("Comparando primeira UC:")
        // console.log("Primeira UC Alvo: " + nomePrimeiraUC);
        // console.log("Primeira UC comparada: " + primeiraUCelement);
        
        //Compara o Nome da Turma e o nome da primeira UC, para evitar erro de turmas com mesmo nome
        if (element["Nome"] == nome && nomePrimeiraUC == primeiraUCelement){
            element["Is_archived"] = !element["Is_archived"];
        }
    })
    //Salvando novo status das turmas (legado)
    // localStorage['SGE-Ágil-Turmas_atuais'] = objToJSON(turmAntigasObj);

    //Econtra o contexto atual e atualiza somente ele
    Array.from(contextosExistentes.Contextos).forEach(contexto => {
        // console.log(contexto.Nome);
        // console.log(contextoAtual);
        if (contexto.Nome == contextoAtual){
            Array.from(contexto.Turmas).forEach(turma => {
                let primeiraUCelement = turma.Ucs[0].Nome;
                //Compara o Nome da Turma e o nome da primeira UC, para evitar erro de turmas com mesmo nome
                if (turma.Nome == nome && nomePrimeiraUC == primeiraUCelement){
                    turma["Is_archived"] = !turma["Is_archived"];
                }
            });
        }
    });
    //console.log(contextosExistentes);
    let user = getUsuario();
    //Salva na memória o JSON
    localStorage['SGE-Ágil-Turmas_atuais-' + user] = objToJSON(contextosExistentes);
}

function bnt_arquivar(dono) {
    let inicio_id = dono.id.indexOf('_');
    let tmp = document.getElementById(dono.id.substring(inicio_id+1));
    tmp.classList.toggle("archived");
    //Anteriormente passava o nome, agora passa o objeto para fazer mais verificações
    arq_obj(tmp);
}

function quest_bnt_arquivar() {
    let to_arc = this.classList.contains("div_to_archive");
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
                    //Mudando hint do botão
                    //Mudando icone de arquivar para desarquivar
                    div_turmas_arquivadas.children[i].getElementsByClassName("div_bnt_archive")[0].title = "Desarquivar";
                    //Mudando icone de arquivar para desarquivar
                    div_turmas_arquivadas.children[i].getElementsByClassName("div_to_archive")[0].classList.add("div_to_unarchived");
                    div_turmas_arquivadas.children[i].getElementsByClassName("div_to_archive")[0].classList.remove("div_to_archive");
                    //Adicionando função de botão
                    div_turmas_arquivadas.children[i].getElementsByClassName('div_bnt')[0].addEventListener('click', quest_bnt_arquivar);
                    div_turmas_arquivadas.children[i].getElementsByClassName('div_bnt')[0].addEventListener('click', refresh_scroll_mainContainer);
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
            let nomePrimeiraUC = turm.getElementsByClassName("dxnb-item")[0].getElementsByClassName("dx-vam")[0].innerText;
            turmAntigasObj.Turmas.forEach(element => {
                try {
                    let primeiraUCelement = element.Ucs[0].Nome;
                    //Compara o Nome da Turma e o nome da primeira UC, evita erro de turmas com mesmo nome
                    if (element.Nome === turm.children[0].children[1].innerHTML && nomePrimeiraUC == primeiraUCelement){
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
        div_bnt_archive.title = "Arquivar";

        const div_to_archive = document.createElement("div");
        div_to_archive.classList.add("div_to_archive");
        div_to_archive.classList.add("div_bnt");

        //DIV com as imagens
        div_bnt_archive.appendChild(div_to_archive);

        //Adicionando IMG Archive
        div_to_archive.appendChild(img_archive);
        //Adicionando IMG Unarchive
        div_to_archive.appendChild(img_unarchive);

        Array.from(li_turmas.children).forEach(li => {
            let div_temp = div_bnt_archive.cloneNode(true);
            try {
                div_temp.getElementsByClassName('div_bnt')[0].id = 'bntToArchive_' + li.id;
                li.appendChild(div_temp);
                div_temp.getElementsByClassName('div_bnt')[0].addEventListener('click', quest_bnt_arquivar);
                div_temp.getElementsByClassName('div_bnt')[0].addEventListener('click', refresh_scroll_mainContainer);        
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