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

//create diffent types buttons to add, edit, remove contacts or reset form and cancel editing
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
	if (action === "history") {
		let a = document.createElement("a");
		a.title = "Show contact's history";
		a.innerHTML = "History";
		btn.append(a);
		btn.type = "button";
	}

	return btn;
};

//create button groupss to edit or remove contact card
const createBtnGroup = type => {
	let btnGroup, btnSave, btnEdit, btnHistory, btnRemove, btnCancel;
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
		btnHistory = createBtn("history");
		btnRemove = createBtn("remove");
		btnCancel = createBtn("cancel");
		btnGroup.innerHTML +=
			btnSave.outerHTML +
			btnEdit.outerHTML +
			btnHistory.outerHTML +
			btnRemove.outerHTML +
			btnCancel.outerHTML;
	}

	return btnGroup;
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
		if (val === "") {
			valueInput.setAttribute("data-added", true);
		}
		if (type === "phone") {
			icon.classList.add("icofont-mobile-phone");
			valueInput.classList.add("control", "phonef");
			valueInput.placeholder = "Enter phone number";
			valueInput.maxLength = "11";
			valueInput.type = "tel";
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

		listItem.innerHTML += icon.outerHTML + valueInput.outerHTML;

		if (valueInput.value === "") {
			listItem.append(createInputBtn("add"));
			valueInput.setAttribute("data-added", true);
		} else {
			listItem.append(createInputBtn("remove"));
		}
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

//create error message if invalid input
const createErrorMsg = (type, messageText) => {
	let message = createDiv([type, "errorMsg"]);
	message.innerHTML = messageText;
	return message;
};

//create input to enter name on the new contact card
function createNameInput() {
	let nameInput = document.createElement("input");
	nameInput.classList.add("control", "namef");
	nameInput.type = "text";
	nameInput.placeholder = "Enter contact's name";
	nameInput.required = "required";
	nameInput.name = "namef";
	return nameInput;
}

//create heading with info if contacts book contains contacts or not and suggestion to add new one

const [createGridHeading, updateGridHeading] = (() => {
	const createGridHeading = data => {
		let welcome = createDiv("welcome");
		welcome.id = "grid-heading";
		let welcomeP = document.createElement("h2");
		let btnAdd = createBtn("edit");
		btnAdd.title = "Add contact";
		btnAdd.innerHTML = "Add contact";
		if (!data) {
			welcomeP.innerHTML =
				"Your contacts Book is empty. Add contacts, please.";
			welcome.innerHTML += welcomeP.outerHTML;
		} else {
			welcomeP.innerHTML = `Contacts Book contains ${data} contacts`;
			welcome.innerHTML += welcomeP.outerHTML + btnAdd.outerHTML;
		}
		return welcome;
	};

	const updateGridHeading = data => {
		let oldWelcome = document.getElementById("grid-heading");
		let newWelcome = createGridHeading(data);
		if (oldWelcome) {
			document
				.getElementById("contacts-grid")
				.replaceChild(newWelcome, oldWelcome);
		}
	};
	return [createGridHeading, updateGridHeading];
})();

const createCardHeading = text => {
	let cardHeading = document.createElement("h3");
	cardHeading.innerHTML = text;
	return cardHeading;
};

function createCardElement() {
	let card, cardTop, cardBody, phoneList, emailList;
	card = document.createElement("form");
	card.classList.add("contact-card");
	cardTop = createDiv("contact-card-heading");
	cardBody = createDiv(["contact-card-body", "row"]);
	phoneList = document.createElement("dl");
	emailList = document.createElement("dl");
	phoneList.classList.add("col-6", "phone-list");
	emailList.classList.add("col-6", "email-list");

	cardBody.innerHTML += phoneList.outerHTML + emailList.outerHTML;
	card.innerHTML += cardTop.outerHTML + cardBody.outerHTML;
	return card;
}

//create contact-card
const createContactCard = contact => {
	let cardHeading;
	card = createCardElement();
	if (contact) {
		card.classList.add("read");
		card.setAttribute("data-contactID", contact.id);
		let lastImage = contact.history[0];
		cardHeading = createCardHeading(lastImage.name);
		card.querySelector(".contact-card-heading").innerHTML +=
			cardHeading.outerHTML + createBtnGroup().outerHTML;
		if (lastImage.phones) {
			card.querySelector(".phone-list").innerHTML += lastImage.phones
				.map(phone => createlistItem("read", "phone", phone).outerHTML)
				.join("\n");
		}
		if (lastImage.emails) {
			card.querySelector(".email-list").innerHTML += lastImage.emails
				.map(email => createlistItem("read", "email", email).outerHTML)
				.join("\n");
		}
	} else {
		card.classList.add("new");
		card.querySelector(".contact-card-heading").append(createNameInput());
		card.querySelector(".contact-card-heading").innerHTML += createBtnGroup(
			"new"
		).outerHTML;
		card.querySelector(".phone-list").append(
			createlistItem("edit", "phone", "")
		);
		card.querySelector(".email-list").append(
			createlistItem("edit", "email", "")
		);
	}

	return card;
};

const createUndoRedoIcons = action => {
	let icon;
	icon = document.createElement("i");

	if (action === "undo") {
		icon.classList.add("icofont-undo");
	}
	if (action === "redo") {
		icon.classList.add("icofont-redo");
	}
	return icon;
};

const detailsContent = item => {
	let content, heading, card, historySection, list, col;
	content = document.createElement("div");
	card = createContactCard(item);
	historySection = createDiv([
		"contact-history",
		"row",
		"no-gutters",
		"items-center",
		"history-card"
	]);
	col = createDiv(["col-12", "history-heading"]);
	heading = document.createElement("h3");
	heading.innerHTML = "Contact history";
	col.append(heading);
	col.classList.add("history-card");
	list = createHistoryList(item);
	historySection.innerHTML += list.outerHTML;
	content.innerHTML +=
		card.outerHTML + col.outerHTML + historySection.outerHTML;
	return content;
};

const createHistoryList = item => {
	let list, a, contact;
	contact = {};
	contact = { ...item };
	list = document.createElement("ol");
	list.reversed = "true";
	list.classList.add("history-list", "col-11");

	for (let i = 0; i < contact.history.length; i++) {
		let listItem = document.createElement("li");
		let timestamp = contact.history[i].timestamp.slice(0, 19);
		let restoreBtn = document.createElement("div");
		restoreBtn.classList.add("restore-btn");
		let span = document.createElement("span");
		span.innerHTML += timestamp.replace("T", " at ");
		restoreBtn.title = "Restore to this version";
		let textDiv = document.createElement("div");
		textDiv.innerHTML += "Restore " + createUndoRedoIcons("undo").outerHTML;
		restoreBtn.innerHTML += span.outerHTML + textDiv.outerHTML;
		let comments = document.createElement("ul");
		for (let item in contact.history[i].comments) {
			let li = document.createElement("li");
			li.innerHTML = contact.history[i].comments[item];
			comments.append(li);
		}
		listItem.innerHTML += restoreBtn.outerHTML + comments.outerHTML;
		list.append(listItem);
	}

	return list;
};

const updateHistoryList = item => {
	return createHistoryList(item);
};
