import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Style {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  style_name: string;

  @Column()
  style_name_kr: string;

  @Column()
  explain: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
