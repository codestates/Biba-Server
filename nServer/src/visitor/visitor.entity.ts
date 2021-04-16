import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class Visitor {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    todayVisit: number;
  
    @Column()
    totalVisit: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @CreateDateColumn()
    updatedAt: Date;
  }
  