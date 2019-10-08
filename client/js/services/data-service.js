export default class dataService {
	static get $inject() {
		return ["$http"];
	}

	constructor($http) {
		console.log("data service constructor called");
		this.ip = "http://localhost:5000";
		this.$http = $http;
		this.order = { id: 1 };
	}

	sendRating(orderId, ambienceRating, foodRating, moneyRating) {
		return this.$http.post(this.ip + "/api/v1/rate", {
			order_id: orderId,
			ambience: ambienceRating,
			food_quality: foodRating,
			value_for_money: moneyRating
		});
	}

	getMenuItems() {
		return this.$http.get(this.ip + "/api/v1/menu");
	}
}
