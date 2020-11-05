import {Entity,PrimaryGeneratedColumn,Column} from "typeorm";

@Entity()
class TasksEntity{
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    title:string

    @Column()
    date:Date

    @Column()
    complete:boolean
}

export default TasksEntity;