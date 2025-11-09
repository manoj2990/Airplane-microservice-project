const { getIO } = require("../config/socket");
const {RedisServer} = require("../config");




async function seat_lock(flightId, seatIds, userId) {
  const io = getIO();

  const key = `flight-${flightId}-status`;

  // Get existing data
  const existing = await RedisServer.get(key);

  const data = existing ? JSON.parse(existing) : { bookedSeats: [], frozenSeats: [] };

  for (const seatId of seatIds) {
    // Skip already booked or frozen
    if ( data.bookedSeats.includes(seatId) || data.frozenSeats.some(s => s.seatId === seatId) ) continue;


    // Add frozen seat
    data.frozenSeats.push({ seatId, userId, frozenAt: Date.now() });

    // Start unlock timer (30s)
    setTimeout( async () => {
    
      await unlockSeat(flightId, seatId);

      io.emit('seat_unlock', [seatId])
    },  10000);


  }

  await RedisServer.set(key, JSON.stringify(data));
 

  io.emit('seat_lock', seatIds)
}





async function unlockSeat(flightId, seatId) {
  const key = `flight-${flightId}-status`;
  const existing = await RedisServer.get(key);
  if (!existing) return;

  const data = JSON.parse(existing);
  data.frozenSeats = data.frozenSeats.filter(s => s.seatId !== seatId);

  await RedisServer.set(key, JSON.stringify(data));

}




async function seat_Booked(flightId, seatIds, userId) {
 
  const io = getIO();

  const key = `flight-${flightId}-status`;

  // Get existing data
  const existing = await RedisServer.get(key);

  const data = existing ? JSON.parse(existing) : { bookedSeats: [], frozenSeats: [] };

  for (const seatId of seatIds) {

   
    if ( !data.bookedSeats.includes(seatId) ) {
       data.frozenSeats = data.frozenSeats.filter(s => s.seatId !== seatId);

       data.bookedSeats.push(seatId)
    };
  }

  await RedisServer.set(key, JSON.stringify(data));


  io.emit('seat_Booked', data.bookedSeats)
}


module.exports = { seat_lock, seat_Booked };
