import angular from "angular";
import ngRoute from "angular-route";
import ngResource from "angular-resource";
import uiBootstrap from "ui-bootstrap4";
import jkAngularRatingStars from "angular-jk-rating-stars";
import angularAnimate from "angular-animate";
import angularAria from "angular-aria";
import angularMaterial from "angular-material";

import { loginComponent } from "./components/login";
import { signupComponent } from "./components/signup";
import { logoutComponent } from "./components/logout";
import { dineTakeComponent } from "./components/dine-or-take";
import { seatingComponent } from "./components/seating";
import { menuComponent } from "./components/menu";
import { orderComponent } from "./components/confirm-order";
import { ratingComponent } from "./components/rating";

import authService from "./services/autentication-service";
import dataService from "./services/data-service";

angular
	.module("dineTime", [
		ngRoute,
		ngResource,
		uiBootstrap,
		jkAngularRatingStars,
		angularAnimate,
		angularAria,
		angularMaterial
	])

	.component("loginComponent", loginComponent)
	.component("signupComponent", signupComponent)
	.component("logoutComponent", logoutComponent)
	.component("dineTakeComponent", dineTakeComponent)
	.component("seatingComponent", seatingComponent)
	.component("menuComponent", menuComponent)
	.component("orderComponent", orderComponent)
	.component("ratingComponent", ratingComponent)

	.service("authService", authService)
	.service("dataService", dataService)

	.config(function($routeProvider, $locationProvider) {
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
				template: "<seating-component></seating-component>",
				access: { restricted: true }
			})

			.when("/menu", {
				template: "<menu-component></menu-component>",
				access: { restricted: true }
			})

			.when("/confirm-order", {
				template: "<order-component></order-component>",
				access: { restricted: true }
			})

			.when("/rating", {
				template: "<rating-component></rating-component>",
				access: { restricted: true }
			});

		$locationProvider.html5Mode(true);
	})

	.run(function($rootScope, $location, $route, authService) {
		$rootScope.$on("$routeChangeStart", function(event, next, current) {
			if (next.access.restricted && !authService.isLoggedIn()) {
				$location.path("/");
				//$route.reload();
			}
		});
	});
