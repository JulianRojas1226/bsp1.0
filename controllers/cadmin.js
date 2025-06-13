import madmin from "../modulos/madmin.js";

const cadmin = {
    getadmin: async(req,res)=>{
        try{
            const{usuario,cargo} =req.session
            if(cargo == 2){
               res.render("mensaje_temporal",{
                mensaje: "No tiene acceso permitido a esta sesion",
                redireccion :"/sesion",
                tiempo: 5000
            }) 
            }
            res.render("admin")
        }catch(err){
            console.log("ocurrio un error", err)
        }
    }
}

export default cadmin