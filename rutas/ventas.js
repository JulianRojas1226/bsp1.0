import cventas from "../controllers/cventas.js";
import cres from "../controllers/cres.js";
import cprod from "../controllers/cprod.js";
import csescion from "../controllers/csesion.js";
import { Router } from "express";
import cierre from "../controllers/close-sesion.js";
import cadmin from "../controllers/cadmin.js";

 const routes = Router()

 routes.post("/ingorden/:id", cventas.insorden)
 routes.post("/eliminar-orden/:id", cventas.eliminarorden)
 routes.post("/pagar/:mesa", cventas.pagar)
 routes.post("/ventas/duplicar/:id", cventas.duplicar)
 routes.get("/ventas/pdf",cventas.generarpdf)
 routes.get("/logout",cierre.cierre)
//  barrra navegacion 
 routes.get("/ventas", cventas.getventas)
 routes.get("/res", cres.getres)
 routes.get("/prod", cprod.getprod)
 routes.get("/sesion", csescion.getsesion)
routes.get("/admin",cadmin.getadmin)

 export default routes
