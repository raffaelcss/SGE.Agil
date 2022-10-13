const nullthrows = (v) => {
    if (v == null)
        throw new Error("it's a null"); 
    return v;
}

function injectCode(src) { 
    const script = document.createElement('script'); 
    // This is why it works!
    script.src = src;
    // script.async = true;
    script.id="xlsx";
    script.onload = function() {
        console.log("script injected");
        // this.remove(); 
    }; 
    // This script runs before the <head> element is created,
    // so we add the script to <html> instead. 
    nullthrows(document.head || document.documentElement).appendChild(script);
}

injectCode(chrome.runtime.getURL('/xlsx.style.min.js'));
injectCode(chrome.runtime.getURL('/planilhas_notas.js'));

function timeSetDropIcon() {
    setTimeout(() => {
        if (document.getElementById("img-drop")) {
            document.getElementById("img-drop").src = chrome.runtime.getURL('icons/upload20x13.png');
            console.log(chrome.runtime.getURL('icons/upload20x13.png'));
        } else {
            console.log("ainda n");
            timeSetDropIcon();
        }
    }, 100);
}

timeSetDropIcon();

