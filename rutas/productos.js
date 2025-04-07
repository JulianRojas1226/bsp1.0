
import { Router } from "express";
import actualizar from "../middwlare/multer.js";
import cprod from "../controllers/cprod.js";
const routes = Router()

routes.get("/prod", cprod.getprod)
routes.post("/formprod", actualizar.single("imagen"), cprod.adddatos)
routes.post("/cantprod", cprod.addcantidad)
routes.post("/addproveedor", cprod.addproveedor)
routes.post("/borrar/:id", cprod.borrarprod)
routes.post("/actualizarprod/:id", cprod.actualizar)


export default routes