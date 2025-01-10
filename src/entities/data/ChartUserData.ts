import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ChartModule } from "../modules/ChartModule";

@Entity()
export class ChartUserData {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => ChartModule)
    chartModule!: ChartModule

    @Column({
        type: "float"
    })
    value!: string;

    @Column({
        type: "timestamp"
    })
    timestamp!: string;
}