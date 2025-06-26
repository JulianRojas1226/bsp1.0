import error from "../middwlare/err.js";
import mprod from "../modulos/mproductos.js"
import { deleteImage } from "../middwlare/multer.js";


const cprod ={
    getprod: async (req,res) => {
      try {
        const {usuario,cargo}=req.session
         // Recoge el filtro desde la URL o usa un string vacío
        const filtro = req.query.filtro ? parseInt(req.query.filtro) : ""; // Convierte a INT si hay filtro
        
        // recoge el de busqueda
        
          const query = req.query.query || ""; // Recoge el término de búsqueda
          
          let productos
  
          if (filtro && query) {
              // Filtra por tipo y busca por nombre
              productos = await mprod.buscarconfiltro({ filtro, query });
          } else if (filtro) {
              // Solo aplica el filtro
              productos = await mprod.filtro({ filtro });
          } else if (query) {
              // Solo busca por nombre
              productos = await mprod.buscar({ query });
          } else {
              // No hay filtro ni búsqueda, muestra todos los productos
              productos = await mprod.mostpod();
          }
  
        const tipos = await mprod.tipo(); // Llamamos al modelo
        const proveedores = await mprod.proveedor()
        
  
        const minimo_cants= await mprod.lowstock()
        res.render("prod", { tipos, proveedores, productos, minimo_cants,usuario,cargo}); // Enviamos los datos a la vista
    } catch (err) {
        console.error("❌ Error en el controlador:", err);
        res.status(500).send("Error al obtener los tipos"); // Enviamos una respuesta de error
    }
  },
  
adddatos: async (req, res) => {
        try {
            // Verificar si se subió archivo
            if (!req.file) {
                return res.status(400).send("❌ No se subió ninguna imagen.");
            }
            
            const { usuario } = req.session;
            const { nombre, cantidad, costo, tipo, proveedor, precio, cantidad_min } = req.body;
            
            // ✅ DATOS DEL ARCHIVO EN CLOUDINARY
            const datosImagen = {
                url: req.file.path,           // URL completa de Cloudinary
                publicId: req.file.public_id, // ID para eliminar después
                filename: req.file.filename,  // Nombre del archivo
                size: req.file.bytes,         // Tamaño en bytes
                format: req.file.format       // Formato (jpg, png, etc.)
            };
            
            // Log para debug
            console.log('📷 IMAGEN SUBIDA A CLOUDINARY:');
            console.log('🔗 URL:', datosImagen.url);
            console.log('🆔 Public ID:', datosImagen.publicId);
            console.log('📏 Tamaño:', (datosImagen.size / 1024).toFixed(2) + ' KB');
            console.log('📋 Formato:', datosImagen.format);
            
            // Guardar en base de datos
            // IMPORTANTE: Ahora 'ruta' será la URL completa de Cloudinary
            const ruta = datosImagen.url;
            
            await mprod.insertdatos({
                ruta,           // URL de Cloudinary
                nombre,
                tipo,
                cantidad,
                costo,
                proveedor,
                precio,
                cantidad_min,
                usuario,
                // Opcional: guardar también el public_id para poder eliminar después
                cloudinary_id: datosImagen.publicId
            });
            
            console.log('✅ Producto guardado exitosamente');
            res.redirect("/prod");
            
        } catch (error) {
            console.error("❌ Error al guardar producto:", error);
            
            // Si hubo error y se subió imagen, eliminarla de Cloudinary
            if (req.file && req.file.public_id) {
                try {
                    await deleteImage(req.file.public_id);
                    console.log('🗑️ Imagen eliminada por error en guardado');
                } catch (deleteError) {
                    console.error('❌ Error al eliminar imagen:', deleteError);
                }
            }
            
            res.status(500).send("❌ Error al guardar el producto.");
        }
    },
  addcantidad: async (req,res)=>{
    try {
      const {usuario}=req.session
      const {producto,cantidad,costo,proveedor}=req.body
      await mprod.cantadd({producto,cantidad,costo,proveedor,usuario})
      res.redirect("/prod"); 
    } catch (err) {
      console.error("❌ Error al guardar los datos:", err);
      res.status(500).send("Error al guardar los datos.");
    }
  },
  addproveedor: async (req,res)=>{
    try {
      const {nid,nombre,celular,correo}=req.body
      await mprod.addproveedor({nid,nombre,celular,correo})
      res.redirect("/prod")
    } catch (err) {
      console.error("❌ Error al guardar los datos:", err);
      res.status(500).send("Error al guardar los datos.");
    }
  },
 eliminarProducto: async (req, res) => {
        try {
            const { id } = req.params;
            
            // El modelo maneja toda la lógica de eliminación
            await mprod.borrar({ id });
            
            console.log('✅ Producto eliminado completamente');
            res.redirect("/prod");
            
        } catch (error) {
            console.error("❌ Error al eliminar producto:", error);
            res.status(500).send("❌ Error al eliminar el producto.");
        }
    },
  actualizar: async(req,res)=>{
    try {
      const {id} = req.params
      const {nombre,cantidad_min,precio,proveedor,tipo}=req.body
      const result = await mprod.actualizar({id,nombre,cantidad_min,precio,proveedor,tipo}) 
      
      res.redirect("/prod")
    } catch (err) {
      console.error("❌ Error en el controlador:", error.message);
        res.status(500).send("Error al actualizar el producto.")
    }
  },
  low_stock: async (req,res) => {
    try {
      const datos = await mprod.lowstock()
      res.json(datos)
    } catch (error) {
      console.error("se ha generado un error: ",error)
    }
    
  },
  notificacion: async (req,res) => {
    try {
      const [datos] = await mprod.not()
      res.json({total: datos.total_not})
    } catch (error) {
      console.error("se ha generado un problema al traer los datos", error)
    }
  },
  get_duplicados: async (req,res) => {
    try {
      const producto = await mprod.duplicados()
      console.log("controlador",producto)
      res.json(producto)
    } catch (error) {
      console.error("no se pudo traer datoas")
    }
  } 
}
export default cprod