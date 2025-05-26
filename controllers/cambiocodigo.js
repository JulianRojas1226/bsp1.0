import mcontraseña from "../modulos/mcodigo.js";
import enviar_recuperacion from "../middwlare/mail.js"
import tokenService from "../middwlare/token.js";
import error from "../middwlare/err.js";
  const { generartoken, validartoken } = tokenService;  
    
    
    
const ccodigo={    
    ir_a_solicitud: async (req,res) => {
        try {
            
            res.render("solicitud")
        } catch (error) {
             console.error("Error:", error);
            res.status(500).send("Error interno del servidor");

        }
    },
   buscarcorreo: async (req, res) => {
        try {
            const { email } = req.body;
            console.log("correo: ", email);

            const usuario = await mcontraseña.buscaremail({ email });
            if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

            const token = generartoken(email);
            await enviar_recuperacion({ destinatario: email, token });

            res.json({ mensaje: 'Correo enviado correctamente' });
        } catch (err) {
            console.error("Error en buscarcorreo:", err);
            error.e500(req, res, err);
        }
    },
        get_cambio_codigo: async (req, res) => {
        try {
            const { token } = req.query;
            const datos = validartoken(token);
            if (!datos) return res.status(403).send("Token inválido o expirado");

            // Pasar token a la vista para que se use en el formulario
            res.render("restablecer_contraseña", { token });
        } catch (error) {
            console.error("Error en get_cambio_codigo:", error);
            res.status(500).send("Error interno del servidor");
        }
        },
    cambiarcontraseña: async (req, res) => {
        try {
            const { token } = req.body ;
            const { nuevaContraseña } = req.body;

            const datos = validartoken(token);
            
            if (!datos) return res.status(403).send("Token inválido ");

            await mcontraseña.actualizar_contraseña({ email: datos.email, nuevaContraseña});

            res.render("confirmacion"); // mejor que hacer redirect después de json
        } catch (err) {
            console.error("Error en cambiarcontraseña:", err);
            error.e500(req, res, err);
        }
    }
}
export default ccodigo