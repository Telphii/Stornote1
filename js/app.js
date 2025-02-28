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
        <TaskCard
          :taskTitle="card.title"
          :taskItems="card.list"
          :taskColumn="columnID"
          :taskIndex="index"
          :relocateTask="relocateTask"
          :completionTime="card.completedAt"
          :modifyTask="modifyTask"
          :secondColumnTaskCount="taskColumns[1].taskCards.length"
        ></TaskCard>
      </div>
    </div>
  `,
};

const TaskCard = {
    props: {
        taskTitle: String,
        taskItems: Array,
        taskColumn: Number,
        taskIndex: Number,
        relocateTask: Function,
        completionTime: String,
        modifyTask: Function,
        secondColumnTaskCount: Number,
    },
    computed: {
        completionPercentage() {
            const finishedTasks = this.taskItems.filter(item => item.done).length;
            return Math.floor((finishedTasks / this.taskItems.length) * 100);
        },
        isRestricted() {
            return this.taskColumn === 1 && this.secondColumnTaskCount >= 5 && this.completionPercentage < 100;
        }
    },
    methods: {
        toggleTaskItem(index) {
            if (this.isRestricted) return;
            const finishedTasks = this.taskItems.filter(item => item.done).length;
            const completed = Math.floor((finishedTasks / this.taskItems.length) * 100);
            if (completed === 100 && !this.completionTime) {
                const finishTimestamp = new Date().toLocaleString();
                this.modifyTask(this.taskIndex, this.taskColumn, { completedAt: finishTimestamp });
            }
            if (this.taskColumn === 1 && completed > 50) {
                this.relocateTask({ column: this.taskColumn, index: this.taskIndex }, 2);
            } else if (this.taskColumn === 2 && completed === 100) {
                this.relocateTask({ column: this.taskColumn, index: this.taskIndex }, 3);
            }
        },
    },
    template: `
    <div class="card">
      <h3>{{ taskTitle }}</h3>
      <ul>
        <li v-for="(item, index) in taskItems" :key="index">
          <input type="checkbox" v-model="item.done" @change="toggleTaskItem(index)" :disabled="isRestricted || item.done"/>
          {{ item.text }}
        </li>
      </ul>
      <p v-if="completionPercentage === 100">Completed at: {{ completionTime }}</p>
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
        relocateTask(from, to) {
            const task = this.taskColumns[from.column - 1].taskCards.splice(from.index, 1)[0];
            this.taskColumns[to - 1].taskCards.push(task);
        },
        modifyTask(index, column, updates) {
            const task = this.taskColumns[column - 1].taskCards[index];
            Object.assign(task, updates);
        },
    },
    template: `
    <div class="task-container">
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
taskManager.component('TaskCard', TaskCard);
taskManager.mount('#app');