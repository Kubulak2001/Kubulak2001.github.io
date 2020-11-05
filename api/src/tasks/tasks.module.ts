import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from '@nestjs/common';

import TasksController from "./tasks.controller";
import TasksService from "./tasks.service";
import TasksEntity from "./tasks.entity"

@Module({    
    imports:[TypeOrmModule.forFeature([TasksEntity])],
    controllers:[TasksController],
    providers:[TasksService]    
})
class TasksModule{}

export default TasksModule;