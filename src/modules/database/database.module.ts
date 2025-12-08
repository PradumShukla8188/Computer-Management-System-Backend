import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/models";

@Module({
    imports: [
        MongooseModule.forFeature(Models)
    ],
    exports: [
        MongooseModule.forFeature(Models)
    ]
})
export class DatabaseModule { }