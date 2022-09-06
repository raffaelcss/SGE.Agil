/////////////////////         Barra de pesquisa           /////////////////////
/*   //Deprecado, utilizando CSS e ClassName ao invés de comando
function desocultar(turma){
    turma.style.display = 'list-item';
    console.log('Debug: Ocultando turma: '+turma.children[0].children[1].innerHTML);
}
function ocultar(turma){
    turma.style.display = 'none';
    console.log('Debug: Desocultando turma: '+turma.children[0].children[1].innerHTML);
} */
var Interval_pesquisa;
var FF_pes;
var pes;
var valor_pes;
var condicao_criar_pes;

var turmas = [];
var nome;
var ucs = [];
var uc;
var arquivada = false;
var inicio_text;

var paizao;
var pai;
var check_gemi;
var text_gemi;
var check_libfre;
const text_libfre = document.createElement("label");
var text_lib_old;
var mudou_check = false;

var limpar;

function filtrar(limpar = false) {
    //console.log('Debug:Filtrando turmas');
    //Valor da pesquisa para evitar erro ao não encontrar pes.value
    //console.log(pes);
    //console.log(pes === undefined);    
    valor_pes = pes === undefined ? "" : pes.value;

    //if (pes.value){                               //Retirei pois não salvava a busca vazzia
    setCookie("PesquisaSGE",valor_pes,1400);
    //}

    turmas = document.querySelectorAll('.dxnb-gr');
    ucs = document.querySelectorAll('.dxnb-item');
    //Faz a pesquisa pelo nome da turma
    turmas.forEach((element) => {
        if (limpar === true){
            element.classList.remove("oculto");
        } else{
            element.classList.add("oculto");
            nome = element.children[0].children[1].innerHTML.toUpperCase();  //Testando com children[0]
            if (nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(valor_pes.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) != -1) {
                element.classList.remove("oculto");
            }           
        }
    })
    //Faz a pesquisa pelo nome da UC
    ucs.forEach((element) => {
        var acima_uc = element.parentElement.parentElement
        inicio_text = element.children[0].innerHTML.toUpperCase().indexOf('>');
        uc = element.children[0].innerHTML.toUpperCase().substring(inicio_text+1).normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if (uc.indexOf(valor_pes.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) != -1) {
            acima_uc.classList.remove("oculto");
        } 
            
    })

    //atualizar scrool da página com base em uma função do arquivar turmas 0.3.2
    setTimeout(() => {
        refresh_scroll_mainContainer();
    }, 150);
    
}
function Cria_pes() {
    pes = document.createElement("input");
    pai = document.getElementById("AddressMainRow");

    const Div_pes = document.createElement("DIV");
    const Texto = document.createElement("span");

    Div_pes.setAttribute('class', 'FFpesquisaSGE');
    Div_pes.style.marginRight = "2rem";
    Div_pes.style.display = "flex";
    Div_pes.style.height = "21px";

    Texto.setAttribute('class', 'QNajvd');
    Texto.innerHTML = 'Pesquisa';
    Texto.style.fontSize = '14px';
    Texto.style.paddingRight = '0.5rem';
    Texto.style.margin = "auto";
    Texto.style.fontWeight = "500";
    Texto.style.color = "#01117e";
    Texto.style.fontFamily = "'Google Sans',Roboto,Arial,sans-serif";
    Texto.style.letterSpacing = ".25px";

    pes.type = 'text';
    pes.placeholder = ' Busque por: Turma.. UC.. Horário.. Ano..'
    pes.value = getCookie("PesquisaSGE") || '';
    pes.style.margin = 'auto';
    //pes.style.border = 'none';
    pes.style.width = "300px";
    pes.style.height = "15px";
    pes.onkeyup = (filtrar)

    pai.appendChild(Div_pes);
    Div_pes.appendChild(Texto);
    Div_pes.appendChild(pes);

    filtrar();

}
function Ligar_pesquisa() {
    FF_pes = document.querySelectorAll('.FFpesquisaSGE');
    condicao_criar_pes = document.getElementById("ctl24_EduTurmasProfRadioButtonWebForm1_RMWLabel1") !== null;
    if (FF_pes.length === 0 && condicao_criar_pes) {
        Cria_pes();
        //console.log('Criando barra de pesquisa para turmas ');
        //Seta intervalo para repetir a função
        Interval_pesquisa = setInterval(()=> {
            FF_pes = document.querySelectorAll('.FFpesquisaSGE');
            if (FF_pes.length === 0) {
                Cria_pes();
                //console.log('Debug:Criando barra de pesquisa para turmas ');
            }
            //Muda_check();  //Marcar aulas geminadas, será movido para nova area
        },2500)
    }    
}
function Desligar_pesquisa() {
    clearInterval(Interval_pesquisa);
    //console.log('Debug:Removendo barra de pesquisa para turmas ');
    FF_pes = document.querySelectorAll('.FFpesquisaSGE');
    if (FF_pes.length > 0) {
        document.getElementById("AddressMainRow").removeChild(FF_pes[0]);
        //if (FF_pes[0].parentNode) {
            //FF_pes[0].parentNode.removeChild(FF_pes[0]);
        //} else {
        //    console.log("Erro ao remover barra de pesquisa");
        //}
    }
    filtrar(true);
}
////////////// Barra de pesquisa /////////////////////