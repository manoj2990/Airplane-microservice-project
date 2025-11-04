const { getIO } = require("../config/socket");
const {RedisServer} = require("../config");



// async function seat_lock(flightId,seatIds) {
//     const io = getIO();

// console.log("seatIds  ############", seatIds)

//   // const res=  await Promise.all( seatIds.map(async (seatId) => {
//   //     await RedisServer.set(`flight-${flightId}-manoj`,  JSON.stringify({ bookedSeats:[], frozenSeats:[seatId]}) );
//   //   }));


//   const existingData = await RedisServer.get(`flight-${flightId}-manoj`);
//   let parsedData = existingData ? JSON.parse(existingData) : { bookedSeats: [], frozenSeats: [] };
  
//     for (const seatId of seatIds) {
//       // Add new frozen seat
//       if (!parsedData.frozenSeats.includes(seatId)) {
//         parsedData.frozenSeats.push(seatId);
//       }
    
//     }
//     // Save back
//     await RedisServer.set(`flight-${flightId}-manoj`, JSON.stringify(parsedData));
    


//     // await RedisServer.set(`flight-${flightId}-manoj`, seatIds);

//     console.log("res ############", res)

//   io.emit("seat-locked", {flightId,seatIds});
// }

// freezeSeats.js


// {
//   "bookedSeats": ["1A", "1B"],
//   "frozenSeats": [
//     { "seatId": "2A", "userId": "U123", "frozenAt": 1730389999932 },
//     { "seatId": "2B", "userId": "U124", "frozenAt": 1730390000000 }
//   ]
// }




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
      console.log("settime out is trigger------------------------->")
      await unlockSeat(flightId, seatId);

      io.emit('seat_unlock', [seatId])
    },  10000);


  }

  await RedisServer.set(key, JSON.stringify(data));
  console.log(`Frozen seats: ${seatIds.join(", ")} for flight ${flightId}`);

  io.emit('seat_lock', seatIds)
}





async function unlockSeat(flightId, seatId) {
  const key = `flight-${flightId}-status`;
  const existing = await RedisServer.get(key);
  if (!existing) return;

  const data = JSON.parse(existing);
  data.frozenSeats = data.frozenSeats.filter(s => s.seatId !== seatId);

  await RedisServer.set(key, JSON.stringify(data));
  console.log(`Seat ${seatId} unlocked for flight ${flightId}`);
}




async function seat_Booked(flightId, seatIds, userId) {
  console.log("poresent at seat_booked------------------------->")
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
  console.log(`Booked seats: ${seatIds.join(", ")} for flight ${flightId}`);

  io.emit('seat_Booked', data.bookedSeats)
}


module.exports = { seat_lock, seat_Booked };
