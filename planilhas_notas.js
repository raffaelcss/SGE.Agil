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

function objToJSON(obj){
    return JSON.stringify(obj);
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

	return dl ? XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) : XLSX.writeFile(wb, fn ||('SheetJSTableExport.' + (type || 'xlsx')),{bookType: "xlsx", type: "binary"});
}

//Lembra de mudar tudo para um menu logo abaixo da legenda
function criarFieldset(){
    if (document.getElementById("ctl24_legendProvas")){
        let fieldExemplo = document.getElementById("ctl24_legendProvas").parentNode;
        let pai = fieldExemplo.parentNode.parentNode;
        let field = fieldExemplo.cloneNode(true);
        let titulo = field.getElementsByTagName("span")[0];
        let divPrincipal = field.getElementsByTagName("center")[0].getElementsByTagName("div")[0];

        field.id = "field-excel";
        field.style.width = "250px";
        titulo.innerText = "SGE Ágil";
        divPrincipal.id = "div-field-excel";

        divPrincipal.innerHTML = "";

        let td = document.createElement("td");
        td.appendChild(field);

        //Colocar ao lado
        let irmao = document.getElementById("ctl24_legendFiltros").parentNode.parentNode;
        // irmao.setAttribute("width", "45%");

        // pai.appendChild(field);
        irmao.parentNode.insertBefore(td, irmao.nextSibling);
    }
}

function criarDragDrop(enable, parent){
    let divPrincipal = document.createElement("div");
    let label = document.createElement("label");
    let i = document.createElement("i");
    let divTexto = document.createElement("div");
    let input = document.createElement("input");
    let divLista = document.createElement("div");
    let img = document.createElement("img");

    let ava = "";
    if (document.getElementById("ctl24_xcbAvaliacao_I")){
        ava = document.getElementById("ctl24_xcbAvaliacao_I").getAttribute("value");
    }

    if(!enable){
        divPrincipal.classList.add("drag-off");
        input.disabled = true;
        if (ava != "TODAS"){
            divTexto.innerText = "Impossível fazer upload de avaliações individuais";
            divTexto.style.padding = "0 10px";
        } else {
            divTexto.innerText = "Primeiro crie todas as avaliações (100pts)";
        }
    } else {
        divTexto.innerText = "Clique ou arraste o arquivo de notas";
    }

    i.appendChild(img);

    label.appendChild(i);
    label.appendChild(divTexto);

    divPrincipal.appendChild(label);
    divPrincipal.appendChild(input);
    divPrincipal.appendChild(divLista);
    
    divPrincipal.id = "drag-drop";
    divPrincipal.classList.add("area-upload");

    label.classList.add("label-upload");
    label.setAttribute("for","upload-file");

    i.id = "icon-drop";
    i.classList.add("fas");
    i.classList.add("fa-cloud-upload-alt");

    img.id = "img-drop";

    divTexto.classList.add("texto");

    input.setAttribute("type","file");
    input.setAttribute("accept",".xlsx");
    input.id = "upload-file";
    //Não aceitar multiplos arquivos
    // input.setAttribute("multiple","");

    divLista.classList.add("lista-uploads");
    
    parent.appendChild(divPrincipal);  
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
            let input = document.getElementById("upload-file");
            if (input){
                input.click();
            }
        };
    }
}

function abrirArquivo(file, barra){
    // var xl2json = new ExcelToJSON();
    // // console.log(xl2json);
    
    // var jsonTable = xl2json.parseExcel(file);

    // console.log(jsonTable);

    lerArquivo(file);
    
}

function eventosDragDrop(){
    //Parte visual
    drop_ = document.querySelector('.area-upload #upload-file');
    drop_.addEventListener('dragenter', function(){
        document.querySelector('.area-upload .label-upload').classList.add('highlight');
    });
    drop_.addEventListener('dragleave', function(){
        document.querySelector('.area-upload .label-upload').classList.remove('highlight');
    });
    drop_.addEventListener('drop', function(){
        document.querySelector('.area-upload .label-upload').classList.remove('highlight');
    });

    //Parte funcional
    let input = document.querySelector('#upload-file');
    input.addEventListener('change', ()=> {
        let files = input.files;
        if (files.length <= 0){
            return;
        }
        let info = validarArquivo(files[0]);

        var barra = document.createElement("div");
        var fill = document.createElement("div");
        var text = document.createElement("div");
        barra.appendChild(fill);
        barra.appendChild(text);

        barra.classList.add("barra");
        fill.classList.add("fill");
        text.classList.add("text");

        if(info.error == undefined){
            text.innerHTML = info.success;
            abrirArquivo(files[0],barra); //Enviar
        }else{
            text.innerHTML = info.error;
            barra.classList.add("error");
        }
    
        //Adicionar barra
        document.querySelector('.lista-uploads').appendChild(barra);

    });
}

function validarArquivo(file, size, types){
    console.log(file);
	// Tipos permitidos
	var mime_types = [ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ];
    if (types){
        mime_types = [...mime_types, ...types];
    }
    // console.log(mime_types);
	
	// // Validar os tipos
	// if(mime_types.indexOf(file.type) == -1) {
	// 	return {"error" : "O arquivo " + file.name + " não é permitido"};
	// }

	// // Apenas 2MB é permitido
    // let maxMB = size || 2;
	// if(file.size > maxMB*1024*1024) {
	// 	return {"error" : file.name + " ultrapassou limite de "+maxMB+"MB"};
	// }

	// Se der tudo certo
	return {"success": "Enviando: " + file.name};
}

function lancaNota(progressEvent){
    /* e.target.result is an ArrayBuffer */
    const loadedWb = XLSX.read(progressEvent.target.result, {
        type: 'binary'
    });
    const loadedSheet = loadedWb.Sheets["Notas"];
    let range = XLSX.utils.decode_range(loadedSheet["!ref"]);
    // console.log(range);

    if (range.s){
        range.s.c = 1;
        range.s.r = 1;
    }
    if (range.e){
        range.e.c = range.e.c - 3;
    }

    let newCodedRange = XLSX.utils.encode_range(range);
    // console.log(newCodedRange);

    // let loadedTable = XLSX.utils.sheet_to_row_object_array(loadedSheet);

    const ArrayAlunosNotas = XLSX.utils.sheet_to_json(loadedSheet,{
        range: newCodedRange
    });

    let objAlunosNotas = {
        alunos: {}
    };
    
    ArrayAlunosNotas.forEach(aluno => {
        let ra = aluno["R.A."];
        objAlunosNotas.alunos[ra] = aluno;
    })

    // console.log(objAlunosNotas);
    // console.log(objToJSON(objAlunosNotas));

    //Lançando na tabela
    const htmlTable = document.getElementById("ctl24_xgvNotas_DXMainTable");
    if (htmlTable){
        const trAlunos = htmlTable.getElementsByClassName("dxgvDataRow_Edu");

        var nomeAtividades = [];

        //Verifica o nome de cada atividade
        Array.from(cabecalhoNotas.children).forEach(td => {
            let text_td = td.getElementsByTagName("td")[0].innerText;
            if (text_td.indexOf("(") != -1){
                nomeAtividades.push(text_td);
            }
        });
        nomeAtividades.reverse();

        var inputsNotas ={};

        Array.from(trAlunos).forEach(tr => {
            let raAtual = parseInt(tr.getElementsByTagName("span").length > 0 ? tr.getElementsByTagName("span")[0].innerText : 0);
            let inputs = tr.getElementsByTagName("input").length > 0 ? tr.getElementsByTagName("input") : [];
            
            inputsNotas[raAtual] = {};

            let nomeAtividades_temp = [...nomeAtividades];
            Array.from(inputs).forEach(input => {
                if (input.type == "text") {
                    //Lança nota
                    if (objAlunosNotas.alunos[raAtual]){
                        let nota = objAlunosNotas.alunos[raAtual][nomeAtividades_temp.pop()];
                        if (nota){
                            let stringNota = (typeof nota)=="number" ? nota.toFixed(2).replace(".",",") : nota.replace(".",",");
                            input.value = stringNota;
                        } else {
                            //undefined
                            input.value = "";
                        }
                    }
                }
            })
        });


    } else {
        console.log("Tabela não encontrada");
    }
}

function lerArquivo(file){
    const reader = new FileReader();
    reader.onload = function(e) {
        console.log(e);
        lancaNota(e);
    }
    reader.onloadstart = () => {
        console.log("Start");
    }
    var percent = 0;
    reader.onprogress = (fi) => {
        percent = 100 * fi.loaded / fi.total;
        let txtPercent = percent + "%";
        let progressBar = document.getElementsByClassName("fill");
        if (progressBar.length > 0){
            progressBar[0].style.minWidth = txtPercent;
        }
    }
    reader.onloadend = () => {
        console.log("End");
        let barra = document.getElementsByClassName("barra");
        if (barra.length > 0){
            barra[0].classList.add("complete");
        }
    }

    //Carrega arquivo
    reader.readAsArrayBuffer(file);
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
        criarDragDrop(false, parent);
        criarBotaoModelo(false, parent);
        criarBotaoCarregar(false, parent);
    } else {
        criarDragDrop(true, parent);
        eventosDragDrop();
        criarBotaoModelo(true, parent);
        criarBotaoCarregar(true, parent);
    }
}