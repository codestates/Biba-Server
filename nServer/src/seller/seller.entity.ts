import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  @Entity()
export class Seller {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seller: string;

    @CreateDateColumn()
    createdAt: Date;
  
    @CreateDateColumn()
    updatedAt: Date;
}