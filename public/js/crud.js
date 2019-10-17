const findContact = id => {
	let data = App.store.contactsBook;
	let contact = new ContactCard("");
	let result = data.find(contact => {
		return contact.id == id;
	});
	if (result) {
		Object.assign(contact, result);
	}
	return contact;
};

const deleteContact = id => {
	let i = App.store.contactsBook.findIndex(item => item.id == id);
	App.store.contactsBook.splice(i, 1);
	App.store.save();
};

const saveContact = (contact, contactImage, mode) => {
	contact.data.unshift(contactImage);
	if (!mode) {
		App.store.contactsBook.unshift(contact);
	}
};

const updateContact = contact => {
	let card = App.store.contactsBook.findIndex(item => item.id == contact.id);
	App.store.contactsBook[card] = contact;
};
