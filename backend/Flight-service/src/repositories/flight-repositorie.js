const CrudRepository = require("./crud-repositorie");
const {Flight,Airplane,Airport, sequelize,City} = require('../models')
const {Op} = require("sequelize");
const db = require('../models')

const {rowLockQueryonFlights} = require('./query');
const {Seat} = require("../models/");
const { Where } = require("sequelize/lib/utils");


class FlightRepository extends CrudRepository{
    constructor(){
        super(Flight)
    }


    async getFlight(flightId){

         const flightRep = await Flight.findByPk(flightId,{
            include: [
                {
                    model: Airplane,
                    required: true,
                    as: 'airplaneDetails',
                    attributes: ['id', 'modelNumber', 'capacity']
                },
                {
                    model:Airport,
                    required: true,
                    as: 'departureAirport', //now Airport is recognized as DepartureAirport
                    on:{
                        col1:sequelize.where(sequelize.col('Flight.departureAirportId'),"=",sequelize.col('departureAirport.code'),),
                      
                    },
                    attributes: ['id', 'code', 'name', 'address', 'cityId'],
                    // include:[
                    //     {
                    //         model:City,
                    //         required: true,
                    //         as:'cityDetails',
                    //         on:{
                    //             col1:sequelize.where(sequelize.col('departureAirport.cityId'),"=",sequelize.col('`departureAirport->cityDetails.id`'),),
                    //         }
                    //     }
                    // ]
                },
                {
                    model:Airport,
                    required: true,
                    as: 'arrivalAirport',
                    on:{
                        col1:sequelize.where(sequelize.col('Flight.arrivalAirportId'),"=",sequelize.col('arrivalAirport.code'),),
                    },
                     attributes: ['id', 'code', 'name', 'address', 'cityId'],
                    //  include:[
                    //     {
                    //         model:City,
                    //         required: true,
                    //         as:'cityDetails',
                    //         on:{
                    //             col1:sequelize.where(sequelize.col('arrivalAirport.cityId'),"=",sequelize.col('`arrivalAirport->cityDetails.id`'),),
                    //         }
                    //     }
                    // ]
                },
            ],
            
        })

        if(!flightRep){
            throw new ApiError("Flight not found", StatusCodes.NOT_FOUND);
        }

        
        return flightRep.dataValues;

    }


    async getFilterFlights(filter,sortingFliter){
        console.log("filter --->",filter)
        console.log("sortingFliter --->",sortingFliter)

        
        const response = await Flight.findAll({
            where: filter, // filter is an obj
            order: sortingFliter,
            include: [
                {
                    model: Airplane,
                    required: true,
                    as: 'airplaneDetails'
                    // attributes: ['id', 'modelNumber', 'capacity'],
                },
                {
                    model:Airport,
                    required: true,
                    as: 'departureAirport', //now Airport is recognized as DepartureAirport
                    on:{
                        col1:sequelize.where(sequelize.col('Flight.departureAirportId'),"=",sequelize.col('departureAirport.code'),),
                      
                    },
                    include:[
                        {
                            model:City,
                            required: true,
                            as:'cityDetails',
                            on:{
                                col1:sequelize.where(sequelize.col('departureAirport.cityId'),"=",sequelize.col('`departureAirport->cityDetails.id`'),),
                            }
                        }
                    ]
                },
                {
                    model:Airport,
                    required: true,
                    as: 'arrivalAirport',
                    on:{
                        col1:sequelize.where(sequelize.col('Flight.arrivalAirportId'),"=",sequelize.col('arrivalAirport.code'),),
                    },
                     include:[
                        {
                            model:City,
                            required: true,
                            as:'cityDetails',
                            on:{
                                col1:sequelize.where(sequelize.col('departureAirport.cityId'),"=",sequelize.col('`arrivalAirport->cityDetails.id`'),),
                            }
                        }
                    ]
                },
            ],
            
        })
      
        return response;
    }


    async updateSeats(flightId,seats, decrement = true){

        try {

         const res = await  db.sequelize.transaction( async t=>{

             const lockQuery = rowLockQueryonFlights(flightId);
            await db.sequelize.query(lockQuery);
    
              const FlightData = await Flight.findByPk(flightId,{transaction:t});
              
            if(decrement === true){
               FlightData.decrement("totalSeats",{  
                    by:seats
                },{transaction:t})
              
                
            }else{
               await FlightData.increment("totalSeats",{
                    by:seats,
                },{transaction:t})          
            }
            await FlightData.reload();
            return FlightData;
            })
           
            return res;
            
        } catch (error) {
            throw new ApiError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }

     
    }


    async getcompleteFlightDetail(flightId,seatIds){
        const flightRep = await Flight.findByPk(flightId,{
            include: [
                {
                    model: Airplane,
                    required: true,
                    as: 'airplaneDetails',
                    attributes: ['id', 'modelNumber', 'capacity']
                },
                {
                    model:Airport,
                    required: true,
                    as: 'departureAirport', //now Airport is recognized as DepartureAirport
                    on:{
                        col1:sequelize.where(sequelize.col('Flight.departureAirportId'),"=",sequelize.col('departureAirport.code'),),
                      
                    },
                    attributes: ['id', 'code', 'name', 'address', 'cityId'],
                    // include:[
                    //     {
                    //         model:City,
                    //         required: true,
                    //         as:'cityDetails',
                    //         on:{
                    //             col1:sequelize.where(sequelize.col('departureAirport.cityId'),"=",sequelize.col('`departureAirport->cityDetails.id`'),),
                    //         }
                    //     }
                    // ]
                },
                {
                    model:Airport,
                    required: true,
                    as: 'arrivalAirport',
                    on:{
                        col1:sequelize.where(sequelize.col('Flight.arrivalAirportId'),"=",sequelize.col('arrivalAirport.code'),),
                    },
                     attributes: ['id', 'code', 'name', 'address', 'cityId'],
                    //  include:[
                    //     {
                    //         model:City,
                    //         required: true,
                    //         as:'cityDetails',
                    //         on:{
                    //             col1:sequelize.where(sequelize.col('arrivalAirport.cityId'),"=",sequelize.col('`arrivalAirport->cityDetails.id`'),),
                    //         }
                    //     }
                    // ]
                },
            ],
            
        })
if(!flightRep){
    throw new ApiError("Flight not found", StatusCodes.NOT_FOUND);
}

const seatrep = await Seat.findAll({
    where:{
        id:{
            [Op.in]:seatIds
        }
    }
})
if(!seatrep){
    throw new ApiError("Seats not found", StatusCodes.NOT_FOUND);
}
    
        return {...flightRep.dataValues,seats:seatrep.map(seat=>seat.dataValues)}
    }


  async getSeatId(seatno) {


  const seats = await Seat.findAll({
    where: {
      [Op.or]: seatno.map(({ row, column }) => ({
        [Op.and]: [{ row }, { column }]
      }))
    },
    raw: true
  });

  
  return seats;
}

 
}

module.exports = FlightRepository;
