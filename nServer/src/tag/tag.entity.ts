import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class Tag {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    tag_name: string;
  
    @Column()
    count: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @CreateDateColumn()
    updatedAt: Date;
  }
  