
import { Router } from "express";
import actualizar from "../middwlare/multer.js";
import cprod from "../controllers/cprod.js";
const routes = Router()

routes.get("/",cprod.getprod)
routes.post("/formprod", actualizar.single("imagen"), cprod.adddatos)
routes.post("/cantprod", cprod.addcantidad)



export default routes