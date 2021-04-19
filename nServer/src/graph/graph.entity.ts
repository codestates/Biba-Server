import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Graph {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sparkling: number;

  @Column()
  sweet: number;

  @Column()
  accessibility: number;

  @Column()
  body: number;

  @Column()
  beer_id: number;

  @Column()
  bitter: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
