export default class dineTakeController {
	static get $inject() {
		return ["$location"];
	}

	constructor($location) {
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
