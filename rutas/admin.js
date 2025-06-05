import cadmin from "../controllers/cadmin.js";
import { Router } from "express";
const routes = Router()

routes.get("/admin",cadmin.getadmin)

export default routes