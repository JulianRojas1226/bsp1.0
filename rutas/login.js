import { Router } from "express";
import clogin from "../controllers/logincontrollers.js";

const routes = Router()

routes.get("/",clogin.getlogin)
routes.post("/",clogin.autenticacion)
routes.post("/registro",clogin.Registro)

export default routes