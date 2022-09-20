(async function(){
    let clients = [];

    //запрос данных с сервера для отрисовки таблицы
    const clientsGet = async () => {
        const response = await fetch('http://localhost:3000/api/clients');
        const result = await response.json();
        return result;
    }
    clients = await clientsGet();



    //функция отрисовки строки 
    function adToRow (objTable, rowNew) {
        //ячейка с ID
        let cell1 = document.createElement('td');
        cell1.textContent = objTable.id;
        rowNew.append(cell1);

        //ячейка с фио
        let cell2 = document.createElement('td');
        cell2.textContent = [objTable.surname, objTable.name, objTable.lastName].join(' ');
        rowNew.append(cell2);

        //ячейка с датой создания
        let cell3 = document.createElement('td');
        let dateСreat = objTable.createdAt.split('T');
        cell3.textContent = dateСreat[0].split('-').reverse().join('.');
        let time = document.createElement('span');
        let timeCreat = dateСreat[1].split(':');
        time.textContent = [timeCreat[0], timeCreat[1]].join(':');
        time.classList.add('time');
        cell3.append(time);
        rowNew.append(cell3);

        //ячека с датой изменения
        let cell4 = document.createElement('td');
        let dateСhange = objTable.updatedAt.split('T');
        cell4.textContent = dateСhange[0].split('-').reverse().join('.');
        let time1 = document.createElement('span');
        let timeChange = dateСhange[1].split(':');
        time1.textContent = [timeChange[0], timeChange[1]].join(':');
        time1.classList.add('time');
        cell4.append(time1);
        rowNew.append(cell4);

        
        //ячейка с контактами

        let cell5 = document.createElement('td');
        cell5.classList.add('contacts-wrapper');

        //добавить контакты в зависимости от их типа
        for (let i = 0; i < objTable.contacts.length; i++) {
            if (objTable.contacts[i].type == 'tel' || objTable.contacts[i].type == 'adtel') {
                let iconTel = document.createElement('button');
                iconTel.classList.add('icon-tel');
                cell5.append(iconTel);
            }
            if (objTable.contacts[i].type == 'vk') {
                let iconVk = document.createElement('button');
                iconVk.classList.add('icon-vk');
                cell5.append(iconVk);
            }
            if (objTable.contacts[i].type == 'fb') {
                let iconFb = document.createElement('button');
                iconFb.classList.add('icon-fb');
                cell5.append(iconFb);
            }
            if (objTable.contacts[i].type == 'email') {
                let iconEmail = document.createElement('button');
                iconEmail.classList.add('icon-email');
                cell5.append(iconEmail);
            }
            if (objTable.contacts[i].type == 'other') {
                let iconOther = document.createElement('button');
                iconOther.classList.add('icon-other');
                cell5.append(iconOther);
            }
            
        }
        rowNew.append(cell5);

        //подклучить тултипы
        let buttonContact = cell5.querySelectorAll('button');
        for (let i = 0; i < buttonContact.length; i++) {
            buttonContact[i].classList.add('btn-tooltip');
            buttonContact[i].setAttribute('data-toggle', 'tooltip');
            buttonContact[i].setAttribute('data-placement', 'top');
            buttonContact[i].setAttribute('title', `${objTable.contacts[i].value}`);
        }
        $('.btn-tooltip').tooltip();

        //если контактов больше 4 добавить кнопку для раскрытия поного списка контактов
        if (objTable.contacts.length > 4) {
            let iconOpen = document.createElement('button');
            iconOpen.classList.add('icon-open');
            iconOpen.textContent = `+${objTable.contacts.length - 4}`;
            cell5.append(iconOpen);

            for (let i = 4; i < buttonContact.length; i++) {
                buttonContact[i].classList.add('visuality-hidden'); 
            }
            iconOpen.addEventListener('click', ()=> {
                for (let i = 1; i < buttonContact.length; i++) {
                    buttonContact[i].classList.remove('visuality-hidden');
                }
                iconOpen.classList.add('visuality-hidden');
            })
        } 

        //кнопки для изменения и удаления
        let cell6 = document.createElement('td');
        let buttonChange = document.createElement('button');
        buttonChange.classList.add('button-change');
        buttonChange.textContent = 'Изменить';
        let buttonDelete = document.createElement('button');
        buttonDelete.classList.add('button-delete');
        buttonDelete.textContent = 'Удалить';
        cell6.append(buttonChange);
        cell6.append(buttonDelete);
        rowNew.append(cell6);
        changeBtnClick(objTable, buttonChange);
        deleteBtnClick(objTable, buttonDelete);

        return(rowNew);
    }
    
    addToTable(clients);
    //создаем таблицу из строк данных
    function addToTable (arr) {
        console.log(arr);
        //удалить все строки кроме первой
        const table = document.querySelector('.table tbody');
        table.innerHTML = '';
        
        //добавить строки из массива объектов
        for (let i = 0; i < arr.length; i++) {
            let objTable = arr[i];
            let rowNew = document.createElement('tr');
            rowNew.classList.add('rowTable');
            rowNew.setAttribute('data-id', `${objTable.id}`);
            table.append(adToRow(objTable, rowNew)); 
        }   
    }

    //открытие формы добавления клиента на кнопку
    const formOpenBtn = document.querySelector('.btn-client-app');
    formOpenBtn.addEventListener('click', () => {
        const form = document.querySelector('.form');
        form.classList.remove('form-close');
        const bodyBackground = document.createElement('div');
        bodyBackground.classList.add('body-background');
        const body = document.querySelector('body');
        body.prepend(bodyBackground);

        //закрытие формы
        const formCloseBtn = form.querySelector('.btn-form-close');
        formCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeForm();
        });
        const formCancelBtn = form.querySelector('.btn-form-cancel');
        formCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeForm();
        });
    });

    //функция закрытие формы
    function closeForm () {
        form.classList.add('form-close');
        let bodyBackground = document.querySelector('.body-background');
        bodyBackground.classList.remove('body-background');
        let inputMessage = form.querySelectorAll('.message');
        for (let i = 0; i < inputMessage.length; i++) {
            inputMessage[i].classList.add('visuality-hidden');
        }
        let inputForm = form.querySelectorAll('.input-form');
        for (let i = 0; i < inputForm.length; i++) {
            inputForm[i].value = '';
        }
        let inputFormLb = form.querySelectorAll('.input-lbl');
        for (let i = 0; i < inputFormLb.length; i++) {
            inputFormLb[i].textContent = '*';
        }
        let formContacts = form.querySelector('.form-contacts');
        formContacts.innerHTML = '';
        let formAlert = form.querySelectorAll('.form-alert');
        for (let i = 0; i < formAlert.length; i++) {
            formAlert[i].remove();  
        }
    }


    //убрать плейсхолдеры при вводе в форму и сделать кнопку отправки активной
    const form = document.querySelector('.form');
    let inputForm = form.querySelectorAll('.input-form');
    let inputFormLb = form.querySelectorAll('.input-lbl');
    let inputMessage = form.querySelectorAll('.message');
    let btnForm = form.querySelector('.btn-form');
    let check = [];
    for (let i = 0; i < (inputForm.length - 1); i++) {
        inputForm[i].addEventListener('input', ()=> {
            if (inputForm[i].id == inputFormLb[i].htmlFor) {
                inputFormLb[i].textContent = '';
                inputMessage[i].classList.remove('visuality-hidden');
            }
            if (inputForm[i].value.length === 2) {
                check.push(true);
            }
            if (check.length == 2) {
                console.log(btnForm);
                btnForm.disabled = false;
                check = [];
            }
        });
    }
    

    //добавление клиента из формы
    function clientApp () {
        //добавить строки с контактами в форму при нажатии кнопки
        const buttonContactApp = document.querySelector('.btn-form-contact');
        let form = document.querySelector('.form');
        buttonContactApp.addEventListener('click', () => {
            contactAppForm(form);
        });
        //обработчик на кнопку отправки данных
        const btnSubmit = document.querySelector('.btn-form');
        btnSubmit.addEventListener('click', async function (){
            //массив с данными клиента
            let client = {};

            //добавление в объект ФИО клиента
            const form = document.querySelector('.form')
            let name = form.querySelector('#name');
            client.name = name.value;
            let surname = form.querySelector('#surname');
            client.surname = surname.value;
            let lastName = form.querySelector('#lastName');
            client.lastName = lastName.value;
        
            //добавление в объект с клиентом контактов
            contacts = clientContactSubmit(form);
            client.contacts = contacts;

            //отправка данных о клиенте на сервер
            const response = await fetch('http://localhost:3000/api/clients', {
                method: 'POST',
                body: JSON.stringify(client),
                headers: {'Content-Type': 'application/json',}
            });

            if (response.status === 422) {
                const result = await response.json();
                console.log(result.errors);
                for (let i = 0; i < result.errors.length; i++) {
                    const message = result.errors[i].message;
                    let alert = document.createElement('p');
                    alert.classList.add('form-alert');
                    alert.textContent = message;
                    const form = document.querySelector('.form');
                    form.append(alert);
                }
            }

            //закрыть форму 
            client = await response.json();
            clients.push(client);
            addToTable(clients);
            closeForm();
        });
        
    }

    clientApp();

    //обработчик на кнопку изменить
    function changeBtnClick (obj, btn) {
        btn.addEventListener('click', async () => {
            let id = obj.id;
            const response = await fetch(`http://localhost:3000/api/clients/${id}`);
            const client = await response.json();
            clientChange(client);
            changeClientApp(client);
        });
    }

    //изменение контакта 
    function clientChange (obj) {
        let formChange = document.querySelector('.form-change');
        formChange.classList.remove('form-close');
        const bodyBackground = document.createElement('div');
        bodyBackground.classList.add('body-background');
        const body = document.querySelector('body');
        body.prepend(bodyBackground);
        let inputFormChange = formChange.querySelectorAll('.input-form');

        //заполнить id
        let formChangeId = document.querySelector('.id-client');
        formChangeId.textContent = `ID:${obj.id}`;

        //заполнить инпуты
        for (let i = 0; i < inputFormChange.length; i++) {
            if (inputFormChange[i].id == 'name-change') {
                inputFormChange[i].value = `${obj.name}`;
            }
            if (inputFormChange[i].id == 'surname-change') {
                inputFormChange[i].value = `${obj.surname}`;
            }
            if (inputFormChange[i].id == 'lastName-change') {
                inputFormChange[i].value = `${obj.lastName}`;
            }
        }

        //добавить контакты 
        let contacts = obj.contacts;
        for (let i = 0; i < contacts.length; i++) {
            let type = contacts[i].type;
            contactAppForm(formChange);
            let selectContactAll = formChange.querySelectorAll('.choices');
            let selectContact = selectContactAll[i];
            let selectOptionActive = selectContact.querySelector('select option');
            let selectOptionActiveInput = selectContact.querySelector('.choices__list--single .choices__item');
            
            let selectOption = selectContact.querySelectorAll('.choices__item');
            for (let i = 0; i < selectOption.length; i++) {
                if (selectOption[i].dataset.value == type) {
                    selectOptionActiveInput.dataset.value = selectOption[i].dataset.value;
                    selectOptionActive.value = selectOption[i].dataset.value;
                    selectOptionActiveInput.textContent = selectOption[i].textContent;
                };
            }

            let inputContactAll = formChange.querySelectorAll('.form-contacnt-input');
            let inputContact = inputContactAll[i];
            inputContact.value = contacts[i].value;

            let contactWrapperFormAll = formChange.querySelectorAll('.form-contact-wrapper');
            let contactWrapperForm = contactWrapperFormAll[i];
            let contactBtnDelete = document.createElement('button');
            contactBtnDelete.classList.add('contact-btn-delete');
            contactWrapperForm.append(contactBtnDelete);
            contactBtnDelete.addEventListener('click', (e) => {
                e.preventDefault();
                contactWrapperForm.innerHTML = '';
            });    
        }

        //закрыть форму на кнопку 
        const formChangeCloseBtn = formChange.querySelector('.btn-form-close');
        formChangeCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            formChange.classList.add('form-close');
            bodyBackground.classList.remove('body-background');
            let formContacts = formChange.querySelector('.form-contacts');
            formContacts.innerHTML = '';
        });

        //удаление клиента через форму изменния
        const contactBtnDelete = formChange.querySelector('.btn-form-delete');
        contactBtnDelete.addEventListener('click', () => {
            formChange.classList.add('form-close');
            bodyBackground.classList.remove('body-background');
        })
        deleteBtnClick (obj, contactBtnDelete);
    }

    //отправка измененных данных на сервер 
    function changeClientApp (obj) {
        let formChange = document.querySelector('.form-change');

        //добавить контакты
        const buttonContactApp = formChange.querySelector('.btn-form-contact');
        buttonContactApp.addEventListener('click', () => {
            contactAppForm(formChange);
        });

        //отправка измененных данных о клиенте на сервер 
        const btnSubmitChange = document.querySelector('.btn-form-change');
        btnSubmitChange.addEventListener('click', async function (e){
            e.preventDefault();
            //массив с данными клиента
            let client = {};

            //добавление в объект ФИО клиента
            const formChange = document.querySelector('.form-change')
            let name = formChange.querySelector('#name-change');
            client.name = name.value;
            let surname = formChange.querySelector('#surname-change');
            client.surname = surname.value;
            let lastName = formChange.querySelector('#lastName-change');
            client.lastName = lastName.value;
        
            //добавление в объект с клиентов контактов
            contacts = clientContactSubmit(formChange);
            client.contacts = contacts;

            //отправка изсененных данных о клиенте на сервер
            const response = await fetch(`http://localhost:3000/api/clients/${obj.id}`, {
                method: 'PATCH',
                body: JSON.stringify(client),
                headers: {'Content-Type': 'application/json',}
            });

            //закрыть форму 
            const clientsGet = async (e) => {
                const response = await fetch(`http://localhost:3000/api/clients/${obj.id}`);
                const result = await response.json();
                return result;
            }
            client = await clientsGet();
            console.log(client);
            let table = document.querySelector('tbody');
            let rowTable = table.querySelectorAll('.rowTable');
            for (let i = 0; i < rowTable.length; i++) {
                if (rowTable[i].dataset.id === client.id) {
                    rowTable[i].innerHTML = '';
                    adToRow (client, rowTable[i]);
                }
            }
            formChange.classList.add('form-close');
            let bodyBackground = document.querySelector('.body-background');
            bodyBackground.classList.remove('body-background');
            let formContacts = formChange.querySelector('.form-contacts');
            formContacts.innerHTML = '';
        });
    }
    
    //обработчик на кнопку удалить
    function deleteBtnClick (obj, btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            //открываем окно с подтверждением
            let deleteClient = document.querySelector('.delete-client');
            deleteClient.classList.remove('visuality-hidden');
            const bodyBackground = document.createElement('div');
            bodyBackground.classList.add('body-background');
            const body = document.querySelector('body');
            body.prepend(bodyBackground);
            
            //подтвердить удаление
            let deleteClientBtn = deleteClient.querySelector('.delete-client-btn');
            deleteClientBtn.addEventListener('click', async() => {
                let id = obj.id;
                const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
                    method: 'DELETE',
                });
                
                let table = document.querySelector('tbody');
                let rowTableDelete = table.querySelectorAll('.rowTable');
                for (let i = 0; i < rowTableDelete.length; i++) {
                    if (rowTableDelete[i].dataset.id === id) {
                        rowTableDelete[i].remove();
                    }
                }
                clients = clients.filter(client => client.id !== id);
                deleteClient.classList.add('visuality-hidden');
                bodyBackground.classList.remove('body-background');
            })  

            //закрыть или отменить удаление
            let deleteClientCancel = deleteClient.querySelector('.delete-client-cancel');
            let deleteClientClose = deleteClient.querySelector('.delete-client-close');
            deleteClientCancel.addEventListener('click', () => {
                deleteClient.classList.add('visuality-hidden');
                bodyBackground.classList.remove('body-background');

            })
            deleteClientClose.addEventListener('click', () => {
                deleteClient.classList.add('visuality-hidden');
                bodyBackground.classList.remove('body-background');
            })
        });
    }

    //функция добавления контактов в форме
    function contactAppForm (nameForm) {
        let contactWrapper = nameForm.querySelectorAll('.form-contact-wrapper');
        if (contactWrapper.length < 10) {
            let contactWrapperForm = document.createElement('div');
            contactWrapperForm.classList.add('form-contact-wrapper');

            let contactTypeSelect = document.createElement('select');
            contactTypeSelect.setAttribute('name', 'select');
            contactTypeSelect.setAttribute('tabindex', '6');
            
            let contactType1 = document.createElement('option');
            contactType1.setAttribute('value', 'tel');
            contactType1.textContent = 'Телефон';
            let contactType2 = document.createElement('option');
            contactType2.setAttribute('value', 'adtel');
            contactType2.textContent = 'Доп.телефон';
            let contactType3 = document.createElement('option');
            contactType3.setAttribute('value', 'email');
            contactType3.textContent = 'Email';
            let contactType4 = document.createElement('option');
            contactType4.setAttribute('value', 'vk');
            contactType4.textContent = 'Vk';
            let contactType5 = document.createElement('option');
            contactType5.setAttribute('value', 'fb');
            contactType5.textContent = 'Facebook';
            let contactType6 = document.createElement('option');
            contactType6.setAttribute('value', 'other');
            contactType6.textContent = 'Другое';

            contactTypeSelect.append(contactType1);
            contactTypeSelect.append(contactType2);
            contactTypeSelect.append(contactType3);
            contactTypeSelect.append(contactType4);
            contactTypeSelect.append(contactType5);
            contactTypeSelect.append(contactType6);

            let contactInput = document.createElement('input');
            contactInput.classList.add('form-contacnt-input');

            contactWrapperForm.append(contactTypeSelect);
            contactWrapperForm.append(contactInput);
            let contactsWrapperForm = nameForm.querySelector('.form-contacts');
            contactsWrapperForm.append(contactWrapperForm);
            
            const element = document.querySelectorAll('select');
            for (let i = 0; i < element.length; i++) {
                const choices = new Choices(element[i], {
                searchEnabled: false,
                itemSelectText: '',
                shouldSort: false,
                });
            };

            let contactBtnDelete = document.createElement('button');
            contactBtnDelete.classList.add('contact-btn-delete');
            
            contactInput.addEventListener('input', ()=> {
                if (contactInput.value.length <= 1) {
                    contactWrapperForm.append(contactBtnDelete);
                return contactBtnDelete;
                }
            });
            contactBtnDelete.addEventListener('click', (e) => {
                e.preventDefault();
                contactWrapperForm.remove();
            });    
        } else {
            let formAlert = nameForm.querySelector('.form-alert');
            formAlert.classList.remove('visuality-hidden');
        }    
    }

    //функция добавления контактов в объект клиента для отправки на сервер
    function clientContactSubmit (nameForm) {
        let contacts = [];
        const selectContact = nameForm.querySelectorAll('select');
        for (let i = 0; i < selectContact.length; i++){
            let contact = {};
            contact.type = selectContact[i].value;
            contact.value = '';
            contacts.push(contact);
        }
        let inputContact = nameForm.querySelectorAll('.form-contacnt-input');
        
        for (let i = 0; i < inputContact.length; i++) {
            contacts[i].value = inputContact[i].value;
        }
        return contacts;
    }

    //поиск
    const debounse = (fn) => {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(fn, 300);
        };
    }

    const inputSearch = document.querySelector('.search-input');
    async function searchClient () {
        let valueSearch = inputSearch.value;
        const filterClients = await fetch(`http://localhost:3000/api/clients?search=${valueSearch}`);
        const result = await filterClients.json();
        addToTable(result);  
    }

    inputSearch.addEventListener('input', debounse(searchClient));

    //сортировка 
    function sortSClients (prop, dir) {
        const clientsSort = [...clients];
        return clientsSort.sort(function (a, b) {
            if ((dir ? a[prop] < b[prop] : a[prop] > b[prop]))
            return -1;
        });
    }

    let sort = 'surname';
    let dir = false;

    function render () {
        const clientsSort = sortSClients (sort, dir);
        addToTable(clientsSort);
    }

    let headingTadle = document.querySelectorAll('.heading-tadle');
    headingTadle.forEach(element => {
        element.addEventListener('click', function() {
            sort = this.dataset.sort;
            dir = !dir;
            if (dir === false) {
                element.classList.add('heading-tadle-rotate');
            } else {
                element.classList.remove('heading-tadle-rotate');
            }
            render ();
        })
    });

})();