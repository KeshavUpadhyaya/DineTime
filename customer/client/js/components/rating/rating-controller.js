export default class ratingController {
	static get $inject() {
		return ["dataService", "$location", "$timeout"];
	}

	constructor(dataService, $location, $timeout) {
		this.dataService = dataService;
		this.ambienceRating = 0;
		this.foodRating = 0;
		this.moneyRating = 0;
		this.$location = $location;
		this.$timeout = $timeout;
	}

	rate() {
		console.log("in rate function");
		const ctrl = this;
		this.dataService
			.sendRating(
				this.dataService.order.id,
				this.ambienceRating,
				this.foodRating,
				this.moneyRating
			)
			.then(function(response) {
				if (response.data.status == 1) {
					ctrl.status = 1;
					ctrl.$timeout(function() {
						ctrl.$location.path("/dine-or-take");
					}, 500);
				}
			});
	}

	checkRating() {
		if (
			this.ambienceRating == 0 ||
			this.foodRating == 0 ||
			this.moneyRating == 0
		) {
			return true;
		}

		return false;
	}

	backToOrder() {
		for (var i = 0; i, sessionStorage.length; i++) {
			if (
				sessionStorage.key(i) != "user" ||
				sessionStorage.key(i) != "username"
			) {
				sessionStorage.removeItem(sessionStorage.key(i));
			}
		}
		this.$location.path("/dine-or-take");
	}
}
