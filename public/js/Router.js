// Add the correct page to the DOM depending on route
function reactOnRoute() {
	const renderFunction = getRouteRenderFunction(location.pathname);
	renderFunction(location.pathname);
}

// On popstate (forward/back) + initial page load
// call reactOnRoute
window.addEventListener("popstate", reactOnRoute);
reactOnRoute();

// clicks on links...
document.body.addEventListener("click", e => {
	// links starting with / should not reload the page
	// instead we should trigger the router
	let a = e.target.closest('a[href^="/"]');
	if (a) {
		// push the href value to the window history,
		// prevent reload of page and call reactOnRoute
		navigate(a.getAttribute("href"));
		e.preventDefault();
		reactOnRoute();
	}
});

function navigate(path) {
	window.history.pushState(null, null, path);
	reactOnRoute();
}

//search route in Router.routes array, if found route which is exactly the same, returns this route
function getRouteRenderFunction(path) {
	// "/edit/3847"

	let matchingPage = App.pages.find(page => page.route === path);
	if (matchingPage) {
		return matchingPage.renderFuncton;
	}

	//Searching route, if found route which includes RegExp,
	//search first matching with route in Router.routes and returns this route
	const pagesWithRegexpRoutes = App.pages.filter(
		page => page.route instanceof RegExp
	);

	matchingPage = pagesWithRegexpRoutes.find(page => path.match(page.route));
	return matchingPage.renderFuncton;
}
