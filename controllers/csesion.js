import error from "../middwlare/err.js";
import msesion from "../modulos/msesion.js";
const csescion = {
    getsesion: async (req, res) => {
        try {
          res.render("sesion");  
        } catch (err) {
          error.e500(req, res, err);
        }
      },
      getgraficopie: async (req,res) => {
        try {
          const datospie = await msesion.grafico_masvendidos()
          const labels = datospie.map(d => d.producto)
          const values = datospie.map(d => d.total_vendido)
          res.json({labels,values})
        } catch (error) {
          res.status(500).send("Error al obtener datos.");
        }
      }
}
export default csescion