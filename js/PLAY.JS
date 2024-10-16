document.getElementById("btn_registrarse").addEventListener("click",register);
document.getElementById("btn_iniciarsesion").addEventListener("click",InicarSesion);
var contenedor_is_r = document.querySelector(".contenedor_is_r")
var inicio_sesion =document.querySelector(".iniar_sesion");
var register =document.querySelector(".REGISTRO");
var caja_trasera_is =document.querySelector(".caja_trasera_is");
var caja_trasera_reg  =document.querySelector(".caja_trasera_reg");

function InicarSesion(){
    register.style.display ="none";
    contenedor_is_r.style.left="10px";
    inicio_sesion.style.display="block";
    caja_trasera_reg.style.opacity="1";
    caja_trasera_is.style.opacity="0";
}

function register(){
register.style.display ="block";
contenedor_is_r.style.left="410px";
inicio_sesion.style.display="none";
caja_trasera_reg.style.opacity="0";
caja_trasera_is.style.opacity="1";
}