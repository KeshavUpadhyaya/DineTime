export default class menuController {
	static get $inject() {
		return ["dataService", "$location"];
	}

	constructor(dataService, $location) {
		this.dataService = dataService;
		this.$location = $location;
		this.show = 0;
		console.log("inside menu constructor");
		this.getMenuItems();
		this.items = [];
		if (sessionStorage.items) {
			this.items = JSON.parse(sessionStorage.items);
		}
	}

	formatImageName(str) {
		//console.log("str = ", str);
		return str
			.toLowerCase()
			.trim()
			.split(" ")
			.join("_");
	}

	getMenuItems() {
		const ctrl = this;
		this.dataService.getMenuItems().then(function(response) {
			console.log(response.data);
			ctrl.data = response.data;
			ctrl.categories = Object.keys(response.data);
			console.log(ctrl.categories);
		});
	}

	addItem(name, price, quantity, take_away_charges) {
		if (sessionStorage.takeAway == "0") {
			take_away_charges = 0;
		}
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

	showConfirmOrderPage() {
		this.$location.path("/confirm-order");
	}

	getTotalCount() {
		var count = 0;
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			count += item.quantity;
		}
		return count;
	}
}
