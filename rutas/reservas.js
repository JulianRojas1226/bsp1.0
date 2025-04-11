import { Router } from "express";
import cres from "../controllers/cres.js";
const routes = Router()

routes.get("/res", cres.getres)
routes.post("/addres", cres.insertdatos)
routes.get("/fechas-reservadas",  cres.getFechasReservadas)


export default routes