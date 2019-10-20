(function() {
	let header, main, footer;

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

		let content = createDiv(["row", "no-gutters", "items-center"]);
		content.id = "root";

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
		let a = document.createElement("a");
		a.href = "http://demichka.me";
		a.title = "Visit my website";
		a.innerHTML = "Eugenia Demicheva";
		a.setAttribute("target", "_blank");
		p.innerHTML = "Contacts Book by " + a.outerHTML;
		footer.append(p);
	})();

	document.body.append(header);
	document.body.append(main);
	document.body.append(footer);
})();
