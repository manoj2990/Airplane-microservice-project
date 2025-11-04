import { IoMdAirplane } from "react-icons/io";
import { FormateDuration,formatTime,formatDate } from "../../utils/Helperfunction";
import { useState } from "react";
import {FlightDetailsModal} from "../core/FlightDetailModal"


export const FlightCard = ({ flight }) => {
  // Validate flight prop
  if (!flight) {
    console.error("FlightCard: flight prop is missing or invalid");
    return (
      <div className="flex justify-between items-center mx-3 rounded-lg shadow-2xs p-6 transition-all mb-4 bg-white">
        <p className="text-red-500">Flight information unavailable</p>
      </div>
    );
  }

  const {
    flightNumber,
    departureTime,
    arrivalTime,
    departureAirport,
    arrivalAirport,
    price,
  } = flight || {};

   const [open, setOpen] = useState(false);

  // Validate required fields
  if (!departureTime || !arrivalTime || !departureAirport || !arrivalAirport) {
    console.error("FlightCard: Missing required flight data");
    return (
      <div className="flex justify-between items-center mx-3 rounded-lg shadow-2xs p-6 transition-all mb-4 bg-white">
        <p className="text-red-500">Incomplete flight information</p>
      </div>
    );
  }

  // Calculate duration with error handling
  let duration = "N/A";
  try {
    duration = FormateDuration(arrivalTime, departureTime) || "N/A";
  } catch (error) {
    console.error("Error calculating duration:", error);
  }

  return (
    <div className="flex justify-between items-center mx-3 rounded-lg shadow-2xs p-6  transition-all mb-4 bg-white">
      <div>
        <p className="text-sm text-gray-500">
          {(() => {
            try {
              return formatDate(departureTime) || "N/A";
            } catch (error) {
              console.error("Error formatting date:", error);
              return "N/A";
            }
          })()} – Departure
        </p>

        <div className="flex items-center gap-8 mt-2">
          {/* Departure */}
          <div>
            <p className="text-3xl font-semibold">
              {(() => {
                try {
                  return formatTime(departureTime) || "N/A";
                } catch (error) {
                  console.error("Error formatting departure time:", error);
                  return "N/A";
                }
              })()}
            </p>
            <p className="text-gray-600 text-sm">
              {departureAirport?.name || "Unknown"} <span className="text-gray-500">({departureAirport?.code || "N/A"})</span>
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
            <p className="text-3xl font-semibold">
              {(() => {
                try {
                  return formatTime(arrivalTime) || "N/A";
                } catch (error) {
                  console.error("Error formatting arrival time:", error);
                  return "N/A";
                }
              })()}
            </p>
            <p className="text-gray-600 text-sm">
              {arrivalAirport?.name || "Unknown"} <span className="text-gray-500">({arrivalAirport?.code || "N/A"})</span>
            </p>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-center">
        <p className="text-2xl font-semibold text-gray-800 mb-1.5">
          ₹{price !== undefined && price !== null ? price : "N/A"}
        </p>
        <button 
        onClick={() => {
          try {
            setOpen(true);
          } catch (error) {
            console.error("Error opening flight details:", error);
          }
        }}
        className="bg-[#009688] text-white p-3 font-bold rounded-xl hover:bg-[#00796b] transition px-3 ">Select this flight
        </button>

        {open && flight && <FlightDetailsModal onClose={() => setOpen(false)} flights={flight} />}
      </div>
    </div>
  );
};


