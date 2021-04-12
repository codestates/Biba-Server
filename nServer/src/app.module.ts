import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BeerModule } from './beer/beer.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CommentModule } from './comment/comment.module';
import { CompanyModule } from './company/company.module';
import { CountryModule } from './country/country.module';
import { SellerModule } from './seller/seller.module';
import { StyleModule } from './style/style.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { ViewCountModule } from './viewCount/viewCount.module';
import { VisitorModule } from './visitor/visitor.module';

// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ 
    BeerModule, 
    BookmarkModule,  
    CommentModule, 
    CompanyModule, 
    CountryModule, 
    SellerModule, 
    StyleModule, 
    TagModule,
    UserModule, 
    ViewCountModule,
    VisitorModule  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
