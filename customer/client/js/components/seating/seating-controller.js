export default class seatingController {
	static get $inject() {
		return [
			"dataService",
			"$location",
			"$window",
			"$timeout",
			"$interval",
			"$route"
		];
	}

	constructor(dataService, $location, $window, $timeout, $interval, $route) {
		this.dataService = dataService;
		this.$location = $location;
		this.$window = $window;
		this.$timeout = $timeout;
		this.$interval = $interval;
		this.$route = $route;
		this.getTables();
		this.selection = [];
	}

	getTables() {
		const ctrl = this;
		this.dataService.getTables().then(function(response) {
			ctrl.seatingData = response.data.tables;
			console.log("Tables:", ctrl.seatingData);
			ctrl.timer = ctrl.$timeout(function() {
				ctrl.getTables();
			}, 1500);
		});
	}

	bookTable() {
		console.log(this.selection);
		const ctrl = this;
		const customerId = sessionStorage.username;
		const tableIds = this.selection;
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
		this.dataService.bookTable(customerId, tableIds, timeIn).then(
			function(response) {
				if (ctrl.allBooked(response.data.tables)) {
					ctrl.$window.alert("Booking successful!");
					ctrl.$timeout.cancel(ctrl.timer);
					ctrl.$location.path("/menu");
				} else {
					ctrl.displayBooked(response.data.tables);
				}
			},
			function() {}
		);
	}

	allBooked(tables) {
		var i = 0;
		for (i = 0; i < tables.length; i++) {
			if (tables[i].status == 0) {
				return false;
			}
		}

		return true;
	}

	toggleSelection(tableId) {
		console.log(tableId);
		var idx = this.selection.indexOf(tableId);

		if (idx > -1) {
			this.selection.splice(idx, 1);
		} else {
			this.selection.push(tableId);
		}

		console.log(this.selection);
	}

	noTableSelected() {
		if (this.selection.length <= 0) {
			return true;
		}
		return false;
	}

	displayBooked(tables) {
		var booked =
			"Sorry all tables could not be booked! \n Booked tables: \n";
		var i = 0;
		for (i = 0; i < tables.length; i++) {
			if (tables[i].status == 1) {
				booked += "Table " + tables[i].table_id + "\n";
			}
		}
		alert(booked);
		if (confirm("Do you want to book another table?")) {
			this.$route.reload("/seating");
		} else {
			this.$timeout.cancel(this.timer);
			this.$location.path("/menu");
		}
	}
}
