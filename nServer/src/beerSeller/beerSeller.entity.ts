import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BeerSeller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  beer_id: number;

  @Column()
  seller_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
