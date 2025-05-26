import pkg from 'jsonwebtoken';
const { sign, verify, JsonWebTokenError } = pkg;

const claveSecreta = 'clave_secreta_segura';

function generartoken(email) {
    return sign({ email }, claveSecreta, { expiresIn: '15m' }); // Aquí usamos `sign`
}

function validartoken(token) {
    try {
        return verify(token, claveSecreta); // Aquí usamos `verify`
    } catch (error) {
        return null;
    }
}


export default {generartoken, validartoken}