import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ThrottlerGuard } from '@nestjs/throttler';
// import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './modules/database/database.module';
import { Seeder } from './modules/seeder/all.seeder';
import { RoleSeeder } from './modules/seeder/role.seeder';
import { AdminSeeder } from './modules/seeder/admin.seeder';
import { TemplateSeederService } from './modules/seeder/template.seeder';
import { CountrySeeder } from './modules/seeder/country-state.seeder';
import { FileModule } from './modules/fileUpload/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { cModules } from './modules';
import { Configurations } from './modules/configurations/configuration.module';
import { CourseSeeder } from './modules/seeder/course.seed';
@Module({
  imports: [
    ...Configurations,
    DatabaseModule,
    ...cModules,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to the directory where your files are stored
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false, // Disable directory listing

        setHeaders: (res, path, stat) => {
          // console.log('Serving static file:', path);
          res.set('Access-Control-Allow-Origin', '*');
          res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.set('Access-Control-Allow-Headers', '*');
          res.set('Access-Control-Allow-Credentials', 'false');
          res.set('Access-Control-Max-Age', '86400');
          res.set('Cross-Origin-Resource-Policy', 'cross-origin');
          res.set('Content-Security-Policy', "default-src *; img-src * data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'");

        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Seeder,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    RoleSeeder,
    AdminSeeder,
    TemplateSeederService,
    CountrySeeder,
    CourseSeeder,
  ],
})
export class AppModule {
  constructor(
    private seedService: Seeder
  ) { }

  onModuleInit() {
    // this.seedService.init();
  }
}
