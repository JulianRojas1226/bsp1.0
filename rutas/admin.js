import cadmin from "../controllers/cadmin.js";
import { Router } from "express";
const routes = Router()

routes.get("/admin",cadmin.getadmin)
routes.post("/admin/add_egreso",cadmin.add_egreso)
routes.post("/admin/add_empleado", cadmin.add_empleado)
routes.post("/admin/filtrar_egresos", cadmin.filtrar_egresos)
routes.post("/admin/filtrar_ventas", cadmin.filtrar_ventas)
routes.get("/admin/empleado_duplicado", cadmin.duplicados)
routes.post("/admin/deshabilitar",cadmin.deshabilitar)
routes.post("/admin/filtros",cadmin.filtros)

export default routes