import express from "express"
import session from "express-session"
import path from "path"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import {autenticado}  from "./middwlare/auth.js"
import error from "./middwlare/err.js";
import routesindex from "./rutas/index.js";
import routeslogin   from "./rutas/login.js";
import routessesion from "./rutas/sesion.js"
import routesproductos from "./rutas/productos.js";
import routesreservas from "./rutas/reservas.js"
import routesventas from "./rutas/ventas.js";
import routescerrar from "./rutas/cerrar-sesion.js"

const __dirname = process.cwd()
const app = express()
const port = 3000
app.use(cors())
app.use(
   helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com",
          "https://fonts.googleapis.com",
          "'unsafe-inline'",
        ],
        fontSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com", // ✅ Agregado para permitir las fuentes
           "https://fonts.gstatic.com",
          "data:",
        ],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com",
          "'unsafe-inline'",
          "'unsafe-eval'",
        ],
      },
    },
  })
)
app.use(morgan("dev"))

app.use("/node_modules", express.static("node_modules"));
app.set("views",path.join(__dirname,"views"))
app.set("view engine","pug")

app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: "mi-secreto",
    resave: true,
    saveUninitialized: true,
}))
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    next();
})
app.use(routesindex)
app.use(routeslogin)
app.use(autenticado,routessesion)
app.use(routesreservas)
app.use(routesproductos)
app.use(routesventas)
app.use(routescerrar)
app.use(error.e404);

app.listen(port,()=> {console.log(`la aplicacion esta funcionando en http://localhost:${port}`)})