import { Router } from "express";
import ccodigo from "../controllers/cambiocodigo.js";

const routes = Router()

routes.get("/solicitud", ccodigo.ir_a_solicitud)
routes.post("/solicitud", ccodigo.buscarcorreo)
routes.get("/reset-password", ccodigo.get_cambio_codigo)
routes.post("/reset-password", ccodigo.cambiarcontraseña)
export default routes 