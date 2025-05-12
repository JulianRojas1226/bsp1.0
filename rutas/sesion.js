import { Router } from "express";
import csescion from "../controllers/csesion.js";
import cprod from "../controllers/cprod.js";
import cres from "../controllers/cres.js"
import cventas from "../controllers/cventas.js";
const routes = Router()
routes.get("/graficopie", csescion.getgraficopie)
// barra de navegacion
routes.get("/sesion",csescion.getsesion)
routes.get("/prod",cprod.getprod)
routes.get("/res", cres.getres)
routes.get("/ventas", cventas.getventas)
export default routes