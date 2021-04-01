import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  @Entity()
export class Country {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country: string;

    @CreateDateColumn()
    createdAt: Date;
  
    @CreateDateColumn()
    updatedAt: Date;
}