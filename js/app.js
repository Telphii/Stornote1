const { createApp } = Vue;

const TaskColumn = {
    props: {
        columnID: Number,
        taskCards: Array,
    },
    template: `
    <div class="column">
      <h2>Столбец {{ columnID }}</h2>
      <div v-for="(card, index) in taskCards" :key="index">
        <div class="card">
          <h3>{{ card.title }}</h3>
          <ul>
            <li v-for="(item, i) in card.list" :key="i">
              {{ item.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
};

const taskManager = createApp({
    data() {
        return {
            newTask: {
                title: '',
                list: ['', '', ''],
                completedAt: null,
            },
            taskColumns: [
                { taskCards: [] },
                { taskCards: [] },
                { taskCards: [] },
            ],
            restrictFirstColumn: false,
        };
    },
    methods: {
        addTask() {
            if (this.restrictFirstColumn && this.taskColumns[0].taskCards.length >= 3) {
                alert("Нельзя добавить больше 3 задач в первый столбец");
                return;
            }
            if (this.newTask.title.trim() && this.newTask.list.every(item => item.trim())) {
                this.taskColumns[0].taskCards.push({
                    title: this.newTask.title,
                    list: this.newTask.list.map(text => ({ text, done: false })),
                    completedAt: null,
                });
                this.newTask = { title: '', list: ['', '', ''], completedAt: null };
            } else {
                alert("Заполните все поля задачи");
            }
        },
        addTaskItem() {
            if (this.newTask.list.length < 5) {
                this.newTask.list.push('');
            }
        },
        removeTaskItem(index) {
            if (this.newTask.list.length > 3) {
                this.newTask.list.splice(index, 1);
            }
        },
    },
    template: `
    <div class="task-container">
      <!-- Форма для добавления новой задачи -->
      <form @submit.prevent="addTask">
        <div>
          <label for="task-title">Название задачи:</label>
          <input type="text" id="task-title" v-model="newTask.title" required>
        </div>
        <div v-for="(item, index) in newTask.list" :key="index">
          <label :for="'task-item-' + index">Пункт {{ index + 1 }}:</label>
          <input :id="'task-item-' + index" type="text" v-model="newTask.list[index]" required>
          <button type="button" @click="removeTaskItem(index)" v-if="newTask.list.length > 3">Удалить</button>
        </div>
        <button type="button" @click="addTaskItem" v-if="newTask.list.length < 5">Добавить пункт</button>
        <button type="submit">Добавить задачу</button>
      </form>

      <!-- Отображение столбцов с задачами -->
      <div class="task-columns">
        <TaskColumn
          v-for="(column, index) in taskColumns"
          :key="index"
          :columnID="index + 1"
          :taskCards="column.taskCards"
        ></TaskColumn>
      </div>
    </div>
  `,
});

taskManager.component('TaskColumn', TaskColumn);
taskManager.mount('#app');