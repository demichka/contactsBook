const contactsBook = (() => {
    let header, main, footer;


//create div with classes. One class as a string argument, several classes as an array of strings    
const createDiv = (className) => {
    let div = document.createElement('div');
    if(Array.isArray(className) && className.length > 0) {
        for (let classN of className) {
            div.classList.add(classN);
        }
    }
    else {
        div.classList.add(className);
    }
    return div;
}


//Create header
(() => {
    let containerFluid, row, headerH1;
    containerFluid = createDiv('container-fluid');
    row = createDiv('row');
    containerFluid.append(row);
    header = document.createElement('header');
    headerH1 = document.createElement('h1');
    headerH1.classList.add('col-12');
    headerH1.innerHTML ='Contacts book';

    row.append(headerH1);
    header.append(containerFluid);
})();

//Create main with containers and rows, columns inside
(() => {
    let container, row, col_11, row_nogutters, col_10;
    container = createDiv('container');
    row = createDiv(['row', 'items-center', 'wrap']);
    container.append(row);
    col_11 = createDiv('col-11');
    row.append(col_11);
    row_nogutters = createDiv(['row', 'no-gutters', 'items-center']);
    col_10 = createDiv('col-10');
    col_10.id = "contacts-grid";
    row_nogutters.append(col_10);
    col_11.append(row_nogutters);
    main = document.createElement('main');
    main.classList.add('container-fluid');
    main.append(container);
})();


//create footer
(() => {
    footer = document.createElement('footer');
    footer.classList.add('container-fluid');
    let p = document.createElement('p');
    p.innerHTML = "Contacts Book";
    footer.append(p);
})();

//create buttons to edit or remove contact card
const createBtnGroup = () => {
    let btnGroup, btnEdit, btnRemove;
    btnGroup = createDiv('btn-group');
    btnEdit = document.createElement('button');
    btnEdit.classList.add('btn', 'btn-edit');
    btnEdit.title = 'Edit contact';
    btnEdit.innerHTML = 'Edit';
    btnRemove = document.createElement('button');
    btnRemove.classList.add('btn', 'btn-remove');
    btnRemove.title = 'Remove contact';
    btnRemove.innerHTML = 'Remove';
    btnGroup.innerHTML += btnEdit.outerHTML + btnRemove.outerHTML;
    return btnGroup;
}

//create contact list item
const createlistItem = (type, val) => {
    let listItem, icon, valueLink, valueInput;
    listItem = document.createElement('dd');
    icon = document.createElement('i');
    valueLink = document.createElement('a');
    valueLink.classList.add('contact-item');
    valueLink.innerHTML = val;
    valueInput = document.createElement('input');
    valueInput.setAttribute('value', val);
    valueInput.type = 'text';
    valueInput.classList.add('control');
    
    if(type === 'phone') {
        icon.classList.add('icofont-mobile-phone');
        valueLink.href = 'tel:' + val;
        valueLink.title = 'Call me';
    }
    if(type === 'email') {
        icon.classList.add('icofont-email');
        valueLink.href = 'mailto:' + val;
        valueLink.title = 'Send me mail';
    }

    listItem.innerHTML += icon.outerHTML + valueLink.outerHTML + valueInput.outerHTML;
    return listItem;
}

//create contact-card
const createContactCard = () => {
    let card, cardTop, cardHeading, cardBody, phoneList, emailList;
    card = createDiv(['contact-card']);
    cardTop = createDiv('contact-card-heading');
    cardHeading = document.createElement('h3');
    cardHeading.innerHTML = "Eugenia Demicheva";
    cardTop.innerHTML += cardHeading.outerHTML + createBtnGroup().outerHTML;
    cardBody = createDiv(['contact-card-body', 'row']);
    phoneList = document.createElement('dl');
    emailList = document.createElement('dl');
    phoneList.classList.add('col-6', 'phone-list');
    emailList.classList.add('col-6', 'email-list');

    phoneList.innerHTML += createlistItem('phone', '46739996975').outerHTML;
    emailList.innerHTML += createlistItem('email', 'example@example.me').outerHTML;
    cardBody.innerHTML += phoneList.outerHTML + emailList.outerHTML;
    card.innerHTML += cardTop.outerHTML + cardBody.outerHTML;
    return card;
}


document.body.append(header);
document.body.append(main);
document.body.append(footer);

document.getElementById('contacts-grid').append(createContactCard());
})();