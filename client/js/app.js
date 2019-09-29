import angular from "angular";
import ngRoute from "angular-route";
import ngResource from "angular-resource";

import { loginComponent } from "./components/login";
import { signupComponent } from "./components/signup";
import { logoutComponent } from "./components/logout";

import authService from "./services/autentication-service";

angular
	.module("dineTime", [ngRoute, ngResource])

	.component("loginComponent", loginComponent)
	.component("signupComponent", signupComponent)
	.component("logoutComponent", logoutComponent)

	.service("authService", authService)

	.config(function($routeProvider) {
		$routeProvider

			.when("/", {
				template: "<login-component></login-component>",
				access: { restricted: false }
			})

			.when("/signup", {
				template: "<signup-component></signup-component>",
				access: { restricted: false }
			})

			.when("/welcome", {
				template: "<p> Hi you have successfully logged in!</p>",
				access: { restricted: true }
			});
	})

	.run(function($rootScope, $location, $route, authService) {
		$rootScope.$on("$routeChangeStart", function(event, next, current) {
			if (next.access.restricted && !authService.isLoggedIn()) {
				$location.path("/");
				$route.reload();
			}
		});
	});
