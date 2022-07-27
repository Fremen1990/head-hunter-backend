import * as path from 'path';
import { diskStorage } from 'multer';
import * as mime from 'mime';

export function storageDir() {
   return path.join(__dirname, '../../storage');
}

export function multerStorage(dest: string) {
   return diskStorage({
      destination: (req, file, cb) => cb(null, dest),
      filename: (req, file, cb) => {
         //---------- Validation for file type-------
         const ext = file.originalname.substring(
            file.originalname.lastIndexOf('.') + 1,
         );

         if (ext.toLowerCase() === 'csv') {
            console.log('Correct extension CSV');
            cb(null, `users-import-temp.${mime.getExtension(file.mimetype)}`);
         } else {
            console.error('Incorrect extension ');
            return { message: 'Invalid file type' };
         }
      },
   });
}
