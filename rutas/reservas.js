import { Router } from "express";
import cres from "../controllers/cres.js";
const routes = Router()

routes.get("/res", cres.getres)
routes.post("/addres", cres.insertdatos)

export default routes