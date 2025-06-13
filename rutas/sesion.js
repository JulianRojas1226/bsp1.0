import { Router } from "express";
import csescion from "../controllers/csesion.js";
import cprod from "../controllers/cprod.js";
import cres from "../controllers/cres.js"
import cventas from "../controllers/cventas.js";
import cierre from "../controllers/close-sesion.js";
import cadmin from "../controllers/cadmin.js";

const routes = Router()

routes.get("/calendario", csescion.get_calendar)
routes.get("/graficoventas_diarias", csescion.get_venta_diaria)
routes.get("/grafico_categoria",csescion.get_ventas_categorias)
routes.get("/grafico_anual", csescion.get_ventas_anuales)
// barra de navegacion
routes.get("logout",cierre.cierre)
routes.get("/sesion",csescion.getsesion)
routes.get("/prod",cprod.getprod)
routes.get("/res", cres.getres)
routes.get("/ventas", cventas.getventas)
routes.get("/admin",cadmin.getadmin)
export default routes