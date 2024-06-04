import * as multer from "multer";

import * as path from "node:path";

import * as fs from "node:fs";

import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

const createFolder = (folder: string) => {
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
    destination(req, file, cb) {
      //* 어디에 저장할 지
      // 지금 밑에 있는건 dist 파일에 저장을 하는 것
      // const folderName = path.join(__dirname, '..', `uploads/${folder}`);
      const folderName = path.join(__dirname, `../uploads/uploads/${folder}`);

      // 이건 내 로컬에 저장을 하는 것
      const local = path.join(__dirname, "../..", `src/uploads/${folder}`);

      cb(null, folderName);
      cb(null, local);
    },

    filename(req, file, cb) {
      //* 어떤 이름으로 올릴 지
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);

      // const fileName = `${path.basename(
      //     file.originalname, ext,
      // )}${Date.now()}${ext}`;
      const fileName = `${baseName}${ext}`;

      cb(null, fileName);
    },
  });
};

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extName = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimeType = allowedFileTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"), false);
  }
};

export const multerOptions = (folder: string) => {
  const result: MulterOptions = {
    storage: storage(folder),
    fileFilter: fileFilter,
  };

  return result;
};
