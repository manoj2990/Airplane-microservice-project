const CrudRepository = require("./crud.repositorie");

const {Booking,SeatBooking} = require("../models")

const {Enums} = require('../utils/common');
const {BOOKED, CANCELLED } = Enums.BookingStatus;
const ApiError = require("../utils/errors/app-error");
const StatusCodes = require('http-status-codes');
const { Op, where } = require('sequelize');
const { response } = require("express");


class BookingRepository extends CrudRepository{
    constructor() {
        super(Booking);
    }

    async createBooking(data,t){
   
        const response = await this.model.create(data,{transaction: t});
              
        if(!response){
            throw new Error("Booking not created");
        }


        return response;
    }



    async updateBookingStatus(data,t){
        // const {id, status} = data;

       
        const resp = await this.model.update({status: data.status},{
            where: {
                id: data.id
            }
        },t);

        // const booking = await this.model.findByPk(id,{transaction:t})
        // if(!booking){
        //     throw new Error("Booking not found");
        // }
        // const resp = await booking.update({status: status},{transaction: t});

     

        if(!resp){
            throw new Error("Booking not updated");
        }
        
        return resp;
    }


    // async cancelBooking(bookingId,t){
    //     try {
    //         const booking = await this.model.update({status: CANCELLED},{
    //             where: {
    //                 id: bookingId
    //             }
    //         },{transaction: t});
    //         if(!booking){
    //             throw new Error("Booking not found");
    //         }

    //     return booking;

    //     } catch (error) {
    //         throw new Error("Booking not cancelled");
    //     }
                
    // }

    async cancelOldBookings(time){
        const resp = await this.model.update({status:CANCELLED},{

            where:{
                [Op.and]: [
                        {
                        createdAt: {
                            [Op.lt]: time
                        }
                    }, 
                    {
                        status: {
                            [Op.ne]: BOOKED
                        }
                    },
                    {
                        status: {
                            [Op.ne]: CANCELLED
                        }
                    }
                ]
            }
        })


        if(!resp){
            throw new Error("Booking not cancelled");
        }

        return resp;
    }


    async getbookingDetails(bookingId, t){
   
         const resp = await Booking.findByPk(bookingId,{transaction: t});


        if(!resp) {
            throw new ApiError('Not able to fund the resource', StatusCodes.INTERNAL_SERVER_ERROR);
        }
       
   
        return resp.dataValues;
    }


    async getsetMap(flightId){

        const response = await SeatBooking.findAll({
            where:{
                flightId:flightId
            },
            include:[{
                as:'booking',
                model: Booking,
                attributes: ['id','status',],
            }]
        })

        return response;
    }


}

module.exports =  BookingRepository;