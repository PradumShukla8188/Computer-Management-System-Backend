import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
// import { MulterExceptionFilter } from './services/error.multer';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();




async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //swager
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Computer Management System')
    .setDescription('')
    .setVersion('1.0')

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // app.useGlobalFilters(new MulterExceptionFilter());
  //validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      function getErrorMessage(errors: ValidationError[]): string[] {
        let constraints: string[] = [];
        try {

          let error = errors[0];
          if (error.constraints) {
            const constraintValues = Object.values(error.constraints);
            constraints.push(...constraintValues);
          }

          if (error.children) {
            const childConstraints = getErrorMessage(error.children);
            constraints.push(...childConstraints);
          }
          return constraints;
        } catch (error) {
          return constraints;
        }

      }
      let errorMsg = "Something went wrong.";
      let errors = getErrorMessage(validationErrors);
      if (errors.length) {
        errorMsg = errors[0];
      }
      return new BadRequestException(errorMsg);
    },
  }));
  app.use(helmet());
  app.enableCors({
    origin: '*'
  });
  await app.listen(3015);
}
bootstrap();
