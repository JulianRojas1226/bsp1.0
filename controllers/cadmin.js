import madmin from "../modulos/madmin.js";

const cadmin = {
    getadmin: async(req,res)=>{
        try{
            res.render("admin")
        }catch(err){
            console.log("ocurrio un error", err)
        }
    }
}

export default cadmin