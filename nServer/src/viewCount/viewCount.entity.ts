import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class ViewCount {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    user_id: number;
  
    @Column()
    beer_id: number;
  
    @Column()
    count: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @CreateDateColumn()
    updatedAt: Date;
  }
  