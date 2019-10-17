function ContactCard(id) {
	this.id = id;
	this.history = [];
}

ContactCard.prototype.newImage = function() {
	return new ContactCardImage();
};

ContactCard.prototype.addImage = function(image) {
	this.history = [image, ...this.history];
};

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
	this.comments = [...this.comments, comment];
};
