const cabecalhoNotas = document.getElementById("ctl24_xgvNotas_DXHeadersRow0");
var vazio = document.getElementById("ctl24_xgvNotas_emptyheader") != null;

function numberToColumCell(columNumber){
    switch (columNumber){
        case 1:
            return  "A";
        case 2:
            return  "B";
        case 3:
            return  "C";
        case 4:
            return  "D";
        case 5:
            return  "E";
        case 6:
            return  "F";
        case 7:
            return  "G";
        case 8:
            return  "H";
        case 9:
            return  "I";
        case 10:
            return  "J";
        case 11:
            return  "K";
        case 12:
            return  "L";
    }
}

function criaTabela(type, fn, dl) {
	var elt = document.getElementById('ctl24_xgvNotas_DXMainTable').cloneNode(true);

    //Consertando cabeçalho
    Array.from(elt.children[0].children[0].children).forEach(td => {
        let texto = td.getElementsByTagName("td")[0].innerText;
        td.innerText = texto;
    });

    quantidadeAlunos = elt.children[0].children.length - 1;
    
    
	var wb = XLSX.utils.table_to_book(elt, {sheet:"Notas"});
    
    console.log(elt);
    console.log(wb);
    
    //XLSX.utils.sheet_set_array_formula(wb.Sheets['Notas'], "E2:E"+(quantidadeAlunos+1), "SUM(F2:G2)");

    console.log(wb);
    //Somatorio de notas
    for (let i=2; i <= (quantidadeAlunos+1); i++){
        wb.Sheets['Notas']["E"+i] = { t: "n", f: "SUM(F"+i+":"+colunaFinalAtividades+i+")", F: "F"+i+":"+colunaFinalAtividades+i };
    }


	return dl ? XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) : XLSX.writeFile(wb, fn ||('SheetJSTableExport.' + (type || 'xlsx')),{bookType: "xlsx", type: "bynary"});
}

if (document.getElementById("ctl24_xgvNotas") && !vazio){

    const nomePlanilha = document.getElementById("ctl24_EduTurmasProfFiltroSelecionado1_xrpContextoEducacional_lbTurmaDisc").innerText;

    let valor_total = 0;
    var quantidadeAtividades = cabecalhoNotas.children.length - 5;
    var colunaFinalAtividades = numberToColumCell(5+quantidadeAtividades);
    var quantidadeAlunos = 0;

    //Verifica o valor de cada atividade
    Array.from(cabecalhoNotas.children).forEach(td => {
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
        bnt.onclick = () =>{
            criaTabela('xlsx',nomePlanilha+'.xlsx',false);
        };
        document.getElementById("ctl09_ctl00_accordionMenuAccordionItems0_Contents").appendChild(bnt);
    }
}