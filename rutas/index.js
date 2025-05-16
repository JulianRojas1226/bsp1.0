import { Router } from "express";
import cindex from "../controllers/cindex.js";
import clogin from "../controllers/logincontrollers.js";
const routes=Router()
routes.get("/", cindex.get_index)
routes.get("/login", clogin.getlogin)
routes.get("/fechas-reservadas", cindex.getFechasReservadas)
routes.post("/addres", cindex.insertdatos)
export default routes
