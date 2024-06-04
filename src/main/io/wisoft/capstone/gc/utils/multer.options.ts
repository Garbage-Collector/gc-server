import * as fs from "node:fs";
import * as path from "node:path";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multer from "multer";

const createFolder = (folder: string): void => {
  try {
    fs.mkdirSync(path.join(__dirname, "..", "uploads"));
  } catch (error) {}

  try {
    fs.mkdirSync(path.join(__dirname, "..", `uploads/${folder}`));
  } catch (error) {}
};

const storage = (folder: string): multer.StorageEngine => {
  createFolder(folder);

  return multer.diskStorage({
    destination(req, file, cb): void {
      const folderName: string = path.join(__dirname, `../uploads/${folder}`);

      cb(null, folderName);
    },

    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      const fileName = `${baseName}${ext}`;
      cb(null, fileName);
    },
  });
};

// const fileFilter = (
//   req: Express.Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback,
// ) => {
//   const allowedFileTypes = /jpeg|jpg|png/;
//   const extName = allowedFileTypes.test(
//     path.extname(file.originalname).toLowerCase(),
//   );
//   const mimeType = allowedFileTypes.test(file.mimetype);
//
//   if (extName && mimeType) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"));
//   }
// };

export const multerOptions = (folder: string) => {
  const result: MulterOptions = {
    storage: storage(folder),
  };

  return result;
};
