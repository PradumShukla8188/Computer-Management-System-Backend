import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { DatabaseModule } from "../database/database.module";
import { CommonService } from "src/services/common.service";
import { SendmailService } from "src/services/mail.service";
import { SharedModule } from "src/services/shared.module";

@Module({
    imports: [DatabaseModule, SharedModule],
    controllers: [UserController],
    providers: [UserService, CommonService, SendmailService]
})
export class UserModule { }