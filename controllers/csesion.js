         import error from "../middwlare/err.js";
import msesion from "../modulos/msesion.js";
const csescion = {
    getsesion: async (req, res) => {
        try {
          const {cargo,usuario}= req.session
          const ventashoy = await msesion.ventashoy()
           if (ventashoy) {
            ventashoy.total = parseInt(ventashoy.total?.trim() || 0);
            ventashoy.total_pago = parseInt(ventashoy.total_pago?.trim() || 0);
            }
          const promedio = await msesion.ticketPromedio()

          const ventasmeses = await msesion.ventasmes()
          if (ventasmeses) {
            ventasmeses.total = parseInt(ventasmeses.total?.trim() || 0);
            ventasmeses.total_pago = parseInt(ventasmeses.total_pago?.trim() || 0);
            }
          const productosVendidos = await msesion.productosVendidos()
          if (productosVendidos) {
            productosVendidos.total = parseInt(productosVendidos.total?.trim() || 0);
            }
          const lowstocks = await msesion.lowstock()
          
          const topproductos = await msesion.analisisProductos()
          console.log("productos vendidos ",topproductos)
          res.render("sesion",{topproductos,cargo,usuario,ventashoy,ventasmeses,promedio, productosVendidos,lowstocks});  
        } catch (err) {
          error.e500(req, res, err);
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
      get_venta_diaria: async (req,res) => {
        try {
          const data = await msesion.ventasDiarias()
          const labels = data.map(d=>`${d.fecha}`)
          const values_cantidad = data.map(d=>`${d.cantidad_ventas}`)
          const values_ventas = data.map(d =>`${d.total_ventas}`)
          console.log("Labels generados:", labels); 
          console.log("valor de cantidades",values_cantidad)
          console.log("valor ventas",values_ventas)
          res.json({labels,values_cantidad,values_ventas})
        } catch (error) {
          res.status(500).send("error al obtener datos")
        }
      },
      get_ventas_categorias: async (req, res) => {
        try {
          const data = await msesion.ventasPorCategoria()
          const categorias = data.map(d => `${d.categoria}`)
          const cantidades = data.map(d => `${d.cantidad_vendida}`)
          const ingresos = data.map(d => `${d.total_ingresos}`)
          
          console.log("Categorías generadas:", categorias)
          console.log("Cantidades por categoría:", cantidades)
          console.log("Ingresos por categoría:", ingresos)
          
          res.json({ categorias, cantidades, ingresos })
        } catch (error) {
          console.error("Error al obtener datos de categorías:", error)
          res.status(500).send("Error al obtener datos")
        }
      },
      get_ventas_anuales: async (req,res) => {
        try {
          const data = await msesion.comparativoAnual()
          const mes = data.map(d => `${d.mes}`)
          const cantidad = data.map(d =>`${d.cantidad_ventas}`)
          const total = data.map(d =>`${d.total_ventas}`)
          const promedio = data.map(d => `${d.ticket_promedio}`)
          console.log("datos controlador anual ", data)
          res.json({mes,cantidad,total,promedio})
        } catch (error) {
          console.error("no se trajeron los datos", error)
        }
      }
      
}
export default csescion