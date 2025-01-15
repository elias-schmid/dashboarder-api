import { Entity, PrimaryGeneratedColumn, Column, Index, TableInheritance } from "typeorm";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Module {
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