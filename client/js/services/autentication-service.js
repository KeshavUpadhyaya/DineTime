export default class authService {
	static get $inject() {
		return ["$http"];
	}

	constructor($http, $q, $timeout) {
		this.$http = $http;
		this.$q = $q;
		this.$timeout = $timeout;

		if (!localStorage.user && !localStorage.username) {
			localStorage.user = false;
			localStorage.username = "";
		}
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
		if (localStorage.user == "true") {
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
		localStorage.removeItem("user");
		localStorage.removeItem("username");
	}
}
