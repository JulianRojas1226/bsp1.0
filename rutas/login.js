import { Router } from "express";
import clogin from "../controllers/logincontrollers.js";

const routes = Router()

routes.get("/login",clogin.getlogin)
routes.post("/login/autenticacion",clogin.autenticacion)
routes.post("/registro",clogin.Registro)

export default routes