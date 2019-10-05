import billController from "./bill-controller";
import billTemplate from "./bill.html";

export const billComponent = {
	controller: billController,
	template: billTemplate,
	controllerAs: "$ctrl"
};
