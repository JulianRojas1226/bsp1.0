import { Router } from "express";
import cpdf from "../controllers/cpdf.js";

const routes = Router()
routes.get("/pdf", cpdf.get_pdf)
routes.get("/pdf/grafico_categoria", cpdf.get_ventas_categorias)
routes.get("/pdf/graficoventas_diarias", cpdf.get_venta_diaria)
routes.get("/pdf/grafico_anual", cpdf.get_ventas_anuales)
routes.get("/pdf/generar", cpdf.generarPdf)
export default routes