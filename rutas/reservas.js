import { Router } from "express";
import cres from "../controllers/cres.js";
import cprod from "../controllers/cprod.js";
import cventas from "../controllers/cventas.js";
import csescion from "../controllers/csesion.js";

const routes = Router()
// barra nav
routes.get("/res", cres.getres)
routes.get("/ventas", cventas.getventas)
routes.get("/prod", cprod.getprod)
routes.get("/sesion", csescion.getsesion)
// procesos
routes.post("/addres", cres.insertdatos)
routes.get("/fechas-reservadas",  cres.getFechasReservadas)
routes.post("/borrar/:id", cres.borrar)
routes.post("/actualizar/:id", cres.actualizar)
export default routes