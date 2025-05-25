import { Router } from "express";
import cierre from "../controllers/close-sesion.js";

const routes = Router()
routes.get("/logout", cierre.cierre)
export default routes
