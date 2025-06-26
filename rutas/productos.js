
import { Router } from "express";
import { upload, handleUploadError, deleteImage } from '../middwlare/multer.js';
import cprod from "../controllers/cprod.js";
import cres from "../controllers/cres.js";
import cventas from "../controllers/cventas.js";
import csescion from "../controllers/csesion.js";   
import cierre from "../controllers/close-sesion.js";
import cadmin from "../controllers/cadmin.js";
const routes = Router()
// barra navegacion
routes.get("/prod", cprod.getprod)
routes.get("/res", cres.getres)
routes.get("/ventas", cventas.getventas)
routes.get("/sesion", csescion.getsesion)
routes.get("/admin",cadmin.getadmin)
routes.get("logout", cierre.cierre)
// funcionalidad prod
routes.post("/formprod", upload.single("imagen"), cprod.adddatos)
routes.post("/cantprod", cprod.addcantidad)
routes.post("/addproveedor", cprod.addproveedor)
routes.post("/eliminar/:id", cprod.eliminarProducto)
routes.post("/actualizarprod/:id", cprod.actualizar)
routes.get("/lowstock", cprod.low_stock)
routes.get("/notificacion",cprod.notificacion)
routes.get("/producto_duplicado",cprod.get_duplicados)


export default routes