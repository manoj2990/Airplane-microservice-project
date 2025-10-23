
const amqplib = require('amqplib');

let channel, connection;
const queue = 'booking_queue';
const rabbitmqUrl = 'amqp://admin:admin@localhost:5672';

const connectToQueue = async () => {
  try {
 
    connection = await amqplib.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    await channel.assertQueue(queue);

  
  } catch (error) {
    throw new Error("❌ connectToQueue error -->", error);
  }
}



const sendMessageToQueue = async (message) => {
  try {
    if(!channel){
      await connectToQueue();
    }
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

  } catch (error) {
    throw new Error("❌ sendMessageToQueue error -->", error);
  }
}


module.exports = {
  connectToQueue,
  sendMessageToQueue
}
