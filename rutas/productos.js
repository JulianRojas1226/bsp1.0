
import { Router } from "express";
import actualizar from "../middwlare/multer.js";
import cprod from "../controllers/cprod.js";
import cres from "../controllers/cres.js";
import cventas from "../controllers/cventas.js";
import csescion from "../controllers/csesion.js";   
import cierre from "../controllers/close-sesion.js";
const routes = Router()

routes.get("/prod", cprod.getprod)
routes.get("/res", cres.getres)
routes.get("/ventas", cventas.getventas)
routes.get("/sesion", csescion.getsesion)
routes.get("logout", cierre.cierre)
routes.post("/formprod", actualizar.single("imagen"), cprod.adddatos)
routes.post("/cantprod", cprod.addcantidad)
routes.post("/addproveedor", cprod.addproveedor)
routes.post("/eliminar/:id", cprod.borrarprod)
routes.post("/actualizarprod/:id", cprod.actualizar)


export default routes