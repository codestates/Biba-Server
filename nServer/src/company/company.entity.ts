import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  @Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    company: string;

    @Column()
    company_kr: string;

    @CreateDateColumn()
    createdAt: Date;
  
    @CreateDateColumn()
    updatedAt: Date;
}