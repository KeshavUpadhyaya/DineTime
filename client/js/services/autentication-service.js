export default class authService {
	static get $inject() {
		return ["$http"];
	}

	constructor($http, $q, $timeout) {
		this.$http = $http;
		this.$q = $q;
		this.$timeout = $timeout;

		//create user variable
		this.user = null;
	}

	register(username, password) {
		const service = this;
		return this.$http.post("http://localhost:8000/api/v1/register", {
			username: username,
			password: password,
			fav_category_id: 1
		});
	}
}
