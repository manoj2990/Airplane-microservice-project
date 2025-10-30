import { IoMdAirplane } from "react-icons/io";
import { FormateDuration,formatTime,formatDate } from "../../utils/Helperfunction";
import { useState } from "react";
import {FlightDetailsModal} from "../core/FlightDetailModal"


export const FlightCard = ({ flight }) => {
  const {
    flightNumber,
    departureTime,
    arrivalTime,
    departureAirport,
    arrivalAirport,
    price,
  } = flight;

   const [open, setOpen] = useState(false);


  // Calculate duration
  const duration = FormateDuration(arrivalTime,departureTime);

  return (
    <div className="flex justify-between items-center mx-3 rounded-lg shadow-2xs p-6  transition-all mb-4 bg-white">
      <div>
        <p className="text-sm text-gray-500">
          {formatDate(departureTime)} – Departure
        </p>

        <div className="flex items-center gap-8 mt-2">
          {/* Departure */}
          <div>
            <p className="text-3xl font-semibold">{formatTime(departureTime)}</p>
            <p className="text-gray-600 text-sm">
              {departureAirport.name} <span className="text-gray-500">({departureAirport.code})</span>
            </p>
          </div>
        <div className="w-20 h-0.5 bg-gray-300"></div>
          {/* Plane icon + duration */}
          <div className="flex flex-col items-center text-sm text-gray-600">
          
           <IoMdAirplane className=" text-2xl font-bold text-[#009688]" />
            <p>{duration}</p>
            <p>Direct</p>
          </div>
          <div className="w-20 h-0.5 bg-gray-300"></div>
          {/* Arrival */}
          <div>
            <p className="text-3xl font-semibold">{formatTime(arrivalTime)}</p>
            <p className="text-gray-600 text-sm">
              {arrivalAirport.name} <span className="text-gray-500">({arrivalAirport.code})</span>
            </p>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-center">
        <p className="text-2xl font-semibold text-gray-800 mb-1.5">₹{price}</p>
        <button 
        onClick={() => setOpen(true)}
        className="bg-[#009688] text-white p-3 font-bold rounded-xl hover:bg-[#00796b] transition px-3 ">Select this flight
        </button>

        {open && <FlightDetailsModal onClose={() => setOpen(false)} flights={flight} />}
      </div>
    </div>
  );
};


