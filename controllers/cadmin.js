import puppeteer from "puppeteer";
import madmin from "../modulos/madmin.js";
import fs from "fs"



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
            const categorias = await madmin.traer_categoria_e()
            const metodos = await madmin.traer_metodo_pago()
            const empleados = await madmin.traer_empleado()
            const cargos = await madmin.traer_cargo()
            const productos = await madmin.traer_tipo_p()
            res.render("admin",{usuario,cargo,categorias,metodos,empleados,cargos,productos})
        }catch(err){
            console.log("ocurrio un error", err)
        }
    }, 
    add_egreso:async(req,res)=>{
        try {
            const {usuario}= req.session
            const {nombre,tipo,costo}= req.body
            await madmin.add_egreso({nombre,tipo,costo,usuario})
            res.redirect("/admin")
        } catch (error) {
            res.render("mensaje_temporal",{
                mensaje: "se ha generado un error al momento de la insercion de datos",
                tiempo: 3000,
                redireccion: "/admin"
            })
        }
    },
    add_empleado: async (req,res) => {
        try {
            const {nombre,correo,codigo,cargo}=req.body
            await madmin.creacion({nombre,correo,codigo,cargo})
        } catch (error) {
            res.render("mensaje_temporal",{
                mensaje: "se ha generado un error al momento de la insercion de datos",
                tiempo: 3000,
                redireccion: "/admin"
            })
        }
    },
    filtrar_egresos: async (req, res) => {
        try {
            const { fecha_inicio, fecha_fin, categoria, empleado,nombre } = req.body;

            const datos = await madmin.traer_egresos({ fecha_inicio, fecha_fin, categoria, empleado,nombre });

            res.json({
            success: true,
            datos
            });

        } catch (err) {
            console.error("Error filtrando egresos:", err);
            res.status(500).json({ success: false, error: "Error interno del servidor" });
        }
    },
    filtrar_ventas: async (req,res) => {
        try {
            const {fecha_inicio_v,fecha_fin_v,metodo,empleado}= req.body
            const datos = await madmin.traer_ventas({fecha_inicio_v,fecha_fin_v,metodo,empleado})
            res.json({
                success: true,
                datos
            })
        } catch (error) {
             console.error("Error filtrando egresos:", err);
            res.status(500).json({ success: false, error: "Error interno del servidor" });
        }
    },
    duplicados: async (req,res) => {
        try {
            const empleado = await madmin.duplicados()
            res.json(empleado)
        } catch (error) {
            console.error("no se pudieron traer los datos ",error)
        }
    },
    deshabilitar: async (req,res) => {
        try {
             const {nombre} = req.body
             console.log("Nombre recibido:", nombre)
             const result = await madmin.desabilitar_empleado({nombre})
             console.log("Resultado de eliminación:", result);
            res.redirect("/admin")
        } catch (error) {
            console.error("no se pudieron deshabilitar el empleado ",error)
        }
    },

    filtros: async (req,res) => {
        try {
            const {fecha_inicio,fecha_fin,empleado,metodo_p,categoria_e,tipo_pr}= req.body
            req.session.filtros = {
                fecha_inicio,
                fecha_fin,
                empleado,
                metodo_p,
                categoria_e,
                tipo_pr
            };

              
            res.redirect("/pdf/generar")
        } catch (error) {
            console.error("no se pudieron subir los datos",error)
        }
    },
    


 

}
export default cadmin