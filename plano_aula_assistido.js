function Ligar_planAula(){
    if (document.getElementById("ctl24_xmnuOpcao_DXI0_T")){
        if (!document.getElementById("Div_plan_aula")){
            if (document.getElementById("ctl24_xmnuOpcao_DXI0_T")){
                document.getElementsByClassName("AccordionItemChildControlsDiv")[0].appendChild(Botao_plan_aula());        
            }
        }
    }
}

function Desligar_planAula(){
    if (document.getElementById("Div_plan_aula")){
        document.getElementById("Div_plan_aula").parentNode.removeChild(document.getElementById("Div_plan_aula"));
    }
}

function evento_botao_plan_aula_in(){
    document.getElementById("menu_plan_aula").style.display = 'block';
}
function evento_botao_plan_aula_out(){
    document.getElementById("menu_plan_aula").style.display = 'none';
}

function Botao_plan_aula(){
    var div1 = document.createElement('div');
    div1.classList.add("dxmLite");
    div1.classList.add("dxm-ltr");
    div1.style.width = '139px';
    div1.style.margin = 'auto';
    div1.style.marginTop = '10px';
    div1.id = "Div_plan_aula";

    var div11 = document.createElement('div');
    div11.classList.add("dxm-main");
    div11.classList.add("dxm-horizontal");
    div1.appendChild(div11);

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

    var b11 = document.createElement('b');
    b11.classList.add("dx-clear");
    div1.appendChild(b11);

    var div12 = document.createElement('div');
    div12.style = document.getElementById("ctl24_xmnuOpcao_DXM0_").style;
    div12.style.width = '139px';
    div12.style.display = 'none';
    div12.id = 'menu_plan_aula';
    div1.appendChild(div12);

        var div21 = document.createElement('div');
        div21.classList.add("dxm-shadow");
        div21.classList.add("dxm-popup");
        div21.style = document.getElementById("ctl24_xmnuOpcao_DXME0_").style;
        div12.appendChild(div21);

            var ul211 = document.createElement('ul');
            ul211.classList.add("dx");
            ul211.classList.add("dxm-noImages");
            ul211.classList.add("dxm-gutter");
            div21.appendChild(ul211);

                //Funções do menu
                //Função 1
                var li211 = document.createElement('li');
                li211.id = "plan_aula_func_1";
                li211.classList.add("dxm-item");
                ul211.appendChild(li211);
                    var div2111 = document.createElement('div');
                    div2111.classList.add("dxm-content");
                    div2111.classList.add("dxm-hasText");
                    div2111.style.float = 'none';
                    li211.appendChild(div2111);
                        var span21111 = document.createElement('span');
                        span21111.classList.add("dx-vam");
                        span21111.classList.add("dxm-contentText");
                        span21111.innerHTML = "Copiar varios para próxima aula";
                        div2111.appendChild(span21111);

                    var b2111 = document.createElement('b');
                    b2111.classList.add("dx-clear");
                    li211.appendChild(b2111);

                //Espaço
                var esp1 = document.createElement('li');
                esp1.classList.add("dxm-spacing");
                ul211.appendChild(esp1);

                //Função 2
                var li212 = document.createElement('li');
                li212.id = "plan_aula_func_2";
                li212.classList.add("dxm-item");
                ul211.appendChild(li212);
                    var div2121 = document.createElement('div');
                    div2121.classList.add("dxm-content");
                    div2121.classList.add("dxm-hasText");
                    div2121.style.float = 'none';
                    li212.appendChild(div2121);
                        var span21211 = document.createElement('span');
                        span21211.classList.add("dx-vam");
                        span21211.classList.add("dxm-contentText");
                        span21211.innerHTML = "Função 2";
                        div2121.appendChild(span21211);

                    var b2121 = document.createElement('b');
                    b2121.classList.add("dx-clear");
                    li212.appendChild(b2121);

    //Adicionando eventos
    //Botão principal Mouseover
    div1.addEventListener("mouseover", evento_botao_plan_aula_in, false);
    div1.addEventListener("mouseout", evento_botao_plan_aula_out, false);

    //Função 1
    li211.addEventListener("click", Setar_Aulas_seq_assistida, false);

    return div1;
}


function Setar_Aulas_seq_assistida(){
    var aulas_marcadas = document.getElementsByClassName("dxWeb_edtCheckBoxChecked_Edu");

    if (aulas_marcadas.length > 0){
        var id_aulas = [];

        Array.from(aulas_marcadas).forEach(element => {
            id_aulas.push(element.id);
            element.click();
        })

        setCookie("Plano_aula_seguinte",JSON.stringify(id_aulas),1400);
        //Lança a primeira aula
        Aulas_seq_assistida();
    } else {
        alert('Você deve selecionar pelo menos uma aula!\nVocê pode marcar mais de um dia se quiser =)');
    }
}

// Executar assim que abrir a página pois so vai existir esse cookie quando clicar no botão do SGE_Agil_ON.Agil
function Aulas_seq_assistida(){
    var ids = JSON.parse(getCookie("Plano_aula_seguinte"));
    if (ids == null){
        ids = [];
        setCookie("Plano_aula_seguinte",JSON.stringify([]),1400);
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
                    setCookie("Plano_aula_seguinte",JSON.stringify(ids),1400);
                    //Copia para as próximas aulas
                    if (document.getElementById("ctl24_xmnuOpcao_DXI0i1_")){
                        document.getElementById("ctl24_xmnuOpcao_DXI0i1_").click();
                    }
                } else {
                    //Recursividade para poder tentar encontrar a lista até achar
                    if (++cont < limite_cont){
                        console.log("Debug: Buscando aulas: " + cont*2 + "ms corridos")
                        espera_lista_aulas();
                    } else {
                        //Salva uma lista vazia no cookie pois provavelmente a função deu problema ou passou o tempo limite
                        setCookie("Plano_aula_seguinte",JSON.stringify([]),1400);
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


// function Aulas_seq_assistida(){
//     var ids = JSON.parse(getCookie("Plano_aula_seguinte"));
//     if (ids == null){
//         ids = [];
//         setCookie("Plano_aula_seguinte",JSON.stringify([]),1400);
//     }
//     if (ids.length > 0){
//         setTimeout(() => {
//             console.log("Debug: Copiando aula em sequência de forma assistida!");
//             let id_atual = ids.shift();
//             //Marca na primeira aula da lista e a elimina da lista
//             if (document.getElementById(id_atual)) {
//                 document.getElementById(id_atual).click();
//                 //Salva a nova lista no cookie
//                 setCookie("Plano_aula_seguinte",JSON.stringify(ids),1400);
//                 //Copia para as próximas aulas
//                 if (document.getElementById("ctl24_xmnuOpcao_DXI0i1_")){
//                     document.getElementById("ctl24_xmnuOpcao_DXI0i1_").click();
//                 }
//             } else {
//                 //Salva uma lista vazia no cookie pois provavelmente a função deu problema
//                 setCookie("Plano_aula_seguinte",JSON.stringify([]),1400);
//                 console.log("Erro, não encontrou a lista")
//             }
//         }, 1);      
//     } else {
//         console.log("Debug: Não há aulas a serem copiadas de forma assistida!");
//     }
// }