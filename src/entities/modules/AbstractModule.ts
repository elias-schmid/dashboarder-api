import { PrimaryGeneratedColumn, Column, Index } from "typeorm";

export abstract class AbstractModule {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column()
    @Index({ unique: true })
    endpoint!: string;

    @Column()
    enabled!: boolean;
}