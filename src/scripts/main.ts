class Task {
    constructor() {
        console.log("Создан экземпляр task!")
    }

    showId() {
        console.log(23);
    }
}

console.log(typeof Task); // function
let task = new Task(); // Создан экземпляр task!
task.showId(); // 23