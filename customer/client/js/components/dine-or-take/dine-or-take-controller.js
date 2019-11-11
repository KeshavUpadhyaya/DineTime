export default class dineTakeController {
	static get $inject() {
		return ["$location"];
	}

	constructor($location) {
		var i = 0;
		for (i = 0; i < sessionStorage.length; i++) {
			console.log(sessionStorage.key(i));
			if (
				sessionStorage.key(i) != "user" &&
				sessionStorage.key(i) != "username"
			) {
				console.log("removed", sessionStorage.key(i));
				sessionStorage.removeItem(sessionStorage.key(i));
			}
		}
		if (sessionStorage.items) {
			sessionStorage.removeItem(items);
		}
		console.log("session storage = ", sessionStorage);
		this.$location = $location;
	}

	dineIn() {
		sessionStorage.takeAway = 0;
		this.$location.path("/seating");
	}

	takeAway() {
		sessionStorage.takeAway = 1;
		this.$location.path("/menu");
	}
}
