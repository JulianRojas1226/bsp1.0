import bcrypt from "bcrypt";
import mlogin  from "../modulos/modulos.js";
import error from "../middwlare/err.js";

// inicio login
const clogin=
{ 
    getlogin: (req,res)=>{
    res.render("login")
    },
    autenticacion: async (req,res)=>{
    try { 
        const {usuario,codigo} = req.body
        const results = await mlogin.autenticacionlogi(usuario)
        if (results.length === 0){
            let err = {
                status: 401,
                message: `El usuario ${usuario} no fue encontrado en la BD`,
            }
            error.e401(req, res, err);
        }
        

        let user = results[0]
        let imatch = await bcrypt.compare(codigo,user.codigo)
        if (!imatch) {
            let err = {
                status: 403,
                message: "Contraseña incorrecta",
              };
      
            error.e403(req, res, err);
        }
        
         req.session.usuario = usuario;
        req.session.cargo = user.cargo; // <-- aquí guardas el tipo de cuenta
        res.redirect("/sesion")
        

    } catch (err) {
        error.e500(req, res, err);
    }
    },
    Registro: async (req, res) => {
        try {
          const {nombre_r,password,correo} = req.body;
          await mlogin.creacion({ nombre_r,password,correo});
          res.render("index");
        } catch (err) {
          error.e500(req, res, err);
        }
    },
    
}

export default clogin