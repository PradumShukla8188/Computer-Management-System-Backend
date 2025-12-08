import { Module } from "@nestjs/common";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { DatabaseModule } from "../database/database.module";
import { SharedModule } from "src/services/shared.module";

@Module({
    imports: [DatabaseModule, SharedModule],
    controllers: [RoleController],
    providers: [RoleService],
    exports: []
})
export class RoleModule { }