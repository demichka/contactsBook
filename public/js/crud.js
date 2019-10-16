const findContact = id => {
	let data = contactsBookObj.store.contactsBook;
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
	let i = contactsBookObj.store.contactsBook.findIndex(item => item.id == id);
	contactsBookObj.store.contactsBook.splice(i, 1);
	contactsBookObj.store.save();
};

const saveContact = (contact, contactImage, mode) => {
	contact.data.unshift(contactImage);
	if (!mode) {
		contactsBookObj.store.contactsBook.unshift(contact);
	}
};

const updateContact = contact => {
	let card = contactsBookObj.store.contactsBook.findIndex(
		item => item.id == contact.id
	);
	contactsBookObj.store.contactsBook[card] = contact;
};
