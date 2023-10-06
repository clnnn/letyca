import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  host: string;

  @Column()
  port: number;

  @Column()
  database: string;

  @Column()
  schema: string;

  @Column()
  username: string;

  @Column()
  password: string;
}
