import error from "../middwlare/err.js";
import msesion from "../modulos/msesion.js";
const csescion = {
    getsesion: async (req, res) => {
        try {
          const {cargo,usuario}= req.session
          const productos = await msesion.most_prod()
          res.render("sesion",{productos,cargo,usuario});  
        } catch (err) {
          error.e500(req, res, err);
        }
      },
      
      get_graficos_mes: async (req,res) => {
          try {
          const datosbarras =await msesion.ventas_meses()
          const labels = datosbarras.map(d => d.nombre_mes)
          const values = datosbarras.map(d => d.total_mensual)
          res.json({labels,values})
          } catch (error) {
          res.status(500).send("Error al obtener datos.");
          }
        },
      get_lineal: async (req,res) => {
          try {
          const datalineal = await msesion.progresion_ventas()
          const labels = datalineal.map(d => `${d.mes} ${d.año}`)
          const values = datalineal.map(d => d.totales)
          res.json({labels,values})
          } catch (error) {
          res.status(500).send("Error al obtener datos.");
          }
        },
      get_calendar: async (req,res) => {
        try {
            const reservas = await msesion.mostres();
            const eventos = reservas.map(reserva => ({
              id: reserva.id_re,
              title: reserva.nombre,
              start: reserva.fecha_hora // Asegúrate de que el formato de fecha es correcto
            }));

           res.json(eventos)         
        } catch (error) {
          res.status(500).send("Error al obtener datos.");
        }
      },
      get_costo_mes: async (req,res) => {
        try {
          const datalineal = await msesion.costo_mes()
          const labels = datalineal.map(d => `${d.mes} ${d.año}`)
          const values = datalineal.map(d=> `${d.costos_mensual}`)
          console.log("Labels generados:", labels);  // ✅ Ver los valores de 'labels'
          console.log("Values generados:", values); 
          res.json({labels,values})
          
        } catch (error) {
          res.status(500).send("Error al obtener datos.");
        }
        
      }
      
}
export default csescion