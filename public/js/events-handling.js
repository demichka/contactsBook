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

const onAddContactBtn = listen("click", ".welcome .btn-edit", e => {
	if (document.getElementsByClassName("new").length === 0) {
		e.target.offsetParent.insertBefore(
			createContactCard(),
			e.target.offsetParent.childNodes[1]
		);
	}
});

const onHistoryBtn = listen("click", ".btn-history", e => {
	let card = e.target.offsetParent.parentNode;
	let cardID = card.getAttribute("data-contactID");
	Router.onNavigate("/details");
	document.getElementById("details").setAttribute("data-contactID", cardID);
	let contact = findContact(cardID);

	document.getElementById("details").innerHTML += detailsContent(
		contact
	).outerHTML;

	return false;
});

const onEditContactBtn = listen("click", ".read .btn-edit", e => {
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
		if (input.parentNode.offsetParent.classList.contains("phone-list")) {
			input.name = "phonef";
			input.type = "phone";
			input.parentNode.append(createInputBtn("remove"));
		}
		if (input.parentNode.offsetParent.classList.contains("email-list")) {
			input.name = "emailf";
			input.type = "email";
			input.parentNode.append(createInputBtn("remove"));
		}
	}

	e.target.parentNode.removeChild(e.target);
});

const onCancelContactBtn = listen("click", ".btn-cancel", e => {
	let card = e.target.offsetParent.parentNode;
	if (
		card.classList.contains("new") &&
		document
			.getElementById("contacts-grid")
			.getElementsByClassName("contact-card").length > 1
	) {
		document.getElementById("contacts-grid").removeChild(card);
	}
	if (card.classList.contains("edit")) {
		let cardId = card.getAttribute("data-contactID");
		console.log(cardId);
		let contact = findContact(cardId);
		let originalCard = createContactCard(contact);
		document
			.getElementById("contacts-grid")
			.replaceChild(originalCard, card);
	}
});

const onRemoveContactBtn = listen("click", ".btn-remove", e => {
	let card = e.target.offsetParent.parentNode;
	let grid = document.getElementById("contacts-grid");
	let cardId = card.getAttribute("data-contactID");
	deleteContact(cardId);
	if (grid) {
		grid.removeChild(card);
		if (
			contactsBookObj.store.contactsBook.length === 0 &&
			document.getElementsByClassName("new").length === 0
		) {
			grid.append(createContactCard());
		}
		updateGridHeading(contactsBookObj.store.contactsBook.length);
	} else {
		window.location = "/";
	}
});

const onKeyUpInput = listen("keyup", ".control", e => {
	let val = e.target.value;

	if (val !== "" && e.target.name === "phonef") {
		if (e.target.offsetParent.querySelector(".error-phone")) {
			e.target.offsetParent.removeChild(
				document.querySelector(".error-phone")
			);
		}
	}
	if (val !== "" && e.target.name === "emailf") {
		if (e.target.offsetParent.querySelector(".error-email")) {
			e.target.offsetParent.removeChild(
				document.querySelector(".error-email")
			);
		}
	}
	if (val !== "" && e.target.name === "namef") {
		if (e.target.offsetParent.querySelector(".error-name")) {
			e.target.offsetParent.removeChild(
				document.querySelector(".error-name")
			);
		}
	}
});

const onAddPhoneNumber = listen("click", ".phone-list .inputBtn.add-i", e => {
	let val = e.target.previousElementSibling.value;
	if (val !== "") {
		e.target.offsetParent.prepend(createlistItem("edit", "phone", ""));
		e.target.parentNode.replaceChild(createInputBtn("remove"), e.target);
	} else {
		e.target.offsetParent.append(
			createErrorMsg("error-phone", "Enter number")
		);
	}
});
let onRemovePhoneNumber = listen("click", ".phone-list .remove-i", e => {
	e.target.offsetParent.removeChild(e.target.parentElement);
});
let addEmailAddress = listen("click", ".email-list .add-i", e => {
	let val = e.target.previousElementSibling.value;
	if (val !== "") {
		e.target.offsetParent.prepend(createlistItem("edit", "email", ""));
		e.target.parentNode.replaceChild(createInputBtn("remove"), e.target);
	} else {
		e.target.offsetParent.append(
			createErrorMsg("error-email", "Enter email")
		);
	}
});

const onRemoveEmailAddress = listen("click", ".email-list .remove-i", e => {
	e.target.offsetParent.removeChild(e.target.parentElement);
});

const onSaveContact = listen("click", ".btn-save", e => {
	e.preventDefault();
	let card = e.target.offsetParent.parentNode;
	let cardId = card.getAttribute("data-contactID");
	let edit = false;
	let nameInput = e.target.offsetParent.getElementsByClassName("namef")[0];

	if (nameInput.value === "") {
		e.target.parentNode.parentNode.append(
			createErrorMsg("error-name", "Enter name")
		);
		return;
	} else {
		let contact;
		let contactImage = {};
		if (cardId !== null) {
			contact = findContact(cardId);
			edit = true;
		} else {
			contact = new ContactCard("0");

			if (contactsBookObj.store.contactsBook !== null) {
				contact.id = contactsBookObj.store.contactsBook.length;
			}
		}
		contactImage = contact.newImage();

		let form = e.target.parentElement.parentElement.parentElement;
		let elementList = form.getElementsByClassName("control");

		for (let i = 0; i < elementList.length; i++) {
			let el = elementList[i];

			if (el.name === "phonef" && el.value !== "") {
				contactImage.addPhone(el.value);
				el.previousElementSibling.innerHTML = el.value;
				el.previousElementSibling.href += el.value;
			}
			if (el.name === "emailf" && el.value !== "") {
				contactImage.addEmail(el.value);
				el.previousElementSibling.innerHTML = el.value;
				el.previousElementSibling.href += el.value;
			}
		}

		contactImage.addName(nameInput.value);
		contact.addImage(contactImage);
		updateContact(contact);
		if (!edit) {
			contactsBookObj.store.contactsBook.unshift(contact);
		}
		contactsBookObj.store.save();

		updateGridHeading(contactsBookObj.store.contactsBook.length);
		form.parentNode.replaceChild(createContactCard(contact), form);
	}
});
