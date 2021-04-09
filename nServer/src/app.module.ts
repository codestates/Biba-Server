import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BeerModule } from './beer/beer.module';
import { CommentModule } from './comment/comment.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { StyleModule } from './style/style.module';

// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, BeerModule, CommentModule, BookmarkModule, StyleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
