import { Controller, Get, Post, Body, Delete, Param, Put, BadRequestException } from '@nestjs/common';
import TasksService from './tasks.service';
import TasksEnttiy from "./tasks.entity";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()  
  findAll(){
    return this.tasksService.findAll();
  }

  @Post()
  async create(@Body() task:TasksEnttiy){
      return await this.tasksService.create(task.title,task.date,task.complete);
  }

  @Put(":id")
  async update(@Param("id") id:number, @Body() task:TasksEnttiy){
      const dbTask = await this.tasksService.findById(id);
      if(!dbTask)throw new BadRequestException();      
      if(task.complete !== undefined){
        dbTask.complete = task.complete;
      }
      if(task.date){
        dbTask.date = task.date;
      }
      if(task.title){
        dbTask.title = task.title;
      }      
      return await this.tasksService.save(dbTask);
  }

  @Delete(":id")
  async delete(@Param("id") id:number){
      await this.tasksService.delete(id);
      return true;
  }
}  

export default TasksController
