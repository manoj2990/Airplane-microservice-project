
const amqplib = require('amqplib');

let channel, connection;
const { RABBITMQ_URL, QUEUE_NAME } = require("../config/envirment-variable");


const connectToQueue = async () => {
  try {

    
 
    connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME || 'booking_queue');


  } catch (error) {
    throw new Error(" connectToQueue error -->", error);
  }
}



const sendMessageToQueue = async (message) => {
  try {
    if(!channel){
      await connectToQueue();
    }
    await channel.sendToQueue(QUEUE_NAME || 'booking_queue', Buffer.from(JSON.stringify(message)));

  } catch (error) {
    throw new Error("sendMessageToQueue error -->", error);
  }
}


module.exports = {
  connectToQueue,
  sendMessageToQueue
}
