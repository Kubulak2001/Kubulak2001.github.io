import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import TasksEntity from "./tasks.entity";

@Injectable()
class TasksService {
  constructor(@InjectRepository(TasksEntity) private readonly tasksRepository:Repository<TasksEntity>){}

  findAll(){
    return this.tasksRepository.find();
  }

  findById(id:number){
    return this.tasksRepository.findOne(id);
  }

  save(task:TasksEntity){
    return this.tasksRepository.save(task)
  }

  async create(title:string,date:Date,complete:boolean){
    const newTask = new TasksEntity();
    newTask.complete = complete
    newTask.date = new Date(date);
    newTask.title = title;    
    return await this.save(newTask)    
  }  

  async delete (id:number){
    await this.tasksRepository.delete(id);
  }
}

export default TasksService