import bcrypt from "bcryptjs";
import mlogin  from "../modulos/modulos.js";
import error from "../middwlare/err.js";

// inicio login
const clogin={ 
    getlogin: async (req,res)=>{
        const cargos = await mlogin.mostrarcargo()
        console.log("datos cargos", cargos)

        res.render("login",{cargos})
    },
    autenticacion: async (req,res)=>{
    try { 
        const {usuario,codigo} = req.body
        const results = await mlogin.autenticacionlogi(usuario)
        if (results.length === 0){
            res.render("mensaje_temporal", {
            mensaje: "usuario no encontrado",
            redireccion: "/",
            tiempo: 3000 // milisegundos = 3 segundos
        })
            
        }
        

        let user = results[0]
        if (user.estado !== 'activo') {
            return res.render("mensaje_temporal", {
                mensaje: "Tu cuenta está inactiva. Contacta al administrador",
                redireccion: "/",
                tiempo: 5000 // 5 segundos para que puedan leer el mensaje
            })
        }
        let imatch = await bcrypt.compare(codigo,user.codigo)
        if (!imatch) {
            res.render("mensaje_temporal", { 
            mensaje: "Contraseña incorrecta",
            redireccion: "/",
            tiempo: 3000 // milisegundos = 3 segundos
        })
        }
        
         req.session.usuario = usuario;
        req.session.cargo = user.cargo; // <-- aquí guardas el tipo de cuenta
        res.redirect("/sesion")
        

    } catch (err) {
        res.render("mensaje_temporal", {
            mensaje: "usuario no encontrado",
            redireccion: "/",
            tiempo: 3000 // milisegundos = 3 segundos
        })
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