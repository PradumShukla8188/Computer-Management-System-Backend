// import { Module } from "@nestjs/common";
// import { MulterModule } from '@nestjs/platform-express';
// import { FileController } from "./file.controller";
// import { FileService } from "./file.service";
// import { diskStorage } from 'multer';
// import * as path from 'path'

// @Module({
//     imports: [
//         MulterModule.register(
//             {
//                 storage: diskStorage({
//                     destination: './uploads',
//                     filename: (req, file, cb) => {
//                         const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
//                         const filename = fileNameWithoutExt + Date.now() + path.extname(file.originalname);
//                         cb(null, filename);
//                     },
//                 }),
//                 fileFilter: (req, file, cb) => {
//                     // Use custom validation for file size
//                     const maxFileSize = 15000000; // 15MB size limit
//                     const fileTypeRegex = /\.(png|jpeg|jpg|svg|pdf)$/i; // Allowed file types (png, jpeg, jpg)

//                     if (file.size > maxFileSize) {
//                         return cb(new Error('File size exceeds 15MB'), false);
//                     }

//                     if (!fileTypeRegex.test(file.originalname)) {
//                         return cb(new Error('Invalid file type. Only PNG, JPEG, and JPG are allowed'), false);

//                     }

//                     // File passed all checks, proceed with upload
//                     cb(null, true);
//                 },
//             },

//         ), // Configure file storage location
//     ],
//     controllers: [FileController],
//     providers: [FileService],
//     exports: [FileService],
// })
// export class FileModule { }

import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { diskStorage } from "multer";
import * as fs from "fs";
import * as path from "path";

const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: uploadPath,
                filename: (req, file, cb) => {
                    const name = path.parse(file.originalname).name
                        .replace(/\s+/g, "_")
                        .toLowerCase();
                    const ext = path.extname(file.originalname);
                    cb(null, `${name}-${Date.now()}${ext}`);
                },
            }),
            limits: {
                fileSize: 50 * 1024 * 1024, // 50MB
            },
            fileFilter: (req, file, cb) => {
                const allowedTypes =
                    /\/(jpg|jpeg|png|svg|gif|mp4|mov|avi|mkv|webm)$/;

                if (!allowedTypes.test(file.mimetype)) {
                    return cb(
                        new Error("Only images and videos are allowed"),
                        false,
                    );
                }
                cb(null, true);
            },
        }),
    ],
    controllers: [FileController],
    providers: [FileService],
    exports: [FileService],
})
export class FileModule { }
