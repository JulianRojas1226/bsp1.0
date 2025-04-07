document.getElementById("btn-forminit").addEventListener("click",formularioprod)
document.getElementById("close-form").addEventListener("click",cierreform)
document.getElementById("btn-opennot").addEventListener("click",opennot)
document.getElementById("btn-closenot").addEventListener("click",closenot)
function formularioprod(){
    const form = document.getElementById('formsprod')
    form.classList.add("act")    
}
function cierreform() {
    const form = document.getElementById('formsprod')
    form.classList.remove("act")
}
function opennot() {
    const not = document.getElementById('notificacionesprod')
    not.classList.add("act")
}
function closenot() {
    const not = document.getElementById('notificacionesprod')
    not.classList.remove("act")
}
document.getElementById("formprod").addEventListener("submit", function () {
    const nombre = document.getElementById("nombre").value.toLowerCase();
    document.getElementById("nombre").value = nombre;
});
document.getElementById("filtro-busqueda").addEventListener("submit",function () {
    const busqueda = document.getElementById("query").value.toLowerCase()
    document.getElementById("query").value = busqueda
})