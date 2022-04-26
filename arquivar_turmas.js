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

//Removendo turmas arquivadas
var div_turmas_arquivadas = container_arquivadas.children[0].children[0].children[0];

for (var i = div_turmas_arquivadas.children.length - 1; i >= 0; i--){
    if (!div_turmas_arquivadas.children[i].classList.contains("archived")){
        div_turmas_arquivadas.children[i].remove();
    } else {
        //Garantindo que as turmas arquivadas fiquem colapsadas, pois não podem ser abertas enquanto estão arquivadas.
        div_turmas_arquivadas.children[i].getElementsByClassName("dxnb-header")[0].style.display = 'none';
        div_turmas_arquivadas.children[i].getElementsByClassName("dxnb-headerCollapsed")[0].style.display = 'block';
        div_turmas_arquivadas.children[i].getElementsByClassName("dxnb-header")[0].style.display = 'none';
    }
}


main_container.appendChild(container_arquivadas);

console.log("adicionadas turmas arquivadas");