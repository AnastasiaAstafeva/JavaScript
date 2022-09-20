(function(){
    let todoArray = [];

    //создаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }
    //создаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.disabled = true;
        button.textContent = 'Добавить дело';
        
        input.addEventListener('input', function () {
            if (input.value.length !== 0) {
                button.disabled = false;
            } else { 
                button.disabled = true;
            }
        });

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }
    //создаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }
    //создание элементов списка с кнопками
    function createTodoItem(name) {
        let item = document.createElement('li')

        let randomId = Math.random() * 100;
        item.id = Math.round(randomId);
        //кнопки
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        //стили для списка и кнопок 
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-croup-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        //вкладываем кнопки и элемент списка а один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        };

        
    }

    function createTodoApp(container, title = 'Список дел', key) {
        
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        //обработчик на кнопки

        function changeTodoDone (arr, item) {
            for (let obj of arr) {
                if (obj.id === item.id) {
                    if (obj.done === false) {
                        obj.done = true;
                    } else {
                        obj.done = false;
                    }
                }
            }
        };

        function doneBtnClick (item, btn) {
            btn.addEventListener('click', function() {
            todoArray = JSON.parse(localStorage.getItem(key));
            item.classList.toggle('list-group-item-success');
            changeTodoDone(todoArray, item);
            localStorage.setItem(key, JSON.stringify(todoArray));
            });
        }

        function deleteBtnClick (item, btn) {
            btn.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                todoArray = JSON.parse(localStorage.getItem(key));
                let newArray = todoArray.filter(obj => obj.id !== item.id);
                localStorage.setItem(key, JSON.stringify(newArray));

                item.remove();
            }
            });
        }
        
        //добавляем информацию из localStorage если она там есть 

        if (localStorage.getItem(key)) {
            todoArray = JSON.parse(localStorage.getItem(key));

            for (let obj of todoArray) {
                let todoItem = createTodoItem(obj.name);

                // todoItem.item.textContent = obj.name;
                todoItem.item.id = obj.id;

                if (obj.done == true) {
                    todoItem.item.classList.add('list-group-item-success');
                }
                
                todoList.append(todoItem.item);
                doneBtnClick (todoItem.item, todoItem.doneButton);
                deleteBtnClick (todoItem.item, todoItem.deleteButton);
            }
        }
      
        todoItemForm.form.addEventListener('submit', function(e) {
            //предотвращаем перезагрузку страницы при отправке формы
            e.preventDefault();

            //игнорируем создание элемента, если ничего не введено
            if (!todoItemForm.input.value) {
                return;
            }

            todoItemForm.button.disabled = true;

            let todoItem = createTodoItem(todoItemForm.input.value);

            doneBtnClick (todoItem.item, todoItem.doneButton);
            deleteBtnClick (todoItem.item, todoItem.deleteButton);
            

            //получить массив из localStorage

            let localStorageData = localStorage.getItem(key);

            if (localStorageData == null) {
                todoArray = [];
            } else {
                todoArray = JSON.parse(localStorageData);
            }

            //создаем объект с делами для передачи в localStorage
        
            function createTodoArray (arr) {
                let todoOdj = {};
                todoOdj.name = todoItemForm.input.value;
                todoOdj.id = todoItem.item.id;
                todoOdj.done = false;
    
                arr.push(todoOdj);
            };
    
            createTodoArray(todoArray);
            localStorage.setItem(key, JSON.stringify(todoArray));

            //создаем и добаляем новое дело
            todoList.append(todoItem.item);

            //обнуляем значение в поле
            todoItemForm.input.value = '';
        });

    }

    window.createTodoApp = createTodoApp;
})();
