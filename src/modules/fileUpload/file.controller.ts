import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";


@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Post('upload') // Endpoint for uploading files
    @UseInterceptors(FilesInterceptor('files')) // Intercept and handle file uploads
    async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
        console.log(files);

        // Delegate file handling to the FileService
        return await this.fileService.uploadFile(files);
    }

    @Post('iconset')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'treeIcon', maxCount: 1 },
            { name: 'mapIcon', maxCount: 1 },
            { name: 'mapIconFilled', maxCount: 1 },
            { name: 'messengerIcon', maxCount: 1 },
            { name: 'avatarIcon', maxCount: 1 },
        ])
        // FilesInterceptor('treeIcon', 1), // Handle 'treeIcon' field
        // FilesInterceptor('mapIcon', 1),  // Handle 'mapIcon' field
        // FilesInterceptor('mapIconFilled', 1),  // Handle 'mapIconFilled' field
        // FilesInterceptor('messengerIcon', 1),  // Handle 'messengerIcon' field
        // FilesInterceptor('avatarIcon', 1),  // Handle 'avatarIcon' field
    )
    async uploadIconSet(
        @UploadedFiles() files: any,
    ) {
        console.log(files); // Log the uploaded files for debugging

        // Delegate file handling to the FileService
        return await this.fileService.uploadedIcon(files);
    }
}