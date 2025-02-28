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