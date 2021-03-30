import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BeerModule } from './beer/beer.module';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, BeerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
