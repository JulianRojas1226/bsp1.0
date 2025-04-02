document.getElementById("btn-forminit").addEventListener("click",formularioprod)
document.getElementById("close-form").addEventListener("click",cierreform)
function formularioprod(){
    const form = document.getElementById('formsprod')
    form.classList.add("act")    
}
function cierreform() {
    const form = document.getElementById('formsprod')
    form.classList.remove("act")
}