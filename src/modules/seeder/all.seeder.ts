import { Injectable } from "@nestjs/common";
import { RoleSeeder } from "./role.seeder";
import { AdminSeeder } from "./admin.seeder";
import { TemplateSeederService } from "./template.seeder";
import { CountrySeeder } from "./country-state.seeder";
import { CourseSeeder } from "./course.seed";
import { StudentSeeder } from "./student.seeder";

@Injectable()
export class Seeder {

    constructor(
        private roleService: RoleSeeder,
        private adminService: AdminSeeder,
        private templateService: TemplateSeederService,
        private countryService: CountrySeeder,
        private courseSeeder: CourseSeeder,
        private studentSeeder: StudentSeeder,

    ) { }

    async init() {
        console.log("Seeding Started");

        await this.courseSeeder.init();

        await this.roleService.init();

        console.log("Admin Seeding Started");

        await this.adminService.init();
        console.log("Template Seeding Started");

        await this.templateService.init();
        console.log("Country Seeding Started");

        await this.countryService.init();

        await this.studentSeeder.init();


        console.log("Seeding Done");
    }
}