function contactsBookInit() {
	this.pages = [
		{ route: "/", renderFuncton: renderHome },
		{ route: /^\/edit\/[0-9]+$/, renderFuncton: renderEdit },
		{ route: /^\/history\/[0-9]+$/, renderFuncton: renderHistory },
		{ route: "/new", renderFuncton: renderNew }
	];

	this.store = {
		contactsBook: []
	};
	const store = this.store;

	this.currentContact = {
		id: "",
		comments: []
	};

	this.clearCurrentContact = () => {
		this.currentContact.id = "";
		this.currentContact.comments = [];
		delete this.currentContact.phones;
		delete this.currentContact.emails;
	};

	// window.localStorage.removeItem("contactsBook"); //just for dev needs

	try {
		this.store.contactsBook = JSON.parse(window.localStorage.contactsBook);
	} catch (e) {
		this.store = {
			contactsBook: []
		};
	}

	console.log(this.store, "store");

	this.store.savePrevState = () => {
		this.store.prevState = [...this.store.contactsBook];
	};

	this.store.save = () => {
		window.localStorage.contactsBook = JSON.stringify(
			this.store.contactsBook
		);
	};

	//create basic markup
	const content = document.getElementById("root");

	function renderHome(path) {
		if (store.contactsBook.length === 0) {
			navigate("/new");
			return;
		}

		cleanContent(content);

		const grid = createContactsGrid();

		grid.append(createGridHeading(store.contactsBook.length));

		store.contactsBook
			.map(item => {
				let card = createViewContactCard(item);
				return (grid.innerHTML += card.outerHTML);
			})
			.join("\n");

		content.append(grid);
	}

	function renderNew(path) {
		cleanContent(content);

		const grid = createContactsGrid();

		grid.append(createGridHeading("new"));
		grid.append(createEmptyContactCard());

		content.append(grid);
	}

	function renderEdit(path) {
		const id = parseInt(path.split("/")[2]);
		cleanContent(content);

		const grid = createContactsGrid();

		grid.append(createGridHeading(store.contactsBook.length));

		store.contactsBook
			.map(item => {
				const card =
					item.id === id
						? createEditContactCard(item)
						: createViewContactCard(item);

				return (grid.innerHTML += card.outerHTML);
			})
			.join("\n");

		let card = grid.querySelector(".edit");
		let contact = findContact(card.getAttribute("data-contactID"));
		App.currentContact = { ...contact.history[0] };
		App.currentContact.id = contact.id;
		App.currentContact.comments = [];

		content.append(grid);
	}

	function renderHistory(path) {
		const id = parseInt(path.split("/")[2]);
		cleanContent(content);

		const details = createDetails();

		const history = detailsContent(
			store.contactsBook.find(item => item.id === id)
		);

		details.append(history);

		content.append(details);
	}

	function cleanContent(element) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	}
}

const App = new contactsBookInit();
