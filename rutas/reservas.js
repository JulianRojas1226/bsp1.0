import { Router } from "express";
import cres from "../controllers/cres.js";
const routes = Router()

routes.get("/res", cres.getres)
routes.post("/addres", cres.insertdatos)
routes.get("/fechas-reservadas",  cres.getFechasReservadas)
routes.post("/borrar/:id", cres.borrar)
routes.post("/actualizar/:id", cres.actualizar)
export default routes