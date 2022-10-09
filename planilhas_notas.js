const cabecalho_notas = document.getElementById("ctl24_xgvNotas_DXHeadersRow0");

var vazio = document.getElementById("ctl24_xgvNotas_emptyheader") != null;


function criaTabela(type, fn, dl) {
	var elt = document.getElementById('ctl24_xgvNotas_DXMainTable').cloneNode(true);

    //Consertando cabeçalho
    Array.from(elt.children[0].children[0].children).forEach(td => {
        let texto = td.getElementsByTagName("td")[0].innerText;
        td.innerText = texto;
    });

    console.log(elt);

	var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
	return dl ?
		XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
		XLSX.writeFile(wb, fn || ('SheetJSTableExport.' + (type || 'xlsx')));
}

function criaXlsx(){

}

function baixaXlsx(){

}

if (!vazio){
    let valor_total = 0;
    let quantidadeAtividades = cabecalho_notas.children.length - 5;

    //Verifica o valor de cada atividade
    Array.from(cabecalho_notas.children).forEach(td => {
        let text_td = td.getElementsByTagName("td")[0].innerText;
        if (text_td.indexOf("(") != -1){
            let text_nota = text_td.substring(text_td.indexOf("(")+1,text_td.indexOf("(")+6).replace(",",".");
            let valor = parseFloat(text_nota);
            valor_total += valor;
        }
    });

    //Verifica se possui todas as atividades lançadas (100 pontos)
    if (valor_total < 100) {
        console.log("Você deve criar todas as avaliações primeiro!");
    } else {
        let bnt = document.createElement("span");
        bnt.style.padding = "5px";
        bnt.style.border = "1px solid black";
        bnt.id = "teste";
        bnt.innerText = "Teste";
        bnt.onclick = (event) =>{
            event.stopPropagation();
            criaTabela('xlsx');
        };
        document.getElementById("ctl09_ctl00_accordionMenuAccordionItems0_Contents").appendChild(bnt);
    }
}