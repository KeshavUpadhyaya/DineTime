export default class logoutController {
	static get $inject() {
		return ["authService", "$location"];
	}

	constructor(authService, $location) {
		this.authService = authService;
		this.$location = $location;
	}

	logout() {
		const ctrl = this;
		this.authService.logout();
		this.$location.path("/");
	}

	isLoggedIn() {
		//console.log("insides isLoggedIn");
		if (this.authService.isLoggedIn()) {
			return true;
		}
		return false;
	}
}
