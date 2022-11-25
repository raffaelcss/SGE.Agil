function Ligar_darkMode(){
    var css_style;

    if (!document.getElementById("style_dark")){
        css_style = document.createElement('link');
        css_style.id = "style_dark";
        css_style.type = "text/css";
        css_style.href = chrome.runtime.getURL('dark_mode.css');
        css_style.rel = "stylesheet";

        document.querySelector("head").appendChild(css_style);
        //console.log("CSS Dark adicionado");

    }
}
  
function Desligar_darkMode(){
    var css_style;

    if (document.getElementById("style_dark")){
        css_style = document.getElementById("style_dark");
        css_style.parentNode.removeChild(css_style);
    }

}