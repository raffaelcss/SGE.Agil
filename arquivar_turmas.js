const path_archived = document.createElementNS('http://www.w3.org/2000/svg', "path");
path_archived.classList.add("path_archived");
const path_to_archive = document.createElementNS('http://www.w3.org/2000/svg', "path");
path_to_archive.classList.add("path_to_archive");
//Desarquivar
path_archived.setAttribute('d', 'M 23.28 3.055 L 21.444 0.834 C 21.088 0.384 20.546 0.107 19.926 0.107 L 4.074 0.107 C 3.454 0.107 2.912 0.384 2.542 0.834 L 0.72 3.055 C 0.336 3.503 0.112 4.098 0.112 4.731 L 0.112 21.251 C 0.112 22.703 1.3 23.893 2.754 23.893 L 21.246 23.893 C 22.7 23.893 23.888 22.703 23.888 21.251 L 23.888 4.731 C 23.888 4.098 23.664 3.503 23.28 3.055 Z M 4.392 2.749 L 19.608 2.749 L 20.704 4.071 L 3.308 4.071 L 4.392 2.749 Z M 2.754 21.251 L 2.754 6.714 L 21.246 6.714 L 21.246 21.251 L 2.754 21.251 Z M 17.284 13.982 L 12 19.269 L 6.716 13.982 L 8.578 12.119 L 10.679 14.207 L 10.679 9.357 L 13.32 9.357 L 13.32 14.207 L 15.421 12.106 L 17.284 13.982 Z');
//Arquivar
path_to_archive.setAttribute('d', 'M 21.325 5.187 L 12.065 5.187 L 9.749 2.863 L 2.806 2.863 C 1.531 2.863 0.501 3.909 0.501 5.187 L 0.49 19.132 C 0.49 20.412 1.531 21.458 2.806 21.458 L 21.325 21.458 C 22.598 21.458 23.64 20.412 23.64 19.132 L 23.64 7.512 C 23.64 6.233 22.598 5.187 21.325 5.187 Z M 21.325 19.132 L 2.806 19.132 L 2.806 7.512 L 21.325 7.512 L 21.325 19.132 Z');


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
            //console.log(element.Is_archived);
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
div_bnt_archive.style.display = 'block';
div_bnt_archive.style.position = 'absolute';
div_bnt_archive.style.left = 'calc(100% - 20px - 7px)';
div_bnt_archive.style.top = '4px';

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

Array.from(li_turmas.children).forEach(li => {
    let div_temp = div_bnt_archive.cloneNode(true);
    div_temp.getElementsByClassName('svg_bnt')[0].id = 'bntToArchive_' + li.id;
    li.appendChild(div_temp);
    div_temp.getElementsByClassName('svg_bnt')[0].addEventListener('click', bnt_arquivar);
});


function bnt_arquivar() {
    let inicio_id = this.id.indexOf('_');
    document.getElementById(this.id.substring(inicio_id+1)).classList.add("archived");
}

