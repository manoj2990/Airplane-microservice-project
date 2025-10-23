const cron = require('node-cron');

const {BookingService} = require("../../services")

async function scheduleCronJob() {
 
    cron.schedule('0 * * * *', async () => {
   
     await BookingService.cancelOldBookings();
    
});
}

module.exports = scheduleCronJob;