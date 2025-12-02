import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';

export const Configurations = [
    //MongoDB
    MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
            dbName: configService.get<string>('DATABASE_NAME'),
            uri: configService.get<string>('DATABASE_URL'),
            onConnectionCreate: () => {
                console.log("Connected to Database", configService.get<string>('DATABASE_NAME'));
            }
        }),

        inject: [ConfigService]

    }),
    ConfigModule.forRoot({
        isGlobal: true
    }),

    //JWT 
    JwtModule.registerAsync({
        imports: [ConfigModule],
        global: true,
        useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '10hr' }
        }),
        inject: [ConfigService]
    }),

    // ThrottlerModule.forRoot([{
    //     ttl: 60000,
    //     limit: 10,
    // }]),

    //NodeMailer
    MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
            transport: {
                host: configService.get<string>('SMTP_HOST'),
                port: 587,
                secure: false,
                auth: {
                    user: configService.get<string>('SMTP_USER'),
                    pass: configService.get<string>('SMTP_PASSWORD'),
                },
            }
        }),
        inject: [ConfigService]
    }),

    CacheModule.register({
        isGlobal: true
    }),

    HttpModule
]