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

	console.log(store, "store");

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

	const createBtn = action => {
		let btn = document.createElement("button");
		btn.classList.add("btn", `btn-${action}`);
		if (action === "edit") {
			btn.title = "Edit contact";
			btn.innerHTML = "Edit";
			btn.type = "button";
		}
		if (action === "save") {
			btn.title = "Save changes";
			btn.innerHTML = "Save";
			btn.type = "submit";
		}
		if (action === "remove") {
			btn.title = "Remove contact";
			btn.innerHTML = "Remove";
			btn.type = "button";
		}
		if (action === "cancel") {
			btn.title = "Cancel";
			btn.innerHTML = "Cancel";
			btn.type = "button";
		}
		if (action === "reset") {
			btn.title = "Reset form";
			btn.innerHTML = "Reset";
			btn.type = "reset";
		}

		return btn;
	};

	//create buttons to edit or remove contact card
	const createBtnGroup = type => {
		let btnGroup, btnSave, btnEdit, btnRemove, btnCancel;
		btnGroup = createDiv("btn-group");
		if (type === "new") {
			btnSave = createBtn("save");
			btnRemove = createBtn("reset");
			btnCancel = createBtn("cancel");
			btnGroup.innerHTML +=
				btnSave.outerHTML + btnRemove.outerHTML + btnCancel.outerHTML;
		} else {
			btnSave = createBtn("save");
			btnEdit = createBtn("edit");
			btnRemove = createBtn("remove");
			btnCancel = createBtn("cancel");
			btnGroup.innerHTML +=
				btnSave.outerHTML +
				btnEdit.outerHTML +
				btnRemove.outerHTML +
				btnCancel.outerHTML;
		}

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
	const createInputBtn = action => {
		let btn, btnIcon;
		btn = document.createElement("span");
		btn.classList.add("inputBtn");
		btnIcon = document.createElement("i");
		if (action === "add") {
			btn.classList.add("add-i");
			btn.title = "Add item";
			btnIcon.classList.add("icofont-plus-circle");
		}
		if (action === "remove") {
			btn.classList.add("remove-i");
			btn.title = "Remove item";
			btnIcon.classList.add("icofont-minus-circle");
		}
		btn.append(btnIcon);
		return btn;
	};

	//create contact list item
	const createlistItem = (mode, type, val) => {
		let listItem, icon, valueLink, valueInput;
		listItem = document.createElement("dd");
		icon = document.createElement("i");

		if (mode === "edit") {
			valueInput = document.createElement("input");
			valueInput.setAttribute("value", val);
			valueInput.classList.add("control");
			if (type === "phone") {
				icon.classList.add("icofont-mobile-phone");
				valueInput.classList.add("control", "phonef");
				valueInput.placeholder = "Enter phone number";
				valueInput.maxLength = "11";
				valueInput.type = "phone";
				valueInput.name = "phonef";
			}
			if (type === "email") {
				icon.classList.add("icofont-email");
				valueInput.classList.add("control", "emailf");
				valueInput.placeholder = "Enter email address";
				valueInput.maxLength = "30";
				valueInput.name = "emailf";
				valueInput.type = "email";
			}

			listItem.innerHTML +=
				icon.outerHTML +
				valueInput.outerHTML +
				createInputBtn("add").outerHTML;
		}
		if (mode === "read") {
			valueLink = document.createElement("a");
			valueLink.classList.add("contact-item");
			valueLink.innerHTML = val;
			if (type === "phone") {
				icon.classList.add("icofont-mobile-phone");
				valueLink.href = "tel:" + val;
				valueLink.title = "Call me";
			}
			if (type === "email") {
				icon.classList.add("icofont-email");
				valueLink.href = "mailto:" + val;
				valueLink.title = "Send me mail";
			}
			listItem.innerHTML += icon.outerHTML + valueLink.outerHTML;
		}

		return listItem;
	};

	const createErrorMsg = (type, messageText) => {
		let message = createDiv([type, "errorMsg"]);
		message.innerHTML = messageText;
		return message;
	};

	//create input to enter name on the new contact card
	const createNameInput = () => {
		let nameInput = document.createElement("input");
		nameInput.classList.add("control", "namef");
		nameInput.type = "text";
		nameInput.placeholder = "Enter contact's name";
		nameInput.required = "required";
		nameInput.name = "namef";
		return nameInput;
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
			card.classList.add("read");
			card.setAttribute("data-contactId", contact.id);
			let lastImage = contact.data[0];
			cardHeading = createCardHeading(lastImage.name);
			cardTop.innerHTML +=
				cardHeading.outerHTML + createBtnGroup().outerHTML;
			if (lastImage.phones) {
				phoneList.innerHTML += lastImage.phones
					.map(
						phone =>
							createlistItem("read", "phone", phone).outerHTML
					)
					.join("\n");
			}
			if (lastImage.emails) {
				emailList.innerHTML += lastImage.emails
					.map(
						email =>
							createlistItem("read", "email", email).outerHTML
					)
					.join("\n");
			}
		} else {
			card.classList.add("new");
			cardTop.append(createNameInput());
			cardTop.innerHTML += createBtnGroup("new").outerHTML;
			phoneList.append(createlistItem("edit", "phone", ""));
			emailList.append(createlistItem("edit", "email", ""));
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

	let editContactBtn = listen("click", ".read .btn-edit", e => {
		e.preventDefault();
		let card, links, input, phoneList, emailList, name, nameInput;
		card = e.target.offsetParent.parentNode;
		card.classList.add("edit");
		card.classList.remove("read");
		name = card.getElementsByTagName("h3")[0];
		nameInput = createNameInput();
		nameInput.value = name.innerHTML;

		name.parentNode.replaceChild(nameInput, name);
		phoneList = card.getElementsByClassName("phone-list")[0];
		emailList = card.getElementsByClassName("email-list")[0];
		links = card.getElementsByClassName("contact-item");

		phoneList.prepend(createlistItem("edit", "phone", ""));
		emailList.prepend(createlistItem("edit", "email", ""));

		for (let i = 0; i < links.length; i++) {
			let el = links[i];
			input = document.createElement("input");
			input.classList.add("control", "contact-item");
			input.value = el.innerHTML;

			el.parentNode.replaceChild(input, el);
			if (
				input.parentNode.offsetParent.classList.contains("phone-list")
			) {
				input.name = "phonef";
				input.type = "phone";
				input.parentNode.append(createInputBtn("remove"));
			}
			if (
				input.parentNode.offsetParent.classList.contains("email-list")
			) {
				input.name = "emailf";
				input.type = "email";
				input.parentNode.append(createInputBtn("remove"));
			}
		}

		e.target.parentNode.removeChild(e.target);
	});

	function findContact(id) {
		let data = store.contactsBook;
		let result = data.find(contact => {
			return contact.id == id;
		});
		return result;
	}

	const contactPromise = id =>
		new Promise(resolve => {
			findContact(id);
		});

	let cancelContactBtn = listen("click", ".btn-cancel", e => {
		let card = e.target.offsetParent.parentNode;
		if (card.classList.contains("new")) {
			document.getElementById("contacts-grid").removeChild(card);
		}
		if (card.classList.contains("edit")) {
			let cardId = card.getAttribute("data-contactid");
			let contact = findContact(cardId);
			let originalCard = createContactCard(contact);
			document
				.getElementById("contacts-grid")
				.replaceChild(originalCard, card);
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

	let addPhoneNumber = listen("click", ".phone-list .inputBtn.add-i", e => {
		let val = e.target.previousElementSibling.value;
		if (val !== "") {
			e.target.offsetParent.prepend(createlistItem("edit", "phone", ""));
			e.target.parentNode.append(createInputBtn("remove"));
			e.target.parentNode.removeChild(e.target);
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
		e.target.offsetParent.removeChild(e.target.parentElement);
	});
	let addEmailAddress = listen("click", ".email-list .add-i", e => {
		let val = e.target.previousElementSibling.value;
		if (val !== "") {
			e.target.offsetParent.prepend(createlistItem("edit", "email", ""));
			e.target.parentNode.append(createInputBtn("remove"));
			e.target.parentNode.removeChild(e.target);
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
		e.target.offsetParent.removeChild(e.target.parentElement);
	});

	let saveContact = listen("click", ".btn-save", e => {
		e.preventDefault();
		let card = e.target.offsetParent.parentNode;
		let cardId = card.getAttribute("data-contactid");
		let edit = false;
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
			let contact;
			let contactImage = {};
			if (cardId !== null) {
				contact = findContact(cardId);
				edit = true;
			} else {
				contact = createObj(contactProto);
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
			}

			contactImage = createObj(contactImageProto);
			Object.defineProperties(contactImage, {
				name: {
					value: "",
					writable: true
				},
				phones: { value: [], writable: true },
				emails: { value: [], writable: true },
				timestamp: {
					value: new Date().toISOString(),
					writable: false
				}
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
			contact.data.unshift(contactImage);
			if (!edit) {
				store.contactsBook.unshift(contact);
			}
			store.save();
			let welcome = form.parentNode.getElementsByClassName("welcome")[0];
			form.parentNode.replaceChild(
				createWelcomeLine(store.contactsBook.length),
				welcome
			);
			form.parentNode.replaceChild(createContactCard(contact), form);
		}
	});
})();
