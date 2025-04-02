import { Router } from "express";
import csescion from "../controllers/csesion.js";
import cprod from "../controllers/cprod.js";
const routes = Router()
routes.get("/sesion",csescion.getsesion)
routes.get("/prod",cprod.getprod)

export default routes