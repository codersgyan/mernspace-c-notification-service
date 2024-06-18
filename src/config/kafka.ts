import config from "config";
import { Consumer, EachMessagePayload, Kafka } from "kafkajs";
import { MessageBroker } from "../types/broker";
import { createNotificationTransport } from "../factories/notification-factory";
import { handleOrderHtml, handleOrderText } from "../handlers/orderHander";

export class KafkaBroker implements MessageBroker {
  private consumer: Consumer;

  constructor(clientId: string, brokers: string[]) {
    const kafka = new Kafka({ clientId, brokers });

    this.consumer = kafka.consumer({ groupId: clientId });
  }

  /**
   * Connect the consumer
   */
  async connectConsumer() {
    await this.consumer.connect();
  }

  /**
   * Disconnect the consumer
   */
  async disconnectConsumer() {
    await this.consumer.disconnect();
  }

  async consumeMessage(topics: string[], fromBeginning: boolean = false) {
    await this.consumer.subscribe({ topics, fromBeginning });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        // Logic to handle incoming messages.
        console.log({
          value: message.value.toString(),
          topic,
          partition,
        });

        if (topic === "order") {
          //todo: Decide whether to send notification or not. // according to event_type.
          const transport = createNotificationTransport("mail");

          const order = JSON.parse(message.value.toString());

          await transport.send({
            to: order.data.customerId.email || config.get("mail.from"),
            subject: "Order update.",
            text: handleOrderText(order),
            html: handleOrderHtml(order),
          });
        }
      },
    });
  }
}
