import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { DevicesModule } from './devices/devices.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": process.env.DB_HOST || "localhost",
      "port": parseInt(process.env.DB_PORT) || 3306,
      "username": process.env.DB_USER || "root",
      "password": process.env.DB_PASSWORD || "",
      "database": process.env.DB_NAME || "iot",
      "entities": ["dist/**/*.entity{.ts,.js}"],
      "synchronize": true,
      "logging": true,
      "logger": "file"
}),
    GroupsModule,
    DevicesModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
