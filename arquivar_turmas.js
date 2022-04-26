var main_container = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos");
var container_turmas = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_CC");

var container_arquivadas = container_turmas.cloneNode(true);       //true para clonar os filhos
container_arquivadas.id = "container_arquivadas";
container_arquivadas.children[0].id = "div_arquivadas";
container_arquivadas.children[1].id = "div_arquivadas_hide";

//Removendo turmas
var div_turmas_arquivadas = container_arquivadas.children[0].children[0].children[0];
console.log("Teste");
console.log(div_turmas_arquivadas.children.length);
for (var i = div_turmas_arquivadas.children.length - 1; i >= 0; i--){
    console.log(i);
    div_turmas_arquivadas.children[i].remove();
}


main_container.appendChild(container_arquivadas);

console.log("adicionadas turmas arquivadas");