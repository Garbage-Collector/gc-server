import * as fs from "node:fs";
import * as path from "node:path";
import * as util from "node:util";

const copyFile = util.promisify(fs.copyFile);

export async function copyToSrcUpload(fileName: string): Promise<void> {
  const srcPath: string = path.join(
    __dirname,
    `../../dist/uploads/images/${fileName}`,
  );
  const destPath: string = path.join(
    __dirname,
    `../../src/main/io/wisoft/capstone/gc/uploads/images/${fileName}`,
  );

  try {
    await copyFile(srcPath, destPath);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
