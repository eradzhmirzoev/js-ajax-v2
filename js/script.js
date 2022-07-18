class TodoList {
    constructor(el) {
        this.todos = [];
        this.el = el;
        this.wrapper = document.querySelector('body');

        this.wrapper.addEventListener('click', this.additionalFeatures.bind(this));
    }
    additionalFeatures(e) {
        let elemInput = document.querySelector('.create-input');

        //change status
        if(e.target.className === 'set-status') {
            this.changeStatus(e.target.closest('li').dataset.id);
            this.render();
        }

        //delete task
        if(e.target.className === 'delete-task'){
            this.removeTodo(e.target.closest('li').dataset.id);
            this.render();
        }

        //create task
        if (e.target.className === 'btn-create' && elemInput.value !== '') {
            // this.addTodo(new Task(elemInput.value, false));
            // this.render();
            xhr.open('POST', 'http://localhost:3000/todos');
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send(JSON.stringify(new Task(elemInput.value, false)));
        }

        //find element
        if (e.target.className === 'btn-find' && elemInput.value !== '') {
            this.findTasks(elemInput.value.trim());
        }

    }

    findTasks(elemInput) {
        let lis = '';
        
        this.todosWithFindElements = this.todos.filter(element => element.task.includes(elemInput));
        
        this.todosWithFindElements.forEach(element => {
            lis += `<li data-id="${element.id}" data-complited="${element.complited}">${element.task}
            <button class="set-status">Change status</button>
            <button class="delete-task">Delete</button></li>`;
        });

        this.el.innerHTML = lis + `<input type = 'text' class='create-input'></input><button class="btn-create">Create</button><button class="btn-find">Find</button>`;

        this.arrLi = document.querySelectorAll('#list > li');
        this.arrLi = Array.from(this.arrLi);

        this.arrLi.forEach((element) => {
            if (element.dataset.complited === 'true') {
                element.style.background = 'green';
            } else {
                element.style.background = 'yellow';
            }
        });

    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(id) {
        console.log(id);
        this.todos = this.todos.filter((el) => {
            return el.id !== +id;
        });
        xhr.open('DELETE', `http://localhost:3000/todos/${id}`);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send();
    }

    getTodos() {
        return this.todos;
    }

    changeStatus(id) {
        let index = this.todos.findIndex((el) => el.id === +id);
        this.todos[index].complited = !this.todos[index].complited;

        xhr.open('PATCH', `http://localhost:3000/todos/${id}`);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify({complited: this.todos[index].complited}));
    }

    render() {
        let lis = '';
        for (let el of this.todos) {
            if (!el) {
                return;
            }
            lis += `<li data-id="${el.id}" data-complited="${el.complited}">${el.task}
            <button class="set-status">Change status</button>
            <button class="delete-task">Delete</button></li>`;
        }
        
        this.el.innerHTML = lis + `<input type = 'text' class='create-input'></input><button class="btn-create">Create</button><button class="btn-find">Find</button>`;

        this.arrLi = document.querySelectorAll('#list > li');
        this.arrLi = Array.from(this.arrLi);
        
        this.arrLi.forEach((element) => {
            if (element.dataset.complited === 'true') {
                element.style.background = 'green';
            } else {
                element.style.background = 'yellow';
            }
        });

    }
}

class Task {
    constructor(task, complited, id) {
        this.task = task;
        this.complited = complited;
        this.id = id;
    }
}

let list = document.getElementById('list');
let todo1 = new TodoList(list);

const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://localhost:3000/todos');
xhr.responseType = 'json';
xhr.onload = function() {
    if (xhr.status >= 400) {
        console.log('error');
    } else {
        let responseServerArr = Array.from(xhr.response);
        responseServerArr.forEach((element) => {
            todo1.addTodo(new Task(element.task, element.complited, element.id))
        })
        todo1.render();
    }
}
xhr.send();