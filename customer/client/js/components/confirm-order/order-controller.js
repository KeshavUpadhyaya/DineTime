export default class orderController {
	static get $inject() {
		return ["dataService", "$location"];
	}

	constructor(dataService, $location) {
		this.dataService = dataService;
		this.$location = $location;
		if (sessionStorage.items) {
			this.items = JSON.parse(sessionStorage.items);
			console.log(this.items);
		}
	}

	getTotalCount() {
		var count = 0;
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			count += item.quantity;
		}
		return count;
	}

	addItem(name, price, quantity) {
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
}
