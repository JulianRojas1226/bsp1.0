import { JsonWebTokenError } from "jsonwebtoken";
const claveSecreta = 'clave_secreta_segura'

function generartoken(email) {
    return jwt.sign({email},claveSecreta,{expiresIn: '2m'})
}
function validartoken(token){
    try {
        return jwt.verify(token,claveSecreta)
    } catch (error) {
        return null
    }
}