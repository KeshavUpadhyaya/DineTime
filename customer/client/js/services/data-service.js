export default class dataService {
	static get $inject() {
		return ["$http"];
	}

	constructor($http) {
		console.log("data service constructor called");
		this.ip = "http://localhost:5000";
		this.$http = $http;
		this.order = {};
	}

	sendRating(orderId, ambienceRating, foodRating, moneyRating, feedback) {
		return this.$http.post(this.ip + "/api/v1/rate", {
			order_id: orderId,
			ambience: ambienceRating,
			food_quality: foodRating,
			value_for_money: moneyRating,
			feedback_text: feedback
		});
	}

	getMenuItems() {
		return this.$http.get(this.ip + "/api/v1/menu");
	}

	sendOrder(orderId, customerId, takeAway, timeIn, items) {
		return this.$http.post(this.ip + "/api/v1/order", {
			order_id: orderId,
			customer_id: customerId,
			take_away: takeAway,
			time_in: timeIn,
			items: items
		});
	}

	getPaymentMethods() {
		return this.$http.get(this.ip + "/api/v1/payments");
	}

	sendFavouriteItem(customerId, itemName) {
		return this.$http.post(this.ip + "/api/v1/setfav", {
			customer_id: customerId,
			item_name: itemName
		});
	}

	getFavouriteItems(customerId) {
		console.log(customerId);
		return this.$http.get(this.ip + "/api/v1/getfav/" + customerId);
	}

	removeFavoutiteItem(customerId, itemName) {
		return this.$http.post(this.ip + "/api/v1/delfav", {
			customer_id: customerId,
			item_name: itemName
		});
	}

	approvePayment(orderId) {
		return this.$http.post(this.ip + "/api/v1/payment_approval", {
			order_id: orderId
		});
	}

	bookTable(customerId, tableIds, timeIn) {
		return this.$http.post(this.ip + "/api/v1/booktable", {
			customer_id: customerId,
			table_ids: tableIds,
			time_in: timeIn
		});
	}

	getTables() {
		return this.$http.get(this.ip + "/api/v1/tables");
	}
}
