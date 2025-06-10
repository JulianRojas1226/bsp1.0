import error from "../middwlare/err.js"
import mventas from "../modulos/mventas.js";
import PdfPrinter  from "pdfmake";
import fs from "fs";
const fonts = {
    Roboto: {
      normal: "Helvetica", // Fuente para texto normal
      bold: "Helvetica-Bold", // Fuente para texto en negrita
      italics: "Helvetica-Oblique", // Fuente para texto en cursiva
      bolditalics: "Helvetica-BoldOblique" // Fuente para texto en negrita y cursiva
    }
  }
const printer = new PdfPrinter(fonts);


const cventas = {
    getventas: async(req,res)=>{
        try {
            const {usuario,cargo}= req.session
            const productos = await  mventas.mostprod()
            const mesas = await mventas.mostmesa()
            const totales = await mventas.totalmesa()
            const ordenes = await mventas.mostorden()
            const tipo_pagos = await mventas.metodo_pago()
            const pagos = await mventas.mostventas()
            const ventasu = await mventas.mostventau()
            const lowstocks = await mventas.lowstock()
            res.render("ventas", {mesas,productos,ordenes,totales,tipo_pagos,pagos,ventasu,lowstocks,usuario,cargo})
        } catch (err) {
            error.e500(req, res, err);  
        }
    },
    insorden: async(req,res)=>{
        try {
            const {id} = req.params
            const {producto,cantidad}= req.body
            console.log("✅ Datos recibidos en el controlador:", { id, producto, cantidad })  
            await mventas.insorden({id,producto,cantidad})
            res.redirect("/ventas")
        } catch (err) {
            console.error("❌ Error en el controlador:", err.message);
            res.status(500).send("Error al borrar el producto.");
        }
    },
    eliminarorden: async(req,res)=>{
        try {
            const {id} = req.params
            const result =await mventas.eliminarorden({id})
            console.log("✅ Datos recibidos en el controlador:", { id});
            res.redirect("/ventas")
        } catch (error) {
            throw {status:500,message:"error al borrar datosd"}
        }
    },
    duplicar: async(req,res) => {
      try {
        const {id} = req.params
        const result =await mventas.duplicar_orden({id})
        console.log("✅ Datos recibidos en el controlador:", { id});
        res.redirect("/ventas")  
      } catch (err) {
        res.render("mensaje_temporal", {
            mensaje: "Stock insuficiente para duplicar",
            redireccion: "/ventas",
            tiempo: 3000 // milisegundos = 3 segundos
        })
      }
    },
    pagar: async(req,res)=>{
        try {
            const {usuario}= req.session
            const{mesa}= req.params
            const{pago}= req.body
            console.log("✅ Datos recibidos en el controlador:", { mesa,pago})
            const result = await mventas.pagar({mesa,pago,usuario})
            res.redirect("/ventas")
        } catch (error) {
            console.error("❌ Error en pagar:", error);
        
        // Manejo del error con respuesta al cliente
            res.status(500).json({
                message: "Ocurrió un error al procesar el pago",
                error: error.message || "Error desconocido"
            })
        }
    },
    generarpdf: async (req,res) => {
        const filtros ={
            inicio: req.query.inicio && req.query.inicio.trim() !== "" ? req.query.inicio : null,
            fin: req.query.fin && req.query.fin.trim() !== "" ? req.query.fin : null,
            mes: req.query.mes && !isNaN(req.query.mes) && req.query.mes >= 1 && req.query.mes <= 12 ? req.query.mes : null,
            dia: req.query.dia && !isNaN(req.query.dia) && req.query.dia >= 1 && req.query.dia <= 7 ? req.query.dia : null,
            pago: req.query.pago && req.query.pago.trim() !== "" ? req.query.pago : null

        }
        try {
            const ventas = await mventas.obtenerVentas(filtros)
            if (ventas === 0){
                return res.status(404).send("No se encontraron ventas.");
            }
            const body = ventas.map(v=>[v.hora.toISOString().split(`T`)[0], v.mesa,v.producto,v.cantidad,`$${v.precio_u}`,`$${v.total_p}`, v.pago])
            const filtrosusados= Object.entries(filtros)
            .filter(([_, valor])=> valor !== null && valor !== "")
            .map(([clave,valor])=> `${clave}: ${valor}`) 
            .join(", ")
            const docDefinicion={
                content:[
                    {text: `Reporte de Ventas`, style:`header`},
                    {text: `${new Date().toLocaleDateString("es-ES",{ year:"numeric",month:"long", day:"numeric"})}`, style:`subheader`},
                    {text: '\n'},
                    {text: `Filtros aplicados: ${JSON.stringify(filtrosusados)}`, style:`subheader`},
                    {text: '\n'},
                    {
                        table:{
                            widths:['20%','5%','20%','10%','20%','20%','20%'],
                            body:[['fecha','mesa','producto','cantidad','precio unitario','total_p','metodo pago'], ...body]
                        }
                    }
                ],
                styles: {
                    header: { fontSize: 18, bold: true, alignment: 'center' },
                    subheader: { fontSize: 12, italics: true, alignment: 'left' }
                }
                
            }
            const pdfDoc = printer.createPdfKitDocument(docDefinicion);
            const filepath =`./public/reporte.pdf`
            const stream = fs.createWriteStream(filepath)
            pdfDoc.pipe(stream)
            pdfDoc.end()
            stream.on('finish',()=>{
                res.download(filepath)
            })
        } catch (error) {
            console.error("Error al generar PDF:", error);
            res.status(500).send("Error interno.");

        }
    }

    

}
export default cventas