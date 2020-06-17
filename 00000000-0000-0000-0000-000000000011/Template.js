var scripts = document.getElementsByTagName("script"),
src = scripts[scripts.length - 1].src;
src = src.substr(0, src.lastIndexOf("/")) + "/../00000000-0000-0000-0000-000000000010/Template.js";

var js = document.createElement("script");
js.type = "text/javascript";
js.src = src;
document.head.appendChild(js);