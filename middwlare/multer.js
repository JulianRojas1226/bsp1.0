
import { fileURLToPath } from "url";
import multer from "multer";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const almacenamiento = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, "../public/productos/"))
    },
    filename: (req, file, cb)=>{
        const uniqueName = `${Date.now()}-${file.originalname}`
        cb(null,uniqueName)
    },
})

const filefilter = (req, file, cb)=>{
    if(file.mimetype.startWith("image/")){
        cb(null,true)
    }else{
        cb(new Error("solo se permiten imagenes. "), false)
    }
}
const actualizar = multer({storage: almacenamiento, filefilter })
export default actualizar