import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// ================================
// 1. CONFIGURACIÓN CLOUDINARY
// ================================
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ================================
// 2. CONFIGURACIÓN STORAGE
// ================================
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'productos', // Carpeta en Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        
        // Transformaciones automáticas
        transformation: [
            { 
                width: 800, 
                height: 600, 
                crop: 'limit',        // No recorta, solo limita el tamaño
                quality: 'auto',      // Optimización automática
                fetch_format: 'auto'  // Formato automático (WebP si es compatible)
            }
        ],
        
        // Nombre personalizado del archivo
        public_id: (req, file) => {
            const timestamp = Date.now();
            const originalName = file.originalname.split('.')[0];
            return `producto-${timestamp}-${originalName}`;
        }
    }
});

// ================================
// 3. FILTRO DE ARCHIVOS
// ================================
const fileFilter = (req, file, cb) => {
    console.log('📁 Archivo recibido:', file.originalname);
    console.log('🔍 Tipo MIME:', file.mimetype);
    
    if (file.mimetype.startsWith('image/')) {
        console.log('✅ Archivo de imagen válido');
        cb(null, true);
    } else {
        console.log('❌ Archivo no válido - solo imágenes');
        cb(new Error('Solo se permiten archivos de imagen'), false);
    }
};

// ================================
// 4. CONFIGURACIÓN MULTER
// ================================
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB máximo
        files: 1 // Solo 1 archivo por vez
    }
});

// ================================
// 5. MIDDLEWARE DE MANEJO DE ERRORES
// ================================
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'El archivo es demasiado grande. Máximo 10MB.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: 'Solo se permite subir un archivo por vez.'
            });
        }
    }
    
    if (err.message === 'Solo se permiten archivos de imagen') {
        return res.status(400).json({
            error: 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP).'
        });
    }
    
    console.error('❌ Error en upload:', err);
    return res.status(500).json({
        error: 'Error interno del servidor al subir archivo.'
    });
};

// ================================
// 6. FUNCIÓN PARA ELIMINAR IMAGEN
// ================================
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('🗑️ Imagen eliminada de Cloudinary:', result);
        return result;
    } catch (error) {
        console.error('❌ Error al eliminar imagen:', error);
        throw error;
    }
};

// ================================
// 7. EXPORTAR TODO
// ================================
export { 
    upload, 
    handleUploadError, 
    deleteImage, 
    cloudinary 
};