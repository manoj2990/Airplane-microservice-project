const {Ticket} = require('../models');
const CrudRepository = require('./crud.repositorie');

class TicketRepository extends CrudRepository {
    constructor() {
       super(Ticket);
    }

    async getPendingEmails(){
       const email = await Ticket.findAll({
        where: {
            status: 'PENDING',
        }
       })

       return email;
    }
 
}

module.exports = TicketRepository; 