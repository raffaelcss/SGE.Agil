//Funções básicas de leitura e escrita de Cookies
function setCookie(name,value,hours) {
    var expires = "";
    if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + (hours*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    //console.log("Debug:cookie criado");
}
function getCookie(name, notFoundValue = null) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return notFoundValue;
}
function getBoolCookie(name, notFoundValue = null) {
    let tmpCokie = getCookie(name);
    if ((typeof notFoundValue != "undefined") && (tmpCokie == null)) {
        return notFoundValue;
    }
    return getCookie(name) == "true";
}
function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}