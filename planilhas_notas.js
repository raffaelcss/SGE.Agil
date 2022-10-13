const cabecalhoNotas = document.getElementById("ctl24_xgvNotas_DXHeadersRow0");
var vazio = document.getElementById("ctl24_xgvNotas_emptyheader") != null;

// function numberToColumCell(columNumber){
//     switch (columNumber){
//         case 1:
//             return  "A";
//         case 2:
//             return  "B";
//         case 3:
//             return  "C";
//         case 4:
//             return  "D";
//         case 5:
//             return  "E";
//         case 6:
//             return  "F";
//         case 7:
//             return  "G";
//         case 8:
//             return  "H";
//         case 9:
//             return  "I";
//         case 10:
//             return  "J";
//         case 11:
//             return  "K";
//         case 12:
//             return  "L";
//     }
// }

function preencherNotas(ws, rowCount, columnCount){
    for (let row = 2; row <= rowCount; row++) {
        for (let col = 6; col <= columnCount; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            //Colocando as células vazias como número
            ws[cellRef].t = 'n';
        }
    }
}

function corrigirTamanhoColunas(ws, rowCount, columnCount){
    //Colunas fixas
    ws["!cols"] = [{ wch: 1 },{ wch: 4 },{ wch: 9 }]
    //Coluna alunos
    let max_width = 0;
    for (let row = 2; row <= rowCount; row++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: 3 });
        max_width = Math.max(ws[cellRef].v.length*1.2 + 1.5,max_width);
    }
    ws["!cols"].push({ wch: max_width });
    //Status
    ws["!cols"].push({ wch: 14 });
    //Atividades
    for (let col = 5; col <= columnCount; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        ws["!cols"].push({ wch: 12.5 });
    }
    //Legenda
    max_width =0;
    for (let row = 2; row < 7; row++){
        const cellRef = XLSX.utils.encode_cell({ r: row, c: columnCount+3 });
        console.log(cellRef);
        if (ws[cellRef]){
            max_width = Math.max(ws[cellRef].v.length,max_width);
        }
    }
    ws["!cols"].push({ wch: 3 });
    ws["!cols"].push({ wch: 9.5 });
    ws["!cols"].push({ wch: max_width });
}

function addFormulaSomatorioNotas(ws, rowCount, columnCount){
    //Somatorio de notas
    for (let row = 2; row <= rowCount; row++){
        const cellRef = XLSX.utils.encode_cell({ r: row, c: 5 });
        var sum_range = XLSX.utils.encode_range({ s: { c: 6, r: row }, e: { c: columnCount, r: row } });

        ws[cellRef].t = 'n';
        ws[cellRef].f = "SUM("+sum_range+")";
        ws[cellRef].F = sum_range;
    }
}

function adicionaLegenda(ws, legTable, columnCount){
    const cellRef = XLSX.utils.encode_cell({ r: 1, c: columnCount+2 });
    XLSX.utils.sheet_add_dom(ws, legTable, {origin: cellRef});
}

function estilizarLegenda(ws, rowCount, columnCount, qtdAtiv){
    for (let row = 1; row <= qtdAtiv+1; row++) {
        for (let col = columnCount+2; col <= columnCount + 3; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            // Geral
            ws[cellRef].s = {
                font: { 
                    name: "Arial", 
                    sz: 12 
                },
                alignment: { 
                    horizontal: "center",
                    // wrapText: true 
                },
                border: {
                    top:{
                        style: 'thin',
                    },
                    bottom:{
                        style: 'thin',
                    },
                    left:{
                        style: 'thin',
                    },
                    right:{
                        style: 'thin',
                    },
                }
            };
            //Cabeçalho
            if (row === 1) {
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    font: { 
                        ...ws[cellRef].s.font,
                        bold: true,
                        color: { 
                            rgb: "FFFFFF" 
                        }
                    },
                    fill: {
                        fgColor: {
                            rgb: "1F497D"
                        }
                    }
                };
            }

            //Box Drawin
            if (row === 1) {
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    border: {
                        ...ws[cellRef].s.border,
                        top:{
                            style: 'medium',
                        }
                    }
                };
            }
            if (row === qtdAtiv+1){
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    border: {
                        ...ws[cellRef].s.border,
                        bottom:{
                            style: 'medium',
                        }
                    }
                };
            }
            if (col === columnCount+2) {
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    border: {
                        ...ws[cellRef].s.border,
                        left:{
                            style: 'medium',
                        }
                    }
                };
            }
            if (col === columnCount + 3){
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    border: {
                        ...ws[cellRef].s.border,
                        right:{
                            style: 'medium',
                        }
                    }
                };
            }
        }
    }
}

function estilizarTabela(ws, rowCount, columnCount){
    //Notas
    for (let row = 1; row <= rowCount; row++) {
        for (let col = 1; col <= columnCount; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            // Geral
            ws[cellRef].s = {
                font: { 
                    name: "Arial", 
                    sz: 12 
                },
                alignment: { 
                    horizontal: "center",
                    // wrapText: true 
                },
                border: {
                    top:{
                        style: 'thin',
                    },
                    bottom:{
                        style: 'thin',
                    },
                    left:{
                        style: 'thin',
                    },
                    right:{
                        style: 'thin',
                    },
                }
            };
            //Cabeçalho
            if (row === 1 && col > 0) {
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    font: { 
                        ...ws[cellRef].s.font,
                        bold: true,
                        color: { 
                            rgb: "FFFFFF" 
                        }
                    },
                    fill: {
                        fgColor: {
                            rgb: "1F497D"
                        }
                    }
                };
            }

            //Notas
            if (col >= 6 && col <= columnCount && row >=2 && row <= rowCount ){
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    fill: {
                        fgColor: {
                            rgb: "cccccc"
                        }
                    }
                };
            }

            //Box Drawin
            if (row === 1 && col > 0) {
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    border: {
                        ...ws[cellRef].s.border,
                        top:{
                            style: 'medium',
                        }
                    }
                };
            }
            if (row === rowCount){
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    border: {
                        ...ws[cellRef].s.border,
                        bottom:{
                            style: 'medium',
                        }
                    }
                };
            }
            if (col === 1 && row > 0) {
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    border: {
                        ...ws[cellRef].s.border,
                        left:{
                            style: 'medium',
                        }
                    }
                };
            }
            if (col === columnCount){
                ws[cellRef].s = {
                    ...ws[cellRef].s,
                    border: {
                        ...ws[cellRef].s.border,
                        right:{
                            style: 'medium',
                        }
                    }
                };
            }
        }
    }
}

function criaTabela(type, fn, dl) {
	var elt = document.getElementById('ctl24_xgvNotas_DXMainTable').cloneNode(true);

    //Consertando cabeçalho
    Array.from(elt.children[0].children[0].children).forEach(td => {
        let texto = td.getElementsByTagName("td")[0].innerText;
        td.innerText = texto;
    });
    
    //Cria Workbook
	var wb = XLSX.utils.table_to_book(elt, {sheet:"Notas", origin: "B2"});

    const range = XLSX.utils.decode_range(wb.Sheets['Notas']["!ref"] ?? "");
    const rowCount = range.e.r;
    const columnCount = range.e.c;

    addFormulaSomatorioNotas(wb.Sheets['Notas'], rowCount, columnCount);
    preencherNotas(wb.Sheets['Notas'], rowCount, columnCount);

    //Corrigindo tabela legenda
    var legTable = document.getElementById("ctl24_gvLegendaProvas").cloneNode(true);
    let qtdAtiv = legTable.children[0].children.length-1;
    Array.from(legTable.children[0].children).forEach(tr => {
        Array.from(tr.children).forEach(td => {
            if (td.classList.contains("Invisible")) {
                td.parentNode.removeChild(td);
            }
        });
    });
    adicionaLegenda(wb.Sheets['Notas'], legTable, columnCount);

    corrigirTamanhoColunas(wb.Sheets['Notas'], rowCount, columnCount);
    estilizarTabela(wb.Sheets['Notas'], rowCount, columnCount);
    estilizarLegenda(wb.Sheets['Notas'], rowCount, columnCount,qtdAtiv);

    console.log(wb);

	return dl ? XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) : XLSX.writeFile(wb, fn ||('SheetJSTableExport.' + (type || 'xlsx')),{bookType: "xlsx", type: "bynary"});
}

//Lembra de mudar tudo para um menu logo abaixo da legenda
function criarFieldset(){
    if (document.getElementById("ctl24_legendProvas")){
        let fieldExemplo = document.getElementById("ctl24_legendProvas").parentNode;
        let pai = fieldExemplo.parentNode;
        let field = fieldExemplo.cloneNode(true);
        let titulo = field.getElementsByTagName("span")[0];
        let divPrincipal = field.getElementsByTagName("center")[0].getElementsByTagName("div")[0];

        field.id = "field-excel";
        titulo.innerText = "SGE Ágil";
        divPrincipal.id = "div-field-excel";

        divPrincipal.innerHTML = "";

        pai.appendChild(field);
    }
}

function criarBotaoModelo(addClick, parent){
    const nomePlanilha = document.getElementById("ctl24_EduTurmasProfFiltroSelecionado1_xrpContextoEducacional_lbTurmaDisc").innerText;

    let bnt = document.createElement("span");
    bnt.style.padding = "2px 0px";
    bnt.innerText = "Gerar modelo Excel";
    bnt.style.whiteSpace = "nowrap";

    const pai = parent || document.getElementById("ctl24_xbtSelecionar").parentNode.parentNode;
    const td = document.createElement("td");
    const div = document.createElement("div");
    div.id = "ctl24_xbtModelo";
    div.classList.add("btnExcel");
    if (addClick){
        div.classList.add("hovering");
        div.title = "Gerar arquivo Excel para lançamento de notas";
    } else {
        let ava = "";
        if (document.getElementById("ctl24_xcbAvaliacao_I")){
            ava = document.getElementById("ctl24_xcbAvaliacao_I").getAttribute("value");
        }
        if (ava != "TODAS"){
            div.title = "Selecione Avaliações:TODAS para gerar o modelo";
        } else {
            div.title = "Primeiro crie todas as avaliações (100pts)";
        }
    }
    const div2 = document.createElement("div");
    div2.id = "ctl24_xbtModelo_interno";
    div2.classList.add("btnExcel_interno");

    //pai.children[pai.children.length-1].style.width = "100%";
    div2.appendChild(bnt);
    div.appendChild(div2)
    td.appendChild(div);
    pai.appendChild(td);

    // const td2 = document.createElement("td");
    // pai.appendChild(td2);

    if (addClick) {
        div.onclick = () =>{
            criaTabela('xlsx',nomePlanilha+'.xlsx',false);
        };
    }
}

function criarBotaoCarregar(addClick, parent){
    const nomePlanilha = document.getElementById("ctl24_EduTurmasProfFiltroSelecionado1_xrpContextoEducacional_lbTurmaDisc").innerText;

    let bnt = document.createElement("span");
    bnt.style.padding = "2px 0px";
    bnt.innerText = "Carregar Excel";
    bnt.style.whiteSpace = "nowrap";

    const pai = parent || document.getElementById("ctl24_xbtSelecionar").parentNode.parentNode;
    const td = document.createElement("td");
    const div = document.createElement("div");
    div.id = "ctl24_xbtCarregar";
    div.classList.add("btnExcel");
    if (addClick){
        div.classList.add("hovering");
        div.title = "Carregar arquivo Excel para lançamento de notas";
    } else {
        let ava = "";
        if (document.getElementById("ctl24_xcbAvaliacao_I")){
            ava = document.getElementById("ctl24_xcbAvaliacao_I").getAttribute("value");
        }
        if (ava != "TODAS"){
            div.title = "Selecione Avaliações:TODAS para carregar as notas";
        } else {
            div.title = "Primeiro crie todas as avaliações (100pts)";
        }
    }
    const div2 = document.createElement("div");
    div2.id = "ctl24_xbtCarregar_interno";
    div2.classList.add("btnExcel_interno");

    //pai.children[pai.children.length-1].style.width = "100%";
    div2.appendChild(bnt);
    div.appendChild(div2)
    td.appendChild(div);
    pai.appendChild(td);


    if (addClick) {
        div.onclick = () =>{
            alert("Teste");
        };
    }
}

if (document.getElementById("ctl24_xgvNotas") && !vazio){

    let valor_total = 0;
    // var quantidadeAtividades = cabecalhoNotas.children.length - 5;
    // var colunaFinalAtividades = numberToColumCell(5+quantidadeAtividades);
    // var quantidadeAlunos = 0;

    //Verifica o valor de cada atividade
    Array.from(cabecalhoNotas.children).forEach(td => {
        let text_td = td.getElementsByTagName("td")[0].innerText;
        if (text_td.indexOf("(") != -1){
            let text_nota = text_td.substring(text_td.indexOf("(")+1,text_td.indexOf("(")+6).replace(",",".");
            let valor = parseFloat(text_nota);
            valor_total += valor;
        }
    });

    criarFieldset();
    let parent = document.getElementById("div-field-excel");

    //Verifica se possui todas as atividades lançadas (100 pontos)
    if (valor_total < 100) {
        console.log("Você deve criar todas as avaliações primeiro!");
        criarBotaoModelo(false, parent);
        criarBotaoCarregar(false, parent);
    } else {
        criarBotaoModelo(true, parent);
        criarBotaoCarregar(true, parent);
    }
}