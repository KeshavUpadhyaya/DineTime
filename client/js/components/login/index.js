import loginTemplate from "./login.html";

export const loginComponent = {
	template: loginTemplate,
	controller: class demoController {
		constructor() {
			this.controllerName = "hi";
		}
	}
};
