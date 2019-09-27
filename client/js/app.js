import angular from "angular";
import ngRoute from "angular-route";
import { loginComponent } from "./components/login";

angular
	.module("dineTime", [ngRoute])

	.component("loginComponent", loginComponent)

	.config(function($routeProvider) {
		$routeProvider.when("/", {
			template: "<login-component></login-component>"
		});
	});
