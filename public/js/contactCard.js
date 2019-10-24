function ContactCard(obj) {
	if (!obj) {
		this.id = this.createContactId();
		this.history = [];
		this.currentVersion = 0;
		return;
	}

	this.id = obj.id;
	this.currentVersion = obj.currentVersion;
	this.history = obj.history.map(x => new ContactCardImage(x));
}

ContactCard.prototype.createContactId = function() {
	let contactBookIds = Math.max(
		...App.store.contactsBook.map(item => item.id)
	);
	const newContactId =
		App.store.contactsBook.length > 0 ? contactBookIds + 1 : 0;
	return newContactId;
};

//Image is a version of contact, which is created, when user clicks on Save button
ContactCard.prototype.newImage = function() {
	return new ContactCardImage();
};

ContactCard.prototype.getCurrentVersion = function() {
	return this.currentVersion;
};

ContactCard.prototype.addImage = function(image) {
	if (this.history.length) {
		let prevState = this.history[0];

		let isEqualPhones = isEqualArray(image.phones, prevState.phones);
		let isEqualEmails = isEqualArray(image.emails, prevState.emails);
		if (image.name !== prevState.name || !isEqualPhones || !isEqualEmails) {
			this.history = [image, ...this.history];
		}
		return;
	}

	this.history = [image, ...this.history];
};

function isEqualArray(a, b) {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}

function ContactCardImage(obj) {
	if (!obj) {
		this.name = "";
		this.phones = [];
		this.emails = [];
		this.timestamp = new Date().toISOString();
		this.comments = [];
		return;
	}

	this.name = obj.name;
	this.phones = [...obj.phones];
	this.emails = [...obj.emails];
	this.comments = [...obj.comments];
	this.timestamp = obj.timestamp;
}

ContactCardImage.prototype.addPhone = function(phone) {
	this.phones = [...this.phones, phone];
};

ContactCardImage.prototype.addEmail = function(email) {
	this.emails = [...this.emails, email];
};

ContactCardImage.prototype.addName = function(name) {
	this.name = name;
};

ContactCardImage.prototype.addComments = function(comment) {
	this.comments = [...comment];
};
