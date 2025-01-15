import { Column, ChildEntity } from "typeorm";
import { Module } from "./Module"

@ChildEntity()
export class ChartModule extends Module {
    @Column()
    unit!: string;

    @Column({
        type: "float"
    })
    upperBound!: string;

    @Column({
        type: "float"
    })
    lowerBound!: string;
}