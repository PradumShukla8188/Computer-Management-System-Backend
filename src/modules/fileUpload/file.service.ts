import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileService {
    constructor(
        private configService: ConfigService
    ) { }

    async uploadFile(files: Express.Multer.File[]) {
        let file = files.map((e) => ({ ...e, path: this.configService.get('BACKEND_URL') + e.path }));

        return file;
    }

    async uploadedIcon(files: {
        treeIcon: Express.Multer.File[], mapIcon: Express.Multer.File[],
        mapIconFilled: Express.Multer.File[], messengerIcon: Express.Multer.File[],
        avatarIcon: Express.Multer.File[],
    }) {
        const getIconUrl = (iconArray: Express.Multer.File[], defaultUrl = "") => {
            return Array.isArray(iconArray) && iconArray.length
                ? this.configService.get('BACKEND_URL') + iconArray[0].path
                : defaultUrl;
        };

        const data = {
            treeIcon: getIconUrl(files?.treeIcon),
            mapIcon: getIconUrl(files?.mapIcon),
            mapIconFilled: getIconUrl(files?.mapIconFilled),
            messengerIcon: getIconUrl(files?.messengerIcon),
            avatarIcon: getIconUrl(files?.avatarIcon),
        };
        return data;
    }
}