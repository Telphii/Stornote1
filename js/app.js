const { createApp } = Vue;

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
});

taskManager.mount('#app');

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

taskManager.component('TaskColumn', TaskColumn);