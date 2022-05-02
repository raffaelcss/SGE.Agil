function insertAfter(newElement, reference) {
    reference.parentNode.insertBefore(newElement, reference.nextSibling);
}

var main_container = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos");
var container_turmas = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_CC");
var li_turmas = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina");

//Adicionando classe archived às turmas com base no JSON salvo em localstorage

let turm_local_str = JSONToobj(turmas_antigas);
console.log(turm_local_str);

for (turm of li_turmas.children){
    turm_local_str.Turmas.forEach(element => {
        if (element.Nome === turm.children[0].children[1].innerHTML){
            console.log(element.Is_archived);
            if (element.Is_archived){
                turm.classList.add("archived");
            }
        }
    });
}

var container_arquivadas = container_turmas.cloneNode(true);       //true para clonar os filhos
container_arquivadas.id = "container_arquivadas";
container_arquivadas.style.display = 'none';
container_arquivadas.style.position = 'relative';
container_arquivadas.children[0].id = "div_arquivadas";
container_arquivadas.children[1].id = "div_arquivadas_hide";

//Removendo turmas não arquivadas da sessão de arquivadas
let div_turmas_arquivadas = container_arquivadas.children[0].children[0].children[0];

for (var i = div_turmas_arquivadas.children.length - 1; i >= 0; i--){
    if (!div_turmas_arquivadas.children[i].classList.contains("archived")){
        //Turmas não arquivadas
        div_turmas_arquivadas.children[i].remove();
    } else {
        //Turmas arquivadas
        //Garantindo que as turmas arquivadas fiquem colapsadas, pois não podem ser abertas enquanto estão arquivadas.
        div_turmas_arquivadas.children[i].getElementsByClassName("dxnb-header")[0].style.display = 'none';
        div_turmas_arquivadas.children[i].getElementsByClassName("dxnb-headerCollapsed")[0].style.display = 'block';
        div_turmas_arquivadas.children[i].getElementsByClassName("dxnb-headerCollapsed")[0].style.cursor = 'auto';
        div_turmas_arquivadas.children[i].getElementsByClassName("dxnb-content")[0].style.display = 'none';
    }
}

//Removendo margin bottom errado que fica na ultima turma das arquivadas
div_turmas_arquivadas.children[div_turmas_arquivadas.children.length - 1].classList.add("dxnb-last");

//Removendo turmas arquivadas da sessão das não arquivadas
let div_turmas_n_arquivadas = container_turmas.children[0].children[0].children[0];

for (var i = div_turmas_n_arquivadas.children.length - 1; i >= 0; i--){
    if (div_turmas_n_arquivadas.children[i].classList.contains("archived")){
        //Turmas não arquivadas
        div_turmas_n_arquivadas.children[i].remove();
    }
}

//Adicionar div de listras nas turmas arquivadas
const div_grid = document.createElement("div");
div_grid.classList.add("grid");
div_turmas_arquivadas.appendChild(div_grid);

//Depois transferir todo estilo para o CSS basic

//Adicionando botão Turmas Arquivadas
const div_head_turmas = document.createElement("div");
div_head_turmas.id = "div_head_turmas";
div_head_turmas.style.display = 'flex';
div_head_turmas.style.alignItems = 'center';
div_head_turmas.style.padding = '0px 5px 5px';
div_head_turmas.style.height = '29px';

const texto_swt_arq = document.createElement("span");
texto_swt_arq.innerHTML = "Turmas arquivadas";
texto_swt_arq.id = "texto_swt_arq";
texto_swt_arq.style.paddingRight = '10px';
texto_swt_arq.style.fontSize = '12px';
texto_swt_arq.style.fontWeight = '600';

const div_bnt_arq = document.createElement("div");
div_bnt_arq.style.marginLeft = 'auto';
div_bnt_arq.style.display = 'flex';
div_bnt_arq.style.alignItems = 'center';
div_bnt_arq.style.border = 'solid 1px #8b8b8b';
div_bnt_arq.style.marginRight = '8px';
div_bnt_arq.style.padding = '5px';
div_bnt_arq.style.borderRadius = '5px';

const label_bnt_arq = document.createElement("label");
label_bnt_arq.classList.add("switch");

const chk_bnt_arq = document.createElement("input");
chk_bnt_arq.type = "checkbox";
chk_bnt_arq.id = "checkbox_archived";

const span_bnt_arq = document.createElement("span");
span_bnt_arq.classList.add("slider");
span_bnt_arq.classList.add("round");
span_bnt_arq.id = "swt_archived";

div_head_turmas.appendChild(document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_RMWLabel1"));
div_head_turmas.appendChild(div_bnt_arq);
    div_bnt_arq.appendChild(texto_swt_arq);
    div_bnt_arq.appendChild(label_bnt_arq);
        label_bnt_arq.appendChild(chk_bnt_arq);
        label_bnt_arq.appendChild(span_bnt_arq);


insertAfter(div_head_turmas, document.getElementById("MainContainer").children[1]);

//Removendo espaços extras
Array.from(document.getElementById("MainContainer").getElementsByTagName("br")).forEach((element) => {
    element.remove();
});

//função para adicionar margin laterl no menu principal para quando não houver scroll
chk_bnt_arq.addEventListener('click', () => {
    if (document.getElementById("MainContainer").clientHeight < document.getElementById("MainContainer").scrollHeight){
        document.getElementById("MainContainer").classList.add("sem-scroll");
    } else {
        document.getElementById("MainContainer").classList.remove("sem-scroll");
    }
})

main_container.appendChild(container_arquivadas);

console.log("adicionadas turmas arquivadas");


chk_bnt_arq.addEventListener('change', () => {
    container_turmas.style.display = chk_bnt_arq.checked ? 'none' : 'block';
    container_arquivadas.style.display = chk_bnt_arq.checked ? 'block' : 'none';
});


//Adicionando botão de arquivar em cada turma

const div_bnt_archive = document.createElement("div");
div_bnt_archive.style.marginLeft = 'auto';

const div_turma1 = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_xpnlTurmaDisciplina_GHC1");

div_turma1.style.display = 'flex';
div_turma1.style.alignItems = 'center';
div_turma1.appendChild(div_bnt_archive);

const svg_archived = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); //Necessário para diferenciar viewbox de viewBox
svg_archived.classList.add("svg_archived");
svg_archived.setAttribute('focusable', "false");
svg_archived.setAttribute('width', '24');
svg_archived.setAttribute('height', '24');
// svg_archived.viewBox = '0 0 24 24';
svg_archived.setAttribute("viewBox", '0 0 24 24');

div_bnt_archive.appendChild(svg_archived);

const path_archived = document.createElementNS('http://www.w3.org/2000/svg', "path");
path_archived.classList.add("path_archived");
path_archived.setAttribute('d', 'M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm11-5.5l-4 4-4-4 1.41-1.41L11 13.67V10h2v3.67l1.59-1.59L16 13.5z');
svg_archived.appendChild(path_archived);

