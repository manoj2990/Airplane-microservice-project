import React from "react";
import { GiAirplaneDeparture } from "react-icons/gi";
import { FiMapPin } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";
import { getAddress, formatDate, formatTime } from "../../utils/Helperfunction";
import { useSelector, useDispatch } from "react-redux";
import { fareDetails } from "../../constant/price";
import { useNavigate } from "react-router-dom";
import { getFlightbyId } from "../../service/operation/flightApi";
import { toast } from "react-hot-toast";

export const FlightDetailsModal = ({ onClose, flights }) => {
  const { userSearch } = useSelector((state) => state.userSearch || {});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!flights) {
    return (
      <div className="fixed inset-0 bg-black/0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
          <p className="text-red-500">Flight details unavailable</p>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (!flights?.id) {
      toast.error("Invalid flight information");
      return;
    }
    dispatch(getFlightbyId(flights.id, navigate));
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-6">Flight Details</h2>

        {/* ------ FLIGHT CARD -------- */}
        <div className="bg-gray-50 p-5 rounded-lg mb-4">
          
          {/* Header */}
          <h3 className="font-medium text-base mb-6">
            {(() => {
              try {
                return `To ${getAddress(flights.arrivalAirport?.address || "")}`;
              } catch {
                return `To ${flights.arrivalAirport?.name || "Unknown"}`;
              }
            })()}
          </h3>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[52px] top-8 bottom-8 w-px bg-gray-300"></div>

            {/* Date */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12"></div>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded p-1">
                  <LuCalendarDays className="w-4 h-4 text-gray-700" />
                </div>
                <p className="text-sm text-gray-900">{formatDate(flights.departureTime)}</p>
              </div>
            </div>

            {/* Departure */}
            <div className="flex items-start gap-4 mb-5">
              <p className="font-semibold text-sm w-12 pt-0.5">{formatTime(flights.departureTime)}</p>
              <div className="flex items-start gap-2">
                <FiMapPin className="w-4 h-4 text-gray-700" />
                <p className="text-sm text-gray-900">
                  {flights.departureAirport?.name}{" "}
                  <span className="text-gray-600">({flights.departureAirport?.code})</span>
                </p>
              </div>
            </div>

            {/* Airline Info */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12"></div>
              <div className="flex items-start gap-3">
                <div className="bg-white rounded p-1">
                  <GiAirplaneDeparture className="w-4 h-4 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{flights.flightNumber}</p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">
                    {userSearch?.classType || "Economy"}
                  </p>
                </div>
              </div>
            </div>

            {/* Arrival */}
            <div className="flex items-start gap-4">
              <p className="font-semibold text-sm w-12 pt-0.5">{formatTime(flights.arrivalTime)}</p>
              <div className="flex items-start gap-2">
                <FiMapPin className="w-4 h-4 text-gray-700" />
                <p className="text-sm text-gray-900">
                  {flights.arrivalAirport?.name}{" "}
                  <span className="text-gray-600">({flights.arrivalAirport?.code})</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ------ Fare Summary ------ */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Fare Details</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-700">
              <span>{`Base Fare (${userSearch?.Travelers || 1} Traveller)`}</span>
              <span>₹{flights.price.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Taxes & Fees</span>
              <span>₹{fareDetails.taxes.toLocaleString()}</span>
            </div>

            <hr className="my-2 border-gray-200" />

            <div className="flex justify-between font-semibold text-base">
              <span>{`Total Fare (${userSearch?.Travelers || 1})`}</span>
              <span>
                ₹
                {(
                  flights.price * (userSearch?.Travelers || 1) +
                  fareDetails.taxes
                ).toLocaleString()}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              * Convenience fee will be added on payment page
            </p>
          </div>
        </div>

        {/* ------ Footer Buttons (BLUE THEME) ------ */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 border border-blue-600 text-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-50 font-medium text-sm transition">
            Share Trip
          </button>

          <button
            onClick={handleBooking}
            className=" cursor-pointer flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-medium text-sm transition"
          >
            Book now for ₹
            {(
              flights.price * (userSearch?.Travelers || 1) +
              fareDetails.taxes
            ).toLocaleString()}
          </button>
        </div>

      </div>
    </div>
  );
};
