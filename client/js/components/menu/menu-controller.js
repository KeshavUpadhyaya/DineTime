export default class menuController {
	static get $inject() {
		return ["dataService", "$location"];
	}

	constructor(dataService, $location) {
		this.dataService = dataService;
		this.$location = $location;
		console.log("inside menu constructor");
		this.getMenuItems();
	}

	format_image_name(str) {
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
			ctrl.categories = Object.keys(response.data);
			console.log(ctrl.categories);
		});
	}
}
