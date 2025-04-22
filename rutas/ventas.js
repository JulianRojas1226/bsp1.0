import cventas from "../controllers/cventas.js";
import { Router } from "express";
 const routes = Router()
 routes.get("/", cventas.getventas)
 routes.post("/ingorden/:id", cventas.insorden)
 export default routes
