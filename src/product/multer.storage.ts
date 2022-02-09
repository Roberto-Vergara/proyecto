import * as multer from 'multer';

export const storage = multer.diskStorage({
    destination: "./src/img",
    filename: (req, file, cb) => { cb(null, `${file.fieldname}${Date.now()}.${file.mimetype.split("/")[1]}`) }
})