import { Provider } from "@nestjs/common";
import * as cloudinary from "cloudinary"
export const cloudinaryInject = "CLOUDINARY";
// cloudinary.v2.uploader.upload()
// cloudinary.v2.config

// se podria hacer esto con mas packetes, pero algunos no requieren configuracion
export const CloudinaryCustom: Provider = {
    provide: cloudinaryInject,
    useValue: cloudinary
}