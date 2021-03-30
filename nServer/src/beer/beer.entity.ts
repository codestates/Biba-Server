import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Beer {
  @PrimaryGeneratedColumn()
  beer_name: string;

  @Column()
  beer_name_en: string;

  @Column()
  search_word: string;

  @Column()
  beer_img: string;

  @Column()
  abv: number;

  @Column()
  ibu: number;

  @Column()
  style_id: number;

  @Column()
  company_id: number;

  @Column()
  country_id: number;

  @Column()
  rate: number;

  @Column()
  story: string;

  @Column()
  explain: string;

  @Column()
  source: string;

  @Column()
  poster: string;

  @Column()
  mobile: string;

  @Column()
  show_poster: number;

  @Column()
  recommend: number;
}
