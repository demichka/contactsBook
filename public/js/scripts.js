function contactsBookInit() {
	this.store = {
		contactsBook: []
	};

	this.currentContact = {
		id: "",
		comments: []
	};

	console.log(this.currentContact);

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

	let header, main, footer;

	const grid = (() => {
		let grid = createDiv("col-10");
		grid.id = "contacts-grid";
		return grid;
	})();

	const details = (() => {
		let details = createDiv("col-10");
		details.id = "details";
		let detailsHeading = createDiv("welcome");
		let heading = document.createElement("h2");
		heading.innerHTML = "Contact's details and history";
		let linkBack = document.createElement("a");
		linkBack.classList.add("link-back");
		linkBack.innerHTML = "Back to contacts";
		linkBack.title = "Go back to all contacts";
		linkBack.href = "/";
		let icon = document.createElement("i");
		icon.classList.add("icofont-long-arrow-left");
		linkBack.prepend(icon);
		detailsHeading.innerHTML += heading.outerHTML + linkBack.outerHTML;
		details.append(detailsHeading);
		return details;
	})();

	const routes = {
		"/": grid,
		"/details": details
	};

	const content = (() => {
		let content = createDiv(["row", "no-gutters", "items-center"]);
		content.id = "root";
		content.append(routes[window.location.pathname]);
		return content;
	})();

	Router.onNavigate = path => {
		let currentPage = content.childNodes[0];

		window.history.pushState({}, path, window.location.origin + path);

		content.replaceChild(routes[path], currentPage);
	};

	window.onpopstate = () => {
		let currentPage = content.childNodes[0];

		content.replaceChild(routes[window.location.pathname], currentPage);
	};

	//Create header
	(() => {
		let containerFluid, row, headerH1, a;
		containerFluid = createDiv("container-fluid");
		row = createDiv("row");
		containerFluid.append(row);
		header = document.createElement("header");
		headerH1 = document.createElement("h1");
		a = document.createElement("a");
		a.href = "/";
		a.title = "Contacts Book";
		a.innerHTML = "Contacts Book";
		headerH1.classList.add("col-12");
		headerH1.innerHTML += a.outerHTML;

		row.append(headerH1);
		header.append(containerFluid);
	})();

	//Create main with containers and rows, columns inside
	(() => {
		let container, row, col_11;
		container = createDiv("container");
		row = createDiv(["row", "items-center", "wrap"]);
		container.append(row);
		col_11 = createDiv("col-11");
		row.append(col_11);
		col_11.append(content);
		main = document.createElement("main");
		main.classList.add("container-fluid");
		main.append(container);
	})();

	//create footer
	(() => {
		footer = document.createElement("footer");
		footer.classList.add("container-fluid");
		let p = document.createElement("p");
		p.innerHTML = "Contacts Book";
		footer.append(p);
	})();

	document.body.append(header);
	document.body.append(main);
	document.body.append(footer);

	if (this.store.contactsBook.length > 0) {
		grid.append(createGridHeading(this.store.contactsBook.length));
		this.store.contactsBook
			.map(item => {
				let card = createContactCard(item);
				return (grid.innerHTML += card.outerHTML);
			})
			.join("\n");
	} else {
		grid.append(createGridHeading());
		let card = createContactCard();
		card.classList.add("new");
		grid.append(card);
	}
}

const App = new contactsBookInit();
