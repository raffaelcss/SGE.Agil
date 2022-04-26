var main_container = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos");
var container_turmas = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_xtabPeriodosLetivos_CC");

var container_arquivadas = container_turmas.cloneNode();

main_container.appendChild(container_arquivadas);

crossOriginIsolated.log("adicionadas turmas arquivadas");