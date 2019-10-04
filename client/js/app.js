import angular from "angular";
import ngRoute from "angular-route";
import ngResource from "angular-resource";

import { loginComponent } from "./components/login";
import { signupComponent } from "./components/signup";
import { logoutComponent } from "./components/logout";
import { dineTakeComponent } from "./components/dine-or-take";

import authService from "./services/autentication-service";

angular
	.module("dineTime", [ngRoute, ngResource])

	.component("loginComponent", loginComponent)
	.component("signupComponent", signupComponent)
	.component("logoutComponent", logoutComponent)
	.component("dineTakeComponent", dineTakeComponent)

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

			.when("/dine-or-take", {
				template: "<dine-take-component></dine-take-component>",
				access: { restricted: true }
			})

			.when("/seating", {
				template: "<h1>seating<h1>",
				access: { restricted: true }
			})

			.when("/menu", {
				template: "<h1>menu</h1>",
				access: { restricted: true }
			})

			.when("/confirm-order", {
				template: "<h1>confrim order</h1>",
				access: { restricted: true }
			})

			.when("/bill", {
				template: "<h1>bill</h1>",
				access: { restricted: true }
			})

			.when("/rating", {
				template: "<h1>rating</h1>",
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
