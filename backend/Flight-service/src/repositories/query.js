
// Row lock quary on flights table so that other transactions can't update the same flight
// This is to avoid race condition when multiple transactions are trying to update the same flight
// We are using row level lock on flights table so that other transactions can't update the same flight
// until this transaction is committed or rolled back
 function rowLockQueryonFlights(flightId){
   return   `SELECT  * FROM flights WHERE id = ${flightId} FOR UPDATE`

}


module.exports = {
    rowLockQueryonFlights
}
