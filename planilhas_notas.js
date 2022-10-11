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

function estilizarTabela(ws, rowCount, columnCount){
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

    // //Adicionando coluna inicial
    // Array.from(elt.children[0].children).forEach(tr => {
    //     const colNova = document.createElement("td");
    //     tr.insertAdjacentElement('afterbegin', colNova);
    // });

    // //Adicionando linha inicial
    // const rowNova = document.createElement("tr");
    // for(let i=0; i < elt.children[0].children[1].children.length; i++){
    //     let col = document.createElement("td");
    //     rowNova.appendChild(col);
    // }
    // elt.children[0].insertAdjacentElement('afterbegin', rowNova);
    
    //Cria Workbook
	var wb = XLSX.utils.table_to_book(elt, {sheet:"Notas", origin: "B2"});

    const range = XLSX.utils.decode_range(wb.Sheets['Notas']["!ref"] ?? "");
    const rowCount = range.e.r;
    const columnCount = range.e.c;
    
    console.log(elt);
    console.log(wb);

    addFormulaSomatorioNotas(wb.Sheets['Notas'], rowCount, columnCount);
    preencherNotas(wb.Sheets['Notas'], rowCount, columnCount);
    corrigirTamanhoColunas(wb.Sheets['Notas'], rowCount, columnCount);
    estilizarTabela(wb.Sheets['Notas'], rowCount, columnCount);

    console.log(wb);

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