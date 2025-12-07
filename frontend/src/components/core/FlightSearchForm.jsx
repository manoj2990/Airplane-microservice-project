import { useState, useRef, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { searchFlight } from "../../service/operation/searchApi";
import { extractCode } from "../../utils/ExtractAirportcode";
import { useNavigate } from "react-router-dom";


// Separate Airport Selection Modal Component
const AirportSelectionModal = ({ isOpen, onClose, onSelect, title, modalType }) => {
  const modalRef = useRef(null);
  
  const airports = [
    { city: "Jaipur", code: "JAI" },
    { city: "Mumbai", code: "BOM" },
    { city: "Chennai", code: "MAA" },
    { city: "Bangalore", code: "BLR" },
    { city: "Kolkata", code: "CCU" },
    { city: "Hyderabad", code: "HYD" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
        ref={modalRef}
        className="absolute bottom-full mb-2 left-0 mt-2 z-50 w-full min-w-[300px] bg-white shadow-xl border border-gray-200 rounded-2xl animate-fade-in p-4 origin-top"
    >
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          ✕
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto custom-scrollbar">
        {airports && Array.isArray(airports) && airports.length > 0 ? (
          airports.map((airport) => {
            if (!airport || !airport.code) {
              return null;
            }
            return (
              <div
                key={airport.code}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect && onSelect(airport);
                }}
                className="group flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors mb-1"
              >
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{airport.city || "Unknown"}</span>
                    <span className="text-xs text-gray-400">{airport.country || "India"}</span>
                </div>
                <span className="px-2 py-1 bg-gray-100 group-hover:bg-blue-100 text-gray-600 group-hover:text-blue-600 text-xs font-bold rounded-lg transition-colors">
                    {airport.code || "N/A"}
                </span>
              </div>
            );
          })
        ) : (
          <p className="p-3 text-gray-500 text-center text-sm">No airports available</p>
        )}
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

  const showDeparture = (e)=>{
     e.stopPropagation();
     setShowDepartureModal(true)
     setShowArrivalModal(false)
  }

   const showArrival = (e)=>{
     e.stopPropagation();
     setShowDepartureModal(false)
     setShowArrivalModal(true)
  }
  return (
    <div className="w-full">

      {/* Flight Search Form */}
      <div className="glass-panel mx-auto flex w-full max-w-6xl flex-col gap-8 px-8 py-6 md:flex-row md:items-end md:justify-between  relative z-20 top-5 bg-white/40   shadow-xl rounded-3xl">
        
        {/* Input Groups Container */}
        <div className="flex flex-1 flex-col md:flex-row gap-6 md:gap-8 w-full ">
          
          {/* From */}
          <div className="flex flex-1 flex-col relative">
            {/* Departure Airport Modal - Now Relative */}
            <AirportSelectionModal
                isOpen={showDepartureModal}
                onClose={() => setShowDepartureModal(false)}
                onSelect={handleSelectDeparture}
                title="Select Departure"
                modalType="departure"
            />
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 ml-1">From</label>
            <input
              readOnly
              name="from"
              value={formData.from}
              onClick={showDeparture}
              placeholder="Origin city"
              className="w-full bg-white/80   rounded-xl px-4 py-3.5 text-lg font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 "
            />
            
          </div>

          {/* To */}
          <div className="flex flex-1 flex-col relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 ml-1">To</label>
            <input
              readOnly
              name="to"
              value={formData.to}
              onClick={showArrival}
              placeholder="Destination city"
              className="w-full bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3.5 text-lg font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all hover:bg-white"
            />
            {/* Arrival Airport Modal - Now Relative */}
            <AirportSelectionModal
                isOpen={showArrivalModal}
                onClose={() => setShowArrivalModal(false)}
                onSelect={handleSelectArrival}
                title="Select Destination"
                modalType="arrival"
            />
          </div>

          {/* Departure */}
          <div className=" flex flex-col w-full md:w-48 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 ml-1">Departure</label>
            <input
              type="date"
              name="departure"
              value={formData.departure}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, departure: e.target.value }))
              }
              className="w-full bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3.5 text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all hover:bg-white"
            />
          </div>

          {/* Travelers */}
          <div className=" flex flex-col w-full md:w-32 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 ml-1">Travelers</label>
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
              className="w-full bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3.5 text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all hover:bg-white"
            />
          </div>
        </div>

        {/* Actions Container */}
        <div className="flex flex-col md:flex-row items-center gap-6">
           {/* Class Type */}
           <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 ml-1">Class</label>
            <div className="flex gap-2">
              {['Economy'].map((type) => (
                <label key={type} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/60 shadow-sm cursor-pointer hover:bg-white transition-all text-sm font-semibold text-slate-700">
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
                    className="accent-blue-600 w-4 h-4"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 active:scale-95 transition-all mt-4 md:mt-0"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}