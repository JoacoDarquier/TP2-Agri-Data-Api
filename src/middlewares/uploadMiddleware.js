import multer from 'multer';


const storage = multer.memoryStorage()

export const allowUpload = multer({storage}).single('image')

export const allowMultipleUpload = multer({storage}).array('images', 5)