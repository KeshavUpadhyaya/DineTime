export default class authService {
	static get $inject() {
		return ["$http"];
	}

	constructor($http, $q, $timeout) {
		this.$http = $http;
		this.$q = $q;
		this.$timeout = $timeout;
		this.ip = "http://localhost:8000";
	}

	register(username, password) {
		return this.$http.post(this.ip + "/api/v1/register", {
			username: username,
			password: password,
			fav_category_id: 1
		});
	}

	isLoggedIn() {
		if (sessionStorage.user == "true") {
			return true;
		} else {
			return false;
		}
	}

	login(username, password) {
		return this.$http.post(this.ip + "/api/v1/login", {
			username: username,
			password: password
		});
	}

	logout() {
		sessionStorage.removeItem("user");
		sessionStorage.removeItem("username");
	}
}
