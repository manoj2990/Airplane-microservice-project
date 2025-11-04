import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {searchFlight} from "../../service/operation/searchApi"
import {extractCode} from "../../utils/ExtractAirportcode"
import { useNavigate } from "react-router-dom";


// Separate Airport Selection Modal Component
const AirportSelectionModal = ({ isOpen, onClose, onSelect, title, modalType }) => {
  const airports = [
    { city: "Jaipur", code: "JAI" },
    { city: "Mumbai", code: "BOM" },
    { city: "Chennai", code: "MAA" },
    { city: "Bangalore", code: "BLR" },
    { city: "Kolkata", code: "CCU" },
    { city: "Hyderabad", code: "HYD" },
  ];

  if (!isOpen) return null;

  return (
    <div className={`fixed bg-opacity-50 flex justify-center items-center z-50 top-[170px] ${modalType === "departure" ? "left-20" : "left-100"}`}>
      <div className="bg-white w-96 rounded-xl shadow-2xl p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition"
          >
            ✕
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {airports && Array.isArray(airports) && airports.length > 0 ? (
            airports.map((airport) => {
              if (!airport || !airport.code) {
                return null;
              }
              return (
                <div
                  key={airport.code}
                  onClick={() => onSelect && onSelect(airport)}
                  className="p-3 hover:bg-teal-50 rounded-lg cursor-pointer transition border-b border-gray-100 last:border-0"
                >
                  <p className="font-semibold text-gray-800">{airport.city || "Unknown"}</p>
                  <p className="text-sm text-gray-500">{airport.code || "N/A"}</p>
                </div>
              );
            })
          ) : (
            <p className="p-3 text-gray-500 text-center">No airports available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const FlightSearchForm = () =>{
  
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departure: "12-8-2024",
    quantity: "1",
    classType: "Economy",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDepartureModal, setShowDepartureModal] = useState(false);
  const [showArrivalModal, setShowArrivalModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
   
    try {
      // Validate form data
      if (!formData.from || !formData.to) {
        toast.error("Please select both departure and arrival airports");
        return;
      }

      // if (!formData.departure) {
      //   toast.error("Please select a departure date");
      //   return;
      // }

      // Validate date is not in the past
      // const selectedDate = new Date(formData.departure);
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);
      
      // if (selectedDate < today) {
      //   toast.error("Departure date cannot be in the past");
      //   return;
      // }

      // Validate quantity
      const quantity = parseInt(formData.quantity, 10);
      if (isNaN(quantity) || quantity < 1 || quantity > 5) {
        toast.error("Number of travelers must be between 1 and 5");
        return;
      }

      const departureAirportId = extractCode(formData.from);
      const arrivalAirportId = extractCode(formData.to);

      // Validate airport codes were extracted successfully
      if (!departureAirportId || !arrivalAirportId) {
        toast.error("Invalid airport selection. Please try again.");
        return;
      }

      // Ensure airports are different
      if (departureAirportId === arrivalAirportId) {
        toast.error("Departure and arrival airports must be different");
        return;
      }

      dispatch(searchFlight(
        `${departureAirportId}-${arrivalAirportId}`,
        formData.departure,
        formData.quantity,
        formData.classType,
        navigate
      ));
    } catch (error) {
      console.error("handleSubmit error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSelectDeparture = (airport) => {
    try {
      if (!airport || !airport.city || !airport.code) {
        console.error("Invalid airport data:", airport);
        toast.error("Invalid airport selection");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        from: `${airport.city} (${airport.code})`,
      }));
      setShowDepartureModal(false);
    } catch (error) {
      console.error("handleSelectDeparture error:", error);
      toast.error("An error occurred while selecting airport");
    }
  };

  const handleSelectArrival = (airport) => {
    try {
      if (!airport || !airport.city || !airport.code) {
        console.error("Invalid airport data:", airport);
        toast.error("Invalid airport selection");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        to: `${airport.city} (${airport.code})`,
      }));
      setShowArrivalModal(false);
    } catch (error) {
      console.error("handleSelectArrival error:", error);
      toast.error("An error occurred while selecting airport");
    }
  };

  const showDeparture = ()=>{
     setShowDepartureModal(true)
      setShowArrivalModal(false)
  }

   const showArrival = ()=>{
     setShowDepartureModal(false)
      setShowArrivalModal(true)
  }
  return (
    <div className="relative w-full">
      {/* Flight Search Form */}
      <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 w-[90%] bg-white shadow-lg rounded-xl flex flex-wrap md:flex-nowrap justify-between items-center px-8 py-8 gap-6">
        {/* From */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">From</label>
          <input
            readOnly
            name="from"
            value={formData.from}
            onClick={ showDeparture}
            placeholder="Select departure airport"
            className="cursor-pointer font-semibold border-b focus:outline-none focus:border-[#009688] transition"
          />
        </div>

        {/* To */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">To</label>
          <input
            readOnly
            name="to"
            value={formData.to}
            onClick={showArrival}
            placeholder="Select arrival airport"
            className="cursor-pointer font-semibold border-b focus:outline-none focus:border-[#009688] transition"
          />
        </div>

        {/* Departure */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Departure</label>
          <input
            type="date"
            name="departure"
            value={formData.departure}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, departure: e.target.value }))
            }
            className="font-semibold border-b focus:outline-none focus:border-[#009688] transition"
          />
        </div>

        {/* Travelers */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Travelers</label>
          <input
            type="number"
            name="quantity"
            min="1"
            max="5"
            value={formData.quantity}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, quantity: e.target.value }))
            }
            placeholder="1"
            className="font-semibold border-b focus:outline-none focus:border-[#009688] transition"
          />
        </div>

        {/* Class Type */}
        <div>
          <label className="text-sm text-gray-500 mt-2">Class Type</label>
          <div className="flex gap-4 mt-1">
            {["Economy"].map((type) => (
              <label key={type} className="flex items-center gap-1 text-sm text-gray-700">
                <input
                  type="radio"
                  name="classType"
                  value={type}
                  checked={formData.classType === type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      classType: e.target.value,
                    }))
                  }
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-[#009688] text-white p-3 rounded-full hover:bg-[#00796b] transition px-10"
        >
         <FaArrowRight />
        </button>
      </div>

      {/* Departure Airport Modal */}
      <AirportSelectionModal
        isOpen={showDepartureModal}
        onClose={() => setShowDepartureModal(false)}
        onSelect={handleSelectDeparture}
        title="Select Departure Airport"
       modalType="departure"
      />

      {/* Arrival Airport Modal */}
      <AirportSelectionModal
        isOpen={showArrivalModal}
        onClose={() => setShowArrivalModal(false)}
        onSelect={handleSelectArrival}
        title="Select Arrival Airport"
         modalType="arrival"
      />
    </div>
  );
}