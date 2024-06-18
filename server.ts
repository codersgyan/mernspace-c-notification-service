import logger from "./src/config/logger";
import { createMessageBroker } from "./src/factories/broker-factory";
import { MessageBroker } from "./src/types/broker";

const startServer = async () => {
  let broker: MessageBroker | null = null;
  try {
    broker = createMessageBroker();
    await broker.connectConsumer();
    await broker.consumeMessage(["order"], false);
  } catch (err) {
    logger.error("Error happened: ", err.message);
    if (broker) {
      await broker.disconnectConsumer();
    }
    process.exit(1);
  }
};

void startServer();
