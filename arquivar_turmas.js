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
        div_turmas_arquivadas.children[i].getElementsByClassName("dxnb-header")[0].style.display = 'none';
    }
}

//Removendo turmas arquivadas da sessão das não arquivadas
let div_turmas_n_arquivadas = container_turmas.children[0].children[0].children[0];

for (var i = div_turmas_n_arquivadas.children.length - 1; i >= 0; i--){
    if (div_turmas_n_arquivadas.children[i].classList.contains("archived")){
        //Turmas não arquivadas
        div_turmas_n_arquivadas.children[i].remove();
    }
}

//Adicionando botão Turmas Arquivadas
const div_head_turmas = document.createElement("div");
div_head_turmas.id = "div_head_turmas";

div_head_turmas.appendChild(document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_RMWLabel1"));

insertAfter(div_head_turmas, document.getElementById("MainContainer").children[1]);

//Removendo espaço extra
//document.getElementById("MainContainer").getElementsByTagName("br")[1].remove();

main_container.appendChild(container_arquivadas);

console.log("adicionadas turmas arquivadas");