import cadmin from "../controllers/cadmin.js";
import { Router } from "express";
const routes = Router()

routes.get("/admin",cadmin.getadmin)
routes.post("/admin/add_egreso",cadmin.add_egreso)
routes.post("/admin/add_empleado", cadmin.add_empleado)
routes.post("/admin/filtrar_egresos", cadmin.filtrar_egresos)

export default routes