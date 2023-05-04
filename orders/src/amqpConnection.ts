import amqp from "amqplib";

class AmqpConnection {
  private _connection?: amqp.Connection;

  public get connection(): amqp.Connection {
    if (!this._connection) {
      throw new Error("Not connected to AMQP server");
    }
    return this._connection;
  }

  async connect(url: string, clientProvidedName?: string): Promise<void> {
    if (!this._connection) {
      if (clientProvidedName) {
        this._connection = await amqp.connect(url, {
          clientProperties: { connection_name: clientProvidedName },
        });
      } else {
        this._connection = await amqp.connect(url);
      }
      console.log("Connected to RabbitMQ");
    }
  }
}

export const amqpConnection = new AmqpConnection();
