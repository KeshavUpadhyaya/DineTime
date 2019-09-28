import angular from "angular";
import ngRoute from "angular-route";
import ngResource from "angular-resource";

import { loginComponent } from "./components/login";
import { signupComponent } from "./components/signup";

import authService from "./services/autentication-service";

angular
	.module("dineTime", [ngRoute, ngResource])

	.component("loginComponent", loginComponent)
	.component("signupComponent", signupComponent)

	.service("authService", authService)

	.config(function($routeProvider) {
		$routeProvider

			.when("/", {
				template: "<login-component></login-component>"
			})

			.when("/signup", {
				template: "<signup-component></signup-component>"
			});
	});
