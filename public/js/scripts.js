const contactsBookInit = (() => {
	let store = {
		contactsBook: []
	};
	// window.localStorage.removeItem("contactsBook"); //just for dev needs

	try {
		store.contactsBook = JSON.parse(window.localStorage.contactsBook);
	} catch (e) {
		store = {
			contactsBook: []
		};
	}

	store.save = () => {
		window.localStorage.contactsBook = JSON.stringify(store.contactsBook);
	};
	let inputsErrors = {
		errorName: false,
		errorPhone: false,
		errorEmail: false
	};

	const contactProto = {
		id: "",
		data: []
	};

	const contactImageProto = {
		name: "",
		phones: [],
		emails: [],
		timestamp: ""
	};

	const createObj = obj => {
		let result = Object.create(obj);
		for (let key in result) {
			result[key] = result[key];
		}
		return result;
	};

	//create basic markup

	let header, main, footer;

	//create div with classes. One class as a string argument, several classes as an array of strings
	const createDiv = className => {
		let div = document.createElement("div");
		if (Array.isArray(className) && className.length > 0) {
			for (let classN of className) {
				div.classList.add(classN);
			}
		} else {
			div.classList.add(className);
		}
		return div;
	};

	//Create header
	(() => {
		let containerFluid, row, headerH1;
		containerFluid = createDiv("container-fluid");
		row = createDiv("row");
		containerFluid.append(row);
		header = document.createElement("header");
		headerH1 = document.createElement("h1");
		headerH1.classList.add("col-12");
		headerH1.innerHTML = "Contacts book";

		row.append(headerH1);
		header.append(containerFluid);
	})();

	//Create main with containers and rows, columns inside
	(() => {
		let container, row, col_11, row_nogutters, col_10;
		container = createDiv("container");
		row = createDiv(["row", "items-center", "wrap"]);
		container.append(row);
		col_11 = createDiv("col-11");
		row.append(col_11);
		row_nogutters = createDiv(["row", "no-gutters", "items-center"]);
		col_10 = createDiv("col-10");
		col_10.id = "contacts-grid";
		row_nogutters.append(col_10);
		col_11.append(row_nogutters);
		main = document.createElement("main");
		main.classList.add("container-fluid");
		main.append(container);
	})();

	//create footer
	(() => {
		footer = document.createElement("footer");
		footer.classList.add("container-fluid");
		let p = document.createElement("p");
		p.innerHTML = "Contacts Book";
		footer.append(p);
	})();

	//create buttons to edit or remove contact card
	const createBtnGroup = type => {
		let btnGroup, btnEdit, btnRemove, btnCancel;
		btnGroup = createDiv("btn-group");
		btnEdit = document.createElement("button");
		btnEdit.classList.add("btn");
		btnEdit.type = "submit";
		btnRemove = document.createElement("button");
		btnRemove.classList.add("btn");
		btnRemove.type = "button";
		btnCancel = document.createElement("button");
		btnCancel.classList.add("btn");
		btnCancel.type = "button";
		btnCancel.classList.add("btn-cancel");
		btnCancel.title = "Cancel";
		btnCancel.innerHTML = "Cancel";

		if (type === "new") {
			btnEdit.classList.add("btn-save");
			btnEdit.title = "Save contact";
			btnEdit.innerHTML = "Save";
			btnRemove.classList.add("btn-reset");
			btnRemove.title = "Reset form";
			btnRemove.innerHTML = "Reset";
			btnRemove.type = "Reset";
		} else {
			btnEdit.classList.add("btn-edit");
			btnEdit.title = "Edit contact";
			btnEdit.innerHTML = "Edit";
			btnRemove.classList.add("btn-remove");
			btnRemove.title = "Remove contact";
			btnRemove.innerHTML = "Remove";
		}
		btnGroup.innerHTML +=
			btnEdit.outerHTML + btnRemove.outerHTML + btnCancel.outerHTML;
		return btnGroup;
	};

	//create button to add new contact card
	const createBtnAddContact = () => {
		let btnAdd = document.createElement("button");
		btnAdd.classList.add("btn", "btn-edit");
		btnAdd.title = "Add contact";
		btnAdd.innerHTML = "Add contact";
		return btnAdd;
	};

	//create buttons to save or remove new contact-item (phone or email)
	const createInputBtns = () => {
		let btnGroup, btnOk, btnCancel, btnOkIcon, btnCancelIcon;
		btnGroup = createDiv("inputBtns");
		btnOk = document.createElement("span");
		btnOk.title = "Add";
		btnCancel = document.createElement("span");
		btnCancel.title = "Remove";
		btnOkIcon = document.createElement("i");
		btnOk.classList.add("inputBtn", "add-i");
		btnOkIcon.classList.add("icofont-plus-circle");
		btnCancelIcon = document.createElement("i");
		btnCancel.classList.add("inputBtn", "remove-i");
		btnCancelIcon.classList.add("icofont-minus-circle");
		btnOk.append(btnOkIcon);
		btnCancel.append(btnCancelIcon);
		btnGroup.innerHTML += btnOk.outerHTML + btnCancel.outerHTML;
		return btnGroup;
	};

	//create contact list item
	const createlistItem = (type, val) => {
		let listItem, icon, valueLink, valueInput;
		listItem = document.createElement("dd");
		icon = document.createElement("i");
		valueLink = document.createElement("a");
		valueLink.classList.add("contact-item");
		valueLink.innerHTML = val;
		valueInput = document.createElement("input");
		valueInput.setAttribute("value", val);
		valueInput.classList.add("control");

		if (type === "phone") {
			icon.classList.add("icofont-mobile-phone");
			valueLink.href = "tel:" + val;
			valueLink.title = "Call me";
			valueInput.classList.add("control", "phonef");
			valueInput.placeholder = "Enter phone number";
			valueInput.maxLength = "11";
			valueInput.type = "phone";
			valueInput.name = "phonef";
		}
		if (type === "email") {
			icon.classList.add("icofont-email");
			valueLink.href = "mailto:" + val;
			valueLink.title = "Send me mail";
			valueInput.classList.add("control", "emailf");
			valueInput.placeholder = "Enter email address";
			valueInput.maxLength = "30";
			valueInput.name = "emailf";
			valueInput.type = "email";
		}

		listItem.innerHTML +=
			icon.outerHTML +
			valueLink.outerHTML +
			valueInput.outerHTML +
			createInputBtns().outerHTML;
		return listItem;
	};

	const createErrorMsg = (type, messageText) => {
		let message = createDiv([type, "errorMsg"]);
		message.innerHTML = messageText;
		return message;
	};

	//create input to enter name on the new contact card
	const createnameInputut = () => {
		let nameInputut = document.createElement("input");
		nameInputut.classList.add("control", "namef");
		nameInputut.type = "text";
		nameInputut.placeholder = "Enter contact's name";
		nameInputut.required = "required";
		nameInputut.name = "namef";
		return nameInputut;
	};

	//create heading with info if contacts book contains contacts or not and suggestion to add new one
	const createWelcomeLine = data => {
		let welcome = createDiv("welcome");
		let welcomeP = document.createElement("h2");
		let btnAdd = createBtnAddContact();
		if (!data) {
			welcomeP.innerHTML =
				"Your contacts Book is empty. Add contacts, please.";
			welcome.innerHTML += welcomeP.outerHTML;
		} else {
			welcomeP.innerHTML = `Contacts Book contains ${data} contacts`;
			welcome.innerHTML += welcomeP.outerHTML + btnAdd.outerHTML;
		}
		document.getElementById("contacts-grid").append(welcome);

		return welcome;
	};

	const createCardHeading = text => {
		let cardHeading = document.createElement("h3");
		cardHeading.innerHTML = text;
		return cardHeading;
	};

	document.body.append(header);
	document.body.append(main);
	document.body.append(footer);

	//create contact-card
	const createContactCard = contact => {
		let card, cardTop, cardHeading, cardBody, phoneList, emailList;
		card = document.createElement("form");
		card.classList.add("contact-card");
		cardTop = createDiv("contact-card-heading");
		cardBody = createDiv(["contact-card-body", "row"]);
		phoneList = document.createElement("dl");
		emailList = document.createElement("dl");
		phoneList.classList.add("col-6", "phone-list");
		emailList.classList.add("col-6", "email-list");

		if (contact) {
			let lastImage = contact.data[contact.data.length - 1];
			cardHeading = createCardHeading(lastImage.name);
			cardTop.innerHTML +=
				cardHeading.outerHTML + createBtnGroup().outerHTML;
			if (lastImage.phones) {
				phoneList.innerHTML += lastImage.phones
					.map(phone => createlistItem("phone", phone).outerHTML)
					.join("\n");
			}
			if (lastImage.emails) {
				emailList.innerHTML += lastImage.emails
					.map(email => createlistItem("email", email).outerHTML)
					.join("\n");
			}
		} else {
			card.classList.add("edit", "new");
			cardTop.append(createnameInputut());
			cardTop.innerHTML += createBtnGroup("new").outerHTML;
			phoneList.append(createlistItem("phone", ""));
			emailList.append(createlistItem("email", ""));
		}

		cardBody.innerHTML += phoneList.outerHTML + emailList.outerHTML;
		card.innerHTML += cardTop.outerHTML + cardBody.outerHTML;
		return card;
	};

	//events handling

	const [listen, unlisten] = (() => {
		let listeningOnType = {};
		let listeners = [];

		const listen = (eventType, cssSelector, func) => {
			let listener = { eventType, cssSelector, func };
			listeners.push(listener);
			if (!listeningOnType[eventType]) {
				window.addEventListener(eventType, e => {
					listeners
						.filter(item => item.eventType === eventType)
						.forEach(listener => {
							if (e.target.closest(listener.cssSelector)) {
								listener.func(e);
							}
						});
				});
				listeningOnType[eventType] = true;
			}
			return listener;
		};

		const unlisten = listener => {
			listeners.slice(listeners.indexOf(listener), 1);
		};

		return [listen, unlisten];
	})();

	let grid = document.getElementById("contacts-grid");
	if (store.contactsBook.length > 0) {
		grid.append(createWelcomeLine(store.contactsBook.length));
		store.contactsBook
			.map(item => {
				let card = createContactCard(item);
				return (grid.innerHTML += card.outerHTML);
			})
			.join("\n");
	} else {
		createWelcomeLine();
		let card = createContactCard();
		card.classList.add("edit", "new");
		grid.append(card);
	}

	let addContactBtn = listen("click", ".welcome .btn-edit", e => {
		if (document.getElementsByClassName("new").length === 0) {
			e.target.offsetParent.insertBefore(
				createContactCard(),
				e.target.offsetParent.childNodes[1]
			);
		}
	});

	let editContactBtn = listen("click", ".contact-card .btn-edit", e => {
		e.preventDefault();
	});

	let cancelContactBtn = listen("click", ".btn-cancel", e => {
		let card = e.target.offsetParent.parentNode;
		if (card.classList.contains("new")) {
			document.getElementById("contacts-grid").removeChild(card);
		}
	});

	const removeError = listen("keyup", ".control", e => {
		let val = e.target.value;

		if (
			inputsErrors.errorPhone &&
			val !== "" &&
			e.target.name === "phonef"
		) {
			e.target.offsetParent.removeChild(
				document.getElementsByClassName("error-phone")[0]
			);
			inputsErrors.errorPhone = false;
		}
		if (
			inputsErrors.errorEmail &&
			val !== "" &&
			e.target.name === "emailf"
		) {
			e.target.offsetParent.removeChild(
				document.getElementsByClassName("error-email")[0]
			);
			inputsErrors.errorEmail = false;
		}
		if (inputsErrors.errorName && val !== "" && e.target.name === "namef") {
			e.target.parentNode.removeChild(
				document.getElementsByClassName("error-name")[0]
			);
			inputsErrors.errorName = false;
		}
	});

	let addPhoneNumber = listen("click", ".phone-list .add-i", e => {
		let val = e.target.parentElement.previousElementSibling.value;
		if (val !== "") {
			e.target.offsetParent.prepend(createlistItem("phone", ""));
		} else {
			inputsErrors.errorPhone = true;
		}
		if (inputsErrors.errorPhone) {
			e.target.offsetParent.append(
				createErrorMsg("error-phone", "Enter number")
			);
		}
	});
	let removePhoneNumber = listen("click", ".phone-list .remove-i", e => {
		e.target.offsetParent.removeChild(e.target.parentElement.parentElement);
	});
	let addEmailAddress = listen("click", ".email-list .add-i", e => {
		let val = e.target.parentElement.previousElementSibling.value;
		if (val !== "") {
			e.target.offsetParent.prepend(createlistItem("email", ""));
		} else {
			inputsErrors.errorEmail = true;
		}
		if (inputsErrors.errorEmail) {
			e.target.offsetParent.append(
				createErrorMsg("error-email", "Enter email")
			);
		}
	});

	let removeEmailAddress = listen("click", ".email-list .remove-i", e => {
		e.target.offsetParent.removeChild(e.target.parentElement.parentElement);
	});

	let saveContact = listen("click", ".btn-save", e => {
		e.preventDefault();
		let nameInput = e.target.offsetParent.getElementsByClassName(
			"namef"
		)[0];

		if (nameInput.value === "") {
			inputsErrors.errorName = true;
			if (inputsErrors.errorName) {
				e.target.parentNode.parentNode.append(
					createErrorMsg("error-name", "Enter name")
				);
			}
			return;
		} else {
			let contact = createObj(contactProto);
			let contactImage = createObj(contactImageProto);
			Object.defineProperties(contact, {
				id: {
					value: "0",
					writable: true
				},
				data: {
					value: [],
					writable: true
				}
			});

			if (store.contactsBook !== null) {
				contact.id = store.contactsBook.length;
			}

			Object.defineProperties(contactImage, {
				name: {
					value: "",
					writable: true
				},
				phones: { value: [], writable: true },
				emails: { value: [], writable: true },
				timestamp: { value: new Date().toISOString(), writable: false }
			});

			let form = e.target.parentElement.parentElement.parentElement;
			let elementList = form.getElementsByClassName("control");

			for (let i = 0; i < elementList.length; i++) {
				let el = elementList[i];

				if (el.name === "phonef" && el.value !== "") {
					contactImage.phones.push(el.value);
					el.previousElementSibling.innerHTML = el.value;
					el.previousElementSibling.href += el.value;
				}
				if (el.name === "emailf" && el.value !== "") {
					contactImage.emails.push(el.value);
					el.previousElementSibling.innerHTML = el.value;
					el.previousElementSibling.href += el.value;
				}
			}

			contactImage.name = nameInput.value;
			nameInput.parentNode.insertBefore(
				createCardHeading(nameInput.value),
				nameInput
			);
			nameInput.parentNode.removeChild(
				form.getElementsByClassName("btn-group")[0]
			);
			nameInput.parentNode.append(createBtnGroup());
			contact.data.push(contactImage);
			store.contactsBook.push(contact);
			store.save();
			let welcome = form.parentNode.getElementsByClassName("welcome")[0];
			form.parentNode.removeChild(welcome);
			form.parentNode.prepend(createContactCard(contact));
			form.parentNode.prepend(
				createWelcomeLine(store.contactsBook.length)
			);
			form.parentNode.removeChild(form);
		}
	});
})();
