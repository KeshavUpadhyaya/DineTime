export default class dataService {
	static get $inject() {
		return ["$http", "dataService"];
	}

	constructor($http, dataService) {
		this.ip = "http://localhost:8000";
		this.$http = $http;
		this.dataService = dataService;
	}

	getData() {}
}
