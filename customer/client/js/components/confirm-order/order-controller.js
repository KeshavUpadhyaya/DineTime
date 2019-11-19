export default class orderController {
	static get $inject() {
		return ["dataService", "$location", "$window", "$timeout"];
	}

	constructor(dataService, $location, $window, $timeout) {
		this.dataService = dataService;
		this.$location = $location;
		this.$window = $window;
		this.$timeout = $timeout;
		this.getPaymentMethods();
		this.items = [];
		if (sessionStorage.items) {
			this.items = JSON.parse(sessionStorage.items);
			console.log(this.items);
		}

		this.mode = null;
		this.showPayment = false;
	}

	getTotalCount() {
		var count = 0;
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			count += item.quantity;
		}
		return count;
	}

	addItem(name, price, quantity, take_away_charges) {
		console.log("quantity = ", quantity);
		var found = false;
		for (var i = 0; i < this.items.length && !found; i++) {
			var item = this.items[i];
			if (item.name == name) {
				found = true;
				item.quantity += quantity;
				if (item.quantity <= 0 || item.quantity == null) {
					this.items.splice(i, 1);
				}
			}
		}

		if (!found) {
			var item = {};
			item["name"] = name;
			item["quantity"] = quantity;
			item["price"] = price;
			item["take_away_charges"] = take_away_charges;
			this.items.push(item);
			//console.log(this.items);
		}

		sessionStorage.items = JSON.stringify(this.items);
		console.log(sessionStorage.items);
	}

	getTotalPrice() {
		var total = 0;
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];

			total += item.quantity * item.price;
		}
		return total;
	}

	getTotalTakeAwayCharges() {
		var total = 0;
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];

			total += item.quantity * item.take_away_charges;
		}
		return total;
	}

	confirmOrder() {
		const ctrl = this;
		const orderId = Date.now();
		sessionStorage.orderId = orderId;
		const customerId = sessionStorage.username;
		const takeAway = parseInt(sessionStorage.takeAway);
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, "0");
		var month = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
		var yyyy = today.getFullYear();
		var ss = String(today.getSeconds()).padStart(2, "0");
		var hh = String(today.getHours()).padStart(2, "0");
		var mm = String(today.getMinutes()).padStart(2, "0");

		const timeIn =
			yyyy +
			"-" +
			month +
			"-" +
			dd +
			" " +
			hh +
			":" +
			mm +
			":" +
			ss +
			"." +
			"000";
		console.log(timeIn);

		this.dataService
			.sendOrder(orderId, customerId, takeAway, timeIn, this.items)
			.then(
				function(response) {
					if (response.data.status == 1) {
						ctrl.$window.alert("Order placed successfully!");
						ctrl.showPayment = true;
					}
				},
				function() {
					ctrl.$window.alert("Please retry!");
				}
			);
	}

	getPaymentMethods() {
		const ctrl = this;
		this.dataService.getPaymentMethods().then(function(response) {
			ctrl.paymentMethods = response.data.payment_modes;
			console.log(ctrl.paymentMethods);
			console.log(ctrl.mode);
		});
	}

	confirmPayment() {
		const ctrl = this;
		const orderId = sessionStorage.orderId;
		this.dataService.approvePayment(orderId).then(function(response) {
			if (response.data.approval == 1) {
				ctrl.$window.alert("Payment approved!");
				ctrl.$location.path("/rating");
			} else {
				ctrl.$timeout(function() {
					ctrl.confirmPayment();
				}, 1500);
			}
		});
	}
}
