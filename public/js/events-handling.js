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
	App.clearCurrentContact();
	navigate("/new");
});

const onHistoryBtn = listen("click", ".btn-history", e => {
	const card = e.target.closest(".contact-card");
	let contact = findContact(card.getAttribute("data-contactID"));
	App.currentContact = { ...contact };
	navigate("/history/" + contact.id);
});

const onBackLink = listen("click", ".link-back", e => {
	e.preventDefault();
	App.clearCurrentContact();
	App.clearState();
	if (document.querySelector(".details-content")) {
		document
			.getElementById("details")
			.removeChild(document.querySelector(".details-content"));
	}
});

const onEditContactBtn = listen("click", ".read .btn-edit", e => {
	e.preventDefault();
	const card = e.target.closest(".contact-card");
	let contact = findContact(card.getAttribute("data-contactID"));
	navigate("/edit/" + contact.id);
});

const onCancelContactBtn = listen("click", ".btn-cancel", e => {
	App.clearCurrentContact();
	navigate("/");
});

const onRemoveContactBtn = listen("click", ".btn-remove", e => {
	let card = e.target.closest(".contact-card");
	let cardId = card.getAttribute("data-contactID");
	deleteContact(cardId);
	navigate("/");
});

const onFocus = listen("focusin", ".control", e => {
	App.currentContact.input = e.target.value;
	e.target.removeAttribute("placeholder");
	if (e.target.offsetParent.querySelector(".errorMsg")) {
		e.target.offsetParent.removeChild(
			e.target.offsetParent.querySelector(".errorMsg")
		);
	}
});

const onFocusout = listen("focusout", ".control", e => {
	let comment = "";
	if (App.currentContact.input === e.target.value) {
		return;
	}
	if (App.currentContact.input === "") {
		comment =
			(e.target.type === "tel"
				? "phone"
				: e.target.name === "namef"
				? "name"
				: "email") +
			" added: " +
			e.target.value;
	} else {
		comment =
			(e.target.type === "tel"
				? "phone"
				: e.target.name === "namef"
				? "name"
				: "email") +
			" modified: " +
			App.currentContact.input +
			" to " +
			e.target.value;
	}

	App.currentContact.comments = [...App.currentContact.comments, comment];
});

const onAddPhoneNumber = listen("click", ".phone-list .inputBtn.add-i", e => {
	if (e.target.parentNode.querySelector(".errorMsg")) {
		e.target.offsetParent
			.querySelector(".control")
			.setAttribute("placeholder", "Enter phone number");
		e.target.parentNode.removeChild(
			e.target.parentNode.querySelector(".errorMsg")
		);
	}
	let val = e.target.previousElementSibling.value;
	if (val !== "") {
		document
			.querySelector(".phone-list")
			.prepend(createlistItem("edit", "phone", ""));
		e.target.parentNode.replaceChild(createInputBtn("remove"), e.target);
	} else {
		e.target.parentNode.append(
			createErrorMsg("error-phone", "Field shouldn't be empty")
		);
	}
});

let onRemovePhoneNumber = listen("click", ".phone-list .remove-i", e => {
	let comment =
		"removed phone: " + e.target.parentElement.querySelector("input").value;
	App.currentContact.comments = [...App.currentContact.comments, comment];
	document.querySelector(".phone-list").removeChild(e.target.parentElement);
});

let addEmailAddress = listen("click", ".email-list .add-i", e => {
	if (e.target.parentNode.querySelector(".errorMsg")) {
		e.target.parentNode
			.querySelector(".control")
			.setAttribute("placeholder", "Enter email number");

		e.target.offsetParent.removeChild(
			e.target.parentNode.querySelector(".errorMsg")
		);
	}
	let val = e.target.previousElementSibling.value;
	if (val !== "") {
		document
			.querySelector(".email-list")
			.prepend(createlistItem("edit", "email", ""));
		e.target.parentNode.replaceChild(createInputBtn("remove"), e.target);
	} else {
		e.target.parentNode.append(
			createErrorMsg("error-email", "Field shouldn't be empty")
		);
	}
});

const onRemoveEmailAddress = listen("click", ".email-list .remove-i", e => {
	let comment =
		"removed email: " + e.target.parentElement.querySelector("input").value;
	App.currentContact.comments = [...App.currentContact.comments, comment];
	document.querySelector(".email-list").removeChild(e.target.parentElement);
});

const onSaveContact = listen("click", ".btn-save", e => {
	e.preventDefault();
	let card = e.target.offsetParent.parentNode;
	let cardId = card.getAttribute("data-contactID");
	let edit = false;
	let nameInput = e.target.offsetParent.getElementsByClassName("namef")[0];

	if (nameInput.value === "") {
		if (!document.querySelector(".error-name")) {
			e.target.parentNode.parentNode.prepend(
				createErrorMsg("error-name", "Enter name")
			);
		}
		return;
	} else {
		let contact;
		let contactImage = {};
		if (App.currentContact.id !== "") {
			contact = findContact(cardId);
			edit = true;
		} else {
			contact = new ContactCard("0");

			if (App.store.contactsBook !== null) {
				const contactBookIds = App.store.contactsBook.map(
					item => item.id
				);
				const newContactId =
					contactBookIds.length > 0
						? Math.max(...contactBookIds) + 1
						: 0;
				contact.id = newContactId;
			}
		}
		contactImage = contact.newImage();

		let form = e.target.parentElement.parentElement.parentElement;
		let elementList = form.getElementsByClassName("control");

		for (let i = 0; i < elementList.length; i++) {
			let el = elementList[i];
			if (el.name === "phonef" && el.value !== "") {
				if (isPhoneValid(el.value)) {
					contactImage.addPhone(el.value);
				} else {
					el.parentNode.append(
						createErrorMsg(
							"error-valid",
							"Enter valid phone number"
						)
					);
					App.currentContact.comments.splice(
						App.currentContact.comments.findIndex(item =>
							item.includes(el.value)
						),
						1
					);
					el.placeholder = el.value;
					el.value = "";
				}
			}
			if (el.name === "emailf" && el.value !== "") {
				if (isEmailValid(el.value)) {
					contactImage.addEmail(el.value);
				} else {
					el.parentNode.append(
						createErrorMsg("error-valid", "Enter valid email")
					);
					App.currentContact.comments.splice(
						App.currentContact.comments.findIndex(item =>
							item.includes(el.value)
						),
						1
					);
					el.placeholder = el.value;
					el.value = "";
				}
			}
		}
		if (card.querySelectorAll(".error-valid").length) {
			return;
		}
		contactImage.addComments(App.currentContact.comments);
		contactImage.addName(nameInput.value);
		contact.addImage(contactImage);
		contact.currentVersion = 0;
		updateContact(contact);

		if (!edit) {
			App.store.contactsBook = [contact, ...App.store.contactsBook];
		}
		App.clearCurrentContact();
		App.store.save();
		navigate("/");
		return;
	}
});

const onRestoreBtn = listen("click", ".restore-btn", e => {
	const version = e.target.getAttribute("data-version");

	App.state.historyUndo = [
		...App.state.historyUndo,
		App.currentContact.currentVersion
	];

	App.state.historyRedo = [];

	updateUndoRedoButtons();
	restoreToVersion(version);
});

const onUndoBtn = listen("click", ".undo-btn", e => {
	if (!App.state.historyUndo.length) {
		return;
	}

	const stateToChangeTo = App.state.historyUndo.pop();
	App.state.historyRedo = [
		App.currentContact.currentVersion,
		...App.state.historyRedo
	];

	updateUndoRedoButtons();
	restoreToVersion(stateToChangeTo);
});

const onRedoBtn = listen("click", ".redo-btn", e => {
	if (!App.state.historyRedo.length) {
		return;
	}

	const stateToChangeTo = App.state.historyRedo.shift();
	App.state.historyUndo = [
		...App.state.historyUndo,
		App.currentContact.currentVersion
	];

	updateUndoRedoButtons();
	restoreToVersion(stateToChangeTo);
});

const restoreToVersion = version => {
	App.currentContact.currentVersion = parseInt(version);
	let history = document.querySelectorAll("li");
	history.forEach(item => {
		item.classList.remove("current");
	});
	document
		.querySelector(".details-content")
		.replaceChild(
			createViewContactCard(App.currentContact),
			document.querySelector(".contact-card")
		);

	document
		.querySelector(`[data-version="${version}"]`)
		.classList.add("current");

	updateContact({ ...App.currentContact });
	App.store.save();
};

const updateUndoRedoButtons = () => {
	const btnUndo = document.querySelector(".undo-btn");
	enableButton(btnUndo, App.state.historyUndo.length > 0);

	const btnRedo = document.querySelector(".redo-btn");
	enableButton(btnRedo, App.state.historyRedo.length > 0);
};

const enableButton = (btn, enable) => {
	if (enable) {
		btn.removeAttribute("disabled");
	} else {
		btn.setAttribute("disabled", "disabled");
	}
};

const isEmailValid = a => {
	if (
		a.length <= 4 ||
		a.search("@") === -1 ||
		a.indexOf("@") !== a.lastIndexOf("@") ||
		a.lastIndexOf(".") >= a.length - 2 ||
		a.lastIndexOf(".") <= a.lastIndexOf("@") + 2
	) {
		return false;
	}
	return true;
};

const isPhoneValid = a => {
	let numbers = new RegExp(/^[0-9]{6,12}$/);
	return !!a.match(numbers);
};
