import orderController from "./order-controller";
import orderTemplate from "./confirm-order.html";

export const orderComponent = {
	template: orderTemplate,
	controller: orderController,
	controllerAs: "$ctrl"
};
