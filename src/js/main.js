// Переменные:
// ------ Страница:
const sectionClients = document.getElementById('section-clients');
const btnOpenFormAdd = document.getElementById('open-form-add');

const modalWindow = document.createElement('div');
modalWindow.classList.add('window-add');

// ------ Таблица:
const listCLients = document.getElementById('list-clients');

const idClientsBtn = document.getElementById('id-clients');
let listID = listCLients.getElementsByClassName('tbody__td-ID');

// Добавление и изменение клиента на сервер:
async function sendDataClient(client, method, id = null) {
  try {
    const response = await fetch(`http://localhost:3000/api/clients/${method === 'POST' ? '' : id}`, {
      method,
      body: JSON.stringify(client)
    });

    httpErrorHandler(response);
    return await response.json();

  } catch (error) {
    console.log(error)
  }
}

// Получение данных с сервера:
async function getDataClient() {
  try {
    const response = await fetch('http://localhost:3000/api/clients/', {
      method: 'GET'
    });

    httpErrorHandler(response);
    return await response.json();

  } catch (error) {
    console.log(error);
  }
}

// Удаление клиента с сервера
async function deleteDataClient(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE',
    });

    httpErrorHandler(response);
    return await response.json();
    
  } catch (error) {
    console.log(error);
  }
}

// Фильтр клиентов 
async function filterClient(value) {
  try {
    const response = await fetch(`http://localhost:3000/api/clients?search=${value}`, {
      method: 'GET'
    });
    
    return await response.json();

  } catch (error) {
    console.log(error);
  }
}

// HTTP ошибки
async function httpErrorHandler(response) {
  let info;
  const modalForm = document.querySelector('.form');
  const inputsForm = document.getElementsByClassName('form__input');
  const validateField = document.getElementById('validateField');

  function removeError(input) {
    if (input.classList.contains('validate')) {
      input.classList.remove('validate');
    }
  }

  function createError(text) {
    validateField.textContent = text;
    document.querySelector('.form__btn-contact').classList.add('error');
    document.querySelector('.form__validate').style.marginBottom = '10px';
  }

  function inputError() {
    for (const input of inputsForm) {
      removeError(input);
  
      function onInputValue(input) {
        input.addEventListener('input', function() {
          input.classList.remove('validate');
  
          if (document.getElementsByClassName('validate').length == 0) {
            validateField.textContent = '';
            document.querySelector('.form__validate').style.marginBottom = '0px';
            document.querySelector('.form__btn-contact').classList.remove('error');
          }
        })
      }
    
      onInputValue(input);
  
      if (input.dataset.required == 'true') {
        if (input.value.trim() == '') {
          removeError(input);
          input.classList.add('validate');
          document.querySelector('.form__btn-contact').classList.add('error');
        }
      } 
    }
  }
  
  inputError();

  async function createTextError() {
    if (response.status === 200 || response.status === 201) {
      if (modalForm) {
        modalForm.classList.add('active');
      }
    } else {
      if (response.status >= 500) {
        info = `Данные не сохранены. Ответ сервера - ${response.status}. Ошибка работы сервера.`;
        console.log(info);
      } else {
        switch (response.status) {
          case 404:
            info = `Переданный в запросе метод не существует или запрашиваемый элемент не найден в базе данных`;
            console.log(info);
            break;
          case 422:
            const errors = await response.json();
            errors.errors.forEach(function (error) {
              if (info) {
                info = 'Не указаны фамилия и имя клиента';
              } else {
                info = error.message;
              }
            })
            break;
          default:
            info = `Что-то пошло не так...`;
            break;
        }
        createError(info);
      }
    }
  }

  createTextError();
}

// Форматирование даты и времени:
function date(str) {
  let date = str.slice(0, 10);
  let newDate = date.replace(/(\d*)-(\d*)-(\d*)/, '$3.$2.$1');
  return newDate;
}

function time(str) {
  let time = str.slice(11, 16);
  return time;
}

// Прелоадер
function createPreloader() {
  const preloaderTable = document.createElement('div');
  const preloaderImg = document.createElement('div');

  preloaderTable.classList.add('preloader');
  preloaderImg.classList.add('preloader__img');
  preloaderTable.id = 'preloader';

  listCLients.append(preloaderTable);
  preloaderTable.append(preloaderImg);

  return preloaderTable;
}

// Создание HTML элементов
function createElement(name, attrs, text) {
  let variable = document.createElement(name);

  if (attrs) {
    for (let key in attrs) {
      if (key == 'class') {
        variable.className = attrs[key];
      } else if (key == 'id') {
        variable.id = attrs[key];
      } else {
        variable.setAttribute(key, attrs[key]);
      }
    }
  }

  if (text) {
    variable.textContent = text;
  }

  return variable;
}

// Создание таблицы:
function createTable(data) {
  let ID = data.id;
  let fullName = data.surname + ' ' + data.name + ' ' + data.lastName;
  let createDate = date(data.createdAt);
  let createTime = time(data.createdAt);
  let changeDate = date(data.updatedAt);
  let changeTime = time(data.updatedAt);
  
  const tableRow = document.createElement('tr');
  tableRow.classList.add('tbody__tr');
  tableRow.id = ID;

  const clientID = createElement('td', {'class': 'tbody__td-ID', 'id': ID}, ID);
  const clientFullName = createElement('td', {'class': 'tbody__td-fullname', 'id': ID}, fullName);
  const clientCreated = createElement('td', {'class': 'tbody__td-created', 'id': 'ID'}, '');
  const clientCreateDate = createElement('span', {'class': 'tbody__td-date'}, createDate);
  const clientCreateTime = createElement('span', {'class': 'tbody__td-time'}, createTime);
  const clientChanged = createElement('td', {'class': 'tbody__td-changed'}, '');
  const clientChangeDate = createElement('span', {'class': 'tbody__td-date'}, changeDate);
  const clientChangeTime = createElement('span', {'class': 'tbody__td-time'}, changeTime);
  const clientContacts = createElement('td', {'class': 'tbody__td-contacts'}, '');
  const clientActions = createElement('td', {'class': 'tbody__td-actions'}, '');
  const clientActionsEditBtn = createElement('button', {'class': 'tbody__td-btn'}, 'Изменить');
  const clientActionsDeleteBtn = createElement('button', {'class': 'tbody__td-btn'}, 'Удалить');
  const editSpinner = createElement('div', {'class': 'tbody__td-spinner'}, '');
  const deleteSpinner = createElement('div', {'class': 'tbody__td-spinner'}, '');

  editSpinner.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#9873FF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
  </svg>`;
  deleteSpinner.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke="#F06A4D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
  </svg>`;

  clientContacts.append(getContacts(data.contacts));

  idClientsBtn.addEventListener('click', function() {
    if (!this.classList.contains('active')) { 
      for (let i = 0; i < listID.length; i++) {
        listID[i].classList.remove('active');
      }
      listID[0].classList.add('active');
    } else {
      this.classList.remove('active');
    }
  });

  tableRow.append(clientID, clientFullName, clientCreated, clientChanged, clientContacts, clientActions);
  clientCreated.append(clientCreateDate, clientCreateTime);
  clientChanged.append(clientChangeDate, clientChangeTime);
  clientActions.append(clientActionsEditBtn, clientActionsDeleteBtn);
  clientActionsEditBtn.prepend(editSpinner);
  clientActionsDeleteBtn.prepend(deleteSpinner);

  // ------ Открытие модального окна изменения данных
  function openChangeModal() {
    clientActionsEditBtn.addEventListener('click', function() {
      editSpinner.classList.add('active');
      clientActionsEditBtn.classList.add('disabled');
  
      setTimeout(() => {
        changeClientForm(data);
        editSpinner.classList.remove('active');
        clientActionsEditBtn.classList.remove('disabled');
      }, 400);
    });
  }
  
  openChangeModal();

  // ------ Открытие окна подтверждения удаления --> Удаление клиента
  function openDeleteModal() {
    clientActionsDeleteBtn.addEventListener('click', function() {
      deleteSpinner.classList.add('active');
      clientActionsDeleteBtn.classList.add('disabled');
  
      setTimeout(() => {
        const deleteClient = deleteClientForm();
  
        deleteClient.deleteModalBtnDelete.addEventListener('click', function() {
          deleteDataClient(data.id);
          document.getElementById(data.id).remove();
  
          closeModal(deleteClient.deleteModal);
        });
        deleteSpinner.classList.remove('active');
        clientActionsDeleteBtn.classList.remove('disabled');
      }, 400);
    });
  }
  
  openDeleteModal();

  return tableRow;
}

// Модальное окно "Новый клиент":
function createModalForm() {
  const formTitle = createElement('h4', {'class': 'form__title'}, 'Новый клиент');
  const formFullName = createElement('div', {'class': 'form__fullname-client'}, '');
  const itemSurname = createElement('div', {'class': 'form__item'}, '');
  const inputSurname = createElement('input', {'class': 'form__input', 'id': 'surnameModal'}, '');
  const labelSurname = createElement('span', {'class': 'form__label'}, 'Фамилия');
  const requiredSurname = createElement('span', {'class': 'required'}, '*');
  const itemName = createElement('div', {'class': 'form__item'}, '');
  const inputName = createElement('input', {'class': 'form__input', 'id': 'nameModal'}, '');
  const labelName = createElement('span', {'class': 'form__label'}, 'Имя');
  const requiredName = createElement('span', {'class': 'required'}, '*');
  const itemLastName = createElement('div', {'class': 'form__item'}, '');
  const inputLastName = createElement('input', {'class': 'form__input', 'id': 'lastNameModal'}, '');
  const labelLastName = createElement('span', {'class': 'form__label'}, 'Отчество');
  const selectContact = createElement('div', {'class': 'contact'}, '');
  const btnContact = createElement('button', {'class': 'form__btn-contact'}, 'Добавить контакт');
  const btnSave = createElement('button', {'class': 'form__btn-save'}, 'Сохранить');
  const btnCancel = createElement('button', {'class': 'form__btn-cancel'}, 'Отмена');
  const btnClose = createElement('button', {'class': 'form__btn-close'}, '');

  inputSurname.dataset.required = 'true';
  inputSurname.type = 'text';
  inputSurname.placeholder = 'Фамилия';

  inputName.dataset.required = 'true';
  inputName.type = 'text';
  inputName.placeholder = 'Имя';

  inputLastName.type = 'text';
  inputLastName.placeholder = 'Отчество';

  btnClose.innerHTML = `<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2333 7.73333L21.2666 6.76666L14.4999 13.5334L7.73324 6.7667L6.76658 7.73336L13.5332 14.5L6.7666 21.2667L7.73327 22.2333L14.4999 15.4667L21.2666 22.2334L22.2332 21.2667L15.4666 14.5L22.2333 7.73333Z" fill="#B0B0B0"/>
  </svg>`;

  // ------ Поле с ошибкой валидации
  const validateModal = createElement('p', {'class': 'form__validate'}, '');
  const validateField = createElement('span', {'class': '', 'id': 'validateField'}, '');

  formFullName.append(itemSurname, itemName, itemLastName);
  itemSurname.append(inputSurname, labelSurname);
  itemName.append(inputName, labelName);
  itemLastName.append(inputLastName, labelLastName);
  labelSurname.append(requiredSurname);
  labelName.append(requiredName);
  validateModal.append(validateField);

  // ------ Добавить/удалить селект с контактами
  function interactSelectContact() {
    btnContact.addEventListener('click', function(event) {
      event.preventDefault();
  
      const contactItems = document.querySelectorAll('select');
      const contactItem = createContactSelect();
  
      if (contactItems.length < 9) {
        selectContact.append(contactItem.contact);
        btnContact.classList.add('active');
      } 
      
      if (selectContact.childNodes.length === 10) {
        btnContact.disabled = true;
        btnContact.classList.add('disabled');
        btnSave.classList.add('active');
      }
  
      contactItem.contactBtnDelete.addEventListener('click', function() {
        if (selectContact.childNodes.length == 0) {
          btnContact.classList.remove('active');
        }
  
        if (selectContact.childNodes.length < 10) {
          btnContact.disabled = false;
          btnContact.classList.remove('disabled');
          btnSave.classList.remove('active');
        }
      });
    })
  }

  interactSelectContact();

  return {
    formTitle,
    formFullName,
    inputSurname,
    inputName,
    inputLastName,
    selectContact,
    btnContact,
    validateModal,
    btnSave,
    btnCancel,
    btnClose
  };
}

// Открыть модальное окно "Новый клиент":
function openAddClientModal() {
  btnOpenFormAdd.addEventListener('click', function() {
    addClientForm();
  });
}

openAddClientModal();

// Добавление клиента из модального окна:
function addClientForm() {
  const createModal = createModalForm();

  const modalForm = createElement('div', {'class': 'form', 'id': 'modalNewClient'}, '');

  sectionClients.append(modalWindow);
  modalWindow.append(modalForm);
  modalForm.append(createModal.formTitle, createModal.formFullName, createModal.selectContact, createModal.btnContact, createModal.validateModal, createModal.btnSave, createModal.btnCancel, createModal.btnClose);

  function saveClient() {
    createModal.btnSave.addEventListener('click', async function(event) {
      event.preventDefault();
  
      let contacts = [];
      let clientObj = {};
  
      const contactTypes = document.querySelectorAll('.select__type-btn');
      const contactValues = document.querySelectorAll('.select__input');
  
      for (let i = 0; i < contactTypes.length; i++) {
        if (!validateClientContact()) {
          return
        }
  
        contacts.push({
          type: contactTypes[i].innerHTML,
          value: contactValues[i].value
        });
      }
      
      clientObj.name = createModal.inputName.value;
      clientObj.surname = createModal.inputSurname.value;
      clientObj.lastName = createModal.inputLastName.value;
  
      clientObj.contacts = contacts;
  
      try {
        const data = await sendDataClient(clientObj, 'POST');
  
        listCLients.append(createTable(data));
  
        setTimeout(() => {
          closeModal(modalForm);
        }, 500);
        
      } catch (error) {
        console.log(error);
      }
    })
  }
  
  saveClient();

  // ------ Закрыть модальное окно:
  createModal.btnCancel.addEventListener('click', function() {
    closeModal(modalForm);
  });
  
  createModal.btnClose.addEventListener('click', function() {
    closeModal(modalForm);
  });

  modalWindow.addEventListener('click', clickOverlay);

  return modalForm;
};

function closeModal(modal) {
  modal.remove();
  modalWindow.remove();
}

// Клик на оверлей
function clickOverlay(event) {
  if (!event.target.classList.contains('window-add')) {
    return
  }

  if (document.getElementById('modalNewClient')) {
    closeModal(document.getElementById('modalNewClient'));
  }

  if (document.getElementById('modalChange')) {
    closeModal(document.getElementById('modalChange'));
  }

  if (document.getElementById('deleteModal')) {
    closeModal(document.getElementById('deleteModal'));
  }
}

// Создание списка контактов
function createContactSelect() {
  const contact = createElement('div', {'class': 'contact__select select'}, '');
  const contactType = createElement('div', {'class': 'select__type'}, '');
  const contactTypeBtn = createElement('button', {'class': 'select__type-btn'}, 'Телефон');
  const contactTypeList = createElement('ul', {'class': 'select__type-list'}, '');
  const contactListEmail = createElement('li', {'class': 'select__type-item'}, 'Email');
  const contactListVk = createElement('li', {'class': 'select__type-item'}, 'Vk');
  const contactListFb = createElement('li', {'class': 'select__type-item'}, 'Facebook');
  const contactListOther = createElement('li', {'class': 'select__type-item'}, 'Другое');
  const contactInput = createElement('input', {'class': 'select__input'}, '');
  const contactBtnDelete = createElement('button', {'class': 'select__btn-delete'}, '');
  const contactDeleteTooltip = createElement('div', {'class': 'select__btn-tooltip'}, 'Удалить контакт');

  contactInput.type = 'text';
  contactInput.placeholder = 'Введите данные контакта';
  contactBtnDelete.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
  </svg>`;

  if (document.documentElement.clientWidth < 480) {
    contactInput.placeholder = 'Введите данные';
  }

  contact.append(contactType, contactInput, contactBtnDelete);
  contactType.append(contactTypeBtn, contactTypeList);
  contactTypeList.append(contactListEmail, contactListVk, contactListFb, contactListOther);
  contactBtnDelete.append(contactDeleteTooltip);

  // ------ Удалить контакт
  contactBtnDelete.addEventListener('click', function(event) {
    event.preventDefault();
    contact.remove();
  });

  // ------ Открытие/закрытие списка с контактами
  contactTypeBtn.addEventListener('click', function() {
    contactTypeList.classList.add('active');
    contactTypeBtn.classList.add('active');
  });

  contactType.addEventListener('mouseleave', function() {
    contactTypeList.classList.remove('active');
    contactTypeBtn.classList.remove('active');
  });

  const typesArray = [contactListEmail, contactListVk, contactListFb, contactListOther];

  for (const type of typesArray) {
    itemType(type);
  }

  function itemType(type) {
    type.addEventListener('click', function() {
      contactTypeBtn.textContent = type.textContent;
      contactTypeList.classList.remove('active');  

      function changeItemType() {
        if (contactTypeBtn.textContent == 'Email') {
          contactListEmail.textContent = 'Телефон';
          contactListVk.textContent = 'Vk';
          contactListFb.textContent = 'Facebook';
          contactListOther.textContent = 'Другое';
        }

        if (contactTypeBtn.textContent == 'Vk') {
          contactListVk.textContent = 'Телефон';
          contactListEmail.textContent = 'Email';
          contactListFb.textContent = 'Facebook';
          contactListOther.textContent = 'Другое';
        }

        if (contactTypeBtn.textContent == 'Facebook') {
          contactListFb.textContent = 'Телефон';
          contactListEmail.textContent = 'Email';
          contactListVk.textContent = 'Vk';
          contactListOther.textContent = 'Другое';
        }

        if (contactTypeBtn.textContent == 'Другое') {
          contactListOther.textContent = 'Телефон';
          contactListEmail.textContent = 'Email';
          contactListVk.textContent = 'Vk';
          contactListFb.textContent = 'Facebook';
        }

        if (contactTypeBtn.textContent == 'Телефон') {
          contactListOther.textContent = 'Другое';
          contactListEmail.textContent = 'Email';
          contactListVk.textContent = 'Vk';
          contactListFb.textContent = 'Facebook';
        }
      }

      changeItemType();
    })
  }  
  
  return {
    contact, 
    contactType,
    contactTypeBtn, 
    contactInput, 
    contactBtnDelete
  };
}

// Добавление контактов в таблицу
function getContacts(data) {
  const listContacts = document.createElement('div');
  listContacts.classList.add('contacts');

  function createIconContact() {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type == 'Телефон') {
        const itemPhone = document.createElement('a');
        itemPhone.classList.add('contacts__item');
  
        let phone = data[i].value;
  
        itemPhone.setAttribute('data-tooltip', `Телефон: ${phone}`);
        const phoneIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
        <circle cx="8" cy="8" r="8" fill="#9873FF"/>
        <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
        </g>
        </svg>`;
        itemPhone.href = phone;
        itemPhone.innerHTML = phoneIcon;
        listContacts.append(itemPhone);
      }
      
      if (data[i].type == 'Email') {
        const itemEmail = document.createElement('a');
        itemEmail.classList.add('contacts__item');
  
        itemEmail.setAttribute('data-tooltip', `E-mail: ${data[i].value}`);
        const emailIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
        </svg>`;
        itemEmail.href = data[i].value.trim();
        itemEmail.innerHTML = emailIcon;
        listContacts.append(itemEmail);
      }
  
      if (data[i].type == 'Vk') {
        const itemVk = document.createElement('a');
        itemVk.classList.add('contacts__item');
  
        itemVk.setAttribute('data-tooltip', `Vk: ${data[i].value}`);
        const vkIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
        <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
        </g>
        </svg>`;
        itemVk.href = data[i].value.trim();
        itemVk.innerHTML = vkIcon;
        listContacts.append(itemVk);
      }
  
      if (data[i].type == 'Facebook') {
        const itemFb = document.createElement('a');
        itemFb.classList.add('contacts__item');
  
        itemFb.setAttribute('data-tooltip', `Facebook: ${data[i].value}`);
        const fbIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
        <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
        </g>
        </svg>`;
        itemFb.href = data[i].value.trim();
        itemFb.innerHTML = fbIcon;
        listContacts.append(itemFb);
      }
  
      if (data[i].type == 'Другое') {
        const itemOther = document.createElement('a');
        itemOther.classList.add('contacts__item');
  
        itemOther.setAttribute('data-tooltip', `Контакт: ${data[i].value}`);
        const otherIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
        </svg>`;
        itemOther.href = data[i].value.trim();
        itemOther.innerHTML = otherIcon;
        listContacts.append(itemOther);
      }   
    }
  }
  
  createIconContact();

  function createShowMoreBtn() {
    if (data.length > 4) {
      const contacts = Array.from(listContacts.childNodes);
  
      for (const icon of contacts.slice(4)) {
        icon.classList.add('hidden')
      }
  
      let showMore = document.createElement('button');
      showMore.classList.add('contacts__btn-more');
      showMore.textContent = `+${data.length-4}`;
  
      showMore.addEventListener('click', function(e) {
          e.preventDefault()
          showMore.remove();
          for (const icon of contacts.slice(4)) {
            icon.classList.remove('hidden')
          }
        })
  
      listContacts.append(showMore);
    }   
  }

  createShowMoreBtn();

  return listContacts;
}

// Модальное окно изменение клиента:
function changeClientForm(data) {
  const createModal = createModalForm();

  const modalChangeForm = createElement('div', {'class': 'form', 'id': 'modalChange'}, '');
  const headerIdTitle = createElement('div', {'class': 'form__header'}, '');
  const idTitle = createElement('span', {'class': 'form__Id'}, 'ID: ' + data.id);

  sectionClients.append(modalWindow);
  modalWindow.append(modalChangeForm);
  headerIdTitle.append(createModal.formTitle, idTitle);
  modalChangeForm.append(headerIdTitle, createModal.formFullName, createModal.selectContact, createModal.btnContact, createModal.validateModal, createModal.btnSave, createModal.btnCancel, createModal.btnClose);
  
  createModal.formTitle.textContent = 'Изменить данные';
  createModal.btnCancel.textContent = 'Удалить клиента';
  
  createModal.inputName.value = data.name;
  createModal.inputSurname.value = data.surname;
  createModal.inputLastName.value = data.lastName;

  function interactSelectContact() {
    for (const contact of data.contacts) {
      const createContact = createContactSelect();
  
      setTimeout(() => {
        if (createModal.selectContact.childNodes.length === 10) {
          createModal.btnContact.disabled = true;
          createModal.btnContact.classList.add('disabled');
          createModal.btnSave.classList.add('active');
        }
    
        createContact.contactBtnDelete.addEventListener('click', function() {
          if (createModal.selectContact.childNodes.length < 10) {
            createModal.btnContact.disabled = false;
            createModal.btnContact.classList.remove('disabled');
            createModal.btnSave.classList.remove('active');
          }
  
          if (createModal.selectContact.childNodes.length == 0) {
            createModal.btnContact.classList.remove('active');
          }
        });
    
        if (createModal.selectContact.childNodes.length != 0) {
          createModal.btnContact.classList.add('active');
        } 
      }, 1);
  
      createContact.contactTypeBtn.textContent = contact.type;
      createContact.contactInput.value = contact.value;
  
      createModal.selectContact.append(createContact.contact);
    }
  }

  interactSelectContact();
  
  // ------ Изменение клиента
  function changeClient() {
    createModal.btnSave.addEventListener('click', async function(event) {
      event.preventDefault();
  
      let contacts = [];
      let client = {};
  
      const contactTypes = document.querySelectorAll('.select__type-btn');
      const contactValues = document.querySelectorAll('.select__input');
  
      for (let i = 0; i < contactTypes.length; i++) {
        if (!validateClientContact(contactTypes[i], contactValues[i])) {
          return
        }
        
        contacts.push({
          type: contactTypes[i].innerHTML,
          value: contactValues[i].value
        });
      }
      
      client.name = createModal.inputName.value;
      client.surname = createModal.inputSurname.value;
      client.lastName = createModal.inputLastName.value;
      client.contacts = contacts;
  
      try {
        const editData = await sendDataClient(client, 'PATCH', data.id);
        document.getElementById(editData.id).remove();
  
        listCLients.append(createTable(editData));
  
        modalChangeForm.classList.add('active');
  
        setTimeout(() => {
          closeModal(modalChangeForm);
        }, 500);
  
      } catch (error) {
        console.log(error);
      }
    })
  }

  changeClient();

  // ------ Удаление клиента
  function deleteClient() {
    createModal.btnCancel.addEventListener('click', function() {
      closeModal(modalChangeForm);

      const deleteClient = deleteClientForm();
      
      deleteClient.deleteModalBtnDelete.addEventListener('click', function() {
        deleteDataClient(data.id);
        document.getElementById(data.id).remove();
  
        closeModal(deleteClient.deleteModal);
      })

      deleteClient.deleteModalBtnCancel.addEventListener('click', function() {
        closeModal(deleteClient.deleteModal);
        sectionClients.append(modalWindow);
        modalWindow.append(modalChangeForm);
      });
    
      deleteClient.deleteModalBtnClose.addEventListener('click', function() {
        closeModal(deleteClient.deleteModal);
        sectionClients.append(modalWindow);
        modalWindow.append(modalChangeForm);
      });
    });
  }
  
  deleteClient();

  // ------ Закрыть модальное окно:
  createModal.btnClose.addEventListener('click', function() {
    closeModal(modalChangeForm);
  });

  modalWindow.addEventListener('click', clickOverlay);
}

// Модальное окно удаление клиента:
function deleteClientForm() {
  const deleteModal = createElement('div', {'class': 'delete', 'id': 'deleteModal'}, '');
  const deleteModalTitle = createElement('h4', {'class': 'delete__title'}, 'Удалить клиента');
  const deleteModalDescription = createElement('p', {'class': 'delete__description'}, 'Вы действительно хотите удалить данного клиента?');
  const deleteModalBtnDelete = createElement('button', {'class': 'delete__btn-delete'}, 'Удалить');
  const deleteModalBtnCancel = createElement('button', {'class': 'delete__btn-cancel'}, 'Отмена');
  const deleteModalBtnClose = createElement('button', {'class': 'delete__btn-close'}, '');

  deleteModalBtnClose.innerHTML = `<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2333 7.73333L21.2666 6.76666L14.4999 13.5334L7.73324 6.7667L6.76658 7.73336L13.5332 14.5L6.7666 21.2667L7.73327 22.2333L14.4999 15.4667L21.2666 22.2334L22.2332 21.2667L15.4666 14.5L22.2333 7.73333Z" fill="#B0B0B0"/>
  </svg>`;

  sectionClients.append(modalWindow);
  modalWindow.append(deleteModal);
  deleteModal.append(deleteModalTitle, deleteModalDescription, deleteModalBtnDelete, deleteModalBtnCancel, deleteModalBtnClose);

  // ------ Закрытие модального окна
  deleteModalBtnCancel.addEventListener('click', function() {
    closeModal(deleteModal);
  });

  deleteModalBtnClose.addEventListener('click', function() {
    closeModal(deleteModal);
  });
  
  modalWindow.addEventListener('click', clickOverlay);

  return {
    deleteModal,
    deleteModalBtnDelete,
    deleteModalBtnCancel,
    deleteModalBtnClose
  }
}

// Валидация контактов
function validateClientContact() {
  const validateField = document.getElementById('validateField');
  const inputsContact = document.getElementsByClassName('select__input');
  
  function removeError(input) {
    if (input.classList.contains('validate')) {
      input.classList.remove('validate');
    }
  }

  function createError(text) {
    validateField.textContent = text;
    document.querySelector('.form__validate').style.marginBottom = '10px';
  }

  let result = true;

  for (const input of inputsContact) {
    removeError(input);

    function onInputValue(input) {
      input.addEventListener('input', function() {
        input.classList.remove('validate');

        if (document.getElementsByClassName('validate').length == 0) {
          validateField.textContent = '';
          document.querySelector('.form__validate').style.marginBottom = '0px';
          document.querySelector('.form__btn-contact').classList.remove('error');
        }
      })
    }
  
    onInputValue(input);
    
    if (input.value == '') {
      removeError(input);
      createError('Обязательно для заполнения');
      input.classList.add('validate');
      document.querySelector('.form__btn-contact').classList.add('error');
      result = false;
    } 
  }
  
  return result;
}

// Сортировка данных таблицы
function sortClient() {
  const theads = document.getElementsByClassName('thead__btn');
  const tbody = document.querySelector('tbody');
  const directions = Array.from(theads).map(() => '');

  function transform(type, content) {
    switch (type) {
      case 'id':
        return parseFloat(content);
      case 'create':
      case 'update':
        return content.spli('.').reverse().join('-');
      case 'text':
      default:
        return content;
    }
  }

  function sortColumn(index) {
    const type = theads[index].getAttribute('data-type');
    const rows = tbody.querySelectorAll('tr');
    const direction = directions[index] || 'sortUp';
    const changeDirection = direction === 'sortUp' ? 1 : -1;
    const newRows = Array.from(rows);

    newRows.sort((row1, row2) => {
      const cellA = row1.querySelectorAll('td')[index].textContent;
      const cellB = row2.querySelectorAll('td')[index].textContent;
      const a = transform(type, cellA);
      const b = transform(type, cellB);

      switch(true) {
        case a > b:
          return 1 * changeDirection;
        case a < b:
          return -1 * changeDirection;
        default:
          break;
        case a === b:
          return 0;  
      };
    });
    
    [].forEach.call(rows, (row) => {
      tbody.removeChild(row);
    });

    directions[index] = direction === 'sortUp' ? 'sortDown' : 'sortUp';

    newRows.forEach(newRow => {
      tbody.appendChild(newRow);
    });
  };
  
  [].forEach.call(theads, function(thead, index) {
    thead.addEventListener('click', function() {
      sortColumn(index);

      if (thead.classList.contains('sort-down')) {
        thead.classList.remove('sort-down');
        thead.classList.add('sort-up');
      } else {
        thead.classList.remove('sort-up');
        thead.classList.add('sort-down');
      }

      if (thead.classList.contains('sort-up') || thead.classList.contains('sort-down')) {
        idClientsBtn.classList.remove('active');
        for (let i = 0; i < listID.length; i++) {
          listID[i].classList.remove('active');
        };
      } 
    });
  });

  return theads;
}

// Поиск клиента
function filterClients() {
  const inputForm = document.getElementById('form-request');
  const inputFilter = document.getElementById('request');
  
  inputForm.addEventListener('submit', function(event) {
    event.preventDefault()
  })

  const filterList = document.querySelector('.filter-list');

  // ------ Якоря
  function getAnchors() {
    const anchors = document.querySelectorAll('a[href*="#"]');
  
    for (let anchor of anchors) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        
        const blockID = anchor.getAttribute('href').substr(1);
  
        document.getElementById(blockID).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })

        filterList.classList.add('hide');
  
        const fullNames = document.querySelectorAll('.tbody__td-fullname');

        for (const fullName of fullNames) {
          if (fullName.id == blockID) {
            fullName.classList.add('found');
            inputFilter.value = fullName.textContent;
          }

          if (inputFilter.value == fullName) {
            fullName.classList.remove('found');
          }
        }
      })
    }
  }

  // ------ Выпадающий список
  function createListItems(clients, list) {
    for (const client of clients) {
      const filterItem = document.createElement('li');
      const filterLink = document.createElement('a');
  
      filterItem.classList.add('filter-list__item');
      filterLink.classList.add('filter-list__link');
  
      filterLink.textContent = `${client.surname} ${client.name} ${client.lastName}`;
  
      filterLink.href = `#${client.id}`;
  
      filterItem.append(filterLink);
      filterList.append(filterItem);
    }

    return list;
  }

  // ------ Поиск клиентов
  async function findCLient() {
    const valueFilter = inputFilter.value.trim();

    clearListOfSearch(filterList);

    setTimeout(() => {
      getAnchors();
    }, 300);

    let listItemsElements;

    if (valueFilter) {
      const response = await filterClient(valueFilter);
      
      if (response.length) {
        listItemsElements = createListItems(response, filterList).querySelectorAll('.filter-list__item'); 
        filterList.classList.remove('hide');

        const filterLinkFound = document.querySelectorAll('.filter-list__link');

        for (const link of filterLinkFound) {
          if (link.innerText.search(valueFilter) == -1) {
            link.innerHTML = link.innerText;
          } 
        } 
      } else {
        listItemsElements = null;
      }
    } else {
      listItemsElements = null;
    }

    function clearListOfSearch(list) {
      list.innerHTML = '';
      filterList.classList.add('hide');
    }
  }

  let timeoutId = null;

  // ------ Ввод данных поиска
  inputFilter.addEventListener('input', async function() {
    const clearBtn = document.getElementById('form-clear')

    if (inputFilter.value != 0) {
      clearBtn.classList.add('visible');
    }

    if (inputFilter.value == 0) {
      clearBtn.classList.remove('visible');
    }

    const fullNames = document.querySelectorAll('.tbody__td-fullname');

    for (const fullName of fullNames) {
      if (inputFilter != fullName.textContent) {
        fullName.classList.remove('found');
      }

      if (inputFilter.value == fullName.textContent) {
        fullName.classList.add('found');
      }

      clearBtn.addEventListener('click', function(event) {
        event.preventDefault();
        clearBtn.classList.remove('visible');
        inputFilter.value = '';
        filterList.classList.add('hide');
        fullName.classList.remove('found');
      })
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      findCLient();
    }, 300);
  })
}

// Отрисовка таблицы:
async function render() {
  try {
    listCLients.innerHTML = '';

    const clients = await getDataClient();

    filterClients(clients);

    for (const client of clients) {
      listCLients.append(createTable(client));
    }
  } catch (error) {
    console.log(error)
  } finally {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('active');
    
    if (listCLients.offsetHeight <= 150) {
      preloader.style.height = '300px';
    }

    let tableRow = document.querySelectorAll('.tbody__tr');
 
    setTimeout(() => {
      btnOpenFormAdd.classList.remove('disabled');
      preloader.remove();
      if (tableRow.length > 0) {
      }
    }, 700);
  }
};

render();

document.addEventListener("DOMContentLoaded", function() {
  btnOpenFormAdd.classList.add('disabled');
  idClientsBtn.classList.add('active');
  listCLients.append(createPreloader());
  sortClient();
});





//   // Фильтрация
// function filterClients(clients) {
//   const inputFilter = document.getElementById('request');


//   async function rewriteTable(str) {
//     const response = await filterClient(str);
  
//     listCLients.innerHTML = '';
  
//     for (const client of response) {
//       listCLients.append(createTable(client));
//     } 

//     listCLients.append(createPreloader());
//     const preloader = document.getElementById('preloader');

//     if (listCLients.offsetHeight <= 150) {
//       preloader.style.height = '300px';
//     }

//     setTimeout(() => {
//       preloader.remove();
//     }, 300);
//   }

//   inputFilter.addEventListener('input', async function() {
//     const valueFilter = inputFilter.value.trim();

//     if (valueFilter !== '') {
//       rewriteTable(valueFilter);
//     } else {
//       listCLients.innerHTML = '';

//       for (const client of clients) {
//         listCLients.append(createTable(client));
//       } 

//       listCLients.append(createPreloader());
      
//       setTimeout(() => {
//         preloader.remove();
//       }, 300);
//     }
//   })
// }



// // Поиск клиента
// function filterClients(clients) {
//   const inputFilter = document.getElementById('request');
//   const filterList = document.querySelector('.filter-list');

//   // ------ Якоря
//   function getAnchors() {
//     const anchors = document.querySelectorAll('a[href*="#"]');
  
//     for (let anchor of anchors) {
//       anchor.addEventListener('click', function (e) {
//         e.preventDefault()
        
//         const blockID = anchor.getAttribute('href').substr(1);
  
//         document.getElementById(blockID).scrollIntoView({
//           behavior: 'smooth',
//           block: 'start'
//         })

//         inputFilter.value = '';
//         filterList.classList.add('hide');
  
//         const fullNames = document.querySelectorAll('.tbody__td-fullname');

//         for (const fullName of fullNames) {
//           if (fullName.id == blockID) {
//             fullName.classList.add('found');
//           }

//           if (inputFilter.value == fullName) {
//             fullName.classList.remove('found');
//           }
//         }
//       })
//     }
//   }

//   // ------ Выпадающий список
//   for (const client of clients) {
//     const filterItem = document.createElement('li');
//     const filterLink = document.createElement('a');

//     filterItem.classList.add('filter-list__item');
//     filterLink.classList.add('filter-list__link');

//     filterLink.textContent = `${client.surname} ${client.name} ${client.lastName}`;

//     filterLink.href = `#${client.id}`;

//     filterItem.append(filterLink);
//     filterList.append(filterItem);
//   }

//   async function rewriteTable() {
//     setTimeout(() => {
//       getAnchors();
//     }, 300);
//   }

//   // ------ Найденные клиенты
//   inputFilter.addEventListener('input', async function() {
//     const valueFilter = inputFilter.value.trim();
//     const filterLinkFound = document.querySelectorAll('.filter-list__link');

//     rewriteTable();

//     for (const link of filterLinkFound) {

//       if (valueFilter) {
//         rewriteTable();


//         if (link.innerText.search(valueFilter) == -1) {
//           link.classList.add('hide');
//           link.innerHTML = link.innerText;

//           console.log(link.innerText)
//         } else {
//           link.classList.remove('hide');
//           filterList.classList.remove('hide');
//           const str = link.innerText;
//           link.innerHTML = insertMark(str, link.innerText.search(valueFilter), valueFilter.length);
//         }
//       } else {
//         for (const link of filterLinkFound) {
//           link.classList.remove('hide');
//           filterList.classList.add('hide');
//           link.innerHTML = link.innerText;
//         }
//       }
//     }
//   })

//   const insertMark = (str, pos, len) => str 
//     .slice(0, pos) + '<span>' + str
//     .slice(pos, pos + len) + '</span>' + str
//     .slice(pos + len);
// }










// else {
//   const str = link.innerText;
//   link.innerHTML = insertMark(str, link.innerText.search(valueFilter), valueFilter.length);
// }



// const insertMark = (str, pos, len) => str 
//   .slice(0, pos) + '<span>' + str
//   .slice(pos, pos + len) + '</span>' + str
//   .slice(pos + len);





// const phoneMask = '+7 (999) 999 99 99';
// const emailMask = '*{1,50}[.*{1,50}][.*{1,50}]@*{1,50}.*{1,20}[.*{1,20}][.*{1,20}]';
// const otherMask = '[*{1,50}]';

// inputMask(phoneMask);

// if (contactTypeBtn.textContent == 'Телефон') {
//   inputMask(phoneMask);
// }

// if (contactTypeBtn.textContent == 'Email') {
//   inputMask(emailMask);
//   console.log('321123')
// }

// if (contactTypeBtn.textContent == 'Vk') {
//   inputMask(otherMask);
// }

// if (contactTypeBtn.textContent == 'Facebook') {
//   inputMask(otherMask);
// }

// if (contactTypeBtn.textContent == 'Другое') {
//   inputMask(otherMask);
// }
  
  


  // // Маска телефона
  // function inputMask(mask) {
  //   let im = new Inputmask(mask);
  //   im.mask(contactInput);
  // }

// // Валидация формы
// function validateClientForm() {
//   const validateField = document.getElementById('validateField');
//   const inputsForm = document.getElementsByClassName('form__input');

//   function removeError(input) {
//     if (input.classList.contains('validate')) {
//       input.classList.remove('validate');
//     }
//   }

//   function createError(text) {
//     validateField.textContent = text;
//     document.querySelector('.form__validate').style.marginBottom = '10px';
//   }

//   let result = true;

//   for (const input of inputsForm) {
//     removeError(input);

//     function onInputValue(input) {
//       input.addEventListener('input', function() {
//         input.classList.remove('validate');

//         if (document.getElementsByClassName('validate').length == 0) {
//           validateField.textContent = '';
//           document.querySelector('.form__validate').style.marginBottom = '0px';
//           document.querySelector('.form__btn-contact').classList.remove('error');
//         }
//       })
//     }
  
//     onInputValue(input);

//     if (input.dataset.required == 'true') {
//       if (input.value.trim() == '') {
//         removeError(input);
//         createError('Обязательно для заполнения');
//         input.classList.add('validate');
//         document.querySelector('.form__btn-contact').classList.add('error');
//         result = false;
//       }
//     } 
//   }

//   return result;
// }