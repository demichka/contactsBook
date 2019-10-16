function ContactCard(id) {
	this.id = id;
	this.history = [];
}

ContactCard.prototype.newImage = function() {
	return new ContactCardImage();
};

ContactCard.prototype.addImage = function(image) {
	this.history.unshift(image);
};

function ContactCardImage() {
	this.name = "";
	this.phones = [];
	this.emails = [];
	this.timestamp = new Date().toISOString();
}

ContactCardImage.prototype.addPhone = function(phone) {
	this.phones.push(phone);
};

ContactCardImage.prototype.addEmail = function(email) {
	this.emails.push(email);
};

ContactCardImage.prototype.addName = function(name) {
	this.name = name;
};
