function Ligar_planAula(){
    if (document.getElementById("ctl24_xmnuOpcao_DXI0_T")){
        if (!document.getElementById("div_menu")){
            if (document.getElementsByClassName("dxmLite")[0]){
                document.getElementsByClassName("dxmLite")[0].style.display = "flex";
                Botao_plan_aula().forEach(element => {
                    document.getElementsByClassName("dxmLite")[0].appendChild(element);
                    //console.log(element);
                });
            }
        }
    }
}

function Desligar_planAula(){
    if (document.getElementById("div_menu")){
        document.getElementById("div_menu").parentNode.removeChild(document.getElementById("div_menu"));
    }
    if (document.getElementById("menu_plan_aula")){
        document.getElementById("menu_plan_aula").parentNode.removeChild(document.getElementById("menu_plan_aula"));
    }
}
function evento_botao_plan_aula_in(){
    
    clearTimeout(getCookie("ocultaMenuTimeOut"));
    let pos = 425 - document.getElementById("MainContainer").scrollTop;

    if ((pos + document.getElementById("menu_plan_aula").clientHeight) > window.innerHeight){
        pos -= document.getElementById("menu_plan_aula").clientHeight + 28;
    }
    document.getElementById("menu_plan_aula").style.top = pos + "px";

    document.getElementById("menu_plan_aula").style.visibility = 'visible';
    this.classList.add("hover");
}
function evento_botao_plan_aula_out(){
    this.classList.remove("hover");
    var ocultaMenuTimeOut = setTimeout(() => {
        if (!document.getElementById("div_menu").classList.contains("hover") && !document.getElementById("menu_plan_aula").classList.contains("hover")){
            document.getElementById("menu_plan_aula").style.visibility = 'hidden';
        }
    }, 500); 
    setCookie('ocultaMenuTimeOut',ocultaMenuTimeOut, 0.05);
}
function criaFuncaoBtnPlanAula(texto, pai, func = (() => {})){
    //Numero função
    let qtd = pai.getElementsByClassName("dxm-item").length;
    
    //Função
    var li211 = document.createElement('li');
    li211.id = "plan_aula_func_" + (qtd+1);
    li211.classList.add("dxm-item");

        var div2111 = document.createElement('div');
        div2111.classList.add("dxm-content");
        div2111.classList.add("dxm-hasText");
        div2111.style.float = 'none';
        li211.appendChild(div2111);
            var span21111 = document.createElement('span');
            span21111.classList.add("dx-vam");
            span21111.classList.add("dxm-contentText");
            span21111.innerHTML = texto;
            div2111.appendChild(span21111);

        var b2111 = document.createElement('b');
        b2111.classList.add("dx-clear");
        li211.appendChild(b2111);

    //Add evento Click
    li211.addEventListener("click", func, false);

    //Espaço
    var esp1 = document.createElement('li');
    esp1.classList.add("dxm-spacing");
    
    pai.appendChild(li211);
    pai.appendChild(esp1);
}

function Botao_plan_aula(){
    // var div1 = document.createElement('div');
    // div1.classList.add("dxmLite");
    // div1.classList.add("dxm-ltr");
    // div1.style.width = '139px';
    // div1.style.margin = 'auto';
    // div1.style.marginTop = '10px';
    // div1.id = "Div_plan_aula";


    var div11 = document.createElement('div');
    div11.id = "div_menu";
    div11.style.marginLeft = "10px";
    div11.classList.add("dxm-main");
    div11.classList.add("dxm-horizontal");

        var ul111 = document.createElement('ul');
        ul111.classList.add("dx");
        ul111.classList.add("dxm-image-l");
        ul111.classList.add("dxm-noImages");
        div11.appendChild(ul111);

            var li1111 = document.getElementById("ctl24_xmnuOpcao_DXI0_").cloneNode(true);
            li1111.id = "Botao_Plan_aula"
            li1111.style.minWidth = '130px';
            ul111.appendChild(li1111);

                li1111.childNodes[0].id = "Texto_btn_plan_aula";
                    li1111.children[0].children[0].innerHTML = "Funções SGE.Ágil";
                li1111.childNodes[1].id = "Img_btn_plan_aula";

    // var b11 = document.createElement('b');
    // b11.classList.add("dx-clear");
    // div1.appendChild(b11);

    var div12 = document.createElement('div');
    div12.style = document.getElementById("ctl24_xmnuOpcao_DXM0_").style;
    div12.style.position = "absolute";
    div12.style.left = "525px";
    //div12.style.display = 'block';
    div12.style.visibility = 'hidden';
    div12.id = 'menu_plan_aula';

        var div21 = document.createElement('div');
        div21.classList.add("dxm-shadow");
        div21.classList.add("dxm-popup");
        div21.style = document.getElementById("ctl24_xmnuOpcao_DXME0_").style;
        div12.appendChild(div21);

            var ul211 = document.createElement('ul');
            ul211.id = "func_container";
            ul211.classList.add("dx");
            ul211.classList.add("dxm-noImages");
            ul211.classList.add("dxm-gutter");
            div21.appendChild(ul211);

            //Funções do menu
                //Função 1
                criaFuncaoBtnPlanAula("Copiar conteúdo previsto para VÁRIAS aulas em sequência", ul211, Setar_Aulas_seq_assistida);
                //Função 2
                //criaFuncaoBtnPlanAula("Teste de nova função", ul211);
                

    //Adicionando eventos
    //Botão principal Mouseover
    div11.addEventListener("mouseover", evento_botao_plan_aula_in, false);
    div11.addEventListener("mouseout", evento_botao_plan_aula_out, false);
    div12.addEventListener("mouseover", evento_botao_plan_aula_in, false);
    div12.addEventListener("mouseout", evento_botao_plan_aula_out, false);


    return [div11,div12];
}


function Setar_Aulas_seq_assistida(){
    var aulas_marcadas = document.getElementsByClassName("dxWeb_edtCheckBoxChecked_Edu");

    if (aulas_marcadas.length > 0){
        var id_aulas = [];

        Array.from(aulas_marcadas).forEach(element => {
            id_aulas.push(element.id);
            element.click();
        })

        setCookie("Plano_aula_seguinte",JSON.stringify(id_aulas),24);
        //Lança a primeira aula
        Aulas_seq_assistida();
    } else {
        alert('Você deve selecionar pelo menos uma aula!\nVocê pode marcar mais de um dia se quiser ツ');
    }
}

// Executar assim que abrir a página pois so vai existir esse cookie quando clicar no botão do SGE_Agil_ON.Agil
function Aulas_seq_assistida(){
    var ids;
    try {
        ids = JSON.parse(getCookie("Plano_aula_seguinte"));
    }
    catch (e){

    }
    if (ids == null){
        ids = [];
        setCookie("Plano_aula_seguinte",JSON.stringify([]),24);
    }
    if (ids.length > 0){
        var cont = 0; //cont * 2 = Tempo corrido em ms
        var limite_cont = 1500; //3 segundos
        function espera_lista_aulas() {
            setTimeout(() => {              
                //Marca na primeira aula da lista e a elimina da lista
                if (document.getElementById(ids[0])) {
                    console.log("Debug: Copiando aula em sequência de forma assistida!");
                    let id_atual = ids.shift();
                    document.getElementById(id_atual).click();
                    //Salva a nova lista no cookie
                    setCookie("Plano_aula_seguinte",JSON.stringify(ids),24);
                    //Copia para as próximas aulas
                    if (document.getElementById("ctl24_xmnuOpcao_DXI0i1_")){
                        document.getElementById("ctl24_xmnuOpcao_DXI0i1_").click();
                    }
                } else {
                    //Recursividade para poder tentar encontrar a lista até achar
                    if (++cont < limite_cont){
                        console.log("Debug: Buscando aulas: " + cont*2 + "ms corridos");
                        espera_lista_aulas();
                    } else {
                        //Salva uma lista vazia no cookie pois provavelmente a função deu problema ou passou o tempo limite
                        setCookie("Plano_aula_seguinte",JSON.stringify([]),24);
                        console.log("Erro, não encontrou a lista, tempo limite esgotado.");
                    }
                }
            }, 2);  
        }  
        //Chamar a função
        espera_lista_aulas();  
    } else {
        //console.log("Debug: Não há aulas a serem copiadas de forma assistida!");
    }
}