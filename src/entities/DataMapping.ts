import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Module } from "./modules/Module";

@Entity()
export class DataMapping {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Module, { cascade: true, eager: true })
    module!: Module

    @Column()
    external!: string;

    @Column()
    internal!: string;
}