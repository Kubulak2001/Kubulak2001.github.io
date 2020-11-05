<template>
    <div>
        <input type="text" class="todo-input" placeholder="Add task" v-model="addTask">
        <input type="datetime-local" class="todo-input" placeholder="Add date" v-model="addDate">
        <input type="button" v-on:click="addTodo" class="todo-input" value="Add"><hr>
        <div v-for="(task) in tasksFilter" :key="task.id" class="todo-items">
            <div class="task-items-left">
                <input type="checkbox" :checked="task.complete" @change="completed(task.id)">
                <div class="taks-data">
                    <div v-if="!task.edit" @dblclick="editToDo(task)" class="task-items-label" :class="{ complete : task.complete }">{{ task.title }}</div>
                    <input v-else class="task-items-edit" type="text" v-model="task.title" @blur="doneEditToDo(todo)" @keyup.enter="doneEditToDo(todo)" @keyup.esc="cancelEditToDo(todo)" v-focus>        
                    <div class="task-items-time">{{`${task.date.getDate()}. ${task.date.getMonth() + 1}. ${task.date.getFullYear()} ${task.date.getHours()}:${task.date.getMinutes()}`}}</div>
                </div> 
            </div>
            <div class="remove-task" @click="removeToDo(task.id)">
                <input type="button" class="remove-task-button" value="Remove">   
            </div>          
        </div> 
            <div class="extra-container">
                <div><label><input type="checkbox" :checked="!anyRemaining" @change="checkAll">Check all</label></div>
                <div>{{ remaining }} Overall tasks</div>
            </div>
            <div class="extra-container">
                <div>
                    <button class="filter-task-button" :class="{ active: filter == 'all' }" @click="filter = 'all'">All</button>
                    <button class="filter-task-button" :class="{ active: filter == 'active' }" @click="filter = 'active'">Active</button>
                    <button class="filter-task-button" :class="{ active: filter == 'complete' }" @click="filter = 'complete'">Completed</button>
                </div>
                <div>
                    <button class="filter-task-button" v-if="showclearCompletly" @click="clearCompletly">Clear completed</button> 
                </div>
            </div>            
    </div>
</template>

<script>
const apiURL = "http://localhost:4000";

export default {
    name: 'todo-list',
    data () {
        return {
            addTask: '',
            addDate: null,
            beforeEdit: '',
            filter: 'all',
            fetched: false,
            tasks: []
        }
    },
    computed: {
        remaining() {
            return this.tasks.filter(task => !task.complete).length
        },        
        anyRemaining() {
            return this.remaining != 0
        },
        tasksFilter() {
      if (this.filter == 'all') {
        return this.tasks
      }else if (this.filter == 'active') {
        return this.tasks.filter(task => !task.complete)
      }else if (this.filter == 'complete') {
        return this.tasks.filter(task => task.complete)
      }
      return this.tasks
        },
        showclearCompletly() {
            return this.tasks.filter(task => task.complete).length > 0
        }
    },
    directives: {
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    },
    methods: {
        addTodo() {
            if(this.addTask.trim().length == 0) {
                return
            }
            
            customFetch("tasks","POST",{
                title: this.addTask,
                date: new Date(this.addDate).toISOString(),
                complete: false,                
            })
            .then(res=>{
                this.tasks.push({
                    id: res.id,
                    title: res.title,
                    date: new Date(res.date),
                    complete: res.complete,                
                })
            });            
            
            this.addTask= ''   
        },
        completed(id) {
            const task = this.tasks.find(t => t.id === id);
            customFetch(`tasks/${id}`,"PUT",{complete : !task.complete}).then(() => {task.complete = !task.complete})                                  
        },        
        loadTasks(tasks){
            this.tasks = tasks.map(task=>({...task,date:new Date(task.date)}));            
        },           
        removeToDo(id) {
            customFetch(`tasks/${id}`,"DELETE").then(()=>{
                const taskIndex = this.tasks.findIndex(task=>task.id===id);
                this.tasks.splice(taskIndex,1);
            })            
        },
        editToDo(task) {          
            this.beforeEdit = task.title
            this.beforeEdit = task.date
            task.edit = false
        },
        doneEditToDo(todo) {  
            if(task.title.trim() == '') {
                task.title = this.beforeEdit
                task.date = this.beforeEdit                
            }     
            taks.edit = false
        },
        cancelEditToDo(task) {
            task.title = this.beforeEdit
            task.date = this.beforeEdit
            task.edit = false
        },
        checkAll() {            
            const checked = event.target.checked
            this.tasks.forEach((task) => customFetch(`tasks/${task.id}`,"PUT",{complete : event.target.checked}).then(()=>task.complete = checked))            
        },
        clearCompletly() {
            this.tasks.forEach(task => {
                if(task.complete) {
                    customFetch(`tasks/${task.id}`,"DELETE")
                }

            })
            this.tasks = this.tasks.filter(task => !task.complete)            
        }
    },
    mounted(){
        customFetch("tasks","GET")        
        .then(data=>this.loadTasks(data))
    }
    
}

const customFetch = (path,method,body)=>{
    return fetch(`${apiURL}/${path}`,{
        method,
        headers: {
          'Content-Type': 'application/json'      
        },
        body:JSON.stringify(body)
    }).then(res=>res.json())
}
</script>
mode: 'cors'
<style lang="css">
    .todo-input {
        width: 100%;
        padding: 12px 18px;
        font-size: 18px;
        margin-bottom: 15px;           
    }

    .remove-task-button {
        background-color: gray;
        border: none;
        color: white;
        padding: 10px 25px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
    }

    .filter-task-button {
        background-color: gray;
        border: none;
        color: White;
        margin: 5px;
        padding: 10px 25px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
    }

    .todo-items {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .task-items-left {
        display: flex;
        align-items: center;
    }

    .task-items-label {
        padding: 10px;
        font-size: 32px;
        border: 1px solid white;
        margin-left: 12px;                
    }

    .task-items-edit {
        font-size: 24px;
        color: #2c3e50;
        margin-left: 12px;
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;        
    }

    .complete {
        text-decoration: line-through;
        color: gray;
    }

    .task-items-time {        
        font-size: 17px;
        border: 1px solid white;
        margin-left: 25px;
        margin-top: 0px;      
    }

    .task-data {
        display: grid;        
    }

    .extra-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        border-top: 1px solid gray;
        padding-top: 14px;
        margin-bottom: 14px;
    }
</style>