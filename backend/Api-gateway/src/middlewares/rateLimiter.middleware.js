const { RedisServer } = require("../config");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");


const WINDOW_SIZE_IN_HOURS = 2;
const MAX_WINDOW_REQUEST_COUNT = 5;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

const rateLimiter = async (req,res,next)=>{
   
    try {
            
const ip = req.ip
const key = `rate-limit:${ip}`
 const currentTime = Math.floor(Date.now() / 1000);


 //find the exsiting record for ip
 const existing_record = await RedisServer.get(key);

 if(!existing_record){
    const new_record =[ {
        starting_timestamp: currentTime,
        request_count: 1,
    }]

    await RedisServer.set(key, JSON.stringify(new_record));
    await RedisServer.expire(key, WINDOW_SIZE_IN_HOURS * 60);

    
    return next();
 }



 //parse the existing record
 let Data = JSON.parse(existing_record);

 //current time ke respepective window start time eg: 10:30 then 
 let window_start = currentTime - (WINDOW_SIZE_IN_HOURS * 60 );

 //now we have the only record that is under the current window
 Data = Data.filter( (record)=>(record.starting_timestamp >= window_start))

 //iss window mai total req's
 let total_req_count = Data.reduce( (acc,record)=> acc + record.request_count, 0);

 //agar total req's zyada hai toh block the user ip
 if(total_req_count >= MAX_WINDOW_REQUEST_COUNT){
   throw new AppError("Too Many requests, please try again later", StatusCodes.TOO_MANY_REQUESTS);
 }



 //agat total req limit ke under hai so update the req_cout
 const last_Entry = Data[Data.length - 1];
 const Internal_start = currentTime - WINDOW_LOG_INTERVAL_IN_HOURS * 60 ;

if(last_Entry && last_Entry.starting_timestamp >= Internal_start){
    last_Entry.request_count++;
}
else{
    Data.push({
        starting_timestamp: currentTime,
        request_count: 1,
    })
}

await RedisServer.set(key, JSON.stringify(Data));
await RedisServer.expire(key, WINDOW_SIZE_IN_HOURS * 60);

return next();
   
 }
 catch (error) {
   if (error instanceof AppError) {
    ErrorResponse.message = error.message;
    ErrorResponse.error = error

    return res
    .status(StatusCodes.TOO_MANY_REQUESTS)
    .json(ErrorResponse)
   }

   throw new AppError("Something went wrong while rate limiting", StatusCodes.INTERNAL_SERVER_ERROR);

 }
}


module.exports = rateLimiter;
