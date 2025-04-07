import { Router } from "express";
import csescion from "../controllers/csesion.js";
import cprod from "../controllers/cprod.js";
import cres from "../controllers/cres.js"
const routes = Router()
routes.get("/sesion",csescion.getsesion)
routes.get("/prod",cprod.getprod)
routes.get("/res", cres.getres)

export default routes