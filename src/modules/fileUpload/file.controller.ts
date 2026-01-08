// import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
// import { FileService } from "./file.service";
// import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
// import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';


// @ApiTags('Files')
// @Controller('file')
// export class FileController {
//     constructor(private readonly fileService: FileService) { }

//     @Post('upload') // Endpoint for uploading files
//     @ApiOperation({ summary: 'Upload generic files' })
//     @ApiConsumes('multipart/form-data')
//     @ApiBody({
//       schema: {
//         type: 'object',
//         properties: {
//           files: {
//             type: 'array',
//             items: {
//               type: 'string',
//               format: 'binary',
//             },
//           },
//         },
//       },
//     })
//     @UseInterceptors(FilesInterceptor('files')) // Intercept and handle file uploads
//     async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
//         console.log(files);

//         // Delegate file handling to the FileService
//         return await this.fileService.uploadFile(files);
//     }

//     @Post('iconset')
//     @ApiOperation({ summary: 'Upload icon set' })
//     @ApiConsumes('multipart/form-data')
//     @ApiBody({
//         schema: {
//             type: 'object',
//             properties: {
//                 treeIcon: { type: 'string', format: 'binary' },
//                 mapIcon: { type: 'string', format: 'binary' },
//                 mapIconFilled: { type: 'string', format: 'binary' },
//                 messengerIcon: { type: 'string', format: 'binary' },
//                 avatarIcon: { type: 'string', format: 'binary' },
//             },
//         },
//     })
//     @UseInterceptors(
//         FileFieldsInterceptor([
//             { name: 'treeIcon', maxCount: 1 },
//             { name: 'mapIcon', maxCount: 1 },
//             { name: 'mapIconFilled', maxCount: 1 },
//             { name: 'messengerIcon', maxCount: 1 },
//             { name: 'avatarIcon', maxCount: 1 },
//         ])
//         // FilesInterceptor('treeIcon', 1), // Handle 'treeIcon' field
//         // FilesInterceptor('mapIcon', 1),  // Handle 'mapIcon' field
//         // FilesInterceptor('mapIconFilled', 1),  // Handle 'mapIconFilled' field
//         // FilesInterceptor('messengerIcon', 1),  // Handle 'messengerIcon' field
//         // FilesInterceptor('avatarIcon', 1),  // Handle 'avatarIcon' field
//     )
//     async uploadIconSet(
//         @UploadedFiles() files: any,
//     ) {
//         console.log(files); // Log the uploaded files for debugging

//         // Delegate file handling to the FileService
//         return await this.fileService.uploadedIcon(files);
//     }
// }

import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FileService } from "./file.service";

@ApiTags("Files")
@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post("upload")
  @ApiOperation({ summary: "Upload images or videos" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor("files", 10))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.fileService.uploadFiles(files);
  }
}
