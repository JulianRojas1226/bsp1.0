import { Router } from "express";
import clogin from "../controllers/logincontrollers.js";
import ccodigo from "../controllers/cambiocodigo.js";

const routes = Router()

routes.get("/login",clogin.getlogin)
routes.post("/login/autenticacion",clogin.autenticacion)
routes.post("/registro",clogin.Registro)
routes.get("/solicitud", ccodigo.ir_a_solicitud)

export default routes