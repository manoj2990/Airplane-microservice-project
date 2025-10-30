import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
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
    <div className={`fixed bg-opacity-50 flex justify-center items-center z-50 top-[170px] ${modalType === "departure" ? "left-100" : "left-100"}`}>
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
          {airports.map((airport) => (
            <div
              key={airport.code}
              onClick={() => onSelect(airport)}
              className="p-3 hover:bg-teal-50 rounded-lg cursor-pointer transition border-b border-gray-100 last:border-0"
            >
              <p className="font-semibold text-gray-800">{airport.city}</p>
              <p className="text-sm text-gray-500">{airport.code}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Sidebar = () =>{
  
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departure: "",
    quantity: "1",
    classType: "Economy",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDepartureModal, setShowDepartureModal] = useState(false);
  const [showArrivalModal, setShowArrivalModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search data:", formData);

   
    
    const departureAirportId = extractCode(formData.from)
    const arrivalAirportId = extractCode(formData.to)

      dispatch(searchFlight(
      `${departureAirportId}-${arrivalAirportId}`,
      formData.departure,
      formData.quantity,
      formData.classType,
      navigate
    ));

  };

  const handleSelectDeparture = (airport) => {
    setFormData((prev) => ({
      ...prev,
      from: `${airport.city} (${airport.code})`,
    }));
    setShowDepartureModal(false);
  };

  const handleSelectArrival = (airport) => {
    setFormData((prev) => ({
      ...prev,
      to: `${airport.city} (${airport.code})`,
    }));
    setShowArrivalModal(false);
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
    <div className="relative w-1/3">
      {/* Flight Search Form */}
      <div className="  mx-auto   w-[90%] flex flex-col flex-wrap md:flex-nowrap  px-8 py-8 gap-6">
        {/* From */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">From</label>
          <input
            readOnly
            name="from"
            value={formData.from}
            onClick={ showDeparture}
            placeholder="Select departure airport"
            className=" bg-white h-10 cursor-pointer  border-b focus:outline-none focus:border-[#009688] transition"
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
            className="bg-white h-10 cursor-pointer  border-b focus:outline-none focus:border-[#009688] transition"
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
            className="bg-white h-10 border-b focus:outline-none focus:border-[#009688] transition"
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
            className="bg-white h-10 cursor-pointer   border-b focus:outline-none focus:border-[#009688] transition"
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
          className="bg-black text-white p-3 font-bold rounded-xl  px-10 "
        >
        Search Flight
        </button>


          
      </div>

        <div className=" w-[80%] mx-auto h-0.5 bg-gray-300"></div>

            

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