function ContactCard(id) {
	this.id = id;
	this.history = [];
	this.currentVersion = 0;
}

ContactCard.prototype.newImage = function() {
	return new ContactCardImage();
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

function ContactCardImage() {
	this.name = "";
	this.phones = [];
	this.emails = [];
	this.timestamp = new Date().toISOString();
	this.comments = [];
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
