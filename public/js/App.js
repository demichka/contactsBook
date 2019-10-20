function contactsBookInit() {
	this.pages = [
		{ route: "/", renderFuncton: renderHome.bind(this) },
		{ route: /^\/edit\/[0-9]+$/, renderFuncton: renderEdit.bind(this) },
		{
			route: /^\/history\/[0-9]+$/,
			renderFuncton: renderHistory.bind(this)
		},
		{ route: "/new", renderFuncton: renderNew.bind(this) }
	];

	this.store = {
		contactsBook: []
	};

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

	this.state = {
		historyUndo: [],
		historyRedo: []
	};

	this.clearState = () => {
		(this.state.historyUndo = []), (this.state.historyRedo = []);
	};

	this.store.save = () => {
		window.localStorage.contactsBook = JSON.stringify(
			this.store.contactsBook
		);
	};

	//create basic markup
	const content = document.getElementById("root");

	function renderHome(path) {
		if (this.store.contactsBook.length === 0) {
			navigate("/new");
			return;
		}

		cleanContent(content);

		const grid = createContactsGrid();

		grid.append(createGridHeading(this.store.contactsBook.length));

		this.store.contactsBook
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

		grid.append(createGridHeading(this.store.contactsBook.length));

		this.store.contactsBook
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
		let history;
		cleanContent(content);

		const details = createDetails();

		App.currentContact = {
			...this.store.contactsBook.find(item => item.id === id)
		};
		history = detailsContent(App.currentContact);

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
