import React from 'react';
import { GiAirplaneDeparture } from "react-icons/gi";
import { FiMapPin } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";
import { getAddress,formatDate, formatTime } from '../../utils/Helperfunction';
import { useSelector } from 'react-redux';
import {fareDetails} from "../../constant/price"
import { useNavigate } from 'react-router-dom';
import {getFlightbyId} from "../../service/operation/flightApi"
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";


export const FlightDetailsModal = ({ onClose, flights }) => {
  console.log("flightdata at modal--->", flights);
const {userSearch} = useSelector( (state) => state.userSearch)
const navigate = useNavigate();
const dispatch = useDispatch();


console.log("fareDetails--->", fareDetails.taxes);

  function handlebooking(flightId){
    console.log("flightId received:", flightId);
    console.log("flightId type:", typeof flightId);
    console.log("flightId value:", flightId);
    
    if (!flightId) {
      console.error("No flightId provided!");
      toast.error("No flight ID provided");
      return;
    }
    
    dispatch( getFlightbyId(flightId,navigate))
 
   
  }

  return (
    <div className="fixed inset-0 bg-black/0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-6">Flight Details</h2>

        {/* Flight Cards */}
        {[flights].map((flight, i) => (
          <div key={i} className="bg-gray-50 p-5 rounded-lg mb-4">
            <h3 className="font-medium text-base mb-6">{`To ${getAddress(flight.arrivalAirport.address)}`}</h3>

            {/* Flight Timeline with Vertical Line */}
            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-[52px] top-8 bottom-8 w-px bg-gray-300"></div>

              <div className="space-y-0">
                {/* Date */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12"></div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white rounded p-1 z-10">
                      <LuCalendarDays className="w-4 h-4 text-gray-700" />
                    </div>
                    <p className="text-sm text-gray-800">{formatDate(flight.departureTime)}</p>
                  </div>
                </div>

                {/* Departure */}
                <div className="flex items-start gap-4 mb-5">
                  <p className="font-semibold text-sm w-12 text-left pt-0.5">{formatTime(flight.departureTime)}</p>
                  <div className="flex items-start gap-3">
                    {/* <div className="bg-white rounded-full p-1 z-10 -ml-0.5">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div> */}
                     <FiMapPin/>
                    <p className="text-sm text-gray-900 -ml-0.5 pt-0.5">
                     
                      {flight.departureAirport.name}{" "}
                      <span className="text-gray-600">({flight.departureAirport.code})</span>
                    </p>
                  </div>
                </div>
               
                {/* Airline */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12"></div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white rounded p-0.5 z-10">
                      <GiAirplaneDeparture className="w-4 h-4 text-gray-700" />
                    </div>
                    <div className="-ml-0.5">
                      <p className="text-sm text-gray-900">{flight.flightNumber}</p>
                      <p className="text-xs text-green-600 font-medium mt-0.5">{userSearch.classType}</p>
                    </div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="flex items-start gap-4">
                  <p className="font-semibold text-sm w-12 text-left pt-0.5">{formatTime(flight.arrivalTime)}</p>
                  <div className="flex items-start gap-3">
                    {/* <div className="bg-white rounded-full p-1 z-10 -ml-0.5">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div> */}
                     <FiMapPin/>
                    <p className="text-sm text-gray-900 -ml-0.5 pt-0.5">
                      {flight.arrivalAirport.name}{" "}
                      <span className="text-gray-600">({flight.arrivalAirport.code})</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Fare Details */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Fare Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-700">
              <span>{`Base Fare (1 Traveller)`}</span>
              <span>₹{flights.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Taxes & Fees</span>
              <span>₹{fareDetails.taxes.toLocaleString()}</span>
            </div>
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between font-semibold text-base">
              <span>{`Total Fare (${userSearch.Travelers})`}</span>
              <span>₹{(flights.price*userSearch.Travelers + fareDetails.taxes).toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Convenience fee will be added on payments page
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 border border-teal-500 text-teal-600 px-4 py-2.5 rounded-lg hover:bg-teal-50 font-medium text-sm transition-colors">
            Share Trip
          </button>
          <button 
          onClick={ ()=>(handlebooking(flights.id)) }
          className="flex-1 bg-teal-500 text-white px-4 py-2.5 rounded-lg hover:bg-teal-600 font-medium text-sm transition-colors">
            Book now from ₹{(flights.price*userSearch.Travelers + fareDetails.taxes).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
};
