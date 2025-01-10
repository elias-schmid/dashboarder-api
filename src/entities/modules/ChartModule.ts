import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AbstractModule } from "./AbstractModule"

@Entity()
export class ChartModule extends AbstractModule {
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