<template>
  <div id="app" class="container">
    <h1>To-Do Application</h1>
    <todo-list></todo-list>           
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import TodoList from './components/TodoList.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    TodoList
  }
}
</script>

<style>

* {
  box-sizing: border-box;
}

.container{
  max-width: 600px;
  margin: 0 auto;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

h1{
  text-decoration: underline;
  text-align: center;
}
</style>
