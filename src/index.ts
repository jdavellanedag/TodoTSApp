import { TodoItem } from './todoItem';
import { TodoCollection } from './todoCollection';
import * as inquerir from 'inquirer';
let todos = [
    new TodoItem(1, "Comprar regalos"),
    new TodoItem(2, "Cambiar zapatos"),
    new TodoItem(3, "Buscar tickets"),
    new TodoItem(4, "Llamar a Joe", true),
];
let collection = new TodoCollection("Julian", todos);
let showCompleted = true;

function displayToDoList(): void {
    console.log(`${collection.userName}'s Todo List (${ collection.getItemCounts().incomplete } items to do)`);
    //collection.getTodoItems(true).forEach(item => item.printDetails());
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}

enum Commands {
    Add = "Add new task",
    Toggle = "Show/Hide Completed",
    Quit = "Quit",
}

function prompAdd(): void {
    console.clear();
    inquerir.prompt({
        type: "input",
        name: "add",
        message: "Enter task:",
    }).then((answers) => {
        if (answers["add"] !== ""){
            collection.addTodo(answers["add"]);
        }
        promptUser();
    })
}

function promptUser(): void {
    console.clear();
    displayToDoList();
    inquerir.prompt({
        type: "list",
        name: "command",
        message: "Choose option",
        choices: Object.values(Commands),        
    }).then((answers) => {
        switch (answers["command"]) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser()
                break;
            case Commands.Add:
                prompAdd();
                break;
        }
    })
}
promptUser();

