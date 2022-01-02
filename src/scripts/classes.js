class Task {
    constructor() {
        console.log("Создан экземпляр task!")
    }

    showId() {
        console.log(23);
    }

    static loadAll() {
        console.log('Загружаем все tasks...');
    }
}

export default Task;