import { Router } from "express";
import csescion from "../controllers/csesion.js";
import cprod from "../controllers/cprod.js";
import cres from "../controllers/cres.js"
import cventas from "../controllers/cventas.js";
import cierre from "../controllers/close-sesion.js";
const routes = Router()

routes.get("/graficobarras", csescion.get_graficos_mes)
routes.get("/graficolineal", csescion.get_lineal)
routes.get("/calendario", csescion.get_calendar)
routes.get("/grafico-costo", csescion.get_costo_mes)
// barra de navegacion
routes.get("logout",cierre.cierre)
routes.get("/sesion",csescion.getsesion)
routes.get("/prod",cprod.getprod)
routes.get("/res", cres.getres)
routes.get("/ventas", cventas.getventas)
export default routes