import { TodoItem } from './todoItem';
import { TodoCollection } from './todoCollection';
import * as inquerir from 'inquirer';
import { JsonTodoCollection } from "./jsonTodoCollection";
let todos = [
    new TodoItem(1, "Comprar regalos"),
    new TodoItem(2, "Cambiar zapatos"),
    new TodoItem(3, "Buscar tickets"),
    new TodoItem(4, "Llamar a Joe", true),
];
let collection: TodoCollection = new JsonTodoCollection("Julian", todos);
let showCompleted = true;

function displayToDoList(): void {
    console.log(`${collection.userName}'s Todo List (${ collection.getItemCounts().incomplete } items to do)`);
    //collection.getTodoItems(true).forEach(item => item.printDetails());
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}

enum Commands {
    Add = "Add new task",
    Complete = "Complete Task",
    Toggle = "Show/Hide Completed",
    Purge = "Remove Completed Tasks",
    Quit = "Quit",
}

function promptAdd(): void {
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

function promptComplete(): void {
    console.clear();
    inquerir.prompt({
        type: "checkbox",
        name: "complete",
        message: "Mark tasks complete",
        choices: collection.getTodoItems(showCompleted).map(item => ({
            name: item.task,
            value: item.id,
            checked: item.complete
        }))
    }).then( answers => {
        let completedTasks = answers["complete"] as number[];
        collection.getTodoItems(true).forEach(item => collection.markComplete(item.id, completedTasks.find(id => id === item.id) !== undefined));
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
                promptAdd();
                break;
            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0){
                    promptComplete();
                } else {
                    promptUser();
                }
                break;
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;
        }
    })
}
promptUser();

