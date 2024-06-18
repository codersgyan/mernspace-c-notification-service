import config from "config";
import { OrderEvents, PaymentMode } from "../types";

export const handleOrderText = (order) => {
  // todo: put proper check logic
  if (
    order.event_type === OrderEvents.ORDER_CREATE &&
    order.data.PaymentMode === PaymentMode.CASH
  ) {
    return `Thank you for your order.\n Your order id is: ${order.data._id}`;
  }

  return "Thank you for your order.";
};

export const handleOrderHtml = (order) => {
  // todo: think about proper checks
  return `
    <h3>Thank you for your order.</h3>
    <div>Your order id is: <a href="${config.get("frontend.clientUI")}/order/${order.data._id}">${order.data._id}</a></div>
`;
};
