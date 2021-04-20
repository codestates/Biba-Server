import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BeerTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag_id: number;

  @Column()
  beer_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
